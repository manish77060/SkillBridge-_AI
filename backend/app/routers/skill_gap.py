from fastapi import APIRouter, HTTPException, Query
from app.config import supabase


router = APIRouter(
    prefix="/api/skill-gap",
    tags=["Skill Gap Engine"]
)


# ============================================================
# TARGET ROLE DEFINITIONS
# ============================================================

ROLE_DEFINITIONS = {
    "Backend Developer": {
        "description": (
            "Build scalable server-side applications, APIs and "
            "database-driven systems."
        ),
        "demand": "High",
        "skills": {
            "Python": 80,
            "FastAPI": 80,
            "SQL": 70,
            "Git": 60,
            "React": 60,
        },
    },

    "Full Stack Developer": {
        "description": (
            "Build complete web applications across frontend, "
            "backend and databases."
        ),
        "demand": "Very High",
        "skills": {
            "React": 80,
            "Python": 70,
            "FastAPI": 70,
            "SQL": 70,
            "Git": 60,
        },
    },

    "Frontend Developer": {
        "description": (
            "Build responsive and interactive user interfaces "
            "using modern frontend technologies."
        ),
        "demand": "High",
        "skills": {
            "React": 80,
            "JavaScript": 80,
            "Git": 60,
            "SQL": 40,
            "Python": 40,
        },
    },

    "Data Analyst": {
        "description": (
            "Analyze data and generate insights using programming, "
            "databases and analytical tools."
        ),
        "demand": "High",
        "skills": {
            "Python": 75,
            "SQL": 80,
            "Git": 50,
            "React": 30,
            "FastAPI": 30,
        },
    },
}


# ============================================================
# HELPERS
# ============================================================

def normalize_skill_name(value):
    return str(value or "").strip().lower()


