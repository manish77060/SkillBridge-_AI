import React from "react";
import { Search, Bell, Menu } from "lucide-react";

function Topbar({
  currentUser,
  selectedPortal = "student",
  onRefresh,
  refreshing = false,
  onOpenPostJob,
  activePage,
  setActivePage,
  onToggleSidebar,
}) {
  const isIndustry = selectedPortal === "industry";
  const isInstitution = selectedPortal === "institution";

  const getSessionUser = () => {
    try {
      const session = JSON.parse(localStorage.getItem("skillbridge_auth_session") || "{}");
      return session?.user || null;
    } catch { return null; }
  };

  const sessionUser = getSessionUser();
  const userName =
    currentUser?.name ||
    sessionUser?.name ||
    (isIndustry ? "TechNova Recruiter" : isInstitution ? "Dean of Academics" : "Student");

  const userSub = isIndustry
    ? (currentUser?.company || sessionUser?.company || "TechNova Labs")
    : isInstitution
    ? (currentUser?.college || sessionUser?.college || "Academic Administration")
    : (currentUser?.branch || sessionUser?.branch || "Computer Science");

  const userInitials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const portalColors = {
    student:     "bg-gradient-to-br from-violet-500 to-indigo-600",
    industry:    "bg-gradient-to-br from-emerald-500 to-teal-600",
    institution: "bg-gradient-to-br from-amber-500 to-orange-600",
  };
  const avatarBg = portalColors[selectedPortal] || portalColors.student;

  return (
    <header className="sticky top-0 z-30 flex h-[68px] sm:h-[72px] items-center justify-between border-b border-gray-200 bg-white px-3 sm:px-6 shadow-sm">

      {/* LEFT: hamburger button (mobile only) + greeting */}
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-gray-100 transition shrink-0"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="min-w-0">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-400 truncate">
            {isIndustry ? "Industry" : isInstitution ? "Institution" : "Student"} Workspace
          </p>
          <h2 className="text-sm sm:text-lg font-extrabold text-slate-800 leading-tight truncate">
            Welcome, {userName.split(" ")[0]} 👋
          </h2>
        </div>
      </div>

      {/* CENTRE: Search bar */}
      <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 w-72 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition">
        <Search size={15} className="text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search skills, jobs, courses…"
          className="bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none w-full"
        />
      </div>

      {/* RIGHT: actions */}
      <div className="flex items-center gap-3">

        {/* Industry: Refresh */}
        {isIndustry && onRefresh && (
          <button type="button" onClick={onRefresh} disabled={refreshing}
            className="h-9 px-3.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center gap-2 text-xs font-semibold text-slate-600 transition cursor-pointer shadow-sm">
            <span className={`text-sm ${refreshing ? "animate-spin inline-block" : ""}`}>🔄</span>
            <span className="hidden md:inline">Refresh</span>
          </button>
        )}

        {/* Industry: Post opportunity */}
        {isIndustry && onOpenPostJob && (
          <button type="button" onClick={onOpenPostJob}
            className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 text-xs font-bold shadow-md shadow-emerald-200 transition cursor-pointer">
            <span className="text-base font-black">+</span> Post Opportunity
          </button>
        )}

        {/* Notification bell */}
        <button className="relative w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-slate-500 hover:text-slate-700 transition cursor-pointer shadow-sm">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white" />
        </button>

        {/* Connection status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-700 font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Connected
        </div>

        {/* Avatar */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-md cursor-pointer ${avatarBg}`}
          title={userName}>
          {userInitials}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
