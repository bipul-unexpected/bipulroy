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

export interface Article {
  id: string
  title: string
  description: string
  url?: string
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
