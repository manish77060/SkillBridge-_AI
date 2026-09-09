/**
 * SkillBridge AI — Centralized Database Entity Mapping & Client Adapter
 * 
 * Provides field mapping, relational schema links, session synchronization,
 * and unified database access for Student, Industry, and Institution portals.
 */

const API_BASE_URL = "http://127.0.0.1:8000";

// ============================================================
// 1. DATABASE SCHEMA DEFINITIONS & MAPPINGS
// ============================================================

export const DATABASE_MAPPINGS = {
  student: {
    portal: "student",
    title: "Student",
    primaryTable: "students",
    primaryKey: "id",
    relationalTables: [
      { name: "student_skills", foreignKey: "student_id" },
      { name: "applications", foreignKey: "student_id" },
      { name: "assessments", foreignKey: "student_id" },
    ],
    fieldMap: {
      id: "id",
      studentId: "id",
      name: "name",
      email: "email",
      college: "college",
      degree: "degree",
      branch: "branch",
      graduationYear: "graduation_year",
      location: "location",
      targetRole: "target_role",
      readinessScore: "readiness_score",
      createdAt: "created_at",
    },
  },

  industry: {
    portal: "industry",
    title: "Industry",
    primaryTable: "industry_partners",
    primaryKey: "company_id",
    relationalTables: [
      { name: "opportunities", foreignKey: "company_id" },
      { name: "applications", foreignKey: "opportunity_id" },
    ],
    fieldMap: {
      id: "company_id",
      companyId: "company_id",
      name: "company_name",
      companyName: "company_name",
      email: "email",
      recruiterName: "recruiter_name",
      industryType: "industry_type",
      location: "location",
      branch: "branch",
    },
  },

  institution: {
    portal: "institution",
    title: "Institution",
    primaryTable: "colleges",
    primaryKey: "institution_id",
    relationalTables: [
      { name: "students", foreignKey: "college" },
      { name: "placement_analytics", foreignKey: "institution_id" },
    ],
    fieldMap: {
      id: "institution_id",
      institutionId: "institution_id",
      name: "college_name",
      collegeName: "college_name",
      email: "admin_email",
      contactPerson: "contact_person",
      location: "location",
      branch: "branch",
    },
  },
};

// ============================================================
// 2. DEFAULT SEED ENTITIES FOR EACH PORTAL
// ============================================================

export const DEFAULT_ENTITIES = {
  student: {
    id: "e0bab151-ab49-42fe-b6f1-c4346834b1f1",
    studentId: "e0bab151-ab49-42fe-b6f1-c4346834b1f1",
    name: "Aman Sharma",
    firstName: "Aman",
    lastName: "Sharma",
    email: "student@demo.com",
    college: "National Institute of Technology",
    degree: "B.Tech",
    branch: "Computer Science & Engineering",
    graduationYear: 2025,
    location: "Bengaluru, India",
    targetRole: "Backend Developer",
    readinessScore: 78,
    portal: "student",
    role: "Student / Aspiring Engineer",
    profilePicture: "",
  },

  industry: {
    id: "ind-technova-01",
    companyId: "ind-technova-01",
    name: "TechNova Labs",
    company: "TechNova Labs",
    companyName: "TechNova Labs",
    firstName: "Hiring",
    lastName: "Team",
    email: "industry@demo.com",
    branch: "Talent & Recruitment Division",
    department: "Engineering Hiring",
    industryType: "Cloud & AI Infrastructure",
    location: "Bengaluru • Hybrid",
    portal: "industry",
    role: "Hiring Partner & Recruiter",
    profilePicture: "",
  },

  institution: {
    id: "inst-nit-01",
    institutionId: "inst-nit-01",
    name: "National Institute of Technology",
    college: "National Institute of Technology",
    collegeName: "National Institute of Technology",
    firstName: "Placement",
    lastName: "Director",
    email: "institution@demo.com",
    branch: "Placement & Career Advancement Cell",
    department: "Training & Placement Cell",
    location: "Karnataka, India",
    portal: "institution",
    role: "Academic Institution Administrator",
    profilePicture: "",
  },
};

// ============================================================
// 3. STORAGE & GETTERS
// ============================================================

/**
 * Returns the currently active student ID.
 * Defaults to the persistent seed demo student ID if none set.
 */
export function getStudentId() {
  try {
    const directId = localStorage.getItem("student_id");
    if (directId) return directId;

    const userRaw = localStorage.getItem("user");
    if (userRaw) {
      const parsed = JSON.parse(userRaw);
      if (parsed.studentId) return parsed.studentId;
      if (parsed.portal === "student" && parsed.id) return parsed.id;
    }
  } catch (err) {
    console.error("Error reading student_id:", err);
  }

  return DEFAULT_ENTITIES.student.id;
}

