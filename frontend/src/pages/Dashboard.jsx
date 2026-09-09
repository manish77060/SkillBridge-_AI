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
} from "lucide-react";

function Dashboard({ currentUser, setActivePage }) {
  const skills = [
    { name: "Java", score: 90 },
    { name: "Python", score: 82 },
    { name: "SQL", score: 76 },
    { name: "Git", score: 84 },
    { name: "REST APIs", score: 71 },
  ];

  const opportunities = [
    {
      company: "TechNova Labs",
      role: "Backend Developer Intern",
      location: "Bengaluru • Hybrid",
      match: 94,
      skills: ["Java", "SQL", "REST API"],
    },
    {
      company: "CloudSphere",
      role: "Software Engineering Intern",
      location: "Remote",
      match: 89,
      skills: ["Python", "Git", "Docker"],
    },
    {
      company: "DataCore Systems",
      role: "Junior Backend Engineer",
      location: "Pune • On-site",
      match: 84,
      skills: ["Java", "SQL", "AWS"],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="mb-1 text-sm text-slate-400">
            Welcome, {currentUser?.name || "Student"} • Your career intelligence overview
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Career Dashboard
          </h1>
        </div>
      </div>

      {/* Top statistics */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-start justify-between">
            <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-400">
              <Target size={21} />
            </div>

            <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
              <TrendingUp size={14} />
              +6%
            </span>
          </div>

          <p className="mt-5 text-sm text-slate-400">
            Career Readiness
          </p>

          <div className="mt-1 flex items-end gap-2">
            <span className="text-3xl font-bold text-white">
              78
            </span>

            <span className="mb-1 text-sm text-slate-500">
              / 100
            </span>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-indigo-500"
              style={{ width: "78%" }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-start justify-between">
            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400">
              <Brain size={21} />
            </div>

            <span className="text-xs text-slate-500">
              Verified
            </span>
          </div>

          <p className="mt-5 text-sm text-slate-400">
            Verified Skills
          </p>

          <div className="mt-1 flex items-end gap-2">
            <span className="text-3xl font-bold text-white">
              12
            </span>

            <span className="mb-1 text-sm text-slate-500">
              skills
            </span>
          </div>

          <p className="mt-3 text-xs text-emerald-400">
            +3 skills this month
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-start justify-between">
            <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-400">
              <BriefcaseBusiness size={21} />
            </div>

            <span className="text-xs text-slate-500">
              AI matched
            </span>
          </div>

          <p className="mt-5 text-sm text-slate-400">
            Opportunities
          </p>

          <div className="mt-1 flex items-end gap-2">
            <span className="text-3xl font-bold text-white">
              24
            </span>

            <span className="mb-1 text-sm text-slate-500">
              matches
            </span>
          </div>

          <p className="mt-3 text-xs text-indigo-400">
            8 new opportunities
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-start justify-between">
            <div className="rounded-xl bg-purple-500/10 p-2.5 text-purple-400">
              <GraduationCap size={21} />
            </div>

            <span className="text-xs text-slate-500">
              In progress
            </span>
          </div>

          <p className="mt-5 text-sm text-slate-400">
            Learning Progress
          </p>

          <div className="mt-1 flex items-end gap-2">
            <span className="text-3xl font-bold text-white">
              64%
            </span>
          </div>

          <p className="mt-3 text-xs text-purple-400">
            3 recommended courses
          </p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Skills */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Skill Intelligence
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your strongest industry-relevant skills
              </p>
            </div>

            <button className="flex items-center gap-1 text-sm font-medium text-indigo-400 hover:text-indigo-300">
              View all
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {skills.map((skill) => (
              <div key={skill.name}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">
                    {skill.name}
                  </span>

                  <span className="text-sm font-semibold text-white">
                    {skill.score}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* AI insight */}
          <div className="mt-7 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
            <div className="flex gap-3">
              <div className="mt-0.5 text-indigo-400">
                <Lightbulb size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  AI Skill Insight
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Your Java and SQL foundation is strong for backend
                  development. Adding Spring Boot and Docker could
                  significantly improve your readiness for your target role.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Readiness */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-400">
              <Target size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                Target Career
              </h2>

              <p className="text-xs text-slate-500">
                Backend Developer
              </p>
            </div>
          </div>

          <div className="mt-7 flex justify-center">
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-[12px] border-indigo-500/20">
              <div className="absolute inset-[-12px] rounded-full border-[12px] border-transparent border-t-indigo-500 border-r-indigo-500 rotate-[-25deg]" />

              <div className="text-center">
                <p className="text-4xl font-bold text-white">
                  78
                </p>

                <p className="text-xs text-slate-500">
                  readiness
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">
                Required skills
              </span>

              <span className="font-medium text-emerald-400">
                5 / 7
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">
                Assessments
              </span>

              <span className="font-medium text-white">
                82%
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">
                Projects
              </span>

              <span className="font-medium text-white">
                3
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Skill gaps */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-white">
                Priority Skill Gaps
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Skills holding back your readiness
              </p>
            </div>

            <Code2 size={19} className="text-amber-400" />
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">
                  Spring Boot
                </span>

                <span className="text-red-400">
                  High
                </span>
              </div>

              <div className="mt-2 h-1.5 rounded-full bg-slate-800">
                <div className="h-full w-[28%] rounded-full bg-red-500" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">
                  Docker
                </span>

                <span className="text-amber-400">
                  Medium
                </span>
              </div>

              <div className="mt-2 h-1.5 rounded-full bg-slate-800">
                <div className="h-full w-[42%] rounded-full bg-amber-500" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">
                  AWS
                </span>

                <span className="text-amber-400">
                  Medium
                </span>
              </div>

              <div className="mt-2 h-1.5 rounded-full bg-slate-800">
                <div className="h-full w-[35%] rounded-full bg-amber-500" />
              </div>
            </div>
          </div>

          <button className="mt-5 flex items-center gap-1 text-sm font-medium text-indigo-400">
            Generate learning roadmap
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Learning */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-white">
                Recommended Learning
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Personalized for your skill gaps
              </p>
            </div>

            <GraduationCap size={19} className="text-purple-400" />
          </div>

          <div className="mt-5 space-y-4">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                <Code2 size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-white">
                  Spring Boot Fundamentals
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  8 hours • Beginner
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <Database size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-white">
                  Docker for Developers
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  6 hours • Intermediate
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <CloudIcon />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-white">
                  AWS Cloud Essentials
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  10 hours • Beginner
                </p>
              </div>
            </div>
          </div>

          <button className="mt-5 flex items-center gap-1 text-sm font-medium text-indigo-400">
            View roadmap
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Opportunity preview */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-white">
                Top Opportunity
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Highest compatibility
              </p>
            </div>

            <BriefcaseBusiness
              size={19}
              className="text-emerald-400"
            />
          </div>

          <div className="mt-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-white">
                  TechNova Labs
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Backend Developer Intern
                </p>
              </div>

              <div className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-sm font-bold text-emerald-400">
                94%
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Bengaluru • Hybrid
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {opportunities[0].skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-500/5 p-3">
            <CheckCircle2
              size={17}
              className="text-emerald-400"
            />

            <p className="text-xs text-slate-400">
              Strong match based on your verified skills.
            </p>
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center gap-3">
          <Clock3 size={19} className="text-slate-400" />

          <div>
            <h2 className="font-semibold text-white">
              Recent Activity
            </h2>

            <p className="text-xs text-slate-500">
              Your latest career progress
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Activity
            title="Resume analyzed"
            description="12 skills extracted by AI"
            time="Today"
          />

          <Activity
            title="Assessment completed"
            description="Backend Development • 82%"
            time="Yesterday"
          />

          <Activity
            title="New opportunity matched"
            description="94% compatibility"
            time="2 days ago"
          />
        </div>
      </div>
    </div>
  );
}

function Activity({ title, description, time }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
      <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-indigo-500" />

      <div className="flex-1">
        <p className="text-sm font-medium text-white">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>

      <span className="text-xs text-slate-600">
        {time}
      </span>
    </div>
  );
}

function CloudIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.5 19H9a7 7 0 1 1 6.7-9H17a5 5 0 0 1 .5 9Z" />
    </svg>
  );
}

export default Dashboard;