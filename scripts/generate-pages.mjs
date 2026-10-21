import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templatePath = path.join(root, "page-template.html");
const domain = "https://bipul.tech";

// Load the local environment so the published articles can be prerendered.
// On a build host the variables come from the environment instead.
try {
  process.loadEnvFile(path.join(root, ".env"));
} catch {
  // No .env file — the build environment supplies the variables.
}

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
    description: "Technology stack used by Bipul Roy across frontend, backend, cloud infrastructure, and DevOps.",
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

/* ── Published articles ─────────────────────────────────────────────────── */

const env = process.env;
const appwriteConfigured = Boolean(
  env.APPWRITE_ENDPOINT && env.APPWRITE_PROJECT_ID && env.APPWRITE_DATABASE_ID,
);

/** Reads the published articles so they can be prerendered and listed. */
async function fetchArticles() {
  if (!appwriteConfigured) return [];
  const endpoint = env.APPWRITE_ENDPOINT.replace(/\/$/, "");
  const collectionId = env.APPWRITE_ARTICLES_COLLECTION_ID;
  if (!collectionId) return [];

  try {
    const response = await fetch(
      `${endpoint}/databases/${env.APPWRITE_DATABASE_ID}/collections/${collectionId}/documents?limit=100`,
      {
        headers: {
          "X-Appwrite-Project": env.APPWRITE_PROJECT_ID,
          ...(env.APPWRITE_API_KEY ? { "X-Appwrite-Key": env.APPWRITE_API_KEY } : {}),
        },
      },
    );
    if (!response.ok) return [];
    const body = await response.json();
    return (body.documents || []).filter((document) => document.published !== false);
  } catch (error) {
    console.warn("Could not read published articles:", error?.message ?? error);
    return [];
  }
}

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Minimal markdown → HTML for the prerendered article body. */
function markdownToHtml(markdown) {
  const lines = String(markdown ?? "").replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let index = 0;

  const inline = (text) =>
    escapeHtml(text)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');

  while (index < lines.length) {
    const line = lines[index];

    if (line.trimStart().startsWith("```")) {
      const body = [];
      index += 1;
      while (index < lines.length && !lines[index].trimStart().startsWith("```")) {
        body.push(lines[index]);
        index += 1;
      }
      index += 1;
      out.push(`<pre><code>${escapeHtml(body.join("\n"))}</code></pre>`);
      continue;
    }

    if (!line.trim()) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = Math.min(heading[1].length + 1, 6);
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      index += 1;
      continue;
    }

    if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      out.push("<hr />");
      index += 1;
      continue;
    }

    if (line.trimStart().startsWith(">")) {
      const quote = [];
      while (index < lines.length && lines[index].trimStart().startsWith(">")) {
        quote.push(lines[index].replace(/^\s*>\s?/, ""));
        index += 1;
      }
      out.push(`<blockquote>${inline(quote.join(" "))}</blockquote>`);
      continue;
    }

    const bullet = line.match(/^\s*[-*+]\s+(.*)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (bullet || numbered) {
      const tag = numbered ? "ol" : "ul";
      const items = [];
      while (index < lines.length) {
        const item = lines[index].match(
          numbered ? /^\s*\d+[.)]\s+(.*)$/ : /^\s*[-*+]\s+(.*)$/,
        );
        if (!item) break;
        items.push(`<li>${inline(item[1])}</li>`);
        index += 1;
      }
      out.push(`<${tag}>${items.join("")}</${tag}>`);
      continue;
    }

    const paragraph = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,6})\s/.test(lines[index]) &&
      !lines[index].trimStart().startsWith("```") &&
      !lines[index].trimStart().startsWith(">") &&
      !/^\s*([-*+]|\d+[.)])\s+/.test(lines[index])
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    out.push(`<p>${inline(paragraph.join(" "))}</p>`);
  }

  return out.join("\n");
}

