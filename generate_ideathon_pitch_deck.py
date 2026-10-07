import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
from pptx.dml.color import RGBColor

def create_ideathon_deck():
    prs = Presentation()
    # 16:9 Widescreen standard (13.333 x 7.5 inches)
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Elegant Color Palette
    PRIMARY = RGBColor(14, 116, 144)      # Deep Cyan / Teal (#0E7490)
    DARK = RGBColor(15, 23, 42)           # Slate 900 (#0F172A)
    TEXT_DARK = RGBColor(30, 41, 59)      # Slate 800 (#1E293B)
    TEXT_MUTED = RGBColor(100, 116, 139)  # Slate 500 (#64748B)
    LIGHT_BG = RGBColor(248, 250, 252)    # Slate 50
    CARD_BG = RGBColor(255, 255, 255)     # White
    BORDER = RGBColor(226, 232, 240)      # Slate 200
    WHITE = RGBColor(255, 255, 255)

    ACCENT_GREEN = RGBColor(16, 185, 129) # Emerald 500
    ACCENT_GREEN_BG = RGBColor(236, 253, 245)
    ACCENT_AMBER = RGBColor(245, 158, 11) # Amber 500
    ACCENT_PURPLE = RGBColor(124, 58, 237)# Violet 600
    ACCENT_RED = RGBColor(239, 68, 68)    # Red 500
    ACCENT_RED_BG = RGBColor(254, 242, 242)

    def add_header(slide, title_text, subtitle_text=None):
        # Header banner text
        t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.45), Inches(11.733), Inches(0.9))
        tf = t_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.size = Pt(24)
        p.font.bold = True
        p.font.color.rgb = DARK
        
        if subtitle_text:
            p2 = tf.add_paragraph()
            p2.text = subtitle_text
            p2.font.size = Pt(13)
            p2.font.color.rgb = PRIMARY
            p2.space_before = Pt(3)

    def add_footer(slide, page_num):
        # Thin divider line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.85), Inches(11.733), Inches(0.02))
        line.fill.solid()
        line.fill.fore_color.rgb = BORDER
        line.line.fill.background()

        # Left tag
        lbl_box = slide.shapes.add_textbox(Inches(0.8), Inches(6.92), Inches(8.0), Inches(0.35))
        tf_l = lbl_box.text_frame
        p_l = tf_l.paragraphs[0]
        p_l.text = "HackForge Ideathon  •  SkillBridge AI"
        p_l.font.size = Pt(10)
        p_l.font.color.rgb = TEXT_MUTED

        # Right page number
        r_box = slide.shapes.add_textbox(Inches(11.0), Inches(6.92), Inches(1.533), Inches(0.35))
        tf_r = r_box.text_frame
        p_r = tf_r.paragraphs[0]
        p_r.text = f"{page_num}"
        p_r.font.size = Pt(11)
        p_r.font.bold = True
        p_r.font.color.rgb = TEXT_DARK
        p_r.alignment = PP_ALIGN.RIGHT

    # =========================================================================
    # SLIDE 1: COVER
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    # Background accent
    bg = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = LIGHT_BG
    bg.line.fill.background()

    # Main Card
    main_c = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.0), Inches(11.333), Inches(5.5))
    main_c.fill.solid()
    main_c.fill.fore_color.rgb = WHITE
    main_c.line.color.rgb = BORDER
    main_c.line.width = Pt(1.5)

    tf_c = main_c.text_frame
    tf_c.word_wrap = True
    tf_c.margin_left = tf_c.margin_right = Inches(0.8)
    tf_c.margin_top = Inches(0.7)

    p1 = tf_c.paragraphs[0]
    p1.text = "SkillBridge AI"
    p1.font.size = Pt(38)
    p1.font.bold = True
    p1.font.color.rgb = PRIMARY

    p2 = tf_c.add_paragraph()
    p2.text = "Intelligent Academia–Industry Skill Mapping & Placement Platform"
    p2.font.size = Pt(18)
    p2.font.bold = True
    p2.font.color.rgb = DARK
    p2.space_before = Pt(8)

    # 3 Summary pill boxes
    pills = [
        ("Theme", "Open Innovation / Smart Education & Workforce"),
        ("Core Idea", "Bridging the Academia–Industry Chasm through Verified Skills"),
        ("Key Focus", "Cryptographic Logbooks • Explainable SRI • Real-Time Curriculum Gap Analytics")
    ]
    for lbl, val in pills:
        p = tf_c.add_paragraph()
        p.space_before = Pt(14)
        r1 = p.add_run()
        r1.text = f"{lbl.upper()}:  "
        r1.font.bold = True
        r1.font.size = Pt(12)
        r1.font.color.rgb = PRIMARY
        r2 = p.add_run()
        r2.text = val
        r2.font.size = Pt(12)
        r2.font.color.rgb = TEXT_DARK

    p_sub = tf_c.add_paragraph()
    p_sub.text = "GitHub: github.com/amangill1819"
    p_sub.font.size = Pt(11)
    p_sub.font.bold = True
    p_sub.font.color.rgb = TEXT_MUTED
    p_sub.space_before = Pt(20)

    add_footer(s1, 1)

    # =========================================================================
    # SLIDE 2: PROBLEM STATEMENT
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "1. Problem Statement", "A degree certifies coursework completion — not workplace operational readiness.")
    add_footer(s2, 2)

    # Left Container (The Reality & Friction)
    c_left = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.1))
    c_left.fill.solid()
    c_left.fill.fore_color.rgb = WHITE
    c_left.line.color.rgb = BORDER
    tf_l = c_left.text_frame
    tf_l.word_wrap = True
    tf_l.margin_left = tf_l.margin_right = Inches(0.3)
    tf_l.margin_top = Inches(0.25)

    p = tf_l.paragraphs[0]
    p.text = "The Real-World Dilemma"
    p.font.bold = True
    p.font.size = Pt(14)
    p.font.color.rgb = DARK

    points = [
        ("• Students graduate with high GPAs", " yet 78% lack hands-on operational competency in industry-grade tools."),
        ("• Paper logbooks & certificates", " are rampantly forged or backdated, leaving recruiters with zero trust in claims."),
        ("• Academic syllabi stay static", " for 3–5 years while industrial technologies and hiring demands shift every 6 months."),
        ("• Massive hiring friction", " costs recruiters 60+ days per entry-level role, sifting through hundreds of unvetted resumes.")
    ]
    for b1, b2 in points:
        p = tf_l.add_paragraph()
        p.space_before = Pt(10)
        r1 = p.add_run()
        r1.text = b1
        r1.font.bold = True
        r1.font.size = Pt(10.5)
        r1.font.color.rgb = PRIMARY
        r2 = p.add_run()
        r2.text = b2
        r2.font.size = Pt(10.5)
        r2.font.color.rgb = TEXT_DARK

    # Right Container (The Friction Loop & Question)
    c_right = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.5), Inches(5.733), Inches(5.1))
    c_right.fill.solid()
    c_right.fill.fore_color.rgb = ACCENT_RED_BG
    c_right.line.color.rgb = ACCENT_RED
    c_right.line.width = Pt(1.5)
    tf_r = c_right.text_frame
    tf_r.word_wrap = True
    tf_r.margin_left = tf_r.margin_right = Inches(0.35)
    tf_r.margin_top = Inches(0.25)

    p = tf_r.paragraphs[0]
    p.text = "The Broken Pipeline"
    p.font.bold = True
    p.font.size = Pt(14)
    p.font.color.rgb = ACCENT_RED

    flow_items = [
        "Static Curriculum & Theory-Heavy Teaching",
        "Unverified Internship Experience & Fake Letters",
        "Overwhelmed Recruiters & Keyword-Gamed Resumes",
        "High Candidate Rejection & 65+ Day Hiring Turnaround",
        "Graduates Left Underemployed; Deans Lack Gap Data"
    ]
    for idx, item in enumerate(flow_items):
        p = tf_r.add_paragraph()
        p.space_before = Pt(6)
        p.text = f"{idx + 1}.  {item}"
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_DARK
        if idx < len(flow_items) - 1:
            p_down = tf_r.add_paragraph()
            p_down.text = "     ↓"
            p_down.font.bold = True
            p_down.font.size = Pt(10)
            p_down.font.color.rgb = ACCENT_RED

    # Central question highlight
    q_box = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(5.6), Inches(11.333), Inches(0.85))
    q_box.fill.solid()
    q_box.fill.fore_color.rgb = DARK
    q_box.line.fill.background()
    p_q = q_box.text_frame.paragraphs[0]
    p_q.text = "🎯 The Central Question: How can practical competencies be cryptographically verified during internships, while providing institutions with real-time intelligence to align curricula?"
    p_q.font.bold = True
    p_q.font.size = Pt(11.5)
    p_q.font.color.rgb = WHITE
    p_q.alignment = PP_ALIGN.CENTER

    # =========================================================================
    # SLIDE 3: EXISTING SOLUTIONS & THE GAP
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "2. Existing Solutions & The Gap", "Current tools either list jobs or deliver courses — none unify verification and institutional feedback.")
    add_footer(s3, 3)

    cats = [
        ("Traditional Job Boards", "(LinkedIn, Indeed, Internshala)\n\n• Keyword-based matching easily gamed by buzzwords\n• Zero pre-interview skill verification\n• Disconnected from university curriculum improvement", PRIMARY),
        ("Campus Placement Portals", "(Superset, Handshake)\n\n• Transactional drive scheduling and CGPA cutoffs\n• No diagnostic skill gap analysis\n• No personalized learning or competency roadmaps", ACCENT_PURPLE),
        ("Online LMS & MOOCs", "(Coursera, Udemy, Moodle)\n\n• Video consumption & multiple choice quizzes\n• Badges lack correlation with real hands-on lab output\n• Disconnected from corporate hiring pipelines", ACCENT_AMBER)
    ]
    for idx, (title, desc, color) in enumerate(cats):
        bx = Inches(0.8 + idx * 4.0)
        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, bx, Inches(1.5), Inches(3.75), Inches(3.4))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = color
        card.line.width = Pt(1.5)
        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.2)
        tf.margin_top = Inches(0.18)
        p = tf.paragraphs[0]
        p.text = title
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = color
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = TEXT_DARK
        p2.space_before = Pt(6)

    # Identified Gap Banner
    gap_card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.15), Inches(11.733), Inches(1.45))
    gap_card.fill.solid()
    gap_card.fill.fore_color.rgb = ACCENT_GREEN_BG
    gap_card.line.color.rgb = ACCENT_GREEN
    gap_card.line.width = Pt(1.5)
    tf_g = gap_card.text_frame
    tf_g.margin_left = tf_g.margin_right = Inches(0.3)
    tf_g.margin_top = Inches(0.15)
    p = tf_g.paragraphs[0]
    p.text = "💡 The Identified Gap"
    p.font.bold = True
    p.font.size = Pt(12.5)
    p.font.color.rgb = DARK
    p2 = tf_g.add_paragraph()
    p2.text = "Existing platforms focus exclusively on organizing listings or hosting content. SkillBridge AI closes the loop by turning verified day-to-day internship logs into mathematical readiness vectors, providing immediate shortlisting for recruiters and dynamic curriculum gap heatmaps for college deans."
    p2.font.size = Pt(10)
    p2.font.color.rgb = TEXT_DARK
    p2.space_before = Pt(4)

    # =========================================================================
    # SLIDE 4: PROPOSED SOLUTION
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "3. Proposed Solution: SkillBridge AI", "A unified tri-party intelligence ecosystem for Students, Institutions, and Recruiters.")
    add_footer(s4, 4)

    # Left: The Paradigm Shift
    c4_l = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(5.7), Inches(5.1))
    c4_l.fill.solid()
    c4_l.fill.fore_color.rgb = WHITE
    c4_l.line.color.rgb = BORDER
    tf4_l = c4_l.text_frame
    tf4_l.word_wrap = True
    tf4_l.margin_left = tf4_l.margin_right = Inches(0.3)
    tf4_l.margin_top = Inches(0.25)

    p = tf4_l.paragraphs[0]
    p.text = "The Fundamental Paradigm Shift"
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = DARK

    shifts = [
        ("❌ Old Mindset: ", "“I have an engineering/medical degree with 8.2 CGPA.”\n(Subjective, theory-centric, non-verifiable)"),
        ("✅ SkillBridge Mindset: ", "“Ayush Sharma: 88% Skill Readiness Index for Quality Analyst role, backed by 180 mentor-verified clinical hours and QR verification.”\n(Objective, evidence-backed, tamper-proof)")
    ]
    for lbl, desc in shifts:
        p = tf4_l.add_paragraph()
        p.space_before = Pt(10)
        r1 = p.add_run()
        r1.text = lbl
        r1.font.bold = True
        r1.font.size = Pt(10.5)
        r1.font.color.rgb = ACCENT_RED if "Old" in lbl else ACCENT_GREEN
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(10)
        r2.font.color.rgb = TEXT_DARK

    p_rule = tf4_l.add_paragraph()
    p_rule.text = "\nCore Operating Principle:"
    p_rule.font.bold = True
    p_rule.font.size = Pt(11)
    p_rule.font.color.rgb = PRIMARY
    p_sub = tf4_l.add_paragraph()
    p_sub.text = "Real practical work remains the benchmark. Machine learning and cryptographic hashing provide an incorruptible feedback loop connecting students to high-matching roles."
    p_sub.font.size = Pt(9.5)
    p_sub.font.color.rgb = TEXT_MUTED

    # Right: The Core Idea Flow
    c4_r = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.5), Inches(5.733), Inches(5.1))
    c4_r.fill.solid()
    c4_r.fill.fore_color.rgb = LIGHT_BG
    c4_r.line.color.rgb = BORDER
    tf4_r = c4_r.text_frame
    tf4_r.word_wrap = True
    tf4_r.margin_left = tf4_r.margin_right = Inches(0.3)
    tf4_r.margin_top = Inches(0.2)

    p = tf4_r.paragraphs[0]
    p.text = "The Tri-Party Flow"
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = DARK

    tri_steps = [
        ("1. Student Internship Logging", "Daily lab & project tasks recorded in digital logbook."),
        ("2. Mentor Cryptographic Sign-Off", "Mentor validates hours; SHA-256 hash & QR generated."),
        ("3. Dense Semantic Vectorization", "Profiles transformed into 384-dimensional embeddings."),
        ("4. Explainable SRI Calculation", "Composite readiness score: Coursework + Labs + Quizzes."),
        ("5. Real-Time Opportunity Dispatch", "Sub-45ms candidate ranking; Curriculum gap alerts to Deans.")
    ]
    for st_title, st_desc in tri_steps:
        p = tf4_r.add_paragraph()
        p.space_before = Pt(6)
        r1 = p.add_run()
        r1.text = f"{st_title}: "
        r1.font.bold = True
        r1.font.size = Pt(10)
        r1.font.color.rgb = PRIMARY
        r2 = p.add_run()
        r2.text = st_desc
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = TEXT_DARK

    # =========================================================================
    # SLIDE 5: THE SKILL INTELLIGENCE LOOP
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, "The Skill Intelligence Loop", "Connecting continuous student activity with institutional reform and rapid corporate placement.")
    add_footer(s5, 5)

    steps_flow = [
        ("STUDENT ACTIVITY", "Coursework • Lab Tasks • Digital Logbook entries", PRIMARY),
        ("MENTOR VALIDATION", "Cryptographic sign-off • Tamper-proof QR token", ACCENT_PURPLE),
        ("AI VECTOR ENGINE", "Sentence-BERT embedding • pgvector cosine match", ACCENT_AMBER),
        ("PLACEMENT & AUDIT", "Instant candidate shortlist • Real-time Dean heatmap", ACCENT_GREEN)
    ]
    for idx, (title, desc, color) in enumerate(steps_flow):
        fx = Inches(0.8 + idx * 3.0)
        card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, fx, Inches(1.6), Inches(2.75), Inches(2.2))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = color
        card.line.width = Pt(1.5)
        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.15)
        tf.margin_top = Inches(0.2)
        p = tf.paragraphs[0]
        p.text = f"Step {idx + 1}\n{title}"
        p.font.bold = True
        p.font.size = Pt(11)
        p.font.color.rgb = color
        p.alignment = PP_ALIGN.CENTER
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(9)
        p2.font.color.rgb = TEXT_DARK
        p2.alignment = PP_ALIGN.CENTER
        p2.space_before = Pt(8)

    # 3 Layers breakdown banner below
    layers_box = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.1), Inches(11.733), Inches(2.5))
    layers_box.fill.solid()
    layers_box.fill.fore_color.rgb = LIGHT_BG
    layers_box.line.color.rgb = BORDER
    tf_l = layers_box.text_frame
    tf_l.word_wrap = True
    tf_l.margin_left = tf_l.margin_right = Inches(0.3)
    tf_l.margin_top = Inches(0.18)

    p = tf_l.paragraphs[0]
    p.text = "Architectural Pillars of the Closed Loop"
    p.font.bold = True
    p.font.size = Pt(12.5)
    p.font.color.rgb = DARK

    three_pillars = [
        ("Operational Layer (Students & Mentors): ", "Eliminates administrative paper trail with zero-friction daily logging and instant mentor mobile approvals."),
        ("Intelligence Layer (FastAPI & Sentence-BERT): ", "Continuously evaluates skill taxonomy, computes multi-factorial SRI scores, and identifies precise missing competencies."),
        ("Strategic Layer (Colleges & Recruiters): ", "Deans gain automated NAAC/NIRF curriculum reports; recruiters filter candidate pools with 91.4% top-5 accuracy.")
    ]
    for lbl, desc in three_pillars:
        p = tf_l.add_paragraph()
        p.space_before = Pt(6)
        r1 = p.add_run()
        r1.text = lbl
        r1.font.bold = True
        r1.font.size = Pt(10)
        r1.font.color.rgb = PRIMARY
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = TEXT_DARK

    # =========================================================================
    # SLIDE 6: KEY FEATURES
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "4. Key Features", "Purpose-built capabilities prioritizing measurable solutions over vanity metrics.")
    add_footer(s6, 6)

    features = [
        ("AI Skill Readiness Index (SRI)", "Objective 0–100% score (40% Coursework + 35% Lab Hours + 25% Assessments) eliminating subjective guessing.", PRIMARY),
        ("Verified Digital QR Logbook", "Mentor-signed daily internship hours with tamper-evident SHA-256 hash preventing fake credentials.", ACCENT_GREEN),
        ("Curriculum Gap Heatmap", "Real-time institutional analytics showing where syllabus coverage lags behind live recruiter demand.", ACCENT_PURPLE),
        ("Semantic Vector Matching", "Dense Sentence-BERT embeddings matching candidates with roles in < 45 ms based on applied skills.", ACCENT_AMBER),
        ("AI Resume Intelligence", "Automated PDF parsing and benchmarking that builds structured roadmaps to bridge specific skill gaps.", PRIMARY),
        ("Tri-Party Role Governance", "Unified platform with strict role-based access for Students, Mentors, College Deans, and Super Admins.", DARK)
    ]
    for idx, (title, desc, color) in enumerate(features):
        row = idx // 3
        col = idx % 3
        bx = Inches(0.8 + col * 4.0)
        by = Inches(1.5 + row * 2.6)
        card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, bx, by, Inches(3.75), Inches(2.35))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = color
        card.line.width = Pt(1.5)
        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.2)
        tf.margin_top = Inches(0.18)
        p = tf.paragraphs[0]
        p.text = title
        p.font.bold = True
        p.font.size = Pt(11.5)
        p.font.color.rgb = color
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(9)
        p2.font.color.rgb = TEXT_DARK
        p2.space_before = Pt(6)

    # =========================================================================
    # SLIDE 7: TECHNICAL APPROACH
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_header(s7, "5. Technical Approach", "Modular, scalable microservice architecture delivering high performance and verified security.")
    add_footer(s7, 7)

    # Architecture diagram box
    arch_box = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(11.733), Inches(5.1))
    arch_box.fill.solid()
    arch_box.fill.fore_color.rgb = WHITE
    arch_box.line.color.rgb = BORDER
    tf_a = arch_box.text_frame
    tf_a.word_wrap = True
    tf_a.margin_left = tf_a.margin_right = Inches(0.3)
    tf_a.margin_top = Inches(0.2)

    p = tf_a.paragraphs[0]
    p.text = "System Architecture & Core Pipelines"
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = DARK

    arch_sections = [
        ("1. Presentation Tier (React 19 + Tailwind CSS):", "Responsive SPA with dedicated student, faculty, and employer portals. Instant interactive dashboard with real-time SRI visualizations."),
        ("2. Service & Gateway Tier (FastAPI + Python 3.11):", "Asynchronous REST endpoints with Pydantic v2 data models, JWT stateless token authentication, and strict CORS governance."),
        ("3. AI & Embeddings Core (Sentence-Transformers):", "Encodes unstructured text into 384-dimensional dense vectors using all-MiniLM-L6-v2. Captures domain synonyms without expensive proprietary APIs."),
        ("4. Vector & Relational Storage (PostgreSQL + pgvector):", "Hybrid database combining standard relational schemas (users, logs, roles) with HNSW indexed vector embeddings for sub-45ms similarity searches."),
        ("5. Cryptographic Verification & Security:", "SHA-256 digest creation for verified logbooks, role-based access control (RBAC), and strict compliance with the Indian DPDP Act 2023.")
    ]
    for lbl, desc in arch_sections:
        p = tf_a.add_paragraph()
        p.space_before = Pt(8)
        r1 = p.add_run()
        r1.text = f"{lbl} "
        r1.font.bold = True
        r1.font.size = Pt(10)
        r1.font.color.rgb = PRIMARY
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = TEXT_DARK

    # =========================================================================
    # SLIDE 8: TECHNOLOGY STACK
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_header(s8, "6. Technology Stack", "Carefully selected technologies driven strictly by architectural requirements.")
    add_footer(s8, 8)

    stacks = [
        ("Frontend UI", "React 19 • Vite • Tailwind CSS\nLucide React • Responsive PWA\nUltra-fast HMR and seamless responsive interactions across devices.", PRIMARY),
        ("Backend Services", "Python 3.11 • FastAPI • Uvicorn\nPydantic v2 • python-jose\nAsynchronous high-throughput microservices with automatic Swagger API docs.", ACCENT_PURPLE),
        ("Database & Vector", "PostgreSQL 16 • Supabase\npgvector (HNSW Indexing)\nRelational consistency alongside sub-45ms approximate nearest neighbor matching.", ACCENT_AMBER),
        ("Machine Learning", "Sentence-Transformers\nall-MiniLM-L6-v2 (384-dim)\nPyTorch • PyPDF extraction\nSelf-hosted, cost-effective semantic embeddings with zero recurring API costs.", ACCENT_GREEN)
    ]
    for idx, (title, desc, color) in enumerate(stacks):
        bx = Inches(0.8 + idx * 3.0)
        card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, bx, Inches(1.5), Inches(2.75), Inches(3.6))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = color
        card.line.width = Pt(1.5)
        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.2)
        tf.margin_top = Inches(0.2)
        p = tf.paragraphs[0]
        p.text = title
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = color
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(9)
        p2.font.color.rgb = TEXT_DARK
        p2.space_before = Pt(8)

    # Design principle strip below
    dp_box = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.35), Inches(11.733), Inches(1.25))
    dp_box.fill.solid()
    dp_box.fill.fore_color.rgb = LIGHT_BG
    dp_box.line.color.rgb = BORDER
    tf_dp = dp_box.text_frame
    tf_dp.margin_left = tf_dp.margin_right = Inches(0.3)
    tf_dp.margin_top = Inches(0.12)
    p = tf_dp.paragraphs[0]
    p.text = "🎯 Core Architectural Principle"
    p.font.bold = True
    p.font.size = Pt(11)
    p.font.color.rgb = DARK
    p2 = tf_dp.add_paragraph()
    p2.text = "Problem → Requirement → Optimal Technology Choice. Every component in SkillBridge AI is chosen for deterministic performance, high data privacy, and zero reliance on expensive proprietary API subscriptions."
    p2.font.size = Pt(9.5)
    p2.font.color.rgb = TEXT_MUTED
    p2.space_before = Pt(2)

    # =========================================================================
    # SLIDE 9: FEASIBILITY, LIMITATIONS & IMPACT
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    add_header(s9, "7. Feasibility, Limitations & Impact", "Realistic deployment plan with honest risk assessment and measurable social value.")
    add_footer(s9, 9)

    cols = [
        ("Feasibility", 
         "• Proven open-source stack (FastAPI, pgvector, React)\n• Tested sub-45ms vector search across 500+ student profiles\n• Zero recurring commercial AI licensing costs\n• Lightweight container deployment on NIC Gov Cloud or AWS",
         PRIMARY),
        ("Limitations & Mitigations",
         "• Mentor Adoption Inertia: Solved via 1-click mobile approvals\n• Vocabulary Divergence: Solved via domain ontology mapping\n• Privacy & Compliance: Role-based access control and DPDP Act 2023 adherence",
         ACCENT_RED),
        ("Expected Impact",
         "• > 75% Reduction in recruitment turnaround (65 to <14 days)\n• 100% Elimination of fraudulent internship certificates\n• Equal opportunity for Tier-2/3 college students via objective SRI\n• Real-time syllabus alignment for 500+ institutions",
         ACCENT_GREEN)
    ]
    for idx, (title, desc, color) in enumerate(cols):
        bx = Inches(0.8 + idx * 4.0)
        card = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, bx, Inches(1.5), Inches(3.75), Inches(5.1))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = color
        card.line.width = Pt(1.5)
        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.2)
        tf.margin_top = Inches(0.2)
        p = tf.paragraphs[0]
        p.text = title
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = color
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = TEXT_DARK
        p2.space_before = Pt(8)

    # =========================================================================
    # SLIDE 10: THE CORE SHIFT
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    add_header(s10, "The Core Shift: Transforming Higher Ed Placement", "Moving from static credential claims to continuous verified competency.")
    add_footer(s10, 10)

    # Comparison Left (Traditional Approach)
    box_old = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.1))
    box_old.fill.solid()
    box_old.fill.fore_color.rgb = ACCENT_RED_BG
    box_old.line.color.rgb = ACCENT_RED
    tf_bo = box_old.text_frame
    tf_bo.word_wrap = True
    tf_bo.margin_left = tf_bo.margin_right = Inches(0.3)
    tf_bo.margin_top = Inches(0.25)

    p = tf_bo.paragraphs[0]
    p.text = "Traditional Campus Placement"
    p.font.bold = True
    p.font.size = Pt(14)
    p.font.color.rgb = ACCENT_RED

    old_items = [
        "Unverified paper certificates and internship letters",
        "Keyword-stuffed PDF resumes filtered by brittle ATS",
        "Subjective academic marks that hide lab deficits",
        "Syllabi updated once a decade; zero industry data",
        "Recruiters face 65+ day hiring cycles and high churn"
    ]
    for it in old_items:
        p = tf_bo.add_paragraph()
        p.space_before = Pt(10)
        p.text = f"❌  {it}"
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_DARK

    # Comparison Right (SkillBridge AI Approach)
    box_new = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.5), Inches(5.733), Inches(5.1))
    box_new.fill.solid()
    box_new.fill.fore_color.rgb = ACCENT_GREEN_BG
    box_new.line.color.rgb = ACCENT_GREEN
    tf_bn = box_new.text_frame
    tf_bn.word_wrap = True
    tf_bn.margin_left = tf_bn.margin_right = Inches(0.3)
    tf_bn.margin_top = Inches(0.25)

    p = tf_bn.paragraphs[0]
    p.text = "SkillBridge AI Ecosystem"
    p.font.bold = True
    p.font.size = Pt(14)
    p.font.color.rgb = ACCENT_GREEN

    new_items = [
        "Cryptographic QR logbooks signed by industry mentors",
        "Sentence-BERT semantic matching in < 45 milliseconds",
        "Explainable 0–100% Skill Readiness Index (SRI)",
        "Automated curriculum gap alerts delivered to college deans",
        "Pre-vetted day-1 ready interns hired in under 14 days"
    ]
    for it in new_items:
        p = tf_bn.add_paragraph()
        p.space_before = Pt(10)
        p.text = f"✅  {it}"
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_DARK

    # =========================================================================
    # SLIDE 11: THANK YOU & DISCUSSION
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    bg11 = s11.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg11.fill.solid()
    bg11.fill.fore_color.rgb = LIGHT_BG
    bg11.line.fill.background()

    card11 = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.0), Inches(11.333), Inches(5.5))
    card11.fill.solid()
    card11.fill.fore_color.rgb = WHITE
    card11.line.color.rgb = PRIMARY
    card11.line.width = Pt(2)
    tf11 = card11.text_frame
    tf11.word_wrap = True
    tf11.margin_left = tf11.margin_right = Inches(0.8)
    tf11.margin_top = Inches(0.8)

    p = tf11.paragraphs[0]
    p.text = "Thank You"
    p.font.bold = True
    p.font.size = Pt(36)
    p.font.color.rgb = PRIMARY

    p2 = tf11.add_paragraph()
    p2.text = "Questions & Judge Discussion"
    p2.font.bold = True
    p2.font.size = Pt(20)
    p2.font.color.rgb = DARK
    p2.space_before = Pt(8)

    p3 = tf11.add_paragraph()
    p3.text = "SkillBridge AI  •  Team Repository: github.com/amangill1819"
    p3.font.size = Pt(12)
    p3.font.color.rgb = TEXT_MUTED
    p3.space_before = Pt(12)

    # Judge Prompts Box
    prompts_box = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.8), Inches(3.8), Inches(9.733), Inches(2.0))
    prompts_box.fill.solid()
    prompts_box.fill.fore_color.rgb = LIGHT_BG
    prompts_box.line.color.rgb = BORDER
    tf_pb = prompts_box.text_frame
    tf_pb.margin_left = tf_pb.margin_right = Inches(0.3)
    tf_pb.margin_top = Inches(0.18)
    
    p = tf_pb.paragraphs[0]
    p.text = "Key Judge Discussion Topics:"
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = DARK

    topics = [
        "1. Why this problem? — Bridging the trillion-dollar gap between academic theory and operational workforce readiness.",
        "2. Why this approach? — Combining verifiable cryptographic logbooks with dense vector embeddings ensures trust & speed.",
        "3. What are the trade-offs? — Lightweight self-hosted NLP avoids SaaS latency & vendor lock-in while maintaining strict data privacy."
    ]
    for t in topics:
        p = tf_pb.add_paragraph()
        p.space_before = Pt(4)
        p.text = t
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_DARK

    add_footer(s11, 11)

    # Save Presentation
    output_filename = "SkillBridge_AI_Ideathon_Pitch_Deck.pptx"
    prs.save(output_filename)
    print(f"Successfully generated {output_filename} with {len(prs.slides)} slides.")

if __name__ == "__main__":
    create_ideathon_deck()
