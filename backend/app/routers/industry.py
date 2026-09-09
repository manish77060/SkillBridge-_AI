from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone

from app.config import supabase


router = APIRouter(
    prefix="/api/industry",
    tags=["Industry"]
)


# =========================================================
# HELPERS
# =========================================================

def normalize(value):
    if value is None:
        return ""

    return str(value).strip().lower()


def calculate_skill_score(required_skills, student_skills):
    """
    Calculates skill compatibility.

    Every required skill has a default required level of 70.

    Coverage:
        current proficiency / required level * 100

    Maximum coverage for a skill = 100.
    """

    if not required_skills:
        return 0, [], []

    student_map = {}

    for item in student_skills:
        skill = item.get("skills")

        if isinstance(skill, dict):
            skill_name = skill.get("name")
        else:
            skill_name = item.get("skill_name") or item.get("name")

        if not skill_name:
            continue

        student_map[normalize(skill_name)] = float(
            item.get("proficiency") or 0
        )

    matched_skills = []
    missing_skills = []

    total_coverage = 0

    for required in required_skills:
        skill_name = (
            required
            if isinstance(required, str)
            else required.get("skill")
        )

        if not skill_name:
            continue

        required_level = 70

        if isinstance(required, dict):
            required_level = float(
                required.get("required_level")
                or required.get("required")
                or required.get("level")
                or 70
            )

        proficiency = student_map.get(
            normalize(skill_name),
            0
        )

        coverage = (
            min(
                (proficiency / required_level) * 100,
                100
            )
            if required_level > 0
            else 0
        )

        total_coverage += coverage

        if proficiency > 0:
            matched_skills.append(
                {
                    "skill": skill_name,
                    "proficiency": round(proficiency, 2),
                    "required_level": required_level,
                    "coverage": round(coverage, 2),
                }
            )

        if proficiency <= 0:
            missing_skills.append(skill_name)

    skill_score = total_coverage / len(required_skills)

    return (
        round(skill_score, 2),
        matched_skills,
        missing_skills
    )


def check_eligibility(student, opportunity):
    reasons = []

    eligible = True

    student_year = student.get("graduation_year")
    minimum_year = opportunity.get("min_graduation_year")

    if minimum_year is not None:
        if (
                student_year is None
                or int(student_year) < int(minimum_year)
        ):
            eligible = False
            reasons.append(
                f"Graduation year must be {minimum_year} or later"
            )

    allowed_degrees = opportunity.get(
        "eligible_degrees"
    ) or []

    if allowed_degrees:
        student_degree = normalize(
            student.get("degree")
        )

        degree_match = any(
            student_degree == normalize(degree)
            for degree in allowed_degrees
        )

        if not degree_match:
            eligible = False
            reasons.append("Degree is not eligible")

    allowed_branches = opportunity.get(
        "eligible_branches"
    ) or []

    if allowed_branches:
        student_branch = normalize(
            student.get("branch")
        )

        branch_match = any(
            student_branch == normalize(branch)
            for branch in allowed_branches
        )

        if not branch_match:
            eligible = False
            reasons.append("Branch is not eligible")

    if eligible:
        reasons.append("Eligible")

    return {
        "eligible": eligible,
        "reasons": reasons,
    }


# =========================================================
# JOB CREATION MODEL
# =========================================================

class JobCreate(BaseModel):
    role: str
    company: str
    location: Optional[str] = None
    type: Optional[str] = "Full Time"
    description: Optional[str] = None
    stipend: Optional[str] = None
    duration: Optional[str] = None
    deadline: Optional[str] = None

    required_skills: List[str] = Field(
        default_factory=list
    )

    min_graduation_year: Optional[int] = None
    eligible_degrees: List[str] = Field(
        default_factory=list
    )
    eligible_branches: List[str] = Field(
        default_factory=list
    )


# =========================================================
# RECRUITMENT STATUS MODEL
# =========================================================

class RecruitmentUpdate(BaseModel):
    status: str
    interview_date: Optional[str] = None
    recruiter_notes: Optional[str] = None


VALID_RECRUITMENT_STATUSES = {
    "Applied",
    "Shortlisted",
    "Interview Scheduled",
    "Selected",
    "Rejected",
}


# =========================================================
# CREATE JOB
# =========================================================

@router.post("/jobs")
def create_job(job: JobCreate):

    try:

        payload = {
            "role": job.role,
            "company": job.company,
            "location": job.location,
            "type": job.type,
            "description": job.description,
            "stipend": job.stipend,
            "duration": job.duration,
            "deadline": job.deadline,
            "required_skills": job.required_skills,
            "min_graduation_year": job.min_graduation_year,
            "eligible_degrees": job.eligible_degrees,
            "eligible_branches": job.eligible_branches,
        }

        response = (
            supabase
            .table("opportunities")
            .insert(payload)
            .execute()
        )

        return {
            "status": "success",
            "opportunity": (
                response.data[0]
                if response.data
                else None
            ),
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# GET JOBS
# =========================================================

@router.get("/jobs")
def get_jobs():

    try:

        response = (
            supabase
            .table("opportunities")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )

        return {
            "status": "success",
            "jobs": response.data or [],
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# CANDIDATE RANKING
# =========================================================

@router.get("/jobs/{opportunity_id}/candidates")
def rank_candidates(opportunity_id: int):

    try:

        # -------------------------------------------------
        # GET OPPORTUNITY
        # -------------------------------------------------

        opportunity_response = (
            supabase
            .table("opportunities")
            .select("*")
            .eq("id", opportunity_id)
            .single()
            .execute()
        )

        opportunity = opportunity_response.data

        if not opportunity:
            raise HTTPException(
                status_code=404,
                detail="Opportunity not found"
            )

        required_skills = (
                opportunity.get("required_skills")
                or []
        )


        # -------------------------------------------------
        # GET ONLY STUDENTS WHO APPLIED
        # -------------------------------------------------

        applications_response = (
            supabase
            .table("applications")
            .select(
                "student_id"
            )
            .eq(
                "opportunity_id",
                opportunity_id
            )
            .execute()
        )

        applications = (
                applications_response.data
                or []
        )

        # Only students having an application
        # for THIS opportunity are allowed
        # to appear in the industry portal.

        applied_student_ids = {
            application.get("student_id")
            for application in applications
            if application.get("student_id")
        }


        # -------------------------------------------------
        # GET STUDENTS
        # -------------------------------------------------

        students_response = (
            supabase
            .table("students")
            .select("*")
            .execute()
        )

        all_students = (
                students_response.data
                or []
        )

        # IMPORTANT:
        # Filter students before ranking.
        #
        # Students who have NOT applied to this
        # opportunity will never appear.

        students = [
            student
            for student in all_students
            if student.get("id") in applied_student_ids
        ]


        # -------------------------------------------------
        # GET STUDENT SKILLS
        # -------------------------------------------------

        skills_response = (
            supabase
            .table("student_skills")
            .select(
                "student_id, proficiency, source, skills(id,name)"
            )
            .execute()
        )

        all_student_skills = (
                skills_response.data
                or []
        )


        # -------------------------------------------------
        # RANKING
        # -------------------------------------------------

        candidates = []

        for student in students:

            student_id = student.get("id")

            student_skills = [
                item
                for item in all_student_skills
                if (
                        item.get("student_id") == student_id
                        and normalize(
                    item.get("source")
                ) != "assessment"
                )
            ]

            skill_score, matched_skills, missing_skills = (
                calculate_skill_score(
                    required_skills,
                    student_skills
                )
            )

            eligibility = check_eligibility(
                student,
                opportunity
            )

            eligibility_score = (
                100
                if eligibility["eligible"]
                else 0
            )

            readiness = float(
                student.get("readiness_score")
                or 0
            )

            final_score = (
                    skill_score * 0.50
                    + eligibility_score * 0.20
                    + readiness * 0.30
            )

            if (
                    eligibility["eligible"]
                    and final_score >= 80
            ):
                recommendation = "Strong Match"

            elif (
                    eligibility["eligible"]
                    and final_score >= 65
            ):
                recommendation = "Recommended"

            elif final_score >= 50:
                recommendation = "Potential"

            else:
                recommendation = "Not Recommended"

            candidates.append(
                {
                    "student": {
                        "id": student.get("id"),
                        "name": student.get("name"),
                        "email": student.get("email"),
                        "college": student.get("college"),
                        "degree": student.get("degree"),
                        "branch": student.get("branch"),
                        "graduation_year": student.get(
                            "graduation_year"
                        ),
                        "location": student.get(
                            "location"
                        ),
                    },

                    "final_score": round(
                        final_score,
                        2
                    ),

                    "breakdown": {
                        "skill_compatibility": round(
                            skill_score,
                            2
                        ),
                        "eligibility": eligibility_score,
                        "readiness": round(
                            readiness,
                            2
                        ),
                    },

                    "eligibility": eligibility,

                    "matched_skills": matched_skills,

                    "missing_skills": missing_skills,

                    "recommendation": recommendation,
                }
            )


        # -------------------------------------------------
        # SORT
        # -------------------------------------------------

        candidates.sort(
            key=lambda item: (
                item["eligibility"]["eligible"],
                item["final_score"]
            ),
            reverse=True
        )


        for index, candidate in enumerate(
                candidates,
                start=1
        ):
            candidate["rank"] = index


        # -------------------------------------------------
        # SUMMARY
        # -------------------------------------------------

        eligible_candidates = [
            c
            for c in candidates
            if c["eligibility"]["eligible"]
        ]

        strong_matches = [
            c
            for c in candidates
            if c["recommendation"] == "Strong Match"
        ]

        recommended = [
            c
            for c in candidates
            if c["recommendation"] == "Recommended"
        ]


        return {
            "status": "success",

            "opportunity": {
                "id": opportunity.get("id"),
                "role": opportunity.get("role"),
                "company": opportunity.get("company"),
                "required_skills": required_skills,
            },

            "scoring": {
                "skill_compatibility": 50,
                "eligibility": 20,
                "readiness": 30,
            },

            "summary": {
                "total_candidates": len(candidates),

                "eligible_candidates": len(
                    eligible_candidates
                ),

                "strong_matches": len(
                    strong_matches
                ),

                "recommended": len(
                    recommended
                ),
            },

            "candidates": candidates,
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# UPDATE RECRUITMENT STATUS
# =========================================================

@router.patch(
    "/jobs/{opportunity_id}/candidates/{student_id}/status"
)
def update_recruitment_status(
        opportunity_id: int,
        student_id: str,
        update: RecruitmentUpdate
):

    try:

        if update.status not in VALID_RECRUITMENT_STATUSES:
            raise HTTPException(
                status_code=400,
                detail=(
                        "Invalid status. Allowed statuses: "
                        + ", ".join(
                    sorted(
                        VALID_RECRUITMENT_STATUSES
                    )
                )
                )
            )


        # -------------------------------------------------
        # GET STUDENT
        # -------------------------------------------------

        student_response = (
            supabase
            .table("students")
            .select("*")
            .eq("id", student_id)
            .single()
            .execute()
        )

        student = student_response.data

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )


        # -------------------------------------------------
        # GET OPPORTUNITY
        # -------------------------------------------------

        opportunity_response = (
            supabase
            .table("opportunities")
            .select("*")
            .eq("id", opportunity_id)
            .single()
            .execute()
        )

        opportunity = opportunity_response.data

        if not opportunity:
            raise HTTPException(
                status_code=404,
                detail="Opportunity not found"
            )


        now = datetime.now(
            timezone.utc
        ).isoformat()


        # -------------------------------------------------
        # CHECK EXISTING APPLICATION
        # -------------------------------------------------

        existing_response = (
            supabase
            .table("applications")
            .select("*")
            .eq(
                "student_id",
                student_id
            )
            .eq(
                "opportunity_id",
                opportunity_id
            )
            .limit(1)
            .execute()
        )

        existing = (
            existing_response.data[0]
            if existing_response.data
            else None
        )


        # -------------------------------------------------
        # IMPORTANT:
        # DO NOT CREATE APPLICATION FROM INDUSTRY PORTAL
        #
        # Candidate must have applied first.
        # -------------------------------------------------

        if not existing:
            raise HTTPException(
                status_code=404,
                detail=(
                    "Candidate has not applied "
                    "for this opportunity"
                )
            )


        payload = {
            "status": update.status,
            "recruitment_status": update.status,
            "interview_date": update.interview_date,
            "recruiter_notes": update.recruiter_notes,
            "company": opportunity.get("company"),
            "role": opportunity.get("role"),
            "updated_at": now,
        }


        if update.status == "Shortlisted":
            payload["shortlisted_at"] = now

        if update.status in {
            "Selected",
            "Rejected"
        }:
            payload["decision_at"] = now


        # -------------------------------------------------
        # UPDATE EXISTING APPLICATION ONLY
        # -------------------------------------------------

        response = (
            supabase
            .table("applications")
            .update(payload)
            .eq(
                "id",
                existing["id"]
            )
            .execute()
        )


        application = (
            response.data[0]
            if response.data
            else None
        )


        return {
            "status": "success",

            "message": (
                f"Candidate status updated to "
                f"{update.status}"
            ),

            "application": application,

            "student": {
                "id": student.get("id"),
                "name": student.get("name"),
                "email": student.get("email"),
            },

            "opportunity": {
                "id": opportunity.get("id"),
                "role": opportunity.get("role"),
                "company": opportunity.get("company"),
            },
        }


    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# GET RECRUITMENT STATUS
# =========================================================

@router.get(
    "/jobs/{opportunity_id}/candidates/{student_id}/status"
)
def get_recruitment_status(
        opportunity_id: int,
        student_id: str
):

    try:

        response = (
            supabase
            .table("applications")
            .select("*")
            .eq(
                "student_id",
                student_id
            )
            .eq(
                "opportunity_id",
                opportunity_id
            )
            .limit(1)
            .execute()
        )

        application = (
            response.data[0]
            if response.data
            else None
        )

        return {
            "status": "success",

            "application": application,

            "recruitment_status": (
                application.get(
                    "recruitment_status"
                )
                if application
                else "Not Applied"
            ),
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# INSTITUTION PLACEMENT ANALYTICS
# =========================================================

@router.get("/placement-analytics")
def placement_analytics():

    try:

        applications_response = (
            supabase
            .table("applications")
            .select(
                """
                id,
                student_id,
                opportunity_id,
                status,
                recruitment_status,
                company,
                role,
                applied_at,
                shortlisted_at,
                decision_at
                """
            )
            .execute()
        )

        applications = (
                applications_response.data
                or []
        )


        students_response = (
            supabase
            .table("students")
            .select(
                "id,name,college,degree,branch,graduation_year"
            )
            .execute()
        )

        students = students_response.data or []


        student_map = {
            student["id"]: student
            for student in students
        }


        total_applications = len(
            applications
        )

        shortlisted = sum(
            1
            for application in applications
            if application.get(
                "recruitment_status"
            ) == "Shortlisted"
        )

        interviews = sum(
            1
            for application in applications
            if application.get(
                "recruitment_status"
            ) == "Interview Scheduled"
        )

        selected = sum(
            1
            for application in applications
            if application.get(
                "recruitment_status"
            ) == "Selected"
        )

        rejected = sum(
            1
            for application in applications
            if application.get(
                "recruitment_status"
            ) == "Rejected"
        )


        placement_rate = (
            round(
                selected / total_applications * 100,
                2
            )
            if total_applications
            else 0
        )


        shortlist_rate = (
            round(
                shortlisted / total_applications * 100,
                2
            )
            if total_applications
            else 0
        )


        interview_rate = (
            round(
                interviews / total_applications * 100,
                2
            )
            if total_applications
            else 0
        )


        # -------------------------------------------------
        # SELECTED STUDENTS
        # -------------------------------------------------

        selected_students = []

        for application in applications:

            if application.get(
                    "recruitment_status"
            ) != "Selected":
                continue

            student = student_map.get(
                application.get("student_id"),
                {}
            )

            selected_students.append(
                {
                    "student": student,
                    "company": application.get(
                        "company"
                    ),
                    "role": application.get(
                        "role"
                    ),
                    "selected_at": application.get(
                        "decision_at"
                    ),
                }
            )


        # -------------------------------------------------
        # COMPANY BREAKDOWN
        # -------------------------------------------------

        company_stats = {}

        for application in applications:

            company = (
                    application.get("company")
                    or "Unknown"
            )

            if company not in company_stats:
                company_stats[company] = {
                    "company": company,
                    "applications": 0,
                    "shortlisted": 0,
                    "interviews": 0,
                    "selected": 0,
                    "rejected": 0,
                }

            stats = company_stats[company]

            stats["applications"] += 1

            status = application.get(
                "recruitment_status"
            )

            if status == "Shortlisted":
                stats["shortlisted"] += 1

            elif status == "Interview Scheduled":
                stats["interviews"] += 1

            elif status == "Selected":
                stats["selected"] += 1

            elif status == "Rejected":
                stats["rejected"] += 1


        return {
            "status": "success",

            "summary": {
                "total_applications":
                    total_applications,

                "shortlisted":
                    shortlisted,

                "interviews":
                    interviews,

                "selected":
                    selected,

                "rejected":
                    rejected,

                "shortlist_rate":
                    shortlist_rate,

                "interview_rate":
                    interview_rate,

                "placement_rate":
                    placement_rate,
            },

            "selected_students":
                selected_students,

            "company_breakdown":
                list(
                    company_stats.values()
                ),
        }


    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )