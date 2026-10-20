import { Navbar } from "./layout/Navbar";
import { Footer } from "./sections/Footer";
import { Contact } from "./sections/Contact";
import { ContentHub } from "./sections/ContentHub";
import { Experience } from "./sections/Experience";
import { Projects } from "./sections/Projects";
import { Services } from "./sections/Services";
import { TechStack } from "./sections/TechStack";
import { useScrollProgress } from "../hooks/useScrollProgress";
import type { ReactElement } from "react";

const routes: Record<string, { title: string; content: ReactElement }> = {
  "/projects": { title: "Projects", content: <Projects /> },
  "/gallery": { title: "Gallery", content: <ContentHub /> },
  "/journal": { title: "Journal", content: <ContentHub /> },
  "/services": { title: "Services", content: <Services /> },
  "/experience": { title: "Experience", content: <Experience /> },
  "/contact": { title: "Contact", content: <Contact /> },
  "/tech-stack": { title: "Tech stack", content: <TechStack /> },
};

export function PublicRoutePage({ pathname }: { pathname: string }) {
  const { activeSection, isScrolled } = useScrollProgress();
  const route = routes[pathname] || routes["/projects"];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar activeSection={pathname.slice(1)} isScrolled={isScrolled} />
      <main className="relative z-10 pt-16">
        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-primary">Bipul Roy / {route.title}</p>
        </div>
        {route.content}
      </main>
      <Footer />
    </div>
  );
}
