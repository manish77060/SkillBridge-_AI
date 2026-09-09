from fastapi import APIRouter, UploadFile, File, HTTPException
from pypdf import PdfReader
import io
import json
import os
import re
import urllib.request


router = APIRouter(
    prefix="/api/resume",
    tags=["Resume Intelligence"]
)


# ============================================================
# OLLAMA CONFIGURATION
# ============================================================

OLLAMA_URL = os.getenv(
    "OLLAMA_URL",
    "http://127.0.0.1:11434"
)

OLLAMA_MODEL = os.getenv(
    "OLLAMA_MODEL",
    ""
)


# ============================================================
# OLLAMA HELPERS
# ============================================================

def get_ollama_model():
    """
    Automatically finds an installed Ollama model.

    Priority:
    1. OLLAMA_MODEL from environment
    2. First installed model from Ollama
    """

    if OLLAMA_MODEL.strip():
        return OLLAMA_MODEL.strip()

    try:
        request = urllib.request.Request(
            f"{OLLAMA_URL}/api/tags",
            method="GET"
        )

        with urllib.request.urlopen(
                request,
                timeout=10
        ) as response:

            data = json.loads(
                response.read().decode("utf-8")
            )

            models = data.get("models", [])

            if models:
                return models[0].get("name")

    except Exception as error:
        print(
            "Ollama model discovery failed:",
            error
        )

    return None


def call_ollama(prompt: str):
    """
    Send the complete resume text to Ollama.
    """

    model = get_ollama_model()

    if not model:
        raise RuntimeError(
            "No Ollama model is installed. "
            "Run: ollama list"
        )

    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "format": "json",
        "options": {
            "temperature": 0.1
        }
    }

    request = urllib.request.Request(
        f"{OLLAMA_URL}/api/generate",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json"
        },
        method="POST"
    )

    with urllib.request.urlopen(
            request,
            timeout=180
    ) as response:

        result = json.loads(
            response.read().decode("utf-8")
        )

        return result.get("response", "")


# ============================================================
# PDF EXTRACTION
# ============================================================

def extract_pdf_text(pdf_bytes: bytes):
    """
    Extract text from every page of the uploaded PDF.
    """

    try:

        reader = PdfReader(
            io.BytesIO(pdf_bytes)
        )

        if not reader.pages:
            raise ValueError(
                "The PDF contains no readable pages."
            )

        pages = []

        for index, page in enumerate(
                reader.pages,
                start=1
        ):

            try:

                text = page.extract_text() or ""

                if text.strip():

                    pages.append(
                        f"\n--- PAGE {index} ---\n{text}"
                    )

            except Exception as error:

                print(
                    f"Could not read page {index}:",
                    error
                )

        full_text = "\n".join(
            pages
        ).strip()

        if not full_text:

            raise ValueError(
                "No readable text was found in the PDF. "
                "If this is a scanned/image-only resume, "
                "OCR is required."
            )

        return full_text

    except Exception as error:

        raise ValueError(
            f"PDF extraction failed: {error}"
        )


# ============================================================
# NORMALIZATION HELPERS
# ============================================================

def clean_list(value):
    """
    Make sure AI returned a clean list.
    """

    if value is None:
        return []

    if isinstance(value, str):

        value = value.strip()

        if not value:
            return []

        return [value]

    if isinstance(value, list):

        result = []

        for item in value:

            if isinstance(item, str):

                text = item.strip()

                if text:
                    result.append(text)

            elif isinstance(item, dict):

                result.append(item)

        return result

    return []


def clean_dict(value):

    if isinstance(value, dict):
        return value

    return {}


def extract_json_from_response(response_text):
    """
    Ollama normally returns JSON because format=json is used.
    This also handles fenced JSON just in case.
    """

    if not response_text:

        raise ValueError(
            "AI returned an empty response."
        )

    text = response_text.strip()

    # Remove markdown fences
    text = re.sub(
        r"^```json\s*",
        "",
        text,
        flags=re.IGNORECASE
    )

    text = re.sub(
        r"^```\s*",
        "",
        text
    )

    text = re.sub(
        r"\s*```$",
        "",
        text
    )

    try:

        return json.loads(text)

    except json.JSONDecodeError:

        start = text.find("{")
        end = text.rfind("}")

        if start != -1 and end != -1:

            candidate = text[
                start:end + 1
            ]

            try:

                return json.loads(
                    candidate
                )

            except json.JSONDecodeError:
                pass

        raise ValueError(
            "AI returned invalid JSON."
        )


# ============================================================
# PROJECT NORMALIZATION
# ============================================================

def normalize_project(project):
    """
    Normalize one project without mixing information
    with any other project.

    Every field belongs ONLY to this project.
    """

    if not isinstance(project, dict):
        return None

    title = project.get(
        "title",
        ""
    )

    description = project.get(
        "description",
        ""
    )

    technologies = project.get(
        "technologies",
        []
    )

    role = project.get(
        "role",
        ""
    )

    duration = project.get(
        "duration",
        ""
    )

    link = project.get(
        "link",
        ""
    )

    # --------------------------------------------------------
    # Clean title
    # --------------------------------------------------------

    if not isinstance(title, str):
        title = str(title)

    title = title.strip()

    # --------------------------------------------------------
    # Clean description
    # --------------------------------------------------------

    if not isinstance(description, str):
        description = str(description)

    description = description.strip()

    # --------------------------------------------------------
    # Clean technologies
    # --------------------------------------------------------

    technologies = clean_list(
        technologies
    )

    clean_technologies = []

    for technology in technologies:

        if isinstance(
                technology,
                dict
        ):
            technology = (
                    technology.get("name")
                    or technology.get("technology")
                    or ""
            )

        if not isinstance(
                technology,
                str
        ):
            continue

        technology = technology.strip()

        if (
                technology
                and technology not in clean_technologies
        ):
            clean_technologies.append(
                technology
            )

    # --------------------------------------------------------
    # Clean role
    # --------------------------------------------------------

    if not isinstance(role, str):
        role = str(role)

    role = role.strip()

    # --------------------------------------------------------
    # Clean duration
    # --------------------------------------------------------

    if not isinstance(duration, str):
        duration = str(duration)

    duration = duration.strip()

    # --------------------------------------------------------
    # Clean link
    # --------------------------------------------------------

    if isinstance(link, list):

        link = (
            link[0]
            if link
            else ""
        )

    if not isinstance(link, str):
        link = str(link)

    link = link.strip()

    # --------------------------------------------------------
    # Return one completely independent project
    # --------------------------------------------------------

    return {
        "title": title,
        "description": description,
        "technologies": clean_technologies,
        "role": role,
        "duration": duration,
        "link": link
    }


def normalize_projects(projects):
    """
    Normalize every project independently.

    Project 1 stays Project 1.
    Project 2 stays Project 2.
    No fields are merged between projects.
    """

    projects = clean_list(
        projects
    )

    normalized_projects = []

    for project in projects:

        normalized = normalize_project(
            project
        )

        if not normalized:
            continue

        # Do not keep completely empty project objects
        if not any([
            normalized["title"],
            normalized["description"],
            normalized["technologies"],
            normalized["role"],
            normalized["duration"],
            normalized["link"]
        ]):
            continue

        normalized_projects.append(
            normalized
        )

    return normalized_projects[:20]


# ============================================================
# FALLBACK ANALYSIS
# ============================================================

def fallback_analysis(resume_text):
    """
    Fallback when Ollama is unavailable.

    This does not invent information.
    """

    text = resume_text

    lower = text.lower()

    known_skills = [
        "Python",
        "Java",
        "JavaScript",
        "TypeScript",
        "C",
        "C++",
        "C#",
        "SQL",
        "HTML",
        "CSS",
        "React",
        "React.js",
        "Node.js",
        "Express.js",
        "FastAPI",
        "Django",
        "Flask",
        "Spring",
        "Spring Boot",
        "Git",
        "GitHub",
        "Docker",
        "Kubernetes",
        "AWS",
        "Azure",
        "GCP",
        "Machine Learning",
        "Deep Learning",
        "Artificial Intelligence",
        "Data Science",
        "Pandas",
        "NumPy",
        "TensorFlow",
        "PyTorch",
        "Scikit-learn",
        "MongoDB",
        "PostgreSQL",
        "MySQL",
        "Redis",
        "REST API",
        "REST APIs",
        "Tailwind CSS",
        "Vite",
        "Supabase",
        "Figma",
        "Linux",
        "OOP",
        "Data Structures",
        "Algorithms"
    ]

    skills = []

    for skill in known_skills:

        if skill.lower() in lower:

            if skill not in skills:
                skills.append(skill)

    projects = []
    certificates = []
    experience = []
    education = []
    achievements = []

    section_patterns = {

        "projects": [
            "projects",
            "project experience",
            "academic projects",
            "personal projects",
            "major projects"
        ],

        "certificates": [
            "certifications",
            "certificates",
            "certification"
        ],

        "experience": [
            "experience",
            "work experience",
            "professional experience",
            "internship",
            "internships"
        ],

        "education": [
            "education",
            "academic background"
        ],

        "achievements": [
            "achievements",
            "accomplishments",
            "awards"
        ]
    }

    stop_sections = [
        "skills",
        "technical skills",
        "education",
        "experience",
        "work experience",
        "professional experience",
        "projects",
        "personal projects",
        "academic projects",
        "certifications",
        "certificates",
        "achievements",
        "awards",
        "languages",
        "interests",
        "hobbies"
    ]

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    current_section = None

    current_project = None

    for line in lines:

        normalized = line.lower().strip()

        found_section = None

        for section, names in section_patterns.items():

            for name in names:

                if normalized == name:

                    found_section = section

                    break

            if found_section:
                break

        if found_section:

            # Save previous project
            if (
                    current_project
                    and current_section == "projects"
            ):

                projects.append(
                    current_project
                )

                current_project = None

            current_section = found_section

            continue

        # Stop current section when another heading begins
        if (
                normalized in stop_sections
                and normalized not in section_patterns.get(
            current_section,
            []
        )
        ):

            if (
                    current_project
                    and current_section == "projects"
            ):

                projects.append(
                    current_project
                )

                current_project = None

            current_section = None

            continue

        # ----------------------------------------------------
        # PROJECT FALLBACK
        # ----------------------------------------------------

        if current_section == "projects":

            if len(line) <= 3:
                continue

            # Detect common project title patterns.
            looks_like_title = (
                    len(line) <= 120
                    and (
                            ":" in line
                            or "|" in line
                            or " - " in line
                            or re.match(
                        r"^(project|[0-9]+[\.\)])",
                        line,
                        re.IGNORECASE
                    )
                    )
            )

            if current_project is None:

                current_project = {
                    "title": line,
                    "description": "",
                    "technologies": [],
                    "role": "",
                    "duration": "",
                    "link": ""
                }

            elif looks_like_title:

                projects.append(
                    current_project
                )

                current_project = {
                    "title": line,
                    "description": "",
                    "technologies": [],
                    "role": "",
                    "duration": "",
                    "link": ""
                }

            else:

                if current_project[
                    "description"
                ]:

                    current_project[
                        "description"
                    ] += " " + line

                else:

                    current_project[
                        "description"
                    ] = line

                # Detect technologies only from the
                # current project's own text.
                project_text = (
                        current_project["title"]
                        + " "
                        + current_project["description"]
                ).lower()

                current_project[
                    "technologies"
                ] = [
                    skill
                    for skill in known_skills
                    if skill.lower() in project_text
                ]

        # ----------------------------------------------------
        # CERTIFICATES
        # ----------------------------------------------------

        elif current_section == "certificates":

            if len(line) > 3:

                certificates.append({
                    "name": line,
                    "issuer": "",
                    "year": ""
                })

        # ----------------------------------------------------
        # EXPERIENCE
        # ----------------------------------------------------

        elif current_section == "experience":

            if len(line) > 3:

                experience.append({
                    "role": line,
                    "company": "",
                    "duration": "",
                    "description": ""
                })

        # ----------------------------------------------------
        # EDUCATION
        # ----------------------------------------------------

        elif current_section == "education":

            if len(line) > 3:

                education.append({
                    "degree": line,
                    "institution": "",
                    "duration": ""
                })

        # ----------------------------------------------------
        # ACHIEVEMENTS
        # ----------------------------------------------------

        elif current_section == "achievements":

            if len(line) > 3:

                achievements.append({
                    "title": line,
                    "description": ""
                })

    # Save final project
    if current_project:

        projects.append(
            current_project
        )

    return {
        "summary": (
            "Resume text was successfully extracted. "
            "AI analysis is unavailable because Ollama "
            "could not be reached."
        ),

        "skills": skills,

        "projects": normalize_projects(
            projects
        ),

        "certificates": certificates[:20],

        "education": education[:20],

        "experience": experience[:20],

        "achievements": achievements[:20],

        "languages": [],

        "links": [],

        "contact": {},

        "additional_information": [],

        "analysis_mode":
            "pdf_extraction_fallback"
    }


