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
}

const env = import.meta.env;
let adminTokenProvider: (() => Promise<string | null>) | null = null;

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

export async function listContent(kind: ContentKind, options: { includeUnpublished?: boolean } = {}) {
  if (!appwriteIsConfigured) return [] as RemoteContent[];

  const queries = options.includeUnpublished
    ? [Query.orderDesc("$createdAt")]
    : [Query.equal("published", true), Query.orderDesc("$createdAt")];
  const response = await databases.listDocuments(
    env.VITE_APPWRITE_DATABASE_ID as string,
    getCollectionId(kind),
    queries,
  );
  return response.documents as unknown as RemoteContent[];
}

function cleanContentData(data: Omit<RemoteContent, "$id" | "$createdAt">) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined && value !== ""),
  );
}

async function adminRequest<T>(operation: string, payload: Record<string, unknown> = {}) {
  const functionUrl = env.VITE_APPWRITE_ADMIN_FUNCTION_URL as string | undefined;
  if (!functionUrl) {
    throw new Error("Admin write service is not configured. Set VITE_APPWRITE_ADMIN_FUNCTION_URL.");
  }
  const token = await adminTokenProvider?.();
  if (!token) throw new Error("Your Clerk session is missing or expired. Sign in again.");
  const response = await fetch(functionUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ operation, ...payload }),
  });
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
  const bucketId = env.VITE_APPWRITE_STORAGE_BUCKET_ID as string | undefined;
  if (!bucketId || !appwriteIsConfigured) {
    throw new Error("Appwrite Storage is not configured for this deployment.");
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return adminRequest<{ fileId: string; url: string }>("upload", {
    fileName: file.name,
    mimeType: file.type,
    fileBase64: btoa(binary),
  });
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
