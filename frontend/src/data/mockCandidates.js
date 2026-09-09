/* SkillBridge AI - Realistic Recruitment Dataset (48 Members) */

export const MOCK_JOBS = [
  {
    "id": "opp-001",
    "title": "Backend Developer Intern",
    "role": "Backend Developer Intern",
    "company": "TechNova Labs",
    "type": "Internship",
    "location": "Bengaluru \u2022 Hybrid",
    "stipend": "\u20b925,000/month",
    "duration": "6 Months",
    "deadline": "2026-10-31",
    "status": "Active",
    "required_skills": [
      "Java",
      "SQL",
      "REST API",
      "Spring Boot",
      "PostgreSQL"
    ],
    "description": "Develop high-throughput microservices, optimize database schemas, and deploy containerized APIs in production.",
    "applicants_count": 48
  },
  {
    "id": "opp-002",
    "title": "AI & ML Research Associate",
    "role": "AI & ML Research Associate",
    "company": "TechNova Labs",
    "type": "Full-time",
    "location": "Bengaluru \u2022 Onsite",
    "stipend": "\u20b914,00,000/year",
    "duration": "Full-time",
    "deadline": "2026-11-15",
    "status": "Active",
    "required_skills": [
      "Python",
      "PyTorch",
      "NLP",
      "FastAPI",
      "TensorFlow"
    ],
    "description": "Build LLM fine-tuning pipelines, evaluate open-source reasoning models, and productionize multi-agent workflows.",
    "applicants_count": 36
  },
  {
    "id": "opp-003",
    "title": "Cloud Platform & DevOps Intern",
    "role": "Cloud Platform & DevOps Intern",
    "company": "TechNova Labs",
    "type": "Internship",
    "location": "Remote",
    "stipend": "\u20b930,000/month",
    "duration": "3 Months",
    "deadline": "2026-09-30",
    "status": "Active",
    "required_skills": [
      "Docker",
      "Kubernetes",
      "AWS",
      "Git",
      "CI/CD"
    ],
    "description": "Automate container orchestration, set up CI/CD GitHub action runners, and maintain infrastructure-as-code scripts.",
    "applicants_count": 28
  },
  {
    "id": "opp-004",
    "title": "Full Stack Software Engineer",
    "role": "Full Stack Software Engineer",
    "company": "TechNova Labs",
    "type": "Full-time",
    "location": "Bengaluru \u2022 Hybrid",
    "stipend": "\u20b912,00,000/year",
    "duration": "Full-time",
    "deadline": "2026-12-01",
    "status": "Active",
    "required_skills": [
      "React",
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "REST API"
    ],
    "description": "Build responsive user interfaces, integrate real-time web socket communication, and design scalable REST APIs.",
    "applicants_count": 42
  }
];

