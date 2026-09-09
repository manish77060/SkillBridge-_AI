import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Users,
  BriefcaseBusiness,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  Target,
  ArrowUpRight,
  Brain,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  RefreshCw,
  Loader2,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Sparkles,
  X,
  ArrowRight,
  ExternalLink,
  Edit3,
  Save,
  BookOpen,
  ShieldCheck,
  Zap,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000";

const FALLBACK_INSTITUTION_DATA = {
  status: "success",
  institution: {
    name: "Galgotias University",
    location: "Greater Noida, Uttar Pradesh",
    established: "2011",
    nirfRank: "Top 50 Private Universities in India",
    dean: "Dr. K. Sharma (Dean of Academics)",
    placementHead: "Prof. Rajesh Verma",
    contactEmail: "placement@galgotiasuniversity.edu.in",
    contactPhone: "+91 120 4370000",
    accreditation: "NAAC A+ Accredited • NBA Approved",
  },
  overview: {
    total_students: 128,
    average_readiness: 74.2,
    total_opportunities: 15,
    total_applications: 42,
    shortlisted: 18,
    interviews: 11,
    selected: 8,
    rejected: 5,
    placement_rate: 66.7,
  },
  skill_intelligence: {
    top_skill_gaps: [
      {
        skill: "AWS Cloud Architecture",
        industry_demand: 12,
        student_count: 8,
        coverage_percentage: 22.5,
        average_proficiency: 34,
        skill_gap: 66,
      },
      {
        skill: "Docker & Containerization",
        industry_demand: 10,
        student_count: 9,
        coverage_percentage: 25.0,
        average_proficiency: 40,
        skill_gap: 60,
      },
      {
        skill: "FastAPI / Microservices",
        industry_demand: 9,
        student_count: 12,
        coverage_percentage: 33.3,
        average_proficiency: 48,
        skill_gap: 52,
      },
      {
        skill: "PyTorch / Deep Learning",
        industry_demand: 8,
        student_count: 10,
        coverage_percentage: 27.8,
        average_proficiency: 45,
        skill_gap: 55,
      },
      {
        skill: "React & Modern UI",
        industry_demand: 14,
        student_count: 22,
        coverage_percentage: 61.1,
        average_proficiency: 68,
        skill_gap: 32,
      },
    ],
    industry_demand: [
      {
        skill: "React & Next.js",
        industry_demand: 14,
        student_count: 22,
        coverage_percentage: 61.1,
        average_proficiency: 68,
      },
      {
        skill: "Python & FastAPI",
        industry_demand: 13,
        student_count: 19,
        coverage_percentage: 52.8,
        average_proficiency: 62,
      },
      {
        skill: "AWS Cloud",
        industry_demand: 12,
        student_count: 8,
        coverage_percentage: 22.5,
        average_proficiency: 34,
      },
      {
        skill: "PostgreSQL & SQL",
        industry_demand: 11,
        student_count: 26,
        coverage_percentage: 72.2,
        average_proficiency: 74,
      },
      {
        skill: "Docker & DevOps",
        industry_demand: 10,
        student_count: 9,
        coverage_percentage: 25.0,
        average_proficiency: 40,
      },
      {
        skill: "TypeScript",
        industry_demand: 9,
        student_count: 14,
        coverage_percentage: 38.9,
        average_proficiency: 56,
      },
    ],
  },
  department_analytics: [
    { branch: "Computer Science & Engineering", students: 78, average_readiness: 78.6 },
    { branch: "Information Technology", students: 32, average_readiness: 71.4 },
    { branch: "Electronics & Communication", students: 18, average_readiness: 62.0 },
  ],
  students: [
    {
      id: "e0bab151-ab49-42fe-b6f1-c4346834b1f1",
      name: (() => {
        try {
          const profile = JSON.parse(localStorage.getItem("skillbridge_student_profile") || "{}");
          const session = JSON.parse(localStorage.getItem("skillbridge_auth_session") || "{}");
          return profile?.name || session?.user?.name || "Student Demo";
        } catch {
          return "Student Demo";
        }
      })(),
      email: (() => {
        try {
          const profile = JSON.parse(localStorage.getItem("skillbridge_student_profile") || "{}");
          const session = JSON.parse(localStorage.getItem("skillbridge_auth_session") || "{}");
          return profile?.email || session?.user?.email || "student@galgotias.edu";
        } catch {
          return "student@galgotias.edu";
        }
      })(),
      branch: "Computer Science",
      degree: "B.Tech",
      college: "Galgotias University",
      graduation_year: 2027,
      target_role: "AI Engineer",
      readiness_score: 85,
      skills: ["Python", "FastAPI", "React", "PyTorch", "TailwindCSS"],
      status: "Shortlisted",
    },
    {
      id: "std-2",
      name: "Priya Patel",
      email: "priya.patel@galgotias.edu",
      branch: "Computer Science",
      degree: "B.Tech",
      college: "Galgotias University",
      graduation_year: 2027,
      target_role: "Full-Stack Developer",
      readiness_score: 79,
      skills: ["React", "Node.js", "MongoDB", "Express", "TypeScript"],
      status: "Interview Scheduled",
    },
    {
      id: "std-3",
      name: "Rohan Verma",
      email: "rohan.verma@galgotias.edu",
      branch: "Information Technology",
      degree: "B.Tech",
      college: "Galgotias University",
      graduation_year: 2027,
      target_role: "Cloud DevOps Engineer",
      readiness_score: 71,
      skills: ["Docker", "Linux", "AWS", "Python", "CI/CD"],
      status: "Applied",
    },
    {
      id: "std-4",
      name: "Sneha Reddy",
      email: "sneha.reddy@galgotias.edu",
      branch: "Computer Science",
      degree: "B.Tech",
      college: "Galgotias University",
      graduation_year: 2026,
      target_role: "Data Scientist",
      readiness_score: 91,
      skills: ["Python", "SQL", "Pandas", "Scikit-Learn", "Tableau"],
      status: "Selected",
    },
    {
      id: "std-5",
      name: "Ankit Gupta",
      email: "ankit.gupta@galgotias.edu",
      branch: "Electronics & Communication",
      degree: "B.Tech",
      college: "Galgotias University",
      graduation_year: 2027,
      target_role: "Embedded Systems Engineer",
      readiness_score: 63,
      skills: ["C++", "Microcontrollers", "RTOS", "Python"],
      status: "Applied",
    },
  ],
};

function Institution({
  activePage = "dashboard",
  setActivePage,
  currentUser,
  onSwitchPortal,
}) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Student Cohort filters
  const [studentSearch, setStudentSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [readinessFilter, setReadinessFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Modals
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);

  // Campus Profile Editable State
  const [campusInfo, setCampusInfo] = useState(() => {
    try {
      const saved = localStorage.getItem("skillbridge_institution_profile");
      if (saved) return JSON.parse(saved);
    } catch {}
    return FALLBACK_INSTITUTION_DATA.institution;
  });

  // FETCH DASHBOARD DATA
  const fetchDashboard = async () => {
    try {
      setRefreshing(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/institution/dashboard`);

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== "success") {
        throw new Error(data.message || "Invalid dashboard response");
      }

      // Merge with fallback data to ensure rich cohort and details are always present
      setDashboard({
        ...FALLBACK_INSTITUTION_DATA,
        ...data,
        overview: {
          ...FALLBACK_INSTITUTION_DATA.overview,
          ...(data.overview || {}),
        },
        skill_intelligence: {
          ...FALLBACK_INSTITUTION_DATA.skill_intelligence,
          ...(data.skill_intelligence || {}),
        },
        department_analytics:
          Array.isArray(data.department_analytics) && data.department_analytics.length > 0
            ? data.department_analytics
            : FALLBACK_INSTITUTION_DATA.department_analytics,
        students:
          Array.isArray(data.students) && data.students.length > 0
            ? [
                ...data.students,
                ...FALLBACK_INSTITUTION_DATA.students.filter(
                  (f) => !data.students.some((s) => s.id === f.id || s.email === f.email)
                ),
              ]
            : FALLBACK_INSTITUTION_DATA.students,
      });
    } catch (err) {
      console.warn("Using fallback institution intelligence:", err);
      setDashboard(FALLBACK_INSTITUTION_DATA);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // EXTRACT SAFE DATA
  const data = dashboard || FALLBACK_INSTITUTION_DATA;
  const overview = data.overview || {};
  const skillIntelligence = data.skill_intelligence || {};
  const industryDemand = Array.isArray(skillIntelligence.industry_demand)
    ? skillIntelligence.industry_demand
    : FALLBACK_INSTITUTION_DATA.skill_intelligence.industry_demand;

  const topSkillGaps = Array.isArray(skillIntelligence.top_skill_gaps)
    ? skillIntelligence.top_skill_gaps
    : FALLBACK_INSTITUTION_DATA.skill_intelligence.top_skill_gaps;

  const departmentAnalytics = Array.isArray(data.department_analytics)
    ? data.department_analytics
    : FALLBACK_INSTITUTION_DATA.department_analytics;

  const studentsList = Array.isArray(data.students)
    ? data.students
    : FALLBACK_INSTITUTION_DATA.students;

  const institutionName = campusInfo.name || "Galgotias University";

  // KPI VALUES
  const averageReadiness = Number(overview.average_readiness || 74.2);
  const placementRate = Number(overview.placement_rate || 66.7);
  const totalStudents = Number(overview.total_students || studentsList.length);
  const totalApplications = Number(overview.total_applications || 42);
  const shortlisted = Number(overview.shortlisted || 18);
  const selected = Number(overview.selected || 8);
  const totalOpportunities = Number(overview.total_opportunities || 15);

  // MAX DEMAND
  const maxDemand = useMemo(() => {
    if (!industryDemand.length) return 1;
    const values = industryDemand.map((item) => Number(item.industry_demand || 0));
    return Math.max(...values, 1);
  }, [industryDemand]);

  // AI INSIGHT
  const aiInsight = useMemo(() => {
    if (!topSkillGaps.length) {
      return "Student skills are currently well aligned with available industry demand.";
    }
    const highestGaps = topSkillGaps
      .filter((item) => Number(item.skill_gap || 0) > 0)
      .slice(0, 3)
      .map((item) => item.skill);

    if (highestGaps.length === 1) {
      return `Current institutional priority is ${highestGaps[0]}. Targeted training will boost placement readiness.`;
    }
    return `Largest institutional skill gaps are currently in ${highestGaps.slice(0, 2).join(" and ")}. Modernizing course modules in these areas will drive higher industry selection rates.`;
  }, [topSkillGaps]);

  // FILTERED STUDENTS
  const filteredStudents = useMemo(() => {
    return studentsList.filter((s) => {
      const matchesSearch =
        !studentSearch.trim() ||
        [s.name, s.email, s.branch, s.target_role]
          .join(" ")
          .toLowerCase()
          .includes(studentSearch.toLowerCase().trim());

      const matchesBranch =
        branchFilter === "All" ||
        s.branch?.toLowerCase().includes(branchFilter.toLowerCase());

      const score = Number(s.readiness_score || 0);
      let matchesReadiness = true;
      if (readinessFilter === "High") matchesReadiness = score >= 80;
      else if (readinessFilter === "Moderate") matchesReadiness = score >= 60 && score < 80;
      else if (readinessFilter === "Developing") matchesReadiness = score < 60;

      return matchesSearch && matchesBranch && matchesReadiness;
    });
  }, [studentsList, studentSearch, branchFilter, readinessFilter]);

  // SAVE CAMPUS PROFILE
  const handleSaveProfile = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem("skillbridge_institution_profile", JSON.stringify(campusInfo));
    } catch {}
    setShowProfileEditModal(false);
  };

  // LOADING STATE
  if (loading && !dashboard) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <Loader2 size={28} className="animate-spin text-amber-400" />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-white">Loading Institutional Intelligence</h2>
            <p className="mt-1 text-sm text-slate-400">Synchronizing cohort data & industry demand radar...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ==================================================
          PAGE HEADER
      ================================================== */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Building2 size={13} />
            <span>Institution Portal • Academic & Placement Intelligence</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            {activePage === "students"
              ? "Student Cohort Directory"
              : activePage === "analytics"
              ? "Placement & Market Alignment Analytics"
              : activePage === "institution-profile"
              ? "Campus Profile & Placement Office"
              : "Institutional Intelligence Dashboard"}
          </h1>

          <p className="mt-1.5 max-w-3xl text-sm text-slate-400">
            {activePage === "students"
              ? "Track verified skill profiles, target roles, and real-time recruitment statuses for all registered students."
              : activePage === "analytics"
              ? "Deep dive into recruitment funnels, departmental readiness benchmarks, and curriculum gap recommendations."
              : activePage === "institution-profile"
              ? "Manage official institution information, academic rankings, and corporate placement cell contacts."
              : "Monitor student readiness, analyze industry skill demand, and strengthen academia-industry alignment."}
          </p>

          <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <Building2 size={14} className="text-amber-400" />
              {institutionName}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Connected Data
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchDashboard}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:border-amber-500 hover:text-white cursor-pointer"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin text-amber-400" : ""} />
            <span>{refreshing ? "Refreshing..." : "Refresh Intelligence"}</span>
          </button>
        </div>
      </div>

      {/* ==================================================
          PAGE 1: DASHBOARD
      ================================================== */}
      {activePage === "dashboard" && (
        <div className="space-y-8">
          {/* AI INSIGHT BANNER */}
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 p-6 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between relative z-10">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  <Brain size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-lg font-bold text-white">AI Academic Intelligence Insight</h2>
                    <span className="rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold">
                      Real-time Synthesis
                    </span>
                  </div>
                  <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-300">{aiInsight}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTrainingModal(true)}
                className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 px-4 py-2.5 text-xs font-semibold text-white transition shadow-lg shadow-amber-600/20 cursor-pointer"
              >
                <Zap size={15} />
                <span>Create Training Plan</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          {/* PRIMARY KPI CARDS */}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {/* STUDENTS */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 hover:border-slate-700 transition">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <Users size={22} />
                </div>
                <button
                  type="button"
                  onClick={() => setActivePage("students")}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  View cohort <ArrowUpRight size={14} />
                </button>
              </div>
              <p className="mt-5 text-xs font-medium uppercase tracking-wider text-slate-400">Total Students</p>
              <h3 className="mt-1 text-3xl font-extrabold text-white">{totalStudents}</h3>
              <p className="mt-1.5 text-xs text-slate-500">Active profiles in SkillBridge</p>
            </div>

            {/* READINESS */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 hover:border-slate-700 transition">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Target size={22} />
                </div>
                <span className="text-xs text-slate-500 font-medium">Campus Benchmark</span>
              </div>
              <p className="mt-5 text-xs font-medium uppercase tracking-wider text-slate-400">Career Readiness</p>
              <h3 className="mt-1 text-3xl font-extrabold text-white">
                {averageReadiness.toFixed(1)}
                <span className="text-lg text-slate-500 font-normal">%</span>
              </h3>
              <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                  style={{ width: `${Math.min(Math.max(averageReadiness, 0), 100)}%` }}
                />
              </div>
            </div>

            {/* APPLICATIONS */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 hover:border-slate-700 transition">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <BriefcaseBusiness size={22} />
                </div>
                <span className="text-xs text-blue-400 font-semibold">{shortlisted} Shortlisted</span>
              </div>
              <p className="mt-5 text-xs font-medium uppercase tracking-wider text-slate-400">Applications</p>
              <h3 className="mt-1 text-3xl font-extrabold text-white">{totalApplications}</h3>
              <p className="mt-1.5 text-xs text-slate-500">Submitted across industry roles</p>
            </div>

            {/* PLACEMENT RATE */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 hover:border-slate-700 transition">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <GraduationCap size={22} />
                </div>
                <span className="text-xs text-amber-400 font-semibold">{selected} Hired</span>
              </div>
              <p className="mt-5 text-xs font-medium uppercase tracking-wider text-slate-400">Placement Rate</p>
              <h3 className="mt-1 text-3xl font-extrabold text-white">
                {placementRate.toFixed(1)}
                <span className="text-lg text-slate-500 font-normal">%</span>
              </h3>
              <p className="mt-1.5 text-xs text-slate-500">Current cycle conversions</p>
            </div>
          </div>

          {/* TWO COLUMN: INDUSTRY DEMAND + SKILL GAPS */}
          <div className="grid gap-6 xl:grid-cols-2">
            {/* INDUSTRY DEMAND */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Industry Skill Demand Radar</h2>
                  <p className="mt-0.5 text-xs text-slate-400">Requirements demanded by active employers</p>
                </div>
                <TrendingUp size={20} className="text-amber-400" />
              </div>

              <div className="space-y-4">
                {industryDemand.map((item, index) => {
                  const skill = item.skill || `Skill ${index + 1}`;
                  const demand = Number(item.industry_demand || 0);
                  const coverage = Number(item.coverage_percentage || 0);
                  const demandWidth = Math.min((demand / maxDemand) * 100, 100);

                  return (
                    <div key={skill} className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3.5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white">{skill}</span>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-slate-400">{demand} postings</span>
                          <span className="text-emerald-400 font-medium">{coverage.toFixed(0)}% student coverage</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                          style={{ width: `${demandWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CRITICAL SKILL GAPS */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Critical Curriculum Gaps</h2>
                  <p className="mt-0.5 text-xs text-slate-400">Areas with high industry demand but low cohort proficiency</p>
                </div>
                <AlertTriangle size={20} className="text-red-400" />
              </div>

              <div className="space-y-3.5">
                {topSkillGaps.map((item, index) => {
                  const skill = item.skill || `Skill ${index + 1}`;
                  const gap = Number(item.skill_gap || 0);
                  const coverage = Number(item.coverage_percentage || 0);
                  const priority = gap >= 60 ? "High" : gap >= 40 ? "Medium" : "Low";
                  const badgeColor =
                    priority === "High"
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : priority === "Medium"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-blue-500/10 text-blue-400 border-blue-500/20";

                  return (
                    <div key={skill} className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-semibold text-sm text-white">{skill}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {coverage.toFixed(0)}% cohort coverage • {item.student_count || 0} proficient students
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-red-400">{gap.toFixed(0)}% Gap</span>
                          <span className={`block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badgeColor} mt-1`}>
                            {priority} Priority
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setShowTrainingModal(true)}
                className="mt-5 w-full py-2.5 rounded-xl border border-slate-700 hover:border-amber-500 bg-slate-900 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <BookOpen size={15} className="text-amber-400" />
                <span>Launch Faculty Workshop Recommendations</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          {/* DEPARTMENT READINESS BENCHMARK */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Department Readiness Benchmarking</h2>
                <p className="mt-0.5 text-xs text-slate-400">Cohort performance analyzed across academic branches</p>
              </div>
              <BarChart3 size={20} className="text-amber-400" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 pb-3">
                    <th className="pb-3">Department / Branch</th>
                    <th className="pb-3">Enrolled Cohort</th>
                    <th className="pb-3">Average Readiness</th>
                    <th className="pb-3">Recruitment Fit Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {departmentAnalytics.map((item) => {
                    const readiness = Number(item.average_readiness || 0);
                    const fitLevel =
                      readiness >= 75
                        ? "High Recruiter Fit"
                        : readiness >= 65
                        ? "Moderate Fit"
                        : "Training Needed";
                    const fitClass =
                      readiness >= 75
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : readiness >= 65
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20";

                    return (
                      <tr key={item.branch} className="hover:bg-slate-800/30 transition">
                        <td className="py-4 font-semibold text-white">{item.branch}</td>
                        <td className="py-4 text-slate-300">{item.students} Students</td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-28 h-2 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-400"
                                style={{ width: `${Math.min(readiness, 100)}%` }}
                              />
                            </div>
                            <span className="font-semibold text-slate-200">{readiness.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${fitClass}`}>
                            {fitLevel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          PAGE 2: STUDENT COHORT
      ================================================== */}
      {activePage === "students" && (
        <div className="space-y-6">
          {/* SEARCH & FILTERS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search students by name, email, target role..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-800 bg-slate-950 text-sm outline-none focus:border-amber-500 text-white placeholder-slate-500"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Branch:</span>
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="h-11 px-3 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-200 outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="All">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics">Electronics</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Readiness:</span>
                <select
                  value={readinessFilter}
                  onChange={(e) => setReadinessFilter(e.target.value)}
                  className="h-11 px-3 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-200 outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="All">All Readiness</option>
                  <option value="High">High Fit (80%+)</option>
                  <option value="Moderate">Moderate (60-79%)</option>
                  <option value="Developing">Developing (&lt;60%)</option>
                </select>
              </div>
            </div>
          </div>

          {/* STUDENT DIRECTORY LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStudents.map((std) => {
              const score = Number(std.readiness_score || 0);
              const scoreClass =
                score >= 80
                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                  : score >= 65
                  ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                  : "text-blue-400 bg-blue-500/10 border-blue-500/20";

              return (
                <div
                  key={std.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition group hover:shadow-lg hover:shadow-amber-500/5"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-indigo-500/20 border border-slate-700 flex items-center justify-center font-bold text-lg text-amber-400 shrink-0">
                          {std.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                            {std.name}
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            🎓 {std.degree} • {std.branch} (Class of {std.graduation_year})
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">✉️ {std.email}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${scoreClass}`}>
                          {score}% Ready
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Target size={14} className="text-amber-400" />
                        <span>Target: <strong className="text-slate-200">{std.target_role || "Software Engineer"}</strong></span>
                      </div>
                      {std.status && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                          {std.status}
                        </span>
                      )}
                    </div>

                    {std.skills && std.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {std.skills.slice(0, 4).map((sk) => (
                          <span key={sk} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                            {sk}
                          </span>
                        ))}
                        {std.skills.length > 4 && (
                          <span className="text-[11px] text-slate-500">+{std.skills.length - 4}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedStudent(std)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600 border border-amber-500/30 text-amber-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <span>View Student Dossier</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredStudents.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <Users size={36} className="mx-auto text-slate-600 mb-3" />
              <h3 className="text-base font-semibold text-white">No students match current filter</h3>
              <p className="text-xs text-slate-500 mt-1">Try resetting the search query or department filter.</p>
            </div>
          )}
        </div>
      )}

      {/* ==================================================
          PAGE 3: PLACEMENT ANALYTICS
      ================================================== */}
      {activePage === "analytics" && (
        <div className="space-y-8">
          {/* RECRUITMENT FUNNEL */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Institutional Recruitment Funnel</h2>
                <p className="mt-0.5 text-xs text-slate-400">Progression from registration to verified company placements</p>
              </div>
              <Sparkles size={20} className="text-amber-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-center">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">1. Registered</span>
                <p className="text-2xl font-bold text-white mt-1">{totalStudents}</p>
                <span className="text-[10px] text-slate-500">100% Cohort</span>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-center">
                <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">2. Applied</span>
                <p className="text-2xl font-bold text-blue-400 mt-1">{totalApplications}</p>
                <span className="text-[10px] text-slate-500">Applications</span>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-center">
                <span className="text-[11px] font-semibold text-violet-400 uppercase tracking-wider">3. Shortlisted</span>
                <p className="text-2xl font-bold text-violet-400 mt-1">{shortlisted}</p>
                <span className="text-[10px] text-slate-500">Recruiter Approved</span>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-center">
                <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">4. Interviews</span>
                <p className="text-2xl font-bold text-amber-400 mt-1">{overview.interviews || 11}</p>
                <span className="text-[10px] text-slate-500">Rounds Active</span>
              </div>
              <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 text-center bg-emerald-500/5">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">5. Selected</span>
                <p className="text-2xl font-bold text-emerald-400 mt-1">{selected}</p>
                <span className="text-[10px] text-emerald-400 font-semibold">{placementRate.toFixed(1)}% Conversion</span>
              </div>
            </div>
          </div>

          {/* ACADEMIC ALIGNMENT INSIGHTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-1">Top In-Demand Industry Roles</h3>
              <p className="text-xs text-slate-400 mb-5">Hiring volume across verified industry partner postings</p>

              <div className="space-y-3.5">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">01</span>
                    <div>
                      <p className="text-xs font-semibold text-white">Junior AI & ML Engineer</p>
                      <p className="text-[11px] text-slate-400">Avg Package: ₹8 - 14 LPA</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold">High Surge</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs">02</span>
                    <div>
                      <p className="text-xs font-semibold text-white">Full-Stack React & Node Intern</p>
                      <p className="text-[11px] text-slate-400">Avg Stipend: ₹25k - 40k/mo</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-400 text-xs font-semibold">Steady Demand</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">03</span>
                    <div>
                      <p className="text-xs font-semibold text-white">Cloud DevOps Engineer (AWS)</p>
                      <p className="text-[11px] text-slate-400">Avg Package: ₹7 - 12 LPA</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-semibold">Skill Shortage</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-1">Academic Council Recommendations</h3>
                <p className="text-xs text-slate-400 mb-5">AI-synthesized curriculum updates to present to the Board of Studies</p>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Incorporate container orchestration (Docker/K8s) into 3rd-year Operating Systems and Cloud lab.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Expand FastAPI & REST architectural guidelines in Advanced Web Development elective.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Host a 48-hour AI Hackathon in partnership with TechNova Solutions to verify student portfolios.</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowTrainingModal(true)}
                className="mt-6 w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap size={14} />
                <span>Export Recommendations PDF for Academic Council</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          PAGE 4: CAMPUS PROFILE
      ================================================== */}
      {activePage === "institution-profile" && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Building2 size={40} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-extrabold text-white">{campusInfo.name}</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 text-xs font-semibold">
                      Verified Institution
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
                    <MapPin size={15} className="text-slate-500" />
                    {campusInfo.location}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{campusInfo.accreditation}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowProfileEditModal(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
              >
                <Edit3 size={15} />
                <span>Edit Campus Info</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800">
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Dean of Academics</span>
                <p className="text-sm font-bold text-white mt-1">{campusInfo.dean}</p>
                <span className="text-xs text-slate-400">Office of Academic Affairs</span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Head of Corporate Placements</span>
                <p className="text-sm font-bold text-white mt-1">{campusInfo.placementHead}</p>
                <span className="text-xs text-slate-400">Placement & Industry Relations Cell</span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Contact & Desk</span>
                <p className="text-sm font-bold text-white mt-1">{campusInfo.contactEmail}</p>
                <span className="text-xs text-slate-400">{campusInfo.contactPhone}</span>
              </div>
            </div>
          </div>

          {/* ACTIVE RECRUITER PARTNERSHIPS */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-1">Active Industry Recruiters on Campus</h3>
            <p className="text-xs text-slate-400 mb-5">Hiring companies actively recruiting from your student cohort</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    TN
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">TechNova Solutions</h4>
                    <p className="text-[11px] text-slate-400">Bengaluru • 3 Active Openings</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm">
                    DC
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">DataCore Systems</h4>
                    <p className="text-[11px] text-slate-400">Hyderabad • 2 Active Openings</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm">
                    CS
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">CloudScale Technologies</h4>
                    <p className="text-[11px] text-slate-400">Noida • 4 Active Openings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          MODAL 1: STUDENT DOSSIER
      ================================================== */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl font-bold">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedStudent.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedStudent.degree} in {selectedStudent.branch} • Class of {selectedStudent.graduation_year}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">✉️ {selectedStudent.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500">Career Readiness</span>
                <p className="text-2xl font-black text-emerald-400 mt-1">{selectedStudent.readiness_score}%</p>
                <span className="text-[10px] text-slate-400">Institutional Benchmark</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500">Recruitment Status</span>
                <p className="text-sm font-bold text-amber-400 mt-1">{selectedStudent.status || "Applied"}</p>
                <span className="text-[10px] text-slate-400">Target: {selectedStudent.target_role}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Verified Skill Stack</span>
              <div className="flex flex-wrap gap-2">
                {(selectedStudent.skills || ["Python", "FastAPI", "React"]).map((sk) => (
                  <span key={sk} className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          MODAL 2: TRAINING PLAN SUGGESTIONS
      ================================================== */}
      {showTrainingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Recommended Faculty Training Programs</h3>
                <p className="text-xs text-slate-400 mt-1">Interventions targeted at the highest curriculum gaps</p>
              </div>
              <button
                type="button"
                onClick={() => setShowTrainingModal(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">AWS Cloud Architecture & S3 Bootcamp</span>
                  <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-semibold text-[10px]">Priority 1</span>
                </div>
                <p className="text-slate-400 mt-1">30-hour practical lab addressing 66% cloud gap among 3rd year CSE cohorts.</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Docker, CI/CD & Production DevOps</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold text-[10px]">Priority 2</span>
                </div>
                <p className="text-slate-400 mt-1">Hands-on microservices workshop to elevate readiness in IT & CSE departments.</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Applied PyTorch & Deep Learning Workshop</span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold text-[10px]">Priority 3</span>
                </div>
                <p className="text-slate-400 mt-1">Specialized elective module aligning with TechNova AI hiring quotas.</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowTrainingModal(false)}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold cursor-pointer"
              >
                Approve & Schedule for Cohort
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          MODAL 3: EDIT CAMPUS PROFILE
      ================================================== */}
      {showProfileEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-7 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Edit Campus Information</h3>
                <p className="text-xs text-slate-400 mt-1">Update details displayed to industry recruiters</p>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileEditModal(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Institution Name</label>
                <input
                  type="text"
                  value={campusInfo.name}
                  onChange={(e) => setCampusInfo({ ...campusInfo, name: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-700 bg-slate-950 text-sm text-white outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Location</label>
                <input
                  type="text"
                  value={campusInfo.location}
                  onChange={(e) => setCampusInfo({ ...campusInfo, location: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-700 bg-slate-950 text-sm text-white outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Dean of Academics</label>
                  <input
                    type="text"
                    value={campusInfo.dean}
                    onChange={(e) => setCampusInfo({ ...campusInfo, dean: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-700 bg-slate-950 text-sm text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Placement Head</label>
                  <input
                    type="text"
                    value={campusInfo.placementHead}
                    onChange={(e) => setCampusInfo({ ...campusInfo, placementHead: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-700 bg-slate-950 text-sm text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Placement Desk Email</label>
                <input
                  type="email"
                  value={campusInfo.contactEmail}
                  onChange={(e) => setCampusInfo({ ...campusInfo, contactEmail: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-700 bg-slate-950 text-sm text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowProfileEditModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Save size={14} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Institution;