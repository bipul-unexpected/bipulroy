import { Client, Databases, ID, InputFile, Storage } from "node-appwrite";
import { createRemoteJWKSet, jwtVerify } from "jose";

const kinds = new Set([
  "projects",
  "articles",
  "gallery",
  "tools",
  "experience",
  "services",
  "testimonials",
]);

function json(res, status, body) {
  return res.json(body, status);
}

function collectionId(kind) {
  if (!kinds.has(kind)) throw new Error("Unsupported content type.");
  const value = process.env[`APPWRITE_${kind.toUpperCase()}_COLLECTION_ID`];
  if (!value) throw new Error(`Missing collection configuration for ${kind}.`);
  return value;
}

async function verifyAdmin(req) {
  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";
  if (!token) throw new Error("Missing Clerk authorization token.");

  const issuer = process.env.CLERK_JWT_ISSUER;
  const jwks = createRemoteJWKSet(new URL(process.env.CLERK_JWKS_URL));
  const { payload } = await jwtVerify(token, jwks, issuer ? { issuer } : undefined);
  if (process.env.CLERK_ADMIN_USER_ID && payload.sub !== process.env.CLERK_ADMIN_USER_ID) {
    throw new Error("Administrator account required.");
  }
  if (!process.env.CLERK_ADMIN_USER_ID &&
      payload.metadata?.role !== "admin" &&
      payload.public_metadata?.role !== "admin") {
    throw new Error("Administrator role required.");
  }
  return payload;
}

export default async ({ req, res, log, error }) => {
  try {
    await verifyAdmin(req);
    const body = req.bodyJson || JSON.parse(req.body || "{}");
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);
    const databases = new Databases(client);
    const storage = new Storage(client);

    if (body.operation === "create") {
      const data = await databases.createDocument(
        process.env.APPWRITE_DATABASE_ID,
        collectionId(body.kind),
        ID.unique(),
        body.data || {},
      );
      return json(res, 200, { data });
    }
    if (body.operation === "update") {
      const data = await databases.updateDocument(
        process.env.APPWRITE_DATABASE_ID,
        collectionId(body.kind),
        body.documentId,
        body.data || {},
      );
      return json(res, 200, { data });
    }
    if (body.operation === "delete") {
      await databases.deleteDocument(
        process.env.APPWRITE_DATABASE_ID,
        collectionId(body.kind),
        body.documentId,
      );
      return json(res, 200, { data: null });
    }
    if (body.operation === "upload") {
      const decoded = Buffer.from(body.fileBase64 || "", "base64");
      if (!body.mimeType?.startsWith("image/") || decoded.length === 0 || decoded.length > 10 * 1024 * 1024) {
        throw new Error("Only non-empty images up to 10 MB are accepted.");
      }
      const file = await storage.createFile(
        process.env.APPWRITE_STORAGE_BUCKET_ID,
        ID.unique(),
        InputFile.fromBuffer(decoded, body.fileName || "upload"),
      );
      const url = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_STORAGE_BUCKET_ID}/files/${file.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
      return json(res, 200, { data: { fileId: file.$id, url } });
    }
    if (body.operation === "deleteImage") {
      await storage.deleteFile(process.env.APPWRITE_STORAGE_BUCKET_ID, body.fileId);
      return json(res, 200, { data: null });
    }
    return json(res, 400, { error: "Unsupported admin operation." });
  } catch (caught) {
    error(caught instanceof Error ? caught.message : String(caught));
    return json(res, 403, { error: caught instanceof Error ? caught.message : "Forbidden." });
  }
};
