import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templatePath = path.join(root, "page-template.html");
const domain = "https://bipul.tech";

const pages = [
  {
    directory: "projects",
    route: "/projects",
    title: "Projects — Bipul Roy",
    breadcrumb: "Projects",
    description: "Selected full-stack engineering projects by Bipul Roy — React, Next.js, Django, and cloud-native applications.",
  },
  {
    directory: "gallery",
    route: "/gallery",
    title: "Gallery — Bipul Roy",
    breadcrumb: "Gallery",
    description: "Selected visual work, UI showcases, and design gallery by Bipul Roy.",
  },
  {
    directory: "services",
    route: "/services",
    title: "Services — Bipul Roy",
    breadcrumb: "Services",
    description: "Full-stack engineering, UI/UX design, SaaS development, API architecture, and DevOps consulting services by Bipul Roy.",
  },
  {
    directory: "journal",
    route: "/journal",
    title: "Journal — Bipul Roy",
    breadcrumb: "Journal",
    description: "Engineering notes, technical deep-dives, and field journal entries by Bipul Roy.",
  },
  {
    directory: "experience",
    route: "/experience",
    title: "Experience — Bipul Roy",
    breadcrumb: "Experience",
    description: "Professional experience, engineering journey, and career milestones of Bipul Roy.",
  },
  {
    directory: "contact",
    route: "/contact",
    title: "Contact — Bipul Roy",
    breadcrumb: "Contact",
    description: "Contact Bipul Roy about a product, engineering, or design project. Based in Dhaka, available worldwide.",
  },
  {
    directory: "tech-stack",
    route: "/tech-stack",
    title: "Tech Stack — Bipul Roy",
    breadcrumb: "Tech Stack",
    description: "Technology stack used by Bipul Roy across frontend, backend, cloud infrastructure, and DevOps — React, TypeScript, Node.js, Django, Docker, Kubernetes.",
  },
  {
    directory: "onionbipulking",
    route: "/onionbipulking",
    title: "Private admin — Bipul Roy",
    breadcrumb: "Admin",
    description: "Private content management studio.",
    robots: "noindex, nofollow",
  },
];

const template = await readFile(templatePath, "utf8");

for (const page of pages) {
  const outputDirectory = path.join(root, page.directory);
  const outputPath = path.join(outputDirectory, "index.html");
  const canonical = `${domain}${page.route}/`;
  const html = template
    .replaceAll("__DESCRIPTION__", page.description)
    .replaceAll("__ROBOTS__", page.robots ?? "index, follow")
    .replaceAll("__CANONICAL__", canonical)
    .replaceAll("__TITLE__", page.title)
    .replaceAll("__BREADCRUMB__", page.breadcrumb)
    .replaceAll("__ROUTE__", page.route);

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputPath, html);
}

console.log(`Generated ${pages.length} route documents from page-template.html`);
