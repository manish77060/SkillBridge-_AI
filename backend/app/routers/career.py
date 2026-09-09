from fastapi import APIRouter, HTTPException
from app.config import supabase
from datetime import datetime, timezone

router = APIRouter(
    prefix="/api/career",
    tags=["Career Intelligence"]
)


# ============================================================
# GET ALL CAREER ROLES
# ============================================================

@router.get("/roles")
def get_career_roles():
    try:
        response = (
            supabase
            .table("career_roles")
            .select("*")
            .order("role_name")
            .execute()
        )

        return {
            "status": "success",
            "data": response.data or []
        }

    except Exception as e:
        print("Career roles error:", str(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ============================================================
# CAREER READINESS + SKILL GAP
# ============================================================

@router.get("/skill-gap/{student_id}/{role_name}")
def get_skill_gap(student_id: str, role_name: str):

    try:

        # ====================================================
        # 1. GET STUDENT
        # ====================================================

        student_response = (
            supabase
            .table("students")
            .select(
                "id,name,email,target_role,readiness_score"
            )
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


        # ====================================================
        # 2. GET CAREER ROLE
        # ====================================================

        role_response = (
            supabase
            .table("career_roles")
            .select("*")
            .ilike("role_name", role_name)
            .limit(1)
            .execute()
        )

        if not role_response.data:
            raise HTTPException(
                status_code=404,
                detail="Career role not found"
            )

        role = role_response.data[0]

        required_skills = role.get("required_skills") or []

        # Make sure required_skills is actually a list
        if not isinstance(required_skills, list):
            raise HTTPException(
                status_code=500,
                detail="Invalid required_skills format for career role"
            )


        # ====================================================
        # 3. GET STUDENT SKILLS
        #
        # IMPORTANT:
        #
        # student_skills contains permanent profile evidence:
        #
        # Resume
        # Projects
        # Certificates
        # Manual evidence
        #
        # Assessment scores are NOT used here.
        # ====================================================

        skills_response = (
            supabase
            .table("student_skills")
            .select(
                "id,proficiency,source,verified,"
                "skills(id,name,category)"
            )
            .eq("student_id", student_id)
            .execute()
        )

        student_skill_records = skills_response.data or []

        student_skills = {}

        for record in student_skill_records:

            # --------------------------------------------
            # Ignore assessment-generated skill records
            # --------------------------------------------

            if record.get("source") == "assessment":
                continue

            skill = record.get("skills")

            if not skill:
                continue

            skill_name = skill.get("name")

            if not skill_name:
                continue

            proficiency = float(
                record.get("proficiency") or 0
            )

            # --------------------------------------------
            # Keep strongest available evidence
            # --------------------------------------------

            if (
                    skill_name not in student_skills
                    or proficiency > student_skills[skill_name]
            ):
                student_skills[skill_name] = proficiency


        # ====================================================
        # 4. GET LATEST ASSESSMENT SCORES
        # ====================================================

        assessment_response = (
            supabase
            .table("assessments")
            .select(
                "id,score,total_score,created_at,"
                "skills(id,name)"
            )
            .eq("student_id", student_id)
            .order("created_at", desc=True)
            .execute()
        )

        assessment_records = assessment_response.data or []

        latest_assessments = {}

        for record in assessment_records:

            skill = record.get("skills")

            if not skill:
                continue

            skill_name = skill.get("name")

            if not skill_name:
                continue

            # --------------------------------------------
            # Keep latest assessment for each skill
            # --------------------------------------------

            if skill_name not in latest_assessments:

                latest_assessments[skill_name] = float(
                    record.get("score") or 0
                )


        # ====================================================
        # 5. CALCULATE OVERALL ASSESSMENT SCORE
        # ====================================================

        assessment_scores = list(
            latest_assessments.values()
        )

        if assessment_scores:

            assessment_score = round(
                sum(assessment_scores)
                / len(assessment_scores),
                2
            )

        else:

            assessment_score = 0.0


        # ====================================================
        # 6. COMPARE STUDENT SKILLS WITH ROLE REQUIREMENTS
        # ====================================================

        strong_skills = []

        skill_gaps = []

        weighted_required_total = 0.0

        weighted_achieved_total = 0.0


        for required in required_skills:

            if not isinstance(required, dict):
                continue


            # ------------------------------------------------
            # Support different possible field names
            # ------------------------------------------------

            skill_name = (
                    required.get("skill")
                    or required.get("name")
                    or required.get("skill_name")
            )

            if not skill_name:
                continue


            # ------------------------------------------------
            # Required skill level
            # ------------------------------------------------

            target_level = (
                required.get("required")
                if required.get("required") is not None
                else required.get("required_level")
            )

            if target_level is None:
                target_level = (
                    required.get("target_level")
                    if required.get("target_level") is not None
                    else required.get("level")
                )

            if target_level is None:
                target_level = 0


            target_level = float(target_level)


            # ------------------------------------------------
            # Skill importance
            # ------------------------------------------------

            importance = required.get("importance")

            if importance is None:
                importance = 1

            importance = float(importance)


            # ------------------------------------------------
            # Student's current skill level
            # ------------------------------------------------

            current_level = float(
                student_skills.get(
                    skill_name,
                    0
                )
            )


            # ------------------------------------------------
            # Calculate gap
            # ------------------------------------------------

            gap = max(
                target_level - current_level,
                0
            )


            # =================================================
            # WEIGHTED SKILL READINESS
            # =================================================

            weighted_required_total += (
                    target_level * importance
            )

            weighted_achieved_total += (
                    min(
                        current_level,
                        target_level
                    )
                    * importance
            )


            # =================================================
            # STRONG SKILL
            # =================================================

            if current_level >= target_level:

                strong_skills.append({
                    "skill": skill_name,
                    "current_level": round(
                        current_level,
                        2
                    ),
                    "required_level": round(
                        target_level,
                        2
                    ),
                    "status": "Strong"
                })


            # =================================================
            # SKILL GAP
            # =================================================

            else:

                if gap >= 30:
                    priority = "High"
                else:
                    priority = "Medium"

                skill_gaps.append({
                    "skill": skill_name,
                    "current_level": round(
                        current_level,
                        2
                    ),
                    "required_level": round(
                        target_level,
                        2
                    ),
                    "gap": round(
                        gap,
                        2
                    ),
                    "priority": priority,
                    "importance": importance
                })


        # ====================================================
        # 7. CALCULATE SKILL PROFILE SCORE
        # ====================================================

        if weighted_required_total > 0:

            skill_profile_score = (
                                          weighted_achieved_total
                                          / weighted_required_total
                                  ) * 100

        else:

            skill_profile_score = 0.0


        skill_profile_score = round(
            skill_profile_score,
            2
        )


        # ====================================================
        # 8. CALCULATE CAREER READINESS
        #
        # Skill Profile = 70%
        # Assessment   = 30%
        #
        # Assessment does NOT overwrite skill profile.
        # ====================================================

        readiness_score = round(
            (
                    skill_profile_score * 0.70
            )
            +
            (
                    assessment_score * 0.30
            ),
            2
        )


        # ====================================================
        # 9. DETERMINE READINESS LEVEL
        # ====================================================

        if readiness_score >= 80:

            readiness_level = "Industry Ready"

        elif readiness_score >= 65:

            readiness_level = "Nearly Ready"

        elif readiness_score >= 50:

            readiness_level = "Developing"

        else:

            readiness_level = "Needs Improvement"


        # ====================================================
        # 10. SORT SKILL GAPS
        #
        # Highest importance first
        # Then largest gap
        # ====================================================

        skill_gaps.sort(
            key=lambda item: (
                item["importance"],
                item["gap"]
            ),
            reverse=True
        )


        # ====================================================
        # 11. CREATE SUMMARY
        # ====================================================

        summary = {
            "target_role": role["role_name"],

            "readiness_score": readiness_score,

            "readiness_level": readiness_level,

            "assessment_score": assessment_score,

            "skill_profile_score": skill_profile_score,

            "strong_skills_count": len(
                strong_skills
            ),

            "skill_gaps_count": len(
                skill_gaps
            )
        }


        # ====================================================
        # 12. SAVE READINESS SCORE TO STUDENT
        # ====================================================

        supabase.table("students").update({

            "readiness_score": readiness_score,

            "updated_at": datetime.now(
                timezone.utc
            ).isoformat()

        }).eq(
            "id",
            student_id
        ).execute()


        # ====================================================
        # 13. RETURN FINAL CAREER INTELLIGENCE
        # ====================================================

        return {

            "status": "success",

            "student": {

                "id": student["id"],

                "name": student["name"],

                "target_role": student.get(
                    "target_role"
                )
            },

            "career": {

                "role_name": role["role_name"],

                "description": role.get(
                    "description"
                )
            },

            "readiness": {

                "score": readiness_score,

                "level": readiness_level,

                "skill_profile_score":
                    skill_profile_score,

                "assessment_score":
                    assessment_score,

                "weights": {

                    "skill_profile": 70,

                    "assessment": 30
                }
            },

            "strong_skills": strong_skills,

            "skill_gaps": skill_gaps,

            "summary": summary
        }


    # ========================================================
    # HANDLE EXPECTED HTTP ERRORS
    # ========================================================

    except HTTPException:
        raise


    # ========================================================
    # HANDLE UNEXPECTED ERRORS
    # ========================================================

    except Exception as e:

        print(
            "Career intelligence error:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )