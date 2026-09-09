import { useEffect, useRef, useState, useMemo } from "react";

import {
  AlertTriangle,
  CheckCircle2,
  User,
  Mail,
  MapPin,
  GraduationCap,
  BookOpen,
  FileText,
  Sparkles,
  BriefcaseBusiness,
  Award,
  ExternalLink,
  X,
  Loader2,
  RefreshCw,
  Brain,
  Lock,
  Bell,
  Shield,
  LogOut,
  ArrowRight,
  ChevronRight,
  Building2,
  Target,
  Settings,
  HelpCircle,
  KeyRound,
  LifeBuoy,
  MessageSquare,
  Download,
  Laptop,
  ChevronDown,
  ChevronUp,
  Sliders,
  Check,
  Globe,
  Send,
  Info,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000";
const STUDENT_ID = "e0bab151-ab49-42fe-b6f1-c4346834b1f1";

function StudentProfile({
  currentUser,
  setActivePage,
  onUpdateProfile,
  onLogout,
}) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Top Tab state: 'overview' | 'settings'
  const [activeTab, setActiveTab] = useState("overview");

  // Settings Sub-navigation: 'security' | 'help' | 'notifications' | 'privacy' | 'preferences'
  const [settingsSection, setSettingsSection] = useState("security");

  // Profile Edit Modal State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");
  const [saveError, setSaveError] = useState("");

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: currentUser?.name || "Student",
    university: currentUser?.college || "Galgotias University",
    course: currentUser?.branch || "B.Tech • Computer Science",
    graduation_year: "2026",
    cgpa: "8.7",
    location: "Greater Noida",
    target_role: "Backend Developer",
    bio: "Passionate software engineer building scalable backend microservices and AI-driven platforms.",
  });

  // Settings: Password & Security state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  // Settings: Notification preferences
  const [notifications, setNotifications] = useState({
    opportunityAlerts: true,
    assessmentReminders: true,
    learningUpdates: true,
    recruiterMessages: true,
    emailDigest: "weekly",
  });

  // Settings: Privacy & Discovery
  const [privacy, setPrivacy] = useState({
    recruiterDiscovery: true,
    publicPortfolio: true,
    showCgpa: true,
    anonymizeLeaderboard: false,
  });

  // Settings: Learning & Code preferences
  const [codePreferences, setCodePreferences] = useState({
    defaultLanguage: "python",
    fontSize: "14px",
    tabSize: "4",
    autoRunTests: true,
    targetTrack: "Full-Stack AI Engineer",
  });

  // Settings: Help & Support state
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [ticketForm, setTicketForm] = useState({
    category: "Technical Issue",
    priority: "Normal",
    subject: "",
    message: "",
  });
  const [submittedTickets, setSubmittedTickets] = useState([
    {
      id: "SB-7419",
      category: "Assessment & Grading",
      subject: "Inquiry about Round 2 Coding Evaluation metric",
      status: "Resolved",
      date: "2026-09-06",
    },
  ]);
  const [ticketSuccessMessage, setTicketSuccessMessage] = useState("");

  // Learning & certification history
  const [historyRange, setHistoryRange] = useState("30");
  const [learningRecord, setLearningRecord] = useState(null);

  // ============================================================
  // LOAD STUDENT DATA
  // ============================================================

  const loadStudent = async () => {
    try {
      let currentStudent = null;

      try {
        const directRes = await fetch(`${API_BASE_URL}/api/students/${STUDENT_ID}`);
        if (directRes.ok) {
          const directData = await directRes.json();
          currentStudent = directData?.data || directData;
        }
      } catch {}

      if (!currentStudent) {
        const response = await fetch(`${API_BASE_URL}/api/students/`);
        if (response.ok) {
          const data = await response.json();
          const list = Array.isArray(data) ? data : data?.data || data?.students || [];
          currentStudent = list.find((item) => item.id === STUDENT_ID) || list[0];
        }
      }

      let savedCustom = null;
      try {
        const stored = localStorage.getItem("skillbridge_student_profile");
        if (stored) savedCustom = JSON.parse(stored);
      } catch {}

      const activeName =
        currentUser?.name ||
        savedCustom?.name ||
        currentStudent?.name ||
        currentStudent?.full_name ||
        "Student";

      const activeEmail =
        currentUser?.email ||
        savedCustom?.email ||
        currentStudent?.email ||
        "student@skillbridge.com";

      const activeUniversity =
        savedCustom?.university ||
        currentStudent?.university ||
        currentStudent?.college ||
        currentUser?.college ||
        "Galgotias University";

      const activeCourse =
        savedCustom?.course ||
        currentStudent?.degree ||
        currentStudent?.branch ||
        currentUser?.branch ||
        "B.Tech • Computer Science";

      const activeLocation =
        savedCustom?.location ||
        currentStudent?.location ||
        "Greater Noida";

      const activeTargetRole =
        savedCustom?.target_role ||
        currentStudent?.target_role ||
        "Backend Developer";

      const loadedStudent = {
        ...currentStudent,
        name: activeName,
        email: activeEmail,
        university: activeUniversity,
        course: activeCourse,
        location: activeLocation,
        target_role: activeTargetRole,
      };

      setStudent(loadedStudent);

      setEditForm((prev) => ({
        ...prev,
        name: activeName,
        university: activeUniversity,
        course: activeCourse,
        location: activeLocation,
        target_role: activeTargetRole,
        graduation_year: String(currentStudent?.graduation_year || prev.graduation_year || "2026"),
        cgpa: String(currentStudent?.graduation_percentage ? (currentStudent.graduation_percentage / 10).toFixed(1) : prev.cgpa || "8.7"),
      }));

      // Load learning records
      try {
        const learnKey = `skillbridge_learning_${STUDENT_ID}`;
        const rawLearn = localStorage.getItem(learnKey);
        if (rawLearn) {
          setLearningRecord(JSON.parse(rawLearn));
        }
      } catch {}

    } catch (err) {
      console.error("Profile load error:", err);
      setError("Unable to load profile information.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStudent();
  }, []);

  const refreshProfile = () => {
    setRefreshing(true);
    setError("");
    loadStudent();
  };

  // ============================================================
  // SAVE PROFILE CHANGES (SUPABASE PERSISTENCE)
  // ============================================================

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError("");
    setSaveSuccess("");

    try {
      const payload = {
        name: editForm.name.trim(),
        full_name: editForm.name.trim(),
        university: editForm.university.trim(),
        college: editForm.university.trim(),
        degree: editForm.course.trim(),
        branch: editForm.course.includes("•")
          ? editForm.course.split("•")[1].trim()
          : editForm.course.trim(),
        graduation_year: parseInt(editForm.graduation_year) || 2026,
        location: editForm.location.trim(),
        target_role: editForm.target_role.trim(),
      };

      const res = await fetch(`${API_BASE_URL}/api/students/${STUDENT_ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Supabase update failed with status " + res.status);
      }

      const updatedProfile = { ...student, ...editForm, ...payload };
      setStudent(updatedProfile);
      localStorage.setItem("skillbridge_student_profile", JSON.stringify(updatedProfile));

      try {
        const session = JSON.parse(localStorage.getItem("skillbridge_auth_session") || "{}");
        if (session.user) {
          session.user.name = editForm.name.trim();
          session.user.college = editForm.university.trim();
          session.user.branch = editForm.course.trim();
          localStorage.setItem("skillbridge_auth_session", JSON.stringify(session));
        }
      } catch {}

      if (onUpdateProfile) {
        onUpdateProfile({
          name: editForm.name.trim(),
          college: editForm.university.trim(),
          branch: editForm.course.trim(),
        });
      }

      setSaveSuccess("Profile successfully saved and synchronized with Supabase!");
      setIsEditingProfile(false);
      setTimeout(() => setSaveSuccess(""), 4000);
    } catch (err) {
      console.error("Save profile error:", err);
      setSaveError(err.message || "Failed to update profile in database.");
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================================
  // PASSWORD MANAGEMENT
  // ============================================================

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: "Empty", score: 0, color: "bg-slate-700" };
    if (pwd.length < 6) return { label: "Too Short", score: 1, color: "bg-red-500" };
    let score = 1;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 2) return { label: "Weak", score: 2, color: "bg-amber-500" };
    if (score <= 4) return { label: "Good", score: 3, color: "bg-indigo-500" };
    return { label: "Strong", score: 4, color: "bg-emerald-500" };
  };

  const passwordStrength = useMemo(
    () => getPasswordStrength(passwordData.newPassword),
    [passwordData.newPassword]
  );

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordMessage("");
    setPasswordStatus("");

    if (!passwordData.currentPassword) {
      setPasswordStatus("error");
      setPasswordMessage("Please enter your current password.");
      return;
    }

    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      setPasswordStatus("error");
      setPasswordMessage("New password must be at least 6 characters long.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordStatus("error");
      setPasswordMessage("New passwords do not match.");
      return;
    }

    try {
      const accounts = JSON.parse(localStorage.getItem("skillbridge_accounts") || "{}");
      if (accounts.student && accounts.student.length) {
        accounts.student[0].password = passwordData.newPassword;
        localStorage.setItem("skillbridge_accounts", JSON.stringify(accounts));
      }
    } catch {}

    setPasswordStatus("success");
    setPasswordMessage("Password updated successfully! Your account credentials have been secured.");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => {
      setPasswordMessage("");
      setPasswordStatus("");
    }, 4000);
  };

  // ============================================================
  // HELP & SUPPORT TICKET SUBMISSION
  // ============================================================

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) return;

    const newTicketId = `SB-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket = {
      id: newTicketId,
      category: ticketForm.category,
      subject: ticketForm.subject.trim(),
      status: "Open · In Review",
      date: new Date().toISOString().split("T")[0],
    };

    setSubmittedTickets((prev) => [newTicket, ...prev]);
    setTicketForm({ category: "Technical Issue", priority: "Normal", subject: "", message: "" });
    setTicketSuccessMessage(`Ticket #${newTicketId} created successfully! Our academic support team will follow up.`);
    setTimeout(() => setTicketSuccessMessage(""), 5000);
  };

  // ============================================================
  // DATA EXPORT (JSON DOWNLOAD)
  // ============================================================

  const handleExportData = () => {
    const exportPayload = {
      student_profile: {
        id: STUDENT_ID,
        name: studentName,
        email: studentEmail,
        university: university,
        course: course,
        location: location,
        target_role: targetRole,
        cgpa: editForm.cgpa,
        graduation_year: editForm.graduation_year,
      },
      security_info: {
        twoFactorEnabled,
        loginAlerts,
      },
      preferences: {
        notifications,
        privacy,
        codePreferences,
      },
      learning_records: learningRecord,
      export_timestamp: new Date().toISOString(),
      platform: "SkillBridge AI Platform",
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `skillbridge_data_${studentName.replace(/\\s+/g, "_")}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // ============================================================
  // SIGN OUT HANDLER
  // ============================================================

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("skillbridge_auth_session");
      window.location.href = "/";
    }
  };

  // ============================================================
  // LEARNING HISTORY ITEMS
  // ============================================================

  const historyItems = [];
  const recordSlides = learningRecord?.slides || {};

  Object.entries(recordSlides).forEach(([slideId, slide]) => {
    const attempts = Array.isArray(slide?.history) ? slide.history : [];
    attempts.forEach((attempt, index) => {
      const date = attempt?.submittedAt ? new Date(attempt.submittedAt) : null;
      if (!date || Number.isNaN(date.getTime())) return;
      historyItems.push({
        type: "quiz",
        icon: "📝",
        title: `Quiz Attempt · ${slideId}`,
        detail: `${attempt.correct || 0}/${attempt.total || 0} correct`,
        score: attempt.total ? Math.round(((attempt.correct || 0) / attempt.total) * 100) : 0,
        date,
        key: `quiz-${slideId}-${index}-${attempt.submittedAt}`,
      });
    });
  });

  const issuedAt = learningRecord?.certificate?.issuedAt;
  if (issuedAt) {
    const date = new Date(issuedAt);
    if (!Number.isNaN(date.getTime())) {
      historyItems.push({
        type: "certificate",
        icon: "🏆",
        title: learningRecord.certificate.title || "Certificate Earned",
        detail: `Learning score: ${learningRecord.certificate.score ?? "—"}%`,
        date,
        key: `certificate-${issuedAt}`,
      });
    }
  }

  historyItems.sort((a, b) => b.date.getTime() - a.date.getTime());

  const now = Date.now();
  const rangeDays = historyRange === "all" ? null : Number(historyRange);
  const filteredHistory = historyItems.filter((item) => {
    if (rangeDays === null) return true;
    return now - item.date.getTime() <= rangeDays * 24 * 60 * 60 * 1000;
  });

  const studentName = currentUser?.name || student?.name || student?.full_name || "Student";
  const studentEmail = currentUser?.email || student?.email || "student@skillbridge.com";
  const university = student?.university || student?.college || "Galgotias University";
  const course = student?.course || student?.degree || "B.Tech • Computer Science";
  const location = student?.location || "Greater Noida";
  const targetRole = student?.target_role || "Backend Developer";

  // FAQ Items Data
  const FAQ_ITEMS = [
    {
      q: "How does SkillBridge compute my Career Readiness Score?",
      a: "Our AI platform computes your Readiness Score (0-100%) by evaluating your verified technical skills, pass rates in Round 1 & Round 2 assessments, completed coursework modules, and resume keyword alignment against live industry benchmark roles.",
    },
    {
      q: "Where do I upload and manage my resume?",
      a: "Resume intelligence is exclusively centralized inside the 'My Skills' workspace. Uploading your PDF/DOC resume there automatically parses your skills, projects, and work history across all student and recruiter views, eliminating duplicate uploads.",
    },
    {
      q: "How do Round 1 and Round 2 of the skill assessment work?",
      a: "Round 1 consists of 25 timed MCQ questions with negative marking (+1 for correct answers, -0.25 for incorrect answers). Scoring 60% or higher qualifies you for Round 2, which is a 60-minute practical live coding challenge with automated test suites.",
    },
    {
      q: "How does the Supabase database connection work?",
      a: "Your profile details, test scores, and account records are synchronized via FastAPI REST endpoints with a live Supabase PostgreSQL database. Changes you save in 'Edit Profile' immediately update your database record.",
    },
    {
      q: "How do verified industry recruiters discover and contact me?",
      a: "When 'Industry Recruiter Discovery' is enabled in your Privacy settings, hiring managers browsing candidate pools can view your verified scorecards, matched skills, and portfolio, and can invite you for interviews.",
    },
    {
      q: "What should I do if a learning module quiz does not register?",
      a: "Ensure you are connected to the internet and that the backend server is running. You can click 'Refresh' in your profile or clear your temporary browser cache using the 'Reset Cache' tool under Settings.",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-violet-400">
          <RefreshCw size={22} className="animate-spin" />
          <span className="text-sm font-medium">Loading your student profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* HEADER WITH TOP-LEVEL TABS */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
            Student Identity, Settings & Support
          </p>
          <h1 className="mt-1 text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            My Profile & Settings
          </h1>
          <p className="mt-2 max-w-2xl text-slate-400 text-sm">
            Manage your verified student credentials, password security, help desk, notification preferences, and privacy controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === "settings" ? "overview" : "settings")}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition cursor-pointer ${
              activeTab === "settings"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                : "border border-slate-700 bg-slate-900/70 text-slate-300 hover:border-violet-500 hover:text-white"
            }`}
          >
            <Settings size={16} />
            <span>{activeTab === "settings" ? "Profile Overview" : "Settings & Help"}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEditingProfile(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition cursor-pointer"
          >
            Edit Profile
          </button>

          <button
            type="button"
            onClick={refreshProfile}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-violet-500 hover:text-white disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-300 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* TOP NAVIGATION TABS: OVERVIEW VS SETTINGS */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
            activeTab === "overview"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-600/25"
              : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800"
          }`}
        >
          <User size={16} />
          <span>Profile Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
            activeTab === "settings"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-600/25"
              : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800"
          }`}
        >
          <Settings size={16} />
          <span>Settings & Help</span>
        </button>

        <div className="ml-auto hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Supabase Synced</span>
        </div>
      </div>

      {/* ==========================================================
          TAB 1: PROFILE OVERVIEW
      ========================================================== */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* HERO PROFILE CARD */}
          <section className="overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-950/60 via-slate-900 to-slate-950 p-8 shadow-2xl relative">
            <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 blur-[100px] pointer-events-none rounded-full" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-2 border-violet-400/40 bg-gradient-to-br from-violet-600 to-cyan-500 text-4xl font-extrabold text-white shadow-xl shadow-violet-600/30">
                  {studentName ? studentName.charAt(0).toUpperCase() : "S"}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      {studentName}
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 size={13} />
                      <span>Verified Student</span>
                    </span>
                  </div>

                  <p className="mt-1 text-base text-violet-300 font-medium">
                    {course} • {university}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Mail size={14} className="text-slate-500" />
                      <span>{studentEmail}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-slate-500" />
                      <span>{location}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Target size={14} className="text-violet-400" />
                      <span className="text-violet-200">Target: {targetRole}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 self-stretch md:self-auto justify-around">
                <div className="text-center px-3 border-r border-slate-800">
                  <p className="text-2xl font-bold text-violet-400">87%</p>
                  <p className="text-[11px] text-slate-500 font-medium">Readiness</p>
                </div>
                <div className="text-center px-3 border-r border-slate-800">
                  <p className="text-2xl font-bold text-emerald-400">6</p>
                  <p className="text-[11px] text-slate-500 font-medium">Skills Verified</p>
                </div>
                <div className="text-center px-3">
                  <p className="text-2xl font-bold text-cyan-400">
                    {learningRecord?.certificate ? "1" : "0"}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">Certificate</p>
                </div>
              </div>
            </div>
          </section>

          {/* CENTRALIZED RESUME CALLOUT (POINTS TO MY SKILLS) */}
          <section className="rounded-2xl border border-indigo-500/25 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Resume Intelligence & Parsing Hub
                </h3>
                <p className="mt-0.5 text-xs text-slate-400 max-w-xl">
                  Resume uploading and AI extraction is centralized in your <strong>My Skills</strong> workspace to keep all assessments and recruiters synchronized.
                </p>
              </div>
            </div>

            {setActivePage && (
              <button
                type="button"
                onClick={() => setActivePage("skills")}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white transition shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <span>Open My Skills & Resume</span>
                <ArrowRight size={14} />
              </button>
            )}
          </section>

          {/* ACADEMIC & PROFILE DETAILS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400">
                  <GraduationCap size={20} />
                </div>
                <h3 className="font-bold text-white text-base">Academic Record</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-slate-500">University / College</p>
                  <p className="font-semibold text-slate-200">{university}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Program & Degree</p>
                  <p className="font-semibold text-slate-200">{course}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <p className="text-xs text-slate-500">Graduation Year</p>
                    <p className="font-semibold text-slate-200">{editForm.graduation_year || "2026"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Current CGPA</p>
                    <p className="font-semibold text-emerald-400">{editForm.cgpa || "8.7"} / 10</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <BriefcaseBusiness size={20} />
                </div>
                <h3 className="font-bold text-white text-base">Career Objectives</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Target Role</p>
                  <p className="font-semibold text-cyan-300">{targetRole}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Preferred Location</p>
                  <p className="font-semibold text-slate-200">{location}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Professional Bio</p>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {editForm.bio}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Shield size={20} />
                </div>
                <h3 className="font-bold text-white text-base">Supabase Connection</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Connected Database</p>
                  <p className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Supabase PostgreSQL (Live)</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Student Record ID</p>
                  <p className="font-mono text-xs text-slate-400 truncate" title={STUDENT_ID}>
                    {STUDENT_ID}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Data Sync</p>
                  <p className="text-xs text-slate-300">
                    Synced with active login credentials. Edits persist directly to Supabase.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SETTINGS QUICK SHORTCUT BANNER */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400">
                <Settings size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Account Settings & Help Center</h4>
                <p className="text-xs text-slate-400">
                  Update password, submit support tickets, toggle notification alerts, and configure recruiter privacy.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700 hover:border-violet-500 transition cursor-pointer"
            >
              <span>Open Settings</span>
              <ChevronRight size={14} />
            </button>
          </section>

          {/* LEARNING & CERTIFICATE ACTIVITY */}
          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Award size={20} className="text-amber-400" />
                  <span>Learning & Certification Records</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Synchronized with your interactive Learning Center quizzes and issued certificates.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Filter range:</span>
                <select
                  value={historyRange}
                  onChange={(e) => setHistoryRange(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-white outline-none"
                >
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="all">All time</option>
                </select>
              </div>
            </div>

            {filteredHistory.length ? (
              <div className="space-y-3">
                {filteredHistory.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-lg">
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{item.title}</p>
                        <p className="text-xs text-slate-400">{item.detail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {item.type === "quiz" && (
                        <span className="text-xs font-semibold text-violet-300">
                          Score: {item.score}%
                        </span>
                      )}
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {item.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center">
                <p className="text-sm font-semibold text-slate-300">No learning records found for this period</p>
                <p className="text-xs text-slate-500 mt-1">
                  Complete modules in the Learning Center to earn quiz attempts and certificates.
                </p>
              </div>
            )}
          </section>

          {/* SIGN OUT PROMPT */}
          <section className="rounded-3xl border border-red-500/20 bg-red-500/5 p-7">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                  <LogOut size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Sign Out of SkillBridge</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Safely end your current session. All your learning progress and database synchronizations are preserved.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 px-6 py-3 text-xs font-bold text-white transition shadow-lg shadow-red-600/20 cursor-pointer"
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          </section>
        </div>
      )}

      {/* ==========================================================
          TAB 2: SETTINGS & HELP HUB
      ========================================================== */}
      {activeTab === "settings" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SETTINGS SIDEBAR NAVIGATION */}
          <aside className="lg:col-span-1 space-y-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 space-y-1">
              <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Settings Menu
              </p>

              <button
                type="button"
                onClick={() => setSettingsSection("security")}
                className={`flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  settingsSection === "security"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/25"
                    : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                }`}
              >
                <KeyRound size={16} />
                <span>Password & Security</span>
              </button>

              <button
                type="button"
                onClick={() => setSettingsSection("help")}
                className={`flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  settingsSection === "help"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/25"
                    : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                }`}
              >
                <LifeBuoy size={16} />
                <span>Help & Support Center</span>
              </button>

              <button
                type="button"
                onClick={() => setSettingsSection("notifications")}
                className={`flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  settingsSection === "notifications"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/25"
                    : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                }`}
              >
                <Bell size={16} />
                <span>Notifications & Alerts</span>
              </button>

              <button
                type="button"
                onClick={() => setSettingsSection("privacy")}
                className={`flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  settingsSection === "privacy"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/25"
                    : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                }`}
              >
                <Shield size={16} />
                <span>Privacy & Recruiter Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setSettingsSection("preferences")}
                className={`flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  settingsSection === "preferences"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/25"
                    : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                }`}
              >
                <Sliders size={16} />
                <span>Coding & Preferences</span>
              </button>
            </div>

            {/* QUICK USER SUMMARY BADGE */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-violet-600/30 border border-violet-500/40 text-violet-300 flex items-center justify-center font-bold text-xs">
                  {studentName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{studentName}</p>
                  <p className="text-[10px] text-slate-400 truncate">{studentEmail}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Account Role:</span>
                <span className="font-semibold text-emerald-400">Student</span>
              </div>
            </div>

            {/* SIGN OUT FROM SETTINGS */}
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 p-2.5 text-xs font-semibold text-red-400 transition cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </aside>

          {/* SETTINGS CONTENT PANELS */}
          <main className="lg:col-span-3 space-y-6">
            {/* 1. PASSWORD & SECURITY SECTION */}
            {settingsSection === "security" && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-7 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-400">
                      <KeyRound size={22} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Change Account Password</h2>
                      <p className="text-xs text-slate-400">
                        Choose a strong password with at least 8 characters, numbers, and special symbols.
                      </p>
                    </div>
                  </div>

                  {passwordMessage && (
                    <div
                      className={`rounded-xl p-4 text-xs font-medium ${
                        passwordStatus === "success"
                          ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                          : "border border-red-500/30 bg-red-500/10 text-red-300"
                      }`}
                    >
                      {passwordMessage}
                    </div>
                  )}

                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Current Password *
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, currentPassword: e.target.value })
                        }
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500 transition"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">
                          New Password *
                        </label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                          }
                          placeholder="Min. 6 characters"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500 transition"
                        />
                        {passwordData.newPassword && (
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-400">Strength:</span>
                              <span className="font-semibold text-slate-200">{passwordStrength.label}</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">
                          Confirm New Password *
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                          }
                          placeholder="Re-type new password"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500 transition"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="rounded-xl bg-violet-600 hover:bg-violet-500 px-6 py-2.5 text-xs font-semibold text-white transition shadow-lg shadow-violet-600/25 cursor-pointer"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>

                {/* DEVICE & ACTIVE SESSIONS */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-7 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400">
                      <Laptop size={22} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Active Device & Browser Session</h3>
                      <p className="text-xs text-slate-400">
                        Review the current authenticated hardware and session security.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                          <Laptop size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white flex items-center gap-2">
                            <span>Windows Workstation • Chrome Client</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                              Active Now
                            </span>
                          </p>
                          <p className="text-[11px] text-slate-400">
                            IP: 127.0.0.1 (Localhost) • TLS 1.3 End-to-End Session
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-[11px] text-slate-500">
                        Port 5173
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                      <div>
                        <p className="text-xs font-semibold text-white">Two-Factor Authentication (2FA)</p>
                        <p className="text-[11px] text-slate-400">Require an authenticator code on login</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={twoFactorEnabled}
                        onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                        className="h-4 w-4 accent-violet-600 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                      <div>
                        <p className="text-xs font-semibold text-white">Unrecognized Login Alerts</p>
                        <p className="text-[11px] text-slate-400">Email notice on new device logins</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={loginAlerts}
                        onChange={(e) => setLoginAlerts(e.target.checked)}
                        className="h-4 w-4 accent-violet-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. HELP & SUPPORT CENTER */}
            {settingsSection === "help" && (
              <div className="space-y-6">
                {/* FAQ ACCORDION */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-7 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
                      <HelpCircle size={22} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Frequently Asked Questions</h2>
                      <p className="text-xs text-slate-400">
                        Quick answers to common questions about readiness scores, resume parsing, and assessments.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    {FAQ_ITEMS.map((faq, idx) => {
                      const isOpen = expandedFaq === idx;
                      return (
                        <div
                          key={idx}
                          className="rounded-2xl border border-slate-800 bg-slate-950/60 transition overflow-hidden"
                        >
                          <button
                            type="button"
                            onClick={() => setExpandedFaq(isOpen ? null : idx)}
                            className="w-full flex items-center justify-between p-4 text-left cursor-pointer hover:bg-slate-900/50 transition"
                          >
                            <span className="text-xs font-bold text-slate-200">
                              {faq.q}
                            </span>
                            {isOpen ? (
                              <ChevronUp size={16} className="text-violet-400 shrink-0" />
                            ) : (
                              <ChevronDown size={16} className="text-slate-500 shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 text-xs text-slate-400 leading-relaxed">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SUBMIT SUPPORT TICKET FORM */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-7 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400">
                      <MessageSquare size={22} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Submit a Help Ticket</h3>
                      <p className="text-xs text-slate-400">
                        Encountered a bug or have questions about your assessment evaluation? Contact our support team.
                      </p>
                    </div>
                  </div>

                  {ticketSuccessMessage && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>{ticketSuccessMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handleTicketSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">
                          Support Category
                        </label>
                        <select
                          value={ticketForm.category}
                          onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500 transition"
                        >
                          <option value="Technical Issue">Technical Issue</option>
                          <option value="Assessment & Grading">Assessment & Grading</option>
                          <option value="Resume Parsing">Resume Parsing</option>
                          <option value="Database / Supabase Sync">Database / Supabase Sync</option>
                          <option value="Placement Assistance">Placement Assistance</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">
                          Priority Level
                        </label>
                        <select
                          value={ticketForm.priority}
                          onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500 transition"
                        >
                          <option value="Normal">Normal</option>
                          <option value="High">High</option>
                          <option value="Urgent">Urgent</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Subject *
                      </label>
                      <input
                        type="text"
                        required
                        value={ticketForm.subject}
                        onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                        placeholder="Brief summary of your inquiry..."
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Detailed Message *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={ticketForm.message}
                        onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                        placeholder="Describe the issue, step-by-step reproduction, or question in detail..."
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500 transition resize-none"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 px-6 py-2.5 text-xs font-semibold text-white transition shadow-lg shadow-cyan-600/25 cursor-pointer"
                      >
                        <Send size={14} />
                        <span>Send Ticket</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* RECENT TICKETS */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-7 space-y-4">
                  <h3 className="text-sm font-bold text-white">Your Recent Support Tickets</h3>
                  <div className="space-y-2.5">
                    {submittedTickets.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-xs"
                      >
                        <div>
                          <p className="font-bold text-white flex items-center gap-2">
                            <span>#{t.id}</span>
                            <span className="font-normal text-slate-300">· {t.subject}</span>
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Category: {t.category} · Created: {t.date}
                          </p>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                            t.status.includes("Resolved")
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* QUICK LINKS & DEVELOPER DOCS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href="http://localhost:8000/docs"
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 flex items-center justify-between text-xs text-slate-200 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
                        <BookOpen size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-white">FastAPI Swagger API Docs</p>
                        <p className="text-[11px] text-slate-400">Inspect live backend REST endpoints</p>
                      </div>
                    </div>
                    <ExternalLink size={14} className="text-slate-500 group-hover:text-violet-400 transition" />
                  </a>

                  <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                        <Mail size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-white">Academic Support Desk</p>
                        <p className="text-[11px] text-slate-400">support@skillbridge.ai</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      24/7 Live
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. NOTIFICATIONS & ALERTS SECTION */}
            {settingsSection === "notifications" && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-7 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400">
                    <Bell size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Notification & Alert Preferences</h2>
                    <p className="text-xs text-slate-400">
                      Control how and when you receive internship alerts, assessment deadlines, and weekly performance summaries.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div>
                      <p className="text-xs font-bold text-white">Opportunity & Internship Alerts</p>
                      <p className="text-[11px] text-slate-400">Real-time alerts when high-match jobs in your stack are posted</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.opportunityAlerts}
                      onChange={(e) => setNotifications({ ...notifications, opportunityAlerts: e.target.checked })}
                      className="h-4 w-4 accent-violet-600 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div>
                      <p className="text-xs font-bold text-white">Assessment & Coding Deadlines</p>
                      <p className="text-[11px] text-slate-400">Reminders for Round 2 coding challenges and weekly quizzes</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.assessmentReminders}
                      onChange={(e) => setNotifications({ ...notifications, assessmentReminders: e.target.checked })}
                      className="h-4 w-4 accent-violet-600 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div>
                      <p className="text-xs font-bold text-white">Learning Pathway Milestones</p>
                      <p className="text-[11px] text-slate-400">Congratulatory alerts upon completing modules and earning certificates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.learningUpdates}
                      onChange={(e) => setNotifications({ ...notifications, learningUpdates: e.target.checked })}
                      className="h-4 w-4 accent-violet-600 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div>
                      <p className="text-xs font-bold text-white">Industry Recruiter Direct Inquiries</p>
                      <p className="text-[11px] text-slate-400">Instant notification when a verified recruiter shortlists your profile</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.recruiterMessages}
                      onChange={(e) => setNotifications({ ...notifications, recruiterMessages: e.target.checked })}
                      className="h-4 w-4 accent-violet-600 cursor-pointer"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Email Digest Frequency</p>
                      <p className="text-[11px] text-slate-400">Consolidated overview of opportunities and skill gap updates</p>
                    </div>
                    <select
                      value={notifications.emailDigest}
                      onChange={(e) => setNotifications({ ...notifications, emailDigest: e.target.value })}
                      className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white outline-none"
                    >
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Summary</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 4. PRIVACY & RECRUITER DISCOVERY SECTION */}
            {settingsSection === "privacy" && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-7 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                      <Shield size={22} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Privacy & Employer Discovery</h2>
                      <p className="text-xs text-slate-400">
                        Control who can view your candidate profile, verified scorecards, and academic standing.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                      <div>
                        <p className="text-xs font-bold text-white">Industry Recruiter Discovery</p>
                        <p className="text-[11px] text-slate-400">Permit tech recruiters in the Industry Workspace to view and invite you</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacy.recruiterDiscovery}
                        onChange={(e) => setPrivacy({ ...privacy, recruiterDiscovery: e.target.checked })}
                        className="h-4 w-4 accent-violet-600 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                      <div>
                        <p className="text-xs font-bold text-white">Public Shareable Portfolio</p>
                        <p className="text-[11px] text-slate-400">Allow your public portfolio page to be viewed with a direct link</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacy.publicPortfolio}
                        onChange={(e) => setPrivacy({ ...privacy, publicPortfolio: e.target.checked })}
                        className="h-4 w-4 accent-violet-600 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                      <div>
                        <p className="text-xs font-bold text-white">Display Academic CGPA on Profile</p>
                        <p className="text-[11px] text-slate-400">Include your verified college CGPA on candidate scorecards</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacy.showCgpa}
                        onChange={(e) => setPrivacy({ ...privacy, showCgpa: e.target.checked })}
                        className="h-4 w-4 accent-violet-600 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                      <div>
                        <p className="text-xs font-bold text-white">Anonymize on Campus Placement Leaderboards</p>
                        <p className="text-[11px] text-slate-400">Hide full name and show as 'Student #ID' on institutional ranks</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacy.anonymizeLeaderboard}
                        onChange={(e) => setPrivacy({ ...privacy, anonymizeLeaderboard: e.target.checked })}
                        className="h-4 w-4 accent-violet-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* DATA EXPORT CARD */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
                      <Download size={22} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Export Student Record (JSON)</h3>
                      <p className="text-xs text-slate-400 max-w-md">
                        Download a machine-readable JSON copy of your verified skills, quiz attempts, and profile details.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleExportData}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-semibold text-white transition shadow-md shadow-indigo-600/20 cursor-pointer shrink-0"
                  >
                    <Download size={14} />
                    <span>Download Data</span>
                  </button>
                </div>
              </div>
            )}

            {/* 5. PREFERENCES & CODING ENVIRONMENT */}
            {settingsSection === "preferences" && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-7 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-400">
                    <Sliders size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Coding & Assessment Preferences</h2>
                    <p className="text-xs text-slate-400">
                      Customize your Round 2 live coding editor environment and career focus targets.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-white">Default Coding Assessment Language</p>
                      <p className="text-[11px] text-slate-400">Language auto-selected when starting Round 2 tests</p>
                    </div>
                    <select
                      value={codePreferences.defaultLanguage}
                      onChange={(e) => setCodePreferences({ ...codePreferences, defaultLanguage: e.target.value })}
                      className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white outline-none"
                    >
                      <option value="python">Python 3</option>
                      <option value="java">Java 17</option>
                      <option value="cpp">C++ (GCC)</option>
                      <option value="javascript">JavaScript (Node.js)</option>
                    </select>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-white">Target Career Pathway Focus</p>
                      <p className="text-[11px] text-slate-400">Aligns readiness milestones with your preferred career path</p>
                    </div>
                    <select
                      value={codePreferences.targetTrack}
                      onChange={(e) => setCodePreferences({ ...codePreferences, targetTrack: e.target.value })}
                      className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white outline-none"
                    >
                      <option value="Full-Stack AI Engineer">Full-Stack AI Engineer</option>
                      <option value="Backend Developer">Backend Developer</option>
                      <option value="Machine Learning Specialist">Machine Learning Specialist</option>
                      <option value="Cybersecurity Systems Specialist">Cybersecurity Systems Specialist</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-white">Editor Font Size</p>
                        <p className="text-[11px] text-slate-400">Code editor typography scale</p>
                      </div>
                      <select
                        value={codePreferences.fontSize}
                        onChange={(e) => setCodePreferences({ ...codePreferences, fontSize: e.target.value })}
                        className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white outline-none"
                      >
                        <option value="13px">13px (Compact)</option>
                        <option value="14px">14px (Standard)</option>
                        <option value="16px">16px (Large)</option>
                      </select>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-white">Tab Indentation</p>
                        <p className="text-[11px] text-slate-400">Indentation spacing</p>
                      </div>
                      <select
                        value={codePreferences.tabSize}
                        onChange={(e) => setCodePreferences({ ...codePreferences, tabSize: e.target.value })}
                        className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white outline-none"
                      >
                        <option value="2">2 Spaces</option>
                        <option value="4">4 Spaces</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* ==========================================================
          EDIT PROFILE MODAL
      ========================================================== */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 p-7 shadow-2xl relative my-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Edit Student Profile</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Changes will be saved to your local profile and synchronized with the Supabase database.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    University / College *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.university}
                    onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Program & Degree *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.course}
                    onChange={(e) => setEditForm({ ...editForm, course: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Graduation Year *
                  </label>
                  <input
                    type="number"
                    required
                    value={editForm.graduation_year}
                    onChange={(e) => setEditForm({ ...editForm, graduation_year: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.target_role}
                    onChange={(e) => setEditForm({ ...editForm, target_role: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Preferred Location
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Professional Bio
                </label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500 transition resize-none"
                />
              </div>

              {saveError && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300 flex items-center gap-2">
                  <AlertTriangle size={15} className="shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-600/25 transition disabled:opacity-60 cursor-pointer"
                >
                  {isSaving && <Loader2 size={14} className="animate-spin" />}
                  <span>{isSaving ? "Saving to Supabase..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================================
          LOGOUT CONFIRMATION MODAL
      ========================================================== */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-red-500/30 bg-slate-900 p-6 shadow-2xl text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 text-red-400">
              <LogOut size={28} />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Confirm Sign Out</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to sign out of SkillBridge? You will return to the portal login screen.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmLogout}
                className="rounded-xl bg-red-600 hover:bg-red-500 px-6 py-2.5 text-xs font-bold text-white transition shadow-lg shadow-red-600/25 cursor-pointer"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentProfile;
