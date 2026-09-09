from fastapi import APIRouter, HTTPException
from app.config import supabase

router = APIRouter(
    prefix="/api/opportunities",
    tags=["Opportunities"]
)


# --------------------------------------------------
# HELPERS
# --------------------------------------------------

def normalize_skill(skill):
    return str(skill or "").strip().lower()


def calculate_match(student_skills, required_skills):
    """
    Proficiency-aware opportunity matching.

    Matching is based on how closely the student's
    current proficiency matches the proficiency
    required by the opportunity.

    Example:

        Student Python = 50
        Required Python = 80

        Contribution = 50 / 80 = 62.5%

    A skill above the required level is capped at 100%.

    Final score:
        Sum of achieved requirement percentages
        divided by number of required skills.
    """

    # ------------------------------------------
    # BUILD STUDENT SKILL MAP
    # ------------------------------------------

    student_skill_map = {
        normalize_skill(skill["name"]): float(
            skill.get("proficiency") or 0
        )
        for skill in student_skills
        if skill.get("name")
    }

    matched_skills = []
    partial_skills = []
    missing_skills = []

    total_score = 0
    total_required = 0

    # ------------------------------------------
    # ANALYZE EACH REQUIRED SKILL
    # ------------------------------------------

    for required_item in required_skills or []:

        # Support both formats:
        #
        # "Python"
        #
        # and:
        #
        # {
        #     "skill": "Python",
        #     "proficiency": 80
        # }

        if isinstance(required_item, str):

            skill_name = required_item.strip()
            required_proficiency = 60.0

        elif isinstance(required_item, dict):

            skill_name = (
                    required_item.get("skill")
                    or required_item.get("name")
                    or ""
            ).strip()

            required_proficiency = float(
                required_item.get("proficiency")
                or required_item.get("required_proficiency")
                or 60
            )

        else:
            continue

        if not skill_name:
            continue

        normalized = normalize_skill(skill_name)

        current_proficiency = float(
            student_skill_map.get(
                normalized,
                0
            )
        )

        # --------------------------------------
        # CALCULATE REQUIREMENT FULFILLMENT
        # --------------------------------------

        if required_proficiency <= 0:

            fulfillment = 100

        else:

            fulfillment = (
                                  current_proficiency
                                  / required_proficiency
                          ) * 100

            fulfillment = min(
                fulfillment,
                100
            )

        fulfillment = round(
            fulfillment,
            2
        )

        total_score += fulfillment
        total_required += 1

        gap = max(
            required_proficiency
            - current_proficiency,
            0
        )

        # --------------------------------------
        # CLASSIFY SKILL
        # --------------------------------------

        if current_proficiency >= required_proficiency:

            matched_skills.append({
                "skill": skill_name,
                "proficiency": round(
                    current_proficiency,
                    2
                ),
                "required": round(
                    required_proficiency,
                    2
                ),
                "gap": 0,
                "fulfillment": 100,
                "status": "Ready"
            })

        elif current_proficiency > 0:

            partial_skills.append({
                "skill": skill_name,
                "proficiency": round(
                    current_proficiency,
                    2
                ),
                "required": round(
                    required_proficiency,
                    2
                ),
                "gap": round(
                    gap,
                    2
                ),
                "fulfillment": fulfillment,
                "status": "Gap"
            })

        else:

            missing_skills.append({
                "skill": skill_name,
                "proficiency": 0,
                "required": round(
                    required_proficiency,
                    2
                ),
                "gap": round(
                    required_proficiency,
                    2
                ),
                "fulfillment": 0,
                "status": "Missing"
            })

    # ------------------------------------------
    # FINAL MATCH SCORE
    # ------------------------------------------

    if total_required == 0:

        match_score = 0

    else:

        match_score = (
                total_score
                / total_required
        )

    match_score = round(
        match_score,
        2
    )

    # ------------------------------------------
    # COMBINE PARTIAL + MISSING
    # ------------------------------------------

    skill_gaps = (
            partial_skills
            + missing_skills
    )

    # Biggest gaps first
    skill_gaps.sort(
        key=lambda item: item["gap"],
        reverse=True
    )

    # ------------------------------------------
    # RETURN EXPLAINABLE RESULT
    # ------------------------------------------

    return {
        "match_score": match_score,

        "matched_skills": matched_skills,

        "partial_skills": partial_skills,

        "missing_skills": missing_skills,

        "skill_gaps": skill_gaps,

        "total_required_skills": total_required,

        "ready_skills": len(
            matched_skills
        ),

        "gap_skills": len(
            partial_skills
        ),

        "missing_skill_count": len(
            missing_skills
        )
    }


# --------------------------------------------------
# GET ALL OPPORTUNITIES
# --------------------------------------------------

