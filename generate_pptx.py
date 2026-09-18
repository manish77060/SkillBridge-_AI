import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.dml.color import RGBColor

def create_deck():
    prs = Presentation()
    # Set slide dimensions to 16:9 widescreen (13.333 x 7.5 inches)
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    
    # Blank slide layout
    blank_layout = prs.slide_layouts[6]
    
    # Color palette
    BG_LIGHT = RGBColor(248, 250, 252)       # #F8FAFC
    CARD_BG = RGBColor(255, 255, 255)        # #FFFFFF
    CARD_BORDER = RGBColor(226, 232, 240)    # #E2E8F0
    CARD_MUTED = RGBColor(241, 245, 249)     # #F1F5F9
    
    TEXT_DARK = RGBColor(15, 23, 42)         # #0F172A
    TEXT_MUTED = RGBColor(100, 116, 139)     # #64748B
    TEXT_LIGHT = RGBColor(148, 163, 184)     # #94A3B8
    
    INDIGO = RGBColor(79, 70, 229)           # #4F46E5
    INDIGO_BG = RGBColor(238, 242, 255)      # #EEF2FF
    
    EMERALD = RGBColor(16, 185, 129)         # #10B981
    EMERALD_BG = RGBColor(236, 253, 245)     # #ECFDF5
    
    AMBER = RGBColor(217, 119, 6)            # #D97706
    AMBER_BG = RGBColor(254, 243, 199)       # #FEF3C7
    
    ROSE = RGBColor(225, 29, 72)             # #E11D48
    ROSE_BG = RGBColor(255, 241, 242)        # #FFF1F2
    
    VIOLET = RGBColor(124, 58, 237)          # #7C3AED

    def add_bg(slide, bg_color=BG_LIGHT):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = bg_color
        bg.line.fill.background()

    def add_header(slide, badge_text, badge_color, slide_title, subtitle=""):
        # Header Badge
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.4), Inches(3.2), Inches(0.35))
        badge.fill.solid()
        badge.fill.fore_color.rgb = badge_color
        badge.line.fill.background()
        tf = badge.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = badge_text.upper()
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = RGBColor(255, 255, 255)
        p.alignment = PP_ALIGN.CENTER
        
        # Sub badge / Team name
        team_box = slide.shapes.add_textbox(Inches(9.5), Inches(0.35), Inches(3.0), Inches(0.4))
        p_team = team_box.text_frame.paragraphs[0]
        p_team.text = "TEAM APEX | SkillBridge AI"
        p_team.font.size = Pt(11)
        p_team.font.bold = True
        p_team.font.color.rgb = INDIGO
        p_team.alignment = PP_ALIGN.RIGHT

        # Slide Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(11.7), Inches(0.8))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_t = tf_title.paragraphs[0]
        p_t.text = slide_title
        p_t.font.size = Pt(26)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_DARK
        
        if subtitle:
            p_sub = tf_title.add_paragraph()
            p_sub.text = subtitle
            p_sub.font.size = Pt(13)
            p_sub.font.color.rgb = TEXT_MUTED

    def add_footer(slide, slide_num, total_slides=11):
        footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(6.9), Inches(11.7), Inches(0.4))
        p = footer_box.text_frame.paragraphs[0]
        p.text = f"SkillBridge AI — Team Apex • Dehradun Hackathon 2026                                                                    Slide {slide_num:02d} / {total_slides:02d}"
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_MUTED

    # -------------------------------------------------------------
    # SLIDE 1: TITLE SLIDE
    # -------------------------------------------------------------
    slide1 = prs.slides.add_slide(blank_layout)
    add_bg(slide1, RGBColor(248, 250, 252))
    
    # Top pill
    pill = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.8), Inches(4.5), Inches(0.4))
    pill.fill.solid()
    pill.fill.fore_color.rgb = INDIGO_BG
    pill.line.color.rgb = INDIGO
    tf = pill.text_frame
    p = tf.paragraphs[0]
    p.text = "🚀 ROUND 1 PITCH DECK • DEHRADUN HACKATHON 2026"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = INDIGO
    p.alignment = PP_ALIGN.CENTER

    # Title
    t_box = slide1.shapes.add_textbox(Inches(0.8), Inches(1.4), Inches(11.7), Inches(1.5))
    tf = t_box.text_frame
    p = tf.paragraphs[0]
    p.text = "SkillBridge AI"
    p.font.size = Pt(54)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    
    p2 = tf.add_paragraph()
    p2.text = "The academia–industry collaboration portal: one AI-driven platform that unifies skill mapping, verified internships, and placement for Students, Recruiters, and Institutions."
    p2.font.size = Pt(18)
    p2.font.color.rgb = TEXT_MUTED
    p2.space_before = Pt(10)

    # 3 Pillar Cards on Title Slide
    pillars = [
        ("🎓 Student Workspace", "AI Readiness Gauge, Skill Matrix & Learning Path", INDIGO),
        ("💼 Industry Suite", "AI Ranked Talent Search & 2-Round Screen", EMERALD),
        ("🏛️ Institution Hub", "Placement Analytics & Curriculum Gap Maps", AMBER),
    ]
    for i, (title, desc, color) in enumerate(pillars):
        x = Inches(0.8 + i * 4.0)
        y = Inches(3.8)
        w = Inches(3.7)
        h = Inches(2.2)
        
        card = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER
        
        # Color top bar
        top_bar = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, Inches(0.12))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = color
        top_bar.line.fill.background()
        
        tb = slide1.shapes.add_textbox(x + Inches(0.2), y + Inches(0.3), w - Inches(0.4), h - Inches(0.4))
        p = tb.text_frame.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = TEXT_DARK
        
        p_desc = tb.text_frame.add_paragraph()
        p_desc.text = desc
        p_desc.font.size = Pt(12)
        p_desc.font.color.rgb = TEXT_MUTED
        p_desc.space_before = Pt(8)

    add_footer(slide1, 1)

    # -------------------------------------------------------------
    # SLIDE 2: PROBLEM STATEMENT
    # -------------------------------------------------------------
    slide2 = prs.slides.add_slide(blank_layout)
    add_bg(slide2)
    add_header(slide2, "Problem Statement", INDIGO, "The Academia–Industry Disconnect in Campus Hiring", "Structural friction preventing regional technical talent from connecting with employers")

    problems = [
        ("1. No Shared Skill-Mapping Standard", "Academia measures capability via marks and credits; industry measures it via role-fit and code readiness. Without a unified skill map, both sides guess at readiness.", INDIGO),
        ("2. Internships Sourced by Cold Outreach", "Placement cells and students chase internships manually company-by-company, while recruiters struggle to discover verified talent outside tier-1 metros.", EMERALD),
        ("3. Placement is Tracked, Not Managed", "Institutions log placement outcomes after the fact in static spreadsheets, with zero live analytics connecting student learning activity to recruiter decisions.", AMBER),
        ("4. No Single Tri-Party Portal Exists", "Students use job boards, recruiters use bloated ATS tools, and colleges use spreadsheets — creating disconnected silos that waste talent and time.", ROSE)
    ]

    for i, (title, desc, color) in enumerate(problems):
        col = i % 2
        row = i // 2
        x = Inches(0.8 + col * 5.9)
        y = Inches(2.0 + row * 2.3)
        w = Inches(5.6)
        h = Inches(2.0)

        card = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER

        side_bar = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(0.12), h)
        side_bar.fill.solid()
        side_bar.fill.fore_color.rgb = color
        side_bar.line.fill.background()

        tb = slide2.shapes.add_textbox(x + Inches(0.3), y + Inches(0.2), w - Inches(0.5), h - Inches(0.4))
        p = tb.text_frame.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = TEXT_DARK

        p_desc = tb.text_frame.add_paragraph()
        p_desc.text = desc
        p_desc.font.size = Pt(11)
        p_desc.font.color.rgb = TEXT_MUTED
        p_desc.space_before = Pt(6)

    add_footer(slide2, 2)

    # -------------------------------------------------------------
    # SLIDE 3: PROPOSED SOLUTION & FLOWCHART
    # -------------------------------------------------------------
    slide3 = prs.slides.add_slide(blank_layout)
    add_bg(slide3)
    add_header(slide3, "Proposed Solution & Pipeline", EMERALD, "One Unified Ecosystem: Academia & Industry, One Pipeline", "Replacing fragmented tools with a real-time tri-sided platform powered by a shared skill graph")

    # FLOWCHART CONTAINER
    fc_bg = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.0), Inches(11.733), Inches(2.2))
    fc_bg.fill.solid()
    fc_bg.fill.fore_color.rgb = CARD_BG
    fc_bg.line.color.rgb = CARD_BORDER

    # Flowchart Nodes
    nodes = [
        ("🎓 Student Profile", "Resume & Skill Vectors", Inches(1.2), INDIGO_BG, INDIGO),
        ("➔", "", Inches(3.9), None, TEXT_MUTED),
        ("⚡ SkillBridge AI Engine", "Skill Gap Scoring & Matching", Inches(4.5), EMERALD_BG, EMERALD),
        ("➔", "", Inches(7.5), None, TEXT_MUTED),
        ("💼 Recruiter Suite\n🏛️ Institution Hub", "Ranked Talent & Curriculum Gap", Inches(8.1), AMBER_BG, AMBER),
    ]

    for title, sub, x, bg, border_col in nodes:
        if sub:
            box = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.3), Inches(2.6), Inches(1.6))
            box.fill.solid()
            box.fill.fore_color.rgb = bg
            box.line.color.rgb = border_col
            tb = box.text_frame
            tb.word_wrap = True
            p = tb.paragraphs[0]
            p.text = title
            p.font.size = Pt(13)
            p.font.bold = True
            p.font.color.rgb = TEXT_DARK
            p.alignment = PP_ALIGN.CENTER
            
            p_sub = tb.add_paragraph()
            p_sub.text = sub
            p_sub.font.size = Pt(10)
            p_sub.font.color.rgb = TEXT_MUTED
            p_sub.alignment = PP_ALIGN.CENTER
            p_sub.space_before = Pt(4)
        else:
            arr = slide3.shapes.add_textbox(x, Inches(2.8), Inches(0.5), Inches(0.6))
            p = arr.text_frame.paragraphs[0]
            p.text = title
            p.font.size = Pt(24)
            p.font.bold = True
            p.font.color.rgb = border_col
            p.alignment = PP_ALIGN.CENTER

    # 3 Bottom Columns
    cols = [
        ("Student Workspace", "• AI Readiness Score Gauge\n• Real-Time Opportunity Match %\n• Integrated Learning & Certifications", INDIGO),
        ("Industry & Hiring Suite", "• 5-Stage Kanban Hiring Pipeline\n• Automated 2-Round Assessment\n• AI-Ranked Talent Search", EMERALD),
        ("Institution Hub", "• Department Placement Analytics\n• Student Readiness Dossiers\n• Curriculum Gap Recommendations", AMBER)
    ]
    for i, (ctitle, cdesc, color) in enumerate(cols):
        x = Inches(0.8 + i * 4.0)
        y = Inches(4.5)
        w = Inches(3.7)
        h = Inches(2.2)

        cbox = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        cbox.fill.solid()
        cbox.fill.fore_color.rgb = CARD_BG
        cbox.line.color.rgb = CARD_BORDER

        bar = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, Inches(0.1))
        bar.fill.solid()
        bar.fill.fore_color.rgb = color
        bar.line.fill.background()

        tb = slide3.shapes.add_textbox(x + Inches(0.2), y + Inches(0.2), w - Inches(0.4), h - Inches(0.3))
        p = tb.text_frame.paragraphs[0]
        p.text = ctitle
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = TEXT_DARK

        p_d = tb.text_frame.add_paragraph()
        p_d.text = cdesc
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = TEXT_MUTED
        p_d.space_before = Pt(6)

    add_footer(slide3, 3)

    # -------------------------------------------------------------
    # SLIDE 4: INNOVATION & UNIQUENESS
    # -------------------------------------------------------------
    slide4 = prs.slides.add_slide(blank_layout)
    add_bg(slide4)
    add_header(slide4, "Innovation & Uniqueness", VIOLET, "Why SkillBridge Beats Generic Job Boards & LMSs", "Connecting learning and hiring into a single closed-loop engine")

    innovations = [
        ("01. One Skill Graph, 3 Lenses", "The same verified skill dataset powers student readiness, recruiter search, and institute curriculum insights.", INDIGO),
        ("02. AI Reads Gap, Not Just Resume", "Compares candidate skills against target job roles to output a personalized action plan.", EMERALD),
        ("03. Built-in 2-Round Hiring Engine", "Timed MCQ screening with negative marking gating an automated live coding challenge.", AMBER),
        ("04. Closed-Loop Feedback System", "Institutions see exactly which technical skills cause candidate rejection, feeding data to curriculum decisions.", VIOLET),
        ("05. Learning Tied to Outcomes", "Completing targeted micro-courses instantly updates candidate readiness scores and recruiter rankings.", INDIGO),
        ("06. Recruiter-Grade Match Score", "Students see exact transparent AI match percentages (e.g. 94% fit) identical to recruiter views.", ROSE)
    ]

    for i, (title, desc, color) in enumerate(innovations):
        col = i % 3
        row = i // 3
        x = Inches(0.8 + col * 4.0)
        y = Inches(2.0 + row * 2.3)
        w = Inches(3.733)
        h = Inches(2.1)

        card = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER

        top_b = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, Inches(0.1))
        top_b.fill.solid()
        top_b.fill.fore_color.rgb = color
        top_b.line.fill.background()

        tb = slide4.shapes.add_textbox(x + Inches(0.2), y + Inches(0.2), w - Inches(0.4), h - Inches(0.3))
        p = tb.text_frame.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = TEXT_DARK

        p_desc = tb.text_frame.add_paragraph()
        p_desc.text = desc
        p_desc.font.size = Pt(11)
        p_desc.font.color.rgb = TEXT_MUTED
        p_desc.space_before = Pt(6)

    add_footer(slide4, 4)

    # -------------------------------------------------------------
    # SLIDE 5: TARGET USERS
    # -------------------------------------------------------------
    slide5 = prs.slides.add_slide(blank_layout)
    add_bg(slide5)
    add_header(slide5, "Target Users & Stakeholders", INDIGO, "Built for the 3 Stakeholders Every Placement Depends On", "Custom-aligned solutions for students, hiring companies, and university placement cells")

    users = [
        ("👨‍🎓 Students & Job Seekers", "Engineering, CS & Technical Graduates", [
            "Pain Point: Unsure which technical skills employers demand.",
            "Solution: Live Skill Matrix, AI readiness score, targeted learning.",
            "Value: Direct path to verified internships without cold emails."
        ], INDIGO),
        ("💼 Recruiters & Employers", "Startups, Tech Firms & Enterprises", [
            "Pain Point: Sifting through hundreds of unverified resume PDFs.",
            "Solution: AI talent ranking + automated 2-round assessment.",
            "Value: 70% reduction in time-to-hire with pre-evaluated code."
        ], EMERALD),
        ("🏛️ Institutions & Placement Cells", "Colleges, Universities & TPO Cells", [
            "Pain Point: Spreadsheet tracking and manual recruiter outreach.",
            "Solution: Live placement analytics & curriculum gap insights.",
            "Value: Higher placement rates & market-aligned course planning."
        ], AMBER)
    ]

    for i, (title, sub, bullets, color) in enumerate(users):
        x = Inches(0.8 + i * 4.0)
        y = Inches(2.0)
        w = Inches(3.733)
        h = Inches(4.6)

        card = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER

        tbar = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, Inches(0.12))
        tbar.fill.solid()
        tbar.fill.fore_color.rgb = color
        tbar.line.fill.background()

        tb = slide5.shapes.add_textbox(x + Inches(0.25), y + Inches(0.3), w - Inches(0.5), h - Inches(0.5))
        p = tb.text_frame.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = TEXT_DARK

        p_sub = tb.text_frame.add_paragraph()
        p_sub.text = sub
        p_sub.font.size = Pt(11)
        p_sub.font.bold = True
        p_sub.font.color.rgb = color
        p_sub.space_before = Pt(4)

        for b in bullets:
            pb = tb.text_frame.add_paragraph()
            pb.text = "• " + b
            pb.font.size = Pt(11)
            pb.font.color.rgb = TEXT_MUTED
            pb.space_before = Pt(10)

    add_footer(slide5, 5)

    # -------------------------------------------------------------
    # SLIDE 6: TECHNICAL ARCHITECTURE & FLOWCHART
    # -------------------------------------------------------------
    slide6 = prs.slides.add_slide(blank_layout)
    add_bg(slide6)
    add_header(slide6, "Technical Architecture", INDIGO, "Real-Time, AI-Native System Architecture", "Production-ready stack built for low-latency scoring and instant multi-portal synchronization")

    # Flowchart diagram
    arch_bg = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.0), Inches(11.733), Inches(2.2))
    arch_bg.fill.solid()
    arch_bg.fill.fore_color.rgb = CARD_MUTED
    arch_bg.line.color.rgb = CARD_BORDER

    arch_nodes = [
        ("Frontend Layer", "React 19 / Vite", "Single Session Multi-Portal", Inches(1.1), INDIGO),
        ("API & AI Service", "FastAPI + Skill AI", "Skill Extraction & Matching", Inches(4.0), EMERALD),
        ("Data & Realtime", "Supabase / Postgres", "Row-Level Security & Realtime", Inches(6.9), AMBER),
        ("Assessment Engine", "2-Round Gated Suite", "Timed MCQ + Code Evaluator", Inches(9.8), VIOLET),
    ]

    for l_title, l_tech, l_desc, x, col in arch_nodes:
        abox = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.25), Inches(2.5), Inches(1.7))
        abox.fill.solid()
        abox.fill.fore_color.rgb = CARD_BG
        abox.line.color.rgb = col
        tb = abox.text_frame
        tb.word_wrap = True
        
        p = tb.paragraphs[0]
        p.text = l_title.upper()
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = col
        p.alignment = PP_ALIGN.CENTER
        
        p2 = tb.add_paragraph()
        p2.text = l_tech
        p2.font.size = Pt(13)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_DARK
        p2.alignment = PP_ALIGN.CENTER
        p2.space_before = Pt(4)
        
        p3 = tb.add_paragraph()
        p3.text = l_desc
        p3.font.size = Pt(9)
        p3.font.color.rgb = TEXT_MUTED
        p3.alignment = PP_ALIGN.CENTER
        p3.space_before = Pt(4)

    # 4 Detail Cards
    details = [
        ("Experience Layer", "Responsive SPA with instant role switching between Student, Industry, and Institution views."),
        ("AI / Matching Engine", "Resume skill extraction, role-specific gap scoring, and natural language recommendations."),
        ("Realtime Storage", "Single source of truth via Supabase Postgres — applications sync instantly across portals."),
        ("Assessment Engine", "Automated timed test execution with negative marking cutoff gating code submissions.")
    ]
    for i, (dtitle, ddesc) in enumerate(details):
        x = Inches(0.8 + i * 3.0)
        y = Inches(4.5)
        w = Inches(2.733)
        h = Inches(2.2)

        dcard = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        dcard.fill.solid()
        dcard.fill.fore_color.rgb = CARD_BG
        dcard.line.color.rgb = CARD_BORDER

        tb = slide6.shapes.add_textbox(x + Inches(0.15), y + Inches(0.2), w - Inches(0.3), h - Inches(0.3))
        p = tb.text_frame.paragraphs[0]
        p.text = dtitle
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = TEXT_DARK

        p_d = tb.text_frame.add_paragraph()
        p_d.text = ddesc
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = TEXT_MUTED
        p_d.space_before = Pt(6)

    add_footer(slide6, 6)

    # -------------------------------------------------------------
    # SLIDE 7: FEASIBILITY & WORKING DEMO
    # -------------------------------------------------------------
    slide7 = prs.slides.add_slide(blank_layout)
    add_bg(slide7)
    add_header(slide7, "Feasibility & Live Prototype", EMERALD, "Not Just a Concept — A Working Live Product", "Functional full-stack web application ready for live judge evaluation in Round 2")

    # Left visual card
    left_card = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.0), Inches(6.5), Inches(4.6))
    left_card.fill.solid()
    left_card.fill.fore_color.rgb = CARD_BG
    left_card.line.color.rgb = CARD_BORDER

    tb_left = slide7.shapes.add_textbox(Inches(1.1), Inches(2.2), Inches(5.9), Inches(4.2))
    p = tb_left.text_frame.paragraphs[0]
    p.text = "💻 LIVE STUDENT DASHBOARD PROTOTYPE"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = INDIGO

    stats_summary = [
        ("Career Readiness Score", "78 / 100", INDIGO),
        ("Verified Skills Logged", "12 Skills (+3 this mo)", EMERALD),
        ("AI Opportunity Matches", "24 Active Roles", AMBER)
    ]
    for title, val, color in stats_summary:
        p_st = tb_left.text_frame.add_paragraph()
        p_st.text = f"• {title}: {val}"
        p_st.font.size = Pt(13)
        p_st.font.bold = True
        p_st.font.color.rgb = color
        p_st.space_before = Pt(12)

    p_ai = tb_left.text_frame.add_paragraph()
    p_ai.text = '\n⚡ AI Skill Insight Generator Output:\n"Your Java and SQL baseline is strong. Adding Spring Boot and Docker will increase your readiness score for Backend Intern roles by +16%."'
    p_ai.font.size = Pt(11)
    p_ai.font.color.rgb = TEXT_MUTED
    p_ai.space_before = Pt(10)

    # Right Checklist Cards
    checklists = [
        ("✓ 3 Portals Live Today", "Seamless switching across Student Workspace, Industry Suite, and Institute Hub.", INDIGO),
        ("✓ Real Backend Synchronization", "Supabase Auth + Postgres + Realtime subscriptions — live data, not static mockups.", EMERALD),
        ("✓ Gated 2-Round Assessment Engine", "Round 1 MCQ cutoff unlocks Round 2 multi-language coding evaluations automatically.", AMBER),
        ("✓ Demo Mode Credentials Ready", "Pre-configured accounts for hackathon judges to test every role live in Round 2.", ROSE)
    ]

    for i, (title, desc, color) in enumerate(checklists):
        y = Inches(2.0 + i * 1.15)
        rcard = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.6), y, Inches(4.933), Inches(1.05))
        rcard.fill.solid()
        rcard.fill.fore_color.rgb = CARD_BG
        rcard.line.color.rgb = CARD_BORDER

        rbar = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.6), y, Inches(0.1), Inches(1.05))
        rbar.fill.solid()
        rbar.fill.fore_color.rgb = color
        rbar.line.fill.background()

        tb_r = slide7.shapes.add_textbox(Inches(7.85), y + Inches(0.1), Inches(4.5), Inches(0.85))
        p = tb_r.text_frame.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = TEXT_DARK

        p_sub = tb_r.text_frame.add_paragraph()
        p_sub.text = desc
        p_sub.font.size = Pt(10)
        p_sub.font.color.rgb = TEXT_MUTED
        p_sub.space_before = Pt(2)

    add_footer(slide7, 7)

    # -------------------------------------------------------------
    # SLIDE 8: EXPECTED IMPACT & METRICS
    # -------------------------------------------------------------
    slide8 = prs.slides.add_slide(blank_layout)
    add_bg(slide8)
    add_header(slide8, "Expected Impact & Metrics", INDIGO, "Quantifiable Impact Across Every Placement Dimension", "Eliminating placement inefficiencies with measurable speed, accuracy, and engagement gains")

    # 4 Stat Callout Cards
    stats = [
        ("94%", "MATCH PRECISION", "AI job-role compatibility accuracy for candidates", INDIGO, INDIGO_BG),
        ("60%", "SCREENING CUTOFF", "Automated pre-filtering before manual recruiter interview", EMERALD, EMERALD_BG),
        ("3", "UNIFIED PORTALS", "Student, Recruiter, and Institution aligned on one graph", AMBER, AMBER_BG),
        ("100%", "REAL-TIME SYNC", "Instant updates on readiness scores and hiring status", VIOLET, INDIGO_BG)
    ]

    for i, (num, label, sub, color, bg) in enumerate(stats):
        x = Inches(0.8 + i * 3.0)
        y = Inches(2.0)
        w = Inches(2.733)
        h = Inches(2.4)

        card = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        card.fill.solid()
        card.fill.fore_color.rgb = bg
        card.line.color.rgb = color

        tb = slide8.shapes.add_textbox(x + Inches(0.1), y + Inches(0.2), w - Inches(0.2), h - Inches(0.4))
        p = tb.text_frame.paragraphs[0]
        p.text = num
        p.font.size = Pt(44)
        p.font.bold = True
        p.font.color.rgb = color
        p.alignment = PP_ALIGN.CENTER

        p_l = tb.text_frame.add_paragraph()
        p_l.text = label
        p_l.font.size = Pt(11)
        p_l.font.bold = True
        p_l.font.color.rgb = TEXT_DARK
        p_l.alignment = PP_ALIGN.CENTER
        p_l.space_before = Pt(4)

        p_s = tb.text_frame.add_paragraph()
        p_s.text = sub
        p_s.font.size = Pt(9)
        p_s.font.color.rgb = TEXT_MUTED
        p_s.alignment = PP_ALIGN.CENTER
        p_s.space_before = Pt(4)

    # 3 Summary Rows Below
    summaries = [
        ("🎓 For Students", "Stop guessing required technical skills; follow verified action plans.", INDIGO),
        ("💼 For Recruiters", "Interview only pre-evaluated candidates clearing test cutoffs.", EMERALD),
        ("🏛️ For Institutions", "Transform placement reports into live curriculum feedback loops.", AMBER)
    ]

    for i, (stitle, sdesc, color) in enumerate(summaries):
        x = Inches(0.8 + i * 4.0)
        y = Inches(4.7)
        w = Inches(3.733)
        h = Inches(1.9)

        scard = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        scard.fill.solid()
        scard.fill.fore_color.rgb = CARD_BG
        scard.line.color.rgb = CARD_BORDER

        sbar = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(0.1), h)
        sbar.fill.solid()
        sbar.fill.fore_color.rgb = color
        sbar.line.fill.background()

        tb = slide8.shapes.add_textbox(x + Inches(0.25), y + Inches(0.2), w - Inches(0.4), h - Inches(0.4))
        p = tb.text_frame.paragraphs[0]
        p.text = stitle
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = TEXT_DARK

        p_d = tb.text_frame.add_paragraph()
        p_d.text = sdesc
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = TEXT_MUTED
        p_d.space_before = Pt(6)

    add_footer(slide8, 8)

    # -------------------------------------------------------------
    # SLIDE 9: SCALABILITY ROADMAP & FLOWCHART
    # -------------------------------------------------------------
    slide9 = prs.slides.add_slide(blank_layout)
    add_bg(slide9)
    add_header(slide9, "Scalability Roadmap", INDIGO, "Designed to Scale: Dehradun Pilot to National Network", "Architected for multi-tenant scalability — expanding seamlessly across institutional networks")

    phases = [
        ("PHASE 1 • NOW", "Dehradun Pilot", "3 portals live on Supabase; role-based auth; shared skill graph; demo ready.", "Focus: Dehradun & UTU Colleges", INDIGO),
        ("PHASE 2 • NEXT", "Statewide Rollout", "Multi-tenant college onboarding; bulk student ingestion; configurable test banks.", "Focus: Uttarakhand Technical System", EMERALD),
        ("PHASE 3 • THEN", "Recruiter Network", "Open Industry Suite to verified tech recruiters at scale; ATS integrations.", "Focus: Pan-India Tech & Startups", AMBER),
        ("PHASE 4 • LATER", "National Intelligence", "Aggregate anonymized skill-gap trends across states to guide national policy.", "Focus: Pan-India Workforce Policy", VIOLET)
    ]

    for i, (badge, title, desc, focus, color) in enumerate(phases):
        x = Inches(0.8 + i * 3.0)
        y = Inches(2.0)
        w = Inches(2.733)
        h = Inches(4.6)

        pcard = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        pcard.fill.solid()
        pcard.fill.fore_color.rgb = CARD_BG
        pcard.line.color.rgb = CARD_BORDER

        top_b = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, Inches(0.12))
        top_b.fill.solid()
        top_b.fill.fore_color.rgb = color
        top_b.line.fill.background()

        tb = slide9.shapes.add_textbox(x + Inches(0.2), y + Inches(0.3), w - Inches(0.4), h - Inches(0.5))
        p = tb.text_frame.paragraphs[0]
        p.text = badge
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = color

        p_t = tb.text_frame.add_paragraph()
        p_t.text = title
        p_t.font.size = Pt(16)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_DARK
        p_t.space_before = Pt(8)

        p_d = tb.text_frame.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = TEXT_MUTED
        p_d.space_before = Pt(10)

        p_f = tb.text_frame.add_paragraph()
        p_f.text = "\n📍 " + focus
        p_f.font.size = Pt(10)
        p_f.font.bold = True
        p_f.font.color.rgb = TEXT_DARK

    add_footer(slide9, 9)

    # -------------------------------------------------------------
    # SLIDE 10: PRODUCT & STARTUP POTENTIAL
    # -------------------------------------------------------------
    slide10 = prs.slides.add_slide(blank_layout)
    add_bg(slide10)
    add_header(slide10, "Product & Startup Potential", EMERALD, "A Three-Sided Marketplace with Recurring Revenue", "Sustainable business model aligned with value creation for every user persona")

    models = [
        ("🏛️ Institutions & Colleges", "Annual SaaS License", "Per-seat annual SaaS subscription for placement cells: access to analytics, student dossiers, and curriculum gap reports.", AMBER),
        ("💼 Recruiters & Employers", "Subscription + Success Fee", "Hiring suite subscription + success fee per verified talent hire via the automated 2-round assessment engine.", EMERALD),
        ("🎓 Students & Job Seekers", "Freemium + Pro Track", "Freemium core skill profile & matching, with premium advanced skill paths, interview prep, and micro-certifications.", INDIGO)
    ]

    for i, (title, sub, desc, color) in enumerate(models):
        x = Inches(0.8 + i * 4.0)
        y = Inches(2.0)
        w = Inches(3.733)
        h = Inches(2.4)

        mcard = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        mcard.fill.solid()
        mcard.fill.fore_color.rgb = CARD_BG
        mcard.line.color.rgb = CARD_BORDER

        side_b = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(0.1), h)
        side_b.fill.solid()
        side_b.fill.fore_color.rgb = color
        side_b.line.fill.background()

        tb = slide10.shapes.add_textbox(x + Inches(0.25), y + Inches(0.2), w - Inches(0.4), h - Inches(0.4))
        p = tb.text_frame.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = TEXT_DARK

        p_s = tb.text_frame.add_paragraph()
        p_s.text = sub
        p_s.font.size = Pt(11)
        p_s.font.bold = True
        p_s.font.color.rgb = color
        p_s.space_before = Pt(4)

        p_d = tb.text_frame.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = TEXT_MUTED
        p_d.space_before = Pt(6)

    # Defensibility Moat Bottom Card
    moat_card = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.7), Inches(11.733), Inches(1.9))
    moat_card.fill.solid()
    moat_card.fill.fore_color.rgb = CARD_BG
    moat_card.line.color.rgb = CARD_BORDER

    tb_m = slide10.shapes.add_textbox(Inches(1.1), Inches(4.8), Inches(11.1), Inches(1.7))
    p = tb_m.text_frame.paragraphs[0]
    p.text = "🛡️ WHY SKILLBRIDGE IS A SUSTAINABLE VENTURE, NOT JUST A HACKATHON PROJECT"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = INDIGO

    moat_bullets = [
        "Network Effects: Each new college brings verified talent recruiters want.",
        "Data Moat: Proprietary skill-gap & outcome dataset unavailable on static job boards.",
        "Expansion Path: Campus ➔ State Level ➔ Pan-India Workforce Intelligence Platform.",
        "Working Prototype: Full-stack prototype ready today de-risks technical execution."
    ]
    for mb in moat_bullets:
        p_b = tb_m.text_frame.add_paragraph()
        p_b.text = "✓ " + mb
        p_b.font.size = Pt(11)
        p_b.font.color.rgb = TEXT_MUTED
        p_b.space_before = Pt(4)

    add_footer(slide10, 10)

    # -------------------------------------------------------------
    # SLIDE 11: CONCLUSION & CALL TO ACTION
    # -------------------------------------------------------------
    slide11 = prs.slides.add_slide(blank_layout)
    add_bg(slide11, RGBColor(15, 23, 42))  # Dark sleek summary slide

    # Header in white
    t_box = slide11.shapes.add_textbox(Inches(0.8), Inches(0.8), Inches(11.7), Inches(1.5))
    tf = t_box.text_frame
    p = tf.paragraphs[0]
    p.text = "SkillBridge AI — Team Apex"
    p.font.size = Pt(44)
    p.font.bold = True
    p.font.color.rgb = RGBColor(255, 255, 255)

    p2 = tf.add_paragraph()
    p2.text = "From guesswork to verified readiness — for students, recruiters, and institutions, on one shared platform."
    p2.font.size = Pt(18)
    p2.font.color.rgb = RGBColor(203, 213, 225)
    p2.space_before = Pt(8)

    # 3 Summary Cards
    conclusions = [
        ("🚀 Working Prototype Ready", "Live multi-portal web application connected to Supabase backend database.", INDIGO),
        ("🎯 Round 2 Roadmap Scoped", "Live code demo, candidate filtering, and assessment execution ready for judges.", EMERALD),
        ("⛰️ Uttarakhand & Beyond", "Engineered to empower regional higher education talent pipelines.", AMBER)
    ]

    for i, (ctitle, cdesc, color) in enumerate(conclusions):
        x = Inches(0.8 + i * 4.0)
        y = Inches(2.8)
        w = Inches(3.733)
        h = Inches(2.5)

        ccard = slide11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        ccard.fill.solid()
        ccard.fill.fore_color.rgb = RGBColor(30, 41, 59)
        ccard.line.color.rgb = color

        tb = slide11.shapes.add_textbox(x + Inches(0.2), y + Inches(0.2), w - Inches(0.4), h - Inches(0.4))
        p = tb.text_frame.paragraphs[0]
        p.text = ctitle
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = RGBColor(255, 255, 255)

        p_d = tb.text_frame.add_paragraph()
        p_d.text = cdesc
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = RGBColor(203, 213, 225)
        p_d.space_before = Pt(8)

    # Big CTA Button
    cta = slide11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.7), Inches(11.733), Inches(0.9))
    cta.fill.solid()
    cta.fill.fore_color.rgb = INDIGO
    cta.line.fill.background()
    tf_cta = cta.text_frame
    p_cta = tf_cta.paragraphs[0]
    p_cta.text = "WE ARE READY TO PRESENT OUR LIVE DEMO IN ROUND 2! THANK YOU JUDGES!"
    p_cta.font.size = Pt(16)
    p_cta.font.bold = True
    p_cta.font.color.rgb = RGBColor(255, 255, 255)
    p_cta.alignment = PP_ALIGN.CENTER

    footer_box = slide11.shapes.add_textbox(Inches(0.8), Inches(6.9), Inches(11.7), Inches(0.4))
    p = footer_box.text_frame.paragraphs[0]
    p.text = "SkillBridge AI — Team Apex • Dehradun Hackathon 2026                                                                    Slide 11 / 11"
    p.font.size = Pt(10)
    p.font.color.rgb = RGBColor(148, 163, 184)

    output_path = "/Users/manishyadav/Desktop/skillBridge-AI-platform-main 4/SkillBridge_AI_Team_Apex_Presentation.pptx"
    prs.save(output_path)
    print(f"Presentation successfully created at: {output_path}")

if __name__ == "__main__":
    create_deck()
