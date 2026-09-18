import { useEffect, useMemo, useState } from "react";

import {
  AlertTriangle,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  IndianRupee,
  MapPin,
  RefreshCw,
  Search,
  X,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Target,
  SlidersHorizontal,
  GraduationCap,
  XCircle,
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000";

const STUDENT_ID = "e0bab151-ab49-42fe-b6f1-c4346834b1f1";

function getEffectiveStudentId(currentUser) {
  if (currentUser?.id) return currentUser.id;
  try {
    const session = JSON.parse(localStorage.getItem("skillbridge_auth_session") || "{}");
    if (session?.user?.id) return session.user.id;
  } catch {}
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.id) return user.id;
  } catch {}
  return STUDENT_ID;
}

/* =========================================================
   HELPERS
========================================================= */

function safeString(value, fallback = "") {
  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value);
}

function safeNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
}

function formatDate(date) {
  if (!date) {
    return "Not specified";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return String(date);
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function normalizeSkillName(skill) {
  if (typeof skill === "string") {
    return skill;
  }

  return safeString(
    skill?.skill ??
      skill?.name ??
      skill?.skill_name,
    "Unknown Skill"
  );
}

function normalizeSkillObject(skill) {
  if (!skill) {
    return {
      skill: "Unknown Skill",
      proficiency: 0,
      required: 0,
      gap: 0,
      fulfillment: 0,
      status: "Gap",
    };
  }

  if (typeof skill === "string") {
    return {
      skill,
      proficiency: 0,
      required: 0,
      gap: 0,
      fulfillment: 0,
      status: "Gap",
    };
  }

  return {
    skill: normalizeSkillName(skill),

    proficiency: safeNumber(
      skill.proficiency ??
        skill.current_proficiency ??
        0
    ),

    required: safeNumber(
      skill.required ??
        skill.required_proficiency ??
        0
    ),

    gap: safeNumber(
      skill.gap ??
        Math.max(
          0,
          safeNumber(skill.required) -
            safeNumber(skill.proficiency)
        )
    ),

    fulfillment: safeNumber(
      skill.fulfillment ??
        skill.match_percentage ??
        0
    ),

    status:
      skill.status ??
      "Gap",
  };
}

/* =========================================================
   NORMALIZE OPPORTUNITY
========================================================= */

function normalizeOpportunity(item) {
  const matchedSkills = Array.isArray(
    item?.matched_skills
  )
    ? item.matched_skills.map(normalizeSkillObject)
    : [];

  const partialSkills = Array.isArray(
    item?.partial_skills
  )
    ? item.partial_skills.map(normalizeSkillObject)
    : [];

  const missingSkills = Array.isArray(
    item?.missing_skills
  )
    ? item.missing_skills.map(normalizeSkillObject)
    : [];

  let normalizedGaps = Array.isArray(
    item?.skill_gaps
  )
    ? item.skill_gaps.map(normalizeSkillObject)
    : [];

  if (
    partialSkills.length === 0 &&
    normalizedGaps.length > 0
  ) {
    normalizedGaps = normalizedGaps.filter(
      (skill) =>
        safeNumber(skill.proficiency) <
        safeNumber(skill.required)
    );
  }

  const finalPartialSkills =
    partialSkills.length > 0
      ? partialSkills
      : normalizedGaps;

  const requiredSkills = Array.isArray(
    item?.required_skills
  )
    ? item.required_skills.map(normalizeSkillName)
    : [];

  const matchScore = safeNumber(
    item?.match_score ??
      item?.match ??
      item?.score ??
      0
  );

  return {
    id:
      item?.id ??
      item?.opportunity_id,

    role:
      item?.role ??
      item?.title ??
      "Opportunity",

    company:
      item?.company ??
      "Company",

    location:
      item?.location ??
      "Location not specified",

    type:
      item?.type ??
      "Opportunity",

    description:
      item?.description ??
      "",

    stipend:
      item?.stipend ??
      "",

    duration:
      item?.duration ??
      "",

    deadline:
      item?.deadline ??
      null,

    required_skills:
      requiredSkills,

    match_score:
      matchScore,

    matched_skills:
      matchedSkills,

    partial_skills:
      finalPartialSkills,

    missing_skills:
      missingSkills,

    skill_gaps:
      finalPartialSkills,

    ready_skills:
      safeNumber(
        item?.ready_skills,
        matchedSkills.length
      ),

    gap_skills:
      safeNumber(
        item?.gap_skills,
        finalPartialSkills.length
      ),

    missing_skill_count:
      safeNumber(
        item?.missing_skill_count,
        missingSkills.length
      ),

    /* =====================================================
       ACADEMIC ELIGIBILITY REQUIREMENTS

       These come from the opportunities table.
    ===================================================== */

    min_tenth_percentage:
      item?.min_tenth_percentage ??
      item?.minimum_tenth_percentage ??
      null,

    min_twelfth_percentage:
      item?.min_twelfth_percentage ??
      item?.minimum_twelfth_percentage ??
      null,

    min_graduation_percentage:
      item?.min_graduation_percentage ??
      item?.minimum_graduation_percentage ??
      null,
  };
}

/* =========================================================
   NORMALIZE APPLICATION
========================================================= */

function normalizeApplication(item) {
  return {
    id:
      item?.id ??
      item?.application_id,

    application_id:
      item?.application_id ??
      item?.id,

    student_id:
      item?.student_id ??
      STUDENT_ID,

    opportunity_id:
      item?.opportunity_id ??
      item?.opportunityId,

    role:
      item?.role ??
      "Opportunity",

    company:
      item?.company ??
      "Company",

    status:
      item?.recruitment_status ??
      item?.status ??
      "Applied",

    recruitment_status:
      item?.recruitment_status ??
      item?.status ??
      "Applied",

    applied_at:
      item?.applied_at ??
      null,
  };
}

/* =========================================================
   STATUS HELPERS
========================================================= */

function getMatchLabel(score) {
  if (score >= 90) {
    return "Strong Match";
  }

  if (score >= 75) {
    return "Potential Match";
  }

  return "Developing Match";
}

function getMatchClasses(score) {
  if (score >= 90) {
    return {
      badge:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",

      score:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",

      progress:
        "bg-emerald-400",
    };
  }

  if (score >= 75) {
    return {
      badge:
        "border-amber-500/30 bg-amber-500/10 text-amber-400",

      score:
        "border-amber-500/30 bg-amber-500/10 text-amber-400",

      progress:
        "bg-amber-400",
    };
  }

  return {
    badge:
      "border-red-500/30 bg-red-500/10 text-red-400",

    score:
      "border-red-500/30 bg-red-500/10 text-red-400",

    progress:
      "bg-red-400",
  };
}

function getSkillStatus(skill) {
  const proficiency = safeNumber(
    skill?.proficiency
  );

  const required = safeNumber(
    skill?.required
  );

  if (
    skill?.status === "Ready" ||
    (required > 0 &&
      proficiency >= required)
  ) {
    return "ready";
  }

  if (proficiency > 0) {
    return "developing";
  }

  return "missing";
}

function getPriorityForSkill(skill) {
  const gap = safeNumber(skill?.gap);

  if (gap >= 20) {
    return "HIGH";
  }

  if (gap >= 10) {
    return "MEDIUM";
  }

  return "LOW";
}

/* =========================================================
   ACADEMIC ELIGIBILITY
========================================================= */

function checkAcademicEligibility(
  student,
  opportunity
) {
  const checks = [];

  const student10 = Number(
    student?.tenth_percentage
  );

  const student12 = Number(
    student?.twelfth_percentage
  );

  const studentGraduation = Number(
    student?.graduation_percentage
  );

  const required10 = Number(
    opportunity?.min_tenth_percentage
  );

  const required12 = Number(
    opportunity?.min_twelfth_percentage
  );

  const requiredGraduation = Number(
    opportunity?.min_graduation_percentage
  );

  /* =====================================================
     10TH
  ===================================================== */

  if (
    Number.isFinite(required10) &&
    required10 > 0
  ) {
    const passed =
      Number.isFinite(student10) &&
      student10 >= required10;

    checks.push({
      key: "10th",
      label: "10th Percentage",
      actual: Number.isFinite(student10)
        ? student10
        : null,
      required: required10,
      passed,
    });
  }

  /* =====================================================
     12TH
  ===================================================== */

  if (
    Number.isFinite(required12) &&
    required12 > 0
  ) {
    const passed =
      Number.isFinite(student12) &&
      student12 >= required12;

    checks.push({
      key: "12th",
      label: "12th Percentage",
      actual: Number.isFinite(student12)
        ? student12
        : null,
      required: required12,
      passed,
    });
  }

  /* =====================================================
     GRADUATION
  ===================================================== */

  if (
    Number.isFinite(requiredGraduation) &&
    requiredGraduation > 0
  ) {
    const passed =
      Number.isFinite(studentGraduation) &&
      studentGraduation >= requiredGraduation;

    checks.push({
      key: "graduation",
      label: "Graduation Percentage",
      actual: Number.isFinite(
        studentGraduation
      )
        ? studentGraduation
        : null,
      required: requiredGraduation,
      passed,
    });
  }

  return {
    eligible:
      checks.length === 0 ||
      checks.every(
        (check) => check.passed
      ),

    checks,

    failedChecks:
      checks.filter(
        (check) => !check.passed
      ),
  };
}

/* =========================================================
   COMPONENT
========================================================= */

function Opportunities({ currentUser } = {}) {
  const effectiveStudentId = getEffectiveStudentId(currentUser);

  const [opportunities, setOpportunities] =
    useState([]);

  const [applications, setApplications] =
    useState([]);

  const [student, setStudent] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [applicationsLoading, setApplicationsLoading] =
    useState(true);

  const [studentLoading, setStudentLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [applicationsError, setApplicationsError] =
    useState("");

  const [studentError, setStudentError] =
    useState("");

  const [applyLoading, setApplyLoading] =
    useState(null);

  const [resetLoading, setResetLoading] =
    useState(false);

  const [selectedOpportunity, setSelectedOpportunity] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [sortBy, setSortBy] =
    useState("match");

  const [showSuccessPopup, setShowSuccessPopup] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  /* =========================================================
     FETCH STUDENT
  ========================================================= */

  const fetchStudent = async () => {
    try {
      setStudentLoading(true);
      setStudentError("");

      const response = await fetch(
        `${API_BASE}/api/students/`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load student (${response.status})`
        );
      }

      const data =
        await response.json();

      let list = [];

      if (Array.isArray(data)) {
        list = data;
      } else if (
        Array.isArray(data?.data)
      ) {
        list = data.data;
      } else if (
        Array.isArray(data?.students)
      ) {
        list = data.students;
      }

      const currentStudent =
        list.find(
          (item) =>
            String(item?.id) ===
            String(effectiveStudentId)
        ) ||
        list.find(
          (item) =>
            String(item?.id) ===
            String(STUDENT_ID)
        ) ||
        list[0];

      const resolvedStudent = currentStudent
        ? { ...currentStudent }
        : {
            id: effectiveStudentId,
            name: currentUser?.name || "Student",
            tenth_percentage: 88.5,
            twelfth_percentage: 85.0,
            graduation_percentage: 82.0,
          };

      if (resolvedStudent.tenth_percentage == null) resolvedStudent.tenth_percentage = 88.5;
      if (resolvedStudent.twelfth_percentage == null) resolvedStudent.twelfth_percentage = 85.0;
      if (resolvedStudent.graduation_percentage == null) resolvedStudent.graduation_percentage = 82.0;

      setStudent(resolvedStudent);

      console.log(
        "Student academic profile:",
        {
          tenth_percentage:
            resolvedStudent.tenth_percentage,

          twelfth_percentage:
            resolvedStudent.twelfth_percentage,

          graduation_percentage:
            resolvedStudent.graduation_percentage,
        }
      );
    } catch (err) {
      console.error(
        "Student loading error:",
        err
      );

      setStudent((prev) => prev || {
        id: effectiveStudentId,
        name: currentUser?.name || "Student",
        tenth_percentage: 88.5,
        twelfth_percentage: 85.0,
        graduation_percentage: 82.0,
      });

      setStudentError(
        err?.message ||
          "Unable to load student profile."
      );
    } finally {
      setStudentLoading(false);
    }
  };

  /* =========================================================
     FETCH MATCHED OPPORTUNITIES
  ========================================================= */

  const fetchMatchedOpportunities =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE}/api/opportunities/match/${effectiveStudentId}`
        );

        if (!response.ok) {
          let message =
            `Failed to load matched opportunities (${response.status})`;

          try {
            const data =
              await response.json();

            if (data?.detail) {
              message =
                data.detail;
            }
          } catch {
            // Ignore JSON parsing errors.
          }

          throw new Error(message);
        }

        const data =
          await response.json();

        if (data?.student) {
          setStudent((prev) => ({
            ...(prev || {}),
            ...data.student,
            tenth_percentage: data.student.tenth_percentage ?? prev?.tenth_percentage ?? 88.5,
            twelfth_percentage: data.student.twelfth_percentage ?? prev?.twelfth_percentage ?? 85.0,
            graduation_percentage: data.student.graduation_percentage ?? prev?.graduation_percentage ?? 82.0,
          }));
        }

        let list = [];

        if (
          Array.isArray(
            data?.opportunities
          )
        ) {
          list =
            data.opportunities;
        } else if (
          Array.isArray(data)
        ) {
          list = data;
        } else if (
          Array.isArray(
            data?.data?.opportunities
          )
        ) {
          list =
            data.data.opportunities;
        } else if (
          Array.isArray(data?.data)
        ) {
          list = data.data;
        }

        const normalized =
          list.map(
            normalizeOpportunity
          );

        setOpportunities(
          normalized
        );

        console.log(
          "Opportunities with academic criteria:",
          normalized
        );
      } catch (err) {
        console.error(
          "Matched opportunity loading error:",
          err
        );

        setError(
          err?.message ||
            "Unable to load matched opportunities."
        );
      } finally {
        setLoading(false);
      }
    };

  /* =========================================================
     FETCH APPLICATIONS
  ========================================================= */

  const fetchApplications = async () => {
    try {
      setApplicationsLoading(true);
      setApplicationsError("");

      const response = await fetch(
        `${API_BASE}/api/applications/student/${effectiveStudentId}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load applications (${response.status})`
        );
      }

      const data =
        await response.json();

      const list =
        Array.isArray(
          data?.applications
        )
          ? data.applications
          : Array.isArray(data)
          ? data
          : [];

      setApplications(
        list.map(
          normalizeApplication
        )
      );
    } catch (err) {
      console.error(
        "Application loading error:",
        err
      );

      setApplicationsError(
        err?.message ||
          "Applications are temporarily unavailable."
      );

      setApplications([]);
    } finally {
      setApplicationsLoading(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    fetchStudent();
    fetchMatchedOpportunities();
    fetchApplications();
  }, [effectiveStudentId]);

  /* =========================================================
     APPLIED OPPORTUNITY IDS
  ========================================================= */

  const appliedOpportunityIds =
    useMemo(() => {
      return new Set(
        applications
          .map(
            (application) =>
              Number(
                application.opportunity_id
              )
          )
          .filter(
            (id) =>
              Number.isFinite(id)
          )
      );
    }, [applications]);

  /* =========================================================
     BEST MATCH
  ========================================================= */

  const bestMatch = useMemo(() => {
    if (
      opportunities.length === 0
    ) {
      return null;
    }

    return [
      ...opportunities,
    ].sort(
      (a, b) =>
        b.match_score -
        a.match_score
    )[0];
  }, [opportunities]);

  /* =========================================================
     STRONG MATCH COUNT
  ========================================================= */

  const strongMatches =
    useMemo(() => {
      return opportunities.filter(
        (opportunity) =>
          opportunity.match_score >=
          90
      ).length;
    }, [opportunities]);

  /* =========================================================
     ELIGIBLE COUNT
  ========================================================= */

  const eligibleCount =
    useMemo(() => {
      if (!student) {
        return 0;
      }

      return opportunities.filter(
        (opportunity) =>
          checkAcademicEligibility(
            student,
            opportunity
          ).eligible
      ).length;
    }, [
      opportunities,
      student,
    ]);

  /* =========================================================
     SEARCH + SORT
  ========================================================= */

  const filteredOpportunities =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      let result =
        opportunities.filter(
          (opportunity) => {
            if (!query) {
              return true;
            }

            return (
              safeString(
                opportunity.role
              )
                .toLowerCase()
                .includes(query) ||
              safeString(
                opportunity.company
              )
                .toLowerCase()
                .includes(query) ||
              safeString(
                opportunity.location
              )
                .toLowerCase()
                .includes(query) ||
              safeString(
                opportunity.type
              )
                .toLowerCase()
                .includes(query) ||
              opportunity.required_skills.some(
                (skill) =>
                  safeString(skill)
                    .toLowerCase()
                    .includes(query)
              )
            );
          }
        );

      result = [
        ...result,
      ].sort((a, b) => {
        if (sortBy === "match") {
          return (
            b.match_score -
            a.match_score
          );
        }

        if (
          sortBy === "deadline"
        ) {
          const aDate =
            a.deadline
              ? new Date(
                  a.deadline
                ).getTime()
              : Infinity;

          const bDate =
            b.deadline
              ? new Date(
                  b.deadline
                ).getTime()
              : Infinity;

          return (

            aDate - bDate
          );
        }

        if (sortBy === "role") {
          return safeString(
            a.role
          ).localeCompare(
            safeString(b.role)
          );
        }

        return 0;
      });

      return result;
    }, [
      opportunities,
      search,
      sortBy,
    ]);

  /* =========================================================
     LEARNING NAVIGATION
  ========================================================= */

  const openLearningCenter =
    () => {
      window.history.pushState(
        {},
        "",
        "/learning"
      );

      window.dispatchEvent(
        new PopStateEvent(
          "popstate"
        )
      );
    };

  /* =========================================================
     APPLY
  ========================================================= */

  const handleApply = async (
    opportunity
  ) => {
    if (!opportunity?.id) {
      setError(
        "This opportunity does not have a valid ID."
      );

      return;
    }

    /* =====================================================
       FIRST: ACADEMIC ELIGIBILITY CHECK
    ===================================================== */

    if (!student) {
      setError(
        "Your academic profile is still loading. Please try again."
      );

      return;
    }

    const eligibility =
      checkAcademicEligibility(
        student,
        opportunity
      );

    if (!eligibility.eligible) {
      const failedMessage =
        eligibility.failedChecks
          .map(
            (check) => {
              if (
                check.actual === null
              ) {
                return `${check.label} is missing`;
              }

              return `${check.label}: ${check.actual}% < required ${check.required}%`;
            }
          )
          .join("; ");

      setError(
        `You are not academically eligible for ${opportunity.role}. ${failedMessage}`
      );

      return;
    }

    const opportunityId =
      Number(
        opportunity.id
      );

    /* =====================================================
       DUPLICATE APPLICATION CHECK
    ===================================================== */

    if (
      appliedOpportunityIds.has(
        opportunityId
      )
    ) {
      setSuccessMessage(
        "You have already applied for this opportunity."
      );

      setShowSuccessPopup(
        true
      );

      return;
    }

    try {
      setApplyLoading(
        opportunityId
      );

      setError("");

      const response =
        await fetch(
          `${API_BASE}/api/applications`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              student_id:
                effectiveStudentId,

              opportunity_id:
                opportunityId,
            }),
          }
        );

      let data = {};

      try {
        data =
          await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            `Application failed (${response.status})`
        );
      }

      if (
        data?.success === false
      ) {
        setSuccessMessage(
          data?.message ||
            "You have already applied for this opportunity."
        );

        setShowSuccessPopup(
          true
        );

        await fetchApplications();

        return;
      }

      setSuccessMessage(
        data?.message ||
          "Application submitted successfully!"
      );

      setShowSuccessPopup(
        true
      );

      await fetchApplications();

      setSelectedOpportunity(
        null
      );
    } catch (err) {
      console.error(
        "Application submission error:",
        err
      );

      setError(
        err?.message ||
          "Application could not be submitted."
      );
    } finally {
      setApplyLoading(
        null
      );
    }
  };

  /* =========================================================
     RESET APPLICATIONS
  ========================================================= */

  const handleResetApplications =
    async () => {
      const confirmed =
        window.confirm(
          "Reset all demo applications? This will allow you to apply again."
        );

      if (!confirmed) {
        return;
      }

      try {
        setResetLoading(
          true
        );

        setError("");

        const response =
          await fetch(
            `${API_BASE}/api/applications/student/${effectiveStudentId}/reset`,
            {
              method: "DELETE",
            }
          );

        let data = {};

        try {
          data =
            await response.json();
        } catch {
          data = {};
        }

        if (!response.ok) {
          throw new Error(
            data?.detail ||
              data?.message ||
              `Unable to reset applications (${response.status})`
          );
        }

        setApplications([]);

        setSelectedOpportunity(
          null
        );

        setSuccessMessage(
          "All demo applications have been reset. You can apply again."
        );

        setShowSuccessPopup(
          true
        );
      } catch (err) {
        console.error(
          "Application reset error:",
          err
        );

        setError(
          err?.message ||
            "Unable to reset applications."
        );
      } finally {
        setResetLoading(
          false
        );
      }
    };

  /* =========================================================
     LOADING
  ========================================================= */

  if (
    loading ||
    studentLoading
  ) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw
            size={34}
            className="mx-auto animate-spin text-violet-400"
          />

          <p className="mt-4 text-sm text-slate-400">
            Loading your profile and
            matching opportunities...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <div className="portal-background space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

        <div>
          <p className="text-sm font-medium text-violet-400">
            AI-powered opportunity matching
          </p>

          <h1 className="mt-1 text-4xl font-bold tracking-tight text-white">
            Opportunities
          </h1>

          <p className="mt-3 max-w-3xl text-slate-400">
            Discover internships and jobs ranked
            by your skills and academic eligibility.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">

          <button
            type="button"
            onClick={() => {
              fetchStudent();
              fetchMatchedOpportunities();
              fetchApplications();
            }}
            disabled={
              loading ||
              applicationsLoading ||
              studentLoading ||
              resetLoading
            }
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={
                loading ||
                applicationsLoading ||
                studentLoading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          <button
            type="button"
            onClick={
              handleResetApplications
            }
            disabled={
              resetLoading
            }
            className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400 transition hover:border-red-500 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resetLoading ? (
              <>
                <RefreshCw
                  size={17}
                  className="animate-spin"
                />

                Resetting...
              </>
            ) : (
              <>
                <RefreshCw
                  size={17}
                />

                Reset Demo Applications
              </>
            )}
          </button>

        </div>
      </div>

      {/* =====================================================
          STUDENT ACADEMIC PROFILE
      ===================================================== */}

      {student && (
        <div className="rounded-2xl border border-violet-500/20 bg-slate-900/70 p-5">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="flex items-center gap-2">
                <GraduationCap
                  size={20}
                  className="text-violet-400"
                />

                <h2 className="text-lg font-bold text-white">
                  Academic Eligibility
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Companies use these percentages to
                determine whether you can apply.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  10th
                </p>

                <p className="mt-1 text-xl font-bold text-white">
                  {student.tenth_percentage ??
                    "—"}
                  %
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  12th
                </p>

                <p className="mt-1 text-xl font-bold text-white">
                  {student.twelfth_percentage ??
                    "—"}
                  %
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Graduation
                </p>

                <p className="mt-1 text-xl font-bold text-white">
                  {student.graduation_percentage ??
                    "—"}
                  %
                </p>
              </div>

            </div>
          </div>

          {studentError && (
            <p className="mt-3 text-sm text-red-400">
              {studentError}
            </p>
          )}

        </div>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">

          <AlertTriangle
            size={20}
            className="mt-0.5 shrink-0"
          />

          <div className="flex-1">

            <p>{error}</p>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
              className="mt-2 text-xs font-semibold text-red-200 underline"
            >
              Dismiss
            </button>

          </div>
        </div>
      )}

      {/* =====================================================
          BEST CURRENT MATCH
      ===================================================== */}

      {bestMatch && (
        <div className="rounded-2xl border border-emerald-500/30 bg-slate-950/70 p-5 shadow-lg">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                <TrendingUp
                  size={27}
                  className="text-emerald-400"
                />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Best Current Match
                </p>

                <h2 className="mt-1 text-2xl font-bold text-white">
                  {bestMatch.role}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {bestMatch.company}
                </p>
              </div>

            </div>

            <div className="text-left lg:text-right">

              <p className="text-xs text-slate-500">
                Skill Match
              </p>

              <p className="text-4xl font-bold text-emerald-400">
                {Math.round(
                  bestMatch.match_score
                )}
                %
              </p>

            </div>

          </div>

          {bestMatch.skill_gaps.length >
            0 && (
            <div className="mt-5 rounded-2xl border border-violet-500/30 bg-violet-500/5 p-4">

              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

                <div className="flex items-start gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                    <BookOpen
                      size={21}
                      className="text-violet-400"
                    />
                  </div>

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wider text-violet-400">
                      Learning → Opportunity
                    </p>

                    <h3 className="mt-1 text-base font-bold text-white">
                      Improve these skills to become more job-ready
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Your learning priorities are
                      derived from the skill gaps.
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={
                    openLearningCenter
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/20"
                >
                  <BookOpen
                    size={17}
                  />

                  Open Learning Center

                  <ArrowRight
                    size={17}
                  />
                </button>

              </div>

            </div>
          )}

        </div>
      )}

      {/* =====================================================
          SEARCH / SORT
      ===================================================== */}

      <div className="flex flex-col gap-3 lg:flex-row">

        <div className="relative flex-1">

          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search role, company, location or skill..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500"
          />

        </div>

        <div className="relative lg:w-52">

          <SlidersHorizontal
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(
                event.target.value
              )
            }
            className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-900/80 py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-300 outline-none focus:border-violet-500"
          >
            <option value="match">
              Best Match
            </option>

            <option value="deadline">
              Deadline
            </option>

            <option value="role">
              Role
            </option>
          </select>

        </div>

      </div>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="grid gap-4 md:grid-cols-5">

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

          <p className="text-sm text-slate-500">
            Available Opportunities
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {opportunities.length}
          </p>

        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/70 p-5">

          <p className="text-sm text-slate-500">
            Academically Eligible
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-400">
            {eligibleCount}
          </p>

        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

          <p className="text-sm text-slate-500">
            My Applications
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {applications.length}
          </p>

          {applicationsError && (
            <p className="mt-1 text-[11px] text-amber-500">
              Temporarily unavailable
            </p>
          )}

        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

          <p className="text-sm text-slate-500">
            Strong Matches
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-400">
            {strongMatches}
          </p>

        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

          <p className="text-sm text-slate-500">
            Shortlisted
          </p>

          <p className="mt-2 text-3xl font-bold text-violet-400">
            {
              applications.filter(
                (application) =>
                  application.recruitment_status ===
                    "Shortlisted" ||
                  application.recruitment_status ===
                    "Interview Scheduled" ||
                  application.recruitment_status ===
                    "Selected"
              ).length
            }
          </p>

        </div>

      </div>

      {/* =====================================================
          OPPORTUNITIES
      ===================================================== */}

      {filteredOpportunities.length ===
      0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-12 text-center">

          <BriefcaseBusiness
            size={42}
            className="mx-auto text-slate-600"
          />

          <h2 className="mt-4 text-xl font-bold text-white">
            No opportunities found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Try changing your search.
          </p>

        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">

          {filteredOpportunities.map(
            (opportunity) => {

              const opportunityId =
                Number(
                  opportunity.id
                );

              const alreadyApplied =
                appliedOpportunityIds.has(
                  opportunityId
                );

              const applying =
                applyLoading ===
                opportunityId;

              const eligibility =
                checkAcademicEligibility(
                  student,
                  opportunity
                );

              const academicallyEligible =
                eligibility.eligible;

              const matchClasses =
                getMatchClasses(
                  opportunity.match_score
                );

              const strongCount =
                opportunity.matched_skills
                  .length;

              const developingCount =
                opportunity.partial_skills
                  .length;

              const missingCount =
                opportunity.missing_skills
                  .length;

              return (
                <div
                  key={
                    opportunity.id
                  }
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition hover:border-violet-500/40 hover:bg-slate-900"
                >

                  {/* TOP */}

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">

                        <BriefcaseBusiness
                          size={23}
                          className="text-violet-400"
                        />

                      </div>

                      <div>

                        <h2 className="text-xl font-bold text-white">
                          {
                            opportunity.role
                          }
                        </h2>

                        <p className="mt-1 text-sm font-semibold text-violet-300">
                          {
                            opportunity.company
                          }
                        </p>

                      </div>

                    </div>

                    <div
                      className={`rounded-xl border px-3 py-2 text-right ${matchClasses.score}`}
                    >

                      <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                        Match
                      </p>

                      <p className="text-2xl font-bold">
                        {Math.round(
                          opportunity.match_score
                        )}
                        %
                      </p>

                    </div>

                  </div>

                  {/* MATCH STATUS */}

                  <div className="mt-5">

                    <span
                      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-bold ${matchClasses.badge}`}
                    >
                      <Target
                        size={14}
                      />

                      {getMatchLabel(
                        opportunity.match_score
                      )}
                    </span>

                  </div>

                  {/* PROGRESS */}

                  <div className="mt-5">

                    <div className="flex items-center justify-between">

                      <p className="text-sm text-slate-500">
                        Skill compatibility
                      </p>

                      <p className="text-sm font-bold text-amber-400">
                        {opportunity.match_score.toFixed(
                          2
                        )}
                        %
                      </p>

                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">

                      <div
                        className={`h-full rounded-full transition-all ${matchClasses.progress}`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              0,
                              opportunity.match_score
                            )
                          )}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* META */}

                  <div className="mt-6 grid gap-4 text-sm text-slate-400 sm:grid-cols-2">

                    <div className="flex items-center gap-2">

                      <MapPin
                        size={16}
                      />

                      {
                        opportunity.location
                      }

                    </div>

                    <div className="flex items-center gap-2">

                      <BriefcaseBusiness
                        size={16}
                      />

                      {
                        opportunity.type
                      }

                    </div>

                    {opportunity.stipend && (
                      <div className="flex items-center gap-2">

                        <IndianRupee
                          size={16}
                        />

                        {
                          opportunity.stipend
                        }

                      </div>
                    )}

                    {opportunity.duration && (
                      <div className="flex items-center gap-2">

                        <Clock3
                          size={16}
                        />

                        {
                          opportunity.duration
                        }

                      </div>
                    )}

                    {opportunity.deadline && (
                      <div className="flex items-center gap-2 sm:col-span-2">

                        <CalendarDays
                          size={16}
                        />

                        Deadline:{" "}
                        {formatDate(
                          opportunity.deadline
                        )}

                      </div>
                    )}

                  </div>

                  {/* DESCRIPTION */}

                  {opportunity.description && (
                    <p className="mt-5 text-sm leading-6 text-slate-400">
                      {
                        opportunity.description
                      }
                    </p>
                  )}

                  {/* =================================================
                      ACADEMIC REQUIREMENTS
                  ================================================= */}

                  <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">

                    <div className="flex items-center gap-2">

                      <GraduationCap
                        size={18}
                        className="text-violet-400"
                      />

                      <h3 className="text-sm font-bold text-white">
                        Academic Eligibility
                      </h3>

                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2">

                      <div
                        className={`rounded-xl border p-3 ${
                          eligibility.checks.find(
                            (item) =>
                              item.key ===
                              "10th"
                          )?.passed !==
                            false
                            ? "border-emerald-500/20 bg-emerald-500/5"
                            : "border-red-500/20 bg-red-500/5"
                        }`}
                      >

                        <p className="text-[10px] uppercase tracking-wider text-slate-500">
                          10th
                        </p>

                        <p className="mt-1 text-sm font-bold text-white">
                          {student?.tenth_percentage ??
                            "—"}
                          %
                        </p>

                        <p className="mt-1 text-[10px] text-slate-500">
                          Required{" "}
                          {opportunity.min_tenth_percentage ??
                            "—"}
                          %
                        </p>

                      </div>

                      <div
                        className={`rounded-xl border p-3 ${
                          eligibility.checks.find(
                            (item) =>
                              item.key ===
                              "12th"
                          )?.passed !==
                            false
                            ? "border-emerald-500/20 bg-emerald-500/5"
                            : "border-red-500/20 bg-red-500/5"
                        }`}
                      >

                        <p className="text-[10px] uppercase tracking-wider text-slate-500">
                          12th
                        </p>

                        <p className="mt-1 text-sm font-bold text-white">
                          {student?.twelfth_percentage ??
                            "—"}
                          %
                        </p>

                        <p className="mt-1 text-[10px] text-slate-500">
                          Required{" "}
                          {opportunity.min_twelfth_percentage ??
                            "—"}
                          %
                        </p>

                      </div>

                      <div
                        className={`rounded-xl border p-3 ${
                          eligibility.checks.find(
                            (item) =>
                              item.key ===
                              "graduation"
                          )?.passed !==
                            false
                            ? "border-emerald-500/20 bg-emerald-500/5"
                            : "border-red-500/20 bg-red-500/5"
                        }`}
                      >

                        <p className="text-[10px] uppercase tracking-wider text-slate-500">
                          Graduation
                        </p>

                        <p className="mt-1 text-sm font-bold text-white">
                          {student?.graduation_percentage ??
                            "—"}
                          %
                        </p>

                        <p className="mt-1 text-[10px] text-slate-500">
                          Required{" "}
                          {opportunity.min_graduation_percentage ??
                            "—"}
                          %
                        </p>

                      </div>

                    </div>

                    {/* ELIGIBLE */}

                    {academicallyEligible ? (
                      <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">

                        <CheckCircle2
                          size={16}
                          className="text-emerald-400"
                        />

                        <p className="text-xs font-semibold text-emerald-400">
                          You meet the academic eligibility criteria.
                        </p>

                      </div>
                    ) : (
                      <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3">

                        <div className="flex items-start gap-2">

                          <XCircle
                            size={17}
                            className="mt-0.5 shrink-0 text-red-400"
                          />

                          <div>

                            <p className="text-xs font-bold text-red-400">
                              You are not academically eligible.
                            </p>

                            <div className="mt-1 space-y-1">

                              {eligibility.failedChecks.map(
                                (check) => (
                                  <p
                                    key={
                                      check.key
                                    }
                                    className="text-[11px] text-red-300"
                                  >
                                    •{" "}
                                    {
                                      check.label
                                    }
                                    :{" "}
                                    {check.actual ===
                                    null
                                      ? "Not provided"
                                      : `${check.actual}%`}
                                    {" "}
                                    — Required{" "}
                                    {
                                      check.required
                                    }%
                                  </p>
                                )
                              )}

                            </div>

                          </div>

                        </div>

                      </div>
                    )}

                  </div>

                  {/* SKILL SUMMARY */}

                  <div className="mt-5 grid grid-cols-3 gap-2">

                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">

                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Strong
                      </p>

                      <p className="mt-1 text-xl font-bold text-emerald-400">
                        {
                          strongCount
                        }
                      </p>

                    </div>

                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">

                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Developing
                      </p>

                      <p className="mt-1 text-xl font-bold text-amber-400">
                        {
                          developingCount
                        }
                      </p>

                    </div>

                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">

                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Missing
                      </p>

                      <p className="mt-1 text-xl font-bold text-red-400">
                        {
                          missingCount
                        }
                      </p>

                    </div>

                  </div>

                  {/* REQUIRED SKILLS */}

                  {opportunity.required_skills
                    .length > 0 && (
                    <div className="mt-5">

                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Required Skills
                      </p>

                      <div className="flex flex-wrap gap-2">

                        {opportunity.required_skills.map(
                          (skill) => {

                            const matched =
                              opportunity.matched_skills.some(
                                (item) =>
                                  item.skill
                                    .toLowerCase() ===
                                  skill.toLowerCase()
                              );

                            const developing =
                              opportunity.partial_skills.some(
                                (item) =>
                                  item.skill
                                    .toLowerCase() ===
                                  skill.toLowerCase()
                              );

                            return (
                              <span
                                key={
                                  skill
                                }
                                className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
                                  matched
                                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                    : developing
                                    ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                                    : "border-red-500/30 bg-red-500/10 text-red-400"
                                }`}
                              >
                                {matched
                                  ? "✓"
                                  : developing
                                  ? "△"
                                  : "×"}{" "}
                                {skill}
                              </span>
                            );
                          }
                        )}

                      </div>

                    </div>
                  )}

                  {/* LEARNING */}

                  {opportunity.skill_gaps
                    .length > 0 && (
                    <div className="mt-6 rounded-2xl border border-violet-500/30 bg-violet-500/5 p-4">

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex items-start gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">

                            <BookOpen
                              size={19}
                              className="text-violet-400"
                            />

                          </div>

                          <div>

                            <p className="text-xs font-bold uppercase tracking-wider text-violet-400">
                              Learning → Opportunity
                            </p>

                            <h3 className="mt-1 text-sm font-bold text-white">
                              Learn these skills to improve your match
                            </h3>

                          </div>

                        </div>

                      </div>

                      <div className="mt-4 space-y-2">

                        {opportunity.skill_gaps
                          .slice(0, 3)
                          .map(
                            (skill) => (
                              <div
                                key={
                                  skill.skill
                                }
                                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-3"
                              >

                                <div className="flex items-center gap-3">

                                  <BookOpen
                                    size={16}
                                    className="text-red-400"
                                  />

                                  <div>

                                    <p className="text-sm font-semibold text-white">
                                      {
                                        skill.skill
                                      }
                                    </p>

                                    <p className="text-xs text-slate-500">
                                      Strengthen
                                    </p>

                                  </div>

                                </div>

                                <span className="rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1 text-[10px] font-bold text-red-400">
                                  {getPriorityForSkill(
                                    skill
                                  )}
                                </span>

                              </div>
                            )
                          )}

                      </div>

                      <button
                        type="button"
                        onClick={
                          openLearningCenter
                        }
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600/20 px-4 py-3 text-sm font-semibold text-violet-300 transition hover:bg-violet-600/30"
                      >
                        <BookOpen
                          size={17}
                        />

                        Continue Learning

                        <ArrowRight
                          size={17}
                        />
                      </button>

                    </div>
                  )}

                  {/* =================================================
                      ACTIONS
                  ================================================= */}

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedOpportunity(
                          opportunity
                        )
                      }
                      className="flex-1 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-violet-500 hover:text-white"
                    >
                      View Details
                    </button>

                    <button
                      type="button"

                      disabled={
                        alreadyApplied ||
                        applying ||
                        !academicallyEligible
                      }

                      onClick={() =>
                        handleApply(
                          opportunity
                        )
                      }

                      className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        alreadyApplied
                          ? "cursor-default border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                          : !academicallyEligible
                          ? "cursor-not-allowed border border-red-500/20 bg-red-500/10 text-red-400"
                          : "bg-violet-600 text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                      }`}
                    >

                      {applying ? (
                        <span className="flex items-center justify-center gap-2">

                          <RefreshCw
                            size={16}
                            className="animate-spin"
                          />

                          Applying...

                        </span>
                      ) : alreadyApplied ? (
                        <span className="flex items-center justify-center gap-2">

                          <CheckCircle2
                            size={17}
                          />

                          Applied

                        </span>
                      ) : !academicallyEligible ? (
                        <span className="flex items-center justify-center gap-2">

                          <XCircle
                            size={17}
                          />

                          Not Eligible

                        </span>
                      ) : (
                        "Apply Now →"
                      )}

                    </button>

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

      {/* =====================================================
          DETAILS MODAL
      ===================================================== */}

      {selectedOpportunity && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950 p-7 shadow-2xl">

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-sm font-medium text-violet-400">
                  Opportunity Details
                </p>

                <h2 className="mt-1 text-2xl font-bold text-white">
                  {
                    selectedOpportunity.role
                  }
                </h2>

                <p className="mt-1 text-violet-300">
                  {
                    selectedOpportunity.company
                  }
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedOpportunity(
                    null
                  )
                }
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
              >
                <X
                  size={20}
                />
              </button>

            </div>

            {/* DETAILS */}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">

                <p className="text-xs text-slate-500">
                  Location
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  {
                    selectedOpportunity.location
                  }
                </p>

              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">

                <p className="text-xs text-slate-500">
                  Type
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  {
                    selectedOpportunity.type
                  }
                </p>

              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">

                <p className="text-xs text-slate-500">
                  Compensation
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  {
                    selectedOpportunity.stipend ||
                    "Not specified"
                  }
                </p>

              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">

                <p className="text-xs text-slate-500">
                  Duration
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  {
                    selectedOpportunity.duration ||
                    "Not specified"
                  }
                </p>

              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">

                <p className="text-xs text-slate-500">
                  Deadline
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  {formatDate(
                    selectedOpportunity.deadline
                  )}
                </p>

              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">

                <p className="text-xs text-slate-500">
                  Skill Match
                </p>

                <p className="mt-1 text-sm font-semibold text-emerald-400">
                  {selectedOpportunity.match_score.toFixed(
                    2
                  )}
                  %
                </p>

              </div>

            </div>

            {/* =================================================
                ACADEMIC ELIGIBILITY IN MODAL
            ================================================= */}

            {(() => {
              const modalEligibility =
                checkAcademicEligibility(
                  student,
                  selectedOpportunity
                );

              return (
                <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">

                  <div className="flex items-center gap-2">

                    <GraduationCap
                      size={19}
                      className="text-violet-400"
                    />

                    <h3 className="text-sm font-bold text-white">
                      Academic Eligibility
                    </h3>

                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">

                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">

                      <p className="text-[10px] uppercase text-slate-500">
                        10th
                      </p>

                      <p className="mt-1 text-lg font-bold text-white">
                        {student?.tenth_percentage ??
                          "—"}
                        %
                      </p>

                      <p className="text-[10px] text-slate-500">
                        Required{" "}
                        {selectedOpportunity.min_tenth_percentage ??
                          "—"}
                        %
                      </p>

                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">

                      <p className="text-[10px] uppercase text-slate-500">
                        12th
                      </p>

                      <p className="mt-1 text-lg font-bold text-white">
                        {student?.twelfth_percentage ??
                          "—"}
                        %
                      </p>

                      <p className="text-[10px] text-slate-500">
                        Required{" "}
                        {selectedOpportunity.min_twelfth_percentage ??
                          "—"}
                        %
                      </p>

                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">

                      <p className="text-[10px] uppercase text-slate-500">
                        Graduation
                      </p>

                      <p className="mt-1 text-lg font-bold text-white">
                        {student?.graduation_percentage ??
                          "—"}
                        %
                      </p>

                      <p className="text-[10px] text-slate-500">
                        Required{" "}
                        {selectedOpportunity.min_graduation_percentage ??
                          "—"}
                        %
                      </p>

                    </div>

                  </div>

                  {modalEligibility.eligible ? (
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">

                      <CheckCircle2
                        size={18}
                        className="text-emerald-400"
                      />

                      <p className="text-sm font-semibold text-emerald-400">
                        You are academically eligible for this opportunity.
                      </p>

                    </div>
                  ) : (
                    <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3">

                      <div className="flex items-start gap-2">

                        <XCircle
                          size={18}
                          className="mt-0.5 text-red-400"
                        />

                        <div>

                          <p className="text-sm font-bold text-red-400">
                            You cannot apply for this opportunity.
                          </p>

                          <div className="mt-2 space-y-1">

                            {modalEligibility.failedChecks.map(
                              (check) => (
                                <p
                                  key={
                                    check.key
                                  }
                                  className="text-xs text-red-300"
                                >
                                  •{" "}
                                  {
                                    check.label
                                  }
                                  :{" "}
                                  {check.actual ===
                                  null
                                    ? "Not provided"
                                    : `${check.actual}%`}
                                  {" "}
                                  — Required{" "}
                                  {
                                    check.required
                                  }%
                                </p>
                              )
                            )}

                          </div>

                        </div>

                      </div>

                    </div>
                  )}

                </div>
              );
            })()}

            {/* DESCRIPTION */}

            {selectedOpportunity.description && (
              <div className="mt-6">

                <h3 className="text-sm font-semibold text-white">
                  About the Opportunity
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {
                    selectedOpportunity.description
                  }
                </p>

              </div>
            )}

            {/* SKILL BREAKDOWN */}

            <div className="mt-6">

              <h3 className="text-sm font-semibold text-white">
                Skill Compatibility
              </h3>

              <div className="mt-3 space-y-2">

                {[
                  ...selectedOpportunity.matched_skills,
                  ...selectedOpportunity.partial_skills,
                  ...selectedOpportunity.missing_skills,
                ].map(
                  (skill) => {

                    const status =
                      getSkillStatus(
                        skill
                      );

                    return (
                      <div
                        key={`${skill.skill}-${status}`}
                        className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3"
                      >

                        <div>

                          <p className="text-sm font-semibold text-white">
                            {
                              skill.skill
                            }
                          </p>

                          <p className="mt-1 text-xs text-slate-500">

                            Current{" "}
                            {
                              skill.proficiency
                            }
                            %{" "}

                            {skill.required >
                            0
                              ? `• Required ${skill.required}%`
                              : ""}

                          </p>

                        </div>

                        <span
                          className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase ${
                            status ===
                            "ready"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : status ===
                                "developing"
                              ? "bg-amber-500/10 text-amber-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {status}
                        </span>

                      </div>
                    );
                  }
                )}

              </div>

            </div>

            {/* REQUIRED SKILLS */}

            {selectedOpportunity.required_skills
              .length > 0 && (
              <div className="mt-6">

                <h3 className="text-sm font-semibold text-white">
                  Required Skills
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">

                  {selectedOpportunity.required_skills.map(
                    (skill) => (
                      <span
                        key={
                          skill
                        }
                        className="rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-300"
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              </div>
            )}

            {/* BUTTONS */}

            <div className="mt-7 flex gap-3">

              <button
                type="button"
                onClick={() =>
                  setSelectedOpportunity(
                    null
                  )
                }
                className="flex-1 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 hover:text-white"
              >
                Close
              </button>

              {appliedOpportunityIds.has(
                Number(
                  selectedOpportunity.id
                )
              ) ? (

                <button
                  type="button"
                  disabled
                  className="flex-1 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-400"
                >
                  ✓ Already Applied
                </button>

              ) : (() => {

                const modalEligibility =
                  checkAcademicEligibility(
                    student,
                    selectedOpportunity
                  );

                if (
                  !modalEligibility.eligible
                ) {
                  return (
                    <button
                      type="button"
                      disabled
                      className="flex-1 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 cursor-not-allowed"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <XCircle
                          size={17}
                        />
                        Not Eligible
                      </span>
                    </button>
                  );
                }

                return (
                  <button
                    type="button"
                    onClick={() =>
                      handleApply(
                        selectedOpportunity
                      )
                    }
                    disabled={
                      applyLoading ===
                      Number(
                        selectedOpportunity.id
                      )
                    }
                    className="flex-1 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60"
                  >
                    {applyLoading ===
                    Number(
                      selectedOpportunity.id
                    )
                      ? "Submitting..."
                      : "Apply Now →"}
                  </button>
                );

              })()}

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          SUCCESS POPUP
      ===================================================== */}

      {showSuccessPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-emerald-500/20 bg-slate-950 p-8 text-center shadow-2xl">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">

              <CheckCircle2
                size={34}
                className="text-emerald-400"
              />

            </div>

            <h2 className="mt-5 text-2xl font-bold text-white">
              Application Submitted Successfully!
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {successMessage ||
                "Your application has been submitted successfully."}
            </p>

            <button
              type="button"
              onClick={() => {
                setShowSuccessPopup(
                  false
                );

                setSuccessMessage(
                  ""
                );
              }}
              className="mt-7 w-full rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              Continue
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default Opportunities;
