from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone

from app.config import supabase


router = APIRouter(
    prefix="/api/applications",
    tags=["Applications"]
)


# =========================================================
# CREATE APPLICATION
# =========================================================

class ApplicationCreate(BaseModel):
    student_id: str
    opportunity_id: int


@router.post("")
def create_application(application: ApplicationCreate):

    try:

        # -------------------------------------------------
        # Check student
        # -------------------------------------------------

        student_response = (
            supabase
            .table("students")
            .select("*")
            .eq("id", application.student_id)
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
        # Check opportunity
        # -------------------------------------------------

        opportunity_response = (
            supabase
            .table("opportunities")
            .select("*")
            .eq("id", application.opportunity_id)
            .single()
            .execute()
        )

        opportunity = opportunity_response.data

        if not opportunity:
            raise HTTPException(
                status_code=404,
                detail="Opportunity not found"
            )


        # -------------------------------------------------
        # Check duplicate
        # -------------------------------------------------

        existing_response = (
            supabase
            .table("applications")
            .select("id")
            .eq("student_id", application.student_id)
            .eq(
                "opportunity_id",
                application.opportunity_id
            )
            .limit(1)
            .execute()
        )

        if existing_response.data:

            return {
                "success": False,
                "message": "You have already applied for this opportunity."
            }


        # -------------------------------------------------
        # Create
        # -------------------------------------------------

        now = datetime.now(
            timezone.utc
        ).isoformat()

        payload = {
            "student_id": application.student_id,
            "opportunity_id": application.opportunity_id,
            "status": "Under Review",
            "recruitment_status": "Applied",
            "company": opportunity.get("company"),
            "role": opportunity.get("role"),
            "applied_at": now,
            "updated_at": now,
        }

        response = (
            supabase
            .table("applications")
            .insert(payload)
            .execute()
        )

        created = (
            response.data[0]
            if response.data
            else None
        )

        return {
            "success": True,
            "message": "Application submitted successfully!",
            "application": created
        }


    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# GET ALL APPLICATIONS FOR A STUDENT
# =========================================================

@router.get("/student/{student_id}")
def get_student_applications(
        student_id: str
):

    try:

        # -------------------------------------------------
        # Get student
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
        # Get applications
        # -------------------------------------------------

        applications_response = (
            supabase
            .table("applications")
            .select("*")
            .eq("student_id", student_id)
            .order("applied_at", desc=True)
            .execute()
        )

        applications = (
                applications_response.data
                or []
        )


        # -------------------------------------------------
        # Get opportunities
        # -------------------------------------------------

        opportunities_response = (
            supabase
            .table("opportunities")
            .select("*")
            .execute()
        )

        opportunities = (
                opportunities_response.data
                or []
        )


        opportunity_map = {
            opportunity["id"]: opportunity
            for opportunity in opportunities
        }


        # -------------------------------------------------
        # Build result
        # -------------------------------------------------

        result = []

        for application in applications:

            opportunity = opportunity_map.get(
                application.get("opportunity_id"),
                {}
            )

            recruitment_status = (
                    application.get(
                        "recruitment_status"
                    )
                    or application.get(
                "status"
            )
                    or "Applied"
            )


            result.append(
                {
                    "id": application.get("id"),

                    "application_id":
                        application.get("id"),

                    "student_id":
                        application.get(
                            "student_id"
                        ),

                    "opportunity_id":
                        application.get(
                            "opportunity_id"
                        ),

                    "role":
                        application.get("role")
                        or opportunity.get("role"),

                    "company":
                        application.get("company")
                        or opportunity.get("company"),

                    "location":
                        opportunity.get(
                            "location"
                        ),

                    "type":
                        opportunity.get(
                            "type"
                        ),

                    "description":
                        opportunity.get(
                            "description"
                        ),

                    "stipend":
                        opportunity.get(
                            "stipend"
                        ),

                    "duration":
                        opportunity.get(
                            "duration"
                        ),

                    "deadline":
                        opportunity.get(
                            "deadline"
                        ),

                    "required_skills":
                        opportunity.get(
                            "required_skills"
                        )
                        or [],

                    "status":
                        recruitment_status,

                    "recruitment_status":
                        recruitment_status,

                    "applied_at":
                        application.get(
                            "applied_at"
                        ),

                    "updated_at":
                        application.get(
                            "updated_at"
                        ),

                    "interview_date":
                        application.get(
                            "interview_date"
                        ),

                    "recruiter_notes":
                        application.get(
                            "recruiter_notes"
                        ),

                    "shortlisted_at":
                        application.get(
                            "shortlisted_at"
                        ),

                    "decision_at":
                        application.get(
                            "decision_at"
                        ),
                }
            )


        return {
            "status": "success",

            "student": {
                "id": student.get("id"),
                "name": student.get("name"),
                "email": student.get("email"),
            },

            "total": len(result),

            "applications": result
        }


    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

# =========================================================
# RESET DEMO APPLICATIONS
# =========================================================

@router.delete("/student/{student_id}/reset")
def reset_student_applications(student_id: str):

    try:

        # -------------------------------------------------
        # Check student
        # -------------------------------------------------

        student_response = (
            supabase
            .table("students")
            .select("id")
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
        # Delete all applications for this student
        # -------------------------------------------------

        response = (
            supabase
            .table("applications")
            .delete()
            .eq("student_id", student_id)
            .execute()
        )

        deleted_applications = response.data or []

        return {
            "success": True,
            "message": "All demo applications have been reset.",
            "deleted_count": len(deleted_applications)
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# GET SINGLE APPLICATION
# =========================================================

@router.get("/{application_id}")
def get_application(
        application_id: int
):

    try:

        response = (
            supabase
            .table("applications")
            .select("*")
            .eq("id", application_id)
            .single()
            .execute()
        )

        application = response.data

        if not application:

            raise HTTPException(
                status_code=404,
                detail="Application not found"
            )


        opportunity_response = (
            supabase
            .table("opportunities")
            .select("*")
            .eq(
                "id",
                application.get(
                    "opportunity_id"
                )
            )
            .single()
            .execute()
        )

        opportunity = (
                opportunity_response.data
                or {}
        )


        return {
            "status": "success",

            "application": {
                **application,

                "role":
                    application.get("role")
                    or opportunity.get("role"),

                "company":
                    application.get("company")
                    or opportunity.get("company"),

                "location":
                    opportunity.get("location"),

                "stipend":
                    opportunity.get("stipend"),

                "duration":
                    opportunity.get("duration"),
            }
        }


    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
# =========================================================
# UPDATE APPLICATION RECRUITMENT STATUS
# =========================================================

class ApplicationStatusUpdate(BaseModel):
    recruitment_status: str
    interview_date: Optional[str] = None
    recruiter_notes: Optional[str] = None


@router.patch("/{application_id}/status")
def update_application_status(
        application_id: int,
        request: ApplicationStatusUpdate
):

    try:

        # -------------------------------------------------
        # Allowed recruitment statuses
        # -------------------------------------------------

        allowed_statuses = {
            "Applied",
            "Shortlisted",
            "Interview",
            "Selected",
            "Rejected"
        }

        new_status = request.recruitment_status.strip()

        if new_status not in allowed_statuses:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Invalid recruitment status. "
                    "Allowed values: Applied, Shortlisted, "
                    "Interview, Selected, Rejected."
                )
            )

        # -------------------------------------------------
        # Check application
        # -------------------------------------------------

        application_response = (
            supabase
            .table("applications")
            .select("*")
            .eq("id", application_id)
            .single()
            .execute()
        )

        application = application_response.data

        if not application:
            raise HTTPException(
                status_code=404,
                detail="Application not found"
            )

        # -------------------------------------------------
        # Build update data
        # -------------------------------------------------

        now = datetime.now(
            timezone.utc
        ).isoformat()

        update_data = {
            "status": new_status,
            "recruitment_status": new_status,
            "updated_at": now
        }

        # -------------------------------------------------
        # Shortlisted timestamp
        # -------------------------------------------------

        if new_status == "Shortlisted":

            update_data["shortlisted_at"] = now

        # -------------------------------------------------
        # Interview date
        # -------------------------------------------------

        if request.interview_date:

            update_data["interview_date"] = (
                request.interview_date
            )

        # -------------------------------------------------
        # Recruiter notes
        # -------------------------------------------------

        if request.recruiter_notes is not None:

            update_data["recruiter_notes"] = (
                request.recruiter_notes
            )

        # -------------------------------------------------
        # Final decision timestamp
        # -------------------------------------------------

        if new_status in {
            "Selected",
            "Rejected"
        }:

            update_data["decision_at"] = now

        # -------------------------------------------------
        # Update application
        # -------------------------------------------------

        updated_response = (
            supabase
            .table("applications")
            .update(update_data)
            .eq("id", application_id)
            .execute()
        )

        updated_application = (
            updated_response.data[0]
            if updated_response.data
            else None
        )

        return {
            "success": True,
            "message": (
                f"Application status updated to "
                f"{new_status}."
            ),
            "application": updated_application
        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            "Application status update error:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
