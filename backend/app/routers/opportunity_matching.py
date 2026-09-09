from fastapi import APIRouter, HTTPException

from app.config import supabase


router = APIRouter(
    prefix="/api/opportunity-matching",
    tags=["Opportunity Matching"],
)


# ============================================================
# HELPERS
# ============================================================

def normalize_skill(value):
    """
    Convert a skill into a consistent comparison format.
    Example:
        "Python" -> "python"
        " FastAPI " -> "fastapi"
    """
    if value is None:
        return ""

    return str(value).strip().lower()


def get_skill_score(student_skill):
    """
    Extract proficiency from the student_skills record.

    Different versions of the database may use different
    column names, so we support the common possibilities.
    """

    possible_fields = [
        "proficiency",
        "score",
        "skill_level",
        "level",
        "percentage",
        "rating",
    ]

    for field in possible_fields:
        value = student_skill.get(field)

        if value is not None:
            try:
                return max(0, min(100, float(value)))
            except (TypeError, ValueError):
                pass

    return 0


def normalize_required_skills(raw_skills):
    """
    Normalize opportunity required_skills.

    Supports:
        ["Python", "FastAPI", "SQL"]

    and also:
        "Python, FastAPI, SQL"
    """

    if not raw_skills:
        return []

    if isinstance(raw_skills, list):
        return [
            str(skill).strip()
            for skill in raw_skills
            if str(skill).strip()
        ]

    if isinstance(raw_skills, str):
        return [
            skill.strip()
            for skill in raw_skills.split(",")
            if skill.strip()
        ]

    return []


# ============================================================
# OPPORTUNITY MATCHING
# ============================================================

