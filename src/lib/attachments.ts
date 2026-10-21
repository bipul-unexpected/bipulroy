import { getContentImageUrl } from "./content";

/**
 * A file attached to a content record (a spec, notes, a `.md` file, a PDF, …).
 *
 * The collections store attachments as a string array because that is what
 * Appwrite supports. Each entry is encoded as
 * `fileId::name::mimeType::size` — the file id is alphanumeric, so the
 * separator can never appear inside a value.
 */
export type ContentAttachment = {
  fileId: string;
  name: string;
  mimeType: string;
  size: number;
  url: string;
};

const SEPARATOR = "::";

export function encodeAttachment(attachment: {
  fileId: string;
  name: string;
  mimeType: string;
  size: number;
}): string {
  return [
    attachment.fileId,
    attachment.name.replace(SEPARATOR, " "),
    attachment.mimeType.replace(SEPARATOR, " "),
    String(attachment.size ?? 0),
  ].join(SEPARATOR);
}

export function decodeAttachment(raw: string): ContentAttachment | null {
  if (!raw) return null;
  const parts = raw.split(SEPARATOR);
  const [fileId, name, mimeType, size] = parts;
  if (!fileId) return null;
  return {
    fileId,
    name: name || "attachment",
    mimeType: mimeType || "application/octet-stream",
    size: Number(size) || 0,
    url: getContentImageUrl(fileId),
  };
}

export function decodeAttachments(list?: string[]): ContentAttachment[] {
  if (!list?.length) return [];
  return list
    .map((raw) => decodeAttachment(raw))
    .filter((item): item is ContentAttachment => item !== null);
}

export function formatFileSize(bytes: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** A readable icon hint for the file kind. */
export function attachmentKind(mimeType: string): "doc" | "code" | "image" | "file" {
  if (mimeType.startsWith("image/")) return "image";
  if (/markdown|json|xml|yaml|javascript|typescript|html|css/i.test(mimeType)) return "code";
  if (/text|pdf|word|excel|powerpoint|document/i.test(mimeType)) return "doc";
  return "file";
}
