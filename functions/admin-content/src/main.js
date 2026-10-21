const { Client, Databases, ID, Permission, Query, Role, Storage } = require("node-appwrite");
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

/**
 * Raised when Appwrite rejects a document because the collection does not
 * declare one of the attributes we sent. Carries the offending key so the
 * caller can strip it and retry instead of failing the whole request.
 */
class UnknownAttributeError extends Error {
  constructor(attribute) {
    super(`Invalid document structure: Unknown attribute: ${attribute}`);
    this.name = "UnknownAttributeError";
    this.attribute = attribute;
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

/**
 * Read permissions for a document.
 *
 * The collections run with document-level security, so a published record is
 * readable by anyone (that is what powers the public portfolio) while a draft
 * stays private to the Function that holds the API key.
 */
function documentPermissions(published) {
  return published === false ? [] : [Permission.read(Role.any())];
}

/**
 * Read the live attribute keys of a collection.
 * Returns null when the schema cannot be read (for example when the function
 * key is missing the databases.read scope). Callers must treat null as
 * "unknown schema" and stay permissive instead of guessing.
 */
async function readCollectionSchema(databases, kind) {
  try {
    const collection = await databases.getCollection(
      process.env.APPWRITE_DATABASE_ID,
      collectionId(kind),
    );
    const keys = (collection.attributes || []).map((attribute) => attribute.key);
    return keys.length > 0 ? new Set(keys) : null;
  } catch {
    return null;
  }
}

/**
 * Narrow the incoming payload down to the attributes the collection actually
 * declares. When the schema is unknown every field is kept — the write retry
 * below removes whatever Appwrite rejects, which is safer than guessing that
 * a collection has (or has not) a "title" attribute.
 */
function schemaSafeData(attributes, data) {
  const input = data && typeof data === "object" ? data : {};
  const output = {};

  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === "") continue;
    if (!attributes || attributes.has(key)) output[key] = value;
  }

  // Mirror the human title into whichever key the collection actually uses.
  if (!output.title && !output.name && (input.title || input.name)) {
    const value = input.title || input.name;
    if (!attributes || attributes.has("title")) output.title = value;
    else if (attributes.has("name")) output.name = value;
  }
  if (!output.description && !output.excerpt && (input.description || input.excerpt)) {
    const value = input.description || input.excerpt;
    if (!attributes || attributes.has("description")) output.description = value;
    else if (attributes.has("excerpt")) output.excerpt = value;
  }

  if (Object.keys(output).length === 0) {
    if (!attributes || attributes.has("title")) output.title = input.title || input.name || "Untitled";
    else if (attributes.has("name")) output.name = input.title || input.name || "Untitled";
    else if (!attributes || attributes.has("published")) output.published = true;
  }

  return output;
}

/**
 * Appwrite reports unknown attributes as "Invalid document structure: Unknown
 * attribute: <key>". When that happens we drop the offending key and try
 * again, so a collection that is missing "title" (or any other field) still
 * saves instead of failing outright.
 */
async function writeWithSchemaRetry(write, payload) {
  const data = { ...payload };
  const dropped = [];

  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      const result = await write(data);
      return { result, dropped };
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : String(caught);
      const match = message.match(/Unknown attribute:?\s*"?([A-Za-z0-9_]+)"?/i);
      const attribute = match ? match[1] : null;
      if (!attribute || !(attribute in data)) throw caught;
      delete data[attribute];
      dropped.push(attribute);
    }
  }

  throw new Error(
    `Could not match the document to the collection schema. Tried dropping: ${dropped.join(", ") || "none"}.`,
  );
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
      const kind = body.kind;
      const attributes = await readCollectionSchema(databases, kind);
      const payload = schemaSafeData(attributes, body.data);
      const { result, dropped } = await writeWithSchemaRetry(
        (data) =>
          databases.createDocument(
            process.env.APPWRITE_DATABASE_ID,
            collectionId(kind),
            ID.unique(),
            data,
            documentPermissions(data.published),
          ),
        payload,
      );
      if (dropped.length > 0) log(`Dropped unsupported attributes for ${kind}: ${dropped.join(", ")}`);
      return json(res, 200, { data: result });
    }
    if (body.operation === "update") {
      const kind = body.kind;
      const attributes = await readCollectionSchema(databases, kind);
      const payload = schemaSafeData(attributes, body.data);
      const { result, dropped } = await writeWithSchemaRetry(
        (data) =>
          databases.updateDocument(
            process.env.APPWRITE_DATABASE_ID,
            collectionId(kind),
            body.documentId,
            data,
            documentPermissions(data.published),
          ),
        payload,
      );
      if (dropped.length > 0) log(`Dropped unsupported attributes for ${kind}: ${dropped.join(", ")}`);
      return json(res, 200, { data: result });
    }
    if (body.operation === "list") {
      // Read through the Function so the studio sees drafts and published
      // records regardless of the collection's public read permissions.
      const result = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        collectionId(body.kind),
        [Query.orderDesc("$createdAt"), Query.limit(200)],
      );
      return json(res, 200, { data: result.documents });
    }
    if (body.operation === "publish") {
      // Flip the visibility of a record without touching its content.
      const kind = body.kind;
      const current = await databases.getDocument(
        process.env.APPWRITE_DATABASE_ID,
        collectionId(kind),
        body.documentId,
      );
      const published = current.published === false;
      const result = await databases.updateDocument(
        process.env.APPWRITE_DATABASE_ID,
        collectionId(kind),
        body.documentId,
        { published },
        documentPermissions(published),
      );
      return json(res, 200, { data: result });
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
      const mimeType = body.mimeType || "application/octet-stream";
      const fileName = String(body.fileName || "upload").slice(0, 120);
      if (decoded.length === 0 || decoded.length > 10 * 1024 * 1024) {
        throw new Error("Only non-empty files up to 10 MB are accepted.");
      }
      const file = await storage.createFile(
        process.env.APPWRITE_STORAGE_BUCKET_ID,
        ID.unique(),
        InputFile.fromBuffer(decoded, fileName),
      );
      const url = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_STORAGE_BUCKET_ID}/files/${file.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
      return json(res, 200, {
        data: {
          fileId: file.$id,
          url,
          name: fileName,
          mimeType,
          size: decoded.length,
        },
      });
    }
    if (body.operation === "deleteImage") {
      await storage.deleteFile(process.env.APPWRITE_STORAGE_BUCKET_ID, body.fileId);
      return json(res, 200, { data: null });
    }
    return json(res, 400, { error: "Unsupported admin operation." });
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : String(caught);
    error(message);
    const status = caught instanceof AuthorizationError ? 403 : 500;
    if (/Unknown attribute|Invalid document structure/i.test(message)) {
      return json(res, 400, {
        error:
          "The collection schema does not accept one of the fields sent. " +
          "Check that the collection declares the attributes listed in the README " +
          "(title, description, published, featured, …) and try again.",
      });
    }
    return json(res, status, { error: message || "Admin operation failed." });
  }
};
