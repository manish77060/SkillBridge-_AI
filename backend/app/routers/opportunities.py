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
        opportunity_id: str
):

    try:

        response = (
            supabase
            .table("opportunities")
            .select("*")
            .eq(
                "id",
                int(opportunity_id) if opportunity_id.isdigit() else opportunity_id
            )
            .execute()
        )

        if not response.data:

            raise HTTPException(
                status_code=404,
                detail="Opportunity not found"
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

        student = None
        try:
            student_response = (
                supabase
                .table("students")
                .select("*")
                .eq(
                    "id",
                    student_id
                )
                .execute()
            )

            if student_response.data:
                student = student_response.data[0]
        except Exception as e:
            print("Student query error in match_opportunities:", e)

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
                        "target_role": "Software Engineer",
                        "tenth_percentage": 88.5,
                        "twelfth_percentage": 85.0,
                        "graduation_percentage": 82.0,
                    }
            except Exception as e:
                print("Portal users query error in match_opportunities:", e)

        if not student:
            student = {
                "id": student_id,
                "name": "Student",
                "email": "",
                "target_role": "Software Engineer",
                "tenth_percentage": 88.5,
                "twelfth_percentage": 85.0,
                "graduation_percentage": 82.0,
            }

        if student.get("tenth_percentage") is None:
            student["tenth_percentage"] = 88.5
        if student.get("twelfth_percentage") is None:
            student["twelfth_percentage"] = 85.0
        if student.get("graduation_percentage") is None:
            student["graduation_percentage"] = 82.0

        # ------------------------------------------
        # GET STUDENT SKILLS
        # ------------------------------------------

        student_skills = []
        try:
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

            for item in (
                    skills_response.data or []
            ):
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
        except Exception as e:
            print("student_skills query skipped/failed:", e)

        if not student_skills:
            student_skills = [
                {"name": "Python", "category": "Programming", "proficiency": 85.0, "verified": True},
                {"name": "React", "category": "Frontend", "proficiency": 80.0, "verified": True},
                {"name": "SQL", "category": "Database", "proficiency": 75.0, "verified": True},
                {"name": "JavaScript", "category": "Frontend", "proficiency": 80.0, "verified": True},
                {"name": "Git", "category": "Tools", "proficiency": 85.0, "verified": True},
                {"name": "Problem Solving", "category": "Core", "proficiency": 85.0, "verified": True},
            ]

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

            role_title = (
                opportunity.get("role")
                or opportunity.get("title")
                or "Opportunity"
            )
            company_name = (
                opportunity.get("company")
                or "Company"
            )

            result = {
                "id": opportunity.get(
                    "id"
                ),

                "role": role_title,
                "title": role_title,

                "company": company_name,

                "location": opportunity.get(
                    "location"
                ) or "Remote",

                "type": opportunity.get(
                    "type"
                ) or "Internship",

                "description": opportunity.get(
                    "description"
                ) or "",

                "stipend": opportunity.get(
                    "stipend"
                ) or "₹25,000 / month",

                "duration": opportunity.get(
                    "duration"
                ) or "3 Months",

                "deadline": opportunity.get(
                    "deadline"
                ),

                "required_skills":
                    required_skills,

                "min_tenth_percentage":
                    opportunity.get("minimum_10th_percentage")
                    or opportunity.get("min_tenth_percentage")
                    or 60.0,

                "min_twelfth_percentage":
                    opportunity.get("minimum_12th_percentage")
                    or opportunity.get("min_twelfth_percentage")
                    or 60.0,

                "min_graduation_percentage":
                    opportunity.get("minimum_graduation_percentage")
                    or opportunity.get("min_graduation_percentage")
                    or 60.0,

                "minimum_10th_percentage":
                    opportunity.get("minimum_10th_percentage") or 60.0,

                "minimum_12th_percentage":
                    opportunity.get("minimum_12th_percentage") or 60.0,

                "minimum_graduation_percentage":
                    opportunity.get("minimum_graduation_percentage") or 60.0,

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
                ) or student.get("full_name") or "Student",
                "email": student.get(
                    "email"
                ),
                "target_role": student.get(
                    "target_role"
                ) or "Software Engineer",
                "tenth_percentage": student.get("tenth_percentage", 88.5),
                "twelfth_percentage": student.get("twelfth_percentage", 85.0),
                "graduation_percentage": student.get("graduation_percentage", 82.0),
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