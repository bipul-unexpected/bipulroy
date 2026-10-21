import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Download, FileCode2, FileText, Image as ImageIcon, Paperclip } from "lucide-react";
import { Markdown } from "../ui/Markdown";
import { Button } from "../ui/button";
import {
  attachmentKind,
  decodeAttachments,
  formatFileSize,
  type ContentAttachment,
} from "../../lib/attachments";
import { getPublishedContent, type RemoteContent } from "../../lib/content";
import { profile } from "../../data/portfolio";

const kindIcons = {
  doc: FileText,
  code: FileCode2,
  image: ImageIcon,
  file: Paperclip,
};

function readingTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function AttachmentRow({ attachment }: { attachment: ContentAttachment }) {
  const Icon = kindIcons[attachmentKind(attachment.mimeType)];
  return (
    <li className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-3.5 transition-colors hover:border-primary/40">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">{attachment.name}</span>
        <span className="block text-[11px] text-muted-foreground">
          {attachment.mimeType}
          {attachment.size ? ` · ${formatFileSize(attachment.size)}` : ""}
        </span>
      </span>
      <a
        href={attachment.url}
        download={attachment.name}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent">
        <Download className="h-3.5 w-3.5" aria-hidden="true" />
        Download
      </a>
    </li>
  );
}

export function ArticlePage({ documentId }: { documentId: string }) {
  const [article, setArticle] = useState<RemoteContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getPublishedContent("articles", documentId)
      .then((record) => {
        if (!active) return;
        setArticle(record);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setArticle(null);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [documentId]);

  const attachments = useMemo(() => decodeAttachments(article?.attachments), [article]);

  const title = article?.title || article?.name || "Article";
  const description = article?.description || article?.excerpt || "";

  // Per-page SEO for the article itself.
  useEffect(() => {
    if (!article) return;
    document.title = `${title} — ${profile.name}`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", `https://bipul.tech/journal/${documentId}`);
  }, [article, title, description, documentId]);

  if (loading) {
    return (
      <article className="mx-auto w-full max-w-3xl px-4 py-24 sm:px-6">
        <p className="text-sm text-muted-foreground">Loading article…</p>
      </article>
    );
  }

  if (!article) {
    return (
      <article className="mx-auto w-full max-w-3xl px-4 py-24 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Article not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This article may have been unpublished, or the link is out of date.
        </p>
        <Button render={<a href="/journal" />} className="mt-6 h-9 rounded-lg">
          <ArrowLeft className="h-4 w-4" />
          Back to the journal
        </Button>
      </article>
    );
  }

  return (
    <article className="mx-auto w-full max-w-3xl px-4 pb-24 pt-16 sm:px-6 sm:pt-20">
      <a
        href="/journal"
        className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Journal
      </a>

      <header className="mt-6">
        {article.category && (
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
            {article.category}
          </span>
        )}
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        )}
        <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-border/60 py-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {article.$createdAt
              ? new Date(article.$createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "—"}
          </span>
          <span aria-hidden="true">·</span>
          <span>{readingTime(article.body ?? "")} min read</span>
          {article.tags?.length ? (
            <>
              <span aria-hidden="true">·</span>
              <span className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[11px]">
                    {tag}
                  </span>
                ))}
              </span>
            </>
          ) : null}
        </div>
      </header>

      {article.imageUrl && (
        <figure className="mt-8 overflow-hidden rounded-2xl border border-border/70">
          <img
            src={article.imageUrl}
            alt={title}
            className="h-auto w-full object-cover"
            loading="eager"
          />
        </figure>
      )}

      {article.body ? (
        <Markdown content={article.body} className="mt-8 text-[15px] sm:text-base" />
      ) : null}

      {attachments.length > 0 && (
        <section className="mt-12 border-t border-border/60 pt-8">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
            <Paperclip className="h-4 w-4 text-primary" aria-hidden="true" />
            Attachments ({attachments.length})
          </h2>
          <p className="mt-2 text-xs text-muted-foreground">
            Supporting files published with this article.
          </p>
          <ul className="mt-4 space-y-2.5">
            {attachments.map((attachment) => (
              <AttachmentRow key={attachment.fileId} attachment={attachment} />
            ))}
          </ul>
        </section>
      )}

      <footer className="mt-14 rounded-2xl border border-border/70 bg-card p-6">
        <p className="text-sm font-semibold text-foreground">Written by {profile.name}</p>
        <p className="mt-1.5 text-sm text-muted-foreground">{profile.tagline}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button render={<a href="/contact" />} className="h-9 rounded-lg">
            Work with me
          </Button>
          <Button
            render={<a href="/journal" />}
            variant="outline"
            className="h-9 rounded-lg">
            More articles
          </Button>
        </div>
      </footer>
    </article>
  );
}
