import { useEffect, useState } from "react";

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

import {
  GraduationCap,
  Factory,
  Building2,
  ArrowRight,
  Sparkles,
  Mail,
  Lock,
  UserRound,
  ArrowLeft,
  ShieldCheck,
  Phone,
  UserPlus,
  CheckCircle2,
  Zap,
  Briefcase,
  Eye,
  EyeOff,
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


// ============================================================
// DEFAULT DEMO ACCOUNTS
// ============================================================

const DEFAULT_ACCOUNTS = {
  student: {
    firstName: "Student",
    lastName: "Demo",
    email: "student@demo.com",
    password: "student123",
    contact: "9876543210",
  },

  industry: {
    firstName: "Industry",
    lastName: "Demo",
    email: "industry@demo.com",
    password: "industry123",
    contact: "9876543211",
  },

  institution: {
    firstName: "Institution",
    lastName: "Demo",
    email: "institution@demo.com",
    password: "institution123",
    contact: "9876543212",
  },
};


// ============================================================
// SAVED ACCOUNTS
// ============================================================

function getSavedAccounts() {
  try {
    const saved = localStorage.getItem("skillbridge_accounts");

    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Could not load accounts:", error);
  }

  return {
    student: [DEFAULT_ACCOUNTS.student],
    industry: [DEFAULT_ACCOUNTS.industry],
    institution: [DEFAULT_ACCOUNTS.institution],
  };
}


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
      if (saved) return JSON.parse(saved);
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");

  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const [accounts, setAccounts] = useState(getSavedAccounts);

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
  // SAVE ACCOUNTS
  // ==========================================================

  useEffect(() => {
    localStorage.setItem(
      "skillbridge_accounts",
      JSON.stringify(accounts)
    );
  }, [accounts]);


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
    setAuthSuccess("");
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

  const handleAutoFillDemo = () => {
    const demo = DEFAULT_ACCOUNTS[selectedPortal];
    if (demo) {
      setEmail(demo.email);
      setPassword(demo.password);
      setAuthError("");
    }
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

  const completeLogin = (customUser) => {
    setAuthError("");
    setAuthSuccess("");
    setIsLoggedIn(true);

    const authRole = customUser?.authPortal || selectedPortal;
    let loggedUser = customUser;
    if (!loggedUser) {
      if (selectedPortal === "student") {
        const derivedName = email ? email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Student";
        loggedUser = {
          name: derivedName,
          email: email || "student@demo.com",
          branch: "Computer Science",
          college: "Galgotias University",
          role: "Student",
        };
      } else if (selectedPortal === "industry") {
        loggedUser = {
          name: "TechNova Recruiter",
          email: email || "industry@demo.com",
          company: "TechNova Solutions",
          location: "Bengaluru • Hybrid",
          role: "Talent Acquisition",
        };
      } else {
        loggedUser = {
          name: "Dean of Academics",
          email: email || "institution@demo.com",
          college: "Institute of Technology",
          role: "Academic Administration",
        };
      }
    }

    const userWithAuth = {
      ...loggedUser,
      authPortal: authRole,
    };

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

      fetch("http://127.0.0.1:8000/api/students/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "e0bab151-ab49-42fe-b6f1-c4346834b1f1",
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
  // DEMO LOGIN
  // ==========================================================

  const handleDemoLogin = () => {
    const demo = DEFAULT_ACCOUNTS[selectedPortal];
    setEmail(demo.email);
    setPassword(demo.password);

    let demoUser = null;
    if (selectedPortal === "student") {
      demoUser = {
        name: "Student Demo",
        email: demo.email,
        branch: "Computer Science",
        college: "Galgotias University",
        role: "Student",
        authPortal: "student",
      };
    } else if (selectedPortal === "industry") {
      demoUser = {
        name: "TechNova Recruiter",
        email: demo.email,
        company: "TechNova Solutions",
        location: "Bengaluru • Hybrid",
        role: "Talent Acquisition",
        authPortal: "industry",
      };
    } else {
      demoUser = {
        name: "Dean of Academics",
        email: demo.email,
        college: "Institute of Technology",
        role: "Academic Administration",
        authPortal: "institution",
      };
    }

    completeLogin(demoUser);
  };


  // ==========================================================
  // EMAIL LOGIN
  // ==========================================================

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    const portalAccounts = accounts[selectedPortal] || [];

    const foundAccount = portalAccounts.find(
      (account) =>
        account.email.toLowerCase() === email.trim().toLowerCase() &&
        account.password === password
    );

    if (!foundAccount) {
      setAuthError("Invalid email or password.");
      return;
    }

    const derivedName = foundAccount.email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const userName = foundAccount.firstName
      ? `${foundAccount.firstName} ${foundAccount.lastName || ""}`.trim()
      : selectedPortal === "industry"
      ? "TechNova Recruiter"
      : selectedPortal === "institution"
      ? "Dean of Academics"
      : (derivedName || "Student");

    completeLogin({
      name: userName,
      email: foundAccount.email,
      role: selectedPortal === "industry" ? "Talent Acquisition" : selectedPortal === "institution" ? "Academic Administration" : "Student",
      company: selectedPortal === "industry" ? "TechNova Solutions" : undefined,
      branch: selectedPortal === "student" ? "Computer Science" : undefined,
      college: selectedPortal === "student" ? "Galgotias University" : undefined,
      authPortal: selectedPortal,
    });
  };


  // ==========================================================
  // GOOGLE LOGIN - DEMO
  // ==========================================================

  const handleGoogleLogin = () => {
    completeLogin();
  };


  // ==========================================================
  // CREATE ACCOUNT
  // ==========================================================

  const handleCreateAccount = (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

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

    const portalAccounts = accounts[selectedPortal] || [];

    const emailExists = portalAccounts.some(
      (account) =>
        account.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (emailExists) {
      setAuthError("An account with this email already exists.");
      return;
    }

    const newAccount = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password,
      contact: contact.trim(),
    };

    const updatedAccounts = {
      ...accounts,
      [selectedPortal]: [
        ...portalAccounts,
        newAccount,
      ],
    };

    setAccounts(updatedAccounts);
    setEmail(newAccount.email);
    setPassword(newAccount.password);
    setAuthSuccess("Account created successfully!");

    const createdUser = {
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: newAccount.email,
      role: selectedPortal === "industry" ? "Talent Acquisition" : selectedPortal === "institution" ? "Academic Administration" : "Student",
      company: selectedPortal === "industry" ? "TechNova Solutions" : undefined,
      branch: selectedPortal === "student" ? "Computer Science" : undefined,
      college: selectedPortal === "student" ? "Galgotias University" : undefined,
    };

    completeLogin(createdUser);
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
    window.history.pushState({}, "", "/");
  };


  // ==========================================================
  // SWITCH PORTAL
  // ==========================================================

  const switchPortal = (portal) => {
    // RBAC Permissions Enforcement
    const activeAuthPortal = currentUser?.authPortal || initialSession?.portal || "student";

    // Student accounts can only access Student portal
    if (activeAuthPortal === "student" && portal !== "student") {
      alert("Access Restricted: Student accounts only have permission to access the Student Workspace.");
      return;
    }

    // Industry accounts can access Student and Industry, but not Institution
    if (activeAuthPortal === "industry" && portal === "institution") {
      alert("Access Restricted: Industry accounts do not have permission to access the Institution Portal.");
      return;
    }

    setSelectedPortal(portal);
    setPortalStarted(false);

    let defaultUser = null;
    let initialPage = "dashboard";

    if (portal === "industry") {
      defaultUser = {
        name: currentUser?.authPortal === "industry" ? (currentUser.name || "TechNova Recruiter") : "TechNova Recruiter",
        email: currentUser?.authPortal === "industry" ? (currentUser.email || "industry@demo.com") : "industry@demo.com",
        company: "TechNova Solutions",
        location: "Bengaluru • Hybrid",
        role: "Talent Acquisition",
        authPortal: activeAuthPortal,
      };
      setActiveIndustryPage("dashboard");
      window.history.pushState({}, "", "/industry/dashboard");
    } else if (portal === "student") {
      defaultUser = {
        name: currentUser?.name || "Student",
        email: currentUser?.email || "student@demo.com",
        branch: currentUser?.branch || "Computer Science",
        college: currentUser?.college || "Galgotias University",
        role: "Student",
        authPortal: activeAuthPortal,
      };
      setActiveStudentPage("dashboard");
      window.history.pushState({}, "", "/dashboard");
    } else {
      defaultUser = {
        name: currentUser?.authPortal === "institution" ? (currentUser.name || "Dean of Academics") : "Dean of Academics",
        email: currentUser?.authPortal === "institution" ? (currentUser.email || "institution@demo.com") : "institution@demo.com",
        college: "Institute of Technology",
        role: "Academic Administration",
        authPortal: activeAuthPortal,
      };
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
  // COMMON PORTAL SELECTION SCREEN
  // ==========================================================

  if (!isLoggedIn && !loginStarted) {
    return (
      <div className="portal-background min-h-screen text-white flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute bottom-10 left-1/4 w-[400px] h-[300px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="w-full max-w-6xl relative z-10">
          {/* BRAND & HERO HEADER */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SkillBridge AI • Unified Career & Recruitment Platform</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Welcome to SkillBridge AI
            </h1>

            <p className="text-slate-400 mt-3 text-base md:text-lg max-w-2xl mx-auto">
              Connecting Students, Industry Recruiters, and Institutions through AI-driven skill matching, recruitment pipelines, and synchronized workflows.
            </p>

            <p className="text-xs text-slate-400 font-medium mt-3 bg-slate-900 border border-slate-800 inline-block px-4 py-1.5 rounded-full">
              Select your role below to access your portal login with pre-configured demo credentials.
            </p>
          </div>

          {/* 3-PORTAL CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* STUDENT PORTAL */}
            <div className="bg-slate-900/90 border border-indigo-500/30 hover:border-indigo-500/60 rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-7 h-7 text-indigo-400" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    Student Portal
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-white">Student Workspace</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Assess technical readiness, track personalized career roadmaps, and apply to live industry positions.
                </p>

                <div className="mt-6 space-y-2.5 pt-5 border-t border-slate-800/80 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>AI Skill Matrix & Career Readiness Gauge</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Live Application Tracker (Syncs with Industry)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Interactive Profile Editor with Instant Persistence</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button
                  type="button"
                  onClick={() => handleSelectAndGoToLogin("student")}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/25 cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Sign In to Student Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="text-center py-1 text-xs text-slate-500">
                  Demo ID: <span className="font-mono text-slate-400">student@demo.com</span>
                </div>
              </div>
            </div>

            {/* INDUSTRY PORTAL */}
            <div className="bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-500/60 rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Factory className="w-7 h-7 text-emerald-400" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    Industry Portal
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-white">Industry & Hiring Suite</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Post high-priority positions, discover verified student talent, and manage candidates via interactive Kanban.
                </p>

                <div className="mt-6 space-y-2.5 pt-5 border-t border-slate-800/80 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>5-Stage Kanban Pipeline (Applied → Selected)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>1-Click Post Job Templates (AI Engineer, Full-Stack)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>100% Matching Layout, Sidebar & Topbar with Student</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button
                  type="button"
                  onClick={() => handleSelectAndGoToLogin("industry")}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/25 cursor-pointer"
                >
                  <Factory className="w-4 h-4" />
                  <span>Sign In to Industry Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="text-center py-1 text-xs text-slate-500">
                  Demo ID: <span className="font-mono text-slate-400">industry@demo.com</span>
                </div>
              </div>
            </div>

            {/* INSTITUTION PORTAL */}
            <div className="bg-slate-900/90 border border-amber-500/30 hover:border-amber-500/60 rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1 group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Building2 className="w-7 h-7 text-amber-400" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    Institute Portal
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-white">Institution Hub</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Monitor student skill trajectories, department analytics, and curriculum alignment with market demand.
                </p>

                <div className="mt-6 space-y-2.5 pt-5 border-t border-slate-800/80 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Placement & Department Skill Analytics</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Student Dossier & Readiness Benchmarking</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Curriculum Gap Recommendations</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button
                  type="button"
                  onClick={() => handleSelectAndGoToLogin("institution")}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-600/25 cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Sign In to Institute Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="text-center py-1 text-xs text-slate-500">
                  Demo ID: <span className="font-mono text-slate-400">institution@demo.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK ROLE SWITCHER HINT */}
          <div className="mt-8 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                <strong>Instant Portal Switching:</strong> Once logged in, switch seamlessly between Student, Industry, and Institute anytime via the sidebar!
              </span>
            </div>
            <span className="text-xs text-slate-500 font-mono">Demo Mode • Zero Configuration</span>
          </div>
        </div>
      </div>
    );
  }


  // ==========================================================
  // LOGIN / REGISTER SCREEN (ELEVATED & POLISHED)
  // ==========================================================

  if (loginStarted && !isLoggedIn) {
    const portal = PORTALS[selectedPortal];
    const Icon = portal.icon;
    const demo = DEFAULT_ACCOUNTS[selectedPortal];

    if (authMode === "register") {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-10 relative overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-500/10 blur-[120px] pointer-events-none rounded-full" />

          <div className="w-full max-w-md relative z-10">
            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                clearAuthFields();
              }}
              className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>

            <div className="text-center mb-6">
              <div className="mx-auto mb-3 w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Icon className="w-7 h-7 text-indigo-400" />
              </div>
              <h1 className="text-2xl font-bold">Create {portal.title} Account</h1>
              <p className="text-xs text-slate-400 mt-1">Join the SkillBridge AI platform</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-2xl">
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

            {/* DEMO CREDENTIALS BOX */}
            <div className={`rounded-2xl border p-4 mb-6 transition-all ${
              selectedPortal === "student"
                ? "border-indigo-500/25 bg-indigo-500/5"
                : selectedPortal === "industry"
                ? "border-emerald-500/25 bg-emerald-500/5"
                : "border-amber-500/25 bg-amber-500/5"
            }`}>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`w-4 h-4 ${accentTextColor}`} />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Demo Credentials
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFillDemo}
                  className={`text-xs font-semibold underline cursor-pointer hover:opacity-80 transition ${accentTextColor}`}
                >
                  Auto-fill fields
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/80 rounded-xl p-3 border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Demo ID</span>
                  <span className="font-mono text-slate-200 select-all font-medium text-xs break-all">{demo.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Password</span>
                  <span className="font-mono text-slate-200 select-all font-medium text-xs">{demo.password}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                className={`w-full mt-3 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer border ${
                  selectedPortal === "student"
                    ? "bg-indigo-600/15 border-indigo-500/30 text-indigo-300 hover:bg-indigo-600 hover:text-white"
                    : selectedPortal === "industry"
                    ? "bg-emerald-600/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-600 hover:text-white"
                    : "bg-amber-600/15 border-amber-500/30 text-amber-300 hover:bg-amber-600 hover:text-white"
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>1-Click Continue with Demo ID</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* DIVIDER */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Or enter credentials</span>
              <div className="flex-1 h-px bg-slate-800" />
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
                    placeholder={demo.email}
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

            {/* GOOGLE SIGN IN */}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span className="font-bold text-sm">G</span>
                <span>Continue with Google</span>
              </button>
            </div>

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
      <div className="min-h-screen bg-slate-950 text-white">
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
      <div className="min-h-screen bg-slate-950 text-white">
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
    <div className="min-h-screen bg-slate-950 text-white">
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
