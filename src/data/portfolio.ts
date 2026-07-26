export interface Project {
  id: string
  title: string
  description: string
  impact: string
  stack: string[]
  problem: string
  result: string
  category: 'fullstack' | 'frontend' | 'backend' | 'saas'
  image: string
  liveUrl?: string
  githubUrl?: string
  caseStudyUrl?: string
  featured: boolean
}

export interface CaseStudy {
  id: string
  title: string
  client: string
  description: string
  metrics: { label: string; value: string }[]
  stack: string[]
}

export interface Service {
  title: string
  description: string
  icon: string
}

export interface Experience {
  year: string
  title: string
  company: string
  description: string
  highlights: string[]
}

export interface Testimonial {
  name: string
  role: string
  company: string
  text: string
  avatar: string
}

export interface Stat {
  value: string
  label: string
  suffix?: string
}

export const profile = {
  name: 'Bipul Roy',
  shortName: 'Bipul',
  alias: 'bipul-unexpected',
  roles: [
    'Full-Stack Engineer',
    'UI/UX Designer',
    'DevOps Architect',
  ] as const,
  tagline: 'Building the future, one commit at a time.',
  philosophy: 'Design + Code + Motion + Scale',
  location: 'Dhaka, Bangladesh',
  focus: 'Full Stack + DevOps',
  currentlyBuilding: 'Futuristic web experiences with WebGL & AI',
  available: true,
  openToCollaboration: true,
}

export const stats: Stat[] = [
  { value: '50', label: 'Projects Delivered', suffix: '+' },
  { value: '8', label: 'Years Crafting Products', suffix: '+' },
  { value: '99', label: 'Client Satisfaction', suffix: '%' },
  { value: '30', label: 'Technologies Mastered', suffix: '+' },
]

export const projects: Project[] = [
  {
    id: 'nexus-platform',
    title: 'Nexus Platform',
    description:
      'Enterprise SaaS workflow platform with real-time collaboration, multi-tenant architecture, and zero-downtime deploys — serving 10,000+ daily active users.',
    impact: 'Reduced operational costs by 40% for enterprise clients',
    stack: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes'],
    problem:
      'Legacy workflow systems were costing enterprises millions in lost productivity due to manual processes and disconnected tools.',
    result: '40% reduction in operational costs, 10K+ DAU, 99.9% uptime over 18 months',
    category: 'saas',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    liveUrl: '#',
    githubUrl: 'https://github.com/bipul-unexpected',
    featured: true,
  },
  {
    id: 'pulse-analytics',
    title: 'Pulse Analytics',
    description:
      'Real-time analytics dashboard processing 2M+ events daily with sub-second queries, motion-rich visualizations, and Kubernetes-backed scale.',
    impact: 'Enabled data-driven decisions for 200+ businesses',
    stack: ['Next.js', 'TypeScript', 'Python', 'Django', 'ClickHouse', 'Kafka', 'Kubernetes'],
    problem:
      "Existing analytics tools couldn't handle the volume and velocity of real-time event data at scale.",
    result: '2M+ daily events processed, <100ms p95 query latency, 200+ business customers',
    category: 'fullstack',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    liveUrl: '#',
    caseStudyUrl: '#',
    featured: true,
  },
  {
    id: 'vault-auth',
    title: 'Vault Auth',
    description:
      'Multi-tenant authentication system with SSO, RBAC, and audit logging — built for B2B SaaS with CI/CD and containerized delivery.',
    impact: 'Powers authentication for 500K+ end users',
    stack: ['Django', 'GraphQL', 'PostgreSQL', 'Redis', 'Docker', 'GitHub Actions'],
    problem:
      'B2B SaaS companies needed enterprise-grade auth with SSO that was easy to integrate and maintain.',
    result: '500K+ users authenticated, SOC 2 ready architecture, 15-minute average integration time',
    category: 'backend',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
    githubUrl: 'https://github.com/bipul-unexpected',
    featured: true,
  },
  {
    id: 'meridian-cms',
    title: 'Meridian CMS',
    description:
      'Headless content platform with visual editor, version control, and multi-language support for global brands — designed end-to-end in Figma.',
    impact: 'Manages content for 30+ international websites',
    stack: ['React', 'Node.js', 'GraphQL', 'MongoDB', 'Cloudflare', 'Figma'],
    problem:
      'Global brands needed a flexible CMS that could handle multi-language content across dozens of regional sites.',
    result: '30+ websites managed, 12 languages supported, 60% faster content publishing',
    category: 'fullstack',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
    liveUrl: '#',
    featured: true,
  },
  {
    id: 'aurora-dashboard',
    title: 'Aurora Dashboard',
    description:
      'Admin dashboard framework with dynamic forms, data tables, real-time notifications, and micro-interactions that feel premium.',
    impact: 'Used as internal tooling by 5 engineering teams',
    stack: ['React', 'Angular', 'TypeScript', 'Tailwind CSS', 'Three.js', 'WebSockets'],
    problem:
      'Engineering teams were building repetitive admin UIs from scratch for each new product.',
    result: '5 teams adopted, 70% reduction in admin UI development time, 15+ dashboards built',
    category: 'frontend',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80',
    liveUrl: '#',
    githubUrl: 'https://github.com/bipul-unexpected/bipulroy',
    featured: true,
  },
  {
    id: 'streamline-api',
    title: 'Streamline API',
    description:
      'High-performance API gateway with rate limiting, caching, blue-green deploys, and full observability via Grafana + Prometheus.',
    impact: 'Handles 50M+ API calls monthly with 99.99% uptime',
    stack: ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Redis', 'Nginx', 'Kubernetes', 'Terraform'],
    problem:
      'Microservices needed a unified API gateway that could handle massive throughput while maintaining reliability.',
    result: '50M+ monthly API calls, 99.99% uptime, <50ms average response time',
    category: 'backend',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    githubUrl: 'https://github.com/bipul-unexpected',
    caseStudyUrl: '#',
    featured: false,
  },
]