# ============================================================
# AI PROMPT
# ============================================================

def build_resume_prompt(resume_text):
    """
    Analyze the COMPLETE resume.

    The project rules are intentionally strict so that
    information belonging to one project is not mixed
    with another project.
    """

    return f"""
You are the Resume Intelligence Engine for SkillBridge AI.

Analyze the COMPLETE resume text below.

Your job is to extract ALL useful candidate information that
is actually present in the resume.

DO NOT invent information.
DO NOT assume information.
DO NOT add skills merely because they are common for the role.
Only report information supported by the resume.

Return ONLY valid JSON.

Required JSON structure:

{{
  "summary": "A concise but complete professional summary based only on the resume.",

  "candidate": {{
    "name": "",
    "email": "",
    "phone": "",
    "location": "",
    "headline": ""
  }},

  "skills": [
    {{
      "name": "",
      "category": "",
      "evidence": ""
    }}
  ],

  "projects": [
    {{
      "title": "",
      "description": "",
      "technologies": [],
      "role": "",
      "duration": "",
      "link": ""
    }}
  ],

  "experience": [
    {{
      "role": "",
      "company": "",
      "location": "",
      "duration": "",
      "description": "",
      "technologies": []
    }}
  ],

  "education": [
    {{
      "degree": "",
      "field": "",
      "institution": "",
      "location": "",
      "duration": "",
      "score": ""
    }}
  ],

  "certificates": [
    {{
      "name": "",
      "issuer": "",
      "date": "",
      "credential_id": ""
    }}
  ],

  "achievements": [
    {{
      "title": "",
      "description": "",
      "date": ""
    }}
  ],

  "languages": [
    {{
      "name": "",
      "proficiency": ""
    }}
  ],

  "links": [
    {{
      "type": "",
      "url": ""
    }}
  ],

  "additional_information": [
    ""
  ]
}}


============================================================
GENERAL EXTRACTION RULES
============================================================

1. Extract EVERY relevant technical skill.

2. Extract programming languages.

3. Extract frameworks.

4. Extract libraries.

5. Extract databases.

6. Extract cloud technologies.

7. Extract development tools.

8. Extract AI/ML technologies.

9. Extract soft skills only when explicitly mentioned.

10. Extract EVERY project.

11. Extract EVERY internship/work experience.

12. Extract EVERY degree and educational qualification.

13. Extract EVERY certificate/certification.

14. Extract EVERY achievement, award, competition or recognition.

15. Extract GitHub, LinkedIn, portfolio and project links.

16. Extract languages.

17. Extract relevant extracurricular information.

18. Extract relevant positions of responsibility.

19. Extract hackathons if mentioned.

20. Extract publications if mentioned.

21. Extract volunteering if mentioned.

22. Extract important coursework if explicitly mentioned.

23. Preserve exact names and dates where possible.

24. If a field is not present, return an empty string or empty array.

25. Do not create fake data.


============================================================
VERY IMPORTANT PROJECT EXTRACTION RULES
============================================================

PROJECTS MUST BE KEPT COMPLETELY SEPARATE.

For EACH project, create ONE independent object.

For example:

"projects": [
  {{
    "title": "Project One",
    "description": "Description belonging ONLY to Project One.",
    "technologies": [
      "Python",
      "FastAPI"
    ],
    "role": "Contribution belonging ONLY to Project One.",
    "duration": "Duration belonging ONLY to Project One.",
    "link": "Link belonging ONLY to Project One."
  }},

  {{
    "title": "Project Two",
    "description": "Description belonging ONLY to Project Two.",
    "technologies": [
      "React",
      "Node.js"
    ],
    "role": "Contribution belonging ONLY to Project Two.",
    "duration": "Duration belonging ONLY to Project Two.",
    "link": "Link belonging ONLY to Project Two."
  }}
]


============================================================
PROJECT DATA ISOLATION
============================================================

For every project:

1. The title must belong to that project only.

2. The description must contain ONLY the explanation
   belonging to that project.

3. The technologies array must contain ONLY technologies
   explicitly associated with that project.

4. DO NOT copy technologies from the global skills section
   into every project.

5. DO NOT copy technologies from another project.

6. If Python appears in Project 1 but only React appears
   in Project 2, Project 1 gets Python and Project 2 gets
   React.

7. The role must describe the candidate's contribution
   to THAT project only.

8. The duration must belong to THAT project only.

9. The link must belong to THAT project only.

10. Never attach a link from Project 2 to Project 1.

11. Never attach a description from Project 2 to Project 1.

12. Never attach a technology from Project 2 to Project 1.

13. Never combine multiple project descriptions into one
    project.

14. Never combine multiple project technology lists.

15. If a project does not have a particular field, leave
    that field empty.

16. Preserve the order in which projects appear in the
    resume whenever possible.

17. If the resume contains 2 projects, return 2 separate
    project objects.

18. If the resume contains 3 projects, return 3 separate
    project objects.

19. Do not reduce multiple projects into one project.

20. Do not create a project that is not present in the
    resume.


============================================================
PROJECT BOUNDARY DETECTION
============================================================

Use the actual structure of the resume to determine where
one project ends and another begins.

Project boundaries may be indicated by:

- Project title
- Numbered project heading
- Bullet heading
- Bold-style heading represented in extracted text
- Dates
- GitHub/project URL
- Technology line
- Description bullets
- Formatting/order in the extracted resume text

When a new project title begins, everything following it
belongs to that new project until the next project begins
or the Projects section ends.

Keep all information attached to the correct project.


============================================================
IMPORTANT
============================================================

The global "skills" array and the per-project
"technologies" arrays are DIFFERENT.

"skills" = skills found anywhere in the complete resume.

"projects[].technologies" = technologies specifically
associated with THAT individual project.

Never use the global skills list to populate every project's
technology list.


============================================================
RESUME
============================================================

{resume_text}
"""


