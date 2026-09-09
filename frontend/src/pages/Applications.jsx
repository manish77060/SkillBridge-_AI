import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  MapPin,
  CalendarDays,
  Clock3,
  CheckCircle2,
  Search,
  RefreshCw,
  X,
  FileText,
  AlertTriangle,
  Building2,
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000";
const STUDENT_ID = "e0bab151-ab49-42fe-b6f1-c4346834b1f1";

// =========================================================
// DATE HELPERS
// =========================================================

function formatDate(date) {
  if (!date) return "Not available";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date) {
  if (!date) return "Not scheduled";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// =========================================================
// STATUS STYLE
// =========================================================

function getStatusClass(status) {
  switch (status) {
    case "Selected":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

    case "Interview Scheduled":
      return "border-blue-500/20 bg-blue-500/10 text-blue-400";

    case "Shortlisted":
      return "border-violet-500/20 bg-violet-500/10 text-violet-400";

    case "Rejected":
      return "border-red-500/20 bg-red-500/10 text-red-400";

    case "Applied":
    default:
      return "border-amber-500/20 bg-amber-500/10 text-amber-400";
  }
}

// =========================================================
// NORMALIZE APPLICATION
// =========================================================

function normalizeApplication(item) {
  /*
   * IMPORTANT:
   * Backend returns both:
   *
   * recruitment_status
   * status
   *
   * recruitment_status is the primary source.
   */

  const status =
    item?.recruitment_status ||
    item?.status ||
    "Applied";

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
      Array.isArray(item?.required_skills)
        ? item.required_skills
        : [],

    // Use ONE normalized status everywhere.
    status: status,

    recruitment_status: status,

    applied_at:
      item?.applied_at ??
      null,

    updated_at:
      item?.updated_at ??
      null,

    interview_date:
      item?.interview_date ??
      null,

    recruiter_notes:
      item?.recruiter_notes ??
      null,

    shortlisted_at:
      item?.shortlisted_at ??
      null,

    decision_at:
      item?.decision_at ??
      null,
  };
}

// =========================================================
// COMPONENT
// =========================================================

