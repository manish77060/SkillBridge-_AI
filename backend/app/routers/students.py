from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any

from app.supabase_client import supabase
from app.routers.admin import verify_user_token

router = APIRouter(
    prefix="/api/students",
    tags=["Students"]
)


# -----------------------------------------
# REQUEST MODELS
# -----------------------------------------

class StudentCreate(BaseModel):
    name: str
    email: str
    college: Optional[str] = None
    degree: Optional[str] = None
    branch: Optional[str] = None
    graduation_year: Optional[int] = None
    location: Optional[str] = None
    target_role: Optional[str] = None


class StudentUpdate(BaseModel):
    name: Optional[str] = None
    full_name: Optional[str] = None
    email: Optional[str] = None
    college: Optional[str] = None
    university: Optional[str] = None
    degree: Optional[str] = None
    branch: Optional[str] = None
    graduation_year: Optional[int] = None
    location: Optional[str] = None
    target_role: Optional[str] = None
    phone: Optional[str] = None
    readiness_score: Optional[float] = None
    resume_url: Optional[str] = None


class StudentSync(BaseModel):
    id: Optional[str] = None
    name: str
    email: str
    college: Optional[str] = None
    branch: Optional[str] = None
    target_role: Optional[str] = None
    location: Optional[str] = None


# -----------------------------------------
# CREATE STUDENT
# -----------------------------------------

@router.post("/")
def create_student(student: StudentCreate):
    try:
        data = student.model_dump()
        if "name" in data and not data.get("full_name"):
            data["full_name"] = data["name"]

        response = (
            supabase
            .table("students")
            .insert(data)
            .execute()
        )

        return {
            "status": "success",
            "message": "Student created successfully",
            "data": response.data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# -----------------------------------------
# GET ALL STUDENTS
# -----------------------------------------

@router.get("/")
def get_students():
    try:
        response = (
            supabase
            .table("students")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )

        return {
            "status": "success",
            "data": response.data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# -----------------------------------------
# SYNC STUDENT (LOGIN / REGISTRATION PERSISTENCE)
# -----------------------------------------

@router.post("/sync")
def sync_student(sync_req: StudentSync, user: Dict[str, Any] = Depends(verify_user_token)):
    try:
        if user.get("portal") != "student":
            raise HTTPException(status_code=403, detail="Only student accounts can sync student profiles")

        student_id = user["sub"]
        if sync_req.id and sync_req.id != student_id:
            raise HTTPException(status_code=403, detail="You can only sync your own profile")
        payload: Dict[str, Any] = {
            "name": sync_req.name,
            "full_name": sync_req.name,
            "email": sync_req.email,
        }
        if sync_req.college:
            payload["college"] = sync_req.college
            payload["university"] = sync_req.college
        if sync_req.branch:
            payload["branch"] = sync_req.branch
        if sync_req.target_role:
            payload["target_role"] = sync_req.target_role
        if sync_req.location:
            payload["location"] = sync_req.location

        # Check if record exists
        existing = (
            supabase
            .table("students")
            .select("id")
            .eq("id", student_id)
            .execute()
        )

        if existing.data:
            response = (
                supabase
                .table("students")
                .update(payload)
                .eq("id", student_id)
                .execute()
            )
        else:
            payload["id"] = student_id
            response = (
                supabase
                .table("students")
                .insert(payload)
                .execute()
            )

        return {
            "status": "success",
            "message": "Student synchronized successfully",
            "data": response.data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# -----------------------------------------
# GET SINGLE STUDENT BY ID
# -----------------------------------------

@router.get("/{student_id}")
def get_student(student_id: str):
    try:
        response = (
            supabase
            .table("students")
            .select("*")
            .eq("id", student_id)
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

        return {
            "status": "success",
            "data": response.data[0]
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# -----------------------------------------
# UPDATE STUDENT BY ID
# -----------------------------------------

@router.put("/{student_id}")
def update_student(student_id: str, student: StudentUpdate):
    try:
        update_data = {
            k: v for k, v in student.model_dump().items() if v is not None
        }

        if "name" in update_data and not update_data.get("full_name"):
            update_data["full_name"] = update_data["name"]

        if not update_data:
            return {
                "status": "noop",
                "message": "No fields to update"
            }

        response = (
            supabase
            .table("students")
            .update(update_data)
            .eq("id", student_id)
            .execute()
        )

        return {
            "status": "success",
            "message": "Student updated successfully",
            "data": response.data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