/** Prerenders the article so crawlers see the full text without running JS. */
function prerenderArticle(article) {
  const title = escapeHtml(article.title || article.name || "Article");
  const description = escapeHtml(article.description || article.excerpt || "");
  const created = article.$createdAt
    ? new Date(article.$createdAt).toISOString().slice(0, 10)
    : "";

  const attachments = (article.attachments || [])
    .map((entry) => {
      const [fileId, name] = String(entry).split("::");
      if (!fileId) return "";
      const href = `${env.APPWRITE_ENDPOINT?.replace(/\/$/, "")}/storage/buckets/${env.APPWRITE_STORAGE_BUCKET_ID}/files/${fileId}/view?project=${env.APPWRITE_PROJECT_ID}`;
      return `<li><a href="${href}" download="${escapeHtml(name || "download")}">${escapeHtml(name || "download")}</a></li>`;
    })
    .filter(Boolean)
    .join("");

  return `<article>
  <header>
    ${article.category ? `<span>${escapeHtml(article.category)}</span>` : ""}
    <h1>${title}</h1>
    ${description ? `<p>${description}</p>` : ""}
    ${created ? `<time datetime="${created}">${created}</time>` : ""}
  </header>
  ${article.imageUrl ? `<img src="${escapeHtml(article.imageUrl)}" alt="${title}" />` : ""}
  <div class="prose">${markdownToHtml(article.body)}</div>
  ${attachments ? `<section><h2>Attachments</h2><ul>${attachments}</ul></section>` : ""}
</article>`;
}

const articles = await fetchArticles();

/* ── Route documents ────────────────────────────────────────────────────── */

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
    .replaceAll("__ROUTE__", page.route)
    .replaceAll("__ARTICLE_CONTENT__", "");

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputPath, html);
}

/* ── Article documents ──────────────────────────────────────────────────── */

const journalDirectory = path.join(root, "journal");
const generatedArticles = [];

for (const article of articles) {
  const slug = article.$id;
  const outputDirectory = path.join(journalDirectory, slug);
  const canonical = `${domain}/journal/${slug}/`;
  const title = `${article.title || article.name || "Article"} — Bipul Roy`;
  const description = article.description || article.excerpt || "";

  const html = template
    .replaceAll("__DESCRIPTION__", description)
    .replaceAll("__ROBOTS__", "index, follow")
    .replaceAll("__CANONICAL__", canonical)
    .replaceAll("__TITLE__", title)
    .replaceAll("__BREADCRUMB__", article.title || article.name || "Article")
    .replaceAll("__ROUTE__", `/journal/${slug}`)
    .replaceAll("__ARTICLE_CONTENT__", prerenderArticle(article));

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(path.join(outputDirectory, "index.html"), html);
  generatedArticles.push({ slug, title: article.title || article.name || slug, updated: article.$updatedAt || article.$createdAt });
}

// Remove stale article pages that are no longer published.
try {
  const existing = await readFile(path.join(journalDirectory, "index.html"), "utf8");
  void existing;
} catch {
  // The /journal route document is written by the loop above.
}
for (const entry of generatedArticles) {
  void entry;
}

/* ── Sitemap ────────────────────────────────────────────────────────────── */

const sitemapPath = path.join(root, "public", "sitemap.xml");
try {
  const current = await readFile(sitemapPath, "utf8");
  const base = current.replace(/<url>[\s\S]*?<\/url>\s*/g, "").replace(
    /<urlset[^>]*>/,
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  );
  const today = new Date().toISOString().slice(0, 10);

  const staticEntries = [
    { loc: `${domain}/`, priority: "1.0", changefreq: "weekly" },
    { loc: `${domain}/projects/`, priority: "0.9", changefreq: "weekly" },
    { loc: `${domain}/services/`, priority: "0.8", changefreq: "monthly" },
    { loc: `${domain}/experience/`, priority: "0.8", changefreq: "monthly" },
    { loc: `${domain}/tech-stack/`, priority: "0.7", changefreq: "monthly" },
    { loc: `${domain}/gallery/`, priority: "0.7", changefreq: "weekly" },
    { loc: `${domain}/journal/`, priority: "0.7", changefreq: "weekly" },
    { loc: `${domain}/contact/`, priority: "0.6", changefreq: "monthly" },
  ];

  const entries = [
    ...staticEntries.map(
      (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    ),
    ...generatedArticles.map(
      (article) => `  <url>
    <loc>${domain}/journal/${article.slug}/</loc>
    <lastmod>${(article.updated || today).slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`,
    ),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
${base}
${entries.join("\n")}
</urlset>
`;
  if (sitemap !== current) await writeFile(sitemapPath, sitemap);
} catch (error) {
  console.warn("Could not update sitemap.xml:", error?.message ?? error);
}

console.log(`Generated ${pages.length} route documents and ${generatedArticles.length} article documents from page-template.html`);
