import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Camera, Wrench } from "lucide-react";
import { techStack } from "../../data/portfolio";
import { listPublishedContent, type RemoteContent } from "../../lib/content";
import { ContentEmptyState } from "../ui/ContentEmptyState";

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
    Promise.all([
      listPublishedContent("articles"),
      listPublishedContent("gallery"),
      listPublishedContent("tools"),
      listPublishedContent("projects"),
    ])
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

  const featuredArticle = articles[0];
  const allProjects = projects.map((project) => ({
    title: project.title || project.name || "Untitled",
    description: project.description || project.excerpt || "",
    imageUrl: project.imageUrl,
    url: project.url,
    tags: project.tags ?? [],
  }));
  const toolNames = [...new Set([...Object.values(techStack).flat(), ...tools.map((tool) => tool.name || tool.title)])];
  const isEmpty = !featuredArticle && allProjects.length === 0 && gallery.length === 0;

  return (
    <section id="journal" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 max-w-2xl">
          <div className="section-kicker"><div className="h-px w-8 bg-primary" /><span>Journal &amp; studio</span></div>
          <h2 className="section-title">The work behind the work.</h2>
          <p className="section-lead">Notes on product engineering, a living project archive, and the tools that keep the studio moving.</p>
        </div>

        {isEmpty ? (
          <ContentEmptyState
            title="The journal is being written"
            description="Field notes, project write-ups and studio frames are published here from the admin studio. Subscribe by email and I will send the next one."
          />
        ) : (
          <>
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <ContentCard>
            <div className="grid md:grid-cols-[0.9fr_1.1fr]">
              <a
                href={featuredArticle ? `/journal/${featuredArticle.$id}` : "#contact"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={featuredArticle?.title}
                className="min-h-44 sm:min-h-64 bg-primary/10 p-6 sm:p-8 flex items-end overflow-hidden">
                {featuredArticle?.imageUrl ? (
                  <img
                    src={featuredArticle.imageUrl}
                    alt={featuredArticle.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <BookOpen className="h-10 w-10 text-primary" />
                )}
              </a>
              <div className="p-6 sm:p-7 md:p-9">
                <p className="mb-3 text-xs font-mono uppercase tracking-[0.18em] text-primary">Latest article</p>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                  {featuredArticle ? (
                    <a
                      href={`/journal/${featuredArticle.$id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-primary">
                      {featuredArticle.title}
                    </a>
                  ) : (
                    "No articles published yet"
                  )}
                </h3>
                <p className="mt-3 card-copy">{featuredArticle?.excerpt || featuredArticle?.description}</p>
                {featuredArticle && (
                  <a
                    href={`/journal/${featuredArticle.$id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                    Read the field note <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
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

        {articles.length > 0 && (
          <div className="mt-16">
            <div className="mb-6 flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-bold text-foreground">All articles ({articles.length})</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <a
                  key={article.$id}
                  href={`/journal/${article.$id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 rounded-xl border border-border/70 bg-card p-4 transition-colors hover:border-primary/50">
                  {article.imageUrl ? (
                    <img
                      src={article.imageUrl}
                      alt=""
                      className="h-14 w-14 shrink-0 rounded-lg object-cover"
                      loading="lazy"
                    />
                  ) : null}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                      {article.title || article.name}
                    </span>
                    <span className="mt-1 line-clamp-2 block text-xs text-muted-foreground">
                      {article.excerpt || article.description}
                    </span>
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                      Read article <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16">
          <div className="mb-6 flex items-center gap-3"><Camera className="h-5 w-5 text-primary" /><h3 className="text-xl font-bold text-foreground">Selected frames</h3></div>
          {gallery.length ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{gallery.map((item) => <motion.img key={item.$id} whileHover={{ scale: 1.02 }} src={item.imageUrl} alt={item.title} className="aspect-square w-full rounded-xl object-cover" loading="lazy" />)}</div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-8 text-sm text-muted-foreground">Gallery images will appear here when added from the admin studio.</div>
          )}
        </div>
          </>
        )}
      </div>
    </section>
  );
}
