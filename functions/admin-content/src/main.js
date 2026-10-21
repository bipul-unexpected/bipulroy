const { Client, Databases, ID, Storage } = require("node-appwrite");
const { InputFile } = require("node-appwrite/file");

const kinds = new Set([
  "projects",
  "articles",
  "gallery",
  "tools",
  "experience",
  "services",
  "testimonials",
]);

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "600",
};

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthorizationError";
  }
}

function json(res, status, body) {
  return res.json(body, status, corsHeaders);
}

function preflightCors(res) {
  return res.text("", 204, corsHeaders);
}

function collectionId(kind) {
  if (!kinds.has(kind)) throw new Error("Unsupported content type.");
  const value = process.env[`APPWRITE_${kind.toUpperCase()}_COLLECTION_ID`];
  if (!value) throw new Error(`Missing collection configuration for ${kind}.`);
  return value;
}

async function schemaSafeData(databases, kind, data) {
  let attributes = new Set();
  try {
    const collection = await databases.getCollection(
      process.env.APPWRITE_DATABASE_ID,
      collectionId(kind),
    );
    attributes = new Set((collection.attributes || []).map((attribute) => attribute.key));
  } catch {
    attributes = new Set([
      "title", "name", "description", "excerpt", "body", "url", "website",
      "category", "icon", "imageUrl", "imageFileId", "tags", "published", "featured"
    ]);
  }

  const input = data && typeof data === "object" ? data : {};
  const output = {};

  for (const [key, value] of Object.entries(input)) {
    if (attributes.has(key) && value !== undefined && value !== "") {
      output[key] = value;
    }
  }

  if (!output.title && !output.name && (input.title || input.name)) {
    const val = input.title || input.name;
    if (attributes.has("title")) output.title = val;
    else if (attributes.has("name")) output.name = val;
  }
  if (!output.description && !output.excerpt && (input.description || input.excerpt)) {
    const val = input.description || input.excerpt;
    if (attributes.has("description")) output.description = val;
    else if (attributes.has("excerpt")) output.excerpt = val;
  }

  if (Object.keys(output).length === 0) {
    if (attributes.has("title")) output.title = input.title || input.name || "Untitled";
    else if (attributes.has("name")) output.name = input.title || input.name || "Untitled";
    else if (attributes.has("published")) output.published = true;
  }

  return output;
}

async function verifyAdmin(req) {
  const authorization = req.headers.authorization || req.headers.Authorization || "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";
  if (!token) throw new AuthorizationError("Missing Clerk authorization token. Sign in again.");

  const { createRemoteJWKSet, jwtVerify } = await import("jose");
  const issuer = process.env.CLERK_JWT_ISSUER;
  const jwks = createRemoteJWKSet(new URL(process.env.CLERK_JWKS_URL));
  const { payload } = await jwtVerify(token, jwks, issuer ? { issuer } : undefined);
  if (process.env.CLERK_ADMIN_USER_ID && payload.sub !== process.env.CLERK_ADMIN_USER_ID) {
    throw new AuthorizationError("This Clerk account is not the configured administrator. Set the same Clerk user ID in VITE_CLERK_ADMIN_USER_ID and CLERK_ADMIN_USER_ID.");
  }
  if (!process.env.CLERK_ADMIN_USER_ID &&
      payload.metadata?.role !== "admin" &&
      payload.public_metadata?.role !== "admin") {
    throw new AuthorizationError("Administrator role required. Add public metadata role=admin to the Clerk account.");
  }
  return payload;
}

module.exports = async ({ req, res, log, error }) => {
  if (req.method === "OPTIONS") {
    return preflightCors(res);
  }
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
        await schemaSafeData(databases, body.kind, body.data),
      );
      return json(res, 200, { data });
    }
    if (body.operation === "update") {
      const data = await databases.updateDocument(
        process.env.APPWRITE_DATABASE_ID,
        collectionId(body.kind),
        body.documentId,
        await schemaSafeData(databases, body.kind, body.data),
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
    const status = caught instanceof AuthorizationError ? 403 : 500;
    return json(res, status, { error: caught instanceof Error ? caught.message : "Admin operation failed." });
  }
};