export const MOCK_CANDIDATES = [
  {
    "student_id": "std-000-001",
    "id": "std-000-001",
    "student": {
      "id": "std-000-001",
      "name": "Aman Sharma",
      "email": "aman.sharma@nit.edu",
      "college": "National Institute of Technology, Trichy",
      "degree": "B.Tech",
      "branch": "Computer Science & Engineering",
      "graduation_year": 2025,
      "location": "Bengaluru, India",
      "readiness_score": 80.0
    },
    "final_score": 80.0,
    "compatibility_score": 80.0,
    "recommendation": "Recommended",
    "recruitment_status": "Shortlisted",
    "status": "Shortlisted",
    "interview_date": null,
    "recruiter_notes": "Profile shortlisted based on AI skill verification and academic percentile.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 84,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 79,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 83,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 77,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 80,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 82.0,
      "readiness": 80.0,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-002",
    "id": "std-000-002",
    "student": {
      "id": "std-000-002",
      "name": "Ananya Iyer",
      "email": "ananya.iyer@bits.edu",
      "college": "BITS Pilani",
      "degree": "M.Tech",
      "branch": "Data Science & AI",
      "graduation_year": 2025,
      "location": "Hyderabad, India",
      "readiness_score": 86.5
    },
    "final_score": 85.1,
    "compatibility_score": 85.1,
    "recommendation": "Strong Match",
    "recruitment_status": "Interview Scheduled",
    "status": "Interview Scheduled",
    "interview_date": "2026-09-13T10:00:00Z",
    "recruiter_notes": "Technical interview scheduled for September 13, 2026.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 89,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 84,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 88,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 82,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 85,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 87.0,
      "readiness": 86.5,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-003",
    "id": "std-000-003",
    "student": {
      "id": "std-000-003",
      "name": "Priya Patel",
      "email": "priya.patel@nit.edu",
      "college": "National Institute of Technology, Surathkal",
      "degree": "B.Tech",
      "branch": "Information Technology",
      "graduation_year": 2025,
      "location": "Bengaluru, India",
      "readiness_score": 82.2
    },
    "final_score": 82.0,
    "compatibility_score": 82.0,
    "recommendation": "Recommended",
    "recruitment_status": "Shortlisted",
    "status": "Shortlisted",
    "interview_date": null,
    "recruiter_notes": "Profile shortlisted based on AI skill verification and academic percentile.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 86,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 81,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 85,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 79,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 82,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 84.4,
      "readiness": 82.2,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-004",
    "id": "std-000-004",
    "student": {
      "id": "std-000-004",
      "name": "Rahul Verma",
      "email": "rahul.v@iitb.ac.in",
      "college": "Indian Institute of Technology, Bombay",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2026,
      "location": "Mumbai, India",
      "readiness_score": 93.6
    },
    "final_score": 93.6,
    "compatibility_score": 93.6,
    "recommendation": "Strong Match",
    "recruitment_status": "Selected",
    "status": "Selected",
    "interview_date": null,
    "recruiter_notes": "Exceptional performance across technical rounds and systemic design evaluation.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 97,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 92,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 96,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 90,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 93,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 95.3,
      "readiness": 93.6,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-005",
    "id": "std-000-005",
    "student": {
      "id": "std-000-005",
      "name": "Siddharth Rao",
      "email": "siddharth.rao@iiit.ac.in",
      "college": "IIIT Hyderabad",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Hyderabad, India",
      "readiness_score": 84.4
    },
    "final_score": 84.0,
    "compatibility_score": 84.0,
    "recommendation": "Strong Match",
    "recruitment_status": "Shortlisted",
    "status": "Shortlisted",
    "interview_date": null,
    "recruiter_notes": "Profile shortlisted based on AI skill verification and academic percentile.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 88,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 83,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 87,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 81,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 84,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 86.8,
      "readiness": 84.4,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-006",
    "id": "std-000-006",
    "student": {
      "id": "std-000-006",
      "name": "Neha Gupta",
      "email": "neha.gupta@dtu.ac.in",
      "college": "Delhi Technological University",
      "degree": "B.Tech",
      "branch": "Information Technology",
      "graduation_year": 2025,
      "location": "Delhi, India",
      "readiness_score": 86.5
    },
    "final_score": 89.5,
    "compatibility_score": 89.5,
    "recommendation": "Strong Match",
    "recruitment_status": "Interview Scheduled",
    "status": "Interview Scheduled",
    "interview_date": "2026-09-17T10:00:00Z",
    "recruiter_notes": "Technical interview scheduled for September 17, 2026.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 88,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 83,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 87,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 81,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 84,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 86.0,
      "readiness": 86.5,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-007",
    "id": "std-000-007",
    "student": {
      "id": "std-000-007",
      "name": "Rohan Mehta",
      "email": "rohan.m@vit.ac.in",
      "college": "VIT Vellore",
      "degree": "B.Tech",
      "branch": "Computer Science & Engineering",
      "graduation_year": 2025,
      "location": "Chennai, India",
      "readiness_score": 71.4
    },
    "final_score": 70.4,
    "compatibility_score": 70.4,
    "recommendation": "Recommended",
    "recruitment_status": "Applied",
    "status": "Applied",
    "interview_date": null,
    "recruiter_notes": "Application received and initial AI compatibility screen completed.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 72,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 67,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 71,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [
      "Spring Boot",
      "PostgreSQL"
    ],
    "breakdown": {
      "skill_compatibility": 70.4,
      "readiness": 71.4,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-008",
    "id": "std-000-008",
    "student": {
      "id": "std-000-008",
      "name": "Kavya Nair",
      "email": "kavya.nair@coep.ac.in",
      "college": "COEP Technological University, Pune",
      "degree": "B.Tech",
      "branch": "Computer Engineering",
      "graduation_year": 2025,
      "location": "Pune, India",
      "readiness_score": 71.3
    },
    "final_score": 71.3,
    "compatibility_score": 71.3,
    "recommendation": "Recommended",
    "recruitment_status": "Applied",
    "status": "Applied",
    "interview_date": null,
    "recruiter_notes": "Application received and initial AI compatibility screen completed.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 74,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 69,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 73,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [
      "Spring Boot",
      "PostgreSQL"
    ],
    "breakdown": {
      "skill_compatibility": 72.3,
      "readiness": 71.3,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-009",
    "id": "std-000-009",
    "student": {
      "id": "std-000-009",
      "name": "Aditya Joshi",
      "email": "aditya.j@iitd.ac.in",
      "college": "Indian Institute of Technology, Delhi",
      "degree": "M.Tech",
      "branch": "Computer Technology",
      "graduation_year": 2025,
      "location": "Delhi, India",
      "readiness_score": 92.4
    },
    "final_score": 91.2,
    "compatibility_score": 91.2,
    "recommendation": "Strong Match",
    "recruitment_status": "Selected",
    "status": "Selected",
    "interview_date": null,
    "recruiter_notes": "Exceptional performance across technical rounds and systemic design evaluation.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 97,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 92,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 96,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 90,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 93,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 95.3,
      "readiness": 92.4,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-010",
    "id": "std-000-010",
    "student": {
      "id": "std-000-010",
      "name": "Pooja Deshmukh",
      "email": "pooja.d@vjti.ac.in",
      "college": "VJTI Mumbai",
      "degree": "B.Tech",
      "branch": "Information Technology",
      "graduation_year": 2025,
      "location": "Mumbai, India",
      "readiness_score": 83.3
    },
    "final_score": 81.0,
    "compatibility_score": 81.0,
    "recommendation": "Recommended",
    "recruitment_status": "Shortlisted",
    "status": "Shortlisted",
    "interview_date": null,
    "recruiter_notes": "Profile shortlisted based on AI skill verification and academic percentile.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 88,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 83,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 87,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 81,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 84,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 86.8,
      "readiness": 83.3,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-011",
    "id": "std-000-011",
    "student": {
      "id": "std-000-011",
      "name": "Vikram Choudhury",
      "email": "vikram.c@rvce.edu.in",
      "college": "RV College of Engineering",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Bengaluru, India",
      "readiness_score": 88.0
    },
    "final_score": 88.4,
    "compatibility_score": 88.4,
    "recommendation": "Strong Match",
    "recruitment_status": "Interview Scheduled",
    "status": "Interview Scheduled",
    "interview_date": "2026-09-12T10:00:00Z",
    "recruiter_notes": "Technical interview scheduled for September 12, 2026.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 88,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 83,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 87,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 81,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 84,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 86.0,
      "readiness": 88.0,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-012",
    "id": "std-000-012",
    "student": {
      "id": "std-000-012",
      "name": "Ishita Sen",
      "email": "ishita.sen@ju.edu.in",
      "college": "Jadavpur University",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Kolkata, India",
      "readiness_score": 96.0
    },
    "final_score": 94.8,
    "compatibility_score": 94.8,
    "recommendation": "Strong Match",
    "recruitment_status": "Selected",
    "status": "Selected",
    "interview_date": null,
    "recruiter_notes": "Exceptional performance across technical rounds and systemic design evaluation.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 95,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 90,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 94,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 88,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 91,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 93.1,
      "readiness": 96.0,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-013",
    "id": "std-000-013",
    "student": {
      "id": "std-000-013",
      "name": "Devansh Kapoor",
      "email": "devansh.k@nsut.ac.in",
      "college": "NSUT Delhi",
      "degree": "B.Tech",
      "branch": "Computer Engineering",
      "graduation_year": 2025,
      "location": "Delhi, India",
      "readiness_score": 80.0
    },
    "final_score": 84.0,
    "compatibility_score": 84.0,
    "recommendation": "Strong Match",
    "recruitment_status": "Shortlisted",
    "status": "Shortlisted",
    "interview_date": null,
    "recruiter_notes": "Profile shortlisted based on AI skill verification and academic percentile.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 86,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 81,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 85,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 79,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 82,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 84.4,
      "readiness": 80.0,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-014",
    "id": "std-000-014",
    "student": {
      "id": "std-000-014",
      "name": "Sneha Pillai",
      "email": "sneha.p@manipal.edu",
      "college": "Manipal Institute of Technology",
      "degree": "B.Tech",
      "branch": "Data Science & Engineering",
      "graduation_year": 2025,
      "location": "Manipal, India",
      "readiness_score": 86.5
    },
    "final_score": 85.1,
    "compatibility_score": 85.1,
    "recommendation": "Strong Match",
    "recruitment_status": "Interview Scheduled",
    "status": "Interview Scheduled",
    "interview_date": "2026-09-15T10:00:00Z",
    "recruiter_notes": "Technical interview scheduled for September 15, 2026.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 91,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 86,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 90,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 84,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 87,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 89.0,
      "readiness": 86.5,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-015",
    "id": "std-000-015",
    "student": {
      "id": "std-000-015",
      "name": "Harsh Vardhan",
      "email": "harsh.v@iitm.ac.in",
      "college": "Indian Institute of Technology, Madras",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2026,
      "location": "Chennai, India",
      "readiness_score": 92.4
    },
    "final_score": 90.0,
    "compatibility_score": 90.0,
    "recommendation": "Strong Match",
    "recruitment_status": "Selected",
    "status": "Selected",
    "interview_date": null,
    "recruiter_notes": "Exceptional performance across technical rounds and systemic design evaluation.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 98,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 93,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 97,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 91,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 94,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 96.4,
      "readiness": 92.4,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-016",
    "id": "std-000-016",
    "student": {
      "id": "std-000-016",
      "name": "Riya Banerjee",
      "email": "riya.b@srmist.edu.in",
      "college": "SRM Institute of Science & Tech",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Chennai, India",
      "readiness_score": 93.6
    },
    "final_score": 91.2,
    "compatibility_score": 91.2,
    "recommendation": "Strong Match",
    "recruitment_status": "Selected",
    "status": "Selected",
    "interview_date": null,
    "recruiter_notes": "Exceptional performance across technical rounds and systemic design evaluation.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 94,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 89,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 93,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 87,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 90,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 92.0,
      "readiness": 93.6,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-017",
    "id": "std-000-017",
    "student": {
      "id": "std-000-017",
      "name": "Yash Singhania",
      "email": "yash.s@bmsce.ac.in",
      "college": "BMS College of Engineering",
      "degree": "B.Tech",
      "branch": "Information Science",
      "graduation_year": 2025,
      "location": "Bengaluru, India",
      "readiness_score": 84.4
    },
    "final_score": 80.0,
    "compatibility_score": 80.0,
    "recommendation": "Recommended",
    "recruitment_status": "Shortlisted",
    "status": "Shortlisted",
    "interview_date": null,
    "recruiter_notes": "Profile shortlisted based on AI skill verification and academic percentile.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 85,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 80,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 84,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 78,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 81,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 83.2,
      "readiness": 84.4,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-018",
    "id": "std-000-018",
    "student": {
      "id": "std-000-018",
      "name": "Tanvi Kulkarni",
      "email": "tanvi.k@pict.edu",
      "college": "PICT Pune",
      "degree": "B.Tech",
      "branch": "Computer Engineering",
      "graduation_year": 2025,
      "location": "Pune, India",
      "readiness_score": 86.5
    },
    "final_score": 89.5,
    "compatibility_score": 89.5,
    "recommendation": "Strong Match",
    "recruitment_status": "Interview Scheduled",
    "status": "Interview Scheduled",
    "interview_date": "2026-09-19T10:00:00Z",
    "recruiter_notes": "Technical interview scheduled for September 19, 2026.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 90,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 85,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 89,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 83,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 86,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 88.0,
      "readiness": 86.5,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-019",
    "id": "std-000-019",
    "student": {
      "id": "std-000-019",
      "name": "Abhinav Reddy",
      "email": "abhinav.r@iiitb.ac.in",
      "college": "IIIT Bangalore",
      "degree": "M.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Bengaluru, India",
      "readiness_score": 80.0
    },
    "final_score": 82.0,
    "compatibility_score": 82.0,
    "recommendation": "Recommended",
    "recruitment_status": "Shortlisted",
    "status": "Shortlisted",
    "interview_date": null,
    "recruiter_notes": "Profile shortlisted based on AI skill verification and academic percentile.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 87,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 82,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 86,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 80,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 83,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 85.6,
      "readiness": 80.0,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-020",
    "id": "std-000-020",
    "student": {
      "id": "std-000-020",
      "name": "Meera Bhat",
      "email": "meera.b@msrit.edu",
      "college": "MS Ramaiah Institute of Technology",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Bengaluru, India",
      "readiness_score": 89.5
    },
    "final_score": 85.1,
    "compatibility_score": 85.1,
    "recommendation": "Strong Match",
    "recruitment_status": "Interview Scheduled",
    "status": "Interview Scheduled",
    "interview_date": "2026-09-21T10:00:00Z",
    "recruiter_notes": "Technical interview scheduled for September 21, 2026.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 92,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 87,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 91,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 85,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 88,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 90.0,
      "readiness": 89.5,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-021",
    "id": "std-000-021",
    "student": {
      "id": "std-000-021",
      "name": "Varun Saxena",
      "email": "varun.s@nitk.edu.in",
      "college": "NIT Surathkal",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Mangaluru, India",
      "readiness_score": 82.2
    },
    "final_score": 84.0,
    "compatibility_score": 84.0,
    "recommendation": "Strong Match",
    "recruitment_status": "Shortlisted",
    "status": "Shortlisted",
    "interview_date": null,
    "recruiter_notes": "Profile shortlisted based on AI skill verification and academic percentile.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 84,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 79,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 83,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 77,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 80,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 82.0,
      "readiness": 82.2,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-022",
    "id": "std-000-022",
    "student": {
      "id": "std-000-022",
      "name": "Shruti Agarwal",
      "email": "shruti.a@dtu.ac.in",
      "college": "Delhi Technological University",
      "degree": "B.Tech",
      "branch": "Software Engineering",
      "graduation_year": 2025,
      "location": "Delhi, India",
      "readiness_score": 86.5
    },
    "final_score": 87.3,
    "compatibility_score": 87.3,
    "recommendation": "Strong Match",
    "recruitment_status": "Interview Scheduled",
    "status": "Interview Scheduled",
    "interview_date": "2026-09-13T10:00:00Z",
    "recruiter_notes": "Technical interview scheduled for September 13, 2026.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 89,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 84,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 88,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 82,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 85,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 87.0,
      "readiness": 86.5,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-023",
    "id": "std-000-023",
    "student": {
      "id": "std-000-023",
      "name": "Tarun Mishra",
      "email": "tarun.m@iitk.ac.in",
      "college": "Indian Institute of Technology, Kanpur",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Kanpur, India",
      "readiness_score": 84.4
    },
    "final_score": 86.0,
    "compatibility_score": 86.0,
    "recommendation": "Strong Match",
    "recruitment_status": "Shortlisted",
    "status": "Shortlisted",
    "interview_date": null,
    "recruiter_notes": "Profile shortlisted based on AI skill verification and academic percentile.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 86,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 81,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 85,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 79,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 82,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 84.4,
      "readiness": 84.4,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-024",
    "id": "std-000-024",
    "student": {
      "id": "std-000-024",
      "name": "Divya Nambiar",
      "email": "divya.n@nitw.ac.in",
      "college": "NIT Warangal",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Hyderabad, India",
      "readiness_score": 89.5
    },
    "final_score": 89.5,
    "compatibility_score": 89.5,
    "recommendation": "Strong Match",
    "recruitment_status": "Interview Scheduled",
    "status": "Interview Scheduled",
    "interview_date": "2026-09-15T10:00:00Z",
    "recruiter_notes": "Technical interview scheduled for September 15, 2026.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 91,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 86,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 90,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 84,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 87,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 89.0,
      "readiness": 89.5,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-025",
    "id": "std-000-025",
    "student": {
      "id": "std-000-025",
      "name": "Kartik Bhatia",
      "email": "kartik.b@thapar.edu",
      "college": "Thapar Institute of Eng & Tech",
      "degree": "B.Tech",
      "branch": "Computer Engineering",
      "graduation_year": 2025,
      "location": "Patiala, India",
      "readiness_score": 52.0
    },
    "final_score": 48.0,
    "compatibility_score": 48.0,
    "recommendation": "Not Recommended",
    "recruitment_status": "Rejected",
    "status": "Rejected",
    "interview_date": null,
    "recruiter_notes": "Skills gap identified in core backend requirements.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 47,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 42,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 46,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [
      "Spring Boot",
      "PostgreSQL"
    ],
    "breakdown": {
      "skill_compatibility": 45.0,
      "readiness": 52.0,
      "eligibility": 70.0
    },
    "eligibility": {
      "eligible": false,
      "reasons": [
        "Graduation year requirement mismatch"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": false
    }
  },
  {
    "student_id": "std-000-026",
    "id": "std-000-026",
    "student": {
      "id": "std-000-026",
      "name": "Swati Pandey",
      "email": "swati.p@bhu.ac.in",
      "college": "IIT (BHU) Varanasi",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Varanasi, India",
      "readiness_score": 54.0
    },
    "final_score": 50.5,
    "compatibility_score": 50.5,
    "recommendation": "Not Recommended",
    "recruitment_status": "Rejected",
    "status": "Rejected",
    "interview_date": null,
    "recruiter_notes": "Skills gap identified in core backend requirements.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 50,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 45,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 49,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [
      "Spring Boot",
      "PostgreSQL"
    ],
    "breakdown": {
      "skill_compatibility": 48.0,
      "readiness": 54.0,
      "eligibility": 70.0
    },
    "eligibility": {
      "eligible": false,
      "reasons": [
        "Graduation year requirement mismatch"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": false
    }
  },
  {
    "student_id": "std-000-027",
    "id": "std-000-027",
    "student": {
      "id": "std-000-027",
      "name": "Parth Trivedi",
      "email": "parth.t@nith.ac.in",
      "college": "NIT Hamirpur",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Shimla, India",
      "readiness_score": 56.0
    },
    "final_score": 53.0,
    "compatibility_score": 53.0,
    "recommendation": "Not Recommended",
    "recruitment_status": "Rejected",
    "status": "Rejected",
    "interview_date": null,
    "recruiter_notes": "Skills gap identified in core backend requirements.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 53,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 48,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 52,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [
      "Spring Boot",
      "PostgreSQL"
    ],
    "breakdown": {
      "skill_compatibility": 51.0,
      "readiness": 56.0,
      "eligibility": 70.0
    },
    "eligibility": {
      "eligible": false,
      "reasons": [
        "Graduation year requirement mismatch"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": false
    }
  },
  {
    "student_id": "std-000-028",
    "id": "std-000-028",
    "student": {
      "id": "std-000-028",
      "name": "Srishti Chatterjee",
      "email": "srishti.c@iiest.ac.in",
      "college": "IIEST Shibpur",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Kolkata, India",
      "readiness_score": 67.8
    },
    "final_score": 66.8,
    "compatibility_score": 66.8,
    "recommendation": "Potential",
    "recruitment_status": "Applied",
    "status": "Applied",
    "interview_date": null,
    "recruiter_notes": "Application received and initial AI compatibility screen completed.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 69,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 64,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 68,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [
      "Spring Boot",
      "PostgreSQL"
    ],
    "breakdown": {
      "skill_compatibility": 67.8,
      "readiness": 67.8,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-029",
    "id": "std-000-029",
    "student": {
      "id": "std-000-029",
      "name": "Nipun Mahajan",
      "email": "nipun.m@pec.ac.in",
      "college": "PEC Chandigarh",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Chandigarh, India",
      "readiness_score": 67.7
    },
    "final_score": 67.7,
    "compatibility_score": 67.7,
    "recommendation": "Potential",
    "recruitment_status": "Applied",
    "status": "Applied",
    "interview_date": null,
    "recruiter_notes": "Application received and initial AI compatibility screen completed.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 67,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 62,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 66,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [
      "Spring Boot",
      "PostgreSQL"
    ],
    "breakdown": {
      "skill_compatibility": 65.7,
      "readiness": 67.7,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-030",
    "id": "std-000-030",
    "student": {
      "id": "std-000-030",
      "name": "Aakanksha Thakur",
      "email": "aakanksha.t@lnmiit.ac.in",
      "college": "LNMIIT Jaipur",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Jaipur, India",
      "readiness_score": 67.6
    },
    "final_score": 68.6,
    "compatibility_score": 68.6,
    "recommendation": "Potential",
    "recruitment_status": "Applied",
    "status": "Applied",
    "interview_date": null,
    "recruiter_notes": "Application received and initial AI compatibility screen completed.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 69,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 64,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 68,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [
      "Spring Boot",
      "PostgreSQL"
    ],
    "breakdown": {
      "skill_compatibility": 67.6,
      "readiness": 67.6,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-031",
    "id": "std-000-031",
    "student": {
      "id": "std-000-031",
      "name": "Sameer Deshpande",
      "email": "sameer.d@vnit.ac.in",
      "college": "VNIT Nagpur",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Nagpur, India",
      "readiness_score": 70.5
    },
    "final_score": 69.5,
    "compatibility_score": 69.5,
    "recommendation": "Potential",
    "recruitment_status": "Applied",
    "status": "Applied",
    "interview_date": null,
    "recruiter_notes": "Application received and initial AI compatibility screen completed.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 71,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 66,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 70,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [
      "Spring Boot",
      "PostgreSQL"
    ],
    "breakdown": {
      "skill_compatibility": 69.5,
      "readiness": 70.5,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-032",
    "id": "std-000-032",
    "student": {
      "id": "std-000-032",
      "name": "Deepika Kaushik",
      "email": "deepika.k@igdtuw.ac.in",
      "college": "IGDTUW Delhi",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Delhi, India",
      "readiness_score": 70.4
    },
    "final_score": 70.4,
    "compatibility_score": 70.4,
    "recommendation": "Recommended",
    "recruitment_status": "Applied",
    "status": "Applied",
    "interview_date": null,
    "recruiter_notes": "Application received and initial AI compatibility screen completed.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 73,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 68,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 72,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [
      "Spring Boot",
      "PostgreSQL"
    ],
    "breakdown": {
      "skill_compatibility": 71.4,
      "readiness": 70.4,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-033",
    "id": "std-000-033",
    "student": {
      "id": "std-000-033",
      "name": "Arpit Somani",
      "email": "arpit.s@daiict.ac.in",
      "college": "DA-IICT Gandhinagar",
      "degree": "B.Tech",
      "branch": "ICT",
      "graduation_year": 2025,
      "location": "Ahmedabad, India",
      "readiness_score": 70.3
    },
    "final_score": 71.3,
    "compatibility_score": 71.3,
    "recommendation": "Recommended",
    "recruitment_status": "Applied",
    "status": "Applied",
    "interview_date": null,
    "recruiter_notes": "Application received and initial AI compatibility screen completed.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 71,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 66,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 70,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [
      "Spring Boot",
      "PostgreSQL"
    ],
    "breakdown": {
      "skill_compatibility": 69.3,
      "readiness": 70.3,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-034",
    "id": "std-000-034",
    "student": {
      "id": "std-000-034",
      "name": "Rashmi Dave",
      "email": "rashmi.d@nirmauni.ac.in",
      "college": "Nirma University",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Ahmedabad, India",
      "readiness_score": 73.2
    },
    "final_score": 72.2,
    "compatibility_score": 72.2,
    "recommendation": "Recommended",
    "recruitment_status": "Applied",
    "status": "Applied",
    "interview_date": null,
    "recruiter_notes": "Application received and initial AI compatibility screen completed.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 73,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 68,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 72,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [
      "Spring Boot",
      "PostgreSQL"
    ],
    "breakdown": {
      "skill_compatibility": 71.2,
      "readiness": 73.2,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-035",
    "id": "std-000-035",
    "student": {
      "id": "std-000-035",
      "name": "Madhav Menon",
      "email": "madhav.m@cusat.ac.in",
      "college": "CUSAT Kochi",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Kochi, India",
      "readiness_score": 73.1
    },
    "final_score": 73.1,
    "compatibility_score": 73.1,
    "recommendation": "Recommended",
    "recruitment_status": "Applied",
    "status": "Applied",
    "interview_date": null,
    "recruiter_notes": "Application received and initial AI compatibility screen completed.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 75,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 70,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 74,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [
      "Spring Boot",
      "PostgreSQL"
    ],
    "breakdown": {
      "skill_compatibility": 73.1,
      "readiness": 73.1,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-036",
    "id": "std-000-036",
    "student": {
      "id": "std-000-036",
      "name": "Nupur Saxena",
      "email": "nupur.s@nith.ac.in",
      "college": "NIT Calicut",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Kozhikode, India",
      "readiness_score": 73.0
    },
    "final_score": 74.0,
    "compatibility_score": 74.0,
    "recommendation": "Recommended",
    "recruitment_status": "Applied",
    "status": "Applied",
    "interview_date": null,
    "recruiter_notes": "Application received and initial AI compatibility screen completed.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 77,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 72,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 76,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [
      "Spring Boot",
      "PostgreSQL"
    ],
    "breakdown": {
      "skill_compatibility": 75.0,
      "readiness": 73.0,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-037",
    "id": "std-000-037",
    "student": {
      "id": "std-000-037",
      "name": "Alok Roy",
      "email": "alok.r@nitrkl.ac.in",
      "college": "NIT Rourkela",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Rourkela, India",
      "readiness_score": 75.9
    },
    "final_score": 74.9,
    "compatibility_score": 74.9,
    "recommendation": "Recommended",
    "recruitment_status": "Applied",
    "status": "Applied",
    "interview_date": null,
    "recruiter_notes": "Application received and initial AI compatibility screen completed.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 74,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 69,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 73,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [
      "Spring Boot",
      "PostgreSQL"
    ],
    "breakdown": {
      "skill_compatibility": 72.9,
      "readiness": 75.9,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-038",
    "id": "std-000-038",
    "student": {
      "id": "std-000-038",
      "name": "Shreya Goswami",
      "email": "shreya.g@kiit.ac.in",
      "college": "KIIT Bhubaneswar",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Bhubaneswar, India",
      "readiness_score": 75.8
    },
    "final_score": 75.8,
    "compatibility_score": 75.8,
    "recommendation": "Recommended",
    "recruitment_status": "Applied",
    "status": "Applied",
    "interview_date": null,
    "recruiter_notes": "Application received and initial AI compatibility screen completed.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 76,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 71,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 75,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 69,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 72,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 74.8,
      "readiness": 75.8,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-039",
    "id": "std-000-039",
    "student": {
      "id": "std-000-039",
      "name": "Tushar Wagh",
      "email": "tushar.w@walchandsangli.ac.in",
      "college": "Walchand College of Eng, Sangli",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Sangli, India",
      "readiness_score": 75.7
    },
    "final_score": 76.7,
    "compatibility_score": 76.7,
    "recommendation": "Recommended",
    "recruitment_status": "Applied",
    "status": "Applied",
    "interview_date": null,
    "recruiter_notes": "Application received and initial AI compatibility screen completed.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 78,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 73,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 77,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 71,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 74,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 76.7,
      "readiness": 75.7,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-040",
    "id": "std-000-040",
    "student": {
      "id": "std-000-040",
      "name": "Ankita Sundaram",
      "email": "ankita.s@sau.int",
      "college": "South Asian University",
      "degree": "MCA",
      "branch": "Computer Applications",
      "graduation_year": 2025,
      "location": "Delhi, India",
      "readiness_score": 78.6
    },
    "final_score": 77.6,
    "compatibility_score": 77.6,
    "recommendation": "Recommended",
    "recruitment_status": "Applied",
    "status": "Applied",
    "interview_date": null,
    "recruiter_notes": "Application received and initial AI compatibility screen completed.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 80,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 75,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 79,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 73,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 76,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 78.6,
      "readiness": 78.6,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-041",
    "id": "std-000-041",
    "student": {
      "id": "std-000-041",
      "name": "Chirag Bansal",
      "email": "chirag.b@bitmesra.ac.in",
      "college": "BIT Mesra",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Ranchi, India",
      "readiness_score": 78.5
    },
    "final_score": 78.5,
    "compatibility_score": 78.5,
    "recommendation": "Recommended",
    "recruitment_status": "Applied",
    "status": "Applied",
    "interview_date": null,
    "recruiter_notes": "Application received and initial AI compatibility screen completed.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 78,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 73,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 77,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 71,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 74,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 76.5,
      "readiness": 78.5,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-042",
    "id": "std-000-042",
    "student": {
      "id": "std-000-042",
      "name": "Lavanya Rao",
      "email": "lavanya.r@pes.edu",
      "college": "PES University Bengaluru",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Bengaluru, India",
      "readiness_score": 78.4
    },
    "final_score": 79.4,
    "compatibility_score": 79.4,
    "recommendation": "Recommended",
    "recruitment_status": "Applied",
    "status": "Applied",
    "interview_date": null,
    "recruiter_notes": "Application received and initial AI compatibility screen completed.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 80,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 75,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 79,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 73,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 76,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 78.4,
      "readiness": 78.4,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-043",
    "id": "std-000-043",
    "student": {
      "id": "std-000-043",
      "name": "Mohit Garg",
      "email": "mohit.g@ditu.edu.in",
      "college": "DIT University Dehradun",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Dehradun, India",
      "readiness_score": 81.3
    },
    "final_score": 80.3,
    "compatibility_score": 80.3,
    "recommendation": "Recommended",
    "recruitment_status": "Applied",
    "status": "Applied",
    "interview_date": null,
    "recruiter_notes": "Application received and initial AI compatibility screen completed.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 82,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 77,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 81,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 75,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 78,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 80.3,
      "readiness": 81.3,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-044",
    "id": "std-000-044",
    "student": {
      "id": "std-000-044",
      "name": "Chetna Trivedi",
      "email": "chetna.t@banasthali.ac.in",
      "college": "Banasthali Vidyapith",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Jaipur, India",
      "readiness_score": 81.2
    },
    "final_score": 81.2,
    "compatibility_score": 81.2,
    "recommendation": "Recommended",
    "recruitment_status": "Applied",
    "status": "Applied",
    "interview_date": null,
    "recruiter_notes": "Application received and initial AI compatibility screen completed.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 84,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 79,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 83,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 77,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 80,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 82.2,
      "readiness": 81.2,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-045",
    "id": "std-000-045",
    "student": {
      "id": "std-000-045",
      "name": "Utkarsh Srivastava",
      "email": "utkarsh.s@hbtu.ac.in",
      "college": "HBTU Kanpur",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Kanpur, India",
      "readiness_score": 81.1
    },
    "final_score": 82.1,
    "compatibility_score": 82.1,
    "recommendation": "Strong Match",
    "recruitment_status": "Applied",
    "status": "Applied",
    "interview_date": null,
    "recruiter_notes": "Application received and initial AI compatibility screen completed.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 82,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 77,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 81,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 75,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 78,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 80.1,
      "readiness": 81.1,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-046",
    "id": "std-000-046",
    "student": {
      "id": "std-000-046",
      "name": "Yamini Reddy",
      "email": "yamini.r@jntu.ac.in",
      "college": "JNTU Hyderabad",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Hyderabad, India",
      "readiness_score": 84.0
    },
    "final_score": 83.0,
    "compatibility_score": 83.0,
    "recommendation": "Strong Match",
    "recruitment_status": "Applied",
    "status": "Applied",
    "interview_date": null,
    "recruiter_notes": "Application received and initial AI compatibility screen completed.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 84,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 79,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 83,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 77,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 80,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 82.0,
      "readiness": 84.0,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-047",
    "id": "std-000-047",
    "student": {
      "id": "std-000-047",
      "name": "Pranav Shah",
      "email": "pranav.s@kjsomaiya.edu",
      "college": "KJ Somaiya Mumbai",
      "degree": "B.Tech",
      "branch": "Computer Engineering",
      "graduation_year": 2025,
      "location": "Mumbai, India",
      "readiness_score": 83.9
    },
    "final_score": 83.9,
    "compatibility_score": 83.9,
    "recommendation": "Strong Match",
    "recruitment_status": "Applied",
    "status": "Applied",
    "interview_date": null,
    "recruiter_notes": "Application received and initial AI compatibility screen completed.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 85,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 80,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 84,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 78,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 81,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 83.9,
      "readiness": 83.9,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  },
  {
    "student_id": "std-000-048",
    "id": "std-000-048",
    "student": {
      "id": "std-000-048",
      "name": "Simran Kaur",
      "email": "simran.k@gndu.ac.in",
      "college": "GNDU Amritsar",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduation_year": 2025,
      "location": "Amritsar, India",
      "readiness_score": 83.8
    },
    "final_score": 84.8,
    "compatibility_score": 84.8,
    "recommendation": "Strong Match",
    "recruitment_status": "Applied",
    "status": "Applied",
    "interview_date": null,
    "recruiter_notes": "Application received and initial AI compatibility screen completed.",
    "matched_skills": [
      {
        "skill": "Java",
        "proficiency": 87,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "SQL",
        "proficiency": 82,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "REST API",
        "proficiency": 86,
        "required_level": 70,
        "coverage": 100
      },
      {
        "skill": "Spring Boot",
        "proficiency": 80,
        "required_level": 70,
        "coverage": 95
      },
      {
        "skill": "PostgreSQL",
        "proficiency": 83,
        "required_level": 70,
        "coverage": 100
      }
    ],
    "missing_skills": [],
    "breakdown": {
      "skill_compatibility": 85.8,
      "readiness": 83.8,
      "eligibility": 100.0
    },
    "eligibility": {
      "eligible": true,
      "reasons": [
        "Eligible"
      ],
      "degree_ok": true,
      "branch_ok": true,
      "graduation_year_ok": true
    }
  }
];
