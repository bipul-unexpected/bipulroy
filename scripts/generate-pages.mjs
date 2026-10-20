import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
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
    description: "Selected full-stack engineering projects by Bipul Roy.",
  },
  {
    directory: "gallery",
    route: "/gallery",
    title: "Gallery — Bipul Roy",
    description: "Selected visual work and gallery by Bipul Roy.",
  },
  {
    directory: "services",
    route: "/services",
    title: "Services — Bipul Roy",
    description: "Full-stack engineering, UI/UX, SaaS, API, and DevOps services by Bipul Roy.",
  },
  {
    directory: "journal",
    route: "/journal",
    title: "Journal — Bipul Roy",
    description: "Engineering notes and field journal by Bipul Roy.",
  },
  {
    directory: "experience",
    route: "/experience",
    title: "Experience — Bipul Roy",
    description: "Professional experience and engineering journey of Bipul Roy.",
  },
  {
    directory: "contact",
    route: "/contact",
    title: "Contact — Bipul Roy",
    description: "Contact Bipul Roy about a product, engineering, or design project.",
  },
  {
    directory: "tech-stack",
    route: "/tech-stack",
    title: "Tech stack — Bipul Roy",
    description: "Technology stack used by Bipul Roy across frontend, backend, cloud, and DevOps.",
  },
  {
    directory: "onionbipulking",
    route: "/onionbipulking",
    title: "Private admin — Bipul Roy",
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
    .replaceAll("__ROUTE__", page.route);

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputPath, html);
}

console.log(`Generated ${pages.length} route documents from page-template.html`);
