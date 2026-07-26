import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink, FileText } from "lucide-react";
import { GitHubIcon } from "../ui/SocialIcons";
import { PremiumDraggable } from "../ui/PremiumDraggable";
import { TextAnimate } from "../ui/TextAnimate";
import { GlowingText } from "../ui/GlowingText";
import { projects, type Project } from "../../data/portfolio";

/* ── Filter Tabs ─────────────────────────────────────────────────────────── */

const filters = ["All", "Full-Stack", "Frontend", "Backend", "SaaS"] as const;
type Filter = (typeof filters)[number];

const filterMap: Record<Filter, Project["category"] | null> = {
  All: null,
  "Full-Stack": "fullstack",
  Frontend: "frontend",
  Backend: "backend",
  SaaS: "saas",
};

/* ── 3D Tilt Hook ────────────────────────────────────────────────────────── */

function useCardTilt() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -8, y: x * 8 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return { tilt, handleMouseMove, handleMouseLeave };
}

/* ── Project Card ────────────────────────────────────────────────────────── */

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { tilt, handleMouseMove, handleMouseLeave } = useCardTilt();
  const [expanded, setExpanded] = useState(false);

  const categoryLabel: Record<Project["category"], string> = {
    fullstack: "Full-Stack",
    frontend: "Frontend",
    backend: "Backend",
    saas: "SaaS",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1],
      }}
      style={{
        perspective: 800,
      }}>
      <PremiumDraggable
        className="glass-panel rounded-xl overflow-hidden cursor-pointer group"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setExpanded((p) => !p)}
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
        }}
        whileHover={{
          y: -4,
          boxShadow: "0 16px 48px -8px hsl(271 91% 65% / 0.18)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{ transformStyle: "preserve-3d" }}>
        {/* Image area */}
        <div className="h-48 bg-secondary relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${project.image})` }}
          />
          <div className="absolute inset-0 bg-background/40" />
        </div>

        {/* Body */}
        <div className="p-6 md:p-7 space-y-3.5">
          <span className="text-xs font-mono text-primary bg-primary/10 rounded-full px-2 py-0.5">
            <TextAnimate
              animation="blurInUp"
              by="word"
              duration={0.6}
              staggerDelay={0.05}>
              {categoryLabel[project.category]}
            </TextAnimate>
          </span>
          <h3 className="card-title text-xl">
            <TextAnimate
              animation="blurInUp"
              by="word"
              duration={0.8}
              staggerDelay={0.06}>
              {project.title}
            </TextAnimate>
          </h3>
          <p className="text-sm text-primary font-medium leading-relaxed tracking-[0.01em]">
            <GlowingText color="royalty" intensity="medium" animateGlow>
              <TextAnimate
                animation="blurInUp"
                by="word"
                duration={0.8}
                delay={0.1}
                staggerDelay={0.05}>
                {project.impact}
              </TextAnimate>
            </GlowingText>
          </p>
          <p className="card-copy line-clamp-2">
            <TextAnimate
              animation="blurInUp"
              by="word"
              duration={0.8}
              delay={0.15}
              staggerDelay={0.04}>
              {project.description}
            </TextAnimate>
          </p>

          {/* Stack chips */}
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="bg-secondary rounded px-2 py-0.5 text-xs text-muted-foreground font-mono">
                {tech}
              </span>
            ))}
          </div>

          {/* Problem & Result — revealed on expand */}
          <motion.div
            initial={false}
            animate={{
              height: expanded ? "auto" : 0,
              opacity: expanded ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden">
            <div className="pt-4 space-y-4 border-t border-border">
              <div>
                <span className="text-xs uppercase text-muted-foreground font-mono tracking-wider">
                  <TextAnimate
                    animation="blurInUp"
                    by="word"
                    duration={0.5}
                    staggerDelay={0.05}>
                    Problem:
                  </TextAnimate>
                </span>
                <p className="card-copy mt-1.5 text-foreground">
                  <TextAnimate
                    animation="blurInUp"
                    by="word"
                    duration={0.8}
                    delay={0.05}
                    staggerDelay={0.04}>
                    {project.problem}
                  </TextAnimate>
                </p>
              </div>
              <div>
                <span className="text-xs uppercase text-primary font-mono tracking-wider">
                  <TextAnimate
                    animation="blurInUp"
                    by="word"
                    duration={0.5}
                    staggerDelay={0.05}>
                    Result:
                  </TextAnimate>
                </span>
                <p className="card-copy mt-1.5 text-foreground">
                  <TextAnimate
                    animation="blurInUp"
                    by="word"
                    duration={0.8}
                    delay={0.05}
                    staggerDelay={0.04}>
                    {project.result}
                  </TextAnimate>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Link buttons */}
          <div className="flex items-center gap-5 pt-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                <ExternalLink className="h-3.5 w-3.5" />
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                <GitHubIcon className="h-3.5 w-3.5" />
                GitHub
              </a>
            )}
            {project.caseStudyUrl && (
              <a
                href={project.caseStudyUrl}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                <FileText className="h-3.5 w-3.5" />
                Case Study
              </a>
            )}
          </div>
        </div>
      </PremiumDraggable>
    </motion.div>
  );
}

/* ── Projects Section ────────────────────────────────────────────────────── */

export function Projects() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const featured = projects.filter((p) => p.featured);
  const filtered =
    activeFilter === "All"
      ? featured
      : featured.filter((p) => p.category === filterMap[activeFilter]);

  return (
    <section id="projects" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6" ref={ref}>
        {/* Section header */}
        <motion.div
          className="max-w-2xl mb-10 md:mb-11"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}>
          <PremiumDraggable intensity="light">
            <div className="section-kicker">
              <div className="h-px w-8 bg-primary" />
              <span className="text-xs font-mono uppercase tracking-widest text-primary">
                <TextAnimate
                  animation="blurInUp"
                  by="word"
                  duration={0.8}
                  staggerDelay={0.06}>
                  Featured Work
                </TextAnimate>
              </span>
            </div>
            <h2
              className="section-title-display"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                letterSpacing: "0.01em",
              }}>
              <TextAnimate
                animation="blurInUp"
                by="word"
                duration={1.2}
                staggerDelay={0.08}>
                Systems that feel
              </TextAnimate>{" "}
              <span className="text-gradient-theme">
                <TextAnimate
                  animation="blurInUp"
                  by="word"
                  duration={1.2}
                  delay={0.1}
                  staggerDelay={0.08}>
                  inevitable
                </TextAnimate>
              </span>
            </h2>
            <p className="section-lead max-w-xl">
              <TextAnimate
                animation="blurInUp"
                by="word"
                duration={1.2}
                delay={0.2}
                staggerDelay={0.04}>
                Full-stack products spanning React, Next.js, Django, Node, and
                Kubernetes — designed to convert, built to scale, automated to
                ship.
              </TextAnimate>
            </p>
          </PremiumDraggable>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          className="mt-0 flex flex-wrap gap-2.5"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}>
          {filters.map((filter) => (
            <PremiumDraggable
              key={filter}
              intensity="feather"
              className="w-auto">
              <button
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}>
                <TextAnimate
                  animation="blurInUp"
                  by="word"
                  duration={0.6}
                  staggerDelay={0.05}>
                  {filter}
                </TextAnimate>
              </button>
            </PremiumDraggable>
          ))}
        </motion.div>

        {/* Project grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
