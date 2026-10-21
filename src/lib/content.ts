import { Client, Databases, Query, Storage } from "appwrite";

export type ContentKind =
  | "projects"
  | "articles"
  | "gallery"
  | "tools"
  | "experience"
  | "services"
  | "testimonials";

export interface RemoteContent {
  $id: string;
  $createdAt?: string;
  title: string;
  slug?: string;
  description?: string;
  excerpt?: string;
  body?: string;
  imageUrl?: string;
  imageFileId?: string;
  url?: string;
  category?: string;
  tags?: string[];
  published?: boolean;
  featured?: boolean;
  name?: string;
  icon?: string;
  website?: string;
  attachments?: string[];
}

const env = import.meta.env;
let adminTokenProvider: (() => Promise<string | null>) | null = null;

/**
 * A stalled request must never leave a section spinning forever, so every
 * network call is raced against a deadline. The underlying request is not
 * cancelled, but the caller stops waiting for it.
 */
const REQUEST_TIMEOUT_MS = 8000;
const ADMIN_REQUEST_TIMEOUT_MS = 20000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_resolve, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms.`)), ms),
    ),
  ]);
}

export function configureAdminTokenProvider(provider: (() => Promise<string | null>) | null) {
  adminTokenProvider = provider;
}
const collectionIds: Record<ContentKind, string | undefined> = {
  projects: env.VITE_APPWRITE_PROJECTS_COLLECTION_ID as string | undefined,
  articles: env.VITE_APPWRITE_ARTICLES_COLLECTION_ID as string | undefined,
  gallery: env.VITE_APPWRITE_GALLERY_COLLECTION_ID as string | undefined,
  tools: env.VITE_APPWRITE_TOOLS_COLLECTION_ID as string | undefined,
  experience: env.VITE_APPWRITE_EXPERIENCE_COLLECTION_ID as string | undefined,
  services: env.VITE_APPWRITE_SERVICES_COLLECTION_ID as string | undefined,
  testimonials: env.VITE_APPWRITE_TESTIMONIALS_COLLECTION_ID as string | undefined,
};

export const appwriteIsConfigured = Boolean(
  env.VITE_APPWRITE_ENDPOINT &&
    env.VITE_APPWRITE_PROJECT_ID &&
    env.VITE_APPWRITE_DATABASE_ID &&
    Object.values(collectionIds).some(Boolean),
);

const client = new Client();
if (env.VITE_APPWRITE_ENDPOINT && env.VITE_APPWRITE_PROJECT_ID) {
  client
    .setEndpoint(env.VITE_APPWRITE_ENDPOINT as string)
    .setProject(env.VITE_APPWRITE_PROJECT_ID as string);
}

export const databases = new Databases(client);
export const storage = new Storage(client);

function getCollectionId(kind: ContentKind) {
  const collectionId = collectionIds[kind];
  if (!collectionId) {
    throw new Error(`Missing Appwrite collection ID for ${kind}.`);
  }
  return collectionId;
}

/**
 * Direct read with the browser's anonymous client. Used as a fallback and
 * for the public site, where the collections are readable by anyone.
 */
async function listDirect(
  kind: ContentKind,
  options: { includeUnpublished?: boolean } = {},
): Promise<RemoteContent[]> {
  if (!appwriteIsConfigured) return [];

  const queries = options.includeUnpublished
    ? [Query.orderDesc("$createdAt"), Query.limit(100)]
    : [Query.equal("published", true), Query.orderDesc("$createdAt"), Query.limit(100)];
  const response = await databases.listDocuments(
    env.VITE_APPWRITE_DATABASE_ID as string,
    getCollectionId(kind),
    queries,
  );
  return response.documents as unknown as RemoteContent[];
}

/**
 * Public read. Only published documents, read straight from the browser with
 * the anonymous client. Collections run with document-level security, so a
 * published record is readable by anyone and a draft is not.
 */
export async function listPublishedContent(kind: ContentKind): Promise<RemoteContent[]> {
  if (!appwriteIsConfigured) return [];

  try {
    const response = await withTimeout(
      databases.listDocuments(
        env.VITE_APPWRITE_DATABASE_ID as string,
        getCollectionId(kind),
        [Query.equal("published", true), Query.orderDesc("$createdAt"), Query.limit(100)],
      ),
      REQUEST_TIMEOUT_MS,
      `Reading "${kind}"`,
    );
    return response.documents as unknown as RemoteContent[];
  } catch (error) {
    // The public site must keep rendering when Appwrite is unreachable, so the
    // caller falls back to the bundled content instead of showing an error.
    console.warn(`[content] Public read for "${kind}" failed:`, error);
    return [];
  }
}

/**
 * Admin read. Routed through the Appwrite Function because the studio needs
 * to see drafts too, and the browser's anonymous client cannot read them.
 * Falls back to a direct read while a deployed Function predates the `list`
 * operation, so the studio is never silently empty.
 */
export async function listContent(
  kind: ContentKind,
  options: { includeUnpublished?: boolean } = {},
): Promise<RemoteContent[]> {
  if (!appwriteIsConfigured) return [];

  try {
    return await adminRequest<RemoteContent[]>("list", { kind });
  } catch (error) {
    console.warn(`[content] Admin list for "${kind}" fell back to a direct read:`, error);
    return listDirect(kind, { includeUnpublished: true });
  }
}

/** Publish or unpublish a record without editing its content. */
export async function setContentPublished(
  kind: ContentKind,
  documentId: string,
  published: boolean,
) {
  if (!appwriteIsConfigured) {
    throw new Error("Appwrite is not configured for this deployment.");
  }

  return adminRequest<RemoteContent>("publish", { kind, documentId, published });
}

function cleanContentData(data: Omit<RemoteContent, "$id" | "$createdAt">) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined && value !== ""),
  );
}

async function adminRequest<T>(operation: string, payload: Record<string, unknown> = {}) {
  const functionUrl = (env.VITE_APPWRITE_ADMIN_FUNCTION_URL as string | undefined)?.trim();
  if (!functionUrl) {
    throw new Error("Admin write service is not configured. Set VITE_APPWRITE_ADMIN_FUNCTION_URL.");
  }
  let parsedFunctionUrl: URL;
  try {
    parsedFunctionUrl = new URL(functionUrl);
  } catch {
    throw new Error("Admin write service URL is invalid. Copy the generated Appwrite Function domain from Functions -> Domains.");
  }
  if (parsedFunctionUrl.protocol !== "https:") {
    throw new Error("Admin write service must use an HTTPS Appwrite Function domain.");
  }
  let token: string | null = null;
  for (let attempt = 0; attempt < 3 && !token; attempt += 1) {
    token = (await adminTokenProvider?.()) ?? null;
    if (!token && attempt < 2) {
      await new Promise((resolve) => window.setTimeout(resolve, 250));
    }
  }
  if (!token) throw new Error("Your Clerk session is missing or expired. Sign in again.");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ADMIN_REQUEST_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(parsedFunctionUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ operation, ...payload }),
      signal: controller.signal,
    });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error("The admin service did not respond in time. Check your connection and try again.");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Admin write service rejected the request.");
  return result.data as T;
}

export async function createContent(
  kind: ContentKind,
  data: Omit<RemoteContent, "$id" | "$createdAt">,
) {
  if (!appwriteIsConfigured) {
    throw new Error("Appwrite is not configured for this deployment.");
  }

  return adminRequest<RemoteContent>("create", {
    kind,
    data: cleanContentData(data),
  });
}

export async function updateContent(
  kind: ContentKind,
  documentId: string,
  data: Omit<RemoteContent, "$id" | "$createdAt">,
) {
  if (!appwriteIsConfigured) {
    throw new Error("Appwrite is not configured for this deployment.");
  }

  return adminRequest<RemoteContent>("update", {
    kind,
    documentId,
    data: cleanContentData(data),
  });
}

export async function deleteContent(kind: ContentKind, documentId: string) {
  if (!appwriteIsConfigured) {
    throw new Error("Appwrite is not configured for this deployment.");
  }

  await adminRequest("delete", { kind, documentId });
}

export async function uploadContentImage(file: File) {
  const uploaded = await uploadContentFile(file);
  return { fileId: uploaded.fileId, url: uploaded.url };
}

/**
 * Uploads any file (image, markdown, PDF, archive, …) to Storage and returns
 * its metadata so it can be attached to a record.
 */
export async function uploadContentFile(file: File) {
  const bucketId = env.VITE_APPWRITE_STORAGE_BUCKET_ID as string | undefined;
  if (!bucketId || !appwriteIsConfigured) {
    throw new Error("Appwrite Storage is not configured for this deployment.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Files must be 10 MB or smaller.");
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return adminRequest<{ fileId: string; url: string; name: string; mimeType: string; size: number }>(
    "upload",
    {
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      fileBase64: btoa(binary),
    },
  );
}

/** Reads a single published record by id (used by the article pages). */
export async function getPublishedContent(
  kind: ContentKind,
  documentId: string,
): Promise<RemoteContent | null> {
  if (!appwriteIsConfigured) return null;

  try {
    const document = await withTimeout(
      databases.getDocument(
        env.VITE_APPWRITE_DATABASE_ID as string,
        getCollectionId(kind),
        documentId,
      ),
      REQUEST_TIMEOUT_MS,
      `Reading "${kind}/${documentId}"`,
    );
    const record = document as unknown as RemoteContent;
    return record.published === false ? null : record;
  } catch (error) {
    console.warn(`[content] Could not read "${kind}/${documentId}":`, error);
    return null;
  }
}

export function getContentImageUrl(fileId: string) {
  const bucketId = env.VITE_APPWRITE_STORAGE_BUCKET_ID as string | undefined;
  const endpoint = env.VITE_APPWRITE_ENDPOINT as string | undefined;
  const projectId = env.VITE_APPWRITE_PROJECT_ID as string | undefined;
  if (!bucketId || !endpoint || !projectId) {
    throw new Error("Appwrite Storage is not configured for this deployment.");
  }
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
}

export async function deleteContentImage(fileId: string) {
  const bucketId = env.VITE_APPWRITE_STORAGE_BUCKET_ID as string | undefined;
  if (!bucketId || !appwriteIsConfigured) {
    throw new Error("Appwrite Storage is not configured for this deployment.");
  }
  await adminRequest("deleteImage", { fileId });
}

/** Removes any stored file — an image or an attachment. */
export async function deleteContentFile(fileId: string) {
  await deleteContentImage(fileId);
}

export function isAdminUser(
  user: { id?: string; publicMetadata?: Record<string, unknown> } | null | undefined,
) {
  const configuredAdminId = env.VITE_CLERK_ADMIN_USER_ID as string | undefined;
  return Boolean(
    user &&
      ((configuredAdminId && user.id === configuredAdminId) ||
        user.publicMetadata?.role === "admin"),
  );
}
