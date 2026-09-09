import { useEffect, useMemo, useState } from "react";
import {
  Target,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  BriefcaseBusiness,
  RefreshCw,
  ArrowRight,
  BookOpen,
  BarChart3,
  Sparkles,
  Award,
  Compass,
  CheckSquare,
  Square,
  Zap,
  ShieldCheck,
  Flame,
  ChevronRight,
  Layers,
  FileCode2,
  Check,
  Brain,
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000";
const STUDENT_ID = "e0bab151-ab49-42fe-b6f1-c4346834b1f1";

// =========================================================
// ROLE PROFILE DEFINITIONS (RICH DEFAULTS WITH ROADMAPS)
// =========================================================

const ROLE_PROFILES = {
  "Full-Stack AI Engineer": {
    name: "Full-Stack AI Engineer",
    icon: "🚀",
    demand: "Very High",
    avgSalary: "₹16 - ₹28 LPA ($145k)",
    marketGrowth: "+38% YoY",
    description: "Designs and ships end-to-end intelligent web platforms, combining robust backend APIs, vector embeddings, and modern frontend interfaces.",
    readinessBase: 84,
    pillars: {
      technicalCore: 88,
      modernStack: 84,
      systemDesign: 72,
      portfolioProof: 90,
    },
    skills: [
      { skill: "Python & FastAPI", current: 90, required: 85, gap: 0, status: "Ready", priority: "Low" },
      { skill: "React & TypeScript", current: 88, required: 80, gap: 0, status: "Ready", priority: "Low" },
      { skill: "Vector Databases & RAG", current: 65, required: 85, gap: 20, status: "Gap", priority: "High" },
      { skill: "PostgreSQL & Prisma", current: 82, required: 80, gap: 0, status: "Ready", priority: "Low" },
      { skill: "Docker & Containerization", current: 60, required: 80, gap: 20, status: "Gap", priority: "High" },
      { skill: "LLM Fine-Tuning / Prompt Eng.", current: 55, required: 75, gap: 20, status: "Gap", priority: "Medium" },
      { skill: "System Design & Distributed Caching", current: 50, required: 75, gap: 25, status: "Gap", priority: "High" },
    ],
    milestones: [
      {
        phase: "Phase 1: Foundations & Core Mastery",
        status: "Completed",
        progress: 100,
        items: [
          { id: "fs-1", label: "Modern TypeScript & Advanced React Hooks Architecture", done: true },
          { id: "fs-2", label: "Asynchronous Python & RESTful API Service with FastAPI", done: true },
          { id: "fs-3", label: "Relational Database Modeling & Indexing in PostgreSQL", done: true },
        ],
      },
      {
        phase: "Phase 2: AI Orchestration & Production Scale",
        status: "In Progress",
        progress: 67,
        items: [
          { id: "fs-4", label: "Implement Semantic Vector Search using Qdrant or Pinecone", done: true },
          { id: "fs-5", label: "Build End-to-End RAG Knowledge Assistant with Citation Tracing", done: true },
          { id: "fs-6", label: "Implement Redis Caching & Rate-Limiting for API Endpoints", done: false },
        ],
      },
      {
        phase: "Phase 3: Production Capstone & Interview Readiness",
        status: "Upcoming",
        progress: 25,
        items: [
          { id: "fs-7", label: "Deploy Multi-Container Architecture via Docker & AWS ECS", done: true },
          { id: "fs-8", label: "Master 15 System Design Patterns for High-Throughput Web Apps", done: false },
          { id: "fs-9", label: "Complete 3 Mock Technical Architecture & Live-Coding Interviews", done: false },
        ],
      },
    ],
    certifications: [
      {
        title: "AWS Certified Solutions Architect – Associate",
        issuer: "Amazon Web Services",
        level: "Intermediate",
        prepWeeks: "4 Weeks",
        demandScore: "96% Hiring Demand",
        badgeColor: "border-amber-500/30 bg-amber-500/10 text-amber-300",
      },
      {
        title: "DeepLearning.AI Generative AI Engineering",
        issuer: "Coursera / DeepLearning.AI",
        level: "Advanced",
        prepWeeks: "3 Weeks",
        demandScore: "94% Hiring Demand",
        badgeColor: "border-violet-500/30 bg-violet-500/10 text-violet-300",
      },
      {
        title: "Meta Professional Full-Stack Software Engineer",
        issuer: "Meta",
        level: "Advanced",
        prepWeeks: "5 Weeks",
        demandScore: "91% Hiring Demand",
        badgeColor: "border-blue-500/30 bg-blue-500/10 text-blue-300",
      },
    ],
    sprintTasks: [
      "Implement Redis caching middleware on job search endpoints to reduce latency below 40ms.",
      "Integrate hybrid keyword + vector semantic search in student portfolio projects.",
      "Solve 3 medium LeetCode sliding window and graph traversal challenges.",
    ],
  },

  "Backend Developer": {
    name: "Backend Developer",
    icon: "⚡",
    demand: "High",
    avgSalary: "₹14 - ₹25 LPA ($135k)",
    marketGrowth: "+29% YoY",
    description: "Specializes in building distributed systems, performant microservices, database schemas, and rock-solid cloud backend infrastructure.",
    readinessBase: 88,
    pillars: {
      technicalCore: 92,
      modernStack: 88,
      systemDesign: 80,
      portfolioProof: 85,
    },
    skills: [
      { skill: "Python / Node.js", current: 92, required: 85, gap: 0, status: "Ready", priority: "Low" },
      { skill: "PostgreSQL & Database Design", current: 88, required: 85, gap: 0, status: "Ready", priority: "Low" },
      { skill: "Microservices Architecture", current: 75, required: 80, gap: 5, status: "Gap", priority: "Medium" },
      { skill: "Redis & In-Memory Caching", current: 70, required: 80, gap: 10, status: "Gap", priority: "High" },
      { skill: "Docker & Kubernetes", current: 65, required: 80, gap: 15, status: "Gap", priority: "High" },
      { skill: "Message Queues (Kafka/RabbitMQ)", current: 50, required: 75, gap: 25, status: "Gap", priority: "High" },
    ],
    milestones: [
      {
        phase: "Phase 1: API & Database Foundations",
        status: "Completed",
        progress: 100,
        items: [
          { id: "be-1", label: "Clean Architecture & Dependency Injection in FastAPI", done: true },
          { id: "be-2", label: "Database Normalization, Indexes & Query Optimization", done: true },
          { id: "be-3", label: "JWT Authentication & Role-Based Access Control (RBAC)", done: true },
        ],
      },
      {
        phase: "Phase 2: Scale, Caching & Message Queues",
        status: "In Progress",
        progress: 50,
        items: [
          { id: "be-4", label: "Distributed Session Storage and Query Caching with Redis", done: true },
          { id: "be-5", label: "Asynchronous Background Jobs using Celery and Redis Broker", done: false },
          { id: "be-6", label: "Event-Driven Messaging using Apache Kafka or RabbitMQ", done: false },
        ],
      },
      {
        phase: "Phase 3: Microservices & High-Availability Architecture",
        status: "Upcoming",
        progress: 0,
        items: [
          { id: "be-7", label: "Split Monolith into 3 Autonomous Dockerized Microservices", done: false },
          { id: "be-8", label: "System Design: Consistent Hashing, Rate Limiting & Load Balancing", done: false },
          { id: "be-9", label: "Distributed Tracing with OpenTelemetry and Prometheus Monitoring", done: false },
        ],
      },
    ],
    certifications: [
      {
        title: "AWS Certified Developer – Associate",
        issuer: "Amazon Web Services",
        level: "Intermediate",
        prepWeeks: "4 Weeks",
        demandScore: "95% Hiring Demand",
        badgeColor: "border-amber-500/30 bg-amber-500/10 text-amber-300",
      },
      {
        title: "Redis Certified Developer",
        issuer: "Redis University",
        level: "Intermediate",
        prepWeeks: "2 Weeks",
        demandScore: "88% Hiring Demand",
        badgeColor: "border-red-500/30 bg-red-500/10 text-red-300",
      },
      {
        title: "Confluent Certified Kafka Developer",
        issuer: "Confluent",
        level: "Advanced",
        prepWeeks: "3 Weeks",
        demandScore: "90% Hiring Demand",
        badgeColor: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
      },
    ],
    sprintTasks: [
      "Add Redis distributed cache layer to optimize the student directory query from 180ms to 12ms.",
      "Write unit tests achieving 85%+ code coverage across backend routers.",
      "Review System Design blueprint for URL shortener and Rate Limiter.",
    ],
  },

  "Cloud & DevOps Architect": {
    name: "Cloud & DevOps Architect",
    icon: "☁️",
    demand: "High",
    avgSalary: "₹18 - ₹32 LPA ($160k)",
    marketGrowth: "+35% YoY",
    description: "Automates CI/CD pipelines, manages multi-cloud clusters, enforces zero-trust security, and guarantees 99.99% system availability.",
    readinessBase: 76,
    pillars: {
      technicalCore: 82,
      modernStack: 78,
      systemDesign: 70,
      portfolioProof: 75,
    },
    skills: [
      { skill: "Linux & Bash Scripting", current: 90, required: 85, gap: 0, status: "Ready", priority: "Low" },
      { skill: "Docker & Container Runtimes", current: 80, required: 85, gap: 5, status: "Gap", priority: "Low" },
      { skill: "Kubernetes (K8s) Cluster Mgmt", current: 55, required: 80, gap: 25, status: "Gap", priority: "High" },
      { skill: "Infrastructure as Code (Terraform)", current: 50, required: 75, gap: 25, status: "Gap", priority: "High" },
      { skill: "CI/CD (GitHub Actions / GitLab)", current: 75, required: 80, gap: 5, status: "Gap", priority: "Medium" },
      { skill: "Cloud Security & IAM (AWS/GCP)", current: 60, required: 80, gap: 20, status: "Gap", priority: "High" },
    ],
    milestones: [
      {
        phase: "Phase 1: Linux & Container Foundations",
        status: "Completed",
        progress: 100,
        items: [
          { id: "do-1", label: "Master Linux Kernel Namespaces, cgroups, and Bash Automation", done: true },
          { id: "do-2", label: "Multi-Stage Docker Builds for Ultra-Lightweight Production Images", done: true },
          { id: "do-3", label: "Automated Testing & Linting CI Pipeline in GitHub Actions", done: true },
        ],
      },
      {
        phase: "Phase 2: Kubernetes & Infrastructure as Code",
        status: "In Progress",
        progress: 33,
        items: [
          { id: "do-4", label: "Provision AWS VPC, Subnets, and EC2 Instances using Terraform", done: true },
          { id: "do-5", label: "Deploy Kubernetes Pods, Ingress Controllers, and ConfigMaps", done: false },
          { id: "do-6", label: "Configure Automated Rolling Updates & Horizontal Pod Autoscaler", done: false },
        ],
      },
      {
        phase: "Phase 3: Observability, GitOps & Production Hardening",
        status: "Upcoming",
        progress: 0,
        items: [
          { id: "do-7", label: "Set Up Prometheus Metrics Scraping & Grafana Dashboards", done: false },
          { id: "do-8", label: "Implement GitOps Continuous Deployment using ArgoCD", done: false },
          { id: "do-9", label: "Enforce Cloud Security Guardrails & Secret Management (Vault)", done: false },
        ],
      },
    ],
    certifications: [
      {
        title: "Certified Kubernetes Administrator (CKA)",
        issuer: "Cloud Native Computing Foundation (CNCF)",
        level: "Advanced",
        prepWeeks: "6 Weeks",
        demandScore: "98% Hiring Demand",
        badgeColor: "border-blue-500/30 bg-blue-500/10 text-blue-300",
      },
      {
        title: "HashiCorp Certified: Terraform Associate",
        issuer: "HashiCorp",
        level: "Intermediate",
        prepWeeks: "2 Weeks",
        demandScore: "92% Hiring Demand",
        badgeColor: "border-purple-500/30 bg-purple-500/10 text-purple-300",
      },
      {
        title: "AWS Certified DevOps Engineer – Professional",
        issuer: "Amazon Web Services",
        level: "Expert",
        prepWeeks: "8 Weeks",
        demandScore: "97% Hiring Demand",
        badgeColor: "border-amber-500/30 bg-amber-500/10 text-amber-300",
      },
    ],
    sprintTasks: [
      "Write a Terraform module to provision an RDS PostgreSQL instance with security groups.",
      "Deploy a local Kubernetes cluster using Minikube and configure Ingress routing.",
      "Complete CNCF practice exam labs for pod troubleshooting.",
    ],
  },

  "Machine Learning Scientist": {
    name: "Machine Learning Scientist",
    icon: "🧠",
    demand: "Very High",
    avgSalary: "₹20 - ₹35 LPA ($165k)",
    marketGrowth: "+42% YoY",
    description: "Trains predictive models, fine-tunes transformer architectures, builds evaluation pipelines, and delivers reproducible ML research into production.",
    readinessBase: 71,
    pillars: {
      technicalCore: 85,
      modernStack: 74,
      systemDesign: 62,
      portfolioProof: 72,
    },
    skills: [
      { skill: "Python & NumPy / Pandas", current: 90, required: 85, gap: 0, status: "Ready", priority: "Low" },
      { skill: "PyTorch & Deep Learning", current: 70, required: 85, gap: 15, status: "Gap", priority: "High" },
      { skill: "Transformer Architectures & Attention", current: 60, required: 80, gap: 20, status: "Gap", priority: "High" },
      { skill: "Scikit-Learn & Feature Eng.", current: 85, required: 80, gap: 0, status: "Ready", priority: "Low" },
      { skill: "MLOps & Model Tracking (MLflow)", current: 45, required: 75, gap: 30, status: "Gap", priority: "High" },
      { skill: "Vector Math & Probabilistic Modeling", current: 75, required: 80, gap: 5, status: "Gap", priority: "Medium" },
    ],
    milestones: [
      {
        phase: "Phase 1: Math, Statistics & Classical ML",
        status: "Completed",
        progress: 100,
        items: [
          { id: "ml-1", label: "Multivariate Calculus, Linear Algebra & Gradient Descent", done: true },
          { id: "ml-2", label: "Supervised & Unsupervised Modeling with Scikit-Learn", done: true },
          { id: "ml-3", label: "Cross-Validation, ROC-AUC, and Rigorous Evaluation Metrics", done: true },
        ],
      },
      {
        phase: "Phase 2: Deep Learning & NLP Transformers",
        status: "In Progress",
        progress: 33,
        items: [
          { id: "ml-4", label: "Build and Train CNNs & ResNets in PyTorch from Scratch", done: true },
          { id: "ml-5", label: "Implement Multi-Head Self-Attention & Transformer Encoder", done: false },
          { id: "ml-6", label: "Parameter-Efficient Fine-Tuning (LoRA / QLoRA) on Open Models", done: false },
        ],
      },
      {
        phase: "Phase 3: Production MLOps & Real-Time Inference",
        status: "Upcoming",
        progress: 0,
        items: [
          { id: "ml-7", label: "Model Artifact Versioning & Experiment Tracking with MLflow", done: false },
          { id: "ml-8", label: "Serve Low-Latency Inference with vLLM / ONNX Runtime", done: false },
          { id: "ml-9", label: "Publish Peer-Reviewed or Benchmark Technical Report on Hugging Face", done: false },
        ],
      },
    ],
    certifications: [
      {
        title: "Google Cloud Professional Machine Learning Engineer",
        issuer: "Google Cloud",
        level: "Advanced",
        prepWeeks: "6 Weeks",
        demandScore: "96% Hiring Demand",
        badgeColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
      },
      {
        title: "Deep Learning Specialization",
        issuer: "DeepLearning.AI / Andrew Ng",
        level: "Intermediate",
        prepWeeks: "4 Weeks",
        demandScore: "93% Hiring Demand",
        badgeColor: "border-violet-500/30 bg-violet-500/10 text-violet-300",
      },
      {
        title: "TensorFlow Developer Certificate",
        issuer: "TensorFlow",
        level: "Intermediate",
        prepWeeks: "3 Weeks",
        demandScore: "87% Hiring Demand",
        badgeColor: "border-amber-500/30 bg-amber-500/10 text-amber-300",
      },
    ],
    sprintTasks: [
      "Fine-tune a Llama-3-8B-Instruct model using LoRA on custom domain question-answering dataset.",
      "Profile GPU memory allocation and batch inference throughput with PyTorch Profiler.",
      "Document hyperparameter search logs in Weights & Biases.",
    ],
  },

  "Cybersecurity Systems Specialist": {
    name: "Cybersecurity Systems Specialist",
    icon: "🛡️",
    demand: "High",
    avgSalary: "₹15 - ₹26 LPA ($140k)",
    marketGrowth: "+31% YoY",
    description: "Protects critical infrastructure, conducts vulnerability assessments, investigates security incident telemetry, and audits cloud permissions.",
    readinessBase: 68,
    pillars: {
      technicalCore: 80,
      modernStack: 70,
      systemDesign: 65,
      portfolioProof: 68,
    },
    skills: [
      { skill: "Network Protocols (TCP/IP, TLS, DNS)", current: 85, required: 85, gap: 0, status: "Ready", priority: "Low" },
      { skill: "Linux Hardening & OS Internals", current: 80, required: 85, gap: 5, status: "Gap", priority: "Medium" },
      { skill: "Web App Security (OWASP Top 10)", current: 75, required: 85, gap: 10, status: "Gap", priority: "High" },
      { skill: "Penetration Testing & Burp Suite", current: 55, required: 75, gap: 20, status: "Gap", priority: "High" },
      { skill: "SIEM & Telemetry Analysis (Splunk)", current: 40, required: 70, gap: 30, status: "Gap", priority: "High" },
      { skill: "Cryptography & PKI Infrastructure", current: 70, required: 80, gap: 10, status: "Gap", priority: "Medium" },
    ],
    milestones: [
      {
        phase: "Phase 1: Network & OS Hardening",
        status: "Completed",
        progress: 100,
        items: [
          { id: "sec-1", label: "Packet Analysis & Deep Inspection with Wireshark", done: true },
          { id: "sec-2", label: "Linux System Hardening, File Permissions & iptables", done: true },
          { id: "sec-3", label: "Symmetric / Asymmetric Encryption & TLS Handshake Auditing", done: true },
        ],
      },
      {
        phase: "Phase 2: AppSec & Threat Exploitation Defense",
        status: "In Progress",
        progress: 33,
        items: [
          { id: "sec-4", label: "OWASP Top 10 Exploitation & Remediation (SQLi, XSS, SSRF)", done: true },
          { id: "sec-5", label: "Web Application Assessment using Burp Suite Professional", done: false },
          { id: "sec-6", label: "Zero-Trust Cloud IAM Policies & Least-Privilege Enactment", done: false },
        ],
      },
      {
        phase: "Phase 3: SOC Operations & Incident Response",
        status: "Upcoming",
        progress: 0,
        items: [
          { id: "sec-7", label: "SIEM Threat Hunting: Detect Lateral Movement via Log Correlation", done: false },
          { id: "sec-8", label: "Automated Vulnerability Scanning with Nuclei and Nessus", done: false },
          { id: "sec-9", label: "Complete 10 TryHackMe / HackTheBox Offensive-Defense Labs", done: false },
        ],
      },
    ],
    certifications: [
      {
        title: "CompTIA Security+ (SY0-701)",
        issuer: "CompTIA",
        level: "Intermediate",
        prepWeeks: "3 Weeks",
        demandScore: "95% Hiring Demand",
        badgeColor: "border-red-500/30 bg-red-500/10 text-red-300",
      },
      {
        title: "Certified Ethical Hacker (CEH)",
        issuer: "EC-Council",
        level: "Intermediate",
        prepWeeks: "4 Weeks",
        demandScore: "90% Hiring Demand",
        badgeColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
      },
      {
        title: "Offensive Security Certified Professional (OSCP)",
        issuer: "OffSec",
        level: "Expert",
        prepWeeks: "10 Weeks",
        demandScore: "98% Hiring Demand",
        badgeColor: "border-orange-500/30 bg-orange-500/10 text-orange-300",
      },
    ],
    sprintTasks: [
      "Conduct automated vulnerability scan of local web server and remediate top 3 findings.",
      "Write YARA rules to detect suspicious payload signatures in upload folders.",
      "Audit JWT implementation for signature exclusion and algorithm confusion flaws.",
    ],
  },
};

// =========================================================
// SIMULATOR BOOST OPTIONS
// =========================================================

const SIMULATOR_BOOSTS = [
  { id: "boost-docker", label: "Master Docker & Microservices Orchestration", boost: 5 },
  { id: "boost-rag", label: "Deploy Production RAG Vector Pipeline (Qdrant)", boost: 6 },
  { id: "boost-redis", label: "Implement Redis In-Memory Caching & Rate-Limits", boost: 4 },
  { id: "boost-sysdesign", label: "Complete 15 System Design High-Scale Patterns", boost: 5 },
];

// =========================================================
// MAIN COMPONENT
// =========================================================

function Career({ currentUser, setActivePage }) {
  const [selectedRoleKey, setSelectedRoleKey] = useState("Full-Stack AI Engineer");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("roadmap"); // roadmap | gaps | certs | simulator
  const [activeRoadmapItems, setActiveRoadmapItems] = useState({});
  const [simulatedBoosts, setSimulatedBoosts] = useState({});
  const [sprintDone, setSprintDone] = useState({});

  // Active role profile
  const profile = useMemo(() => {
    return ROLE_PROFILES[selectedRoleKey] || ROLE_PROFILES["Full-Stack AI Engineer"];
  }, [selectedRoleKey]);

  // Calculate simulated score
  const simulatedBonus = useMemo(() => {
    return Object.entries(simulatedBoosts).reduce((sum, [id, active]) => {
      if (!active) return sum;
      const item = SIMULATOR_BOOSTS.find((b) => b.id === id);
      return sum + (item ? item.boost : 0);
    }, 0);
  }, [simulatedBoosts]);

  const effectiveReadiness = Math.min(100, profile.readinessBase + simulatedBonus);

  // Toggle milestone item
  const toggleMilestoneItem = (id) => {
    setActiveRoadmapItems((prev) => ({
      ...prev,
      [id]: prev[id] !== undefined ? !prev[id] : false,
    }));
  };

  const isMilestoneDone = (item) => {
    if (activeRoadmapItems[item.id] !== undefined) {
      return activeRoadmapItems[item.id];
    }
    return item.done;
  };

  // Toggle simulator
  const toggleSimulatorBoost = (id) => {
    setSimulatedBoosts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Toggle sprint task
  const toggleSprintTask = (idx) => {
    setSprintDone((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  const readySkills = profile.skills.filter((s) => s.gap <= 0 || s.status === "Ready");
  const gapSkills = profile.skills.filter((s) => s.gap > 0);

  return (
    <div className="space-y-8 pb-16">
      {/* =====================================================
          HERO BANNER & HEADER
      ===================================================== */}
      <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-950/40 via-slate-900 to-slate-950 p-7 lg:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -top-10 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Career Roadmap & Readiness Intelligence</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Personalized Career Pathway {currentUser?.name ? `• ${currentUser.name}` : ""}
            </h1>

            <p className="mt-2 text-sm lg:text-base text-slate-400 max-w-2xl leading-relaxed">
              Analyze your current readiness against target role requirements, execute structured 3-phase milestones, and close skill deficiencies with precision.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:border-violet-500/60 text-xs font-semibold text-slate-200 flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-violet-400" : ""}`} />
              <span>{loading ? "Recalculating..." : "Sync Trajectory"}</span>
            </button>
          </div>
        </div>

        {/* ROLE SELECTION PILLS */}
        <div className="mt-7 pt-6 border-t border-slate-800/80">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-violet-400" />
            <span>Select Target Career Role:</span>
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {Object.entries(ROLE_PROFILES).map(([key, role]) => {
              const active = selectedRoleKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedRoleKey(key)}
                  className={`p-3 rounded-2xl text-left transition-all border cursor-pointer ${
                    active
                      ? "bg-violet-600/20 border-violet-500 text-white shadow-lg shadow-violet-600/10 scale-[1.02]"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <div className="text-xl mb-1">{role.icon}</div>
                  <div className="font-bold text-xs leading-snug line-clamp-1">{role.name}</div>
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>{role.demand}</span>
                    <span className={`font-bold ${active ? "text-violet-400" : "text-slate-500"}`}>
                      {role.readinessBase}% Match
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =====================================================
          CAREER READINESS COCKPIT & METRICS
      ===================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* READINESS GAUGE CARD */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Target Role Fit
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Tier-1 Qualified
              </span>
            </div>

            <h2 className="text-xl font-bold text-white mt-1">{profile.name}</h2>
            <p className="text-xs text-slate-400 mt-1">{profile.description}</p>
          </div>

          <div className="my-6 text-center">
            <div className="inline-flex flex-col items-center justify-center w-36 h-36 rounded-full border-4 border-violet-500/30 bg-violet-500/5 shadow-inner shadow-violet-500/20 relative">
              <span className="text-4xl font-extrabold text-white tracking-tight">
                {effectiveReadiness}%
              </span>
              <span className="text-[11px] font-bold text-violet-400 uppercase tracking-wider mt-0.5">
                {effectiveReadiness >= 85 ? "High Readiness" : "Rapid Growth"}
              </span>

              {simulatedBonus > 0 && (
                <span className="absolute -bottom-2 bg-emerald-500 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow">
                  +{simulatedBonus}% Simulated
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">Avg Compensation</span>
                <span className="font-semibold text-slate-200">{profile.avgSalary}</span>
              </div>
              <div className="w-px h-6 bg-slate-800" />
              <div>
                <span className="text-slate-500 block text-[10px]">Market Demand</span>
                <span className="font-semibold text-emerald-400">{profile.marketGrowth}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-800/80">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Core Readiness</span>
              <span className="font-semibold text-white">{profile.readinessBase}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${effectiveReadiness}%` }}
              />
            </div>
          </div>
        </div>

        {/* 4 READINESS PILLARS */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-lg font-bold text-white">{profile.pillars.technicalCore}%</span>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-bold text-white">Technical Core Competency</h3>
              <p className="text-xs text-slate-400 mt-1">
                Data structures, algorithmic complexity, API contracts, and database logic.
              </p>
            </div>
            <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${profile.pillars.technicalCore}%` }} />
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Layers className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-lg font-bold text-white">{profile.pillars.modernStack}%</span>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-bold text-white">Modern Frameworks & Stacks</h3>
              <p className="text-xs text-slate-400 mt-1">
                Framework fluency, asynchronous concurrency, and vector embeddings.
              </p>
            </div>
            <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${profile.pillars.modernStack}%` }} />
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-lg font-bold text-white">{profile.pillars.systemDesign}%</span>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-bold text-white">Production System Architecture</h3>
              <p className="text-xs text-slate-400 mt-1">
                High-concurrency caching, sharding, container isolation, and failover.
              </p>
            </div>
            <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${profile.pillars.systemDesign}%` }} />
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <Award className="w-5 h-5 text-violet-400" />
              </div>
              <span className="text-lg font-bold text-white">{profile.pillars.portfolioProof}%</span>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-bold text-white">Portfolio & Industry Verification</h3>
              <p className="text-xs text-slate-400 mt-1">
                Working code repos, verified capstone projects, and candidate endorsements.
              </p>
            </div>
            <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-violet-500 rounded-full" style={{ width: `${profile.pillars.portfolioProof}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          NAVIGATION TABS (ROADMAP / GAPS / SIMULATOR / CERTS)
      ===================================================== */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("roadmap")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === "roadmap"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>3-Phase Milestone Roadmap</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("gaps")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === "gaps"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Competency Gap Matrix ({gapSkills.length} Action Items)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("simulator")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === "simulator"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>What-If Readiness Simulator</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("certs")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === "certs"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Industry Certifications ({profile.certifications.length})</span>
        </button>
      </div>

      {/* =====================================================
          TAB 1: 3-PHASE INTERACTIVE ROADMAP
      ===================================================== */}
      {activeTab === "roadmap" && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-violet-400" />
              <span>
                Click any milestone below to update your personalized progression status in real time.
              </span>
            </span>
            <span className="font-mono text-slate-500">Interactive Track</span>
          </div>

          <div className="space-y-6">
            {profile.milestones.map((phase, idx) => {
              const completedCount = phase.items.filter((item) => isMilestoneDone(item)).length;
              const totalCount = phase.items.length;
              const pct = Math.round((completedCount / totalCount) * 100);
              const isPhaseComplete = pct === 100;

              return (
                <div
                  key={phase.phase}
                  className={`bg-slate-900/80 border rounded-3xl p-6 transition-all duration-300 ${
                    isPhaseComplete
                      ? "border-emerald-500/30 shadow-lg shadow-emerald-500/5"
                      : idx === 1
                      ? "border-violet-500/40 shadow-xl shadow-violet-500/10"
                      : "border-slate-800"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                          isPhaseComplete
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-white">{phase.phase}</h3>
                        <p className="text-xs text-slate-400">
                          {completedCount} of {totalCount} competencies verified ({pct}%)
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                        isPhaseComplete
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : idx === 1
                          ? "bg-violet-500/15 text-violet-400 border border-violet-500/30"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {isPhaseComplete ? "✓ Verified Complete" : phase.status}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden mb-5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isPhaseComplete ? "bg-emerald-500" : "bg-violet-600"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Items list */}
                  <div className="space-y-2.5">
                    {phase.items.map((item) => {
                      const done = isMilestoneDone(item);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleMilestoneItem(item.id)}
                          className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl text-left transition border cursor-pointer ${
                            done
                              ? "bg-slate-950/80 border-slate-800/80 text-slate-300 hover:border-slate-700"
                              : "bg-slate-950/40 border-slate-850 text-slate-400 hover:border-violet-500/40 hover:text-white"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 transition ${
                              done
                                ? "bg-emerald-500 text-slate-950"
                                : "border border-slate-700 hover:border-violet-400"
                            }`}
                          >
                            {done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className={`text-xs font-medium ${done ? "line-through text-slate-400" : "text-slate-200"}`}>
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================
          TAB 2: COMPETENCY GAP MATRIX
      ===================================================== */}
      {activeTab === "gaps" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* DEFICIENCIES TO STRENGTHEN */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Skills to Strengthen</h3>
                    <p className="text-xs text-slate-400">Prioritized by industry hiring importance</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  {gapSkills.length} Gaps
                </span>
              </div>

              <div className="space-y-3.5">
                {gapSkills.map((item) => (
                  <div key={item.skill} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white">{item.skill}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-400">-{item.gap}% Gap</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            item.priority === "High"
                              ? "bg-red-500/15 text-red-400 border border-red-500/20"
                              : "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {item.priority}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Current: {item.current}%</span>
                      <span>Target Requirement: {item.required}%</span>
                    </div>

                    <div className="mt-2 h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${item.current}%` }}
                      />
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-900/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Need study sources?</span>
                      <button
                        type="button"
                        onClick={() => setActivePage && setActivePage("learning")}
                        className="inline-flex items-center gap-1 font-semibold text-violet-400 hover:text-violet-300 transition cursor-pointer"
                      >
                        <span>Learn {item.skill}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* VERIFIED SKILLS ALREADY READY */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Skills Meeting Requirements</h3>
                    <p className="text-xs text-slate-400">Already exceeds hiring threshold</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {readySkills.length} Ready
                </span>
              </div>

              <div className="space-y-3.5">
                {readySkills.map((item) => (
                  <div key={item.skill} className="bg-slate-950/80 border border-emerald-500/20 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-emerald-300">{item.skill}</span>
                      <span className="text-xs font-bold text-emerald-400">
                        {item.current}% (Req: {item.required}%)
                      </span>
                    </div>

                    <div className="mt-2.5 h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.min(item.current, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          TAB 3: "WHAT-IF" READINESS SIMULATOR
      ===================================================== */}
      {activeTab === "simulator" && (
        <div className="bg-slate-900/80 border border-violet-500/30 rounded-3xl p-7 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">What-If Career Readiness Simulator</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Toggle prospective skill acquisitions to preview how your placement percentile and role fit surges.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* TOGGLE OPTIONS */}
            <div className="lg:col-span-7 space-y-3">
              {SIMULATOR_BOOSTS.map((item) => {
                const active = Boolean(simulatedBoosts[item.id]);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleSimulatorBoost(item.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left cursor-pointer ${
                      active
                        ? "bg-violet-600/15 border-violet-500 text-white shadow-md shadow-violet-600/10"
                        : "bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center transition ${
                          active ? "bg-violet-600 text-white" : "border border-slate-700"
                        }`}
                      >
                        {active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-semibold">{item.label}</span>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        active
                          ? "bg-violet-500 text-slate-950 font-extrabold"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      +{item.boost}% ROI
                    </span>
                  </button>
                );
              })}
            </div>

            {/* LIVE SIMULATED READINESS READOUT */}
            <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-3xl p-6 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Simulated Outcome
              </span>

              <div className="my-4">
                <span className="text-5xl font-extrabold text-white tracking-tight">
                  {effectiveReadiness}%
                </span>
                <p className="text-xs font-semibold text-emerald-400 mt-1">
                  {simulatedBonus > 0
                    ? `+${simulatedBonus}% Boost over current baseline (${profile.readinessBase}%)`
                    : "Toggle items on the left to simulate readiness jump"}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-xs text-violet-200 text-left leading-relaxed">
                🎯 <strong>Career Impact:</strong> At <strong>{effectiveReadiness}%</strong> readiness for{" "}
                <strong>{profile.name}</strong>, your profile automatically surfaces in the{" "}
                <strong>Top 5% Recommended Candidate Pool</strong> for hiring partners.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          TAB 4: INDUSTRY CERTIFICATIONS & CREDENTIALS
      ===================================================== */}
      {activeTab === "certs" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profile.certifications.map((cert) => (
              <div
                key={cert.title}
                className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-violet-500/40 transition group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${cert.badgeColor}`}>
                      {cert.level}
                    </span>
                    <span className="text-xs text-slate-500">{cert.prepWeeks}</span>
                  </div>

                  <h3 className="font-bold text-base text-white group-hover:text-violet-300 transition">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Issued by {cert.issuer}</p>

                  <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{cert.demandScore}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-violet-600 hover:text-white text-slate-300 border border-slate-700 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View Prep Curriculum</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================
          WEEKLY CAREER SPRINT (ACTIONABLE EXECUTION)
      ===================================================== */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">This Week's High-ROI Action Sprint</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Week 1 of 4</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {profile.sprintTasks.map((task, idx) => {
            const done = Boolean(sprintDone[idx]);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleSprintTask(idx)}
                className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                  done
                    ? "bg-slate-950/80 border-slate-800/80 text-slate-400"
                    : "bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition ${
                    done ? "bg-emerald-500 text-slate-950" : "border border-slate-700"
                  }`}
                >
                  {done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span className={`text-xs leading-relaxed ${done ? "line-through text-slate-500" : ""}`}>
                  {task}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Career;