/**
 * Returns the active portal name ("student" | "industry" | "institution").
 */
export function getActivePortal() {
  try {
    return localStorage.getItem("activePortal") || "student";
  } catch {
    return "student";
  }
}

/**
 * Returns the currently authenticated entity object from localStorage.
 */
export function getActiveEntity() {
  try {
    const raw = localStorage.getItem("user");
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading active entity:", err);
  }

  const portal = getActivePortal();
  return DEFAULT_ENTITIES[portal] || DEFAULT_ENTITIES.student;
}

// ============================================================
// 4. SYNCHRONIZATION WITH DATABASE & LOCAL SESSION
// ============================================================

/**
 * Synchronizes the logged-in user credentials with the corresponding database entity.
 * Saves active session keys to localStorage to establish system-wide mapping.
 * 
 * @param {string} portal - "student" | "industry" | "institution"
 * @param {object} credentials - { email, password, firstName, lastName, contact }
 * @returns {object} Normalized entity mapped to database schema
 */
export function syncUserWithDatabase(portal = "student", credentials = {}) {
  const defaultEntity = DEFAULT_ENTITIES[portal] || DEFAULT_ENTITIES.student;

  const email = (credentials.email || defaultEntity.email).trim().toLowerCase();
  const firstName = credentials.firstName || defaultEntity.firstName || "User";
  const lastName = credentials.lastName || defaultEntity.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || defaultEntity.name;

  let mappedEntity = {
    ...defaultEntity,
    email,
    firstName,
    lastName,
    name: fullName,
    portal,
  };

  // Student specific mappings
  if (portal === "student") {
    const studentId = defaultEntity.id;
    mappedEntity = {
      ...mappedEntity,
      id: studentId,
      studentId: studentId,
      branch: credentials.branch || defaultEntity.branch,
      college: credentials.college || defaultEntity.college,
    };
    try {
      localStorage.setItem("student_id", studentId);
    } catch {}
  }

  // Industry specific mappings
  if (portal === "industry") {
    const companyId = defaultEntity.id;
    mappedEntity = {
      ...mappedEntity,
      companyId: companyId,
      company: credentials.company || defaultEntity.company,
      companyName: credentials.company || defaultEntity.companyName,
      branch: "Talent & Recruitment Division",
    };
    try {
      localStorage.setItem("company_id", companyId);
    } catch {}
  }

  // Institution specific mappings
  if (portal === "institution") {
    const institutionId = defaultEntity.id;
    mappedEntity = {
      ...mappedEntity,
      institutionId: institutionId,
      college: credentials.college || defaultEntity.college,
      collegeName: credentials.college || defaultEntity.collegeName,
      branch: "Placement & Career Advancement Cell",
    };
    try {
      localStorage.setItem("institution_id", institutionId);
    } catch {}
  }

  // Write synchronized session keys across the application
  try {
    localStorage.setItem("activePortal", portal);
    localStorage.setItem("user", JSON.stringify(mappedEntity));
    localStorage.setItem("currentUser", JSON.stringify(mappedEntity));
    localStorage.setItem("loggedInUser", JSON.stringify(mappedEntity));
    localStorage.setItem("db_entity", JSON.stringify(mappedEntity));
  } catch (err) {
    console.error("Failed to write session mapping:", err);
  }

  // Asynchronously attempt to sync with backend if online
  syncWithBackendAPI(portal, mappedEntity);

  return mappedEntity;
}

/**
 * Attempts an asynchronous sync with the FastAPI backend database endpoints.
 */
async function syncWithBackendAPI(portal, entity) {
  try {
    if (portal === "student") {
      await fetch(`${API_BASE_URL}/api/students/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: entity.name,
          email: entity.email,
          college: entity.college,
          degree: entity.degree,
          branch: entity.branch,
          graduation_year: entity.graduationYear || 2025,
          location: entity.location,
          target_role: entity.targetRole,
        }),
      }).catch(() => {
        // Backend offline or unreachable — local DB persistence is authoritative
      });
    }
  } catch {
    // Graceful offline fallback
  }
}

/**
 * Clears all database session keys on logout.
 */
export function clearDatabaseSession() {
  const keysToRemove = [
    "user",
    "currentUser",
    "loggedInUser",
    "student",
    "studentData",
    "authUser",
    "userData",
    "username",
    "userName",
    "loginName",
    "student_id",
    "company_id",
    "institution_id",
    "activePortal",
    "db_entity",
  ];

  keysToRemove.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {}
  });
}
