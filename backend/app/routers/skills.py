from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.supabase_client import supabase
router = APIRouter(prefix="/api/skills", tags=["Skills"])


# -----------------------------
# Request Models
# -----------------------------

class SkillCreate(BaseModel):
    name: str
    category: Optional[str] = None


class StudentSkillCreate(BaseModel):
    student_id: str
    skill_id: int
    proficiency: float = 0
    source: Optional[str] = "manual"
    verified: bool = False


# -----------------------------
# Create Skill
# -----------------------------

@router.post("/")
def create_skill(skill: SkillCreate):
    try:
        response = (
            supabase
            .table("skills")
            .insert(skill.model_dump())
            .execute()
        )

        return {
            "status": "success",
            "message": "Skill created successfully",
            "data": response.data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# -----------------------------
# Get All Skills
# -----------------------------

@router.get("/")
def get_skills():
    try:
        response = (
            supabase
            .table("skills")
            .select("*")
            .order("name")
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


# -----------------------------
# Add Skill To Student
# -----------------------------

@router.post("/student")
def add_student_skill(student_skill: StudentSkillCreate):
    try:
        response = (
            supabase
            .table("student_skills")
            .insert(student_skill.model_dump())
            .execute()
        )

        return {
            "status": "success",
            "message": "Skill added to student successfully",
            "data": response.data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# -----------------------------
# Get Student Skills
# -----------------------------

@router.get("/student/{student_id}")
def get_student_skills(student_id: str):
    try:
        response = (
            supabase
            .table("student_skills")
            .select(
                "id, proficiency, source, verified, skills(id, name, category)"
            )
            .eq("student_id", student_id)
            .execute()
        )

        return {
            "status": "success",
            "student_id": student_id,
            "data": response.data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )