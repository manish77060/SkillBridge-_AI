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
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 select-none">
      {/* ==================================================
          LOGO & PORTAL BADGE
      ================================================== */}
      <div className="flex h-[88px] items-center border-b border-slate-800 px-6">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg ${currentPortalConfig.logoBg}`}
          >
            <LogoIcon size={22} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">SkillBridge</h1>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded border ${currentPortalConfig.tagColor}`}
              >
                {currentPortalConfig.tag}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          MAIN NAVIGATION
      ================================================== */}
      <div className="flex-1 overflow-y-auto px-4 py-5 scrollbar-thin scrollbar-thumb-slate-800">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          {isStudent ? "Student Workspace" : isIndustry ? "Industry Workspace" : "Institute Workspace"}
        </p>

        <nav className="space-y-1.5">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActivePage(item.id)}
                className={`flex w-full items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-left transition-all duration-200 ${
                  isActive
                    ? currentPortalConfig.activeClass
                    : "text-slate-400 hover:bg-slate-900/80 hover:text-white"
                }`}
              >
                <Icon size={19} className={isActive ? "text-white" : "text-slate-400"} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* BOTTOM ITEMS */}
        {bottomItems.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Account & Growth
            </p>
            <nav className="space-y-1.5">
              {bottomItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (
                        item.id === "student-profile" ||
                        item.id === "profile" ||
                        item.id === "institution-profile"
                      ) {
                        setShowProfileModal(true);
                      } else {
                        setActivePage(item.id);
                      }
                    }}
                    className={`flex w-full items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-left transition-all duration-200 ${
                      isActive
                        ? currentPortalConfig.activeClass
                        : "text-slate-400 hover:bg-slate-900/80 hover:text-white"
                    }`}
                  >
                    <Icon size={19} className={isActive ? "text-white" : "text-slate-400"} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* ==================================================
          BOTTOM FOOTER: RBAC PORTAL ACCESS
      ================================================== */}
      <div className="border-t border-slate-800 bg-slate-950/80 p-3 space-y-2">
        {onSwitchPortal && (
          <div>
            {/* If Student: Restricted to Student Portal Only */}
            {userRole === "student" ? (
              <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-2 text-center">
                <p className="text-[11px] font-semibold text-violet-300 flex items-center justify-center gap-1.5">
                  <GraduationCap size={13} />
                  <span>Student Portal</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Single Portal Student Mode
                </p>
              </div>
            ) : userRole === "industry" ? (
              /* If Industry: Can access Student & Industry portals */
              <div>
                <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span>Switch Portal</span>
                  <ArrowLeftRight size={12} className="text-slate-500" />
                </p>
                <div className="grid grid-cols-2 gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => onSwitchPortal("student")}
                    title="Student Portal"
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      selectedPortal === "student"
                        ? "bg-violet-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <GraduationCap size={13} />
                    <span>Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSwitchPortal("industry")}
                    title="Industry Portal"
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      selectedPortal === "industry"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <Factory size={13} />
                    <span>Industry</span>
                  </button>
                </div>
              </div>
            ) : (
              /* If Institution: Can access ALL 3 portals (Student, Industry, Institution) */
              <div>
                <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span>Switch Portal</span>
                  <ArrowLeftRight size={12} className="text-slate-500" />
                </p>
                <div className="grid grid-cols-3 gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => onSwitchPortal("student")}
                    title="Student Portal"
                    className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition cursor-pointer ${
                      selectedPortal === "student"
                        ? "bg-violet-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <GraduationCap size={13} />
                    <span>Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSwitchPortal("industry")}
                    title="Industry Portal"
                    className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition cursor-pointer ${
                      selectedPortal === "industry"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <Factory size={13} />
                    <span>Industry</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSwitchPortal("institution")}
                    title="Institute Portal"
                    className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition cursor-pointer ${
                      selectedPortal === "institution"
                        ? "bg-amber-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <Building2 size={13} />
                    <span>Institute</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ==================================================
          LEFT BOTTOM CORNER: USER PROFILE & SETTINGS PILL
      ================================================== */}
      <div className="border-t border-slate-800 bg-slate-950 p-2.5">
        <button
          type="button"
          onClick={() => setShowProfileModal(true)}
          className="w-full flex items-center gap-3 p-2 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 transition-all text-left cursor-pointer group shadow-sm"
          title="Open Profile & Settings"
        >
          {/* Avatar with glowing online status dot */}
          <div className="relative shrink-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-md transition-transform group-hover:scale-105 ${currentPortalConfig.logoBg}`}
            >
              {userInitials}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
          </div>

          {/* Name & Role */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate group-hover:text-violet-300 transition">
              {displayName}
            </p>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">
              {displaySub}
            </p>
          </div>

          {/* Settings Cog Icon */}
          <div className="text-slate-400 group-hover:text-white transition p-1.5 rounded-lg bg-slate-800/60 group-hover:bg-slate-800 shrink-0">
            <Settings size={15} />
          </div>
        </button>
      </div>

      {/* POPUP MODAL: PROFILE & SETTINGS */}
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