def get_student_skill_score(row):
    """
    Supports the common score/proficiency field names so the
    engine remains compatible with the existing student_skills
    table.
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
        value = row.get(field)

        if value is not None:
            try:
                return max(0, min(100, float(value)))
            except (TypeError, ValueError):
                pass

    return 0


# ============================================================
# GET AVAILABLE CAREERS
# ============================================================

@router.get("/roles")
def get_roles():
    roles = []

    for role_name, role_data in ROLE_DEFINITIONS.items():
        roles.append({
            "name": role_name,
            "description": role_data["description"],
            "demand": role_data["demand"],
            "required_skills": [
                {
                    "name": skill_name,
                    "required": required_score,
                }
                for skill_name, required_score
                in role_data["skills"].items()
            ],
        })

    return {
        "success": True,
        "roles": roles,
    }


# ============================================================
# RUN SKILL GAP ANALYSIS
# ============================================================

@router.get("/{student_id}")
def analyze_skill_gap(
        student_id: str,
        role: str = Query(
            default="Backend Developer",
            description="Target career role"
        ),
):
    # --------------------------------------------------------
    # Validate role
    # --------------------------------------------------------

    role_data = ROLE_DEFINITIONS.get(role)

    if not role_data:
        raise HTTPException(
            status_code=404,
            detail=(
                f"Target role '{role}' not found. "
                f"Available roles: {list(ROLE_DEFINITIONS.keys())}"
            ),
        )

    # --------------------------------------------------------
    # Check student
    # --------------------------------------------------------

    try:
        student_response = (
            supabase
            .table("students")
            .select("*")
            .eq("id", student_id)
            .single()
            .execute()
        )

        student = student_response.data

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to load student: {str(e)}",
        )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found",
        )

    # --------------------------------------------------------
    # Load student skill records
    # --------------------------------------------------------

    try:
        student_skills_response = (
            supabase
            .table("student_skills")
            .select("*")
            .eq("student_id", student_id)
            .execute()
        )

        student_skill_rows = (
                student_skills_response.data or []
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=(
                f"Unable to load student skills: {str(e)}"
            ),
        )

    # --------------------------------------------------------
    # Load skill master table
    # --------------------------------------------------------

    try:
        skills_response = (
            supabase
            .table("skills")
            .select("*")
            .execute()
        )

        skill_rows = skills_response.data or []

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to load skills: {str(e)}",
        )

    # --------------------------------------------------------
    # Build skill ID → skill name map
    # --------------------------------------------------------

    skill_name_by_id = {}

    for skill in skill_rows:
        skill_id = skill.get("id")
        skill_name = skill.get("name")

        if skill_id is not None and skill_name:
            skill_name_by_id[str(skill_id)] = skill_name

    # --------------------------------------------------------
    # Build current student skill map
    # --------------------------------------------------------

    current_skills = {}

    for row in student_skill_rows:

        skill_id = row.get("skill_id")

        if skill_id is None:
            continue

        skill_name = skill_name_by_id.get(
            str(skill_id)
        )

        if not skill_name:
            continue

        score = get_student_skill_score(row)

        current_skills[
            normalize_skill_name(skill_name)
        ] = {
            "name": skill_name,
            "score": round(score),
        }

    # --------------------------------------------------------
    # Compare student vs target role
    # --------------------------------------------------------

    skill_analysis = []

    for skill_name, required_score in role_data["skills"].items():

        normalized_name = normalize_skill_name(skill_name)

        current_score = current_skills.get(
            normalized_name,
            {
                "score": 0
            }
        )["score"]

        gap = max(
            required_score - current_score,
            0
        )

        # ----------------------------------------------------
        # Status
        # ----------------------------------------------------

        if current_score >= required_score:
            status = "Ready"

        elif current_score >= required_score - 10:
            status = "Near Ready"

        else:
            status = "Gap"

        # ----------------------------------------------------
        # Priority
        # ----------------------------------------------------

        if gap >= 25:
            priority = "High"

        elif gap >= 10:
            priority = "Medium"

        elif gap > 0:
            priority = "Low"

        else:
            priority = "None"

        skill_analysis.append({
            "name": skill_name,
            "current": current_score,
            "required": required_score,
            "gap": gap,
            "status": status,
            "priority": priority,
        })

    # --------------------------------------------------------
    # Sort largest gaps first
    # --------------------------------------------------------

    skill_analysis.sort(
        key=lambda item: (
            item["gap"],
            item["required"]
        ),
        reverse=True,
    )

    # --------------------------------------------------------
    # Skill Match
    #
    # We only count up to the required level.
    #
    # Example:
    # current = 100
    # required = 60
    #
    # contribution = 60, not 100.
    # --------------------------------------------------------

    total_required = sum(
        item["required"]
        for item in skill_analysis
    )

    total_achieved = sum(
        min(
            item["current"],
            item["required"]
        )
        for item in skill_analysis
    )

    if total_required > 0:
        skill_match = round(
            (
                    total_achieved
                    / total_required
            ) * 100
        )
    else:
        skill_match = 0

    # --------------------------------------------------------
    # Gap statistics
    # --------------------------------------------------------

    gaps = [
        item
        for item in skill_analysis
        if item["gap"] > 0
    ]

    high_priority_gaps = [
        item
        for item in gaps
        if item["priority"] == "High"
    ]

    ready_skills = [
        item
        for item in skill_analysis
        if item["status"] == "Ready"
    ]

    # --------------------------------------------------------
    # Readiness
    #
    # For the prototype, skill match is the main readiness
    # signal. This keeps the calculation transparent and
    # explainable to SIH evaluators.
    # --------------------------------------------------------

    readiness = skill_match

    # --------------------------------------------------------
    # Projected readiness
    #
    # If all identified gaps are closed, the student reaches
    # 100% for this role.
    # --------------------------------------------------------

    projected_readiness = 100

    # --------------------------------------------------------
    # Generate learning priorities
    # --------------------------------------------------------

    learning_priorities = []

    for index, item in enumerate(gaps[:3]):

        if item["gap"] >= 25:
            recommendation = (
                f"Prioritize {item['name']} first. "
                f"You need approximately "
                f"{item['gap']} more percentage points "
                f"to reach the role target."
            )

        elif item["gap"] >= 10:
            recommendation = (
                f"Strengthen {item['name']} next to move "
                f"closer to role readiness."
            )

        else:
            recommendation = (
                f"Polish {item['name']} through practical "
                f"projects and hands-on practice."
            )

        learning_priorities.append({
            "rank": index + 1,
            "skill": item["name"],
            "gap": item["gap"],
            "priority": item["priority"],
            "recommendation": recommendation,
        })

    # --------------------------------------------------------
    # Final response
    # --------------------------------------------------------

    return {
        "success": True,

        "student": {
            "id": student.get("id"),
            "name": student.get("name"),
        },

        "target_role": {
            "name": role,
            "description": role_data["description"],
            "demand": role_data["demand"],
        },

        "summary": {
            "readiness": readiness,
            "skill_match": skill_match,
            "total_required_skills": len(skill_analysis),
            "skills_ready": len(ready_skills),
            "skill_gaps": len(gaps),
            "high_priority_gaps": len(high_priority_gaps),
            "projected_readiness": projected_readiness,
        },

        "skills": skill_analysis,

        "priority_gaps": learning_priorities,
    }