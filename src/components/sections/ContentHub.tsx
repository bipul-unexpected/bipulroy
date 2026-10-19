import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Camera, Wrench } from "lucide-react";
import { articles as fallbackArticles, projects as fallbackProjects, techStack } from "../../data/portfolio";
import { listContent, type RemoteContent } from "../../lib/content";

function ContentCard({ children }: { children: ReactNode }) {
  return (
    <article className="glass-panel rounded-2xl overflow-hidden transition-transform duration-300 hover:-translate-y-1">
      {children}
    </article>
  );
}

export function ContentHub() {
  const [articles, setArticles] = useState<RemoteContent[]>([]);
  const [gallery, setGallery] = useState<RemoteContent[]>([]);
  const [tools, setTools] = useState<RemoteContent[]>([]);
  const [projects, setProjects] = useState<RemoteContent[]>([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([listContent("articles"), listContent("gallery"), listContent("tools"), listContent("projects")])
      .then(([remoteArticles, remoteGallery, remoteTools, remoteProjects]) => {
        if (!mounted) return;
        setArticles(remoteArticles);
        setGallery(remoteGallery);
        setTools(remoteTools);
        setProjects(remoteProjects);
      })
      .catch((error) => {
        console.error("Unable to load Appwrite content:", error);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const staticArticle = fallbackArticles[0];
  const allProjects = [
    ...fallbackProjects.slice(0, 3).map((project) => ({
      title: project.title,
      description: project.description,
      imageUrl: project.image,
      url: project.liveUrl,
      tags: project.stack.slice(0, 3),
    })),
    ...projects,
  ];
  const toolNames = [...new Set([...Object.values(techStack).flat(), ...tools.map((tool) => tool.name || tool.title)])];

  return (
    <section id="journal" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 max-w-2xl">
          <div className="section-kicker"><div className="h-px w-8 bg-primary" /><span>Journal &amp; studio</span></div>
          <h2 className="section-title">The work behind the work.</h2>
          <p className="section-lead">Notes on product engineering, a living project archive, and the tools that keep the studio moving.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <ContentCard>
            <div className="grid md:grid-cols-[0.9fr_1.1fr]">
              <div className="min-h-44 sm:min-h-64 bg-primary/10 p-6 sm:p-8 flex items-end">
                <BookOpen className="h-10 w-10 text-primary" />
              </div>
              <div className="p-6 sm:p-7 md:p-9">
                <p className="mb-3 text-xs font-mono uppercase tracking-[0.18em] text-primary">Featured article</p>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">{articles[0]?.title || staticArticle.title}</h3>
                <p className="mt-3 card-copy">{articles[0]?.excerpt || staticArticle.description}</p>
                <a href={articles[0]?.url || "#contact"} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                  Read the field note <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </ContentCard>
          <ContentCard>
            <div className="p-7 md:p-9">
              <div className="flex items-center gap-3"><Wrench className="h-5 w-5 text-primary" /><p className="text-xs font-mono uppercase tracking-[0.18em] text-primary">Studio toolkit</p></div>
              <div className="mt-6 flex flex-wrap gap-2">
                {toolNames.slice(0, 20).map((tool) => <span key={tool} className="rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground">{tool}</span>)}
              </div>
            </div>
          </ContentCard>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {allProjects.map((project, index) => (
            <ContentCard key={`${project.title}-${index}`}>
              <div className="h-36 overflow-hidden bg-secondary">
                {project.imageUrl && <img src={project.imageUrl} alt="" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-foreground">{project.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">{project.tags?.map((tag) => <span key={tag} className="text-[10px] text-primary">{tag}</span>)}</div>
              </div>
            </ContentCard>
          ))}
        </div>

        <div className="mt-16">
          <div className="mb-6 flex items-center gap-3"><Camera className="h-5 w-5 text-primary" /><h3 className="text-xl font-bold text-foreground">Selected frames</h3></div>
          {gallery.length ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{gallery.map((item) => <motion.img key={item.$id} whileHover={{ scale: 1.02 }} src={item.imageUrl} alt={item.title} className="aspect-square w-full rounded-xl object-cover" loading="lazy" />)}</div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-8 text-sm text-muted-foreground">Gallery images will appear here when added from the admin studio.</div>
          )}
        </div>
      </div>
    </section>
  );
}
