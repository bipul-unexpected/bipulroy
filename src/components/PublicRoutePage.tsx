import { useEffect } from "react";
import { Navbar } from "./layout/Navbar";
import { Footer } from "./sections/Footer";
import { Contact } from "./sections/Contact";
import { ContentHub } from "./sections/ContentHub";
import { ArticlePage } from "./sections/ArticlePage";
import { Experience } from "./sections/Experience";
import { Projects } from "./sections/Projects";
import { Services } from "./sections/Services";
import { TechStack } from "./sections/TechStack";
import { useScrollProgress } from "../hooks/useScrollProgress";
import type { ReactElement } from "react";

const routes: Record<string, { title: string; description: string; content: ReactElement }> = {
  "/projects": {
    title: "Projects — Bipul Roy",
    description: "Selected full-stack engineering projects by Bipul Roy — React, Next.js, Django, and cloud-native applications.",
    content: <Projects />,
  },
  "/gallery": {
    title: "Gallery — Bipul Roy",
    description: "Selected visual work, UI showcases, and design gallery by Bipul Roy.",
    content: <ContentHub />,
  },
  "/journal": {
    title: "Journal — Bipul Roy",
    description: "Engineering notes, technical deep-dives, and field journal entries by Bipul Roy.",
    content: <ContentHub />,
  },
  "/services": {
    title: "Services — Bipul Roy",
    description: "Full-stack engineering, UI/UX design, SaaS development, API architecture, and DevOps consulting services by Bipul Roy.",
    content: <Services />,
  },
  "/experience": {
    title: "Experience — Bipul Roy",
    description: "Professional experience, engineering journey, and career milestones of Bipul Roy.",
    content: <Experience />,
  },
  "/contact": {
    title: "Contact — Bipul Roy",
    description: "Contact Bipul Roy about a product, engineering, or design project. Based in Dhaka, available worldwide.",
    content: <Contact />,
  },
  "/tech-stack": {
    title: "Tech Stack — Bipul Roy",
    description: "Technology stack used by Bipul Roy across frontend, backend, cloud infrastructure, and DevOps.",
    content: <TechStack />,
  },
};

export function PublicRoutePage({ pathname }: { pathname: string }) {
  const { activeSection, isScrolled } = useScrollProgress();

  // Article detail pages: /journal/:id and /article/:id
  const articleMatch = pathname.match(/^\/(?:journal|article)\/([^/]+)$/);
  const route = routes[pathname] || routes["/projects"];

  // Dynamic SEO: update document.title and meta description on SPA navigation
  useEffect(() => {
    document.title = route.title;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", route.description);
    } else {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      metaDesc.setAttribute("content", route.description);
      document.head.appendChild(metaDesc);
    }
    // Update OG tags for social sharing on SPA routes
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", route.title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", route.description);
  }, [route.title, route.description]);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar activeSection={pathname.slice(1)} isScrolled={isScrolled} />
      <main className="relative z-10 pt-16">
        {articleMatch ? (
          <ArticlePage documentId={decodeURIComponent(articleMatch[1])} />
        ) : (
          <>
            <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-primary">Bipul Roy / {route.title.split(" — ")[0]}</p>
            </div>
            {route.content}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

