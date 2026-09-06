"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity, AlertTriangle, ArrowUpRight, BookOpen, CalendarDays, CheckCircle2,
  Briefcase, ChevronDown, Clock3, Code2, ExternalLink, FileSearch, FileText, GitFork, History, Link as LinkIcon,
  MapPin, Moon, RotateCcw, Search, Share2, ShieldCheck, Star, Sun, Target, TrendingUp, Trophy, UploadCloud, UserRoundSearch, Users, X,
} from "lucide-react";
import pdfWorkerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "sonner";

const API_HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

const CHART_COLORS = ["#67e8f9", "#a3e635", "#818cf8", "#fb7185", "#fbbf24", "#c084fc"];

const SKILL_DICTIONARY = [
  { label: "JavaScript", terms: ["javascript", "js"] },
  { label: "TypeScript", terms: ["typescript", "ts"] },
  { label: "React", terms: ["react", "reactjs", "react.js"] },
  { label: "Next.js", terms: ["next.js", "nextjs"] },
  { label: "Node.js", terms: ["node.js", "nodejs", "node"] },
  { label: "Express.js", terms: ["express.js", "expressjs", "express"] },
  { label: "HTML", terms: ["html", "html5"] },
  { label: "CSS", terms: ["css", "css3"] },
  { label: "Tailwind CSS", terms: ["tailwind", "tailwindcss", "tailwind css"] },
  { label: "Python", terms: ["python"] },
  { label: "Java", terms: ["java"] },
  { label: "C++", terms: ["c++", "cpp"] },
  { label: "C#", terms: ["c#", "csharp"] },
  { label: "PHP", terms: ["php"] },
  { label: "Kotlin", terms: ["kotlin"] },
  { label: "Swift", terms: ["swift"] },
  { label: "SQL", terms: ["sql"] },
  { label: "PostgreSQL", terms: ["postgresql", "postgres"] },
  { label: "MySQL", terms: ["mysql"] },
  { label: "MongoDB", terms: ["mongodb", "mongo db"] },
  { label: "Firebase", terms: ["firebase"] },
  { label: "FastAPI", terms: ["fastapi", "fast api"] },
  { label: "Django", terms: ["django"] },
  { label: "Flask", terms: ["flask"] },
  { label: "Spring Boot", terms: ["spring boot", "springboot"] },
  { label: "REST API", terms: ["rest api", "rest apis", "restful api", "restful apis"] },
  { label: "GraphQL", terms: ["graphql"] },
  { label: "Docker", terms: ["docker"] },
  { label: "Kubernetes", terms: ["kubernetes", "k8s"] },
  { label: "AWS", terms: ["aws", "amazon web services"] },
  { label: "Azure", terms: ["azure"] },
  { label: "Google Cloud", terms: ["gcp", "google cloud"] },
  { label: "Git", terms: ["git"] },
  { label: "GitHub Actions", terms: ["github actions"] },
  { label: "Machine Learning", terms: ["machine learning", "ml"] },
  { label: "TensorFlow", terms: ["tensorflow"] },
  { label: "PyTorch", terms: ["pytorch"] },
  { label: "scikit-learn", terms: ["scikit-learn", "sklearn"] },
  { label: "Pandas", terms: ["pandas"] },
  { label: "NumPy", terms: ["numpy"] },
  { label: "Power BI", terms: ["power bi", "powerbi"] },
  { label: "Tableau", terms: ["tableau"] },
  { label: "Selenium", terms: ["selenium"] },
  { label: "Testing", terms: ["testing", "jest", "vitest", "cypress", "playwright"] },
  { label: "Linux", terms: ["linux"] },
];

const PROJECT_TEMPLATES = [
  {
    title: "Production Job Application Tracker",
    skills: ["React", "TypeScript", "Node.js", "Express.js", "MongoDB", "REST API", "Testing", "Docker"],
    features: ["Application board with filters", "CRUD API and validation", "Progress analytics dashboard", "Tests and containerized deployment"],
    blueprint: {
      stack: "React + TypeScript, Node.js, Express, MongoDB, Vitest, Docker",
      screens: ["Application pipeline", "Application form", "Analytics dashboard", "Account settings"],
      api: ["GET/POST /applications", "PATCH/DELETE /applications/:id", "GET /analytics/summary"],
      data: ["User", "Application", "Company", "ActivityEvent"],
      buildSteps: ["Model applications and statuses", "Build validated REST endpoints", "Create board and filters", "Add analytics, tests and Docker"],
      resumeLine: "Built a tested full-stack job tracker with REST APIs, analytics and a containerized deployment workflow.",
    },
  },
  {
    title: "Realtime Team Issue Board",
    skills: ["React", "Next.js", "TypeScript", "Firebase", "Testing", "Tailwind CSS"],
    features: ["Live task board", "Role-based workspaces", "Search and activity timeline", "Responsive tested interface"],
    blueprint: {
      stack: "Next.js + TypeScript, Firebase Auth/Firestore, Tailwind CSS, Playwright",
      screens: ["Workspace board", "Issue details", "Team activity", "Member settings"],
      api: ["Firestore realtime listeners", "Auth and role rules", "Issue create/update actions"],
      data: ["Workspace", "Member", "Issue", "ActivityEvent"],
      buildSteps: ["Define roles and security rules", "Build realtime issue workflow", "Add search and audit history", "Test access and responsive states"],
      resumeLine: "Created a realtime team issue board with role-based access, searchable activity history and end-to-end tests.",
    },
  },
  {
    title: "Cloud Deployment Monitor",
    skills: ["React", "Node.js", "Docker", "Kubernetes", "AWS", "GitHub Actions", "Linux"],
    features: ["Service health dashboard", "Deployment history", "CI/CD status reporting", "Container and cloud setup"],
    blueprint: {
      stack: "React, Node.js, Docker, Kubernetes, AWS, GitHub Actions",
      screens: ["Service overview", "Deployment timeline", "Incident details", "Environment settings"],
      api: ["GET /services/health", "GET /deployments", "POST /incidents", "Webhook /deployments"],
      data: ["Service", "Deployment", "HealthCheck", "Incident"],
      buildSteps: ["Containerize a sample service", "Collect health and deployment events", "Build status dashboard", "Automate CI/CD and document recovery"],
      resumeLine: "Developed a cloud deployment monitor that tracks service health, CI/CD events and incident history across environments.",
    },
  },
  {
    title: "AI Support Ticket Classifier",
    skills: ["Python", "Machine Learning", "scikit-learn", "Pandas", "FastAPI", "Docker"],
    features: ["Trainable text classifier", "Evaluation metrics", "Prediction REST API", "Docker deployment"],
    blueprint: {
      stack: "Python, Pandas, scikit-learn, FastAPI, pytest, Docker",
      screens: ["Ticket classifier", "Model metrics", "Prediction history", "Dataset notes"],
      api: ["POST /predict", "GET /model/metrics", "POST /feedback", "GET /health"],
      data: ["Ticket", "Prediction", "Label", "Feedback"],
      buildSteps: ["Clean and label ticket data", "Train and evaluate a baseline model", "Expose prediction API", "Add feedback, tests and Docker"],
      resumeLine: "Trained and deployed a support-ticket classifier with measurable evaluation metrics, feedback capture and a FastAPI service.",
    },
  },
  {
    title: "Sales Analytics Dashboard",
    skills: ["Python", "SQL", "Pandas", "NumPy", "Power BI", "Tableau"],
    features: ["Clean and model a dataset", "KPI and trend analysis", "Interactive dashboards", "Documented business insights"],
    blueprint: {
      stack: "Python, Pandas, NumPy, SQL, Power BI or Tableau",
      screens: ["Executive summary", "Revenue trends", "Product analysis", "Regional drill-down"],
      api: ["SQL reporting views", "Scheduled data refresh", "CSV export pipeline"],
      data: ["Order", "Customer", "Product", "Region"],
      buildSteps: ["Clean and validate the dataset", "Design a star schema", "Create KPIs and drill-downs", "Publish insights and data-quality notes"],
      resumeLine: "Built an interactive sales analytics dashboard with a documented data model, KPI definitions and decision-focused insights.",
    },
  },
  {
    title: "Spring Boot Expense Manager",
    skills: ["Java", "Spring Boot", "SQL", "REST API", "Docker", "Testing"],
    features: ["Layered REST API", "Database persistence", "Validation and test suite", "Containerized setup"],
    blueprint: {
      stack: "Java, Spring Boot, PostgreSQL, JUnit, Testcontainers, Docker",
      screens: ["Expense dashboard", "Transaction form", "Budget view", "Monthly reports"],
      api: ["/api/expenses CRUD", "/api/budgets CRUD", "GET /api/reports/monthly"],
      data: ["User", "Expense", "Category", "Budget"],
      buildSteps: ["Design entities and migrations", "Build layered REST API", "Add validation and reporting", "Test with containers and package"],
      resumeLine: "Engineered a layered Spring Boot expense API with PostgreSQL persistence, validation and integration tests.",
    },
  },
  {
    title: "Storefront Performance Dashboard",
    skills: ["JavaScript", "React", "HTML", "CSS", "REST API", "Testing"],
    features: ["Product search and filters", "REST API integration", "Loading and error states", "Responsive UI with tests"],
    blueprint: {
      stack: "React, JavaScript, semantic HTML, modern CSS, REST API, Vitest",
      screens: ["Product catalog", "Product details", "Saved comparison", "Performance dashboard"],
      api: ["GET /products", "GET /products/:id", "GET /categories", "Client performance events"],
      data: ["Product", "Category", "SavedItem", "PerformanceEvent"],
      buildSteps: ["Build accessible catalog UI", "Integrate API states and caching", "Add comparison and performance metrics", "Test critical user journeys"],
      resumeLine: "Delivered a responsive React storefront dashboard with resilient REST API states, performance tracking and automated UI tests.",
    },
  },
];

