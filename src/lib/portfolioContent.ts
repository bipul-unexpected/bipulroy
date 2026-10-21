import type { RemoteContent } from "./content";
import type {
  Article,
  Experience,
  Project,
  Service,
  Testimonial,
} from "../data/portfolio";

/**
 * Maps Appwrite documents onto the shapes the public site renders.
 *
 * The studio writes a fixed set of attributes (title, category, description,
 * body, tags, url, website, icon, imageUrl) and every collection reuses them
 * for a different purpose, so each kind is mapped explicitly here.
 */

const PROJECT_CATEGORIES = ["fullstack", "frontend", "backend", "saas"] as const;

function text(value: string | undefined) {
  return (value ?? "").trim();
}

function titleOf(item: RemoteContent) {
  return text(item.title) || text(item.name);
}

/**
 * Combines content published from the studio with the bundled showcase.
 *
 * Studio content is listed first so new work is what visitors see, and the
 * bundled entries follow unless the studio already publishes the same thing.
 */
export function mergeRemote<T>(
  remote: T[],
  fallback: T[],
  key: (item: T) => string,
): T[] {
  const seen = new Set(remote.map((item) => key(item).trim().toLowerCase()));
  const extras = fallback.filter((item) => !seen.has(key(item).trim().toLowerCase()));
  return [...remote, ...extras];
}

export function toProject(item: RemoteContent): Project | null {  const title = titleOf(item);
  if (!title) return null;

  const rawCategory = text(item.category).toLowerCase();
  const category = (PROJECT_CATEGORIES as readonly string[]).includes(rawCategory)
    ? (rawCategory as Project["category"])
    : "fullstack";

  const description = text(item.description) || text(item.excerpt);
  const impact = text(item.body) || description;

  return {
    id: item.$id,
    title,
    description,
    impact,
    stack: (item.tags ?? []).map((tag) => tag.trim()).filter(Boolean),
    problem: "",
    result: "",
    category,
    image: text(item.imageUrl),
    liveUrl: text(item.url) || undefined,
    githubUrl: text(item.website) || undefined,
    featured: Boolean(item.featured),
  };
}

export function toTestimonial(item: RemoteContent): Testimonial | null {
  const name = titleOf(item);
  if (!name) return null;

  return {
    name,
    role: text(item.category) || "Client",
    company: text(item.description),
    text: text(item.body) || text(item.excerpt) || text(item.description),
    avatar: text(item.icon) || name.slice(0, 2).toUpperCase(),
  };
}

export function toExperience(item: RemoteContent): Experience | null {
  const title = titleOf(item);
  if (!title) return null;

  return {
    year: text(item.category) || "Present",
    title,
    company: text(item.description),
    description: text(item.body) || text(item.excerpt),
    highlights: (item.tags ?? []).map((tag) => tag.trim()).filter(Boolean),
  };
}

export function toService(item: RemoteContent): Service | null {
  const title = titleOf(item);
  if (!title) return null;

  return {
    title,
    description: text(item.description) || text(item.excerpt),
    icon: text(item.icon) || "Sparkles",
  };
}

export function toArticle(item: RemoteContent): Article | null {
  const title = titleOf(item);
  if (!title) return null;

  return {
    id: item.$id,
    title,
    description: text(item.description) || text(item.excerpt),
    url: text(item.url) || undefined,
  };
}

export type RemoteTool = {
  id: string;
  name: string;
  group: string;
  description: string;
  url?: string;
  icon: string;
};

export function toTool(item: RemoteContent): RemoteTool | null {
  const name = titleOf(item);
  if (!name) return null;

  return {
    id: item.$id,
    name,
    group: text(item.category).toLowerCase(),
    description: text(item.description) || text(item.excerpt),
    url: text(item.website) || text(item.url) || undefined,
    icon: text(item.icon) || "Code",
  };
}
