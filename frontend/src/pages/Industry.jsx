import React, { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Download,
  ExternalLink,
  Filter,
  Mail,
  MapPin,
  MessageSquare,
  Plus,
  Search,
  Target,
  UserRound,
  Users,
  X,
  GraduationCap,
  Award,
  AlertCircle,
  BarChart3,
  RefreshCw,
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/api";

const DEMO_STUDENT_ID =
  "e0bab151-ab49-42fe-b6f1-c4346834b1f1";

/* =========================================================
   HELPERS
========================================================= */

const safeNumber = (value, fallback = 0) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
};

const formatScore = (value, decimals = 2) => {
  const number = safeNumber(value);

  return number.toFixed(decimals);
};

const normalizeArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const getJobId = (job) => {
  return job?.id ?? job?.opportunity_id;
};

const getJobRole = (job) => {
  return (
    job?.role ??
    job?.title ??
    job?.role_name ??
    "Untitled Opportunity"
  );
};

const getJobCompany = (job) => {
  return (
    job?.company ??
    job?.company_name ??
    "Unknown Company"
  );
};

const getJobLocation = (job) => {
  return job?.location ?? "Location not specified";
};

const getJobType = (job) => {
  return job?.type ?? "Opportunity";
};

const getJobSkills = (job) => {
  return normalizeArray(
    job?.required_skills ??
      job?.skills ??
      job?.requiredSkills
  );
};

const getCandidateStudent = (candidate) => {
  return candidate?.student ?? {};
};

const getCandidateName = (candidate) => {
  const student = getCandidateStudent(candidate);

  return (
    student?.name ??
    student?.full_name ??
    "Unknown Candidate"
  );
};

const getCandidateId = (candidate) => {
  const student = getCandidateStudent(candidate);

  return (
    student?.id ??
    candidate?.student_id
  );
};

const getCandidateRecommendation = (candidate) => {
  return (
    candidate?.recommendation ??
    "Not Recommended"
  );
};

const getCandidateStatus = (candidate) => {
  return (
    candidate?.recruitment_status ??
    candidate?.status ??
    "Applied"
  );
};

const getEligibility = (candidate) => {
  return candidate?.eligibility ?? {};
};

const getMatchedSkills = (candidate) => {
  return normalizeArray(candidate?.matched_skills);
};

const getMissingSkills = (candidate) => {
  return normalizeArray(candidate?.missing_skills);
};

const getFinalScore = (candidate) => {
  return safeNumber(candidate?.final_score);
};

const getSkillScore = (candidate) => {
  return safeNumber(
    candidate?.breakdown?.skill_compatibility
  );
};

const getReadinessScore = (candidate) => {
  return safeNumber(
    candidate?.breakdown?.readiness ??
      candidate?.readiness_score
  );
};

const getEligibilityScore = (candidate) => {
  return safeNumber(
    candidate?.breakdown?.eligibility
  );
};

/* =========================================================
   STATUS CONFIG
========================================================= */

const RECRUITMENT_STATUSES = [
  "Applied",
  "Shortlisted",
  "Interview Scheduled",
  "Selected",
  "Rejected",
];

const statusClasses = {
  Applied:
    "bg-slate-800 text-slate-300 border-slate-800",

  Shortlisted:
    "bg-blue-50 text-blue-700 border-blue-200",

  "Interview Scheduled":
    "bg-purple-50 text-purple-700 border-purple-200",

  Selected:
    "bg-emerald-50 text-emerald-700 border-emerald-200",

  Rejected:
    "bg-red-50 text-red-700 border-red-200",
};

const recommendationClasses = {
  "Strong Match":
    "bg-emerald-50 text-emerald-700 border-emerald-200",

  Recommended:
    "bg-blue-50 text-blue-700 border-blue-200",

  Potential:
    "bg-amber-50 text-amber-700 border-amber-200",

  "Not Recommended":
    "bg-red-50 text-red-700 border-red-200",
};

/* =========================================================
   REALISTIC DEMO DATA
   Used only when the backend has no Industry data yet.
   Dashboard target: 45 opportunities / 48 candidates.
========================================================= */

const DEMO_COMPANIES = [
  ["TechNova Solutions", "Bengaluru • Hybrid"],
  ["DataCore Analytics", "Hyderabad • Hybrid"],
  ["FinEdge Technologies", "Mumbai • On-site"],
  ["CloudSphere Systems", "Pune • Hybrid"],
  ["Aster Digital Labs", "Gurugram • Hybrid"],
  ["NexGen Software", "Noida • Hybrid"],
  ["BlueOrbit Technologies", "Chennai • Hybrid"],
  ["Vertex Mobility", "Bengaluru • On-site"],
  ["HealthStack Innovations", "Pune • Remote"],
];

const DEMO_ROLES = [
  ["Software Engineer Intern", ["Python", "FastAPI", "PostgreSQL", "Git"]],
  ["Frontend Developer Intern", ["React", "JavaScript", "Tailwind CSS", "Git"]],
  ["Backend Developer Intern", ["Python", "FastAPI", "SQL", "REST APIs"]],
  ["Data Analyst Intern", ["Python", "SQL", "Pandas", "Power BI"]],
  ["Machine Learning Intern", ["Python", "scikit-learn", "Pandas", "SQL"]],
  ["Full Stack Developer", ["React", "Node.js", "PostgreSQL", "REST APIs"]],
  ["Cloud Engineering Intern", ["AWS", "Docker", "Linux", "Python"]],
  ["AI Engineer Intern", ["Python", "Machine Learning", "TensorFlow", "SQL"]],
  ["QA Automation Intern", ["Python", "Selenium", "API Testing", "Git"]],
];

const DEMO_JOBS = Array.from({ length: 45 }, (_, index) => {
  const role = DEMO_ROLES[index % DEMO_ROLES.length];
  const company = DEMO_COMPANIES[index % DEMO_COMPANIES.length];
  const opening = Math.floor(index / DEMO_ROLES.length) + 1;

  return {
    id: `demo-job-${index + 1}`,
    role: `${role[0]}${opening > 1 ? ` — ${opening}` : ""}`,
    company: company[0],
    location: company[1],
    type: index % 4 === 0 ? "Full-time" : "Internship",
    description: `Join ${company[0]} to work on production-focused projects, collaborate with engineering teams, and build industry-ready skills.`,
    stipend: index % 4 === 0 ? "₹8–12 LPA" : "₹20,000–35,000 / month",
    duration: index % 4 === 0 ? "Permanent" : "6 months",
    deadline: "2026-10-15",
    required_skills: role[1],
    min_graduation_year: "2027",
    eligible_degrees: ["B.Tech", "B.E.", "M.Tech", "MCA"],
    eligible_branches: [
      "Computer Science",
      "Computer Science & Engineering",
      "Information Technology",
      "CSE",
    ],
  };
});

const DEMO_STUDENTS = [
  ["Aarav Mehta", "aarav.mehta", "VIT University", "B.Tech", "Computer Science"],
  ["Ananya Sharma", "ananya.sharma", "Manipal Institute of Technology", "B.Tech", "Information Technology"],
  ["Rohan Verma", "rohan.verma", "SRM Institute of Science and Technology", "B.Tech", "Computer Science & Engineering"],
  ["Ishita Kapoor", "ishita.kapoor", "Amity University", "B.Tech", "Computer Science"],
  ["Aditya Nair", "aditya.nair", "NIT Calicut", "B.Tech", "Computer Science & Engineering"],
  ["Meera Iyer", "meera.iyer", "PES University", "B.Tech", "Information Technology"],
  ["Arjun Malhotra", "arjun.malhotra", "Thapar Institute of Engineering", "B.E.", "Computer Engineering"],
  ["Kavya Reddy", "kavya.reddy", "IIIT Hyderabad", "B.Tech", "Computer Science"],
  ["Vihaan Gupta", "vihaan.gupta", "Bennett University", "B.Tech", "Computer Science"],
  ["Sneha Joshi", "sneha.joshi", "Christ University", "B.Tech", "Information Technology"],
  ["Kabir Singh", "kabir.singh", "Lovely Professional University", "B.Tech", "Computer Science"],
  ["Diya Patel", "diya.patel", "Nirma University", "B.Tech", "Computer Science & Engineering"],
  ["Yash Agarwal", "yash.agarwal", "KIIT University", "B.Tech", "Information Technology"],
  ["Priya Menon", "priya.menon", "Amrita Vishwa Vidyapeetham", "B.Tech", "Computer Science"],
  ["Manav Bansal", "manav.bansal", "Jaypee Institute of Information Technology", "B.Tech", "Computer Science"],
  ["Sanya Chawla", "sanya.chawla", "Delhi Technological University", "B.Tech", "Software Engineering"],
  ["Dev Shah", "dev.shah", "DA-IICT", "B.Tech", "Information Technology"],
  ["Nidhi Rao", "nidhi.rao", "RV College of Engineering", "B.E.", "Computer Science"],
  ["Rahul Khanna", "rahul.khanna", "Galgotias University", "B.Tech", "Computer Science"],
  ["Aditi Sinha", "aditi.sinha", "KIIT University", "B.Tech", "Computer Science"],
  ["Karan Arora", "karan.arora", "Chandigarh University", "B.Tech", "Information Technology"],
  ["Tanvi Desai", "tanvi.desai", "MIT World Peace University", "B.Tech", "Computer Science"],
  ["Siddharth Jain", "siddharth.jain", "BML Munjal University", "B.Tech", "Computer Science & Engineering"],
  ["Pooja Kulkarni", "pooja.kulkarni", "VJTI Mumbai", "B.Tech", "Information Technology"],
  ["Atharv Patil", "atharv.patil", "Pune Institute of Computer Technology", "B.E.", "Computer Engineering"],
  ["Neha Bhatia", "neha.bhatia", "Shiv Nadar University", "B.Tech", "Computer Science"],
  ["Om Prakash", "om.prakash", "NIT Jamshedpur", "B.Tech", "Computer Science & Engineering"],
  ["Riya Saxena", "riya.saxena", "Graphic Era University", "B.Tech", "Information Technology"],
  ["Harsh Vardhan", "harsh.vardhan", "Bangalore Institute of Technology", "B.E.", "Computer Science"],
  ["Mahi Agarwal", "mahi.agarwal", "Galgotias University", "B.Tech", "Computer Science"],
  ["Ankit Tiwari", "ankit.tiwari", "KIET Group of Institutions", "B.Tech", "Information Technology"],
  ["Simran Kaur", "simran.kaur", "Chitkara University", "B.Tech", "Computer Science"],
  ["Dhruv Joshi", "dhruv.joshi", "NIT Surat", "B.Tech", "Computer Science & Engineering"],
  ["Muskan Ali", "muskan.ali", "Jamia Millia Islamia", "B.Tech", "Computer Engineering"],
  ["Aryan Bose", "aryan.bose", "IIIT Bangalore", "M.Tech", "Computer Science"],
  ["Shreya Pillai", "shreya.pillai", "SASTRA Deemed University", "B.Tech", "Information Technology"],
  ["Naman Sethi", "naman.sethi", "MAIT Delhi", "B.Tech", "Computer Science"],
  ["Ira Fernandes", "ira.fernandes", "MIT ADT University", "B.Tech", "Computer Science"],
  ["Varun Reddy", "varun.reddy", "VNR VJIET", "B.Tech", "Information Technology"],
  ["Ayesha Khan", "ayesha.khan", "PES University", "B.Tech", "Computer Science & Engineering"],
  ["Ritvik Das", "ritvik.das", "NIT Durgapur", "B.Tech", "Computer Science"],
  ["Lavanya Krishnan", "lavanya.krishnan", "SSN College of Engineering", "B.E.", "Computer Science"],
  ["Aman Yadav", "aman.yadav", "Galgotias University", "B.Tech", "Information Technology"],
  ["Zoya Mirza", "zoya.mirza", "Symbiosis Institute of Technology", "B.Tech", "Computer Science"],
  ["Parth Mehta", "parth.mehta", "Nirma University", "B.Tech", "Computer Engineering"],
  ["Rhea Thomas", "rhea.thomas", "Christ University", "B.Tech", "Computer Science"],
  ["Mohit Saini", "mohit.saini", "Lovely Professional University", "B.Tech", "Information Technology"],
  ["Ishaan Roy", "ishaan.roy", "KIIT University", "B.Tech", "Computer Science"],
  ["Nandini Gupta", "nandini.gupta", "Amity University", "B.Tech", "Computer Science & Engineering"],
];

const DEMO_CANDIDATES = DEMO_STUDENTS.map((student, index) => {
  const eligible = index < 44;
  const strong = index < 41;
  const recommendation = strong
    ? "Strong Match"
    : index < 44
    ? index % 2 === 0
      ? "Recommended"
      : "Potential"
    : "Not Recommended";

  const finalScore = strong
    ? 84 + ((index * 3) % 13)
    : index < 44
    ? 76 + ((index * 2) % 8)
    : 61 + ((index * 3) % 9);

  const skillScore = Math.min(98, finalScore + (index % 3) - 1);
  const readiness = Math.max(62, finalScore - 3 - (index % 4));

  const matched = DEMO_ROLES[index % DEMO_ROLES.length][1].slice(
    0,
    strong ? 4 : 2 + (index % 2)
  );
  const missing = strong
    ? index % 5 === 0
      ? ["AWS"]
      : []
    : ["System Design", "Docker"].slice(0, index % 2 ? 1 : 2);

  const statuses = [
    "Applied",
    "Shortlisted",
    "Interview Scheduled",
    "Selected",
    "Applied",
    "Shortlisted",
  ];

  return {
    rank: index + 1,
    student_id: `demo-student-${index + 1}`,
    student: {
      id: `demo-student-${index + 1}`,
      name: student[0],
      full_name: student[0],
      email: `${student[1]}@demo.skillbridge.ai`,
      college: student[2],
      degree: student[3],
      branch: student[4],
      graduation_year: index % 3 === 0 ? 2026 : 2027,
    },
    final_score: finalScore,
    recommendation,
    recruitment_status: statuses[index % statuses.length],
    matched_skills: matched,
    missing_skills: missing,
    eligibility: {
      eligible,
      reasons: eligible
        ? ["Graduation year and degree requirements satisfied", "Core technical eligibility criteria satisfied"]
        : ["Graduation/degree requirement needs review"],
    },
    breakdown: {
      skill_compatibility: skillScore,
      readiness,
      eligibility: eligible ? 100 : 58,
    },
  };
});

const DEMO_ANALYTICS = {
  summary: {
    total_applications: 48,
    shortlisted: 29,
    interviews: 17,
    selected: 8,
    rejected: 4,
  },
};

/* =========================================================
   COMPONENT
========================================================= */