const demoUser = {
  login: "octocat", name: "The Octocat", avatar_url: "https://github.com/images/error/octocat_happy.gif",
  bio: "A friendly GitHub mascot exploring code and open source.", location: "San Francisco",
  blog: "https://github.blog", html_url: "https://github.com/octocat", public_repos: 8,
  followers: 18600, following: 9, created_at: "2011-01-25T18:44:36Z", company: "@github",
};

const demoRepos = [
  { id: 1, name: "Hello-World", description: "A classic first repository for exploring GitHub workflows.", html_url: "https://github.com/octocat/Hello-World", language: "JavaScript", stargazers_count: 2980, forks_count: 3100, open_issues_count: 1800, updated_at: "2025-08-20T12:00:00Z", fork: false, topics: ["hello-world", "learning"] },
  { id: 2, name: "Spoon-Knife", description: "A repository for practicing forks and pull requests.", html_url: "https://github.com/octocat/Spoon-Knife", language: "HTML", stargazers_count: 13200, forks_count: 152000, open_issues_count: 25000, updated_at: "2025-09-12T12:00:00Z", fork: false, topics: ["git", "practice"] },
  { id: 3, name: "octocat.github.io", description: "A compact personal site hosted with GitHub Pages.", html_url: "https://github.com/octocat/octocat.github.io", language: "CSS", stargazers_count: 950, forks_count: 1200, open_issues_count: 40, updated_at: "2025-04-05T12:00:00Z", fork: false, topics: ["portfolio", "github-pages"] },
  { id: 4, name: "git-consortium", description: "Example collaborative code and documentation project.", html_url: "https://github.com/octocat/git-consortium", language: "Shell", stargazers_count: 420, forks_count: 210, open_issues_count: 12, updated_at: "2024-11-19T12:00:00Z", fork: false, topics: ["collaboration"] },
];

const compact = (value = 0) => new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
const dateLabel = (value) => new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(value));
const updatedLabel = (value) => new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));

async function extractResumeText(file) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const supported = ["pdf", "docx", "txt", "md"];
  if (!supported.includes(extension)) throw new Error("Use a PDF, DOCX, TXT or MD resume file.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Resume file must be smaller than 8 MB.");

  let text = "";
  if (extension === "txt" || extension === "md") {
    text = await file.text();
  } else if (extension === "docx") {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    text = result.value;
  } else {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
    const pages = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(content.items.map((item) => ("str" in item ? item.str : "")).join(" "));
    }
    text = pages.join("\n");
  }

  const cleaned = text.replace(/\u0000/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (!cleaned) throw new Error("No readable text was found. For scanned PDFs, use a selectable-text PDF or DOCX file.");
  return cleaned;
}

function searchableText(value = "") {
  return ` ${value.toLowerCase().replace(/[^a-z0-9+#.]+/g, " ").replace(/\s+/g, " ").trim()} `;
}

function extractSkills(value = "") {
  const text = searchableText(value);
  return SKILL_DICTIONARY.filter(({ terms }) => terms.some((term) => text.includes(` ${term} `))).map(({ label }) => label);
}

function profileSkillsFromRepos(repos) {
  const repositoryText = repos.map((repo) => [repo.name, repo.description, repo.language, ...(repo.topics || [])].filter(Boolean).join(" ")).join(" ");
  const detected = extractSkills(repositoryText);
  const languages = repos.map((repo) => repo.language).filter(Boolean);
  return [...new Set([...detected, ...languages])].sort((a, b) => a.localeCompare(b));
}

function repoSkillReason(repo, skill) {
  if (repo.language?.toLowerCase() === skill.toLowerCase()) return "Primary language";
  const definition = SKILL_DICTIONARY.find(({ label }) => label === skill);
  if (!definition) return null;
  const topics = searchableText((repo.topics || []).join(" "));
  if (definition.terms.some((term) => topics.includes(` ${term} `))) return "Repository topic";
  const context = searchableText(`${repo.name} ${repo.description || ""}`);
  if (definition.terms.some((term) => context.includes(` ${term} `))) return "Project context";
  return null;
}

function skillEvidenceMap(repos, profileSkills) {
  return profileSkills.map((skill) => ({
    skill,
    repositories: repos
      .map((repo) => ({ repo, reason: repoSkillReason(repo, skill) }))
      .filter(({ reason }) => reason)
      .slice(0, 3),
  })).filter(({ repositories }) => repositories.length)
    .sort((a, b) => b.repositories.length - a.repositories.length || a.skill.localeCompare(b.skill));
}

function skillMatch(value, profileSkills) {
  const required = extractSkills(value);
  const profileSet = new Set(profileSkills.map((skill) => skill.toLowerCase()));
  const matched = required.filter((skill) => profileSet.has(skill.toLowerCase()));
  const missing = required.filter((skill) => !profileSet.has(skill.toLowerCase()));
  return { required, matched, missing, score: required.length ? Math.round((matched.length / required.length) * 100) : 0 };
}

function projectRecommendation(missing, required) {
  const targets = missing.length ? missing : required;
  const targetSet = new Set(targets);
  const ranked = PROJECT_TEMPLATES.map((project) => ({
    ...project,
    coverage: project.skills.filter((skill) => targetSet.has(skill)),
    relevance: project.skills.filter((skill) => required.includes(skill)).length,
  })).sort((a, b) => b.coverage.length - a.coverage.length || b.relevance - a.relevance);
  return ranked[0];
}

function repoQuality(repo) {
  let score = 8;
  score += repo.description ? 18 : 0;
  score += repo.language ? 10 : 0;
  score += Math.min(15, (repo.topics?.length || 0) * 5);
  score += Math.min(15, Math.log10((repo.stargazers_count || 0) + 1) * 5);
  score += Math.min(10, Math.log10((repo.forks_count || 0) + 1) * 4);
  score += repo.homepage ? 8 : 0;
  score += repo.has_issues ? 4 : 0;
  score += repo.archived ? 0 : 5;
  const daysSinceUpdate = (Date.now() - new Date(repo.updated_at).getTime()) / 86400000;
  score += daysSinceUpdate < 180 ? 15 : daysSinceUpdate < 365 ? 10 : daysSinceUpdate < 730 ? 5 : 0;
  return Math.min(100, Math.round(score));
}

function analyzeReadmeText(markdown, exists = true) {
  const lower = markdown.toLowerCase();
  const checks = [
    { label: "Project overview", weight: 14, found: markdown.trim().length > 200 || /(overview|about|problem|purpose)/.test(lower), action: "Explain the problem, users and project outcome." },
    { label: "Features", weight: 12, found: /(features?|capabilities)/.test(lower), action: "List the main user-facing features." },
    { label: "Tech stack", weight: 10, found: /(tech stack|technologies|built with|stack)/.test(lower), action: "Name the tools used and why they were selected." },
    { label: "Installation", weight: 14, found: /(installation|getting started|setup|prerequisites)/.test(lower), action: "Add reproducible local setup instructions." },
    { label: "Usage or API", weight: 10, found: /(usage|how to use|api reference|endpoints?)/.test(lower), action: "Show how to use the app or its API." },
    { label: "Demo or screenshots", weight: 10, found: /!\[[^\]]*\]\(/.test(markdown) || /(live demo|screenshots?)/.test(lower), action: "Add a live link, screenshot or short demo." },
    { label: "Testing", weight: 10, found: /(testing|test suite|coverage|npm test|pytest)/.test(lower), action: "Document the test command and coverage." },
    { label: "Architecture", weight: 8, found: /(architecture|folder structure|project structure|workflow)/.test(lower), action: "Explain the architecture or folder structure." },
    { label: "License", weight: 6, found: /license/.test(lower), action: "State the project license." },
    { label: "Roadmap", weight: 6, found: /(roadmap|future scope|planned)/.test(lower), action: "Share the next improvements or roadmap." },
  ];
  return {
    exists,
    score: exists ? checks.reduce((total, check) => total + (check.found ? check.weight : 0), 0) : 0,
    checks,
    length: markdown.length,
  };
}

async function fetchReadmeAnalysis(owner, repoName) {
  const response = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}/readme`, { headers: API_HEADERS });
  const rate = {
    remaining: Number(response.headers.get("x-ratelimit-remaining") || 0),
    limit: Number(response.headers.get("x-ratelimit-limit") || 60),
  };
  if (response.status === 404) return { analysis: analyzeReadmeText("", false), rate };
  if (response.status === 403 || response.status === 429) throw new Error("GitHub API request limit reached. Please try again later.");
  if (!response.ok) throw new Error("README could not be loaded for this repository.");
  const data = await response.json();
  const binary = atob((data.content || "").replace(/\n/g, ""));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  const markdown = new TextDecoder().decode(bytes);
  return { analysis: { ...analyzeReadmeText(markdown), htmlUrl: data.html_url }, rate };
}

async function fetchProfileData(username) {
  const safeName = encodeURIComponent(username.trim());
  const userResponse = await fetch(`https://api.github.com/users/${safeName}`, { headers: API_HEADERS });
  if (userResponse.status === 404) throw new Error("No GitHub profile found with that username.");
  if (userResponse.status === 403 || userResponse.status === 429) throw new Error("GitHub API request limit reached. Please try again later.");
  if (!userResponse.ok) throw new Error("GitHub profile could not be loaded.");
  const user = await userResponse.json();

  const repoResponse = await fetch(`https://api.github.com/users/${safeName}/repos?per_page=100&sort=updated`, { headers: API_HEADERS });
  if (repoResponse.status === 403 || repoResponse.status === 429) throw new Error("GitHub API request limit reached. Please try again later.");
  if (!repoResponse.ok) throw new Error("Repositories could not be loaded.");
  const repos = await repoResponse.json();

  return {
    user,
    repos,
    rate: {
      remaining: Number(repoResponse.headers.get("x-ratelimit-remaining") || 0),
      limit: Number(repoResponse.headers.get("x-ratelimit-limit") || 60),
    },
  };
}

function profileMetrics(user, repos) {
  const stars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const forks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
  const languages = new Set(repos.map((repo) => repo.language).filter(Boolean));
  const described = repos.filter((repo) => repo.description).length;
  const recent = repos.some((repo) => Date.now() - new Date(repo.updated_at).getTime() < 1000 * 60 * 60 * 24 * 180);
  let score = 20;
  score += user.name ? 6 : 0;
  score += user.bio ? 12 : 0;
  score += user.location ? 4 : 0;
  score += user.blog ? 5 : 0;
  score += Math.min(18, repos.length * 1.5);
  score += Math.min(12, languages.size * 3);
  score += Math.min(10, Math.log10(stars + 1) * 3.2);
  score += repos.length ? (described / repos.length) * 8 : 0;
  score += recent ? 5 : 0;
  return { stars, forks, languages: languages.size, score: Math.min(100, Math.round(score)), described, recent };
}

function scoreImprovementPlan(user, repos, metrics) {
  const actions = [];
  if (!user.bio) actions.push({ title: "Add a role-focused bio", detail: "Mention your target role, strongest stack and the kind of products you build.", gain: 12 });
  if (!user.name) actions.push({ title: "Add your full name", detail: "Use the same professional name shown on your resume and LinkedIn.", gain: 6 });
  if (!user.blog) actions.push({ title: "Connect a portfolio or live project", detail: "Add a working portfolio URL or your strongest deployed project in the website field.", gain: 5 });
  if (!metrics.recent) actions.push({ title: "Publish a recent project update", detail: "Improve one strong project and push a meaningful update to show current activity.", gain: 5 });
  if (!user.location) actions.push({ title: "Add your location", detail: "Add your city or region so recruiters can quickly understand availability context.", gain: 4 });

  const repositorySlots = Math.max(0, 12 - repos.length);
  if (repositorySlots) {
    const suggestedProjects = Math.min(3, repositorySlots);
    actions.push({
      title: `Add ${suggestedProjects} complete role-relevant project${suggestedProjects > 1 ? "s" : ""}`,
      detail: "Prefer fewer finished projects with a README, demo and tests over many unfinished repositories.",
      gain: suggestedProjects * 1.5,
    });
  }

  if (metrics.languages < 4) {
    actions.push({ title: "Show one more relevant language", detail: "Use it in a complete project that fits your target job; do not add a skill without evidence.", gain: 3 });
  }

  if (repos.length && metrics.described < repos.length) {
    const gain = Math.max(0.5, Math.round((8 - (metrics.described / repos.length) * 8) * 10) / 10);
    actions.push({ title: "Complete missing repository descriptions", detail: `${repos.length - metrics.described} repositories need a clear problem, solution, stack and outcome summary.`, gain });
  }

  const rankedActions = actions.sort((a, b) => b.gain - a.gain).slice(0, 6);
  const totalGain = rankedActions.reduce((sum, action) => sum + action.gain, 0);
  const profile = rankedActions.length ? rankedActions : [{ title: "Maintain your strongest public proof", detail: "Keep your best three projects updated, documented and pinned for the roles you target.", gain: 0, complete: true }];

  const projects = repos
    .filter((repo) => !repo.fork)
    .map((repo) => {
      const fixes = [];
      if (!repo.description) fixes.push({ label: "Add a clear problem → solution description", gain: 18 });
      if (!repo.language) fixes.push({ label: "Add real source files so a primary language is detected", gain: 10 });
      const topicGain = Math.max(0, 15 - Math.min(15, (repo.topics?.length || 0) * 5));
      if (topicGain) fixes.push({ label: "Add up to three accurate technology and domain topics", gain: topicGain });
      if (!repo.homepage) fixes.push({ label: "Add a working deployed demo link", gain: 8 });
      if (!repo.has_issues) fixes.push({ label: "Enable Issues for transparent planning and feedback", gain: 4 });
      const daysSinceUpdate = (Date.now() - new Date(repo.updated_at).getTime()) / 86400000;
      const activityPoints = daysSinceUpdate < 180 ? 15 : daysSinceUpdate < 365 ? 10 : daysSinceUpdate < 730 ? 5 : 0;
      if (activityPoints < 15) fixes.push({ label: "Publish a meaningful recent update", gain: 15 - activityPoints });
      const selectedFixes = fixes.sort((a, b) => b.gain - a.gain).slice(0, 2);
      const current = repoQuality(repo);
      return { repo, current, potential: Math.min(100, current + selectedFixes.reduce((sum, fix) => sum + fix.gain, 0)), fixes: selectedFixes };
    })
    .filter(({ fixes }) => fixes.length)
    .sort((a, b) => a.current - b.current)
    .slice(0, 3);

  return {
    current: metrics.score,
    potential: Math.min(100, Math.round(metrics.score + totalGain)),
    profile,
    projects,
  };
}

export default function DevLensClient() {
  const [input, setInput] = useState("octocat");
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [source, setSource] = useState("live");
  const [rate, setRate] = useState({ remaining: 60, limit: 60 });
  const [repoQuery, setRepoQuery] = useState("");
  const [language, setLanguage] = useState("all");
  const [sort, setSort] = useState("stars");
  const [recent, setRecent] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareInput, setCompareInput] = useState("");
  const [compareData, setCompareData] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [jobText, setJobText] = useState("");
  const [resumeResult, setResumeResult] = useState(null);
  const [jobResult, setJobResult] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeUploadError, setResumeUploadError] = useState("");
  const [readmeRepo, setReadmeRepo] = useState("");
  const [readmeResult, setReadmeResult] = useState(null);
  const [readmeLoading, setReadmeLoading] = useState(false);
  const [readmeError, setReadmeError] = useState("");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("devlens-theme");
    const storedRecent = window.localStorage.getItem("devlens-recent");
    if (storedTheme === "light") setTheme("light");
    if (storedRecent) {
      try { setRecent(JSON.parse(storedRecent)); } catch { window.localStorage.removeItem("devlens-recent"); }
    }
    analyze("octocat", true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    window.localStorage.setItem("devlens-theme", theme);
  }, [theme]);

  const saveRecent = (username) => {
    setRecent((current) => {
      const next = [username, ...current.filter((item) => item.toLowerCase() !== username.toLowerCase())].slice(0, 5);
      window.localStorage.setItem("devlens-recent", JSON.stringify(next));
      return next;
    });
  };

  async function analyze(username, initial = false) {
    const clean = username.trim();
    if (!clean) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchProfileData(clean);
      setUser(data.user);
      setRepos(data.repos);
      setRate(data.rate);
      setSource("live");
      setInput(data.user.login);
      setRepoQuery("");
      setLanguage("all");
      setResumeResult(null);
      setJobResult(null);
      setCompareData(null);
      setCompareInput("");
      setCompareError("");
      setReadmeRepo(data.repos[0]?.name || "");
      setReadmeResult(null);
      setReadmeError("");
      saveRecent(data.user.login);
    } catch (requestError) {
      setError(requestError.message);
      if (initial || !user) {
        setUser(demoUser);
        setRepos(demoRepos);
        setSource("demo");
        setReadmeRepo(demoRepos[0].name);
        setReadmeResult(null);
        setReadmeError("");
      }
    } finally { setLoading(false); }
  }

  const metrics = useMemo(() => user ? profileMetrics(user, repos) : null, [user, repos]);
  const languageData = useMemo(() => {
    const counts = repos.reduce((acc, repo) => {
      if (repo.language) acc[repo.language] = (acc[repo.language] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [repos]);

  const languages = useMemo(() => ["all", ...languageData.map((item) => item.name)], [languageData]);
  const profileSkills = useMemo(() => profileSkillsFromRepos(repos), [repos]);
  const evidenceMap = useMemo(() => skillEvidenceMap(repos, profileSkills), [repos, profileSkills]);
  const averageQuality = useMemo(() => repos.length ? Math.round(repos.reduce((sum, repo) => sum + repoQuality(repo), 0) / repos.length) : 0, [repos]);
  const improvementPlan = useMemo(() => user && metrics ? scoreImprovementPlan(user, repos, metrics) : null, [user, repos, metrics]);
  const filteredRepos = useMemo(() => {
    const query = repoQuery.toLowerCase().trim();
    return repos.filter((repo) => {
      const matchesQuery = `${repo.name} ${repo.description || ""}`.toLowerCase().includes(query);
      return matchesQuery && (language === "all" || repo.language === language);
    }).sort((a, b) => {
      if (sort === "quality") return repoQuality(b) - repoQuality(a);
      if (sort === "forks") return b.forks_count - a.forks_count;
      if (sort === "updated") return new Date(b.updated_at) - new Date(a.updated_at);
      return b.stargazers_count - a.stargazers_count;
    });
  }, [repos, repoQuery, language, sort]);

  const suggestions = useMemo(() => {
    if (!user || !metrics) return [];
    const items = [];
    if (!user.bio) items.push("Add a concise bio that names your role and strongest skills.");
    if (!user.blog) items.push("Link your portfolio or LinkedIn profile from GitHub.");
    if (repos.length && metrics.described / repos.length < 0.7) items.push("Add clear descriptions to more repositories.");
    if (metrics.languages < 2) items.push("Show one more relevant language through a complete project.");
    if (!metrics.recent) items.push("Update or pin a recent project to show current activity.");
    if (!items.length) items.push("Strong public profile signals—keep your best repositories pinned and documented.");
    return items.slice(0, 3);
  }, [user, repos, metrics]);

  const handleSubmit = (event) => { event.preventDefault(); analyze(input); };

  const runMatch = (kind) => {
    if (kind === "resume") {
      setResumeResult(skillMatch(resumeText, profileSkills));
      return;
    }
    const result = skillMatch(jobText, profileSkills);
    setJobResult({ ...result, recommendation: projectRecommendation(result.missing, result.required) });
  };

  const compareProfile = async (event) => {
    event.preventDefault();
    if (!compareInput.trim()) return;
    if (user && compareInput.trim().toLowerCase() === user.login.toLowerCase()) {
      setCompareError("Enter a different GitHub username to compare.");
      return;
    }
    setCompareLoading(true);
    setCompareError("");
    try {
      const data = await fetchProfileData(compareInput);
      setCompareData({ ...data, metrics: profileMetrics(data.user, data.repos) });
      setRate(data.rate);
    } catch (requestError) { setCompareError(requestError.message); }
    finally { setCompareLoading(false); }
  };

  const handleResumeFile = async (file) => {
    if (!file) return;
    setResumeUploading(true);
    setResumeUploadError("");
    try {
      const text = await extractResumeText(file);
      setResumeText(text);
      setResumeFileName(file.name);
      setResumeResult(skillMatch(text, profileSkills));
      toast.success("Resume text extracted and matched");
    } catch (uploadError) {
      setResumeFileName("");
      setResumeUploadError(uploadError.message);
    } finally { setResumeUploading(false); }
  };

  const clearResumeFile = () => {
    setResumeFileName("");
    setResumeText("");
    setResumeResult(null);
    setResumeUploadError("");
  };

  const runReadmeAnalysis = async () => {
    if (!user || !readmeRepo) return;
    setReadmeLoading(true);
    setReadmeError("");
    try {
      const data = await fetchReadmeAnalysis(user.login, readmeRepo);
      setReadmeResult({ ...data.analysis, repoName: readmeRepo });
      setRate(data.rate);
    } catch (requestError) {
      setReadmeResult(null);
      setReadmeError(requestError.message);
    } finally { setReadmeLoading(false); }
  };

  const copySummary = async () => {
    if (!user || !metrics) return;
    const topLanguages = languageData.slice(0, 3).map((item) => item.name).join(", ") || "Not listed";
    const summary = `${user.name || user.login} (@${user.login}) — ${repos.length} repositories, ${metrics.stars} stars, top languages: ${topLanguages}.`;
    try { await navigator.clipboard.writeText(summary); toast.success("Profile summary copied"); }
    catch { toast.error("Could not copy the summary"); }
  };

  return (
    <div className="devlens-app">
      <Toaster theme={theme} position="bottom-center" richColors />
      <header className="topbar">
        <a className="logo" href="#top" aria-label="DevLens home"><span><Code2 size={20} /></span>DevLens<small>V4</small></a>
        <form className="global-search" onSubmit={handleSubmit}>
          <Search size={18} /><label className="sr-only" htmlFor="github-user">GitHub username</label>
          <input id="github-user" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Enter a GitHub username" autoComplete="off" />
          <button type="submit" disabled={loading}>{loading ? "Analyzing…" : "Analyze"}</button>
        </form>
        <div className="top-actions">
          <span className="api-status"><i className={source === "live" ? "online" : "demo"} />{source === "live" ? "Live API" : "Demo data"}</span>
          <button className="theme-button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <main id="top" className="dashboard-shell">
        {error && <div className="error-banner" role="alert"><AlertTriangle size={18} /><span>{error}</span><button onClick={() => setError("")} aria-label="Dismiss message">×</button></div>}

        {loading && !user ? <DashboardSkeleton /> : user && metrics ? (
          <div className="dashboard-grid">
            <aside className="profile-column">
              <section className="profile-card panel">
                <div className="avatar-wrap"><img src={user.avatar_url} alt={`${user.login} avatar`} /><span /></div>
                <div className="profile-name"><h1>{user.name || user.login}</h1><p>@{user.login}</p></div>
                {user.bio && <p className="profile-bio">{user.bio}</p>}
                <div className="profile-meta">
                  {user.company && <span><Users size={16} />{user.company}</span>}
                  {user.location && <span><MapPin size={16} />{user.location}</span>}
                  {user.blog && <a href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`} target="_blank" rel="noreferrer"><LinkIcon size={16} />Portfolio link</a>}
                  <span><CalendarDays size={16} />Joined {dateLabel(user.created_at)}</span>
                </div>
                <div className="profile-buttons">
                  <a href={user.html_url} target="_blank" rel="noreferrer">Open GitHub <ExternalLink size={16} /></a>
                  <button onClick={copySummary}><Share2 size={16} />Copy summary</button>
                </div>
              </section>

              <section className="recent-card panel">
                <div className="panel-title small"><div><History size={17} /><h2>Recent searches</h2></div></div>
                {recent.length ? <div className="recent-list">{recent.map((name) => <button key={name} onClick={() => analyze(name)}><span>@{name}</span><ArrowUpRight size={14} /></button>)}</div> : <p className="muted-copy">Your recent profile searches will appear here.</p>}
              </section>

              <div className="rate-note"><Activity size={15} /><span>API requests remaining</span><strong>{rate.remaining}/{rate.limit}</strong></div>
            </aside>

            <div className="main-column">
              <section className="score-panel panel">
                <div className="score-copy">
                  <span className="eyebrow">PORTFOLIO SNAPSHOT</span>
                  <h2>Public developer signal</h2>
                  <p>A quick, explainable score based on profile completeness, repository quality signals and recent public activity.</p>
                  <button className="compare-button" onClick={() => setCompareOpen(true)}><UserRoundSearch size={18} />Compare profile</button>
                </div>
                <div className="score-ring" style={{ "--score": `${metrics.score * 3.6}deg` }}><div><strong>{metrics.score}</strong><span>/100</span></div></div>
              </section>

              <section className="metrics-grid">
                <Metric icon={<BookOpen />} label="Repositories" value={user.public_repos} hint={`${repos.length} analyzed`} tone="cyan" />
                <Metric icon={<Star />} label="Total stars" value={compact(metrics.stars)} hint="Across loaded repos" tone="lime" />
                <Metric icon={<GitFork />} label="Total forks" value={compact(metrics.forks)} hint="Community reuse" tone="violet" />
                <Metric icon={<Users />} label="Followers" value={compact(user.followers)} hint={`${compact(user.following)} following`} tone="coral" />
              </section>

              <section className="insights-grid">
                <div className="language-panel panel">
                  <div className="panel-title"><div><Code2 size={18} /><h2>Language mix</h2></div><span>By repository count</span></div>
                  {languageData.length ? <div className="language-layout">
                    <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={languageData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={76} paddingAngle={3} stroke="none">{languageData.map((item, index) => <Cell key={item.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}</Pie><Tooltip contentStyle={{ background: "#111827", border: "1px solid #334155", borderRadius: 10, color: "#fff" }} /></PieChart></ResponsiveContainer><div className="chart-center"><strong>{metrics.languages}</strong><span>languages</span></div></div>
                    <div className="language-legend">{languageData.map((item, index) => <div key={item.name}><i style={{ background: CHART_COLORS[index % CHART_COLORS.length] }} /><span>{item.name}</span><strong>{item.value}</strong></div>)}</div>
                  </div> : <div className="empty-mini">No primary languages reported.</div>}
                </div>

                <div className="suggestion-panel panel">
                  <div className="panel-title"><div><Trophy size={18} /><h2>Portfolio signals</h2></div><span>Actionable</span></div>
                  <div className="suggestion-list">{suggestions.map((item, index) => <div key={item}><span>{index + 1}</span><p>{item}</p></div>)}</div>
                  <p className="score-disclaimer"><CheckCircle2 size={15} />This is a project heuristic, not a GitHub or hiring score.</p>
                </div>
              </section>

              <section className="career-panel panel">
                <div className="career-header">
                  <div>
                    <span className="eyebrow">CAREER MATCH LAB</span>
                    <h2>Turn repositories into job evidence</h2>
                    <p>Compare resume or job-description skills with signals detected across @{user.login}&apos;s public repositories.</p>
                  </div>
                  <div className="privacy-note"><ShieldCheck size={17} /><span>Runs locally in your browser<br /><strong>Text is not stored or uploaded</strong></span></div>
                </div>

                <div className="detected-skills">
                  <div><Target size={17} /><strong>GitHub skill inventory</strong><span>{profileSkills.length} detected</span></div>
                  {profileSkills.length ? <div className="skill-cloud">{profileSkills.slice(0, 16).map((skill) => <span key={skill}>{skill}</span>)}</div> : <p>No recognizable skills found in repository languages, topics or descriptions.</p>}
                </div>

                <Tabs defaultValue="resume" className="match-tabs">
                  <TabsList className="match-tab-list">
                    <TabsTrigger value="resume"><FileText />Resume ↔ GitHub</TabsTrigger>
                    <TabsTrigger value="job"><Briefcase />Job description ↔ GitHub</TabsTrigger>
                  </TabsList>
                  <TabsContent value="resume">
                    <MatchWorkspace
                      title="Resume evidence match"
                      description="Paste the skills, summary or project section from your resume. DevLens checks which claims have visible GitHub evidence."
                      placeholder="Example: Frontend developer skilled in React, JavaScript, HTML, CSS, REST APIs and testing..."
                      value={resumeText}
                      onChange={setResumeText}
                      onMatch={() => runMatch("resume")}
                      result={resumeResult}
                      buttonLabel="Match resume"
                      upload={{
                        fileName: resumeFileName,
                        loading: resumeUploading,
                        error: resumeUploadError,
                        onFile: handleResumeFile,
                        onClear: clearResumeFile,
                      }}
                    />
                  </TabsContent>
                  <TabsContent value="job">
                    <MatchWorkspace
                      title="Job readiness match"
                      description="Paste a job description to find matched skills, practical gaps and the best next portfolio project."
                      placeholder="Paste role requirements here: React, TypeScript, REST APIs, Git, testing..."
                      value={jobText}
                      onChange={setJobText}
                      onMatch={() => runMatch("job")}
                      result={jobResult}
                      buttonLabel="Match job description"
                    />
                  </TabsContent>
                </Tabs>
              </section>

              <section className="proof-panel panel">
                <div className="proof-header">
                  <div>
                    <span className="eyebrow">REPOSITORY PROOF LAB</span>
                    <h2>Verify the evidence behind every claim</h2>
                    <p>See which repositories support each detected skill, then audit one README for the details recruiters expect.</p>
                  </div>
                  <span className="public-data-note"><ShieldCheck size={17} />Public GitHub data</span>
                </div>
                <div className="proof-grid">
                  <SkillEvidence evidence={evidenceMap} />
                  <ReadmeAnalyzer
                    repos={repos}
                    selectedRepo={readmeRepo}
                    onRepoChange={(value) => { setReadmeRepo(value); setReadmeResult(null); setReadmeError(""); }}
                    onAnalyze={runReadmeAnalysis}
                    result={readmeResult}
                    loading={readmeLoading}
                    error={readmeError}
                  />
                </div>
              </section>

              <section className="repos-panel panel">
                <div className="repo-header">
                  <div><span className="eyebrow">REPOSITORY INTELLIGENCE</span><h2>Projects worth opening</h2></div>
                  <div className="repo-summary"><strong>{averageQuality}/100</strong><span>average quality</span><small>{filteredRepos.length} shown</small></div>
                </div>
                <div className="repo-tools">
                  <label className="repo-search"><Search size={17} /><span className="sr-only">Search repositories</span><input value={repoQuery} onChange={(event) => setRepoQuery(event.target.value)} placeholder="Search repositories" /></label>
                  <Select value={language} onValueChange={setLanguage}><SelectTrigger className="filter-select" aria-label="Filter by language"><SelectValue placeholder="Language" /></SelectTrigger><SelectContent><SelectItem value="all">All languages</SelectItem>{languages.slice(1).map((item) => <SelectItem value={item} key={item}>{item}</SelectItem>)}</SelectContent></Select>
                  <Select value={sort} onValueChange={setSort}><SelectTrigger className="filter-select" aria-label="Sort repositories"><SelectValue placeholder="Sort" /></SelectTrigger><SelectContent><SelectItem value="quality">Best quality</SelectItem><SelectItem value="stars">Most starred</SelectItem><SelectItem value="forks">Most forked</SelectItem><SelectItem value="updated">Recently updated</SelectItem></SelectContent></Select>
                </div>
                <p className="quality-method"><ShieldCheck size={15} />Quality scores use public metadata—description, topics, activity, links, stars and forks—not a source-code audit.</p>
                {filteredRepos.length ? <div className="repo-grid">{filteredRepos.slice(0, 12).map((repo) => <RepositoryCard repo={repo} key={repo.id} />)}</div> : <div className="repo-empty"><Search size={23} /><h3>No matching repositories</h3><p>Try another keyword or language filter.</p><button onClick={() => { setRepoQuery(""); setLanguage("all"); }}>Clear filters</button></div>}
              </section>

              {improvementPlan && <ScoreImprovementRoadmap plan={improvementPlan} />}
            </div>
          </div>
        ) : null}
      </main>

      <footer><a className="logo footer-logo" href="#top"><span><Code2 size={18} /></span>DevLens</a><p>Built with React and the GitHub REST API.</p><span>Public data only · No login required</span></footer>

      <Sheet open={compareOpen} onOpenChange={setCompareOpen}>
        <SheetContent className="compare-sheet">
          <SheetHeader className="compare-heading"><span className="eyebrow">PROFILE COMPARISON LAB</span><SheetTitle className="compare-title">Compare public developer signals</SheetTitle><SheetDescription>Use the same explainable rules for both profiles, then review strengths and shared technology evidence.</SheetDescription></SheetHeader>
          <div className="compare-body">
            <div className="compare-steps" aria-label="Comparison process">
              <div className="done"><span>1</span><p><strong>Current profile</strong><small>@{user?.login || "profile"}</small></p></div>
              <div className={compareData ? "done" : "active"}><span>2</span><p><strong>Add profile</strong><small>Public username</small></p></div>
              <div className={compareData ? "done" : ""}><span>3</span><p><strong>Review report</strong><small>Signals and skills</small></p></div>
            </div>
            {user && metrics && <div className="compare-source-profile"><img src={user.avatar_url} alt="" /><span><small>Comparing from</small><strong>{user.name || user.login}</strong><em>@{user.login} · {metrics.score}/100</em></span><CheckCircle2 size={18} /></div>}
            <form className="compare-form" onSubmit={compareProfile}>
              <label htmlFor="compare-user">Second GitHub username</label>
              <div className="compare-search"><Search size={17} /><input id="compare-user" value={compareInput} onChange={(event) => { setCompareInput(event.target.value); setCompareError(""); }} placeholder="Example: torvalds" autoComplete="off" /><button disabled={compareLoading}>{compareLoading ? "Analyzing…" : "Compare profiles"}</button></div>
              <p><ShieldCheck size={14} />Only public GitHub profile and repository data is used.</p>
            </form>
            {compareError && <div className="compare-error"><AlertTriangle size={16} />{compareError}</div>}
            {compareData && user && metrics ? <Comparison current={{ user, metrics, repos }} other={compareData} onReset={() => { setCompareData(null); setCompareInput(""); setCompareError(""); }} /> : <div className="compare-placeholder"><UserRoundSearch size={34} /><h3>Enter a second profile</h3><p>DevLens will compare portfolio score, repository quality, public activity and technology overlap using the same method.</p><div><span>1. Fetch public data</span><span>2. Normalize both profiles</span><span>3. Show evidence gaps</span></div></div>}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Metric({ icon, label, value, hint, tone }) {
  return <article className={`metric-card panel ${tone}`}><span className="metric-icon">{icon}</span><div><p>{label}</p><strong>{value}</strong><small>{hint}</small></div></article>;
}

function MatchWorkspace({ title, description, placeholder, value, onChange, onMatch, result, buttonLabel, upload }) {
  return <div className="match-workspace">
    <div className="match-input-card">
      <h3>{title}</h3>
      <p>{description}</p>
      {upload && <ResumeUpload {...upload} />}
      <Textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="match-textarea" />
      <div className="match-input-footer"><span>{value.length.toLocaleString()} characters</span><button onClick={onMatch} disabled={!value.trim()}><Target size={16} />{buttonLabel}</button></div>
    </div>
    <MatchResult result={result} />
  </div>;
}

function ResumeUpload({ fileName, loading, error, onFile, onClear }) {
  const accept = ".pdf,.docx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown";
  return <div className="resume-upload-wrap">
    <label
      className={`resume-upload ${loading ? "loading" : ""}`}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => { event.preventDefault(); onFile(event.dataTransfer.files?.[0]); }}
    >
      <input type="file" accept={accept} onChange={(event) => { onFile(event.target.files?.[0]); event.target.value = ""; }} disabled={loading} />
      <UploadCloud size={21} />
      <span><strong>{loading ? "Reading resume…" : "Upload resume"}</strong><small>PDF, DOCX, TXT or MD · maximum 8 MB</small></span>
      <em>Browse</em>
    </label>
    <p className="upload-privacy"><ShieldCheck size={14} />Your file is read locally in this browser and is not uploaded.</p>
    {fileName && <div className="uploaded-resume"><FileText size={16} /><span><strong>{fileName}</strong><small>Text extracted and matched automatically</small></span><button type="button" onClick={onClear} aria-label="Remove uploaded resume"><X size={15} /></button></div>}
    {error && <div className="upload-error" role="alert"><AlertTriangle size={15} />{error}</div>}
    <div className="input-divider"><span>or paste resume text</span></div>
  </div>;
}

function MatchResult({ result }) {
  if (!result) return <div className="match-placeholder"><Target size={32} /><h3>Your match report appears here</h3><p>DevLens extracts known technical skills and compares them with public repository evidence.</p></div>;
  if (!result.required.length) return <div className="match-placeholder"><AlertTriangle size={30} /><h3>No known skills detected</h3><p>Add a skills section or more technical requirements, then run the match again.</p></div>;
  const label = result.score >= 75 ? "Strong evidence" : result.score >= 45 ? "Partial evidence" : "Needs stronger proof";
  return <div className="match-result">
    <div className="match-score"><div><strong>{result.score}%</strong><span>{label}</span></div><small>{result.matched.length} of {result.required.length} skills matched</small></div>
    <Progress value={result.score} className="match-progress" />
    <SkillGroup title="Matched skills" skills={result.matched} tone="matched" empty="No matching repository evidence yet." />
    <SkillGroup title="Missing or unproven" skills={result.missing} tone="missing" empty="Great—every detected skill has a public signal." />
    {result.recommendation && <ProjectRecommendation recommendation={result.recommendation} missing={result.missing} />}
    <p className="match-guidance">Tip: repository languages alone are not proof of expertise. Add a focused README, topics, tests and a live demo.</p>
  </div>;
}

function SkillGroup({ title, skills, tone, empty }) {
  return <div className="skill-group"><h4>{title}<span>{skills.length}</span></h4>{skills.length ? <div className={`skill-cloud ${tone}`}>{skills.map((skill) => <span key={skill}>{skill}</span>)}</div> : <p>{empty}</p>}</div>;
}

function ProjectRecommendation({ recommendation, missing }) {
  const coverage = recommendation.coverage.length ? recommendation.coverage : recommendation.skills.slice(0, 4);
  return <div className="project-recommendation">
    <div className="project-kicker"><Briefcase size={16} /><span>BEST NEXT PROJECT</span></div>
    <h3>{recommendation.title}</h3>
    <p>{missing.length ? `Best fit because it can create visible evidence for ${coverage.join(", ")}.` : "Your core skills already match well; this capstone can turn them into stronger end-to-end evidence."}</p>
    <div className="project-plan">
      {recommendation.features.map((feature, index) => <span key={feature}><i>{index + 1}</i>{feature}</span>)}
    </div>
    <details className="blueprint-details">
      <summary>View complete project blueprint <ChevronDown size={17} /></summary>
      <div className="blueprint-content">
        <div className="blueprint-grid">
          <BlueprintBlock title="Recommended stack" items={[recommendation.blueprint.stack]} />
          <BlueprintBlock title="Core screens" items={recommendation.blueprint.screens} />
          <BlueprintBlock title="API plan" items={recommendation.blueprint.api} />
          <BlueprintBlock title="Data model" items={recommendation.blueprint.data} />
        </div>
        <div className="build-sequence">
          <h4>Build sequence</h4>
          <div>{recommendation.blueprint.buildSteps.map((step, index) => <span key={step}><i>{index + 1}</i>{step}</span>)}</div>
        </div>
        <div className="resume-line"><FileText size={17} /><span><strong>Resume outcome</strong>{recommendation.blueprint.resumeLine}</span></div>
      </div>
    </details>
  </div>;
}

function BlueprintBlock({ title, items }) {
  return <div className="blueprint-block"><h4>{title}</h4><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>;
}

function SkillEvidence({ evidence }) {
  return <article className="proof-card evidence-card">
    <div className="proof-card-title"><span><FileSearch size={19} /></span><div><h3>Skill evidence map</h3><p>Trace detected skills back to public repository signals.</p></div></div>
    {evidence.length ? <div className="evidence-list">
      {evidence.slice(0, 10).map(({ skill, repositories }) => <div className="evidence-row" key={skill}>
        <span className="evidence-skill">{skill}</span>
        <div className="evidence-repos">{repositories.map(({ repo, reason }) => <a href={repo.html_url} target="_blank" rel="noreferrer" key={repo.id}><strong>{repo.name}</strong><small>{reason}</small><ArrowUpRight size={14} /></a>)}</div>
      </div>)}
    </div> : <div className="proof-placeholder"><FileSearch size={30} /><h4>No repository evidence yet</h4><p>Add languages, topics and clear descriptions to your projects.</p></div>}
  </article>;
}

function ReadmeAnalyzer({ repos, selectedRepo, onRepoChange, onAnalyze, result, loading, error }) {
  const resultLabel = result?.score >= 80 ? "Portfolio ready" : result?.score >= 55 ? "Good foundation" : "Needs stronger detail";
  return <article className="proof-card readme-card">
    <div className="proof-card-title"><span><BookOpen size={19} /></span><div><h3>Advanced README analyzer</h3><p>Check one project for clarity, proof and reproducibility.</p></div></div>
    <div className="readme-tools">
      <Select value={selectedRepo} onValueChange={onRepoChange}>
        <SelectTrigger className="readme-select" aria-label="Choose repository"><SelectValue placeholder="Choose repository" /></SelectTrigger>
        <SelectContent>{repos.map((repo) => <SelectItem value={repo.name} key={repo.id}>{repo.name}</SelectItem>)}</SelectContent>
      </Select>
      <button onClick={onAnalyze} disabled={!selectedRepo || loading}>{loading ? "Checking…" : "Analyze README"}</button>
    </div>
    {error && <div className="readme-error" role="alert"><AlertTriangle size={16} />{error}</div>}
    {!result && !error && <div className="proof-placeholder"><BookOpen size={30} /><h4>Choose a repository</h4><p>DevLens will inspect its public README only after you click analyze.</p></div>}
    {result && <div className="readme-result">
      <div className="readme-score"><div><strong>{result.score}/100</strong><span>{result.exists ? resultLabel : "README not found"}</span></div>{result.htmlUrl && <a href={result.htmlUrl} target="_blank" rel="noreferrer">Open README <ExternalLink size={14} /></a>}</div>
      <Progress value={result.score} className="readme-progress" />
      <p className="readme-summary">{result.exists ? `${result.checks.filter((check) => check.found).length} of ${result.checks.length} portfolio sections detected in ${result.repoName}.` : `${result.repoName} has no public README yet. Start with an overview, setup guide and feature list.`}</p>
      <div className="readme-checks">{result.checks.map((check) => <div className={check.found ? "present" : "missing"} key={check.label}>
        {check.found ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
        <span><strong>{check.label}</strong><small>{check.found ? "Included" : check.action}</small></span>
      </div>)}</div>
    </div>}
  </article>;
}

function formatGain(value) {
  return Number.isInteger(value) ? value : value.toFixed(1);
}

function ScoreImprovementRoadmap({ plan }) {
  return <section className="score-roadmap-panel panel">
    <div className="score-roadmap-header">
      <div><span className="eyebrow">SCORE IMPROVEMENT ROADMAP</span><h2>What to improve to raise the score</h2><p>Prioritized actions calculated from the same public signals used by DevLens.</p></div>
      <div className="score-projection" aria-label={`Current score ${plan.current}, estimated achievable score ${plan.potential}`}>
        <span><small>Current</small><strong>{plan.current}</strong></span>
        <TrendingUp size={20} />
        <span className="potential"><small>After improvements</small><strong>{plan.potential}</strong></span>
      </div>
    </div>
    <Progress value={plan.potential} className="roadmap-progress" />
    <div className="score-roadmap-grid">
      <div className="profile-score-actions">
        <div className="score-column-title"><span><UserRoundSearch size={19} /></span><div><h3>Profile score actions</h3><p>Complete these in priority order</p></div></div>
        <div className="score-action-list">{plan.profile.map((action, index) => <article className="score-action" key={action.title}>
          <span className="action-rank">{index + 1}</span>
          <div><h4>{action.title}</h4><p>{action.detail}</p></div>
          <strong className={action.complete ? "complete" : ""}>{action.complete ? "Strong" : `+${formatGain(action.gain)} pts`}</strong>
        </article>)}</div>
      </div>
      <div className="repository-score-actions">
        <div className="score-column-title"><span><BookOpen size={19} /></span><div><h3>Repository score actions</h3><p>Highest-impact fixes for weaker projects</p></div></div>
        {plan.projects.length ? <div className="repo-opportunity-list">{plan.projects.map(({ repo, current, potential, fixes }) => <article className="repo-opportunity" key={repo.id}>
          <div className="repo-opportunity-head"><a href={repo.html_url} target="_blank" rel="noreferrer">{repo.name}<ExternalLink size={13} /></a><span>{current} <ArrowUpRight size={13} /> <strong>{potential}</strong></span></div>
          <div>{fixes.map((fix) => <p key={fix.label}><CheckCircle2 size={14} /><span>{fix.label}</span><strong>+{formatGain(fix.gain)}</strong></p>)}</div>
        </article>)}</div> : <div className="roadmap-complete"><CheckCircle2 size={28} /><h4>No obvious metadata gaps</h4><p>Keep your strongest projects active, tested and well documented.</p></div>}
      </div>
    </div>
    <p className="roadmap-method"><ShieldCheck size={15} />Estimated gains follow the DevLens heuristic. They improve public portfolio clarity but do not guarantee hiring results.</p>
  </section>;
}

function RepositoryCard({ repo }) {
  const quality = repoQuality(repo);
  const tone = quality >= 75 ? "strong" : quality >= 55 ? "good" : "build";
  return <article className="repo-card">
    <div className="repo-card-top"><span className="repo-icon"><BookOpen size={18} /></span>{repo.fork && <span className="fork-badge">Fork</span>}<span className={`quality-badge ${tone}`}>{quality}/100</span><a href={repo.html_url} target="_blank" rel="noreferrer" aria-label={`Open ${repo.name} on GitHub`}><ArrowUpRight size={17} /></a></div>
    <h3>{repo.name}</h3><p>{repo.description || "No repository description has been added yet."}</p>
    {repo.topics?.length > 0 && <div className="topic-row">{repo.topics.slice(0, 3).map((topic) => <span key={topic}>{topic}</span>)}</div>}
    <div className="repo-stats">{repo.language && <span><i />{repo.language}</span>}<span><Star size={14} />{compact(repo.stargazers_count)}</span><span><GitFork size={14} />{compact(repo.forks_count)}</span><span className="updated"><Clock3 size={14} />{updatedLabel(repo.updated_at)}</span></div>
  </article>;
}

function Comparison({ current, other, onReset }) {
  const currentQuality = current.repos.length ? Math.round(current.repos.reduce((sum, repo) => sum + repoQuality(repo), 0) / current.repos.length) : 0;
  const otherQuality = other.repos.length ? Math.round(other.repos.reduce((sum, repo) => sum + repoQuality(repo), 0) / other.repos.length) : 0;
  const rows = [
    ["Portfolio score", current.metrics.score, other.metrics.score], ["Average repo quality", currentQuality, otherQuality],
    ["Repositories analyzed", current.repos.length, other.repos.length], ["Total stars", current.metrics.stars, other.metrics.stars],
    ["Recent activity", current.metrics.recent ? 1 : 0, other.metrics.recent ? 1 : 0], ["Languages", current.metrics.languages, other.metrics.languages],
  ];
  const currentWins = rows.filter(([, first, second]) => first > second).length;
  const otherWins = rows.filter(([, first, second]) => second > first).length;
  const leader = currentWins === otherWins ? null : currentWins > otherWins ? current.user : other.user;
  const currentSkills = profileSkillsFromRepos(current.repos);
  const otherSkills = profileSkillsFromRepos(other.repos);
  const currentSet = new Set(currentSkills.map((skill) => skill.toLowerCase()));
  const otherSet = new Set(otherSkills.map((skill) => skill.toLowerCase()));
  const shared = currentSkills.filter((skill) => otherSet.has(skill.toLowerCase())).slice(0, 8);
  const currentOnly = currentSkills.filter((skill) => !otherSet.has(skill.toLowerCase())).slice(0, 6);
  const otherOnly = otherSkills.filter((skill) => !currentSet.has(skill.toLowerCase())).slice(0, 6);
  return <div className="comparison-result">
    <div className="comparison-verdict"><Trophy size={20} /><div><strong>{leader ? `@${leader.login} leads this public snapshot` : "Both profiles are balanced in this snapshot"}</strong><p>{current.user.login}: {currentWins} stronger signals · {other.user.login}: {otherWins} stronger signals · {rows.length - currentWins - otherWins} ties</p></div></div>
    <div className="compare-people">
      <div><img src={current.user.avatar_url} alt="" /><span><strong>{current.user.name || current.user.login}</strong><small>@{current.user.login}</small></span><em>{current.metrics.score}</em></div>
      <span>VS</span>
      <div><img src={other.user.avatar_url} alt="" /><span><strong>{other.user.name || other.user.login}</strong><small>@{other.user.login}</small></span><em>{other.metrics.score}</em></div>
    </div>
    <div className="compare-rows">
      <div className="compare-row-head"><strong>@{current.user.login}</strong><span>Public metric</span><strong>@{other.user.login}</strong></div>
      {rows.map(([label, first, second]) => <div className="compare-row" key={label}><strong className={first > second ? "winner" : ""}>{label === "Recent activity" ? (first ? "Active" : "Older") : compact(first)}</strong><span>{label}</span><strong className={second > first ? "winner" : ""}>{label === "Recent activity" ? (second ? "Active" : "Older") : compact(second)}</strong></div>)}
    </div>
    <div className="technology-compare">
      <div className="technology-heading"><Code2 size={17} /><div><h3>Technology evidence</h3><p>Detected from repository languages, topics and descriptions.</p></div></div>
      <div className="technology-grid">
        <TechnologyGroup title="Shared evidence" skills={shared} empty="No shared technology detected" tone="shared" />
        <TechnologyGroup title={`Only @${current.user.login}`} skills={currentOnly} empty="No unique evidence detected" />
        <TechnologyGroup title={`Only @${other.user.login}`} skills={otherOnly} empty="No unique evidence detected" />
      </div>
    </div>
    <div className="compare-footer"><p><ShieldCheck size={14} />This comparison measures public portfolio signals, not developer ability or hiring suitability.</p><button type="button" onClick={onReset}><RotateCcw size={15} />Compare another profile</button></div>
  </div>;
}

function TechnologyGroup({ title, skills, empty, tone = "" }) {
  return <div className={`technology-group ${tone}`}><h4>{title}</h4>{skills.length ? <div>{skills.map((skill) => <span key={skill}>{skill}</span>)}</div> : <p>{empty}</p>}</div>;
}

function DashboardSkeleton() {
  return <div className="skeleton-layout"><aside><div className="skeleton avatar-skeleton" /><div className="skeleton line wide" /><div className="skeleton line" /></aside><section><div className="skeleton hero-skeleton" /><div className="skeleton-cards">{Array.from({ length: 4 }).map((_, index) => <div className="skeleton" key={index} />)}</div></section></div>;
}
