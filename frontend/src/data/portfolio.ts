export const profile = {
  name: "Satyam Kumar Thakur",
  role: "Software Development Engineer",
  focus: "Backend · Infrastructure · Android & iOS",
  location: "Thane, India — open to Bangalore & Hyderabad",
  email: "kumarsatyam01303@gmail.com",
  github: "https://github.com/Demonsatyam",
  linkedin: "https://www.linkedin.com/in/satyamkumarthakur",
  resume: "/resume.pdf",
};

export const stats = [
  { value: 40, suffix: "%", label: "p95 latency cut on high-traffic APIs" },
  { value: 50, suffix: "%", label: "faster deploys with Docker + CI/CD" },
  { value: 99.9, suffix: "%", label: "uptime across AWS & GCP services", decimals: 1 },
  { value: 1000, suffix: "+", label: "packets/sec through my DPI engine" },
];

export type ProjectId = "identity" | "dpi" | "citypulse";

export const projects: {
  id: ProjectId;
  title: string;
  tag: string;
  stack: string[];
  blurb: string;
  metrics: string[];
}[] = [
  {
    id: "citypulse",
    title: "City Pulse",
    tag: "Agentic AI",
    stack: ["Google ADK", "Gemini", "PostgreSQL + PGVector", "Firebase"],
    blurb:
      "A multi-agent system that spots traffic incidents early from social posts, citizen uploads, and traffic and weather data. It verifies them, predicts how the queue spreads, alerts commuters on affected routes with an alternative, and informs the nearest traffic station.",
    metrics: ["2nd Runner-Up", "Google Agentic AI Day 2025"],
  },
  {
    id: "dpi",
    title: "Deep Packet Inspection Engine",
    tag: "Networking",
    stack: ["Python", "Linux", "TCP/IP"],
    blurb:
      "A deep packet inspection engine that reads PCAP captures, parses Ethernet, IPv4, TCP and UDP, tracks connections by Five-Tuple, and identifies applications from the TLS SNI or HTTP Host, without decrypting anything. IP, app and domain rules block whole flows, and multithreaded workers write a filtered capture and a processing report.",
    metrics: ["1,000+ packets/sec", "94% precision", "MTTR 50 → 20 min"],
  },
  {
    id: "identity",
    title: "Identity Resolution Service",
    tag: "Microservice",
    stack: ["Node.js", "PostgreSQL", "Docker", "TDD"],
    blurb:
      "Reconciles customer identities by email and phone across 5+ data sources behind a single /identify endpoint, on a normalized PostgreSQL schema.",
    metrics: ["85% duplicates removed", "450ms → 120ms queries", "99.2% accuracy"],
  },
];

export const experience = [
  {
    role: "Software Development Engineer",
    company: "Cybrik Solutions",
    period: "Oct 2026 — Present",
    points: [
      "Build Android apps in Java & Kotlin and Spring Boot services that keep mobile and web in sync.",
      "Design microservices in Spring Boot, Golang and Django using Domain-Driven Design.",
      "Run containerized services on Docker & Kubernetes across AWS, Azure and GCP.",
      "Own multi-tenant SaaS products with per-tenant data isolation and ACID-safe transactions.",
      "Keep GitHub Actions pipelines secure and releases automated and repeatable.",
    ],
  },
  {
    role: "Associate Backend Developer",
    company: "Cybrik Solutions",
    period: "Oct 2025 — Sep 2026",
    points: [
      "Cut p95 latency 40% on 3 high-traffic APIs with indexing, pooling and Redis caching.",
      "Containerized 4 production services; deployment time down 50%, manual release errors gone.",
      "Shipped 10+ REST & GraphQL endpoints in FastAPI and Node.js, 35% faster responses.",
      "Built React dashboards, Flutter apps and WebSocket channels for real-time monitoring.",
    ],
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Backend", items: ["Spring Boot", "Golang", "Django", "FastAPI", "Node.js", "GraphQL", "WebSockets", "Microservices"] },
  { group: "Mobile", items: ["Android", "Kotlin", "Java", "iOS", "Flutter"] },
  { group: "Data", items: ["PostgreSQL", "MySQL", "Redis", "MongoDB", "Prisma", "ACID"] },
  { group: "Cloud & DevOps", items: ["AWS", "GCP", "Azure", "Docker", "Kubernetes", "GitHub Actions", "Linux"] },
  { group: "AI", items: ["LangChain", "RAG", "Vector DBs", "OpenAI", "Gemini"] },
];

export const achievements = [
  { title: "Google Agentic AI Day", year: "2025", text: "2nd Runner-Up with City Pulse, an agentic AI system." },
  { title: "BFCET Hackathon", year: "2024", text: "Winner, backend system design — 1st of 120+ teams." },
  { title: "Smart India Hackathon (Internal)", year: "2024", text: "Winner, customer-facing product among 30+ entries." },
];
