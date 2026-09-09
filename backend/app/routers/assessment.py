from app.config import supabase

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/assessments",
    tags=["Assessments"]
)


# =========================================================
# REQUEST MODEL
# =========================================================

class AssessmentCreate(BaseModel):
    student_id: str
    skill_id: int
    score: float = Field(..., ge=0)
    total_score: float = Field(default=100, gt=0)


# =========================================================
# CREATE ASSESSMENT
# =========================================================
#
# POST
# /api/assessments/
#
# This fixes:
# 405 Method Not Allowed
#
# =========================================================

@router.post("/")
def create_assessment(payload: AssessmentCreate):

    try:

        assessment_data = {
            "student_id": payload.student_id,
            "skill_id": payload.skill_id,
            "score": payload.score,
            "total_score": payload.total_score,
        }

        response = (
            supabase
            .table("assessments")
            .insert(assessment_data)
            .execute()
        )

        return {
            "status": "success",
            "message": "Assessment saved successfully",
            "data": response.data,
        }

    except Exception as exc:

        print("Assessment insert error:", exc)

        raise HTTPException(
            status_code=500,
            detail=f"Failed to save assessment: {str(exc)}"
        )


# =========================================================
# GET ALL ASSESSMENTS
# =========================================================
#
# GET
# /api/assessments/
#
# =========================================================

@router.get("/")
def get_assessments():

    try:

        response = (
            supabase
            .table("assessments")
            .select("*")
            .execute()
        )

        return {
            "status": "success",
            "data": response.data,
        }

    except Exception as exc:

        print("Assessment fetch error:", exc)

        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch assessments: {str(exc)}"
        )


# =========================================================
# GET ASSESSMENTS FOR A STUDENT
# =========================================================
#
# GET
# /api/assessments/student/{student_id}
#
# =========================================================

@router.get("/student/{student_id}")
def get_student_assessments(student_id: str):

    try:

        response = (
            supabase
            .table("assessments")
            .select("*")
            .eq("student_id", student_id)
            .execute()
        )

        return {
            "status": "success",
            "data": response.data,
        }

    except Exception as exc:

        print("Student assessment fetch error:", exc)

        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch student assessments: {str(exc)}"
        )


# =========================================================
# GET SINGLE ASSESSMENT
# =========================================================
#
# GET
# /api/assessments/{assessment_id}
#
# =========================================================

@router.get("/{assessment_id}")
def get_assessment(assessment_id: int):

    try:

        response = (
            supabase
            .table("assessments")
            .select("*")
            .eq("id", assessment_id)
            .maybe_single()
            .execute()
        )

        if not response.data:

            raise HTTPException(
                status_code=404,
                detail="Assessment not found"
            )

        return {
            "status": "success",
            "data": response.data,
        }

    except HTTPException:
        raise

    except Exception as exc:

        print("Assessment fetch error:", exc)

        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch assessment: {str(exc)}"
        )


# =========================================================
# DELETE ASSESSMENT
# =========================================================
#
# DELETE
# /api/assessments/{assessment_id}
#
# =========================================================

@router.delete("/{assessment_id}")
def delete_assessment(assessment_id: int):

    try:

        response = (
            supabase
            .table("assessments")
            .delete()
            .eq("id", assessment_id)
            .execute()
        )

        return {
            "status": "success",
            "message": "Assessment deleted successfully",
            "data": response.data,
        }

    except Exception as exc:

        print("Assessment delete error:", exc)

        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete assessment: {str(exc)}"
        )