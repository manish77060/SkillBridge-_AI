import { useState, useEffect } from "react";
import {
  ShieldCheck, LogOut, Users, CheckCircle2, XCircle,
  Clock, BarChart3, Activity, GraduationCap, Factory,
  Building2, ChevronDown, AlertCircle, Eye, KeyRound,
  ArrowLeft, RefreshCw
} from "lucide-react";

const API = "http://127.0.0.1:8000/api";

// ─────────────────────────────────────────────────────────────
// ADMIN LOGIN SCREEN
// ─────────────────────────────────────────────────────────────
export function AdminLoginScreen({ onLogin }) {
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");
      // Save token to sessionStorage
      sessionStorage.setItem("admin_token", data.token);
      sessionStorage.setItem("admin_user", JSON.stringify(data.admin));
      onLogin(data.admin, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-red-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-28 h-28 mb-5 flex items-center justify-center">
            <img src="/logo.png" alt="SkillBridge AI" className="w-28 h-28 object-contain drop-shadow-2xl" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Super Admin Portal</h1>
          <p className="text-slate-400 text-sm mt-1">SkillBridge AI — Team Access Only</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Admin Email</label>
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@skillbridge.ai"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"} required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition text-sm"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl transition disabled:opacity-50 cursor-pointer text-sm">
              {loading ? "Signing in…" : "Sign In to Admin Portal"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-5">
            This portal is restricted to SkillBridge AI team members only.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────
export function AdminDashboard({ admin, token, onLogout }) {
  const [tab, setTab]           = useState("pending");
  const [users, setUsers]       = useState([]);
  const [stats, setStats]       = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectModal, setRejectModal]     = useState(null); // { user }
  const [rejectReason, setRejectReason]   = useState("");
  const [toast, setToast]       = useState(null);
  const [pwModal, setPwModal]   = useState(false);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUsers = async (status) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/requests?status=${status}`, { headers: authHeaders });
      const data = await res.json();
      setUsers(data.users || []);
    } catch { showToast("Failed to fetch users", "error"); }
    finally { setLoading(false); }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/admin/stats`, { headers: authHeaders });
      const data = await res.json();
      setStats(data);
    } catch {}
  };

  const fetchActivity = async () => {
    try {
      const res = await fetch(`${API}/admin/activity`, { headers: authHeaders });
      const data = await res.json();
      setActivity(data.activity || []);
    } catch {}
  };

  useEffect(() => {
    fetchStats();
    if (tab === "activity") { fetchActivity(); return; }
    fetchUsers(tab);
  }, [tab]);

  const handleApprove = async (userId, userName) => {
    setActionLoading(userId + "_approve");
    try {
      const res = await fetch(`${API}/admin/approve/${userId}`, {
        method: "POST", headers: authHeaders,
      });
      if (!res.ok) throw new Error();
      showToast(`✅ ${userName} approved!`);
      fetchUsers(tab);
      fetchStats();
    } catch { showToast("Failed to approve user", "error"); }
    finally { setActionLoading(null); }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    const { id, name } = rejectModal;
    setActionLoading(id + "_reject");
    try {
      const res = await fetch(`${API}/admin/reject/${id}`, {
        method: "POST", headers: authHeaders,
        body: JSON.stringify({ reason: rejectReason }),
      });
      if (!res.ok) throw new Error();
      showToast(`❌ ${name} rejected`);
      setRejectModal(null);
      setRejectReason("");
      fetchUsers(tab);
      fetchStats();
    } catch { showToast("Failed to reject user", "error"); }
    finally { setActionLoading(null); }
  };

  const portalIcon = (portal) => {
    if (portal === "student")     return <GraduationCap className="w-4 h-4 text-indigo-400" />;
    if (portal === "industry")    return <Factory className="w-4 h-4 text-emerald-400" />;
    if (portal === "institution") return <Building2 className="w-4 h-4 text-amber-400" />;
  };
  const portalBadge = (portal) => {
    const map = {
      student:     "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
      industry:    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      institution: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    };
    return `text-xs font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${map[portal] || ""}`;
  };

  const tabs = [
    { key: "pending",  label: "Pending",  icon: <Clock className="w-4 h-4" />,        count: stats?.pending },
    { key: "approved", label: "Approved", icon: <CheckCircle2 className="w-4 h-4" />, count: stats?.approved },
    { key: "rejected", label: "Rejected", icon: <XCircle className="w-4 h-4" />,       count: stats?.rejected },
    { key: "activity", label: "Activity", icon: <Activity className="w-4 h-4" />,      count: null },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">

      {/* ── TOP BAR ── */}
      <div className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="SkillBridge AI" className="w-12 h-12 object-contain" />
            <div>
              <p className="text-base font-extrabold text-white leading-none">Super Admin</p>
              <p className="text-xs text-slate-500 leading-none mt-0.5">SkillBridge AI</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-slate-400">
              Logged in as <span className="text-white font-semibold">{admin?.name}</span>
            </span>
            <button onClick={() => setPwModal(true)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition cursor-pointer">
              <KeyRound className="w-3.5 h-3.5" />Change Password
            </button>
            <button onClick={onLogout}
              className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition cursor-pointer">
              <LogOut className="w-3.5 h-3.5" />Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">

        {/* ── STATS ── */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[
              { label: "Pending",      value: stats.pending,      color: "amber" },
              { label: "Approved",     value: stats.approved,     color: "emerald" },
              { label: "Rejected",     value: stats.rejected,     color: "red" },
              { label: "Students",     value: stats.students,     color: "indigo" },
              { label: "Industry",     value: stats.industries,   color: "emerald" },
              { label: "Institutions", value: stats.institutions, color: "amber" },
            ].map((s) => {
              const cm = { amber: "text-amber-400 bg-amber-500/10 border-amber-500/20", emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", red: "text-red-400 bg-red-500/10 border-red-500/20", indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" };
              return (
                <div key={s.label} className={`border rounded-2xl p-4 text-center ${cm[s.color]}`}>
                  <p className="text-2xl font-extrabold">{s.value}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider mt-1 opacity-70">{s.label}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* ── TABS ── */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-0">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition cursor-pointer -mb-px
                ${tab === t.key
                  ? "border-red-500 text-white"
                  : "border-transparent text-slate-400 hover:text-slate-200"}`}>
              {t.icon}{t.label}
              {t.count != null && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                  ${t.key === "pending" && t.count > 0 ? "bg-red-500 text-white" : "bg-slate-800 text-slate-400"}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
          <button onClick={() => { fetchStats(); if (tab !== "activity") fetchUsers(tab); else fetchActivity(); }}
            className="ml-auto text-slate-500 hover:text-white p-2 rounded-lg transition cursor-pointer">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* ── ACTIVITY TAB ── */}
        {tab === "activity" && (
          <div className="space-y-3">
            {activity.length === 0 && !loading && (
              <div className="text-center py-16 text-slate-500">No activity recorded yet.</div>
            )}
            {activity.map((a) => (
              <div key={a.id} className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 flex items-start gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.action === "approved" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                  {a.action === "approved" ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">
                    <span className="text-slate-300">{a.admin_name}</span>
                    {" "}{a.action}{" "}
                    <span className="text-slate-300">{a.target_email}</span>
                  </p>
                  {a.notes && <p className="text-xs text-slate-500 mt-0.5">{a.notes}</p>}
                </div>
                <p className="text-xs text-slate-600 shrink-0">{new Date(a.created_at).toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── USERS LIST ── */}
        {tab !== "activity" && (
          <div className="space-y-4">
            {loading && (
              <div className="text-center py-16 text-slate-500">Loading…</div>
            )}
            {!loading && users.length === 0 && (
              <div className="text-center py-16">
                <p className="text-slate-500 text-sm">No {tab} requests.</p>
              </div>
            )}
            {!loading && users.map((u) => (
              <div key={u.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Avatar + info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700 flex items-center justify-center text-lg font-bold text-white shrink-0">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-white text-sm">{u.name}</p>
                        <span className={portalBadge(u.portal)}>
                          {u.portal}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{u.email}</p>
                      <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-slate-500">
                        {u.college && <span>🏫 {u.college}</span>}
                        {u.company && <span>🏢 {u.company}</span>}
                        {u.branch  && <span>📚 {u.branch}</span>}
                        {u.phone   && <span>📞 {u.phone}</span>}
                        {u.location && <span>📍 {u.location}</span>}
                        <span>📅 {new Date(u.created_at).toLocaleDateString("en-IN")}</span>
                      </div>
                      {u.rejection_reason && (
                        <p className="text-xs text-red-400 mt-1.5 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-1.5">
                          Rejection reason: {u.rejection_reason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  {tab === "pending" && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleApprove(u.id, u.name)}
                        disabled={actionLoading === u.id + "_approve"}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition disabled:opacity-50 cursor-pointer">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {actionLoading === u.id + "_approve" ? "Approving…" : "Approve"}
                      </button>
                      <button
                        onClick={() => { setRejectModal(u); setRejectReason(""); }}
                        className="flex items-center gap-1.5 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer border border-slate-700 hover:border-red-500">
                        <XCircle className="w-3.5 h-3.5" />Reject
                      </button>
                    </div>
                  )}
                  {tab === "approved" && (
                    <button
                      onClick={() => { setRejectModal(u); setRejectReason(""); }}
                      className="flex items-center gap-1.5 bg-slate-800 hover:bg-red-600/80 text-slate-300 hover:text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer border border-slate-700 shrink-0">
                      <XCircle className="w-3.5 h-3.5" />Revoke
                    </button>
                  )}
                  {tab === "rejected" && (
                    <button
                      onClick={() => handleApprove(u.id, u.name)}
                      className="flex items-center gap-1.5 bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />Re-approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── REJECT MODAL ── */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-white font-bold text-lg mb-1">
              {tab === "approved" ? "Revoke Access" : "Reject Request"}
            </h3>
            <p className="text-slate-400 text-sm mb-5">
              {tab === "approved" ? "Revoke" : "Rejecting"} <strong className="text-white">{rejectModal.name}</strong> ({rejectModal.portal} portal)
            </p>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Reason (required)
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="e.g. Incomplete information provided, please re-register with your institution email."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition text-sm resize-none mb-5"
            />
            <div className="flex gap-3">
              <button onClick={() => setRejectModal(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl transition text-sm cursor-pointer">
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || !!actionLoading}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50 text-sm cursor-pointer">
                {actionLoading ? "Processing…" : (tab === "approved" ? "Revoke Access" : "Confirm Reject")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-xl transition-all
          ${toast.type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"}`}>
          {toast.msg}
        </div>
      )}

      {/* ── CHANGE PASSWORD MODAL ── */}
      {pwModal && (
        <ChangePasswordModal token={token} onClose={() => setPwModal(false)} showToast={showToast} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CHANGE PASSWORD MODAL
// ─────────────────────────────────────────────────────────────
function ChangePasswordModal({ token, onClose, showToast }) {
  const [cur, setCur]   = useState("");
  const [nw, setNw]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (nw.length < 8) { setError("New password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ current_password: cur, new_password: nw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      showToast("Password changed successfully!");
      onClose();
    } catch (err) {
      setError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm">
        <h3 className="text-white font-bold text-lg mb-5">Change Password</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Current Password</label>
            <input type="password" required value={cur} onChange={e => setCur(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">New Password</label>
            <input type="password" required value={nw} onChange={e => setNw(e.target.value)}
              placeholder="Min 8 characters"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition" />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 bg-slate-800 text-slate-300 font-semibold py-2.5 rounded-xl text-sm cursor-pointer">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-50 cursor-pointer">
              {loading ? "Saving…" : "Change"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