# ============================================================
# ANALYZE RESUME
# ============================================================

@router.post("/analyze")
async def analyze_resume(
        file: UploadFile = File(...)
):

    # --------------------------------------------------------
    # Validate file
    # --------------------------------------------------------

    filename = file.filename or "resume.pdf"

    if not filename.lower().endswith(".pdf"):

        raise HTTPException(
            status_code=400,
            detail="Only PDF resumes are supported."
        )

    # --------------------------------------------------------
    # Read uploaded file
    # --------------------------------------------------------

    try:

        pdf_bytes = await file.read()

    except Exception as error:

        raise HTTPException(
            status_code=400,
            detail=(
                f"Could not read uploaded resume: "
                f"{error}"
            )
        )

    if not pdf_bytes:

        raise HTTPException(
            status_code=400,
            detail="The uploaded resume is empty."
        )

    # 10 MB protection
    if len(pdf_bytes) > 10 * 1024 * 1024:

        raise HTTPException(
            status_code=400,
            detail="Resume must be smaller than 10 MB."
        )

    # --------------------------------------------------------
    # Extract COMPLETE PDF text
    # --------------------------------------------------------

    try:

        resume_text = extract_pdf_text(
            pdf_bytes
        )

    except ValueError as error:

        raise HTTPException(
            status_code=422,
            detail=str(error)
        )

    # --------------------------------------------------------
    # AI ANALYSIS
    # --------------------------------------------------------

    analysis_mode = "ollama_ai"

    try:

        prompt = build_resume_prompt(
            resume_text
        )

        ai_response = call_ollama(
            prompt
        )

        analysis = extract_json_from_response(
            ai_response
        )

    except Exception as error:

        print(
            "Ollama resume analysis failed:",
            error
        )

        analysis = fallback_analysis(
            resume_text
        )

        analysis_mode = (
            "pdf_extraction_fallback"
        )

    # --------------------------------------------------------
    # Normalize result
    # --------------------------------------------------------

    if not isinstance(
            analysis,
            dict
    ):

        analysis = fallback_analysis(
            resume_text
        )

        analysis_mode = (
            "pdf_extraction_fallback"
        )

    candidate = clean_dict(
        analysis.get("candidate")
    )

    skills = clean_list(
        analysis.get("skills")
    )

    # ========================================================
    # IMPORTANT:
    # Normalize projects independently.
    # ========================================================

    projects = normalize_projects(
        analysis.get("projects")
    )

    experience = clean_list(
        analysis.get("experience")
    )

    education = clean_list(
        analysis.get("education")
    )

    certificates = clean_list(
        analysis.get("certificates")
    )

    achievements = clean_list(
        analysis.get("achievements")
    )

    languages = clean_list(
        analysis.get("languages")
    )

    links = clean_list(
        analysis.get("links")
    )

    additional_information = clean_list(
        analysis.get(
            "additional_information"
        )
    )

    summary = analysis.get(
        "summary",
        ""
    )

    if not isinstance(
            summary,
            str
    ):

        summary = str(
            summary
        )

    # --------------------------------------------------------
    # Final response
    # --------------------------------------------------------

    return {

        "status": "success",

        "message":
            "Resume analyzed successfully.",

        "filename":
            filename,

        "pages":
            resume_text.count(
                "--- PAGE "
            ),

        "text_length":
            len(resume_text),

        "analysis_mode":
            analysis_mode,

        "candidate":
            candidate,

        "summary":
            summary,

        "skills":
            skills,

        # Each project remains an independent object.
        "projects":
            projects,

        "experience":
            experience,

        "education":
            education,

        "certificates":
            certificates,

        "achievements":
            achievements,

        "languages":
            languages,

        "links":
            links,

        "additional_information":
            additional_information,

        # Keep extracted text available
        # for verification/debugging.
        "extracted_text":
            resume_text
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@router.get("/health")
def resume_health():

    model = get_ollama_model()

    return {
        "status": "success",
        "service": "Resume Intelligence",
        "pdf_parser": "pypdf",
        "ollama_available":
            model is not None,
        "ollama_model":
            model
    }