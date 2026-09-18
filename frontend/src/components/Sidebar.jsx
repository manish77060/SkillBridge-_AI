import React, { useState } from "react";
import {
  LayoutDashboard,
  Brain,
  ClipboardCheck,
  Target,
  BriefcaseBusiness,
  FileText,
  FolderKanban,
  GraduationCap,
  Building2,
  Sparkles,
  Users,
  BarChart3,
  UserRound,
  ArrowLeftRight,
  Factory,
  Settings,
} from "lucide-react";
import ProfileSettingsModal from "./ProfileSettingsModal";

function Sidebar({
  activePage,
  setActivePage,
  selectedPortal = "student",
  onSwitchPortal,
  onLogout,
  currentUser,
  authPortal,
  onUpdateProfile,
}) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  // Resolve user role for RBAC
  const userRole =
    authPortal ||
    currentUser?.authPortal ||
    (() => {
      try {
        const session = JSON.parse(localStorage.getItem("skillbridge_auth_session") || "{}");
        return session?.user?.authPortal || session?.portal || selectedPortal;
      } catch {
        return selectedPortal;
      }
    })();
  // Navigation items for each portal
  const studentMainItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "skills",
      label: "Skills & Gaps",
      icon: Brain,
    },
    {
      id: "assessment",
      label: "Assessment",
      icon: ClipboardCheck,
    },
    {
      id: "career",
      label: "Career Readiness",
      icon: Target,
    },
    {
      id: "opportunities",
      label: "Opportunities",
      icon: BriefcaseBusiness,
    },
    {
      id: "applications",
      label: "Applications",
      icon: FileText,
    },
    {
      id: "portfolio",
      label: "Portfolio",
      icon: FolderKanban,
    },
  ];

  const studentBottomItems = [
    {
      id: "learning",
      label: "Learning Center",
      icon: GraduationCap,
    },
    {
      id: "student-profile",
      label: "My Profile",
      icon: UserRound,
    },
  ];

  const industryMainItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "opportunities",
      label: "Opportunities",
      icon: BriefcaseBusiness,
    },
    {
      id: "candidates",
      label: "Candidates",
      icon: Users,
    },
    {
      id: "recruitment",
      label: "Recruitment Pipeline",
      icon: Target,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
    },
  ];

  const industryBottomItems = [
    {
      id: "profile",
      label: "Company Profile",
      icon: Building2,
    },
  ];

  const institutionMainItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "students",
      label: "Student Cohort",
      icon: Users,
    },
    {
      id: "analytics",
      label: "Placement Analytics",
      icon: BarChart3,
    },
  ];

  const institutionBottomItems = [
    {
      id: "institution-profile",
      label: "Campus Profile",
      icon: Building2,
    },
  ];

  const isStudent = selectedPortal === "student";
  const isIndustry = selectedPortal === "industry";
  const isInstitution = selectedPortal === "institution";

  const mainItems = isStudent
    ? studentMainItems
    : isIndustry
    ? industryMainItems
    : institutionMainItems;

  const bottomItems = isStudent
    ? studentBottomItems
    : isIndustry
    ? industryBottomItems
    : institutionBottomItems;

  const portalConfig = {
    student: {
      tag: "STUDENT PORTAL",
      tagColor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
      logoBg: "bg-gradient-to-br from-violet-500 to-indigo-600 shadow-violet-500/25",
      logoIcon: Sparkles,
      activeClass:
        "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/25",
      accentBorder: "border-violet-500",
    },
    industry: {
      tag: "INDUSTRY PORTAL",
      tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      logoBg: "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/25",
      logoIcon: Factory,
      activeClass:
        "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25",
      accentBorder: "border-emerald-500",
    },
    institution: {
      tag: "INSTITUTE PORTAL",
      tagColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      logoBg: "bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/25",
      logoIcon: Building2,
      activeClass:
        "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/25",
      accentBorder: "border-amber-500",
    },
  };

  const currentPortalConfig = portalConfig[selectedPortal] || portalConfig.student;
  const LogoIcon = currentPortalConfig.logoIcon;

  // Derive user info with fallback to session storage
  const getSessionUser = () => {
    try {
      const session = JSON.parse(localStorage.getItem("skillbridge_auth_session") || "{}");
      return session?.user || null;
    } catch {
      return null;
    }
  };

  const sessionUser = getSessionUser();
  const displayName =
    currentUser?.name ||
    sessionUser?.name ||
    (isIndustry ? "TechNova Recruiter" : isInstitution ? "Dean of Academics" : "Student Demo");

  const displaySub = isIndustry
    ? (currentUser?.company || sessionUser?.company || "TechNova Labs")
    : isInstitution
    ? (currentUser?.college || sessionUser?.college || "Academic Administration")
    : (currentUser?.branch || sessionUser?.branch || "Computer Science");

  const userInitials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "SB";

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-white select-none shadow-sm">
      {/* ── LOGO ── */}
      <div className="flex h-[72px] items-center border-b border-gray-100 px-5">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="SkillBridge AI" className="w-11 h-11 object-contain shrink-0" />
          <div>
            <h1 className="text-base font-extrabold text-slate-800 tracking-tight leading-tight">SkillBridge</h1>
            <span className={`text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded-md border ${currentPortalConfig.tagColor}`}>
              {currentPortalConfig.tag}
            </span>
          </div>
        </div>
      </div>

      {/* ── MAIN NAV ── */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {isStudent ? "Student Workspace" : isIndustry ? "Industry Workspace" : "Institute Workspace"}
        </p>

        <nav className="space-y-1">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActivePage(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 cursor-pointer ${
                  isActive
                    ? currentPortalConfig.activeClass
                    : "text-slate-500 hover:bg-gray-50 hover:text-slate-800"
                }`}
              >
                <Icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
                <span className="text-sm font-semibold">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* BOTTOM NAV ITEMS */}
        {bottomItems.length > 0 && (
          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Account</p>
            <nav className="space-y-1">
              {bottomItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.id === "student-profile" || item.id === "profile" || item.id === "institution-profile") {
                        setShowProfileModal(true);
                      } else {
                        setActivePage(item.id);
                      }
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 cursor-pointer ${
                      isActive
                        ? currentPortalConfig.activeClass
                        : "text-slate-500 hover:bg-gray-50 hover:text-slate-800"
                    }`}
                  >
                    <Icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* ── PORTAL SWITCHER ── */}
      <div className="border-t border-gray-100 bg-gray-50/80 p-3 space-y-2">
        {onSwitchPortal && (
          <div>
            {userRole === "student" ? (
              <div className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-center">
                <p className="text-[11px] font-bold text-violet-600 flex items-center justify-center gap-1.5">
                  <GraduationCap size={12} /> Student Portal
                </p>
              </div>
            ) : userRole === "industry" ? (
              <div>
                <p className="px-1 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center justify-between">
                  <span>Switch Portal</span><ArrowLeftRight size={11} />
                </p>
                <div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-xl border border-gray-200">
                  {[
                    { id: "student",  label: "Student",  Icon: GraduationCap, active: "bg-violet-600 text-white" },
                    { id: "industry", label: "Industry",  Icon: Factory,       active: "bg-emerald-600 text-white" },
                  ].map((p) => (
                    <button key={p.id} type="button" onClick={() => onSwitchPortal(p.id)} title={p.label}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        selectedPortal === p.id ? p.active : "text-slate-400 hover:text-slate-700 hover:bg-gray-50"}`}>
                      <p.Icon size={12} />{p.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="px-1 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center justify-between">
                  <span>Switch Portal</span><ArrowLeftRight size={11} />
                </p>
                <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl border border-gray-200">
                  {[
                    { id: "student",     label: "Student",   Icon: GraduationCap, active: "bg-violet-600 text-white" },
                    { id: "industry",    label: "Industry",  Icon: Factory,       active: "bg-emerald-600 text-white" },
                    { id: "institution", label: "Institute", Icon: Building2,     active: "bg-amber-600 text-white" },
                  ].map((p) => (
                    <button key={p.id} type="button" onClick={() => onSwitchPortal(p.id)} title={p.label}
                      className={`py-1.5 px-1 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                        selectedPortal === p.id ? p.active : "text-slate-400 hover:text-slate-700 hover:bg-gray-50"}`}>
                      <p.Icon size={11} />{p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── USER PROFILE PILL ── */}
      <div className="border-t border-gray-100 bg-white p-3">
        <button
          type="button"
          onClick={() => setShowProfileModal(true)}
          className="w-full flex items-center gap-3 p-2.5 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-all text-left cursor-pointer group"
        >
          <div className="relative shrink-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-sm ${currentPortalConfig.logoBg}`}>
              {userInitials}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-700 truncate group-hover:text-indigo-600 transition">{displayName}</p>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">{displaySub}</p>
          </div>
          <Settings size={14} className="text-slate-400 group-hover:text-slate-600 transition shrink-0" />
        </button>
      </div>

      {/* PROFILE MODAL */}
      <ProfileSettingsModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentUser={currentUser}
        selectedPortal={selectedPortal}
        onUpdateProfile={onUpdateProfile}
        onLogout={onLogout}
      />
    </aside>
  );
}

export default Sidebar;

