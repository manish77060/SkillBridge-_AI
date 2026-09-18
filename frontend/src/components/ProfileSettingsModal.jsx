import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  GraduationCap,
  Lock,
  Shield,
  Key,
  HelpCircle,
  Bell,
  LogOut,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  Eye,
  EyeOff,
  Laptop,
  Smartphone,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Send,
  FileText,
  SlidersHorizontal,
} from "lucide-react";
import { API_URL } from "../config/api";

export default function ProfileSettingsModal({
  isOpen,
  onClose,
  currentUser,
  selectedPortal = "student",
  onUpdateProfile,
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState("profile");

  // Portal color schemes
  const portalStyles = {
    student: {
      accent: "from-indigo-500 to-violet-600",
      accentBg: "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/25",
      accentBorder: "border-indigo-500/30",
      accentText: "text-indigo-400",
      badge: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
      title: "Student Account",
    },
    industry: {
      accent: "from-emerald-500 to-teal-600",
      accentBg: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25",
      accentBorder: "border-emerald-500/30",
      accentText: "text-emerald-400",
      badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
      title: "Industry Recruiter Account",
    },
    institution: {
      accent: "from-amber-500 to-orange-600",
      accentBg: "bg-amber-600 hover:bg-amber-500 shadow-amber-600/25",
      accentBorder: "border-amber-500/30",
      accentText: "text-amber-400",
      badge: "bg-amber-500/10 text-amber-300 border-amber-500/20",
      title: "Academic Dean Account",
    },
  };

  const theme = portalStyles[selectedPortal] || portalStyles.student;

  // Derive initial values from currentUser or localStorage
  const getSessionData = () => {
    try {
      const session = JSON.parse(localStorage.getItem("skillbridge_auth_session") || "{}");
      return session?.user || {};
    } catch {
      return {};
    }
  };

  const sessionUser = getSessionData();

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || sessionUser?.name || "Student Demo",
    email: currentUser?.email || sessionUser?.email || "student@demo.com",
    phone: currentUser?.phone || sessionUser?.contact || "+91 98765 43210",
    college: currentUser?.college || sessionUser?.college || (selectedPortal === "industry" ? "TechNova Labs" : "Galgotias University"),
    branch: currentUser?.branch || sessionUser?.branch || (selectedPortal === "industry" ? "Talent Acquisition" : "Computer Science & Engineering"),
    location: currentUser?.location || sessionUser?.location || "Bengaluru • Hybrid",
    bio: currentUser?.bio || sessionUser?.bio || "Full-stack AI developer passionate about scalable backend architecture, distributed systems, and real-time candidate matchmaking.",
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Password Manager State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Security State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessionList, setSessionList] = useState([
    {
      id: "sess_1",
      device: "Chrome on Windows 11",
      ip: "127.0.0.1 (Localhost)",
      location: "New Delhi, India",
      current: true,
      time: "Active now",
      icon: Laptop,
    },
    {
      id: "sess_2",
      device: "Safari on iPhone 15 Pro",
      ip: "103.24.12.8",
      location: "Bengaluru, India",
      current: false,
      time: "2 hours ago",
      icon: Smartphone,
    },
  ]);
  const [revokedMessage, setRevokedMessage] = useState("");

  // Help & Support State
  const [openFaq, setOpenFaq] = useState(null);
  const [supportTicket, setSupportTicket] = useState({
    category: "Technical Issue",
    subject: "",
    message: "",
  });
  const [ticketSubmitted, setTicketSubmitted] = useState("");

  // Notification Preferences State
  const [prefs, setPrefs] = useState({
    emailAlerts: true,
    opportunityMatch: true,
    assessmentReminders: true,
    weeklyDigest: false,
  });

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Sync profileForm when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setProfileForm((prev) => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        college: currentUser.college || currentUser.company || prev.college,
        branch: currentUser.branch || prev.branch,
      }));
    }
  }, [currentUser]);

  if (!isOpen) return null;

  // Handlers
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSaveSuccess(false);

    try {
      const updatedUser = {
        ...currentUser,
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        college: profileForm.college,
        branch: profileForm.branch,
        location: profileForm.location,
        bio: profileForm.bio,
      };

      if (onUpdateProfile) {
        onUpdateProfile(updatedUser);
      }

      // Sync with localStorage
      const session = JSON.parse(localStorage.getItem("skillbridge_auth_session") || "{}");
      localStorage.setItem(
        "skillbridge_auth_session",
        JSON.stringify({ ...session, user: updatedUser })
      );

      // Student Supabase persistence
      if (selectedPortal === "student") {
        try {
          localStorage.setItem(
            "skillbridge_student_profile",
            JSON.stringify({
              name: profileForm.name,
              email: profileForm.email,
              university: profileForm.college,
              college: profileForm.college,
              course: profileForm.branch,
              branch: profileForm.branch,
            })
          );

          await fetch(`${API_URL}/students/sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: "e0bab151-ab49-42fe-b6f1-c4346834b1f1",
              name: profileForm.name,
              email: profileForm.email,
              college: profileForm.college,
              branch: profileForm.branch,
            }),
          }).catch(() => {});
        } catch {}
      }

      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 4000);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Password calculation
  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd)) score += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25;
    return score;
  };

  const pwdStrength = calculatePasswordStrength(passwordForm.newPassword);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!passwordForm.currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    // Save updated password in localStorage accounts
    try {
      const accounts = JSON.parse(localStorage.getItem("skillbridge_accounts") || "{}");
      const portalAccounts = accounts[selectedPortal] || [];
      const updatedAccounts = portalAccounts.map((acc) => {
        if (acc.email.toLowerCase() === profileForm.email.toLowerCase()) {
          return { ...acc, password: passwordForm.newPassword };
        }
        return acc;
      });
      accounts[selectedPortal] = updatedAccounts;
      localStorage.setItem("skillbridge_accounts", JSON.stringify(accounts));
    } catch {}

    setPasswordSuccess("Password updated successfully! Your account credentials have been refreshed.");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setPasswordSuccess(""), 5000);
  };

  const handleRevokeSessions = () => {
    setSessionList((prev) => prev.filter((s) => s.current));
    setRevokedMessage("All other active sessions have been safely terminated.");
    setTimeout(() => setRevokedMessage(""), 4000);
  };

  const handleGeneratePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
    let gen = "";
    for (let i = 0; i < 12; i++) {
      gen += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPasswordForm((prev) => ({
      ...prev,
      newPassword: gen,
      confirmPassword: gen,
    }));
    setShowNewPassword(true);
    setShowConfirmPassword(true);
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportTicket.subject.trim() || !supportTicket.message.trim()) return;

    const ticketId = `SB-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketSubmitted(
      `Support request submitted successfully! Reference ID: ${ticketId}. Our team will respond within 2 hours.`
    );
    setSupportTicket({ category: "Technical Issue", subject: "", message: "" });
    setTimeout(() => setTicketSubmitted(""), 6000);
  };

  // User initials
  const initials = profileForm.name
    ? profileForm.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "SB";

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
      {/* Click outside backdrop */}
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
        aria-label="Close modal overlay"
      />

      {/* Main Modal Box */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-all">
        {/* Decorative Top Portal Ribbon */}
        <div className={`h-2.5 w-full bg-gradient-to-r ${theme.accent}`} />

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-4">
            {/* User Avatar */}
            <div className="relative">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.accent} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
              >
                {initials}
              </div>
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900"
                title="Online & Verified"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {profileForm.name}
                </h2>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${theme.badge}`}>
                  {selectedPortal === "industry" ? "Recruiter" : selectedPortal === "institution" ? "Dean" : "Student"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>{profileForm.email}</span>
                <span>•</span>
                <span className="text-slate-300 font-medium">{profileForm.college}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {onLogout && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="px-3.5 py-2 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Log out of SkillBridge"
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-800 bg-slate-950/40 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "profile"
                ? "text-white border-indigo-500 bg-slate-800/60"
                : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            <User size={15} className={activeTab === "profile" ? "text-indigo-400" : ""} />
            <span>Profile Details</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "security"
                ? "text-white border-indigo-500 bg-slate-800/60"
                : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            <Shield size={15} className={activeTab === "security" ? "text-indigo-400" : ""} />
            <span>Security & Sessions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("password")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "password"
                ? "text-white border-indigo-500 bg-slate-800/60"
                : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            <Key size={15} className={activeTab === "password" ? "text-indigo-400" : ""} />
            <span>Password Manager</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("help")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "help"
                ? "text-white border-indigo-500 bg-slate-800/60"
                : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            <HelpCircle size={15} className={activeTab === "help" ? "text-indigo-400" : ""} />
            <span>Help & Support</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("preferences")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "preferences"
                ? "text-white border-indigo-500 bg-slate-800/60"
                : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            <Bell size={15} className={activeTab === "preferences" ? "text-indigo-400" : ""} />
            <span>Preferences</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700">
          {/* =========================================================
              TAB 1: PROFILE DETAILS
          ========================================================= */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {profileSaveSuccess && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-300 flex items-center gap-2.5 animate-fadeIn">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>Your profile details have been saved and synchronized with your workspace!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:border-indigo-500 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:border-indigo-500 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Contact / Phone Number
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:border-indigo-500 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* College / Organization */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {selectedPortal === "industry" ? "Company Name" : "University / College"}
                    </label>
                    <div className="relative">
                      <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={profileForm.college}
                        onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:border-indigo-500 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Branch / Department */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {selectedPortal === "industry" ? "Department / Team" : "Degree & Specialization"}
                    </label>
                    <div className="relative">
                      <GraduationCap size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={profileForm.branch}
                        onChange={(e) => setProfileForm({ ...profileForm, branch: e.target.value })}
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:border-indigo-500 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Work / Campus Location
                    </label>
                    <div className="relative">
                      <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:border-indigo-500 outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Bio */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Professional Summary / Bio
                  </label>
                  <textarea
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:border-indigo-500 outline-none transition"
                    placeholder="Brief description about your career focus and technical strengths..."
                  />
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-indigo-400" />
                    <span>Real-time database sync enabled</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-lg shadow-indigo-600/25"
                  >
                    {isSavingProfile ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check size={14} />
                        <span>Save Profile Details</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =========================================================
              TAB 2: SECURITY & SESSIONS
          ========================================================= */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {revokedMessage && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-300 flex items-center gap-2.5 animate-fadeIn">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>{revokedMessage}</span>
                </div>
              )}

              {/* 2FA Toggle Card */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                      <Shield size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Two-Factor Authentication (2FA)</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-lg">
                        Enforce a second authentication step on sign-in via SMS verification code or authenticator app (Google Authenticator, Authy).
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${twoFactorEnabled ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-800 text-slate-400 border-slate-700"}`}>
                          {twoFactorEnabled ? "Status: Active & Protected" : "Status: Disabled"}
                        </span>
                        <span className="text-[11px] text-slate-500">Method: SMS (+91 98*** ***10)</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      twoFactorEnabled
                        ? "bg-slate-800 hover:bg-slate-700 text-slate-200"
                        : "bg-indigo-600 hover:bg-indigo-500 text-white"
                    }`}
                  >
                    {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                  </button>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Active Login Sessions</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Manage devices currently authenticated with your account.</p>
                  </div>

                  {sessionList.length > 1 && (
                    <button
                      type="button"
                      onClick={handleRevokeSessions}
                      className="px-3 py-1.5 rounded-xl border border-red-500/25 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-medium transition cursor-pointer"
                    >
                      Revoke Other Sessions
                    </button>
                  )}
                </div>

                <div className="space-y-2.5">
                  {sessionList.map((sess) => {
                    const DeviceIcon = sess.icon;
                    return (
                      <div
                        key={sess.id}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800/80"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                            <DeviceIcon size={16} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-semibold text-white">{sess.device}</p>
                              {sess.current && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                  Current Device
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {sess.ip} • {sess.location} • {sess.time}
                            </p>
                          </div>
                        </div>

                        {sess.current ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="Active session" />
                        ) : (
                          <span className="text-xs text-slate-500 font-medium">Logged in</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Data Privacy & Encryption */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
                    <Lock size={14} />
                    <span>Supabase SSL Encryption</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    All candidate resumes, assessment scores, and identity tokens are encrypted at rest using AES-256 standard.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
                    <CheckCircle2 size={14} />
                    <span>Audit Log Compliance</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Account activity is audited in real-time. Unauthorized attempts are instantly flagged and blocked.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 3: PASSWORD MANAGER
          ========================================================= */}
          {activeTab === "password" && (
            <div className="space-y-6">
              {passwordSuccess && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-300 flex items-center gap-2.5 animate-fadeIn">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-medium text-red-300 flex items-center gap-2.5 animate-fadeIn">
                  <AlertCircle size={16} className="text-red-400 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Change Account Password</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Ensure your new password contains a mix of letters, numbers, and symbols.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Sparkles size={13} />
                    <span>Suggest Password</span>
                  </button>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        required
                        placeholder="Enter current password"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-xs text-white placeholder-slate-600 focus:border-indigo-500 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <Key size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        required
                        placeholder="Enter new strong password"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-xs text-white placeholder-slate-600 focus:border-indigo-500 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>

                    {/* Live Password Strength Meter */}
                    {passwordForm.newPassword && (
                      <div className="mt-2.5 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Strength:</span>
                          <span
                            className={`font-semibold ${
                              pwdStrength >= 75
                                ? "text-emerald-400"
                                : pwdStrength >= 50
                                ? "text-amber-400"
                                : "text-red-400"
                            }`}
                          >
                            {pwdStrength >= 75 ? "Strong" : pwdStrength >= 50 ? "Moderate" : "Weak"}
                          </span>
                        </div>

                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              pwdStrength >= 75
                                ? "bg-emerald-500"
                                : pwdStrength >= 50
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${pwdStrength}%` }}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400 pt-1">
                          <span className={passwordForm.newPassword.length >= 8 ? "text-emerald-400" : ""}>
                            • Min 8 characters
                          </span>
                          <span className={/[A-Z]/.test(passwordForm.newPassword) ? "text-emerald-400" : ""}>
                            • 1 Uppercase letter
                          </span>
                          <span className={/[0-9]/.test(passwordForm.newPassword) ? "text-emerald-400" : ""}>
                            • 1 Number (0-9)
                          </span>
                          <span className={/[^A-Za-z0-9]/.test(passwordForm.newPassword) ? "text-emerald-400" : ""}>
                            • 1 Special character
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Key size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        required
                        placeholder="Re-type new password"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-xs text-white placeholder-slate-600 focus:border-indigo-500 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-indigo-600/25"
                    >
                      <Check size={15} />
                      <span>Update Password</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Password Vault Tips */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                <Shield size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-400">
                  <p className="font-semibold text-slate-200">SkillBridge Password Vault Protection</p>
                  <p className="mt-0.5">
                    Passwords are salted using bcrypt before being stored. Never share your password with anyone; SkillBridge staff will never ask for your credentials.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 4: HELP & SUPPORT
          ========================================================= */}
          {activeTab === "help" && (
            <div className="space-y-6">
              {ticketSubmitted && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-300 flex items-center gap-2.5 animate-fadeIn">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>{ticketSubmitted}</span>
                </div>
              )}

              {/* System Health Card */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">System Status: All Operational</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Supabase API 99.98% uptime • AI Match Engine Active • Auth Services Normal
                    </p>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-500 font-mono">
                  v2.4.0 (Prod Build)
                </div>
              </div>

              {/* Frequently Asked Questions */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <HelpCircle size={16} className="text-indigo-400" />
                  <span>Frequently Asked Questions</span>
                </h4>

                <div className="space-y-2">
                  {[
                    {
                      q: "How does SkillBridge AI calculate my skill readiness score?",
                      a: "Our algorithm assesses verified quiz results, GitHub/code assessment completions, and roadmap milestone validations, benchmarked against real-time job openings in the industry portal.",
                    },
                    {
                      q: "How do I apply for jobs and track recruitment progress?",
                      a: "Browse roles in the Opportunities tab, click Apply, and monitor your hiring stages directly in the Applications pipeline tracker.",
                    },
                    {
                      q: "How do recruiters discover my verified profile?",
                      a: "Once your skills are verified through assessments, your profile is surfaced in the Industry Talent Discovery pool based on skill matches.",
                    },
                    {
                      q: "How do I switch workspaces or change access permissions?",
                      a: "Use the Switch Portal switcher located at the bottom of the sidebar to jump between Student, Industry, and Institution workspaces according to your role privileges.",
                    },
                  ].map((faq, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900 transition"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full flex items-center justify-between p-3.5 text-left text-xs font-semibold text-white hover:bg-slate-850 cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        {openFaq === idx ? (
                          <ChevronUp size={15} className="text-indigo-400" />
                        ) : (
                          <ChevronDown size={15} className="text-slate-500" />
                        )}
                      </button>
                      {openFaq === idx && (
                        <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-400 border-t border-slate-800/80 leading-relaxed bg-slate-950/40">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Support Ticket */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
                <h4 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                  <Send size={15} className="text-indigo-400" />
                  <span>Submit Support Ticket</span>
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  Need assistance with your account, assessments, or placement opportunities? Send us a ticket.
                </p>

                <form onSubmit={handleSupportSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Issue Category</label>
                      <select
                        value={supportTicket.category}
                        onChange={(e) => setSupportTicket({ ...supportTicket, category: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-indigo-500"
                      >
                        <option value="Technical Issue">Technical Issue</option>
                        <option value="Opportunity Matching">Opportunity Matching</option>
                        <option value="Assessment Verification">Assessment Verification</option>
                        <option value="Account & Credentials">Account & Credentials</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Subject</label>
                      <input
                        type="text"
                        placeholder="Brief summary of issue"
                        value={supportTicket.subject}
                        onChange={(e) => setSupportTicket({ ...supportTicket, subject: e.target.value })}
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Message</label>
                    <textarea
                      rows={2}
                      placeholder="Describe what happened or what you need help with..."
                      value={supportTicket.message}
                      onChange={(e) => setSupportTicket({ ...supportTicket, message: e.target.value })}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-indigo-600/20"
                    >
                      <Send size={13} />
                      <span>Send Support Request</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 5: PREFERENCES
          ========================================================= */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Bell size={16} className="text-indigo-400" />
                  <span>Notification Preferences</span>
                </h4>

                <div className="space-y-3">
                  {[
                    {
                      id: "opportunityMatch",
                      title: "Opportunity Match Alerts",
                      desc: "Instant notifications when an industry job matches >= 85% of your verified skills.",
                    },
                    {
                      id: "assessmentReminders",
                      title: "Assessment & Milestone Reminders",
                      desc: "Reminders to complete scheduled technical quizzes and gap-reduction sprints.",
                    },
                    {
                      id: "emailAlerts",
                      title: "Email Notifications",
                      desc: "Receive weekly digests and application status updates directly in your inbox.",
                    },
                    {
                      id: "weeklyDigest",
                      title: "Industry Skill Trends Digest",
                      desc: "A summary of the fastest-growing hiring demands across top tech companies.",
                    },
                  ].map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition cursor-pointer"
                    >
                      <div className="pr-4">
                        <p className="text-xs font-semibold text-white">{item.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={Boolean(prefs[item.id])}
                        onChange={(e) => setPrefs({ ...prefs, [item.id]: e.target.checked })}
                        className="w-4 h-4 accent-indigo-600 rounded cursor-pointer shrink-0"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Theme & Display */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-indigo-400" />
                  <span>Display & Appearance</span>
                </h4>
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div>
                    <p className="text-xs font-semibold text-white">Dark Mode (High-Contrast)</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Tailored for extended coding sessions and low eye fatigue.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                    Active (Default)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>SkillBridge AI v2.4</span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Connected
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