@router.get("/")
def get_opportunities():

    try:

        response = (
            supabase
            .table("opportunities")
            .select("*")
            .order(
                "created_at",
                desc=True
            )
            .execute()
        )

        return {
            "status": "success",
            "count": len(
                response.data or []
            ),
            "data": response.data or []
        }

    except Exception as e:

        print(
            "Opportunity fetch error:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# --------------------------------------------------
# GET SINGLE OPPORTUNITY
# --------------------------------------------------

@router.get("/{opportunity_id}")
def get_opportunity(
        opportunity_id: int
):

    try:

        response = (
            supabase
            .table("opportunities")
            .select("*")
            .eq(
                "id",
                opportunity_id
            )
            .single()
            .execute()
        )

        if not response.data:

            raise HTTPException(
                status_code=404,
                detail="Opportunity not found"
            )

        return {
            "status": "success",
            "data": response.data
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# --------------------------------------------------
# MATCH OPPORTUNITIES FOR STUDENT
# --------------------------------------------------

@router.get("/match/{student_id}")
def match_opportunities(
        student_id: str
):

    try:

        # ------------------------------------------
        # GET STUDENT
        # ------------------------------------------

        student_response = (
            supabase
            .table("students")
            .select(
                "id,name,email,target_role"
            )
            .eq(
                "id",
                student_id
            )
            .single()
            .execute()
        )

        if not student_response.data:

            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

        student = (
            student_response.data
        )

        # ------------------------------------------
        # GET STUDENT SKILLS
        # ------------------------------------------

        skills_response = (
            supabase
            .table("student_skills")
            .select(
                "proficiency,source,verified,"
                "skills(id,name,category)"
            )
            .eq(
                "student_id",
                student_id
            )
            .execute()
        )

        student_skills = []

        for item in (
                skills_response.data or []
        ):

            # Assessment results remain separate
            # from the permanent skill profile.
            #
            # The permanent proficiency value is
            # what the opportunity engine uses.

            if item.get("source") == "assessment":
                continue

            skill = item.get("skills")

            if not skill:
                continue

            student_skills.append({
                "name": skill.get(
                    "name"
                ),
                "category": skill.get(
                    "category"
                ),
                "proficiency": float(
                    item.get(
                        "proficiency"
                    ) or 0
                ),
                "source": item.get(
                    "source"
                ),
                "verified": item.get(
                    "verified",
                    False
                )
            })

        # ------------------------------------------
        # GET OPPORTUNITIES
        # ------------------------------------------

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

        results = []

        # ------------------------------------------
        # MATCH EACH OPPORTUNITY
        # ------------------------------------------

        for opportunity in opportunities:

            required_skills = (
                    opportunity.get(
                        "required_skills"
                    )
                    or []
            )

            matching = calculate_match(
                student_skills,
                required_skills
            )

            result = {
                "id": opportunity.get(
                    "id"
                ),

                "role": opportunity.get(
                    "role"
                ),

                "company": opportunity.get(
                    "company"
                ),

                "location": opportunity.get(
                    "location"
                ),

                "type": opportunity.get(
                    "type"
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

                "required_skills":
                    required_skills,

                # ----------------------------------
                # MATCHING DATA
                # ----------------------------------

                "match_score":
                    matching[
                        "match_score"
                    ],

                "matched_skills":
                    matching[
                        "matched_skills"
                    ],

                "partial_skills":
                    matching[
                        "partial_skills"
                    ],

                "missing_skills":
                    matching[
                        "missing_skills"
                    ],

                "skill_gaps":
                    matching[
                        "skill_gaps"
                    ],

                "ready_skills":
                    matching[
                        "ready_skills"
                    ],

                "gap_skills":
                    matching[
                        "gap_skills"
                    ],

                "missing_skill_count":
                    matching[
                        "missing_skill_count"
                    ]
            }

            results.append(result)

        # ------------------------------------------
        # SORT BEST MATCH FIRST
        # ------------------------------------------

        results.sort(
            key=lambda item: (
                item["match_score"],
                item["ready_skills"]
            ),
            reverse=True
        )

        # ------------------------------------------
        # SUMMARY
        # ------------------------------------------

        strong_matches = len([
            item
            for item in results
            if item["match_score"] >= 80
        ])

        potential_matches = len([
            item
            for item in results
            if (
                    item["match_score"] >= 50
                    and item["match_score"] < 80
            )
        ])

        return {
            "status": "success",

            "student": {
                "id": student.get(
                    "id"
                ),
                "name": student.get(
                    "name"
                ),
                "target_role": student.get(
                    "target_role"
                )
            },

            "student_skills":
                student_skills,

            "total_opportunities":
                len(results),

            "strong_matches":
                strong_matches,

            "potential_matches":
                potential_matches,

            "opportunities":
                results
        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            "Opportunity matching error:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )