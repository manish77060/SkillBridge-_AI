import { useMemo, useRef, useState } from "react";

import {
  Brain,
  CheckCircle2,
  FileText,
  Award,
  FolderKanban,
  Upload,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  X,
  BookOpen,
  Clock3,
  Target,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { API_URL } from "../config/api";

function Skills({ currentUser }) {
  // Resolve user info dynamically
  const studentName = useMemo(() => {
    if (currentUser?.name) return currentUser.name;
    try {
      const session = JSON.parse(localStorage.getItem("skillbridge_auth_session") || "{}");
      if (session?.user?.name) return session.user.name;
      const profile = JSON.parse(localStorage.getItem("skillbridge_student_profile") || "{}");
      if (profile?.name) return profile.name;
    } catch {}
    return "Student";
  }, [currentUser]);

  // ==================================================
  // STATE
  // ==================================================

  const fileInputRef = useRef(null);

  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [showLearningModal, setShowLearningModal] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeName, setResumeName] = useState("");
  const [resumeData, setResumeData] = useState(null);
  const [resumeError, setResumeError] = useState("");

  // ==================================================
  // SKILLS
  // ==================================================

  const [skills, setSkills] = useState([
    {
      id: 1,
      name: "Java",
      score: 90,
      level: "Advanced",
      source: "Resume + Assessment",
      selected: true,
    },
    {
      id: 2,
      name: "Python",
      score: 82,
      level: "Advanced",
      source: "Resume + Project",
      selected: true,
    },
    {
      id: 3,
      name: "Git",
      score: 84,
      level: "Advanced",
      source: "Project + Assessment",
      selected: true,
    },
    {
      id: 4,
      name: "SQL",
      score: 76,
      level: "Intermediate",
      source: "Resume + Assessment",
      selected: true,
    },
    {
      id: 5,
      name: "REST APIs",
      score: 71,
      level: "Intermediate",
      source: "Project",
      selected: true,
    },
    {
      id: 6,
      name: "JavaScript",
      score: 68,
      level: "Intermediate",
      source: "Resume",
      selected: true,
    },
  ]);

  // ==================================================
  // SKILL GAPS
  // ==================================================

  const gaps = [
    {
      name: "Spring Boot",
      current: 28,
      required: 80,
      priority: "High",
      reason:
        "Backend Developer roles frequently require production-level Spring Boot experience.",
      duration: "2–3 weeks",
    },
    {
      name: "Docker",
      current: 42,
      required: 75,
      priority: "Medium",
      reason:
        "Containerization will strengthen your deployment and DevOps readiness.",
      duration: "1–2 weeks",
    },
    {
      name: "AWS",
      current: 35,
      required: 70,
      priority: "Medium",
      reason:
        "Cloud fundamentals can improve your readiness for modern backend roles.",
      duration: "2–3 weeks",
    },
  ];

  // ==================================================
  // CALCULATED VALUES
  // ==================================================

  const verifiedSkills = useMemo(
    () => skills.filter((skill) => skill.selected),
    [skills]
  );

  const averageSkillScore = useMemo(() => {
    if (!verifiedSkills.length) return 0;

    return Math.round(
      verifiedSkills.reduce((sum, skill) => sum + skill.score, 0) /
        verifiedSkills.length
    );
  }, [verifiedSkills]);

  const confidenceScore = Math.min(
    95,
    Math.max(70, Math.round(averageSkillScore + 4))
  );

  // ==================================================
  // RESUME UPLOAD
  // ==================================================

  const handleResumeClick = () => {
    fileInputRef.current?.click();
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setResumeName(file.name);
    setResumeError("");
    setResumeData(null);
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${API_URL}/resume/analyze`,
        {
          method: "POST",
          body: formData,
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The backend returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Unable to analyze the resume."
        );
      }

      const analysis = data?.analysis || data?.result || data;

      setResumeData({
        filename: data?.filename || file.name,

        extractedText:
          data?.extracted_text ||
          data?.text ||
          "",

        candidate:
          analysis?.candidate || {},

        summary:
          analysis?.summary || "",

        technicalSkills:
          analysis?.technical_skills ||
          analysis?.technicalSkills ||
          [],

        softSkills:
          analysis?.soft_skills ||
          analysis?.softSkills ||
          [],

        projects:
          analysis?.projects || [],

        experience:
          analysis?.experience || [],

        education:
          analysis?.education || [],

        certifications:
          analysis?.certifications || [],

        achievements:
          analysis?.achievements || [],

        links:
          analysis?.links || [],

        otherInformation:
          analysis?.other_relevant_information ||
          analysis?.otherInformation ||
          [],
      });
    } catch (error) {
      console.error("Resume analysis error:", error);

      setResumeError(
        error?.message ||
          "Something went wrong while analyzing the resume."
      );
    } finally {
      setIsAnalyzing(false);
    }

    // Allow the same file to be uploaded again.
    event.target.value = "";
  };

  // ==================================================
  // RE-ANALYZE
  // ==================================================

  const handleReAnalyze = () => {
    if (!resumeName) {
      handleResumeClick();
      return;
    }

    handleResumeClick();
  };

  // ==================================================
  // MANAGE SKILLS
  // ==================================================

  const toggleSkill = (id) => {
    setSkills((currentSkills) =>
      currentSkills.map((skill) =>
        skill.id === id
          ? {
              ...skill,
              selected: !skill.selected,
            }
          : skill
      )
    );
  };

  // ==================================================
  // ROADMAP
  // ==================================================

  const handleGenerateRoadmap = () => {
    setShowRoadmapModal(true);
  };

  // ==================================================
  // LEARNING PLAN
  // ==================================================

  const handleLearningPlan = () => {
    setShowLearningModal(true);
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className="space-y-6 text-white">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="mb-1 text-sm font-medium text-violet-400">
            AI-powered skill intelligence
          </p>

          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              My Skills
            </h1>
            <span className="text-xs font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-lg">
              Profile: {studentName}
            </span>
          </div>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Your skills are continuously mapped against your target
            career, assessments, projects, certificates, and industry
            requirements.
          </p>

          {resumeName && (
            <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
              <CheckCircle2 size={14} />

              <span>
                Resume connected: {resumeName}
              </span>
            </div>
          )}
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={handleResumeClick}
            disabled={isAnalyzing}
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isAnalyzing ? (
              <RefreshCw
                size={17}
                className="animate-spin"
              />
            ) : (
              <Upload size={17} />
            )}

            {isAnalyzing
              ? "Analyzing Resume..."
              : "Upload Resume"}
          </button>
        </div>
      </div>

      {/* ==================================================
          AI PROFILE BANNER
      ================================================== */}

      <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-950/40 to-indigo-950/30 p-6">
        <div className="absolute right-[-30px] top-[-40px] h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-600/20">
              <Sparkles size={22} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold">
                  AI Skill Profile
                </h2>

                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                  Updated today
                </span>
              </div>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
                We analyze your resume, projects, assessments,
                and certificates to build your current skill
                profile.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReAnalyze}
            disabled={isAnalyzing}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-slate-950/50 px-4 py-2.5 text-sm font-medium text-violet-300 transition hover:bg-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isAnalyzing ? (
              <RefreshCw
                size={17}
                className="animate-spin"
              />
            ) : (
              <Brain size={17} />
            )}

            {isAnalyzing
              ? "Analyzing..."
              : "Re-analyze Profile"}
          </button>
        </div>
      </div>

      {/* ==================================================
          RESUME ANALYZING
      ================================================== */}

      {isAnalyzing && (
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white">
              <Brain
                size={22}
                className="animate-pulse"
              />
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-semibold">
                AI is analyzing your resume
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                Reading your complete resume and extracting
                skills, projects, education, experience,
                certifications, achievements, and other
                relevant information.
              </p>

              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-violet-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          RESUME ERROR
      ================================================== */}

      {resumeError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={20}
              className="mt-0.5 shrink-0 text-red-400"
            />

            <div>
              <h3 className="font-semibold text-red-300">
                Resume analysis failed
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                {resumeError}
              </p>

              <p className="mt-2 text-xs text-slate-600">
                Make sure the SkillBridge AI backend and Ollama
                are running.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          RESUME AI ANALYSIS RESULT
      ================================================== */}

      {resumeData && (
        <div className="space-y-6">
          {/* Resume Header */}

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <FileText size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    Resume Intelligence
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    AI extracted profile from{" "}
                    <span className="text-slate-200">
                      {resumeData.filename}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                <CheckCircle2 size={15} />
                Resume analyzed successfully
              </div>
            </div>
          </div>

          {/* Candidate Information */}

          <ResumeSection
            icon={FileText}
            title="Candidate Information"
            subtitle="Personal and professional information detected from the resume."
          >
            {Object.keys(resumeData.candidate || {}).length >
            0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(
                  resumeData.candidate || {}
                ).map(([key, value]) => (
                  <ResumeInfo
                    key={key}
                    label={formatResumeLabel(key)}
                    value={formatResumeValue(value)}
                  />
                ))}
              </div>
            ) : (
              <EmptyResumeData text="No candidate information was detected." />
            )}

            {resumeData.summary && (
              <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-violet-400">
                  Professional Summary
                </p>

                <p className="text-sm leading-6 text-slate-400">
                  {resumeData.summary}
                </p>
              </div>
            )}
          </ResumeSection>

          {/* Technical Skills */}

          <ResumeSection
            icon={Brain}
            title="Technical Skills"
            subtitle="Technical skills identified throughout the complete resume."
          >
            {resumeData.technicalSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {resumeData.technicalSkills.map(
                  (skill, index) => (
                    <span
                      key={`${formatResumeValue(
                        skill
                      )}-${index}`}
                      className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-2 text-sm font-medium text-violet-300"
                    >
                      {typeof skill === "string"
                        ? skill
                        : formatResumeValue(skill)}
                    </span>
                  )
                )}
              </div>
            ) : (
              <EmptyResumeData text="No technical skills were detected." />
            )}
          </ResumeSection>

          {/* Soft Skills */}

          <ResumeSection
            icon={ShieldCheck}
            title="Soft Skills"
            subtitle="Interpersonal and professional skills found in the resume."
          >
            {resumeData.softSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {resumeData.softSkills.map(
                  (skill, index) => (
                    <span
                      key={`${formatResumeValue(
                        skill
                      )}-${index}`}
                      className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300"
                    >
                      {typeof skill === "string"
                        ? skill
                        : formatResumeValue(skill)}
                    </span>
                  )
                )}
              </div>
            ) : (
              <EmptyResumeData text="No soft skills were detected." />
            )}
          </ResumeSection>

          {/* Projects */}

          <ResumeSection
            icon={FolderKanban}
            title="Projects"
            subtitle="Projects, technologies, responsibilities and outcomes extracted from the resume."
          >
            {resumeData.projects.length > 0 ? (
              <div className="space-y-4">
                {resumeData.projects.map(
                  (project, index) => (
                    <ResumeObjectCard
                      key={index}
                      index={index}
                      item={project}
                    />
                  )
                )}
              </div>
            ) : (
              <EmptyResumeData text="No projects were detected." />
            )}
          </ResumeSection>

          {/* Experience */}

          <ResumeSection
            icon={TrendingUp}
            title="Experience"
            subtitle="Work experience, internships and professional responsibilities."
          >
            {resumeData.experience.length > 0 ? (
              <div className="space-y-4">
                {resumeData.experience.map(
                  (item, index) => (
                    <ResumeObjectCard
                      key={index}
                      index={index}
                      item={item}
                    />
                  )
                )}
              </div>
            ) : (
              <EmptyResumeData text="No professional experience was detected." />
            )}
          </ResumeSection>

          {/* Education */}

          <ResumeSection
            icon={BookOpen}
            title="Education"
            subtitle="Academic qualifications extracted from the resume."
          >
            {resumeData.education.length > 0 ? (
              <div className="space-y-4">
                {resumeData.education.map(
                  (item, index) => (
                    <ResumeObjectCard
                      key={index}
                      index={index}
                      item={item}
                    />
                  )
                )}
              </div>
            ) : (
              <EmptyResumeData text="No education information was detected." />
            )}
          </ResumeSection>

          {/* Certifications */}

          <ResumeSection
            icon={Award}
            title="Certifications"
            subtitle="Certificates and professional credentials found in the resume."
          >
            {resumeData.certifications.length > 0 ? (
              <div className="space-y-4">
                {resumeData.certifications.map(
                  (item, index) => (
                    <ResumeObjectCard
                      key={index}
                      index={index}
                      item={item}
                    />
                  )
                )}
              </div>
            ) : (
              <EmptyResumeData text="No certifications were detected." />
            )}
          </ResumeSection>

          {/* Achievements */}

          <ResumeSection
            icon={Target}
            title="Achievements"
            subtitle="Awards, competitions, accomplishments and notable achievements."
          >
            {resumeData.achievements.length > 0 ? (
              <div className="space-y-4">
                {resumeData.achievements.map(
                  (item, index) => (
                    <ResumeObjectCard
                      key={index}
                      index={index}
                      item={item}
                    />
                  )
                )}
              </div>
            ) : (
              <EmptyResumeData text="No achievements were detected." />
            )}
          </ResumeSection>

          {/* Links */}

          <ResumeSection
            icon={ChevronRight}
            title="Professional Links"
            subtitle="Links identified in the resume."
          >
            {resumeData.links.length > 0 ? (
              <div className="space-y-3">
                {resumeData.links.map(
                  (link, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
                    >
                      <p className="break-all text-sm text-violet-300">
                        {typeof link === "string"
                          ? link
                          : formatResumeValue(link)}
                      </p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <EmptyResumeData text="No professional links were detected." />
            )}
          </ResumeSection>

          {/* Other Information */}

          <ResumeSection
            icon={Sparkles}
            title="Other Resume Information"
            subtitle="Additional information identified by the AI model."
          >
            {resumeData.otherInformation.length > 0 ? (
              <div className="space-y-3">
                {resumeData.otherInformation.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-sm leading-6 text-slate-400"
                    >
                      {typeof item === "string"
                        ? item
                        : formatResumeValue(item)}
                    </div>
                  )
                )}
              </div>
            ) : (
              <EmptyResumeData text="No additional information was detected." />
            )}
          </ResumeSection>

          {/* Raw Resume Text */}

          {resumeData.extractedText && (
            <details className="rounded-2xl border border-slate-800 bg-slate-900">
              <summary className="cursor-pointer px-6 py-5 text-sm font-semibold text-slate-300">
                View extracted resume text
              </summary>

              <div className="border-t border-slate-800 p-6">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-slate-500">
                  {resumeData.extractedText}
                </pre>
              </div>
            </details>
          )}
        </div>
      )}

      {/* ==================================================
          EVIDENCE CARDS
      ================================================== */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <EvidenceCard
          icon={FileText}
          title="Resume"
          description={
            resumeData
              ? `${resumeData.technicalSkills.length} technical skills extracted`
              : "Upload resume to analyze"
          }
          status={
            resumeData
              ? "Analyzed"
              : "Awaiting Resume"
          }
        />

        <EvidenceCard
          icon={CheckCircle2}
          title="Assessment"
          description="82% technical score"
          status="Completed"
        />

        <EvidenceCard
          icon={FolderKanban}
          title="Projects"
          description={
            resumeData
              ? `${resumeData.projects.length} projects extracted`
              : "3 projects analyzed"
          }
          status={
            resumeData
              ? "AI Extracted"
              : "Verified"
          }
        />

        <EvidenceCard
          icon={Award}
          title="Certificates"
          description={
            resumeData
              ? `${resumeData.certifications.length} certifications extracted`
              : "4 certificates added"
          }
          status={
            resumeData
              ? "AI Extracted"
              : "Verified"
          }
        />
      </div>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <div className="grid gap-6 xl:grid-cols-3">
        {/* ==================================================
            VERIFIED SKILLS
        ================================================== */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">
                Verified Skills
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Skills supported by evidence from your profile.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowSkillsModal(true)
              }
              className="rounded-lg px-3 py-2 text-xs font-medium text-violet-400 transition hover:bg-violet-500/10"
            >
              Manage Skills
            </button>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {verifiedSkills.map((skill) => (
              <div
                key={skill.id}
                className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 transition hover:border-violet-500/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">
                        {skill.name}
                      </p>

                      <CheckCircle2
                        size={14}
                        className="text-emerald-400"
                      />
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {skill.source}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold">
                      {skill.score}%
                    </p>

                    <p className="text-[11px] text-slate-500">
                      {skill.level}
                    </p>
                  </div>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all"
                    style={{
                      width: `${skill.score}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==================================================
            SKILL CONFIDENCE
        ================================================== */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h2 className="font-semibold">
                Skill Confidence
              </h2>

              <p className="text-xs text-slate-500">
                Evidence strength
              </p>
            </div>
          </div>

          <div className="mt-7 flex justify-center">
            <div className="flex h-36 w-36 items-center justify-center rounded-full border-[12px] border-emerald-500/20">
              <div className="text-center">
                <p className="text-3xl font-bold">
                  {confidenceScore}%
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  confidence
                </p>
              </div>
            </div>
          </div>

          <div className="mt-7 space-y-4">
            <ConfidenceRow
              label="Resume evidence"
              value="92%"
            />

            <ConfidenceRow
              label="Assessment evidence"
              value="88%"
            />

            <ConfidenceRow
              label="Project evidence"
              value="81%"
            />

            <ConfidenceRow
              label="Certificate evidence"
              value="83%"
            />
          </div>

          <div className="mt-6 rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-3">
            <p className="text-xs leading-5 text-slate-500">
              Confidence increases when the same skill is
              supported by multiple evidence sources.
            </p>
          </div>
        </div>
      </div>

      {/* ==================================================
          SKILL GAP
      ================================================== */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle
                size={19}
                className="text-amber-400"
              />

              <h2 className="text-lg font-semibold">
                Skill Gap Analysis
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Compared with your target role:{" "}
              <span className="text-slate-300">
                Backend Developer
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerateRoadmap}
            className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white"
          >
            <TrendingUp size={17} />
            Generate Roadmap
          </button>
        </div>

        <div className="mt-6 space-y-5">
          {gaps.map((gap) => {
            const difference =
              gap.required - gap.current;

            return (
              <div
                key={gap.name}
                className="rounded-xl border border-slate-800 bg-slate-950/40 p-4"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                  <div className="w-full lg:w-44">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {gap.name}
                      </p>
                    </div>

                    <span
                      className={`mt-1 inline-block text-xs ${
                        gap.priority === "High"
                          ? "text-red-400"
                          : "text-amber-400"
                      }`}
                    >
                      {gap.priority} priority
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-slate-500">
                        Current {gap.current}%
                      </span>

                      <span className="text-slate-400">
                        Required {gap.required}%
                      </span>
                    </div>

                    <div className="relative h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500"
                        style={{
                          width: `${gap.current}%`,
                        }}
                      />

                      <div
                        className="absolute top-[-3px] h-4 border-r-2 border-dashed border-slate-400"
                        style={{
                          left: `${gap.required}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="w-full lg:w-28 lg:text-right">
                    <p className="text-sm font-semibold text-red-400">
                      -{difference}%
                    </p>

                    <p className="text-xs text-slate-600">
                      skill gap
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3 md:flex-row md:items-center md:justify-between">
                  <p className="text-xs leading-5 text-slate-500">
                    {gap.reason}
                  </p>

                  <span className="flex shrink-0 items-center gap-1.5 text-xs text-violet-400">
                    <Clock3 size={13} />
                    {gap.duration}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================================================
          AI RECOMMENDATION
      ================================================== */}

      <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <Sparkles size={19} />
          </div>

          <div>
            <h3 className="font-semibold">
              AI Recommendation
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              Your strongest foundation is in Java, Python, Git,
              and SQL. Focus next on Spring Boot because it has
              the largest gap for your Backend Developer target.
              Completing a Spring Boot project can also create
              new evidence for your skill profile.
            </p>

            <button
              type="button"
              onClick={handleLearningPlan}
              className="mt-4 flex items-center gap-1 text-sm font-medium text-violet-400 transition hover:text-violet-300"
            >
              See personalized learning plan
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================
          MANAGE SKILLS MODAL
      ================================================== */}

      {showSkillsModal && (
        <Modal
          title="Manage Skills"
          subtitle="Choose the skills that should appear in your verified profile."
          onClose={() =>
            setShowSkillsModal(false)
          }
        >
          <div className="space-y-3">
            {skills.map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() =>
                  toggleSkill(skill.id)
                }
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                  skill.selected
                    ? "border-violet-500/40 bg-violet-500/10"
                    : "border-slate-800 bg-slate-950 hover:border-slate-700"
                }`}
              >
                <div>
                  <p className="font-medium">
                    {skill.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {skill.source} • {skill.score}%
                  </p>
                </div>

                <CheckCircle2
                  size={19}
                  className={
                    skill.selected
                      ? "text-emerald-400"
                      : "text-slate-700"
                  }
                />
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() =>
                setShowSkillsModal(false)
              }
              className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold hover:bg-violet-500"
            >
              Save Changes
            </button>
          </div>
        </Modal>
      )}

      {/* ==================================================
          ROADMAP MODAL
      ================================================== */}

      {showRoadmapModal && (
        <Modal
          title="AI Career Roadmap"
          subtitle="Personalized roadmap generated from your current skill gaps."
          onClose={() =>
            setShowRoadmapModal(false)
          }
        >
          <div className="mb-5 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
            <div className="flex items-center gap-3">
              <Target
                size={20}
                className="text-violet-400"
              />

              <div>
                <p className="font-medium">
                  Target Role
                </p>

                <p className="text-sm text-slate-500">
                  Backend Developer
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <RoadmapStep
              number="01"
              title="Learn Spring Boot"
              description="REST APIs, dependency injection, JPA and authentication."
              duration="2–3 weeks"
            />

            <RoadmapStep
              number="02"
              title="Build Backend Project"
              description="Create a production-style Spring Boot application with PostgreSQL."
              duration="1–2 weeks"
            />

            <RoadmapStep
              number="03"
              title="Learn Docker"
              description="Containerize the backend and database environment."
              duration="1 week"
            />

            <RoadmapStep
              number="04"
              title="Deploy to Cloud"
              description="Learn AWS fundamentals and deploy your project."
              duration="2 weeks"
            />
          </div>

          <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="text-sm font-medium text-emerald-400">
              Estimated readiness improvement
            </p>

            <p className="mt-1 text-2xl font-bold">
              72% → 87%
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Projected estimate based on closing the identified
              skill gaps; actual improvement depends on your
              performance.
            </p>
          </div>
        </Modal>
      )}

      {/* ==================================================
          LEARNING PLAN MODAL
      ================================================== */}

      {showLearningModal && (
        <Modal
          title="Personalized Learning Plan"
          subtitle="Recommended next steps based on your Backend Developer target."
          onClose={() =>
            setShowLearningModal(false)
          }
        >
          <div className="space-y-4">
            <LearningCard
              icon={BookOpen}
              title="Spring Boot Fundamentals"
              type="Course"
              duration="8 hours"
              priority="High"
            />

            <LearningCard
              icon={FolderKanban}
              title="Build a Spring Boot REST API"
              type="Project"
              duration="10 hours"
              priority="High"
            />

            <LearningCard
              icon={BookOpen}
              title="Docker for Developers"
              type="Course"
              duration="5 hours"
              priority="Medium"
            />

            <LearningCard
              icon={Target}
              title="AWS Cloud Fundamentals"
              type="Certification"
              duration="12 hours"
              priority="Medium"
            />
          </div>

          <button
            type="button"
            onClick={() =>
              setShowLearningModal(false)
            }
            className="mt-6 w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold hover:bg-violet-500"
          >
            Start Learning Plan
          </button>
        </Modal>
      )}
    </div>
  );
}

// ==================================================
// EVIDENCE CARD
// ==================================================

function EvidenceCard({
  icon: Icon,
  title,
  description,
  status,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-violet-500/20">
      <div className="flex items-start justify-between">
        <div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-400">
          <Icon size={20} />
        </div>

        <CheckCircle2
          size={17}
          className="text-emerald-400"
        />
      </div>

      <p className="mt-5 font-medium">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>

      <p className="mt-3 text-xs font-medium text-emerald-400">
        {status}
      </p>
    </div>
  );
}

// ==================================================
// CONFIDENCE ROW
// ==================================================

function ConfidenceRow({
  label,
  value,
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm text-slate-400">
          {label}
        </span>

        <span className="text-sm font-semibold">
          {value}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-emerald-500"
          style={{
            width: value,
          }}
        />
      </div>
    </div>
  );
}

// ==================================================
// ROADMAP STEP
// ==================================================

function RoadmapStep({
  number,
  title,
  description,
  duration,
}) {
  return (
    <div className="flex gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-bold text-violet-400">
        {number}
      </div>

      <div className="flex-1">
        <div className="flex flex-col justify-between gap-1 sm:flex-row">
          <h3 className="font-medium">
            {title}
          </h3>

          <span className="text-xs text-slate-600">
            {duration}
          </span>
        </div>

        <p className="mt-1 text-sm leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

// ==================================================
// LEARNING CARD
// ==================================================

function LearningCard({
  icon: Icon,
  title,
  type,
  duration,
  priority,
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
      <div className="rounded-xl bg-violet-500/10 p-3 text-violet-400">
        <Icon size={19} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-medium">
          {title}
        </h3>

        <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
          <span>{type}</span>
          <span>•</span>
          <span>{duration}</span>
        </div>
      </div>

      <span
        className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
          priority === "High"
            ? "bg-red-500/10 text-red-400"
            : "bg-amber-500/10 text-amber-400"
        }`}
      >
        {priority}
      </span>
    </div>
  );
}

// ==================================================
// RESUME SECTION
// ==================================================

function ResumeSection({
  icon: Icon,
  title,
  subtitle,
  children,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-400">
          <Icon size={20} />
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}

// ==================================================
// RESUME INFORMATION
// ==================================================

function ResumeInfo({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-600">
        {label}
      </p>

      <p className="mt-2 break-words text-sm leading-6 text-slate-300">
        {value || "Not specified"}
      </p>
    </div>
  );
}

// ==================================================
// RESUME OBJECT CARD
// ==================================================

function ResumeObjectCard({
  item,
  index,
}) {
  if (
    typeof item === "string" ||
    typeof item === "number"
  ) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
        <p className="text-sm leading-6 text-slate-400">
          {item}
        </p>
      </div>
    );
  }

  if (!item || typeof item !== "object") {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-bold text-violet-400">
          {String(index + 1).padStart(2, "0")}
        </div>

        <h3 className="font-medium text-white">
          {item.name ||
            item.title ||
            item.project_name ||
            item.role ||
            item.degree ||
            item.certification ||
            "Resume Entry"}
        </h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(item).map(
          ([key, value]) => {
            if (
              value === null ||
              value === undefined ||
              value === ""
            ) {
              return null;
            }

            return (
              <div
                key={key}
                className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-3"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-400">
                  {formatResumeLabel(key)}
                </p>

                <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-400">
                  {formatResumeValue(value)}
                </p>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

// ==================================================
// EMPTY RESUME DATA
// ==================================================

function EmptyResumeData({
  text,
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/30 p-5 text-sm text-slate-600">
      {text}
    </div>
  );
}

// ==================================================
// FORMAT RESUME LABEL
// ==================================================

function formatResumeLabel(value) {
  return String(value)
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

// ==================================================
// FORMAT RESUME VALUE
// ==================================================

function formatResumeValue(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  if (Array.isArray(value)) {
    return value
      .map((item) =>
        typeof item === "object"
          ? JSON.stringify(item)
          : String(item)
      )
      .join(", ");
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .map(
        ([key, item]) =>
          `${formatResumeLabel(
            key
          )}: ${formatResumeValue(item)}`
      )
      .join(" • ");
  }

  return String(value);
}

// ==================================================
// MODAL
// ==================================================

function Modal({
  title,
  subtitle,
  onClose,
  children,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-800 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold">
              {title}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Skills;