import { useState } from "react";

import {
  FolderKanban,
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  ExternalLink,
  Plus,
  Sparkles,
  Download,
  User,
  Mail,
  MapPin,
  X,
  Trash2,
} from "lucide-react";

function Portfolio({ currentUser }) {
  const getSessionUser = () => {
    try {
      const session = JSON.parse(localStorage.getItem("skillbridge_auth_session") || "{}");
      return session?.user || null;
    } catch {
      return null;
    }
  };
  const sessionUser = getSessionUser();
  const userName = currentUser?.name || sessionUser?.name || "Student";
  const userEmail = currentUser?.email || sessionUser?.email || "student@skillbridge.com";
  const userBranch = currentUser?.branch || sessionUser?.branch || "Computer Science • Backend Developer";
  const userInitial = userName ? userName.charAt(0).toUpperCase() : "S";

  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "Career Intelligence Platform",
      description:
        "AI-powered platform that analyzes skills, identifies career gaps and recommends personalized learning paths.",
      technologies: ["React", "Python", "FastAPI", "AI"],
      status: "Verified",
      github: "",
    },
    {
      id: 2,
      title: "Smart Allocation Engine",
      description:
        "Intelligent system designed to automate resource allocation using data-driven decision making.",
      technologies: ["Python", "Machine Learning", "API"],
      status: "Verified",
      github: "",
    },
    {
      id: 3,
      title: "Student Management System",
      description:
        "Web application for managing student records, academic information and institutional workflows.",
      technologies: ["Java", "SQL", "React"],
      status: "Verified",
      github: "",
    },
  ]);

  // ==================================================
  // CERTIFICATES
  // ==================================================

  const certificates = [
    {
      title: "Python Programming",
      issuer: "Online Certification",
      year: "2026",
    },
    {
      title: "Web Development",
      issuer: "Technical Certification",
      year: "2026",
    },
    {
      title: "Artificial Intelligence Fundamentals",
      issuer: "AI Certification",
      year: "2026",
    },
    {
      title: "Database Management",
      issuer: "Technical Certification",
      year: "2025",
    },
  ];

  // ==================================================
  // SKILLS
  // ==================================================

  const skills = [
    "Java",
    "Python",
    "SQL",
    "React",
    "REST APIs",
    "Git",
    "FastAPI",
    "Machine Learning",
  ];

  // ==================================================
  // MODAL STATE
  // ==================================================

  const [showProjectModal, setShowProjectModal] = useState(false);

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    technologies: "",
    github: "",
  });

  // ==================================================
  // ADD PROJECT
  // ==================================================

  const handleAddProject = () => {
    if (
      !newProject.title.trim() ||
      !newProject.description.trim() ||
      !newProject.technologies.trim()
    ) {
      alert(
        "Please fill in Project Name, Description and Technologies."
      );
      return;
    }

    const project = {
      id: Date.now(),
      title: newProject.title.trim(),
      description: newProject.description.trim(),
      technologies: newProject.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean),
      status: "Pending Verification",
      github: newProject.github.trim(),
    };

    setProjects((currentProjects) => [
      ...currentProjects,
      project,
    ]);

    setNewProject({
      title: "",
      description: "",
      technologies: "",
      github: "",
    });

    setShowProjectModal(false);
  };

  // ==================================================
  // DELETE PROJECT
  // ==================================================

  const handleDeleteProject = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this project?"
    );

    if (!confirmDelete) {
      return;
    }

    setProjects((currentProjects) =>
      currentProjects.filter((project) => project.id !== id)
    );
  };

  // ==================================================
  // VIEW PROJECT
  // ==================================================

  const handleViewProject = (project) => {
    if (project.github) {
      window.open(
        project.github,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }

    alert(
      `${project.title}\n\n${project.description}\n\nTechnologies: ${project.technologies.join(
        ", "
      )}`
    );
  };

  // ==================================================
  // DOWNLOAD PORTFOLIO
  // ==================================================

  const handleDownloadPortfolio = () => {
    window.print();
  };

  // ==================================================
  // CLOSE MODAL WITH ESCAPE
  // ==================================================

  const handleModalKeyDown = (event) => {
    if (event.key === "Escape") {
      setShowProjectModal(false);
    }
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <div
      className="min-h-screen text-white"
      onKeyDown={handleModalKeyDown}
    >
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <p className="mb-2 text-sm font-medium text-violet-400">
            Digital Career Portfolio
          </p>

          <h1 className="text-3xl font-bold">
            My Portfolio
          </h1>

          <p className="mt-2 text-slate-400">
            Showcase your verified skills, projects,
            certificates and professional achievements.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* DOWNLOAD */}

          <button
            type="button"
            onClick={handleDownloadPortfolio}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-violet-500 hover:text-white"
          >
            <Download size={18} />

            Download Portfolio
          </button>

          {/* ADD PROJECT */}

          <button
            type="button"
            onClick={() => setShowProjectModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:scale-[1.02]"
          >
            <Plus size={18} />

            Add Project
          </button>
        </div>
      </div>

      {/* ==================================================
          PROFILE CARD
      ================================================== */}

      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            {/* AVATAR */}

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-2xl font-bold text-white">
              {userInitial}
            </div>

            {/* PROFILE INFO */}

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold text-white">
                  {userName}
                </h2>

                <CheckCircle2
                  size={20}
                  className="text-emerald-400"
                />
              </div>

              <p className="mt-1 text-slate-400">
                {userBranch}
              </p>

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <Mail size={15} />

                  {userEmail}
                </span>

                <span className="flex items-center gap-2">
                  <MapPin size={15} />

                  India
                </span>
              </div>
            </div>
          </div>

          {/* VERIFIED */}

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 size={18} />

              <span className="font-semibold">
                Profile Verified
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-400">
              Skills and achievements verified
            </p>
          </div>
        </div>
      </div>

      {/* ==================================================
          PORTFOLIO STATS
      ================================================== */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* VERIFIED SKILLS */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
            <User
              size={20}
              className="text-violet-400"
            />
          </div>

          <p className="text-sm text-slate-500">
            Verified Skills
          </p>

          <p className="mt-1 text-3xl font-bold">
            12
          </p>
        </div>

        {/* PROJECTS */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
            <FolderKanban
              size={20}
              className="text-blue-400"
            />
          </div>

          <p className="text-sm text-slate-500">
            Projects
          </p>

          <p className="mt-1 text-3xl font-bold">
            {projects.length}
          </p>
        </div>

        {/* CERTIFICATES */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
            <Award
              size={20}
              className="text-amber-400"
            />
          </div>

          <p className="text-sm text-slate-500">
            Certificates
          </p>

          <p className="mt-1 text-3xl font-bold">
            {certificates.length}
          </p>
        </div>

        {/* EXPERIENCE */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
            <BriefcaseBusiness
              size={20}
              className="text-emerald-400"
            />
          </div>

          <p className="text-sm text-slate-500">
            Experience
          </p>

          <p className="mt-1 text-3xl font-bold">
            2
          </p>
        </div>
      </div>

      {/* ==================================================
          AI PORTFOLIO INSIGHT
      ================================================== */}

      <div className="mb-6 rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-950/50 to-indigo-950/40 p-6">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/20">
            <Sparkles
              size={22}
              className="text-violet-400"
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-bold">
                AI Portfolio Insight
              </h2>

              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                Strong Profile
              </span>
            </div>

            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
              Your portfolio shows strong programming and
              backend development foundations. Adding a
              Spring Boot project, Docker deployment and
              cloud experience could make your profile
              stronger for backend development opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* ==================================================
          VERIFIED SKILLS
      ================================================== */}

      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Verified Skills
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Skills supported by assessments, projects or
              certificates.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              alert(
                "Skill management will be connected next."
              )
            }
            className="text-left text-sm font-medium text-violet-400 hover:text-violet-300 sm:text-right"
          >
            Manage Skills
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <div
              key={skill}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5"
            >
              <CheckCircle2
                size={16}
                className="text-emerald-400"
              />

              <span className="text-sm text-slate-200">
                {skill}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================
          PROJECTS
      ================================================== */}

      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Projects
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your industry-relevant project experience.
            </p>
          </div>

          <FolderKanban
            size={22}
            className="text-violet-400"
          />
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950 p-10 text-center">
            <FolderKanban
              size={35}
              className="mx-auto mb-3 text-slate-600"
            />

            <h3 className="font-semibold text-slate-300">
              No projects yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Add your first project to build your digital
              career portfolio.
            </p>

            <button
              type="button"
              onClick={() => setShowProjectModal(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold"
            >
              <Plus size={16} />

              Add Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-5 transition hover:border-violet-500/40"
              >
                {/* PROJECT TOP */}

                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                    <FolderKanban
                      size={21}
                      className="text-violet-400"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${
                        project.status === "Verified"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      <CheckCircle2 size={13} />

                      {project.status}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteProject(project.id)
                      }
                      className="rounded-lg p-1.5 text-slate-600 transition hover:bg-red-500/10 hover:text-red-400"
                      title="Delete project"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* TITLE */}

                <h3 className="text-lg font-semibold">
                  {project.title}
                </h3>

                {/* DESCRIPTION */}

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {project.description}
                </p>

                {/* TECHNOLOGIES */}

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg bg-slate-900 px-2.5 py-1 text-xs text-slate-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* PROJECT LINK */}

                <button
                  type="button"
                  onClick={() =>
                    handleViewProject(project)
                  }
                  className="mt-5 flex items-center gap-2 text-sm font-medium text-violet-400 hover:text-violet-300"
                >
                  {project.github
                    ? "Open Project"
                    : "View Project"}

                  <ExternalLink size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ==================================================
          CERTIFICATIONS
      ================================================== */}

      <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Certifications
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Verified learning and professional
              certifications.
            </p>
          </div>

          <Award
            size={22}
            className="text-amber-400"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {certificates.map((certificate) => (
            <div
              key={certificate.title}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                  <Award
                    size={20}
                    className="text-amber-400"
                  />
                </div>

                <div>
                  <h3 className="font-semibold">
                    {certificate.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {certificate.issuer} •{" "}
                    {certificate.year}
                  </p>
                </div>
              </div>

              <CheckCircle2
                size={19}
                className="shrink-0 text-emerald-400"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================
          ADD PROJECT MODAL
      ================================================== */}

      {showProjectModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowProjectModal(false);
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Add New Project
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add an industry-relevant project to your
                  portfolio.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowProjectModal(false)
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="space-y-5 p-6">
              {/* PROJECT NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Project Name *
                </label>

                <input
                  type="text"
                  value={newProject.title}
                  onChange={(event) =>
                    setNewProject({
                      ...newProject,
                      title: event.target.value,
                    })
                  }
                  placeholder="e.g. AI Resume Analyzer"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Description *
                </label>

                <textarea
                  rows={4}
                  value={newProject.description}
                  onChange={(event) =>
                    setNewProject({
                      ...newProject,
                      description: event.target.value,
                    })
                  }
                  placeholder="Describe what your project does..."
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500"
                />
              </div>

              {/* TECHNOLOGIES */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Technologies *
                </label>

                <input
                  type="text"
                  value={newProject.technologies}
                  onChange={(event) =>
                    setNewProject({
                      ...newProject,
                      technologies: event.target.value,
                    })
                  }
                  placeholder="React, Python, FastAPI, PostgreSQL"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500"
                />

                <p className="mt-2 text-xs text-slate-600">
                  Separate technologies using commas.
                </p>
              </div>

              {/* GITHUB / URL */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  GitHub / Project URL
                </label>

                <input
                  type="url"
                  value={newProject.github}
                  onChange={(event) =>
                    setNewProject({
                      ...newProject,
                      github: event.target.value,
                    })
                  }
                  placeholder="https://github.com/username/project"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500"
                />
              </div>

              {/* AI VERIFICATION */}

              <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                <div className="flex gap-3">
                  <Sparkles
                    size={18}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />

                  <div>
                    <p className="text-sm font-medium text-violet-300">
                      AI Skill Verification
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Added projects will initially be marked
                      as Pending Verification. Later,
                      SkillBridge AI can verify skills using
                      project evidence, GitHub activity and
                      assessments.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}

            <div className="flex justify-end gap-3 border-t border-slate-800 px-6 py-5">
              <button
                type="button"
                onClick={() =>
                  setShowProjectModal(false)
                }
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddProject}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:scale-[1.02]"
              >
                <Plus size={17} />

                Add Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Portfolio;