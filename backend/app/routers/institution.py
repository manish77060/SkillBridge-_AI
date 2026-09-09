from fastapi import APIRouter, HTTPException
from app.config import supabase
from collections import defaultdict

router = APIRouter(
    prefix="/api/institution",
    tags=["Institution"]
)


@router.get("/dashboard")
def get_institution_dashboard():

    try:
        # --------------------------------------------------
        # 1. GET STUDENTS
        # --------------------------------------------------

        students_response = (
            supabase
            .table("students")
            .select(
                "id, name, email, college, degree, branch, "
                "graduation_year, target_role, readiness_score"
            )
            .execute()
        )

        students = students_response.data or []

        total_students = len(students)

        # --------------------------------------------------
        # 2. READINESS ANALYTICS
        # --------------------------------------------------

        readiness_values = []

        for student in students:
            score = student.get("readiness_score")

            if score is not None:
                readiness_values.append(float(score))

        if readiness_values:
            average_readiness = round(
                sum(readiness_values) / len(readiness_values),
                2
            )
        else:
            average_readiness = 0

        # --------------------------------------------------
        # 3. GET APPLICATIONS
        # --------------------------------------------------

        applications_response = (
            supabase
            .table("applications")
            .select(
                "id, student_id, opportunity_id, status, applied_at"
            )
            .execute()
        )

        applications = applications_response.data or []

        total_applications = len(applications)

        shortlisted_count = sum(
            1
            for application in applications
            if application.get("status") in [
                "Shortlisted",
                "Interview",
                "Selected"
            ]
        )

        interview_count = sum(
            1
            for application in applications
            if application.get("status") == "Interview"
        )

        selected_count = sum(
            1
            for application in applications
            if application.get("status") == "Selected"
        )

        rejected_count = sum(
            1
            for application in applications
            if application.get("status") == "Rejected"
        )

        # --------------------------------------------------
        # 4. GET OPPORTUNITIES
        # --------------------------------------------------

        opportunities_response = (
            supabase
            .table("opportunities")
            .select(
                "id, role, company, type, required_skills"
            )
            .execute()
        )

        opportunities = opportunities_response.data or []

        total_opportunities = len(opportunities)

        # --------------------------------------------------
        # 5. INDUSTRY SKILL DEMAND
        # --------------------------------------------------

        skill_demand = defaultdict(int)

        for opportunity in opportunities:

            required_skills = opportunity.get("required_skills") or []

            for skill in required_skills:

                skill_name = skill.strip()

                if skill_name:
                    skill_demand[skill_name] += 1

        # --------------------------------------------------
        # 6. GET STUDENT SKILLS
        # --------------------------------------------------

        student_skills_response = (
            supabase
            .table("student_skills")
            .select(
                "student_id, proficiency, verified, "
                "skills(name, category)"
            )
            .execute()
        )

        student_skills = student_skills_response.data or []

        # --------------------------------------------------
        # 7. BUILD SKILL ANALYTICS
        # --------------------------------------------------

        skill_students = defaultdict(list)
        skill_verified_count = defaultdict(int)

        for record in student_skills:

            skill_data = record.get("skills")

            if not skill_data:
                continue

            skill_name = skill_data.get("name")

            if not skill_name:
                continue

            proficiency = float(
                record.get("proficiency") or 0
            )

            skill_students[skill_name].append(
                proficiency
            )

            if record.get("verified"):
                skill_verified_count[skill_name] += 1

        # --------------------------------------------------
        # 8. INDUSTRY DEMAND + STUDENT COVERAGE
        # --------------------------------------------------

        skill_analytics = []

        all_skills = set(skill_demand.keys()) | set(
            skill_students.keys()
        )

        for skill in all_skills:

            proficiencies = skill_students.get(skill, [])

            if proficiencies:

                average_proficiency = round(
                    sum(proficiencies) / len(proficiencies),
                    2
                )

            else:
                average_proficiency = 0

            student_count = len(proficiencies)

            demand_count = skill_demand.get(skill, 0)

            coverage_percentage = round(
                (student_count / total_students) * 100,
                2
            ) if total_students else 0

            skill_gap = round(
                max(100 - average_proficiency, 0),
                2
            )

            skill_analytics.append({
                "skill": skill,
                "industry_demand": demand_count,
                "student_count": student_count,
                "coverage_percentage": coverage_percentage,
                "average_proficiency": average_proficiency,
                "skill_gap": skill_gap,
                "verified_students": skill_verified_count.get(
                    skill,
                    0
                )
            })

        # Highest industry demand first
        skill_analytics.sort(
            key=lambda x: (
                x["industry_demand"],
                x["student_count"]
            ),
            reverse=True
        )

        # --------------------------------------------------
        # 9. TOP SKILL GAPS
        # --------------------------------------------------

        top_skill_gaps = sorted(
            skill_analytics,
            key=lambda x: (
                x["skill_gap"],
                x["industry_demand"]
            ),
            reverse=True
        )[:5]

        # --------------------------------------------------
        # 10. DEPARTMENT / BRANCH ANALYTICS
        # --------------------------------------------------

        branch_data = defaultdict(
            lambda: {
                "students": 0,
                "readiness_total": 0,
                "readiness_count": 0
            }
        )

        for student in students:

            branch = (
                    student.get("branch")
                    or "Unknown"
            )

            branch_data[branch]["students"] += 1

            score = student.get("readiness_score")

            if score is not None:

                branch_data[branch][
                    "readiness_total"
                ] += float(score)

                branch_data[branch][
                    "readiness_count"
                ] += 1

        department_analytics = []

        for branch, data in branch_data.items():

            if data["readiness_count"]:

                avg_score = round(
                    data["readiness_total"]
                    / data["readiness_count"],
                    2
                )

            else:
                avg_score = 0

            department_analytics.append({
                "branch": branch,
                "students": data["students"],
                "average_readiness": avg_score
            })

        department_analytics.sort(
            key=lambda x: x["average_readiness"],
            reverse=True
        )

        # --------------------------------------------------
        # 11. PLACEMENT RATE
        # --------------------------------------------------

        if total_applications:

            placement_rate = round(
                (
                        selected_count
                        / total_applications
                ) * 100,
                2
            )

        else:
            placement_rate = 0

        # --------------------------------------------------
        # 12. RESPONSE
        # --------------------------------------------------

        return {
            "status": "success",

            "institution": {
                "name": "Galgotias University"
            },

            "overview": {
                "total_students": total_students,
                "average_readiness": average_readiness,
                "total_opportunities": total_opportunities,
                "total_applications": total_applications,
                "shortlisted": shortlisted_count,
                "interviews": interview_count,
                "selected": selected_count,
                "rejected": rejected_count,
                "placement_rate": placement_rate
            },

            "skill_intelligence": {
                "top_skill_gaps": top_skill_gaps,
                "industry_demand": skill_analytics[:10]
            },

            "department_analytics": department_analytics,
            "students": students

        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )