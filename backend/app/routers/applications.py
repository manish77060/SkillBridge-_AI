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
        # -------------------------------------------------
        # Check student
        # -------------------------------------------------

        student_response = (
            supabase
            .table("students")
            .select("*")
            .eq("id", application.student_id)
            .execute()
        )

        student = student_response.data[0] if student_response.data else None

        # -------------------------------------------------
        # Check opportunity
        # -------------------------------------------------

        opp_id = application.opportunity_id
        opportunity_response = (
            supabase
            .table("opportunities")
            .select("*")
            .eq("id", int(opp_id) if str(opp_id).isdigit() else opp_id)
            .execute()
        )

        opportunity = opportunity_response.data[0] if opportunity_response.data else None

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

        payload = {
            "student_id": application.student_id,
            "opportunity_id": application.opportunity_id,
            "status": "Applied",
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

        if created:
            created["role"] = opportunity.get("role") or opportunity.get("title") or "Opportunity"
            created["company"] = opportunity.get("company") or "Company"
            created["recruitment_status"] = "Applied"

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

        student = None
        try:
            student_response = (
                supabase
                .table("students")
                .select("*")
                .eq("id", student_id)
                .execute()
            )
            if student_response.data:
                student = student_response.data[0]
        except Exception as e:
            print("Student query error in get_student_applications:", e)

        if not student:
            try:
                user_response = (
                    supabase
                    .table("portal_users")
                    .select("*")
                    .eq("id", student_id)
                    .execute()
                )
                if user_response.data:
                    u = user_response.data[0]
                    student = {
                        "id": u.get("id"),
                        "name": u.get("name") or u.get("full_name") or "Student",
                        "email": u.get("email"),
                    }
            except Exception as e:
                print("Portal users query error in get_student_applications:", e)

        if not student:
            student = {
                "id": student_id,
                "name": "Student",
                "email": "",
            }

        # -------------------------------------------------
        # Get applications
        # -------------------------------------------------

        applications_response = (
            supabase
            .table("applications")
            .select("*")
            .eq("student_id", student_id)
            .order("created_at", desc=True)
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
            str(opportunity["id"]): opportunity
            for opportunity in opportunities
        }


        # -------------------------------------------------
        # Build result
        # -------------------------------------------------

        result = []

        for application in applications:

            opp_key = str(application.get("opportunity_id"))
            opportunity = opportunity_map.get(
                opp_key,
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

            role_title = (
                application.get("role")
                or opportunity.get("role")
                or opportunity.get("title")
                or "Opportunity"
            )

            company_name = (
                application.get("company")
                or opportunity.get("company")
                or "Company"
            )

            created_time = (
                application.get("applied_at")
                or application.get("created_at")
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

                    "role": role_title,

                    "company": company_name,

                    "location":
                        opportunity.get(
                            "location"
                        ) or "Remote",

                    "type":
                        opportunity.get(
                            "type"
                        ) or "Internship",

                    "description":
                        opportunity.get(
                            "description"
                        ) or "",

                    "stipend":
                        opportunity.get(
                            "stipend"
                        ) or "₹25,000 / month",

                    "duration":
                        opportunity.get(
                            "duration"
                        ) or "3 Months",

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

                    "applied_at": created_time,

                    "updated_at": created_time,

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
        application_id: str
):

    try:

        response = (
            supabase
            .table("applications")
            .select("*")
            .eq("id", int(application_id) if application_id.isdigit() else application_id)
            .execute()
        )

        application = response.data[0] if response.data else None

        if not application:

            raise HTTPException(
                status_code=404,
                detail="Application not found"
            )


        opportunity_id = application.get("opportunity_id")
        opportunity_response = (
            supabase
            .table("opportunities")
            .select("*")
            .eq("id", int(opportunity_id) if str(opportunity_id).isdigit() else opportunity_id)
            .execute()
        )

        opportunity = (
                opportunity_response.data[0]
                if opportunity_response.data
                else {}
        )


        role_title = (
            application.get("role")
            or opportunity.get("role")
            or opportunity.get("title")
            or "Opportunity"
        )
        company_name = (
            application.get("company")
            or opportunity.get("company")
            or "Company"
        )

        return {
            "status": "success",

            "application": {
                **application,

                "role": role_title,

                "company": company_name,

                "location":
                    opportunity.get("location") or "Remote",

                "stipend":
                    opportunity.get("stipend") or "₹25,000 / month",

                "duration":
                    opportunity.get("duration") or "3 Months",
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
        application_id: str,
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

        app_id_val = int(application_id) if application_id.isdigit() else application_id

        application_response = (
            supabase
            .table("applications")
            .select("*")
            .eq("id", app_id_val)
            .execute()
        )

        application = application_response.data[0] if application_response.data else None

        if not application:
            raise HTTPException(
                status_code=404,
                detail="Application not found"
            )

        # -------------------------------------------------
        # Update application status
        # -------------------------------------------------

        update_data = {
            "status": new_status,
        }

        updated_response = (
            supabase
            .table("applications")
            .update(update_data)
            .eq("id", app_id_val)
            .execute()
        )

        updated_application = (
            updated_response.data[0]
            if updated_response.data
            else application
        )
        updated_application["recruitment_status"] = new_status

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
