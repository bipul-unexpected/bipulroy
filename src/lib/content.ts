import { Client, Databases, ID, Query, Storage } from "appwrite";

export type ContentKind = "projects" | "articles" | "gallery" | "tools";

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
const collectionIds: Record<ContentKind, string | undefined> = {
  projects: env.VITE_APPWRITE_PROJECTS_COLLECTION_ID as string | undefined,
  articles: env.VITE_APPWRITE_ARTICLES_COLLECTION_ID as string | undefined,
  gallery: env.VITE_APPWRITE_GALLERY_COLLECTION_ID as string | undefined,
  tools: env.VITE_APPWRITE_TOOLS_COLLECTION_ID as string | undefined,
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

export async function createContent(
  kind: ContentKind,
  data: Omit<RemoteContent, "$id" | "$createdAt">,
) {
  if (!appwriteIsConfigured) {
    throw new Error("Appwrite is not configured for this deployment.");
  }

  const response = await databases.createDocument(
    env.VITE_APPWRITE_DATABASE_ID as string,
    getCollectionId(kind),
    ID.unique(),
    cleanContentData(data),
  );
  return response as unknown as RemoteContent;
}

export async function updateContent(
  kind: ContentKind,
  documentId: string,
  data: Omit<RemoteContent, "$id" | "$createdAt">,
) {
  if (!appwriteIsConfigured) {
    throw new Error("Appwrite is not configured for this deployment.");
  }

  const response = await databases.updateDocument(
    env.VITE_APPWRITE_DATABASE_ID as string,
    getCollectionId(kind),
    documentId,
    cleanContentData(data),
  );
  return response as unknown as RemoteContent;
}

export async function deleteContent(kind: ContentKind, documentId: string) {
  if (!appwriteIsConfigured) {
    throw new Error("Appwrite is not configured for this deployment.");
  }

  await databases.deleteDocument(
    env.VITE_APPWRITE_DATABASE_ID as string,
    getCollectionId(kind),
    documentId,
  );
}

export async function uploadContentImage(file: File) {
  const bucketId = env.VITE_APPWRITE_STORAGE_BUCKET_ID as string | undefined;
  if (!bucketId || !appwriteIsConfigured) {
    throw new Error("Appwrite Storage is not configured for this deployment.");
  }

  const uploaded = await storage.createFile(bucketId, ID.unique(), file);
  const endpoint = env.VITE_APPWRITE_ENDPOINT as string;
  const projectId = env.VITE_APPWRITE_PROJECT_ID as string;
  return {
    fileId: uploaded.$id,
    url: `${endpoint}/storage/buckets/${bucketId}/files/${uploaded.$id}/view?project=${projectId}`,
  };
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
  await storage.deleteFile(bucketId, fileId);
}

export function isAdminUser(user: { publicMetadata?: Record<string, unknown> } | null | undefined) {
  return user?.publicMetadata?.role === "admin";
}