export const caseStudies: CaseStudy[] = [
  {
    id: 'nexus-case',
    title: 'Scaling Nexus to 10K DAU',
    client: 'Nexus Platform',
    description:
      'How I redesigned the architecture — UI, API, and K8s deployment — to handle 10x traffic growth while cutting infra cost by 35%.',
    metrics: [
      { label: 'DAU Growth', value: '10x' },
      { label: 'Cost Reduction', value: '35%' },
      { label: 'Uptime', value: '99.9%' },
    ],
    stack: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Kubernetes'],
  },
  {
    id: 'pulse-case',
    title: 'Real-Time at Scale',
    client: 'Pulse Analytics',
    description:
      'Building a real-time analytics pipeline that processes 2M+ events daily with sub-second queries and motion-designed dashboards.',
    metrics: [
      { label: 'Events/Day', value: '2M+' },
      { label: 'Query Latency', value: '<100ms' },
      { label: 'Customers', value: '200+' },
    ],
    stack: ['Next.js', 'Python', 'ClickHouse', 'Kafka'],
  },
  {
    id: 'vault-case',
    title: 'Enterprise Auth Done Right',
    client: 'Vault Auth',
    description:
      'Designing a multi-tenant auth system that scales to 500K+ users with automated CI/CD and boring, reliable deploys.',
    metrics: [
      { label: 'Users', value: '500K+' },
      { label: 'Integration Time', value: '15min' },
      { label: 'Pipeline', value: 'Fully Auto' },
    ],
    stack: ['Django', 'GraphQL', 'PostgreSQL', 'GitHub Actions'],
  },
]

export const services: Service[] = [
  {
    title: 'Full-Stack Web Applications',
    description:
      'End-to-end products with React, Next.js, Angular, Node.js, and Django — from pixel-perfect UI to production APIs.',
    icon: 'Globe',
  },
  {
    title: 'UI/UX & Motion Design',
    description:
      'Design systems, micro-interactions, and motion-led experiences in Figma that convert attention into action.',
    icon: 'Layers',
  },
  {
    title: 'SaaS Platforms',
    description:
      'Multi-tenant platforms with auth, billing, analytics, and admin dashboards — engineered to scale without drama.',
    icon: 'Zap',
  },
  {
    title: 'API Architecture',
    description:
      'High-performance REST and GraphQL APIs with rate limiting, caching, docs, and observability built in.',
    icon: 'LayoutDashboard',
  },
  {
    title: 'DevOps & CI/CD',
    description:
      'Docker, Kubernetes, GitHub Actions, Terraform, and GitOps — so every deployment is boring and reliable.',
    icon: 'Container',
  },
  {
    title: '3D & Immersive Web',
    description:
      'WebGL, Three.js, and cinematic interfaces that make brands unforgettable and products feel premium.',
    icon: 'Sparkles',
  },
]