function Applications() {
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [typeFilter, setTypeFilter] = useState("All");

  const [selectedApplication, setSelectedApplication] =
    useState(null);

  // =========================================================
  // FETCH APPLICATIONS
  // =========================================================

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/api/applications/student/${STUDENT_ID}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load applications (${response.status})`
        );
      }

      const data = await response.json();

      const list = Array.isArray(data?.applications)
        ? data.applications
        : [];

      const normalizedApplications =
        list.map(normalizeApplication);

      setApplications(normalizedApplications);
    } catch (err) {
      console.error(
        "Applications loading error:",
        err
      );

      setError(
        err.message ||
          "Unable to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchApplications();
  }, []);

  // =========================================================
  // FILTERED APPLICATIONS
  // =========================================================

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications.filter(
      (application) => {
        const role =
          String(application.role || "").toLowerCase();

        const company =
          String(application.company || "").toLowerCase();

        const location =
          String(application.location || "").toLowerCase();

        const matchesSearch =
          !query ||
          role.includes(query) ||
          company.includes(query) ||
          location.includes(query);

        const matchesStatus =
          statusFilter === "All" ||
          application.recruitment_status ===
            statusFilter;

        const matchesType =
          typeFilter === "All" ||
          application.type === typeFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesType
        );
      }
    );
  }, [
    applications,
    search,
    statusFilter,
    typeFilter,
  ]);

  // =========================================================
  // STATS
  // =========================================================

  const totalApplications =
    applications.length;

  const shortlisted =
    applications.filter(
      (application) =>
        application.recruitment_status ===
        "Shortlisted"
    ).length;

  const interviews =
    applications.filter(
      (application) =>
        application.recruitment_status ===
        "Interview Scheduled"
    ).length;

  const selected =
    applications.filter(
      (application) =>
        application.recruitment_status ===
        "Selected"
    ).length;

  // =========================================================
  // STATUS OPTIONS
  // =========================================================

  const statusOptions = [
    "All",
    "Applied",
    "Shortlisted",
    "Interview Scheduled",
    "Selected",
    "Rejected",
  ];

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

        <div>
          <p className="text-sm font-medium text-violet-400">
            Career application tracking
          </p>

          <h1 className="mt-1 text-4xl font-bold tracking-tight text-white">
            My Applications
          </h1>

          <p className="mt-3 max-w-3xl text-slate-400">
            Track your internships, interviews and
            placement outcomes from one place.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchApplications}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          {loading
            ? "Refreshing..."
            : "Refresh"}
        </button>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">

          <AlertTriangle
            size={20}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p>{error}</p>

            <button
              type="button"
              onClick={fetchApplications}
              className="mt-2 text-xs font-semibold underline"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

          <p className="text-sm text-slate-500">
            Total Applications
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {totalApplications}
          </p>

        </div>

        {/* SHORTLISTED */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

          <p className="text-sm text-slate-500">
            Shortlisted
          </p>

          <p className="mt-2 text-3xl font-bold text-violet-400">
            {shortlisted}
          </p>

        </div>

        {/* INTERVIEWS */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

          <p className="text-sm text-slate-500">
            Interviews
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-400">
            {interviews}
          </p>

        </div>

        {/* SELECTED */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

          <p className="text-sm text-slate-500">
            Selected
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-400">
            {selected}
          </p>

        </div>

      </div>

      {/* =====================================================
          FILTERS
      ===================================================== */}

      <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">

        {/* SEARCH */}

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search applications..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
          />

        </div>

        {/* STATUS */}

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
        >
          {statusOptions.map((status) => (
            <option
              key={status}
              value={status}
            >
              {status === "All"
                ? "All Statuses"
                : status}
            </option>
          ))}
        </select>

        {/* TYPE */}

        <select
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(event.target.value)
          }
          className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
        >
          <option value="All">
            All Types
          </option>

          <option value="Internship">
            Internship
          </option>

          <option value="Full Time">
            Full Time
          </option>
        </select>

      </div>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-10 text-center">

          <RefreshCw
            size={30}
            className="mx-auto animate-spin text-violet-400"
          />

          <p className="mt-4 text-slate-400">
            Loading your applications...
          </p>

        </div>
      )}

      {/* =====================================================
          EMPTY
      ===================================================== */}

      {!loading &&
        filteredApplications.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-10 text-center">

            <FileText
              size={44}
              className="mx-auto text-slate-600"
            />

            <h2 className="mt-4 text-xl font-bold text-white">
              No applications found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {applications.length === 0
                ? "Apply to an opportunity and it will appear here."
                : "Try changing your search or filters."}
            </p>

          </div>
        )}

      {/* =====================================================
          APPLICATION LIST
      ===================================================== */}

      {!loading &&
        filteredApplications.length > 0 && (
          <div className="space-y-4">

            {filteredApplications.map(
              (application) => {

                // Use the normalized recruitment status.
                const status =
                  application.recruitment_status ||
                  application.status ||
                  "Applied";

                return (
                  <div
                    key={application.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition hover:border-violet-500/30"
                  >

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      {/* LEFT */}

                      <div className="flex gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                          <Building2
                            size={23}
                            className="text-violet-400"
                          />
                        </div>

                        <div>

                          <h2 className="text-xl font-bold text-white">
                            {application.role}
                          </h2>

                          <p className="mt-1 font-medium text-violet-300">
                            {application.company}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">

                            <span className="flex items-center gap-1.5">
                              <MapPin size={14} />
                              {application.location}
                            </span>

                            <span className="flex items-center gap-1.5">
                              <BriefcaseBusiness size={14} />
                              {application.type}
                            </span>

                            <span className="flex items-center gap-1.5">
                              <CalendarDays size={14} />
                              Applied{" "}
                              {formatDate(
                                application.applied_at
                              )}
                            </span>

                          </div>

                        </div>

                      </div>

                      {/* RIGHT */}

                      <div className="flex flex-col items-start gap-3 lg:items-end">

                        <span
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                            status
                          )}`}
                        >
                          {status}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedApplication(
                              application
                            )
                          }
                          className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-violet-500 hover:text-white"
                        >
                          View Details
                        </button>

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      {/* =====================================================
          APPLICATION DETAILS MODAL
      ===================================================== */}

      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950 p-7 shadow-2xl">

            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-sm font-medium text-violet-400">
                  Application Details
                </p>

                <h2 className="mt-1 text-2xl font-bold text-white">
                  {selectedApplication.role}
                </h2>

                <p className="mt-1 text-violet-300">
                  {selectedApplication.company}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedApplication(null)
                }
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-white"
              >
                <X size={20} />
              </button>

            </div>

            {/* =================================================
                STATUS
            ================================================= */}

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-5">

              <p className="text-xs uppercase tracking-wider text-slate-500">
                Current Status
              </p>

              <div className="mt-3 flex items-center gap-3">

                <CheckCircle2
                  size={22}
                  className="text-violet-400"
                />

                <span
                  className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${getStatusClass(
                    selectedApplication.recruitment_status
                  )}`}
                >
                  {selectedApplication.recruitment_status}
                </span>

              </div>

            </div>

            {/* =================================================
                DETAILS
            ================================================= */}

            <div className="mt-5 grid gap-4 sm:grid-cols-2">

              {/* APPLICATION ID */}

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">

                <p className="text-xs text-slate-500">
                  Application ID
                </p>

                <p className="mt-1 font-semibold text-white">
                  #{selectedApplication.application_id}
                </p>

              </div>

              {/* OPPORTUNITY ID */}

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">

                <p className="text-xs text-slate-500">
                  Opportunity ID
                </p>

                <p className="mt-1 font-semibold text-white">
                  #{selectedApplication.opportunity_id}
                </p>

              </div>

              {/* LOCATION */}

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">

                <p className="text-xs text-slate-500">
                  Location
                </p>

                <p className="mt-1 font-semibold text-white">
                  {selectedApplication.location}
                </p>

              </div>

              {/* TYPE */}

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">

                <p className="text-xs text-slate-500">
                  Type
                </p>

                <p className="mt-1 font-semibold text-white">
                  {selectedApplication.type}
                </p>

              </div>

              {/* APPLIED DATE */}

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">

                <p className="text-xs text-slate-500">
                  Applied On
                </p>

                <p className="mt-1 font-semibold text-white">
                  {formatDate(
                    selectedApplication.applied_at
                  )}
                </p>

              </div>

              {/* DEADLINE */}

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">

                <p className="text-xs text-slate-500">
                  Deadline
                </p>

                <p className="mt-1 font-semibold text-white">
                  {formatDate(
                    selectedApplication.deadline
                  )}
                </p>

              </div>

            </div>

            {/* =================================================
                INTERVIEW
            ================================================= */}

            {selectedApplication.interview_date && (
              <div className="mt-5 rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">

                <div className="flex items-center gap-3">

                  <Clock3
                    size={20}
                    className="text-blue-400"
                  />

                  <div>

                    <p className="text-xs text-slate-500">
                      Interview Scheduled
                    </p>

                    <p className="mt-1 font-semibold text-white">
                      {formatDateTime(
                        selectedApplication.interview_date
                      )}
                    </p>

                  </div>

                </div>

              </div>
            )}

            {/* =================================================
                SHORTLISTED INFORMATION
            ================================================= */}

            {selectedApplication.recruitment_status ===
              "Shortlisted" && (
              <div className="mt-5 rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">

                <div className="flex items-start gap-3">

                  <CheckCircle2
                    size={20}
                    className="mt-0.5 text-violet-400"
                  />

                  <div>

                    <p className="text-sm font-semibold text-violet-300">
                      You have been shortlisted
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      Your application has progressed
                      to the next stage of the
                      recruitment process.
                    </p>

                    {selectedApplication.shortlisted_at && (
                      <p className="mt-2 text-xs text-slate-500">
                        Shortlisted on{" "}
                        {formatDateTime(
                          selectedApplication.shortlisted_at
                        )}
                      </p>
                    )}

                  </div>

                </div>

              </div>
            )}

            {/* =================================================
                RECRUITER NOTES
            ================================================= */}

            {selectedApplication.recruiter_notes && (
              <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900 p-5">

                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Recruiter Notes
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {selectedApplication.recruiter_notes}
                </p>

              </div>
            )}

            {/* =================================================
                SKILLS
            ================================================= */}

            {selectedApplication.required_skills?.length >
              0 && (
              <div className="mt-5">

                <h3 className="text-sm font-semibold text-white">
                  Required Skills
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">

                  {selectedApplication.required_skills.map(
                    (skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300"
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              </div>
            )}

            {/* =================================================
                CLOSE
            ================================================= */}

            <button
              type="button"
              onClick={() =>
                setSelectedApplication(null)
              }
              className="mt-7 w-full rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-violet-500 hover:text-white"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default Applications;