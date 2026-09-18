import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# =========================================================
# ROUTERS
# =========================================================

from app.routers import students
from app.routers import skills
from app.routers import career
from app.routers import learning
from app.routers import opportunities
from app.routers import applications
from app.routers import industry
from app.routers import institution
from app.routers import assessment
from app.routers import skill_gap
from app.routers import opportunity_matching
from app.routers import resume
from app.routers import admin          # Super Admin & User Auth


# =========================================================
# CREATE FASTAPI APP
# =========================================================

app = FastAPI(
    title="SkillBridge AI API",
    description=(
        "AI-powered Academia–Industry Skill Intelligence Platform "
        "for skill mapping, career guidance, internships, placements "
        "and academia–industry collaboration."
    ),
    version="1.0.0"
)


# =========================================================
# CORS CONFIGURATION
# =========================================================

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,

    allow_origins=allowed_origins,

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# =========================================================
# ROOT ENDPOINT
# =========================================================

@app.get("/")
def root():

    return {
        "status": "success",
        "message": "SkillBridge AI Backend is running",
        "service": "SkillBridge AI",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health_check():

    return {
        "status": "healthy",
        "service": "SkillBridge AI Backend"
    }


# =========================================================
# REGISTER API ROUTERS
# =========================================================


# ---------------------------------------------------------
# STUDENT APIs
# ---------------------------------------------------------

app.include_router(
    students.router
)


# ---------------------------------------------------------
# SKILL APIs
# ---------------------------------------------------------

app.include_router(
    skills.router
)


# ---------------------------------------------------------
# CAREER INTELLIGENCE APIs
# ---------------------------------------------------------

app.include_router(
    career.router
)


# ---------------------------------------------------------
# LEARNING APIs
# ---------------------------------------------------------

app.include_router(
    learning.router
)


# ---------------------------------------------------------
# OPPORTUNITY APIs
# ---------------------------------------------------------

app.include_router(
    opportunities.router
)


# ---------------------------------------------------------
# APPLICATION APIs
# ---------------------------------------------------------

app.include_router(
    applications.router
)


# ---------------------------------------------------------
# INDUSTRY APIs
# ---------------------------------------------------------

app.include_router(
    industry.router
)


# ---------------------------------------------------------
# INSTITUTION APIs
# ---------------------------------------------------------

app.include_router(
    institution.router
)


# ---------------------------------------------------------
# ASSESSMENT APIs
# ---------------------------------------------------------

app.include_router(
    assessment.router
)


# ---------------------------------------------------------
# SKILL GAP APIs
# ---------------------------------------------------------

app.include_router(
    skill_gap.router
)


# ---------------------------------------------------------
# OPPORTUNITY MATCHING APIs
# ---------------------------------------------------------

app.include_router(
    opportunity_matching.router
)


# ---------------------------------------------------------
# RESUME INTELLIGENCE APIs
# ---------------------------------------------------------

app.include_router(
    resume.router
)


# ---------------------------------------------------------
# SUPER ADMIN & USER AUTH APIs
# ---------------------------------------------------------

app.include_router(
    admin.router
)


# =========================================================
# STARTUP EVENT
# =========================================================

@app.on_event("startup")
def startup_event():

    print("=" * 60)
    print("🚀 SkillBridge AI Backend Started")
    print("=" * 60)

    print(
        "📚 API Docs      : "
        "http://127.0.0.1:8000/docs"
    )

    print(
        "❤️  Health        : "
        "http://127.0.0.1:8000/health"
    )

    print(
        "🏠 Root          : "
        "http://127.0.0.1:8000/"
    )

    print(
        "🎯 Skill Gap     : "
        "/api/skill-gap/{student_id}"
    )

    print(
        "📚 Learning      : "
        "/api/learning"
    )

    print(
        "🎯 Opportunity   : "
        "/api/opportunity-matching/{student_id}"
    )

    print(
        "📄 Resume AI     : "
        "/api/resume/analyze"
    )

    print("=" * 60)


# =========================================================
# SHUTDOWN EVENT
# =========================================================

@app.on_event("shutdown")
def shutdown_event():

    print("=" * 60)
    print("🛑 SkillBridge AI Backend Stopped")
    print("=" * 60)