export const techStack = {
  frontend: [
    'React',
    'Next.js',
    'Angular',
    'TypeScript',
    'Tailwind CSS',
    'Three.js',
    'GSAP',
    'Framer Motion',
  ],
  backend: ['Node.js', 'Express', 'Django', 'Python', 'FastAPI', 'GraphQL'],
  databases: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'Prisma', 'Firebase'],
  devops: [
    'Docker',
    'Kubernetes',
    'GitHub Actions',
    'Terraform',
    'AWS',
    'Nginx',
    'Linux',
  ],
  tools: [
    'Figma',
    'Git',
    'Vercel',
    'Cloudflare',
    'Grafana',
    'Prometheus',
    'Postman',
  ],
}

export const experiences: Experience[] = [
  {
    year: '2024 — Present',
    title: 'Full-Stack Engineer & DevOps Architect',
    company: 'Independent / Consulting',
    description:
      'Architecting scalable systems from pixel-perfect UIs to zero-downtime Kubernetes deployments. Shipping full-stack products, design systems, and automated pipelines for global clients.',
    highlights: [
      'Delivered 12+ production systems',
      'Architected APIs handling 50M+ calls/month',
      'Built CI/CD with blue-green & canary deploys',
    ],
  },
  {
    year: '2021 — 2024',
    title: 'Full-Stack Developer',
    company: 'TechForge Labs',
    description:
      'Built mission-critical web apps for fintech and healthcare — owning frontend craft, backend reliability, and release automation.',
    highlights: [
      'Led a team of 4 engineers',
      'Cut deployment time by 80% with CI/CD',
      'Shipped 3 major product launches',
    ],
  },
  {
    year: '2019 — 2021',
    title: 'Frontend & UI Engineer',
    company: 'Digital Pulse Agency',
    description:
      'Crafted high-performance interfaces with obsessive attention to motion, accessibility, and modern design systems.',
    highlights: [
      'Built 20+ client experiences',
      'Improved Core Web Vitals by 45%',
      'Introduced shared component library',
    ],
  },
  {
    year: '2017 — 2019',
    title: 'Junior Developer',
    company: 'CodeCraft Studios',
    description:
      'Started by shipping responsive websites and learning full-stack fundamentals — React, Django, and clean engineering habits.',
    highlights: [
      'Completed 30+ client projects',
      'Self-taught React, Django & Node.js',
      'Won internal product hackathon',
    ],
  },
]

export const testimonials: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'CTO',
    company: 'Nexus Technologies',
    text: 'Bipul is a rare full-stack engineer who also thinks like a designer and ships like a DevOps lead. Architecture was spot-on, the UI felt premium, and our platform scaled without drama.',
    avatar: 'SC',
  },
  {
    name: 'Marcus Rivera',
    role: 'Head of Product',
    company: 'Pulse Analytics',
    text: 'Not just a developer — a product thinker. Micro-interactions, performance, and business outcomes were all treated as first-class. The dashboard became our most-loved feature.',
    avatar: 'MR',
  },
  {
    name: 'Elena Volkov',
    role: 'Engineering Lead',
    company: 'TechForge Labs',
    text: 'Deep technical range across React, Django, and Kubernetes, plus excellent communication. Complex systems explained clearly — and delivered with automation that just works.',
    avatar: 'EV',
  },
]

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

export const socialLinks = {
  github: 'https://github.com/bipul-unexpected',
  linkedin: 'https://www.linkedin.com/in/bipul-roy',
  twitter: 'https://x.com/BipulUnexpected',
  email: 'info@bipul.tech',
  portfolio: 'https://bipul.tech',
}

export const aboutHighlights = [
  'Architecting scalable systems — from pixel-perfect UIs to zero-downtime K8s deployments',
  'Obsessed with micro-interactions, 3D web & motion design',
  'Automating everything: CI/CD pipelines, GitOps, Infrastructure as Code',
  'Currently exploring WebGPU, AI-powered DX & edge computing',
  'Ask me about React, Next.js, Kubernetes, or shipping fast without breaking things',
]

export const tallyFormId = 'VLVJEa'