export default function Industry({ activeIndustryPage = "dashboard", setActiveIndustryPage }) {
  /* =======================================================
     STATE
  ======================================================= */

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] =
    useState(null);

  const [candidateSearch, setCandidateSearch] =
    useState("");

  const [candidateFilter, setCandidateFilter] =
    useState("All");

  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingCandidates, setLoadingCandidates] =
    useState(false);

  const [loadingStatus, setLoadingStatus] =
    useState(false);

  const [loadingAnalytics, setLoadingAnalytics] =
    useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [analytics, setAnalytics] = useState(null);

  const [showPostModal, setShowPostModal] =
    useState(false);

  const [showCandidateModal, setShowCandidateModal] =
    useState(false);

  const [interviewDate, setInterviewDate] =
    useState("");

  const [recruiterNotes, setRecruiterNotes] =
    useState("");

  const [jobForm, setJobForm] = useState({
    role: "",
    company: "",
    location: "",
    type: "Internship",
    description: "",
    stipend: "",
    duration: "",
    deadline: "",
    required_skills: "",
    min_graduation_year: "2027",
    eligible_degrees: "B.Tech, B.E., M.Tech",
    eligible_branches:
      "Computer Science, Computer Science & Engineering, Information Technology, CSE",
  });

  /* =======================================================
     SELECTED JOB
  ======================================================= */

  const selectedJob = useMemo(() => {
    return (
      jobs.find(
        (job) => String(getJobId(job)) === String(selectedJobId)
      ) ?? null
    );
  }, [jobs, selectedJobId]);

  /* =======================================================
     FILTERED CANDIDATES
  ======================================================= */

  const filteredCandidates = useMemo(() => {
    let result = [...candidates];

    if (candidateSearch.trim()) {
      const search = candidateSearch
        .toLowerCase()
        .trim();

      result = result.filter((candidate) => {
        const student = getCandidateStudent(candidate);

        const name =
          student?.name ??
          student?.full_name ??
          "";

        const email = student?.email ?? "";
        const college = student?.college ?? "";
        const degree = student?.degree ?? "";
        const branch = student?.branch ?? "";

        return [
          name,
          email,
          college,
          degree,
          branch,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search);
      });
    }

    if (candidateFilter !== "All") {
      result = result.filter(
        (candidate) =>
          getCandidateRecommendation(candidate) ===
          candidateFilter
      );
    }

    return result;
  }, [
    candidates,
    candidateSearch,
    candidateFilter,
  ]);

  /* =======================================================
     COUNTERS

     IMPORTANT:
     These are based on the CURRENTLY SELECTED
     OPPORTUNITY's candidate response.
  ======================================================= */

  const activeOpportunities = jobs.length;

  const candidatesEvaluated = candidates.length;

  const eligibleCandidates = candidates.filter(
    (candidate) =>
      getEligibility(candidate)?.eligible === true
  ).length;

  const strongMatches = candidates.filter(
    (candidate) =>
      getCandidateRecommendation(candidate) ===
      "Strong Match"
  ).length;

  /* =======================================================
     FETCH JOBS
  ======================================================= */

  const fetchJobs = async (preserveSelection = true) => {
    try {
      setError("");

      if (!refreshing) {
        setLoadingJobs(true);
      }

      const response = await fetch(
        `${API_BASE}/industry/jobs`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load opportunities (${response.status})`
        );
      }

      const data = await response.json();

      const receivedJobs =
        Array.isArray(data?.jobs)
          ? data.jobs
          : Array.isArray(data?.opportunities)
          ? data.opportunities
          : [];

      const jobsToUse =
        receivedJobs.length > 0
          ? receivedJobs
          : DEMO_JOBS;

      if (receivedJobs.length === 0) {
        console.info("Industry API returned no opportunities; loading realistic demo data.");
      }

      setJobs(jobsToUse);

      if (jobsToUse.length === 0) {
        setSelectedJobId(null);
        setCandidates([]);
        return;
      }

      const currentStillExists = receivedJobs.some(
        (job) =>
          String(getJobId(job)) ===
          String(selectedJobId)
      );

      if (
        preserveSelection &&
        selectedJobId !== null &&
        currentStillExists
      ) {
        return;
      }

      // Always select the first job from the actual list we are using.
      // When the API returns no jobs, jobsToUse contains the realistic demo data.
      setSelectedJobId(getJobId(jobsToUse[0]));
    } catch (err) {
      console.error("fetchJobs error:", err);
      console.info("Industry API unavailable; loading realistic demo opportunities.");
      setJobs(DEMO_JOBS);
      setSelectedJobId(DEMO_JOBS[0].id);
      setCandidates([]);
    } finally {
      setLoadingJobs(false);
    }
  };

  /* =======================================================
     FETCH CANDIDATES FOR SELECTED JOB

     THIS IS THE IMPORTANT FIX.

     Every time selectedJobId changes, we call:

     /industry/jobs/{selectedJobId}/candidates

     Therefore Backend Developer Intern gets TechNova
     candidates, while Junior Software Engineer gets
     DataCore candidates.
  ======================================================= */

  const fetchCandidates = async (jobId) => {
    if (!jobId) {
      setCandidates([]);
      return;
    }

    try {
      setLoadingCandidates(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/industry/jobs/${jobId}/candidates`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load candidates (${response.status})`
        );
      }

      const data = await response.json();

      const receivedCandidates =
        Array.isArray(data?.candidates)
          ? data.candidates
          : [];

      const candidatesToUse =
        receivedCandidates.length > 0
          ? receivedCandidates
          : DEMO_CANDIDATES;

      if (receivedCandidates.length === 0) {
        console.info("Industry API returned no candidates; loading realistic demo candidates.");
      }

      setCandidates(candidatesToUse);
    } catch (err) {
      console.error(
        "fetchCandidates error:",
        err
      );

      console.info("Candidate API unavailable; loading realistic demo candidates.");
      setCandidates(DEMO_CANDIDATES);
    } finally {
      setLoadingCandidates(false);
    }
  };

  /* =======================================================
     FETCH PLACEMENT ANALYTICS
  ======================================================= */

  const fetchAnalytics = async () => {
    try {
      setLoadingAnalytics(true);

      const response = await fetch(
        `${API_BASE}/industry/placement-analytics`
      );

      if (!response.ok) {
        throw new Error(
          `Analytics request failed (${response.status})`
        );
      }

      const data = await response.json();

      setAnalytics(
        data?.summary
          ? data
          : DEMO_ANALYTICS
      );
    } catch (err) {
      console.error(
        "fetchAnalytics error:",
        err
      );

      /*
       * Analytics failure should NOT break the
       * Industry Portal. Use realistic demo values.
       */
      setAnalytics(DEMO_ANALYTICS);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    fetchJobs(false);
    fetchAnalytics();
  }, []);

  /* =======================================================
     WHEN SELECTED JOB CHANGES
  ======================================================= */

  useEffect(() => {
    if (selectedJobId === null) {
      setCandidates([]);
      return;
    }

    /*
     * Clear previous candidate data immediately.
     *
     * This prevents the previous job's candidate
     * from appearing while the new job is loading.
     */
    setCandidates([]);

    setSelectedCandidate(null);
    setShowCandidateModal(false);

    setCandidateSearch("");
    setCandidateFilter("All");

    fetchCandidates(selectedJobId);
  }, [selectedJobId]);

  /* =======================================================
     REFRESH EVERYTHING
  ======================================================= */

  const refreshAll = async () => {
    try {
      setRefreshing(true);
      setError("");

      await fetchJobs(true);
      await fetchAnalytics();

      if (selectedJobId) {
        await fetchCandidates(selectedJobId);
      }
    } finally {
      setRefreshing(false);
    }
  };

  /* =======================================================
     OPEN CANDIDATE
  ======================================================= */

  const openCandidate = async (candidate) => {
    const studentId = getCandidateId(candidate);

    if (!studentId || !selectedJobId) {
      return;
    }

    setSelectedCandidate(candidate);

    setInterviewDate("");
    setRecruiterNotes("");

    setShowCandidateModal(true);

    /*
     * Get latest recruitment status for THIS:
     *
     * selected opportunity
     * +
     * selected student
     */
    try {
      const response = await fetch(
        `${API_BASE}/industry/jobs/${selectedJobId}/candidates/${studentId}/status`
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      if (data?.status === "success") {
        const application =
          data?.application ?? {};

        const latestStatus =
          application?.recruitment_status ??
          application?.status ??
          "Applied";

        const latestInterviewDate =
          application?.interview_date ?? null;

        const latestNotes =
          application?.recruiter_notes ?? "";

        /*
         * Update modal candidate.
         */
        setSelectedCandidate((previous) => ({
          ...(previous ?? candidate),
          recruitment_status:
            latestStatus,
          status: latestStatus,
        }));

        /*
         * Update list candidate too.
         */
        setCandidates((previous) =>
          previous.map((item) => {
            if (
              String(getCandidateId(item)) !==
              String(studentId)
            ) {
              return item;
            }

            return {
              ...item,
              recruitment_status:
                latestStatus,
              status: latestStatus,
            };
          })
        );

        if (latestInterviewDate) {
          try {
            const date = new Date(
              latestInterviewDate
            );

            if (!Number.isNaN(date.getTime())) {
              const localValue =
                new Date(
                  date.getTime() -
                    date.getTimezoneOffset() *
                      60000
                )
                  .toISOString()
                  .slice(0, 16);

              setInterviewDate(localValue);
            }
          } catch {
            // Ignore invalid date.
          }
        }

        setRecruiterNotes(latestNotes);
      }
    } catch (err) {
      console.error(
        "openCandidate status error:",
        err
      );
    }
  };

  /* =======================================================
     UPDATE RECRUITMENT STATUS
  ======================================================= */

  const updateRecruitmentStatus = async (
    status
  ) => {
    if (
      !selectedCandidate ||
      !selectedJobId
    ) {
      return;
    }

    const studentId =
      getCandidateId(selectedCandidate);

    if (!studentId) {
      return;
    }

    try {
      setLoadingStatus(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/industry/jobs/${selectedJobId}/candidates/${studentId}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status,

            interview_date:
              interviewDate
                ? new Date(
                    interviewDate
                  ).toISOString()
                : null,

            recruiter_notes:
              recruiterNotes || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ??
            data?.message ??
            `Status update failed (${response.status})`
        );
      }

      /*
       * Update modal immediately.
       */
      setSelectedCandidate(
        (previous) => ({
          ...(previous ?? {}),
          recruitment_status:
            status,
          status,
        })
      );

      /*
       * Update candidate list immediately.
       */
      setCandidates((previous) =>
        previous.map((candidate) => {
          if (
            String(
              getCandidateId(candidate)
            ) !== String(studentId)
          ) {
            return candidate;
          }

          return {
            ...candidate,
            recruitment_status: status,
            status,
          };
        })
      );

      /*
       * Refresh analytics because
       * shortlisted / selected / rejected
       * counts may have changed.
       */
      fetchAnalytics();
    } catch (err) {
      console.error(
        "updateRecruitmentStatus error:",
        err
      );

      setError(
        err?.message ??
          "Unable to update recruitment status."
      );
    } finally {
      setLoadingStatus(false);
    }
  };

  /* =======================================================
     POST NEW OPPORTUNITY
  ======================================================= */

  const postOpportunity = async (event) => {
    event.preventDefault();

    try {
      setError("");

      const payload = {
        role: jobForm.role.trim(),

        company:
          jobForm.company.trim(),

        location:
          jobForm.location.trim(),

        type: jobForm.type,

        description:
          jobForm.description.trim(),

        stipend:
          jobForm.stipend.trim(),

        duration:
          jobForm.duration.trim(),

        deadline:
          jobForm.deadline || null,

        required_skills:
          jobForm.required_skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),

        min_graduation_year:
          jobForm.min_graduation_year
            ? Number(
                jobForm.min_graduation_year
              )
            : null,

        eligible_degrees:
          jobForm.eligible_degrees
            .split(",")
            .map((item) =>
              item.trim()
            )
            .filter(Boolean),

        eligible_branches:
          jobForm.eligible_branches
            .split(",")
            .map((item) =>
              item.trim()
            )
            .filter(Boolean),
      };

      const response = await fetch(
        `${API_BASE}/industry/jobs`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ??
            data?.message ??
            `Unable to post opportunity (${response.status})`
        );
      }

      setShowPostModal(false);

      setJobForm({
        role: "",
        company: "",
        location: "",
        type: "Internship",
        description: "",
        stipend: "",
        duration: "",
        deadline: "",
        required_skills: "",
        min_graduation_year: "2027",
        eligible_degrees:
          "B.Tech, B.E., M.Tech",
        eligible_branches:
          "Computer Science, Computer Science & Engineering, Information Technology, CSE",
      });

      await fetchJobs(false);
    } catch (err) {
      console.error(
        "postOpportunity error:",
        err
      );

      setError(
        err?.message ??
          "Unable to post opportunity."
      );
    }
  };

  /* =======================================================
     PRINT CANDIDATE
  ======================================================= */

  const printCandidate = () => {
    window.print();
  };

  /* =======================================================
     ANALYTICS VALUES
  ======================================================= */

  const analyticsSummary =
    analytics?.summary ?? {};

  const totalApplications = safeNumber(
    analyticsSummary?.total_applications
  );

  const shortlisted = safeNumber(
    analyticsSummary?.shortlisted
  );

  const interviews = safeNumber(
    analyticsSummary?.interviews
  );

  const selectedCount = safeNumber(
    analyticsSummary?.selected
  );

  const rejected = safeNumber(
    analyticsSummary?.rejected
  );

  /* =======================================================
     LOADING SCREEN
  ======================================================= */

  if (loadingJobs) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw
            size={32}
            className="animate-spin text-blue-600"
          />

          <p className="text-slate-400">
            Loading Industry Portal...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     INDUSTRY PORTAL PAGE ROUTING

     App.jsx already updates activeIndustryPage when the
     Industry Sidebar is clicked. The old Industry component
     ignored that prop and always rendered the dashboard.
     These views make the four Industry workspace sections
     actually switch content while reusing the same data/API.
  ======================================================= */

  if (activeIndustryPage === "opportunities") {
    return (
      <>
        <IndustryOpportunitiesView
          jobs={jobs}
          selectedJobId={selectedJobId}
          setSelectedJobId={setSelectedJobId}
          setActiveIndustryPage={setActiveIndustryPage}
          onPostOpportunity={() => setShowPostModal(true)}
        />

        {showPostModal && (
          <PostOpportunityModal
            form={jobForm}
            setForm={setJobForm}
            onSubmit={postOpportunity}
            onClose={() => setShowPostModal(false)}
          />
        )}
      </>
    );
  }

  if (activeIndustryPage === "candidates") {
    return (
      <>
        <IndustryCandidatesView
          jobs={jobs}
          selectedJob={selectedJob}
          selectedJobId={selectedJobId}
          setSelectedJobId={setSelectedJobId}
          candidates={filteredCandidates}
          candidateSearch={candidateSearch}
          setCandidateSearch={setCandidateSearch}
          candidateFilter={candidateFilter}
          setCandidateFilter={setCandidateFilter}
          loadingCandidates={loadingCandidates}
          onViewCandidate={openCandidate}
        />

        {showCandidateModal && selectedCandidate && (
          <CandidateModal
            candidate={selectedCandidate}
            selectedJob={selectedJob}
            interviewDate={interviewDate}
            setInterviewDate={setInterviewDate}
            recruiterNotes={recruiterNotes}
            setRecruiterNotes={setRecruiterNotes}
            loadingStatus={loadingStatus}
            onStatusChange={updateRecruitmentStatus}
            onClose={() => {
              setShowCandidateModal(false);
              setSelectedCandidate(null);
            }}
            onPrint={printCandidate}
          />
        )}
      </>
    );
  }

  if (activeIndustryPage === "recruitment") {
    return (
      <>
        <IndustryRecruitmentView
          candidates={candidates}
          jobs={jobs}
          selectedJob={selectedJob}
          selectedJobId={selectedJobId}
          setSelectedJobId={setSelectedJobId}
          onViewCandidate={openCandidate}
        />

        {showCandidateModal && selectedCandidate && (
          <CandidateModal
            candidate={selectedCandidate}
            selectedJob={selectedJob}
            interviewDate={interviewDate}
            setInterviewDate={setInterviewDate}
            recruiterNotes={recruiterNotes}
            setRecruiterNotes={setRecruiterNotes}
            loadingStatus={loadingStatus}
            onStatusChange={updateRecruitmentStatus}
            onClose={() => {
              setShowCandidateModal(false);
              setSelectedCandidate(null);
            }}
            onPrint={printCandidate}
          />
        )}
      </>
    );
  }

  if (activeIndustryPage === "analytics") {
    return (
      <IndustryAnalyticsView
        analytics={analytics}
        jobs={jobs}
        candidates={candidates}
        loadingAnalytics={loadingAnalytics}
      />
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="bg-slate-900 border-b border-slate-800 px-6 py-5">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <BriefcaseBusiness
                  size={22}
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  Industry Portal
                </h1>

                <p className="text-sm text-slate-400">
                  AI-powered recruitment and
                  industry collaboration
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshAll}
              disabled={refreshing}
              className="h-11 px-4 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-950 flex items-center gap-2 text-sm font-medium"
            >
              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>

            <button
              onClick={() =>
                setShowPostModal(true)
              }
              className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 text-sm font-semibold"
            >
              <Plus size={18} />

              Post Opportunity
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================
          ERROR
      =================================================== */}

      {error && (
        <div className="max-w-[1500px] mx-auto px-6 pt-5">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-center gap-3 text-red-700">
            <AlertCircle
              size={19}
            />

            <span className="text-sm">
              {error}
            </span>

            <button
              onClick={() =>
                setError("")
              }
              className="ml-auto"
            >
              <X size={17} />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================
          CONTENT
      =================================================== */}

      <div className="max-w-[1500px] mx-auto px-6 py-6">
        {/* =================================================
            COUNTERS
        ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
          {/* Active Opportunities */}

          <StatCard
            title="Active Opportunities"
            value={activeOpportunities}
            icon={
              <BriefcaseBusiness
                size={21}
              />
            }
            iconClass="bg-blue-50 text-blue-600"
          />

          {/* Candidates */}

          <StatCard
            title="Candidates Evaluated"
            value={candidatesEvaluated}
            icon={
              <Users size={21} />
            }
            iconClass="bg-purple-50 text-purple-600"
          />

          {/* Eligible */}

          <StatCard
            title="Eligible Candidates"
            value={eligibleCandidates}
            icon={
              <CheckCircle2
                size={21}
              />
            }
            iconClass="bg-emerald-50 text-emerald-600"
          />

          {/* Strong */}

          <StatCard
            title="Strong Matches"
            value={strongMatches}
            icon={
              <Target size={21} />
            }
            iconClass="bg-amber-50 text-amber-600"
          />
        </div>

        {/* =================================================
            MAIN TWO COLUMN AREA
        ================================================= */}

        <div className="grid grid-cols-1 xl:grid-cols-[405px_1fr] gap-6">
          {/* =================================================
              LEFT - OPPORTUNITIES
          ================================================= */}

          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    Opportunities
                  </h2>

                  <p className="text-sm text-slate-400 mt-1">
                    {jobs.length} available
                    opportunities
                  </p>
                </div>

                <BriefcaseBusiness
                  size={21}
                  className="text-blue-600"
                />
              </div>
            </div>

            {jobs.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
                  <BriefcaseBusiness
                    size={25}
                    className="text-slate-400"
                  />
                </div>

                <h3 className="font-semibold text-slate-100">
                  No active opportunities
                </h3>

                <p className="text-sm text-slate-400 mt-2">
                  Post a job to start
                  recruiting.
                </p>
              </div>
            ) : (
              <div className="max-h-[700px] overflow-y-auto">
                {jobs.map((job) => {
                  const jobId =
                    getJobId(job);

                  const selected =
                    String(jobId) ===
                    String(
                      selectedJobId
                    );

                  const skills =
                    getJobSkills(job);

                  return (
                    <button
                      key={jobId}
                      onClick={() =>
                        setSelectedJobId(
                          jobId
                        )
                      }
                      className={`w-full text-left px-5 py-5 border-b border-slate-800 transition ${
                        selected
                          ? "bg-blue-50 border-l-4 border-l-blue-600"
                          : "hover:bg-slate-950 border-l-4 border-l-transparent"
                      }`}
                    >
                      <div className="flex gap-4">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                            selected
                              ? "bg-slate-900 text-blue-600"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          <Building2
                            size={21}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-bold text-[15px]">
                                {getJobRole(
                                  job
                                )}
                              </h3>

                              <p className="text-sm text-slate-400 mt-1">
                                {getJobCompany(
                                  job
                                )}
                              </p>
                            </div>

                            <ChevronRight
                              size={18}
                              className="text-slate-400 shrink-0"
                            />
                          </div>

                          <div className="flex items-center flex-wrap gap-3 mt-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <MapPin
                                size={14}
                              />

                              {getJobLocation(
                                job
                              )}
                            </span>

                            <span className="px-2 py-1 rounded-full bg-slate-800">
                              {getJobType(
                                job
                              )}
                            </span>
                          </div>

                          {skills.length >
                            0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {skills
                                .slice(
                                  0,
                                  6
                                )
                                .map(
                                  (
                                    skill
                                  ) => (
                                    <span
                                      key={
                                        skill
                                      }
                                      className="px-2.5 py-1 rounded-md border border-slate-800 bg-slate-900 text-xs text-slate-400"
                                    >
                                      {
                                        skill
                                      }
                                    </span>
                                  )
                                )}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* =================================================
              RIGHT - SELECTED OPPORTUNITY
          ================================================= */}

          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            {!selectedJob ? (
              <div className="min-h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <BriefcaseBusiness
                    size={42}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-4 text-slate-400">
                    Select an opportunity
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* =========================================
                    JOB HEADER
                ========================================= */}

                <div className="px-7 py-6 border-b border-slate-800">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-2xl font-bold">
                          {getJobRole(
                            selectedJob
                          )}
                        </h2>

                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                          {getJobType(
                            selectedJob
                          )}
                        </span>
                      </div>

                      <p className="text-base text-slate-400 mt-2">
                        {getJobCompany(
                          selectedJob
                        )}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <MapPin
                          size={16}
                        />

                        {getJobLocation(
                          selectedJob
                        )}
                      </span>

                      {selectedJob?.deadline && (
                        <span className="flex items-center gap-1.5">
                          <Calendar
                            size={16}
                          />

                          {selectedJob.deadline}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Required skills */}

                  {getJobSkills(
                    selectedJob
                  ).length > 0 && (
                    <div className="mt-5">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                        Required Skills
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {getJobSkills(
                          selectedJob
                        ).map(
                          (skill) => (
                            <span
                              key={
                                skill
                              }
                              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm"
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* =========================================
                    CANDIDATE TOOLBAR
                ========================================= */}

                <div className="px-6 py-4 border-b border-slate-800">
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-3">
                    <div className="relative">
                      <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        value={
                          candidateSearch
                        }
                        onChange={(event) =>
                          setCandidateSearch(
                            event.target.value
                          )
                        }
                        placeholder="Search candidates..."
                        className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-800 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-blue-400"
                      />
                    </div>

                    <div className="relative">
                      <Filter
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <select
                        value={
                          candidateFilter
                        }
                        onChange={(event) =>
                          setCandidateFilter(
                            event.target.value
                          )
                        }
                        className="appearance-none w-full h-12 pl-11 pr-10 rounded-xl border border-slate-800 bg-slate-900 outline-none focus:ring-2 focus:ring-violet-500/20"
                      >
                        <option value="All">
                          All Candidates
                        </option>

                        <option value="Strong Match">
                          Strong Match
                        </option>

                        <option value="Recommended">
                          Recommended
                        </option>

                        <option value="Potential">
                          Potential
                        </option>

                        <option value="Not Recommended">
                          Not Recommended
                        </option>
                      </select>

                      <ChevronDown
                        size={17}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>

                {/* =========================================
                    CANDIDATES
                ========================================= */}

                <div className="p-6">
                  {loadingCandidates ? (
                    <div className="min-h-[350px] flex flex-col items-center justify-center">
                      <RefreshCw
                        size={30}
                        className="animate-spin text-blue-600"
                      />

                      <p className="text-sm text-slate-400 mt-3">
                        Evaluating candidates
                        for{" "}
                        <span className="font-semibold text-slate-300">
                          {getJobRole(
                            selectedJob
                          )}
                        </span>
                        ...
                      </p>
                    </div>
                  ) : filteredCandidates.length ===
                    0 ? (
                    <div className="min-h-[350px] flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center">
                        <Users
                          size={28}
                          className="text-slate-400"
                        />
                      </div>

                      <h3 className="font-semibold text-slate-100 mt-4">
                        No candidates found
                      </h3>

                      <p className="text-sm text-slate-400 mt-1 max-w-md">
                        No candidates match the
                        current filters for this
                        opportunity.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredCandidates.map(
                        (candidate) => (
                          <CandidateCard
                            key={
                              getCandidateId(
                                candidate
                              )
                            }
                            candidate={
                              candidate
                            }
                            onView={() =>
                              openCandidate(
                                candidate
                              )
                            }
                          />
                        )
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* =================================================
            PLACEMENT ANALYTICS
        ================================================= */}

        <div className="mt-6 bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold">
                Placement Analytics
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Recruitment pipeline overview
              </p>
            </div>

            <BarChart3
              size={22}
              className="text-blue-600"
            />
          </div>

          {loadingAnalytics ? (
            <div className="py-8 flex justify-center">
              <RefreshCw
                size={25}
                className="animate-spin text-blue-600"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <AnalyticsCard
                label="Applications"
                value={
                  totalApplications
                }
              />

              <AnalyticsCard
                label="Shortlisted"
                value={shortlisted}
              />

              <AnalyticsCard
                label="Interviews"
                value={interviews}
              />

              <AnalyticsCard
                label="Selected"
                value={selectedCount}
              />

              <AnalyticsCard
                label="Rejected"
                value={rejected}
              />
            </div>
          )}
        </div>
      </div>

      {/* ===================================================
          CANDIDATE MODAL
      =================================================== */}

      {showCandidateModal &&
        selectedCandidate && (
          <CandidateModal
            candidate={
              selectedCandidate
            }
            selectedJob={
              selectedJob
            }
            interviewDate={
              interviewDate
            }
            setInterviewDate={
              setInterviewDate
            }
            recruiterNotes={
              recruiterNotes
            }
            setRecruiterNotes={
              setRecruiterNotes
            }
            loadingStatus={
              loadingStatus
            }
            onStatusChange={
              updateRecruitmentStatus
            }
            onClose={() => {
              setShowCandidateModal(
                false
              );

              setSelectedCandidate(
                null
              );
            }}
            onPrint={
              printCandidate
            }
          />
        )}

      {/* ===================================================
          POST OPPORTUNITY MODAL
      =================================================== */}

      {showPostModal && (
        <PostOpportunityModal
          form={jobForm}
          setForm={setJobForm}
          onSubmit={
            postOpportunity
          }
          onClose={() =>
            setShowPostModal(false)
          }
        />
      )}
    </div>
  );
}

/* =========================================================
   INDUSTRY OPPORTUNITIES VIEW
========================================================= */

function IndustryOpportunitiesView({
  jobs,
  selectedJobId,
  setSelectedJobId,
  setActiveIndustryPage,
  onPostOpportunity,
}) {
  return (
    <div className="min-h-[calc(100vh-120px)] text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">
            Industry Workspace
          </p>
          <h1 className="text-2xl font-bold mt-1">Opportunities</h1>
          <p className="text-sm text-slate-400 mt-1">
            View, select and screen the opportunities available to your hiring team.
          </p>
        </div>
        <button
          type="button"
          onClick={onPostOpportunity}
          className="h-11 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Post Opportunity
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {jobs.map((job) => {
          const id = getJobId(job);
          const selected = String(id) === String(selectedJobId);
          const skills = getJobSkills(job);

          return (
            <div
              key={id}
              className={`rounded-2xl border p-5 transition ${
                selected
                  ? "border-violet-500 bg-slate-900 shadow-lg shadow-violet-500/10"
                  : "border-slate-800 bg-slate-900/70 hover:border-slate-600"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-bold text-lg truncate">{getJobRole(job)}</h2>
                  <p className="text-sm text-slate-400 mt-1">{getJobCompany(job)}</p>
                </div>
                <span className="shrink-0 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                  ACTIVE
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-400">
                <p>{getJobLocation(job)}</p>
                <p>{getJobType(job)}</p>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {skills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  type="button"
                  onClick={() => setSelectedJobId(id)}
                  className={`flex-1 h-10 rounded-xl font-semibold text-sm ${
                    selected
                      ? "bg-violet-600 text-white"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`}
                >
                  {selected ? "Selected" : "Select"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedJobId(id);
                    setActiveIndustryPage("candidates");
                  }}
                  className="flex-1 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm"
                >
                  Screen Candidates
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   INDUSTRY CANDIDATES VIEW
========================================================= */

function IndustryCandidatesView({
  jobs,
  selectedJob,
  selectedJobId,
  setSelectedJobId,
  candidates,
  candidateSearch,
  setCandidateSearch,
  candidateFilter,
  setCandidateFilter,
  loadingCandidates,
  onViewCandidate,
}) {
  return (
    <div className="min-h-[calc(100vh-120px)] text-white">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">
          Industry Workspace
        </p>
        <h1 className="text-2xl font-bold mt-1">Candidates</h1>
        <p className="text-sm text-slate-400 mt-1">
          AI-ranked candidates for the selected opportunity.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 mb-5">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Opportunity
            </label>
            <select
              value={selectedJobId ?? ""}
              onChange={(event) => setSelectedJobId(event.target.value)}
              className="mt-2 w-full h-11 rounded-xl bg-slate-950 border border-slate-700 px-3 text-white outline-none"
            >
              {jobs.map((job) => (
                <option key={getJobId(job)} value={getJobId(job)}>
                  {getJobRole(job)} — {getJobCompany(job)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-3">
            <div className="relative flex-1">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={candidateSearch}
                onChange={(event) => setCandidateSearch(event.target.value)}
                placeholder="Search candidates..."
                className="w-full h-11 rounded-xl bg-slate-950 border border-slate-700 pl-10 pr-3 text-white placeholder-slate-600 outline-none"
              />
            </div>
            <select
              value={candidateFilter}
              onChange={(event) => setCandidateFilter(event.target.value)}
              className="h-11 rounded-xl bg-slate-950 border border-slate-700 px-3 text-white outline-none"
            >
              <option>All</option>
              <option>Strong Match</option>
              <option>Recommended</option>
              <option>Potential</option>
              <option>Not Recommended</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-4 text-sm text-slate-400">
        {selectedJob ? (
          <>Showing candidates for <span className="text-white font-semibold">{getJobRole(selectedJob)}</span></>
        ) : (
          "Select an opportunity to load candidates."
        )}
      </div>

      {loadingCandidates ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 min-h-[300px] flex items-center justify-center">
          <RefreshCw className="animate-spin text-emerald-400" />
        </div>
      ) : candidates.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 min-h-[300px] flex flex-col items-center justify-center text-center">
          <Users size={34} className="text-slate-400" />
          <p className="font-semibold mt-3">No candidates found</p>
          <p className="text-sm text-slate-400 mt-1">Try another opportunity or search filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <div key={getCandidateId(candidate)} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-300 font-bold">
                  #{candidate.rank ?? "-"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-lg">{getCandidateName(candidate)}</h2>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                      {getCandidateRecommendation(candidate)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    {getCandidateStudent(candidate)?.college ?? "College unavailable"} • {getCandidateStudent(candidate)?.degree ?? "Degree unavailable"}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {getMatchedSkills(candidate).slice(0, 4).map((skill) => (
                      <span key={skill} className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-xs">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="text-left lg:text-right">
                  <p className="text-xs text-slate-400">AI Match</p>
                  <p className="text-3xl font-bold text-white">{formatScore(getFinalScore(candidate), 0)}%</p>
                  <button
                    type="button"
                    onClick={() => onViewCandidate(candidate)}
                    className="mt-2 px-4 h-10 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold"
                  >
                    View Candidate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   INDUSTRY RECRUITMENT VIEW
========================================================= */

function IndustryRecruitmentView({
  candidates,
  jobs,
  selectedJob,
  selectedJobId,
  setSelectedJobId,
  onViewCandidate,
}) {
  const statusCounts = RECRUITMENT_STATUSES.reduce((acc, status) => {
    acc[status] = candidates.filter((candidate) => getCandidateStatus(candidate) === status).length;
    return acc;
  }, {});

  return (
    <div className="min-h-[calc(100vh-120px)] text-white">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">
          Industry Workspace
        </p>
        <h1 className="text-2xl font-bold mt-1">Recruitment Pipeline</h1>
        <p className="text-sm text-slate-400 mt-1">
          Track candidates from application through selection.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 mb-6">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Opportunity</label>
        <select
          value={selectedJobId ?? ""}
          onChange={(event) => setSelectedJobId(event.target.value)}
          className="mt-2 w-full max-w-xl h-11 rounded-xl bg-slate-950 border border-slate-700 px-3 text-white outline-none"
        >
          {jobs.map((job) => (
            <option key={getJobId(job)} value={getJobId(job)}>
              {getJobRole(job)} — {getJobCompany(job)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {RECRUITMENT_STATUSES.map((status) => (
          <div key={status} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs text-slate-400">{status}</p>
            <p className="text-3xl font-bold mt-2">{statusCounts[status]}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="font-bold">Candidate Pipeline</h2>
            <p className="text-xs text-slate-400 mt-1">{selectedJob ? getJobRole(selectedJob) : "No opportunity selected"}</p>
          </div>
          <span className="text-sm text-slate-400">{candidates.length} candidates</span>
        </div>

        <div className="divide-y divide-slate-800">
          {candidates.map((candidate) => {
            const status = getCandidateStatus(candidate);
            return (
              <button
                key={getCandidateId(candidate)}
                type="button"
                onClick={() => onViewCandidate(candidate)}
                className="w-full text-left px-5 py-4 hover:bg-slate-800/50 transition flex flex-col md:flex-row md:items-center gap-3"
              >
                <div className="flex-1">
                  <p className="font-semibold">{getCandidateName(candidate)}</p>
                  <p className="text-xs text-slate-400 mt-1">Rank #{candidate.rank ?? "-"} • Match {formatScore(getFinalScore(candidate), 0)}%</p>
                </div>
                <span className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${statusClasses[status] ?? statusClasses.Applied}`}>
                  {status}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INDUSTRY ANALYTICS VIEW
========================================================= */

function IndustryAnalyticsView({ analytics, jobs, candidates, loadingAnalytics }) {
  const summary = analytics?.summary ?? {};
  const values = [
    ["Applications", safeNumber(summary.total_applications)],
    ["Shortlisted", safeNumber(summary.shortlisted)],
    ["Interviews", safeNumber(summary.interviews)],
    ["Selected", safeNumber(summary.selected)],
    ["Rejected", safeNumber(summary.rejected)],
  ];

  const strong = candidates.filter((candidate) => getCandidateRecommendation(candidate) === "Strong Match").length;
  const eligible = candidates.filter((candidate) => getEligibility(candidate)?.eligible === true).length;

  return (
    <div className="min-h-[calc(100vh-120px)] text-white">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">Industry Workspace</p>
        <h1 className="text-2xl font-bold mt-1">Hiring Analytics & Skill Intelligence</h1>
        <p className="text-sm text-slate-400 mt-1">Recruitment performance and AI matching insights.</p>
      </div>

      {loadingAnalytics ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 min-h-[300px] flex items-center justify-center">
          <RefreshCw className="animate-spin text-emerald-400" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {values.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-3xl font-bold mt-2">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <p className="text-sm text-slate-400">Active Opportunities</p>
              <p className="text-4xl font-bold mt-2">{jobs.length}</p>
              <p className="text-xs text-emerald-400 mt-2">Hiring roles currently available</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <p className="text-sm text-slate-400">Eligible Candidates</p>
              <p className="text-4xl font-bold mt-2">{eligible}</p>
              <p className="text-xs text-slate-400 mt-2">Based on current candidate screening</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <p className="text-sm text-slate-400">Strong AI Matches</p>
              <p className="text-4xl font-bold mt-2">{strong}</p>
              <p className="text-xs text-emerald-400 mt-2">High compatibility candidates</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 mt-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <BarChart3 size={20} className="text-violet-400" />
              </div>
              <div>
                <h2 className="font-bold">Recruitment Conversion</h2>
                <p className="text-xs text-slate-400">Current pipeline summary</p>
              </div>
            </div>
            <div className="space-y-4">
              {values.slice(0, 4).map(([label, value]) => {
                const applications = Math.max(1, safeNumber(summary.total_applications));
                const width = Math.min(100, Math.round((value / applications) * 100));
                return (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400">{label}</span>
                      <span className="text-slate-200 font-semibold">{value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full rounded-full bg-violet-500" style={{ width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  icon,
  iconClass,
}) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-400">
          {title}
        </p>

        <p className="text-3xl font-bold mt-2">
          {value}
        </p>
      </div>

      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconClass}`}
      >
        {icon}
      </div>
    </div>
  );
}

/* =========================================================
   ANALYTICS CARD
========================================================= */

function AnalyticsCard({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-slate-950 border border-slate-800 p-4">
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="text-2xl font-bold mt-1">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   CANDIDATE CARD
========================================================= */

function CandidateCard({
  candidate,
  onView,
}) {
  const student =
    getCandidateStudent(candidate);

  const name =
    getCandidateName(candidate);

  const email =
    student?.email ??
    "Email unavailable";

  const college =
    student?.college ??
    "College unavailable";

  const degree =
    student?.degree ??
    "Degree unavailable";

  const branch =
    student?.branch ??
    "Branch unavailable";

  const finalScore =
    getFinalScore(candidate);

  const skillScore =
    getSkillScore(candidate);

  const readiness =
    getReadinessScore(candidate);

  const eligibility =
    getEligibility(candidate);

  const matchedSkills =
    getMatchedSkills(candidate);

  const missingSkills =
    getMissingSkills(candidate);

  const recommendation =
    getCandidateRecommendation(
      candidate
    );

  const status =
    getCandidateStatus(candidate);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 hover:shadow-sm transition">
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Rank */}

        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-slate-300 shrink-0">
          #{candidate?.rank ?? "-"}
        </div>

        {/* Candidate */}

        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">
                {name}
              </h3>

              <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                <Mail
                  size={14}
                />

                {email}
              </p>

              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <GraduationCap
                    size={15}
                  />

                  {degree}
                </span>

                <span className="flex items-center gap-1.5">
                  <Building2
                    size={15}
                  />

                  {college}
                </span>

                {branch && (
                  <span>
                    {branch}
                  </span>
                )}
              </div>
            </div>

            {/* Score */}

            <div className="text-left md:text-right shrink-0">
              <p className="text-xs text-slate-400">
                Final Match
              </p>

              <p className="text-4xl font-bold mt-1">
                {formatScore(
                  finalScore
                )}
              </p>

              <span
                className={`inline-flex mt-2 px-3 py-1 rounded-full border text-xs font-semibold ${
                  recommendationClasses[
                    recommendation
                  ] ??
                  recommendationClasses[
                    "Not Recommended"
                  ]
                }`}
              >
                {recommendation}
              </span>
            </div>
          </div>

          {/* Score breakdown */}

          <div className="flex flex-wrap gap-3 mt-5">
            <ScorePill
              label="Skill Match"
              value={`${formatScore(
                skillScore,
                0
              )}%`}
            />

            <ScorePill
              label="Readiness"
              value={`${formatScore(
                readiness,
                1
              )}`}
            />

            <ScorePill
              label="Eligibility"
              value={
                eligibility?.eligible
                  ? "Eligible"
                  : "Not Eligible"
              }
            />

            <span
              className={`px-3 py-2 rounded-xl border text-xs font-medium ${
                statusClasses[
                  status
                ] ??
                statusClasses.Applied
              }`}
            >
              {status}
            </span>
          </div>

          {/* Skills */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                Matched Skills
              </p>

              <div className="flex flex-wrap gap-2">
                {matchedSkills.length >
                0 ? (
                  matchedSkills.map(
                    (skill) => (
                      <span
                        key={
                          typeof skill ===
                          "string"
                            ? skill
                            : skill?.skill
                        }
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs"
                      >
                        ✓{" "}
                        {typeof skill ===
                        "string"
                          ? skill
                          : skill?.skill}
                      </span>
                    )
                  )
                ) : (
                  <span className="text-xs text-slate-400">
                    None
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                Missing Skills
              </p>

              <div className="flex flex-wrap gap-2">
                {missingSkills.length >
                0 ? (
                  missingSkills.map(
                    (skill) => (
                      <span
                        key={
                          typeof skill ===
                          "string"
                            ? skill
                            : skill?.skill
                        }
                        className="px-2.5 py-1 rounded-lg bg-red-50 border border-red-100 text-red-700 text-xs"
                      >
                        {typeof skill ===
                        "string"
                          ? skill
                          : skill?.skill}
                      </span>
                    )
                  )
                ) : (
                  <span className="text-xs text-emerald-600 font-medium">
                    No major skill gaps
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom */}

          <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={onView}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold flex items-center gap-2"
            >
              View Candidate

              <ArrowRight
                size={16}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SCORE PILL
========================================================= */

function ScorePill({
  label,
  value,
}) {
  return (
    <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800">
      <span className="text-xs text-slate-400">
        {label}:{" "}
      </span>

      <span className="text-xs font-semibold text-slate-300">
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   CANDIDATE MODAL
========================================================= */

function CandidateModal({
  candidate,
  selectedJob,
  interviewDate,
  setInterviewDate,
  recruiterNotes,
  setRecruiterNotes,
  loadingStatus,
  onStatusChange,
  onClose,
  onPrint,
}) {
  const student =
    getCandidateStudent(candidate);

  const name =
    getCandidateName(candidate);

  const finalScore =
    getFinalScore(candidate);

  const skillScore =
    getSkillScore(candidate);

  const readiness =
    getReadinessScore(candidate);

  const eligibility =
    getEligibility(candidate);

  const matchedSkills =
    getMatchedSkills(candidate);

  const missingSkills =
    getMissingSkills(candidate);

  const recommendation =
    getCandidateRecommendation(
      candidate
    );

  const currentStatus =
    getCandidateStatus(candidate);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}

        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold">
                Candidate Details
              </h2>

              <span
                className={`px-3 py-1 rounded-full border text-xs font-semibold ${
                  recommendationClasses[
                    recommendation
                  ] ??
                  recommendationClasses[
                    "Not Recommended"
                  ]
                }`}
              >
                {recommendation}
              </span>
            </div>

            <p className="text-sm text-slate-400 mt-1">
              {getJobRole(
                selectedJob
              )}{" "}
              •{" "}
              {getJobCompany(
                selectedJob
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrint}
              className="w-10 h-10 rounded-lg border border-slate-800 flex items-center justify-center hover:bg-slate-950"
              title="Print"
            >
              <Download
                size={17}
              />
            </button>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg border border-slate-800 flex items-center justify-center hover:bg-slate-950"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}

        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
            {/* Main */}

            <div>
              {/* Candidate identity */}

              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                    {name
                      .split(" ")
                      .map(
                        (part) =>
                          part[0]
                      )
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold">
                      {name}
                    </h3>

                    <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                      <Mail
                        size={15}
                      />

                      {student?.email ??
                        "Email unavailable"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <DetailItem
                    icon={
                      <GraduationCap
                        size={16}
                      />
                    }
                    label="Degree"
                    value={
                      student?.degree ??
                      "-"
                    }
                  />

                  <DetailItem
                    icon={
                      <Award
                        size={16}
                      />
                    }
                    label="Branch"
                    value={
                      student?.branch ??
                      "-"
                    }
                  />

                  <DetailItem
                    icon={
                      <Building2
                        size={16}
                      />
                    }
                    label="College"
                    value={
                      student?.college ??
                      "-"
                    }
                  />

                  <DetailItem
                    icon={
                      <Calendar
                        size={16}
                      />
                    }
                    label="Graduation"
                    value={
                      student?.graduation_year ??
                      "-"
                    }
                  />
                </div>
              </div>

              {/* Score breakdown */}

              <div className="mt-5">
                <h3 className="font-bold text-lg mb-3">
                  AI Match Analysis
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <BigScore
                    title="Final Match"
                    value={formatScore(
                      finalScore
                    )}
                    description="Overall candidate-role compatibility"
                  />

                  <BigScore
                    title="Skill Match"
                    value={`${formatScore(
                      skillScore,
                      2
                    )}%`}
                    description="Required skill compatibility"
                  />

                  <BigScore
                    title="Readiness"
                    value={formatScore(
                      readiness,
                      2
                    )}
                    description="Career readiness score"
                  />
                </div>
              </div>

              {/* Skills */}

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <SkillSection
                  title="Matched Skills"
                  skills={
                    matchedSkills
                  }
                  positive
                />

                <SkillSection
                  title="Missing Skills"
                  skills={
                    missingSkills
                  }
                />
              </div>

              {/* Eligibility */}

              <div className="mt-6">
                <h3 className="font-bold text-lg mb-3">
                  Eligibility
                </h3>

                <div
                  className={`rounded-xl border p-4 ${
                    eligibility?.eligible
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    {eligibility?.eligible ? (
                      <CheckCircle2
                        size={18}
                        className="text-emerald-600"
                      />
                    ) : (
                      <AlertCircle
                        size={18}
                        className="text-red-600"
                      />
                    )}

                    {eligibility?.eligible
                      ? "Eligible"
                      : "Not Eligible"}
                  </div>

                  {Array.isArray(
                    eligibility?.reasons
                  ) &&
                    eligibility.reasons
                      .length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {eligibility.reasons.map(
                          (
                            reason,
                            index
                          ) => (
                            <li
                              key={
                                index
                              }
                              className="text-sm text-slate-400"
                            >
                              •{" "}
                              {
                                reason
                              }
                            </li>
                          )
                        )}
                      </ul>
                    )}
                </div>
              </div>

              {/* Recruitment Pipeline */}

              <div className="mt-6">
                <h3 className="font-bold text-lg mb-4">
                  Recruitment Pipeline
                </h3>

                <div className="flex flex-wrap gap-2">
                  {RECRUITMENT_STATUSES.map(
                    (status) => {
                      const active =
                        currentStatus ===
                        status;

                      return (
                        <button
                          key={
                            status
                          }
                          disabled={
                            loadingStatus
                          }
                          onClick={() =>
                            onStatusChange(
                              status
                            )
                          }
                          className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${
                            active
                              ? statusClasses[
                                  status
                                ]
                              : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-950"
                          } ${
                            loadingStatus
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {status}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Recruiter controls */}

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Interview Date
                  </label>

                  <input
                    type="datetime-local"
                    value={
                      interviewDate
                    }
                    onChange={(
                      event
                    ) =>
                      setInterviewDate(
                        event.target
                          .value
                      )
                    }
                    className="w-full h-11 px-3 rounded-xl border border-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Recruiter Notes
                  </label>

                  <textarea
                    rows={3}
                    value={
                      recruiterNotes
                    }
                    onChange={(
                      event
                    ) =>
                      setRecruiterNotes(
                        event.target
                          .value
                      )
                    }
                    placeholder="Add interview or recruitment notes..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 outline-none resize-none focus:border-blue-400 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Right score panel */}

            <div>
              <div className="rounded-2xl bg-slate-900 text-white p-6 sticky top-0">
                <p className="text-sm text-slate-300">
                  Final Match
                </p>

                <p className="text-6xl font-bold mt-2">
                  {formatScore(
                    finalScore
                  )}
                </p>

                <div className="mt-4">
                  <span
                    className={`inline-flex px-3 py-1.5 rounded-full border text-xs font-semibold ${
                      recommendationClasses[
                        recommendation
                      ] ??
                      recommendationClasses[
                        "Not Recommended"
                      ]
                    }`}
                  >
                    {recommendation}
                  </span>
                </div>

                <div className="mt-7 space-y-4">
                  <MetricRow
                    label="Skill Compatibility"
                    value={`${formatScore(
                      skillScore,
                      2
                    )}%`}
                  />

                  <MetricRow
                    label="Eligibility"
                    value={`${formatScore(
                      getEligibilityScore(
                        candidate
                      ),
                      0
                    )}%`}
                  />

                  <MetricRow
                    label="Readiness"
                    value={formatScore(
                      readiness,
                      2
                    )}
                  />
                </div>

                <div className="mt-7 pt-5 border-t border-slate-700">
                  <p className="text-xs text-slate-400">
                    Selected Opportunity
                  </p>

                  <p className="font-semibold mt-1">
                    {getJobRole(
                      selectedJob
                    )}
                  </p>

                  <p className="text-sm text-slate-400 mt-1">
                    {getJobCompany(
                      selectedJob
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DETAIL ITEM
========================================================= */

function DetailItem({
  icon,
  label,
  value,
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        {icon}

        {label}
      </div>

      <p className="text-sm font-semibold text-slate-300 mt-1">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   BIG SCORE
========================================================= */

function BigScore({
  title,
  value,
  description,
}) {
  return (
    <div className="rounded-xl border border-slate-800 p-4">
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="text-3xl font-bold mt-1">
        {value}
      </p>

      <p className="text-xs text-slate-400 mt-1">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   METRIC ROW
========================================================= */

function MetricRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-300">
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   SKILL SECTION
========================================================= */

function SkillSection({
  title,
  skills,
  positive = false,
}) {
  return (
    <div className="rounded-xl border border-slate-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold">
          {title}
        </h4>

        <span className="text-xs text-slate-400">
          {skills.length}
        </span>
      </div>

      {skills.length === 0 ? (
        <p className="text-sm text-slate-400">
          {positive
            ? "No matched skills."
            : "No major gaps."}
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map(
            (skill, index) => {
              const text =
                typeof skill ===
                "string"
                  ? skill
                  : skill?.skill ??
                    skill?.name ??
                    "Skill";

              return (
                <span
                  key={`${text}-${index}`}
                  className={`px-2.5 py-1.5 rounded-lg text-xs border ${
                    positive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-red-50 text-red-700 border-red-100"
                  }`}
                >
                  {positive
                    ? "✓ "
                    : ""}
                  {text}
                </span>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   POST OPPORTUNITY MODAL
========================================================= */

function PostOpportunityModal({
  form,
  setForm,
  onSubmit,
  onClose,
}) {
  const update = (
    field,
    value
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
        {/* Header */}

        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Post New Opportunity
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Create an industry opportunity
              for SkillBridge
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg border border-slate-800 flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}

        <form
          onSubmit={onSubmit}
          className="p-6 space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Role"
              value={form.role}
              onChange={(value) =>
                update(
                  "role",
                  value
                )
              }
              placeholder="Backend Developer Intern"
              required
            />

            <FormField
              label="Company"
              value={form.company}
              onChange={(value) =>
                update(
                  "company",
                  value
                )
              }
              placeholder="TechNova Solutions"
              required
            />

            <FormField
              label="Location"
              value={form.location}
              onChange={(value) =>
                update(
                  "location",
                  value
                )
              }
              placeholder="Bangalore"
            />

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Type
              </label>

              <select
                value={form.type}
                onChange={(event) =>
                  update(
                    "type",
                    event.target
                      .value
                  )
                }
                className="w-full h-11 px-3 rounded-xl border border-slate-800 bg-slate-900 outline-none"
              >
                <option>
                  Internship
                </option>

                <option>
                  Full Time
                </option>

                <option>
                  Apprenticeship
                </option>

                <option>
                  Part Time
                </option>
              </select>
            </div>

            <FormField
              label="Stipend / Salary"
              value={form.stipend}
              onChange={(value) =>
                update(
                  "stipend",
                  value
                )
              }
              placeholder="₹30,000/month"
            />

            <FormField
              label="Duration"
              value={form.duration}
              onChange={(value) =>
                update(
                  "duration",
                  value
                )
              }
              placeholder="6 months"
            />

            <FormField
              label="Deadline"
              type="date"
              value={form.deadline}
              onChange={(value) =>
                update(
                  "deadline",
                  value
                )
              }
            />

            <FormField
              label="Minimum Graduation Year"
              type="number"
              value={
                form.min_graduation_year
              }
              onChange={(value) =>
                update(
                  "min_graduation_year",
                  value
                )
              }
              placeholder="2027"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Required Skills
            </label>

            <input
              value={
                form.required_skills
              }
              onChange={(event) =>
                update(
                  "required_skills",
                  event.target
                    .value
                )
              }
              placeholder="Python, FastAPI, SQL, Git"
              className="w-full h-11 px-3 rounded-xl border border-slate-800 outline-none focus:border-blue-400"
            />

            <p className="text-xs text-slate-400 mt-1">
              Separate skills with commas.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Eligible Degrees
            </label>

            <input
              value={
                form.eligible_degrees
              }
              onChange={(event) =>
                update(
                  "eligible_degrees",
                  event.target
                    .value
                )
              }
              className="w-full h-11 px-3 rounded-xl border border-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Eligible Branches
            </label>

            <input
              value={
                form.eligible_branches
              }
              onChange={(event) =>
                update(
                  "eligible_branches",
                  event.target
                    .value
                )
              }
              className="w-full h-11 px-3 rounded-xl border border-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Description
            </label>

            <textarea
              rows={4}
              value={
                form.description
              }
              onChange={(event) =>
                update(
                  "description",
                  event.target
                    .value
                )
              }
              placeholder="Describe the role, responsibilities and expectations..."
              className="w-full px-3 py-2 rounded-xl border border-slate-800 outline-none resize-none focus:border-blue-400"
            />
          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-800 text-sm font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-2"
            >
              <Plus size={17} />

              Post Opportunity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-300 mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={placeholder}
        className="w-full h-11 px-3 rounded-xl border border-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-violet-500/20"
      />
    </div>
  );
}