@router.get("/{student_id}")
def get_opportunity_matches(student_id: str):
    """
    Calculate opportunity match percentages using the
    student's current assessed skill proficiency.

    Match formula:

        Sum of current skill scores
        ----------------------------
        Number of required skills

    Missing skills receive 0%.

    Example:

        Opportunity requires:
        Python, FastAPI, SQL, Git

        Student:
        Python = 50
        FastAPI = 50
        SQL = 50
        Git = 100

        Match =
        (50 + 50 + 50 + 100) / 4
        = 62.5%
    """

    try:

        # ====================================================
        # 1. CHECK STUDENT
        # ====================================================

        student_response = (
            supabase
            .table("students")
            .select("id, name")
            .eq("id", student_id)
            .single()
            .execute()
        )

        student = student_response.data

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student not found",
            )

        # ====================================================
        # 2. GET STUDENT SKILLS
        # ====================================================

        student_skills_response = (
            supabase
            .table("student_skills")
            .select("*")
            .eq("student_id", student_id)
            .execute()
        )

        student_skill_records = (
                student_skills_response.data or []
        )

        # ====================================================
        # 3. GET SKILL MASTER DATA
        # ====================================================

        skills_response = (
            supabase
            .table("skills")
            .select("*")
            .execute()
        )

        skill_records = skills_response.data or []

        skill_id_to_name = {}

        for skill in skill_records:
            skill_id = skill.get("id")

            skill_name = (
                    skill.get("name")
                    or skill.get("skill_name")
                    or skill.get("title")
            )

            if skill_id is not None and skill_name:
                skill_id_to_name[str(skill_id)] = skill_name

        # ====================================================
        # 4. BUILD STUDENT SKILL MAP
        # ====================================================

        student_skill_map = {}

        for record in student_skill_records:

            skill_name = (
                    record.get("skill")
                    or record.get("skill_name")
                    or record.get("name")
            )

            # If only skill_id exists, resolve it.
            if not skill_name:

                skill_id = record.get("skill_id")

                if skill_id is not None:
                    skill_name = skill_id_to_name.get(
                        str(skill_id)
                    )

            if not skill_name:
                continue

            normalized_name = normalize_skill(skill_name)

            student_skill_map[normalized_name] = (
                get_skill_score(record)
            )

        # ====================================================
        # 5. GET OPPORTUNITIES
        # ====================================================

        opportunities_response = (
            supabase
            .table("opportunities")
            .select("*")
            .execute()
        )

        opportunities = (
                opportunities_response.data or []
        )

        # ====================================================
        # 6. CALCULATE MATCH FOR EACH OPPORTUNITY
        # ====================================================

        matched_opportunities = []

        for opportunity in opportunities:

            raw_required_skills = (
                    opportunity.get("required_skills")
                    or opportunity.get("skills")
                    or []
            )

            required_skills = normalize_required_skills(
                raw_required_skills
            )

            if not required_skills:

                match_score = 0

                matched_skills = []

                partial_skills = []

                missing_skills = []

            else:

                skill_scores = []

                matched_skills = []

                partial_skills = []

                missing_skills = []

                for required_skill in required_skills:

                    normalized_required = normalize_skill(
                        required_skill
                    )

                    current_score = student_skill_map.get(
                        normalized_required,
                        0,
                    )

                    skill_scores.append(current_score)

                    if current_score >= 70:

                        matched_skills.append({
                            "skill": required_skill,
                            "score": round(
                                current_score
                            ),
                            "status": "Strong",
                        })

                    elif current_score > 0:

                        partial_skills.append({
                            "skill": required_skill,
                            "score": round(
                                current_score
                            ),
                            "status": "Developing",
                        })

                    else:

                        missing_skills.append(
                            required_skill
                        )

                match_score = round(
                    sum(skill_scores)
                    / len(skill_scores)
                )

            # =================================================
            # MATCH CATEGORY
            # =================================================

            if match_score >= 80:

                match_category = "Excellent Match"

            elif match_score >= 65:

                match_category = "Strong Match"

            elif match_score >= 50:

                match_category = "Potential Match"

            else:

                match_category = "Needs Improvement"

            # =================================================
            # MATCHED OPPORTUNITY OBJECT
            # =================================================

            matched_opportunities.append({

                "opportunity_id": opportunity.get(
                    "id"
                ),

                "role": (
                        opportunity.get("role")
                        or opportunity.get("title")
                        or opportunity.get("position")
                        or "Opportunity"
                ),

                "company": opportunity.get(
                    "company"
                ),

                "location": opportunity.get(
                    "location"
                ),

                "type": (
                        opportunity.get("type")
                        or opportunity.get(
                    "opportunity_type"
                )
                ),

                "description": opportunity.get(
                    "description"
                ),

                "stipend": opportunity.get(
                    "stipend"
                ),

                "duration": opportunity.get(
                    "duration"
                ),

                "deadline": opportunity.get(
                    "deadline"
                ),

                "required_skills": required_skills,

                "match_score": match_score,

                "match_category": match_category,

                "matched_skills": matched_skills,

                "partial_skills": partial_skills,

                "missing_skills": missing_skills,

            })

        # ====================================================
        # 7. RANK OPPORTUNITIES
        # ====================================================

        matched_opportunities.sort(
            key=lambda opportunity: opportunity[
                "match_score"
            ],
            reverse=True,
        )

        # ====================================================
        # 8. SUMMARY
        # ====================================================

        total_opportunities = len(
            matched_opportunities
        )

        excellent_matches = len([
            opportunity
            for opportunity in matched_opportunities
            if opportunity["match_score"] >= 80
        ])

        strong_matches = len([
            opportunity
            for opportunity in matched_opportunities
            if (
                    opportunity["match_score"] >= 65
                    and opportunity["match_score"] < 80
            )
        ])

        potential_matches = len([
            opportunity
            for opportunity in matched_opportunities
            if (
                    opportunity["match_score"] >= 50
                    and opportunity["match_score"] < 65
            )
        ])

        return {

            "success": True,

            "student": {
                "id": student.get("id"),
                "name": student.get("name"),
            },

            "summary": {

                "total_opportunities":
                    total_opportunities,

                "excellent_matches":
                    excellent_matches,

                "strong_matches":
                    strong_matches,

                "potential_matches":
                    potential_matches,

            },

            "opportunities":
                matched_opportunities,

        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )