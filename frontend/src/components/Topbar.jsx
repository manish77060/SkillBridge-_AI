import React from "react";

function Topbar({
  currentUser,
  selectedPortal = "student",
  onRefresh,
  refreshing = false,
  onOpenPostJob,
  activePage,
  setActivePage,
}) {
  const isIndustry = selectedPortal === "industry";
  const isInstitution = selectedPortal === "institution";

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
  const userName =
    currentUser?.name ||
    sessionUser?.name ||
    (isIndustry ? "TechNova Recruiter" : isInstitution ? "Dean of Academics" : "Student");

  const userSub = isIndustry
    ? (currentUser?.company || sessionUser?.company || "TechNova Labs")
    : isInstitution
    ? (currentUser?.college || sessionUser?.college || "Academic Administration")
    : (currentUser?.branch || sessionUser?.branch || "Computer Science");

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950/95 px-8 backdrop-blur">
      {/* LEFT: WORKSPACE CONTEXT & USER GREETING */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {isIndustry
            ? "Industry Workspace"
            : isInstitution
            ? "Institution Workspace"
            : "Student Workspace"}
        </p>

        <h2 className="text-xl font-semibold text-white mt-0.5">
          Welcome back, {userName} 👋
        </h2>
      </div>

      {/* RIGHT: ACTIONS & STATUS BADGE */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Industry Quick Refresh Action */}
        {isIndustry && onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="h-10 px-3.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 flex items-center gap-2 text-xs font-medium text-slate-200 transition cursor-pointer"
            title="Refresh opportunities and candidates"
          >
            <span className={`text-sm ${refreshing ? "animate-spin inline-block" : ""}`}>🔄</span>
            <span className="hidden md:inline">Refresh</span>
          </button>
        )}

        {/* Industry Post Opportunity Action */}
        {isIndustry && onOpenPostJob && (
          <button
            type="button"
            onClick={onOpenPostJob}
            className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 text-xs font-semibold shadow-lg shadow-emerald-600/25 transition cursor-pointer"
          >
            <span className="text-base font-bold">+</span>
            <span>Post Opportunity</span>
          </button>
        )}

        {/* System & Database Connection Status Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-slate-300">Supabase Connected</span>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
