import React, { useEffect, useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  XCircle,
  Calendar,
  Receipt,
  Zap,
} from "lucide-react";
import { API_URL } from "../../config/api";

export default function Subscription({ portalType = "industry", onBack }) {
  const [plans, setPlans] = useState([]);
  const [billing, setBilling] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [billingInterval, setBillingInterval] = useState("monthly"); // monthly | yearly
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [cancelling, setCancelling] = useState(false);

  // Helper to fetch bearer auth token
  const getAccessToken = () => {
    return localStorage.getItem("skillbridge_auth_token") || "";
  };

  async function api(path, options = {}) {
    const token = getAccessToken();
    const url = path.startsWith("http") ? path : `${API_URL}${path.startsWith("/api") ? path.replace("/api", "") : path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      let detail = "Request failed. Please try again.";
      try {
        const data = await response.json();
        detail = data.detail || data.message || detail;
      } catch {
        // fallback
      }
      throw new Error(detail);
    }
    return response.json();
  }

  // Load status, plans, and payment receipts
  async function loadBillingData() {
    setError("");
    try {
      const [planData, statusData] = await Promise.all([
        api(`/billing/plans?portal_type=${portalType}`),
        api("/billing/status"),
      ]);
      setPlans(planData.plans || []);
      setBilling(statusData);

      // Load payment receipts
      try {
        const histData = await api("/billing/payments/history");
        setPayments(histData.payments || []);
      } catch {
        // Ignore payment history error if table not yet migrated
      }
    } catch (err) {
      setError(err.message || "Unable to load subscription details.");
    }
  }

  useEffect(() => {
    loadBillingData();
  }, [portalType]);

  // Start 14-day free trial
  async function startTrial() {
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await api("/billing/trial/start", {
        method: "POST",
        body: JSON.stringify({}),
      });
      setSuccessMsg("14-Day Free Trial activated! All premium features are now unlocked.");
      setBilling(res.status || (await api("/billing/status")));
    } catch (err) {
      setError(err.message || "Failed to activate free trial.");
    } finally {
      setLoading(false);
    }
  }

  // Load Razorpay checkout script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error("Razorpay SDK failed to load."));
      document.body.appendChild(script);
    });
  };

  // Subscribe to selected plan via Razorpay
  async function subscribe(planCode) {
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      await loadRazorpayScript();

      const checkout = await api("/billing/subscriptions/create", {
        method: "POST",
        body: JSON.stringify({ plan_code: planCode }),
      });

      const options = {
        key: checkout.key_id,
        subscription_id: checkout.subscription_id?.startsWith("sub_") ? checkout.subscription_id : undefined,
        order_id: checkout.order_id || undefined,
        amount: checkout.amount,
        currency: checkout.currency || "INR",
        name: "SkillBridge AI",
        description: `${checkout.plan_name} Subscription`,
        image: "https://skillbridge.ai/favicon.ico",
        notes: {
          plan_code: planCode,
          portal_type: portalType,
        },
        handler: async (result) => {
          try {
            setLoading(true);
            const verifyPayload = {
              razorpay_payment_id: result.razorpay_payment_id,
              razorpay_order_id: result.razorpay_order_id || checkout.order_id,
              razorpay_subscription_id: result.razorpay_subscription_id || checkout.subscription_id,
              razorpay_signature: result.razorpay_signature,
              plan_code: planCode,
            };

            await api("/billing/subscriptions/verify", {
              method: "POST",
              body: JSON.stringify(verifyPayload),
            });

            setSuccessMsg("Payment successful! Your subscription is now active.");
            await loadBillingData();
          } catch (err) {
            setError(err.message || "Payment submitted, but verification is still pending. We will update automatically.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        theme: {
          color: portalType === "industry" ? "#2563EB" : "#D97706",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (resp) => {
        setError(resp.error?.description || "Payment failed. Please try again.");
        setLoading(false);
      });
      razorpay.open();
    } catch (err) {
      setError(err.message || "Could not launch Razorpay checkout.");
      setLoading(false);
    }
  }

  // Cancel subscription request
  async function handleCancelSubscription() {
    if (!window.confirm("Are you sure you want to cancel your subscription at the end of the current billing cycle?")) {
      return;
    }
    setCancelling(true);
    setError("");
    try {
      await api("/billing/subscriptions/cancel", { method: "POST" });
      setSuccessMsg("Subscription cancellation scheduled for the end of the current billing period.");
      await loadBillingData();
    } catch (err) {
      setError(err.message || "Could not process cancellation.");
    } finally {
      setCancelling(false);
    }
  }

  const isIndustry = portalType === "industry";
  const accentColor = isIndustry ? "blue" : "amber";

  // Filter plans based on selected interval
  const filteredPlans = plans.filter((p) => p.billing_interval === billingInterval);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 text-slate-100">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isIndustry ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" : "bg-amber-600/20 text-amber-400 border border-amber-500/30"}`}>
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                {isIndustry ? "Industry Portal" : "Institution Portal"} Subscriptions
              </h1>
              <p className="text-sm text-slate-400">
                Manage your enterprise billing, trial status, and Razorpay-secured plans.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadBillingData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition"
            >
              Back to Dashboard
            </button>
          )}
        </div>
      </div>

      {/* FEEDBACK BANNERS */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-sm">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">{error}</div>
        </div>
      )}

      {successMsg && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">{successMsg}</div>
        </div>
      )}

      {/* CURRENT STATUS CARD */}
      {billing && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Current Access Level:</span>
                {billing.status === "active" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active Pro Plan
                  </span>
                )}
                {billing.status === "trialing" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    <Clock className="w-3.5 h-3.5" /> Free Trial Active ({billing.trial_days_left} Days Left)
                  </span>
                )}
                {billing.status === "trial_eligible" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <Sparkles className="w-3.5 h-3.5" /> 14-Day Free Trial Available
                  </span>
                )}
                {billing.status === "expired" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <XCircle className="w-3.5 h-3.5" /> Trial / Plan Expired
                  </span>
                )}
                {billing.status === "cancelled" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-400 border border-slate-500/30">
                    Cancelled
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-white">
                {billing.plan?.plan_name || (billing.status === "trialing" ? "14-Day Pro Trial" : "SkillBridge Access Tier")}
              </h2>

              <p className="text-xs text-slate-400">
                {billing.status === "active" && billing.current_period_end && (
                  <>Next renewal / access period ends: <strong className="text-slate-200">{new Date(billing.current_period_end).toLocaleDateString()}</strong></>
                )}
                {billing.status === "trialing" && billing.trial_ends_at && (
                  <>Your complimentary trial expires on: <strong className="text-slate-200">{new Date(billing.trial_ends_at).toLocaleDateString()}</strong></>
                )}
                {billing.status === "trial_eligible" && "Activate your 14-day all-inclusive trial now without entering any payment card details."}
                {billing.status === "expired" && "Your access period has concluded. Upgrade to a Pro subscription to regain unlimited access."}
              </p>
            </div>

            {/* ACTION BUTTON */}
            <div className="flex items-center gap-3">
              {billing.status === "trial_eligible" && (
                <button
                  disabled={loading}
                  onClick={startTrial}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start 14-Day Free Trial</span>
                </button>
              )}

              {billing.status === "active" && !billing.cancel_at_period_end && (
                <button
                  disabled={cancelling}
                  onClick={handleCancelSubscription}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-red-400 bg-slate-800/60 hover:bg-red-950/30 rounded-lg border border-slate-700/60 transition"
                >
                  {cancelling ? "Processing..." : "Cancel Renewal"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BILLING INTERVAL TOGGLE */}
      <div className="flex flex-col items-center justify-center space-y-3 pt-2">
        <h3 className="text-lg font-bold text-white">Available Plans</h3>
        <div className="flex items-center gap-3 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setBillingInterval("monthly")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${billingInterval === "monthly" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingInterval("yearly")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition ${billingInterval === "yearly" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      {/* PLANS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPlans.map((plan) => {
          const isCurrentPlan = billing?.plan?.plan_code === plan.plan_code && billing?.status === "active";
          return (
            <div
              key={plan.plan_code}
              className={`bg-slate-900/90 border rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
                isCurrentPlan
                  ? "border-emerald-500/50 shadow-emerald-500/10 shadow-2xl"
                  : "border-slate-800 hover:border-slate-700 shadow-xl"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-white">{plan.plan_name}</h4>
                  {isCurrentPlan && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                      Current Plan
                    </span>
                  )}
                </div>

                <div className="mt-4 mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">
                      ₹{(plan.amount_paise / 100).toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-slate-400 font-normal">
                      /{plan.billing_interval === "monthly" ? "month" : "year"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Billed in INR via secure Razorpay checkout.</p>
                </div>

                {/* FEATURES LIST */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">What is included:</span>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {isIndustry ? (
                      <>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                          <span>Unlimited Opportunity & Job Postings</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                          <span>AI Candidate Ranking & Readiness Matching</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                          <span>Complete Recruitment Pipeline & Scheduling</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                          <span>Talent Analytics & Candidate Export</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Full Student Cohort Tracking & Skill Mapping</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Placement Analytics & Readiness Intelligence</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Downloadable Placement & Accreditation Reports</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Industry Partner Matching & Internship Pipelines</span>
                        </li>
                      </>
                    )}
                    {plan.billing_interval === "yearly" && (
                      <li className="flex items-center gap-2 font-medium text-emerald-400">
                        <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Dedicated Account Manager & Priority Support</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="mt-8">
                <button
                  type="button"
                  disabled={loading || isCurrentPlan}
                  onClick={() => subscribe(plan.plan_code)}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg ${
                    isCurrentPlan
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25"
                  }`}
                >
                  <span>{isCurrentPlan ? "Active Plan" : `Upgrade to ${plan.plan_name}`}</span>
                  {!isCurrentPlan && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECURITY & TRUST BADGE */}
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
          <span>
            Payments are processed securely via <strong>Razorpay</strong>. Bank-grade 256-bit encryption. UPI, Cards & NetBanking supported.
          </span>
        </div>
        <span className="text-[11px] text-slate-500">SkillBridge AI Entitlements Engine</span>
      </div>

      {/* PAYMENT HISTORY TABLE */}
      {payments.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Receipt className="w-4 h-4 text-slate-400" />
            <h3>Payment History & Receipts</h3>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Payment ID</th>
                    <th className="py-3 px-4 font-semibold">Date</th>
                    <th className="py-3 px-4 font-semibold">Amount</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-mono text-slate-300">{p.razorpay_payment_id || p.id.slice(0, 8)}</td>
                      <td className="py-3 px-4 text-slate-400">
                        {p.paid_at ? new Date(p.paid_at).toLocaleDateString() : new Date(p.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">
                        ₹{((p.amount_paise || 0) / 100).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 capitalize">
                          {p.status || "captured"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
