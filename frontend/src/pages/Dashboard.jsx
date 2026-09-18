import {
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Code2,
  Database,
  GraduationCap,
  Lightbulb,
  Target,
  TrendingUp,
  TrendingDown,
  Zap,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";

function Dashboard({ currentUser, setActivePage }) {
  const skills = [
    { name: "Java",      score: 90, prev: 85 },
    { name: "Python",    score: 82, prev: 78 },
    { name: "SQL",       score: 76, prev: 74 },
    { name: "Git",       score: 84, prev: 80 },
    { name: "REST APIs", score: 71, prev: 65 },
    { name: "React",     score: 63, prev: 58 },
  ];

  const opportunities = [
    { company: "TechNova Labs",    role: "Backend Developer Intern",      location: "Bengaluru • Hybrid", match: 94, salary: "₹8–12 LPA", skills: ["Java", "SQL", "REST API"], color: "indigo" },
    { company: "CloudSphere",      role: "Software Engineering Intern",   location: "Remote",             match: 89, salary: "₹6–10 LPA", skills: ["Python", "Git", "Docker"], color: "violet" },
    { company: "DataCore Systems", role: "Junior Backend Engineer",       location: "Pune • On-site",     match: 84, salary: "₹10–15 LPA", skills: ["Java", "SQL", "AWS"],    color: "emerald" },
  ];

  // Application trend data (last 7 months)
  const trendData = [
    { month: "Mar", applied: 2, reviewed: 1, selected: 0 },
    { month: "Apr", applied: 4, reviewed: 2, selected: 1 },
    { month: "May", applied: 3, reviewed: 3, selected: 1 },
    { month: "Jun", applied: 6, reviewed: 4, selected: 2 },
    { month: "Jul", applied: 5, reviewed: 4, selected: 1 },
    { month: "Aug", applied: 8, reviewed: 5, selected: 3 },
    { month: "Sep", applied: 6, reviewed: 5, selected: 2 },
  ];
  const maxVal = 10;

  return (
    <div className="space-y-6 pb-8">

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="mb-1 text-sm text-slate-500">
            Welcome, <strong className="text-slate-700">{currentUser?.name || "Student"}</strong> • Career intelligence overview
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Career Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1.5 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Data
          </span>
          <button onClick={() => setActivePage("opportunities")}
            className="inline-flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-4 py-1.5 font-semibold transition cursor-pointer shadow-md shadow-indigo-200">
            <Zap size={12} /> Find Jobs
          </button>
        </div>
      </div>

      {/* ── ROW 1: 4 STAT CARDS ── */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        {/* Career Score */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
              <Target size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp size={11} /> +6%
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Career Score</p>
          <div className="flex items-end gap-1.5 mt-1">
            <span className="text-4xl font-black text-slate-800">85</span>
            <span className="text-sm text-slate-400 mb-1.5">/ 100</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Backend Developer track</p>
          <div className="mt-3 h-1.5 rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: "85%" }} />
          </div>
          {/* Subtle accent */}
          <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-indigo-50 opacity-60" />
        </div>

        {/* Skills Growth */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600">
              <Brain size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp size={11} /> +3 skills
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Skills Growth</p>
          <div className="flex items-end gap-1.5 mt-1">
            <span className="text-4xl font-black text-slate-800">12</span>
            <span className="text-sm text-slate-400 mb-1.5">verified</span>
          </div>
          {/* Mini sparkline bars */}
          <div className="flex items-end gap-1 mt-3 h-8">
            {[40, 55, 45, 70, 60, 80, 75].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-sm bg-violet-200"
                style={{ height: `${h}%` }}>
                <div className="w-full rounded-t-sm bg-violet-500 opacity-0 hover:opacity-100 transition" />
              </div>
            ))}
          </div>
          <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-violet-50 opacity-60" />
        </div>

        {/* Assessment Score */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <BookOpen size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp size={11} /> +5%
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Assessment Score</p>
          <div className="flex items-end gap-1.5 mt-1">
            <span className="text-4xl font-black text-slate-800">82</span>
            <span className="text-sm text-slate-400 mb-1.5">/ 100</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Last test: Backend Dev</p>
          <div className="mt-3 h-1.5 rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: "82%" }} />
          </div>
          <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-blue-50 opacity-60" />
        </div>

        {/* Applications */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <BriefcaseBusiness size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-400 bg-gray-100 px-2 py-0.5 rounded-full">
              This month
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Applications</p>
          <div className="flex items-end gap-1.5 mt-1">
            <span className="text-4xl font-black text-slate-800">8</span>
            <span className="text-sm text-slate-400 mb-1.5">sent</span>
          </div>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 font-medium">5 Pending</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium">3 Reviewed</span>
          </div>
          <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-emerald-50 opacity-60" />
        </div>
      </div>

      {/* ── ROW 2: MAIN GRID (Skills + Right Panel) ── */}
      <div className="grid gap-5 xl:grid-cols-3">

        {/* Skills Intelligence — spans 2 cols */}
        <div className="xl:col-span-2 space-y-5">

          {/* Skill Progress */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-slate-800">Skill Progress</h2>
                <p className="text-xs text-slate-400 mt-0.5">Your top industry-relevant skills</p>
              </div>
              <button onClick={() => setActivePage("skills")}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition cursor-pointer">
                View all <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-600">{skill.name}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-800">{skill.score}%</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">+{skill.score - skill.prev}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                      style={{ width: `${skill.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
            {/* AI Insight */}
            <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 p-4 flex gap-3">
              <div className="text-indigo-500 mt-0.5 shrink-0"><Lightbulb size={17} /></div>
              <div>
                <p className="text-xs font-bold text-indigo-700">AI Skill Insight</p>
                <p className="text-xs text-indigo-600 mt-1 leading-relaxed">
                  Your Java & SQL foundation is strong. Adding Spring Boot and Docker could increase your career readiness by <strong>+12%</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Application Trends Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-slate-800">Application Trends</h2>
                <p className="text-xs text-slate-400 mt-0.5">Last 7 months activity</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-400 inline-block" />Applied</span>
                <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block" />Reviewed</span>
                <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2.5 h-2.5 rounded-sm bg-pink-400 inline-block" />Selected</span>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end gap-2 h-36">
              {trendData.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-0.5">
                  <div className="w-full flex items-end gap-0.5 justify-center" style={{ height: "112px" }}>
                    {/* Applied */}
                    <div className="flex-1 rounded-t-md bg-indigo-400 hover:bg-indigo-500 transition-all cursor-pointer"
                      style={{ height: `${(d.applied / maxVal) * 100}%` }}
                      title={`Applied: ${d.applied}`} />
                    {/* Reviewed */}
                    <div className="flex-1 rounded-t-md bg-emerald-400 hover:bg-emerald-500 transition-all cursor-pointer"
                      style={{ height: `${(d.reviewed / maxVal) * 100}%` }}
                      title={`Reviewed: ${d.reviewed}`} />
                    {/* Selected */}
                    <div className="flex-1 rounded-t-md bg-pink-400 hover:bg-pink-500 transition-all cursor-pointer"
                      style={{ height: `${(d.selected / maxVal) * 100}%` }}
                      title={`Selected: ${d.selected}`} />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{d.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: Career Goals + Recommendations ── */}
        <div className="space-y-5">

          {/* Career Readiness Ring */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800">Career Readiness</h2>
              <button onClick={() => setActivePage("career")}
                className="text-xs text-indigo-600 font-semibold flex items-center gap-1 cursor-pointer hover:text-indigo-700">
                Improve <ArrowUpRight size={12} />
              </button>
            </div>
            {/* SVG Ring */}
            <div className="flex justify-center my-4">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="url(#grad)" strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 50 * 0.78} ${2 * Math.PI * 50 * 0.22}`}
                    strokeLinecap="round" />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-800">78</span>
                  <span className="text-[10px] text-slate-400 font-medium">readiness</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { label: "Required skills", value: "5 / 7", color: "text-emerald-600" },
                { label: "Assessments",     value: "82%",   color: "text-slate-700" },
                { label: "Projects",        value: "3",     color: "text-slate-700" },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between text-sm py-1 border-b border-gray-50 last:border-0">
                  <span className="text-slate-500">{r.label}</span>
                  <span className={`font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Job Matches */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800">Top Picks for You</h2>
              <button onClick={() => setActivePage("opportunities")}
                className="text-xs text-indigo-600 font-semibold flex items-center gap-1 cursor-pointer hover:text-indigo-700">
                View all <ArrowUpRight size={12} />
              </button>
            </div>
            <div className="space-y-3">
              {opportunities.map((o) => {
                const initials = o.company.split(" ").map(w => w[0]).join("").slice(0, 2);
                const colorMap = { indigo: "bg-indigo-100 text-indigo-700", violet: "bg-violet-100 text-violet-700", emerald: "bg-emerald-100 text-emerald-700" };
                const matchColor = o.match >= 90 ? "bg-emerald-100 text-emerald-700" : o.match >= 85 ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700";
                return (
                  <div key={o.company} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer group">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${colorMap[o.color]}`}>
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-700 truncate group-hover:text-indigo-600 transition">{o.company}</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${matchColor}`}>{o.match}%</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{o.role}</p>
                      <p className="text-xs text-indigo-500 font-semibold mt-0.5">{o.salary}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 3: BOTTOM FULL WIDTH ── */}
      <div className="grid gap-5 xl:grid-cols-3">

        {/* Priority Skill Gaps */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-800">Priority Skill Gaps</h2>
              <p className="text-xs text-slate-400 mt-0.5">Skills holding back your readiness</p>
            </div>
            <Code2 size={18} className="text-amber-500" />
          </div>
          <div className="space-y-4">
            {[
              { name: "Spring Boot", pct: 28, level: "High",   color: "bg-red-400",   text: "text-red-600",   bg: "bg-red-50 text-red-600" },
              { name: "Docker",      pct: 42, level: "Medium", color: "bg-amber-400", text: "text-amber-600", bg: "bg-amber-50 text-amber-600" },
              { name: "AWS",         pct: 35, level: "Medium", color: "bg-amber-400", text: "text-amber-600", bg: "bg-amber-50 text-amber-600" },
            ].map((g) => (
              <div key={g.name}>
                <div className="flex items-center justify-between mb-1.5 text-sm">
                  <span className="font-medium text-slate-600">{g.name}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${g.bg}`}>{g.level}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100">
                  <div className={`h-full rounded-full ${g.color}`} style={{ width: `${g.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setActivePage("learning")}
            className="mt-5 flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer transition">
            Generate learning roadmap <ChevronRight size={14} />
          </button>
        </div>

        {/* Recommended Learning */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-800">Recommended Learning</h2>
              <p className="text-xs text-slate-400 mt-0.5">Personalized for your skill gaps</p>
            </div>
            <GraduationCap size={18} className="text-purple-500" />
          </div>
          <div className="space-y-4">
            {[
              { icon: <Code2 size={17} />,    bg: "bg-orange-50 text-orange-500", title: "Spring Boot Fundamentals",  duration: "8 hrs",  level: "Beginner",     pct: 0 },
              { icon: <Database size={17} />, bg: "bg-blue-50 text-blue-500",    title: "Docker for Developers",     duration: "6 hrs",  level: "Intermediate", pct: 35 },
              { icon: <CloudIcon />,          bg: "bg-emerald-50 text-emerald-500", title: "AWS Cloud Essentials",   duration: "10 hrs", level: "Beginner",     pct: 0 },
            ].map((c) => (
              <div key={c.title} className="flex gap-3 group cursor-pointer hover:bg-gray-50 rounded-xl p-2 -mx-2 transition">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.bg}`}>{c.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition truncate">{c.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{c.duration} • {c.level}</p>
                  {c.pct > 0 && (
                    <div className="mt-1.5 h-1 rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-indigo-400" style={{ width: `${c.pct}%` }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setActivePage("learning")}
            className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer transition">
            View full roadmap <ChevronRight size={14} />
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <Clock3 size={17} className="text-slate-400" />
            <div>
              <h2 className="text-base font-bold text-slate-800">Recent Activity</h2>
              <p className="text-xs text-slate-400">Your latest career progress</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { title: "Resume analyzed",         desc: "12 skills extracted by AI",   time: "Today",     dot: "bg-indigo-500" },
              { title: "Assessment completed",     desc: "Backend Dev • 82%",           time: "Yesterday", dot: "bg-emerald-500" },
              { title: "New opportunity matched",  desc: "94% compatibility",            time: "2 days ago",dot: "bg-violet-500" },
              { title: "Profile updated",          desc: "Java & REST API added",        time: "3 days ago",dot: "bg-blue-400" },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition">
                <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${a.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700">{a.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{a.desc}</p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 font-medium">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CloudIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.7-9H17a5 5 0 0 1 .5 9Z" />
    </svg>
  );
}

export default Dashboard;