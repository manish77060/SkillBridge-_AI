from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.config import supabase


router = APIRouter(
    prefix="/api/learning",
    tags=["Learning"]
)


# --------------------------------------------------
# REQUEST MODEL
# --------------------------------------------------

class LearningCompleteRequest(BaseModel):
    student_id: str
    skill: str
    completed: bool = True
    improved_proficiency: float


# --------------------------------------------------
# COMPLETE LEARNING MODULE
# --------------------------------------------------

@router.post("/complete")
def complete_learning_module(
        request: LearningCompleteRequest
):
    try:

        # ------------------------------------------
        # VALIDATE PROFICIENCY
        # ------------------------------------------

        if request.improved_proficiency < 0:
            raise HTTPException(
                status_code=400,
                detail="Proficiency cannot be below 0."
            )

        if request.improved_proficiency > 100:
            raise HTTPException(
                status_code=400,
                detail="Proficiency cannot exceed 100."
            )

        skill_name = request.skill.strip()

        if not skill_name:
            raise HTTPException(
                status_code=400,
                detail="Skill name is required."
            )

        # ------------------------------------------
        # CHECK STUDENT
        # ------------------------------------------

        student_response = (
            supabase
            .table("students")
            .select("id,name")
            .eq("id", request.student_id)
            .single()
            .execute()
        )

        student = student_response.data

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student not found."
            )

        # ------------------------------------------
        # FIND SKILL
        # ------------------------------------------

        skills_response = (
            supabase
            .table("skills")
            .select("id,name,category")
            .execute()
        )

        skills = skills_response.data or []

        target_skill = None

        for skill in skills:
            if (
                    str(skill.get("name", "")).strip().lower()
                    == skill_name.lower()
            ):
                target_skill = skill
                break

        if not target_skill:
            raise HTTPException(
                status_code=404,
                detail=f"Skill '{skill_name}' not found."
            )

        skill_id = target_skill["id"]

        # ------------------------------------------
        # FIND STUDENT SKILL RECORD
        # ------------------------------------------

        student_skill_response = (
            supabase
            .table("student_skills")
            .select("*")
            .eq("student_id", request.student_id)
            .eq("skill_id", skill_id)
            .execute()
        )

        student_skill_records = (
                student_skill_response.data or []
        )

        # ------------------------------------------
        # CALCULATE NEW PROFICIENCY
        # ------------------------------------------

        if student_skill_records:

            existing_record = student_skill_records[0]

            current_proficiency = float(
                existing_record.get("proficiency") or 0
            )

            # Never reduce an existing skill level.
            new_proficiency = max(
                current_proficiency,
                float(request.improved_proficiency)
            )

            update_data = {
                "proficiency": round(
                    new_proficiency,
                    2
                )
            }

            updated_response = (
                supabase
                .table("student_skills")
                .update(update_data)
                .eq(
                    "student_id",
                    request.student_id
                )
                .eq(
                    "skill_id",
                    skill_id
                )
                .execute()
            )

            updated_record = (
                updated_response.data[0]
                if updated_response.data
                else None
            )

            return {
                "status": "success",
                "message": "Learning completion saved.",
                "student": {
                    "id": student["id"],
                    "name": student["name"]
                },
                "skill": {
                    "id": target_skill["id"],
                    "name": target_skill["name"],
                    "category": target_skill.get("category"),
                    "previous_proficiency":
                        current_proficiency,
                    "new_proficiency":
                        new_proficiency,
                    "improved": (
                            new_proficiency
                            > current_proficiency
                    )
                },
                "completed": request.completed,
                "student_skill": updated_record
            }

        # ------------------------------------------
        # CREATE RECORD IF STUDENT DOES NOT
        # HAVE THE SKILL YET
        # ------------------------------------------

        insert_data = {
            "student_id": request.student_id,
            "skill_id": skill_id,
            "proficiency": round(
                float(request.improved_proficiency),
                2
            ),
            "source": "learning",
            "verified": False
        }

        inserted_response = (
            supabase
            .table("student_skills")
            .insert(insert_data)
            .execute()
        )

        inserted_record = (
            inserted_response.data[0]
            if inserted_response.data
            else None
        )

        return {
            "status": "success",
            "message": "Learning completion saved and skill profile created.",
            "student": {
                "id": student["id"],
                "name": student["name"]
            },
            "skill": {
                "id": target_skill["id"],
                "name": target_skill["name"],
                "category": target_skill.get("category"),
                "previous_proficiency": 0,
                "new_proficiency":
                    float(request.improved_proficiency),
                "improved": True
            },
            "completed": request.completed,
            "student_skill": inserted_record
        }

    except HTTPException:
        raise

    except Exception as e:
        print(
            "Learning completion error:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )