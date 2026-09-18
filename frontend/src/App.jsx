import { useEffect, useState } from "react";
import { AdminLoginScreen, AdminDashboard } from "./pages/AdminPortal";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Dashboard from "./pages/Dashboard";
import Skills from "./pages/Skills";
import Assessment from "./pages/Assessment";
import Career from "./pages/Career";
import Opportunities from "./pages/Opportunities";
import Applications from "./pages/Applications";
import Portfolio from "./pages/Portfolio";
import LearningCenter from "./pages/LearningCenter";
import StudentProfile from "./pages/StudentProfile";

import Industry from "./pages/Industry";
import Institution from "./pages/Institution";
import { API_URL } from "./config/api";

import {
  GraduationCap,
  Factory,
  Building2,
  ArrowRight,
  Sparkles,
  Mail,
  Lock,
  ArrowLeft,
  Phone,
  UserPlus,
  CheckCircle2,
  Zap,
  Briefcase,
  Eye,
  EyeOff,
  Brain,
  Target,
  Menu,
  X,
} from "lucide-react";



// ============================================================
// PORTAL TYPES
// ============================================================

const PORTALS = {
  student: {
    title: "Student",
    subtitle: "Student Portal",
    description:
      "Build skills, take assessments, discover opportunities and grow your career.",
    icon: GraduationCap,
    color: "indigo",
  },

  industry: {
    title: "Industry",
    subtitle: "Industry Portal",
    description:
      "Discover skilled candidates, post opportunities and manage recruitment.",
    icon: Factory,
    color: "emerald",
  },

  institution: {
    title: "Institution",
    subtitle: "Institute Portal",
    description:
      "Manage students, monitor skills and track placement analytics.",
    icon: Building2,
    color: "amber",
  },
};


// API_URL is imported from ./config/api for development and production support.


// ============================================================
// APP
// ============================================================

function App() {

  // ----------------------------------------------------------
  // SESSION PERSISTENCE & INITIALIZATION
  // ----------------------------------------------------------

  const getInitialSession = () => {
    try {
      const saved = localStorage.getItem("skillbridge_auth_session");
      const token = localStorage.getItem("skillbridge_auth_token");
      if (saved && token) return JSON.parse(saved);

      // Old browser-only/demo sessions are no longer valid in real-auth mode.
      localStorage.removeItem("skillbridge_auth_session");
      localStorage.removeItem("skillbridge_accounts");
    } catch (e) {
      console.error("Session parse error:", e);
    }
    return null;
  };

  const initialSession = getInitialSession();

  // ----------------------------------------------------------
  // CURRENT PORTAL
  // ----------------------------------------------------------

  const [selectedPortal, setSelectedPortal] = useState(
    initialSession?.portal || "student"
  );

  const [portalStarted, setPortalStarted] = useState(
    Boolean(initialSession?.isLoggedIn)
  );

  // ----------------------------------------------------------
  // LOGIN / ACCOUNT
  // ----------------------------------------------------------

  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(initialSession?.isLoggedIn)
  );
  const [currentUser, setCurrentUser] = useState(
    initialSession?.user || null
  );
  const [loginStarted, setLoginStarted] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  // ── ADMIN STATE ──────────────────────────────────────────
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try { return Boolean(sessionStorage.getItem("admin_token")); } catch { return false; }
  });
  const [adminUser, setAdminUser] = useState(() => {
    try { const u = sessionStorage.getItem("admin_user"); return u ? JSON.parse(u) : null; } catch { return null; }
  });
  const [adminToken, setAdminToken] = useState(() => {
    try { return sessionStorage.getItem("admin_token") || null; } catch { return null; }
  });
  const [registrationPending, setRegistrationPending] = useState(false);
  const isAdminRoute = window.location.pathname === "/admin";


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");

  const [authError, setAuthError] = useState("");

  // Industry portal workspace state
  const getIndustryPageFromPath = () => {
    const path = window.location.pathname;
    const page = path.replace(/^\/industry\/?/, "").split("/")[0];

    const allowedPages = [
      "dashboard",
      "opportunities",
      "candidates",
      "recruitment",
      "analytics",
      "profile",
      "settings",
    ];

    return allowedPages.includes(page) ? page : null;
  };

  const [activeIndustryPage, setActiveIndustryPage] = useState(() =>
    getIndustryPageFromPath() ||
    (initialSession?.portal === "industry" && initialSession?.activePage
      ? initialSession.activePage
      : "dashboard")
  );
  const [showIndustryPostModal, setShowIndustryPostModal] = useState(false);
  const [industryRefreshTrigger, setIndustryRefreshTrigger] = useState(0);
  const [industryRefreshing, setIndustryRefreshing] = useState(false);

  // Institution workspace state
  const [activeInstitutionPage, setActiveInstitutionPage] = useState("dashboard");

  // ----------------------------------------------------------
  // STUDENT PAGE
  // ----------------------------------------------------------

  const getStudentPageFromPath = () => {

    const path = window.location.pathname;

    switch (path) {

      case "/":
      case "/dashboard":
        return "dashboard";

      case "/skills":
        return "skills";

      case "/assessment":
        return "assessment";

      case "/career":
        return "career";

      case "/learning":
        return "learning";

      case "/opportunities":
        return "opportunities";

      case "/applications":
        return "applications";

      case "/portfolio":
        return "portfolio";

      case "/student-profile":
        return "student-profile";

      case "/settings":
        return "student-profile";

      default:
        return "dashboard";
    }
  };


  const [activeStudentPage, setActiveStudentPage] = useState(
    initialSession?.portal === "student" && initialSession?.activePage
      ? initialSession.activePage
      : getStudentPageFromPath()
  );


  // ----------------------------------------------------------
  // INITIAL STATE
  // ----------------------------------------------------------

  useEffect(() => {
    if (!initialSession?.isLoggedIn) {
      setPortalStarted(false);
    }
  }, []);



  // ==========================================================
  // STUDENT NAVIGATION
  // ==========================================================

  const setActivePage = (page) => {
    setActiveStudentPage(page);

    const pathMap = {
      dashboard: "/dashboard",
      skills: "/skills",
      assessment: "/assessment",
      career: "/career",
      learning: "/learning",
      opportunities: "/opportunities",
      applications: "/applications",
      portfolio: "/portfolio",
      "student-profile": "/student-profile",
      settings: "/student-profile",
    };

    const newPath = pathMap[page] || "/dashboard";
    window.history.pushState({}, "", newPath);

    try {
      const session = JSON.parse(localStorage.getItem("skillbridge_auth_session") || "{}");
      localStorage.setItem(
        "skillbridge_auth_session",
        JSON.stringify({ ...session, activePage: page })
      );
    } catch {}
  };

  // ==========================================================
  // INDUSTRY NAVIGATION
  // ==========================================================

  const handleIndustryPageChange = (page) => {
    const allowedPages = [
      "dashboard",
      "opportunities",
      "candidates",
      "recruitment",
      "analytics",
      "profile",
      "settings",
    ];

    const nextPage = allowedPages.includes(page) ? page : "dashboard";
    setActiveIndustryPage(nextPage);

    const pathMap = {
      dashboard: "/industry/dashboard",
      opportunities: "/industry/opportunities",
      candidates: "/industry/candidates",
      recruitment: "/industry/recruitment",
      analytics: "/industry/analytics",
      profile: "/industry/profile",
      settings: "/industry/settings",
    };

    const newPath = pathMap[nextPage] || "/industry/dashboard";
    window.history.pushState({}, "", newPath);

    try {
      const session = JSON.parse(localStorage.getItem("skillbridge_auth_session") || "{}");
      localStorage.setItem(
        "skillbridge_auth_session",
        JSON.stringify({ ...session, activePage: nextPage })
      );
    } catch {}
  };

  // ==========================================================
  // INSTITUTION NAVIGATION
  // ==========================================================

  const handleInstitutionPageChange = (page) => {
    setActiveInstitutionPage(page);
  };

  // ==========================================================
  // INDUSTRY REFRESH TRIGGER
  // ==========================================================

  const handleIndustryRefresh = () => {
    setIndustryRefreshing(true);
    setIndustryRefreshTrigger((prev) => prev + 1);
    setTimeout(() => {
      setIndustryRefreshing(false);
    }, 800);
  };

  // ==========================================================
  // UPDATE PROFILE (TOPBAR & LOCALSTORAGE SYNC)
  // ==========================================================

  const handleUpdateProfile = (updatedData) => {
    setCurrentUser((prev) => {
      const merged = { ...prev, ...updatedData };
      try {
        const session = JSON.parse(localStorage.getItem("skillbridge_auth_session") || "{}");
        localStorage.setItem(
          "skillbridge_auth_session",
          JSON.stringify({ ...session, user: merged })
        );
      } catch {}
      return merged;
    });
  };


  // ----------------------------------------------------------
  // BROWSER BACK / FORWARD
  // ----------------------------------------------------------

  useEffect(() => {

    const handlePopState = () => {

      setActiveStudentPage(
        getStudentPageFromPath()
      );

    };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {

      window.removeEventListener(
        "popstate",
        handlePopState
      );

    };

  }, []);


  // ==========================================================
  // SELECT PORTAL
  // ==========================================================

  const handlePortalSelect = (portal) => {

    setSelectedPortal(portal);

    setLoginStarted(false);
    setAuthMode("login");
    clearAuthFields();

  };


  // ==========================================================
  // CLEAR AUTH FIELDS
  // ==========================================================

  const clearAuthFields = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setContact("");
    setAuthError("");
  };


  // ==========================================================
  // CONTINUE TO LOGIN
  // ==========================================================

  const handleContinue = () => {
    clearAuthFields();
    setAuthMode("login");
    setLoginStarted(true);
  };

  const handleSelectAndGoToLogin = (portal) => {
    setSelectedPortal(portal);
    clearAuthFields();
    setAuthMode("login");
    setLoginStarted(true);
  };

  // ==========================================================
  // SESSION PERSISTENCE HELPER
  // ==========================================================

  const saveSession = (loggedIn, portal, user, page) => {
    try {
      if (loggedIn) {
        localStorage.setItem(
          "skillbridge_auth_session",
          JSON.stringify({
            isLoggedIn: true,
            portal,
            user,
            activePage: page,
          })
        );
      } else {
        localStorage.removeItem("skillbridge_auth_session");
        localStorage.removeItem("skillbridge_industry_logged_in");
        localStorage.removeItem("industryLoggedIn");
      }
    } catch {}
  };

  // ==========================================================
  // LOGIN SUCCESS
  // ==========================================================

  const completeLogin = (customUser, token) => {
    setAuthError("");
    setIsLoggedIn(true);

    const authRole = customUser?.authPortal || selectedPortal;
    const loggedUser = customUser;
    if (!loggedUser) return;

    const userWithAuth = {
      ...loggedUser,
      authPortal: authRole,
    };

    if (token) localStorage.setItem("skillbridge_auth_token", token);

    setCurrentUser(userWithAuth);

    // Synchronize student credentials with Supabase database!
    if (authRole === "student" || selectedPortal === "student") {
      try {
        localStorage.setItem(
          "skillbridge_student_profile",
          JSON.stringify({
            name: userWithAuth.name,
            email: userWithAuth.email,
            university: userWithAuth.college || "Galgotias University",
            college: userWithAuth.college || "Galgotias University",
            course: userWithAuth.branch || "Computer Science",
            branch: userWithAuth.branch || "Computer Science",
          })
        );
      } catch {}

      fetch(`${API_URL}/students/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          id: userWithAuth.id,
          name: userWithAuth.name,
          email: userWithAuth.email,
          college: userWithAuth.college || "Galgotias University",
          branch: userWithAuth.branch || "Computer Science",
        }),
      }).catch((err) => console.warn("Supabase database sync note:", err));
    }

    const initialPage = "dashboard";
    if (selectedPortal === "industry") {
      setActiveIndustryPage("dashboard");
      window.history.pushState({}, "", "/industry/dashboard");
    } else if (selectedPortal === "student") {
      setActiveStudentPage("dashboard");
      window.history.pushState({}, "", "/dashboard");
    }

    saveSession(true, selectedPortal, userWithAuth, initialPage);
  };


  // ==========================================================
  // EMAIL LOGIN
  // ==========================================================

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, portal: selectedPortal }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Unable to sign in.");
      completeLogin(data.user, data.token);
    } catch (error) {
      setAuthError(error.message || "Unable to connect to the sign-in service.");
    }
  };


  // ==========================================================
  // CREATE ACCOUNT
  // ==========================================================

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setAuthError("");

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !contact.trim()
    ) {
      setAuthError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }

    if (!/^[0-9]{10}$/.test(contact.trim())) {
      setAuthError("Contact number must contain exactly 10 digits.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName.trim()} ${lastName.trim()}`,
          email: email.trim().toLowerCase(),
          password,
          portal: selectedPortal,
          phone: contact.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Unable to create your account.");
      setPassword("");
      setRegistrationPending(true);
    } catch (error) {
      setAuthError(error.message || "Unable to connect to the registration service.");
    }
  };


  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginStarted(false);
    setAuthMode("login");
    setSelectedPortal("student");
    setPortalStarted(false);
    clearAuthFields();
    setCurrentUser(null);
    setActiveStudentPage("dashboard");
    setActiveIndustryPage("dashboard");
    saveSession(false);
    localStorage.removeItem("skillbridge_auth_token");
    localStorage.removeItem("skillbridge_accounts");
    window.history.pushState({}, "", "/");
  };


  // ==========================================================
  // SWITCH PORTAL
  // ==========================================================

  const switchPortal = (portal) => {
    // RBAC Permissions Enforcement
    const activeAuthPortal = currentUser?.authPortal || initialSession?.portal || "student";

    if (portal !== activeAuthPortal) {
      alert("Access Restricted: Please sign in with an account for that portal.");
      return;
    }

    setSelectedPortal(portal);
    setPortalStarted(false);

    const defaultUser = currentUser
      ? { ...currentUser, authPortal: activeAuthPortal }
      : null;
    let initialPage = "dashboard";

    if (portal === "industry") {
      setActiveIndustryPage("dashboard");
      window.history.pushState({}, "", "/industry/dashboard");
    } else if (portal === "student") {
      setActiveStudentPage("dashboard");
      window.history.pushState({}, "", "/dashboard");
    } else {
      setActiveInstitutionPage("dashboard");
      window.history.pushState({}, "", "/");
    }

    if (isLoggedIn && defaultUser) {
      setCurrentUser(defaultUser);
      saveSession(true, portal, defaultUser, initialPage);
    } else {
      window.history.pushState({}, "", "/");
    }
  };


  // ==========================================================
  // ADMIN PORTAL ROUTES  (/admin)
  // ==========================================================

  if (isAdminRoute) {
    if (!isAdminLoggedIn) {
      return (
        <AdminLoginScreen
          onLogin={(admin, token) => {
            setAdminUser(admin);
            setAdminToken(token);
            setIsAdminLoggedIn(true);
          }}
        />
      );
    }
    return (
      <AdminDashboard
        admin={adminUser}
        token={adminToken}
        onLogout={() => {
          sessionStorage.removeItem("admin_token");
          sessionStorage.removeItem("admin_user");
          setIsAdminLoggedIn(false);
          setAdminUser(null);
          setAdminToken(null);
        }}
      />
    );
  }

  // ==========================================================
  // REGISTRATION PENDING SCREEN
  // ==========================================================

  if (registrationPending) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Request Submitted! 🎉</h2>
          <p className="text-slate-400 text-base leading-relaxed mb-4">
            Your access request has been sent to the SkillBridge AI admin team.<br />
            <strong className="text-white">The admin team has been notified via email and will review your request shortly.</strong>
          </p>
          <p className="text-xs text-slate-500 mb-8 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
            ⏱ Usually approved within a few hours. You'll receive an email once your account is approved.
          </p>
          <button
            type="button"
            onClick={() => { setRegistrationPending(false); setLoginStarted(false); setPortalStarted(false); }}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition cursor-pointer border border-slate-700 hover:border-slate-500 px-5 py-2.5 rounded-xl"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ==========================================================
  // COMMON PORTAL SELECTION SCREEN
  // ==========================================================


  // Shared header component (contact bar + navbar) used on both public screens
  const PublicHeader = ({ onLoginClick }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
      <>
        <div className="public-contact-bar w-full bg-gradient-to-r from-indigo-700 via-violet-700 to-indigo-700 text-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-10 text-center">
            <a href="tel:01204806824" className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] sm:text-sm font-medium">Call us : 0120-4806824</span>
            </a>
            <a href="mailto:support@skillbridge.ai" className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] sm:text-sm font-medium">E-mail : support@skillbridge.ai</span>
            </a>
          </div>
        </div>
        <nav className="w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="SkillBridge AI" className="w-9 h-9 sm:w-11 sm:h-11 object-contain shrink-0" />
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-800 whitespace-nowrap">
                SkillBridge <span className="text-indigo-600">AI</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 sm:gap-2">
              <a href="#home" className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-all">Home</a>
              <a href="#features" className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-all">Features</a>
              <a href="#about" className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-all">About Us</a>
              <button type="button" onClick={onLoginClick}
                className="ml-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/25 cursor-pointer">
                Login
              </button>
            </div>

            {/* Mobile Actions: Login + Hamburger Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <button type="button" onClick={onLoginClick}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all">
                Login
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-all focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 bg-white px-4 py-2 space-y-1 shadow-md">
              <a
                href="#home"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50 rounded-lg"
              >
                Home
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50 rounded-lg"
              >
                Features
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50 rounded-lg"
              >
                About Us
              </a>
            </div>
          )}
        </nav>
      </>
    );
  };

  // ==========================================================
  // SCREEN A: PUBLIC LANDING PAGE (no portal cards)
  // ==========================================================
  if (!isLoggedIn && !loginStarted && !portalStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-x-hidden">

        <PublicHeader onLoginClick={() => setPortalStarted(true)} />

        {/* ── HERO ── */}
        <div id="home" className="relative flex flex-col items-center px-6 pt-24 pb-20 text-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-500/5 blur-[140px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-violet-500/5 blur-[120px] pointer-events-none rounded-full" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" /><span>AI-Powered Career & Recruitment Platform</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              <span className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-500 bg-clip-text text-transparent">Bridge the Gap Between<br /></span>
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Skills & Careers</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
              SkillBridge AI connects students, institutions and industry through intelligent skill assessment, personalized learning paths and AI-powered job matching.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button type="button" onClick={() => setPortalStarted(true)}
                className="inline-flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/30 cursor-pointer text-base">
                <Zap className="w-5 h-5" />Get Started Free<ArrowRight className="w-5 h-5" />
              </button>
              <a href="#features"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium px-6 py-4 rounded-2xl border border-gray-300 hover:border-gray-400 transition-all text-base bg-white hover:bg-gray-50">
                Explore Features
              </a>
            </div>
            <div className="mt-14 grid grid-cols-3 gap-6 max-w-xl mx-auto">
              {[{ value: "10K+", label: "Students" }, { value: "500+", label: "Companies" }, { value: "95%", label: "Placement Rate" }].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-extrabold text-slate-800">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SITE FEATURES ── */}
        <section id="features" className="w-full bg-white border-t border-gray-100 py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-indigo-600 mb-3">Platform Features</p>
            <h2 className="text-center text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">Everything You Need to Succeed</h2>
            <p className="text-center text-slate-500 max-w-xl mx-auto mb-14 text-sm leading-relaxed">
              From skill assessment to job placement — one unified AI platform for students, institutions and recruiters.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { color: "indigo", icon: <Brain className="w-6 h-6" />, title: "AI Skill Assessment", desc: "Intelligent assessments that analyse your strengths, highlight gaps and generate a personalised skill score." },
                { color: "violet", icon: <Target className="w-6 h-6" />, title: "Career Readiness Score", desc: "A live readiness gauge that updates as you complete assessments, learn new skills and apply for roles." },
                { color: "purple", icon: <GraduationCap className="w-6 h-6" />, title: "Personalised Learning", desc: "AI-curated courses, tutorials and roadmaps tailored to your skill gaps and target career path." },
                { color: "emerald", icon: <Briefcase className="w-6 h-6" />, title: "Smart Job Matching", desc: "Match with verified internships and full-time roles based on your actual verified skill profile." },
                { color: "amber", icon: <Building2 className="w-6 h-6" />, title: "Institution Analytics", desc: "Real-time dashboards for colleges to monitor student readiness, placement rates and skill trends." },
                { color: "red", icon: <Zap className="w-6 h-6" />, title: "Industry Pipeline", desc: "Kanban recruitment pipeline for companies to source, screen and hire top talent in one workflow." },
              ].map((f) => {
                const cm = { indigo: "bg-indigo-50 border-indigo-200 text-indigo-600 hover:border-indigo-400", violet: "bg-violet-50 border-violet-200 text-violet-600 hover:border-violet-400", purple: "bg-purple-50 border-purple-200 text-purple-600 hover:border-purple-400", emerald: "bg-emerald-50 border-emerald-200 text-emerald-600 hover:border-emerald-400", amber: "bg-amber-50 border-amber-200 text-amber-600 hover:border-amber-400", red: "bg-red-50 border-red-200 text-red-600 hover:border-red-400" };
                return (
                  <div key={f.title} className={`bg-white border rounded-2xl p-6 transition-all shadow-sm hover:shadow-md group ${cm[f.color]}`}>
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${cm[f.color]}`}>{f.icon}</div>
                    <h3 className="text-slate-800 font-bold text-base mb-2">{f.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── ABOUT US ── */}
        <section id="about" className="w-full bg-gray-50 border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-red-500 mb-4">About SkillBridge AI</p>
            <h2 className="text-center text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-6">
              Empowering Students for a{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Smarter Career</span>
            </h2>
            <p className="text-center text-slate-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
              SkillBridge AI connects students, institutions and industry through AI-powered skill assessment, personalized learning and career opportunities — bridging the gap between academia and the job market.
            </p>
            <div className="flex justify-center mb-16">
              <button type="button" onClick={() => setPortalStarted(true)}
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 cursor-pointer text-sm">
                <Zap className="w-4 h-4" />Explore Platform<ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: <GraduationCap className="w-6 h-6 text-indigo-600" />, cls: "bg-indigo-50 border-indigo-200 hover:border-indigo-400", title: "For Students", desc: "Build skills, take AI-powered assessments, and get matched with internships and full-time roles that fit your profile." },
                { icon: <Briefcase className="w-6 h-6 text-emerald-600" />, cls: "bg-emerald-50 border-emerald-200 hover:border-emerald-400", title: "For Industry", desc: "Discover verified, skill-matched talent from top institutions and manage your hiring pipeline end-to-end." },
                { icon: <Building2 className="w-6 h-6 text-amber-600" />, cls: "bg-amber-50 border-amber-200 hover:border-amber-400", title: "For Institutions", desc: "Monitor student readiness, track placement outcomes, and align curriculum with real-time industry demands." },
              ].map((c) => (
                <div key={c.title} className={`bg-white border rounded-2xl p-6 text-center transition-all shadow-sm hover:shadow-md group ${c.cls}`}>
                  <div className={`mx-auto mb-4 w-12 h-12 rounded-xl border flex items-center justify-center group-hover:scale-110 transition-transform ${c.cls}`}>{c.icon}</div>
                  <h3 className="text-slate-800 font-bold mb-2">{c.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-200 bg-white">
            <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <span>© 2026 SkillBridge AI. All rights reserved.</span>
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />Powered by AI • Built for Galgotias University</span>
            </div>
          </div>
        </section>

      </div>
    );
  }

  // ==========================================================
  // SCREEN B: PORTAL CARD SELECTION (after clicking Login)
  // ==========================================================
  if (!isLoggedIn && !loginStarted && portalStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-x-hidden">

        <PublicHeader onLoginClick={() => setPortalStarted(true)} />

        <div className="flex-1 flex flex-col items-center px-6 py-16 relative">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/5 blur-[130px] pointer-events-none rounded-full" />
          <div className="absolute bottom-10 left-1/4 w-[400px] h-[300px] bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />

          <div className="w-full max-w-6xl relative z-10">
            <button type="button" onClick={() => setPortalStarted(false)}
              className="mb-8 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition cursor-pointer font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </button>

            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-5">
                <Sparkles className="w-3.5 h-3.5" /><span>SkillBridge AI • Choose Your Portal</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-800 via-slate-700 to-slate-500 bg-clip-text text-transparent">
                Select Your Role
              </h1>
              <p className="text-slate-500 mt-3 text-base md:text-lg max-w-xl mx-auto">
                Choose the portal that matches your role to access your personalised dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* STUDENT */}
              <div className="bg-white border border-indigo-200 hover:border-indigo-400 rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1 group">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center group-hover:scale-110 transition-transform"><GraduationCap className="w-7 h-7 text-indigo-600" /></div>
                    <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider border border-indigo-200">Student Portal</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Student Workspace</h2>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">Assess technical readiness, track personalized career roadmaps, and apply to live industry positions.</p>
                  <div className="mt-6 space-y-2.5 pt-5 border-t border-gray-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" /><span>AI Skill Matrix & Career Readiness Gauge</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" /><span>Live Application Tracker (Syncs with Industry)</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" /><span>Interactive Profile Editor with Instant Persistence</span></div>
                  </div>
                </div>
                <div className="mt-8 space-y-3">
                  <button type="button" onClick={() => handleSelectAndGoToLogin("student")} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/25 cursor-pointer">
                    <GraduationCap className="w-4 h-4" /><span>Sign In to Student Portal</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* INDUSTRY */}
              <div className="bg-white border border-emerald-200 hover:border-emerald-400 rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-emerald-100 hover:-translate-y-1 group">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center group-hover:scale-110 transition-transform"><Factory className="w-7 h-7 text-emerald-600" /></div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider border border-emerald-200">Industry Portal</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Industry & Hiring Suite</h2>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">Post high-priority positions, discover verified student talent, and manage candidates via interactive Kanban.</p>
                  <div className="mt-6 space-y-2.5 pt-5 border-t border-gray-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /><span>5-Stage Kanban Pipeline (Applied → Selected)</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /><span>1-Click Post Job Templates (AI Engineer, Full-Stack)</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /><span>100% Matching Layout, Sidebar & Topbar with Student</span></div>
                  </div>
                </div>
                <div className="mt-8 space-y-3">
                  <button type="button" onClick={() => handleSelectAndGoToLogin("industry")} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/25 cursor-pointer">
                    <Factory className="w-4 h-4" /><span>Sign In to Industry Portal</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* INSTITUTION */}
              <div className="bg-white border border-amber-200 hover:border-amber-400 rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-amber-100 hover:-translate-y-1 group">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center group-hover:scale-110 transition-transform"><Building2 className="w-7 h-7 text-amber-600" /></div>
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold uppercase tracking-wider border border-amber-200">Institute Portal</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Institution Hub</h2>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">Monitor student skill trajectories, department analytics, and curriculum alignment with market demand.</p>
                  <div className="mt-6 space-y-2.5 pt-5 border-t border-gray-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" /><span>Placement & Department Skill Analytics</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" /><span>Student Dossier & Readiness Benchmarking</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" /><span>Curriculum Gap Recommendations</span></div>
                  </div>
                </div>
                <div className="mt-8 space-y-3">
                  <button type="button" onClick={() => handleSelectAndGoToLogin("institution")} className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-600/25 cursor-pointer">
                    <Building2 className="w-4 h-4" /><span>Sign In to Institute Portal</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span><strong>Instant Portal Switching:</strong> Once logged in, switch seamlessly between Student, Industry, and Institute anytime via the sidebar!</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">Secure account access</span>
            </div>
          </div>
        </div>

      </div>

    );
  }

  if (!isLoggedIn && !loginStarted) {
    return null;
  }


  // ==========================================================
  // LOGIN / REGISTER SCREEN (ELEVATED & POLISHED)
  // ==========================================================

  if (loginStarted && !isLoggedIn) {
    const portal = PORTALS[selectedPortal];
    const Icon = portal.icon;
    if (authMode === "register") {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-10 relative overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-500/5 blur-[120px] pointer-events-none rounded-full" />

          <div className="w-full max-w-md relative z-10">
            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                clearAuthFields();
              }}
              className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition cursor-pointer font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>

            <div className="text-center mb-6">
              <div className="mx-auto mb-3 w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                <Icon className="w-7 h-7 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">Create {portal.title} Account</h1>
              <p className="text-xs text-slate-500 mt-1">Join the SkillBridge AI platform</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-7 shadow-xl">
              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-2.5 px-3.5 text-sm outline-none focus:border-indigo-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-2.5 px-3.5 text-sm outline-none focus:border-indigo-500 transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Contact Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      value={contact}
                      onChange={(e) => setContact(e.target.value.replace(/\D/g, ""))}
                      placeholder="10 digit mobile number"
                      maxLength={10}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 transition"
                      required
                    />
                  </div>
                </div>

                {authError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-2.5 text-xs">
                    {authError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="text-center mt-5">
                <span className="text-xs text-slate-500">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    clearAuthFields();
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // MAIN LOGIN VIEW
    const accentBorder = selectedPortal === "student" ? "border-indigo-500/30" : selectedPortal === "industry" ? "border-emerald-500/30" : "border-amber-500/30";
    const accentBg = selectedPortal === "student" ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/25" : selectedPortal === "industry" ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25" : "bg-amber-600 hover:bg-amber-500 shadow-amber-600/25";
    const accentGlow = selectedPortal === "student" ? "bg-indigo-500/10" : selectedPortal === "industry" ? "bg-emerald-500/10" : "bg-amber-500/10";
    const accentTextColor = selectedPortal === "student" ? "text-indigo-400" : selectedPortal === "industry" ? "text-emerald-400" : "text-amber-400";

    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-10 relative overflow-hidden">
        {/* Dynamic Glow */}
        <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] ${accentGlow} blur-[140px] pointer-events-none rounded-full transition-all duration-500`} />

        <div className="w-full max-w-md relative z-10">
          {/* Top navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => {
                setLoginStarted(false);
                clearAuthFields();
              }}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portals</span>
            </button>

            <span className="text-xs text-slate-500">SkillBridge AI Auth</span>
          </div>

          {/* ROLE SWITCHER TABS ON LOGIN CARD */}
          <div className="grid grid-cols-3 gap-1 bg-slate-900 border border-slate-800 rounded-2xl p-1 mb-5 shadow-lg">
            <button
              type="button"
              onClick={() => {
                setSelectedPortal("student");
                clearAuthFields();
              }}
              className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                selectedPortal === "student"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedPortal("industry");
                clearAuthFields();
              }}
              className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                selectedPortal === "industry"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Factory className="w-3.5 h-3.5" />
              <span>Industry</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedPortal("institution");
                clearAuthFields();
              }}
              className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                selectedPortal === "institution"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Institute</span>
            </button>
          </div>

          {/* MAIN LOGIN CARD */}
          <div className={`bg-slate-900/90 border ${accentBorder} rounded-3xl p-7 shadow-2xl backdrop-blur-sm transition-all duration-300`}>
            {/* Header */}
            <div className="flex items-center gap-3.5 mb-6">
              <div className={`w-12 h-12 rounded-2xl ${accentGlow} border ${accentBorder} flex items-center justify-center shrink-0`}>
                <Icon className={`w-6 h-6 ${accentTextColor}`} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white leading-snug">
                  {portal.title} Login
                </h2>
                <p className="text-xs text-slate-400">
                  {selectedPortal === "student"
                    ? "Access your skills radar and opportunity matching"
                    : selectedPortal === "industry"
                    ? "Manage candidate pipelines and job openings"
                    : "Track student cohorts and placement analytics"}
                </p>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setAuthError("");
                    }}
                    placeholder="you@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 outline-none focus:border-slate-600 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? "Hide" : "Show"}</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setAuthError("");
                    }}
                    placeholder="Enter your password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-600 outline-none focus:border-slate-600 transition"
                    required
                  />
                </div>
              </div>

              {authError && (
                <div className="bg-red-500/10 border border-red-500/25 text-red-400 rounded-xl px-4 py-2.5 text-xs font-medium">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className={`w-full rounded-xl py-3 font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${accentBg}`}
              >
                <span>Sign In as {portal.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* CREATE ACCOUNT TOGGLE */}
            <div className="text-center mt-5 pt-4 border-t border-slate-800/80">
              <span className="text-xs text-slate-500">Don't have an account? </span>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("register");
                  clearAuthFields();
                }}
                className={`text-xs font-semibold cursor-pointer hover:underline ${accentTextColor}`}
              >
                Create Account
              </button>
            </div>
          </div>

          <p className="text-center text-[11px] text-slate-600 mt-5">
            SkillBridge AI • Secure Multi-Role Portal Authentication
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // INDUSTRY DASHBOARD (100% UI PARITY WITH STUDENT)
  // ==========================================================

  if (isLoggedIn && selectedPortal === "industry") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar
          activePage={activeIndustryPage}
          setActivePage={handleIndustryPageChange}
          selectedPortal="industry"
          onSwitchPortal={switchPortal}
          onLogout={handleLogout}
          currentUser={currentUser}
          authPortal={currentUser?.authPortal || initialSession?.user?.authPortal || "industry"}
          onUpdateProfile={handleUpdateProfile}
        />

        <div className="ml-64 min-h-screen flex flex-col">
          <Topbar
            currentUser={currentUser}
            selectedPortal="industry"
            activePage={activeIndustryPage}
            setActivePage={handleIndustryPageChange}
            onLogout={handleLogout}
            onOpenPostJob={() => setShowIndustryPostModal(true)}
            onRefresh={handleIndustryRefresh}
            refreshing={industryRefreshing}
          />

          <main className="min-h-[calc(100vh-80px)] px-8 py-8">
            <Industry
              embedded={true}
              activeIndustryPage={activeIndustryPage}
              setActiveIndustryPage={handleIndustryPageChange}
              showPostModal={showIndustryPostModal}
              setShowPostModal={setShowIndustryPostModal}
              refreshTrigger={industryRefreshTrigger}
              currentUser={currentUser}
              onUpdateProfile={handleUpdateProfile}
            />
          </main>
        </div>
      </div>
    );
  }


  // ==========================================================
  // INSTITUTION DASHBOARD
  // ==========================================================

  if (isLoggedIn && selectedPortal === "institution") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar
          activePage={activeInstitutionPage}
          setActivePage={handleInstitutionPageChange}
          selectedPortal="institution"
          onSwitchPortal={switchPortal}
          onLogout={handleLogout}
          currentUser={currentUser}
          authPortal={currentUser?.authPortal || initialSession?.user?.authPortal || "institution"}
          onUpdateProfile={handleUpdateProfile}
        />

        <div className="ml-64 min-h-screen flex flex-col">
          <Topbar
            currentUser={currentUser}
            selectedPortal="institution"
            activePage={activeInstitutionPage}
            setActivePage={handleInstitutionPageChange}
            onLogout={handleLogout}
          />

          <main className="min-h-[calc(100vh-80px)] px-8 py-8">
            <Institution
              activePage={activeInstitutionPage}
              setActivePage={handleInstitutionPageChange}
              currentUser={currentUser}
              onSwitchPortal={switchPortal}
            />
          </main>
        </div>
      </div>
    );
  }


  // ==========================================================
  // STUDENT DASHBOARD
  // ==========================================================

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        activePage={activeStudentPage}
        setActivePage={setActivePage}
        selectedPortal="student"
        onSwitchPortal={switchPortal}
        onLogout={handleLogout}
        currentUser={currentUser}
        authPortal={currentUser?.authPortal || initialSession?.user?.authPortal || "student"}
        onUpdateProfile={handleUpdateProfile}
      />

      <div className="ml-64 min-h-screen flex flex-col">
        <Topbar
          currentUser={currentUser}
          selectedPortal="student"
          activePage={activeStudentPage}
          setActivePage={setActivePage}
          onLogout={handleLogout}
          onRefresh={() => {}}
        />

        <main className="min-h-[calc(100vh-80px)] px-8 py-8">
          {activeStudentPage === "dashboard" && (
            <Dashboard currentUser={currentUser} setActivePage={setActivePage} />
          )}

          {activeStudentPage === "skills" && (
            <Skills currentUser={currentUser} />
          )}

          {activeStudentPage === "assessment" && (
            <Assessment currentUser={currentUser} />
          )}

          {activeStudentPage === "career" && (
            <Career currentUser={currentUser} setActivePage={setActivePage} />
          )}

          {activeStudentPage === "learning" && (
            <LearningCenter
              currentUser={currentUser}
              setActivePage={setActivePage}
            />
          )}

          {activeStudentPage === "opportunities" && (
            <Opportunities currentUser={currentUser} />
          )}

          {activeStudentPage === "applications" && (
            <Applications currentUser={currentUser} />
          )}

          {activeStudentPage === "portfolio" && (
            <Portfolio currentUser={currentUser} />
          )}

          {activeStudentPage === "student-profile" && (
            <StudentProfile
              currentUser={currentUser}
              setActivePage={setActivePage}
              onUpdateProfile={handleUpdateProfile}
              onLogout={handleLogout}
            />
          )}
        </main>
      </div>
    </div>
  );
}


export default App;
