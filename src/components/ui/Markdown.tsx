import { Fragment, type ReactNode } from "react";

/**
 * A small, dependency-free Markdown renderer.
 *
 * It produces React elements rather than an HTML string, so untrusted content
 * from the CMS can never inject markup. The supported subset covers what a
 * written article needs: headings, paragraphs, lists, quotes, code blocks,
 * horizontal rules and inline emphasis, code and links.
 */

type Inline = { text: string };

const INLINE_PATTERN =
  /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)\s]+\))|(_[^_]+_)/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  INLINE_PATTERN.lastIndex = 0;
  while ((match = INLINE_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    const key = `${keyPrefix}-i${index++}`;

    if (token.startsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("[")) {
      const link = token.match(/\[([^\]]+)\]\(([^)\s]+)\)/);
      const href = link?.[2] ?? "#";
      const external = /^https?:\/\//i.test(href);
      nodes.push(
        <a
          key={key}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="font-medium text-primary underline underline-offset-4 hover:opacity-80">
          {link?.[1] ?? token}
        </a>,
      );
    } else {
      nodes.push(
        <em key={key} className="italic">
          {token.slice(1, -1)}
        </em>,
      );
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function headingClass(level: number) {
  return [
    "mt-10 mb-3 font-bold tracking-tight text-foreground",
    level === 1 ? "text-3xl" : level === 2 ? "text-2xl" : "text-xl",
  ].join(" ");
}

export function Markdown({ content, className = "" }: { content: string; className?: string }) {
  const lines = (content ?? "").replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;
  let key = 0;

  while (index < lines.length) {
    const line = lines[index];

    // Fenced code block
    if (line.trimStart().startsWith("```")) {
      const language = line.trim().slice(3).trim();
      const body: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trimStart().startsWith("```")) {
        body.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push(
        <pre
          key={`b${key++}`}
          className="my-5 overflow-x-auto rounded-xl border border-border bg-muted/60 p-4 text-sm">
          <code className="font-mono text-foreground" data-language={language || undefined}>
            {body.join("\n")}
          </code>
        </pre>,
      );
      continue;
    }

    // Blank line
    if (!line.trim()) {
      index += 1;
      continue;
    }

    // Heading
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      const Tag = (`h${Math.min(level + 1, 6)}`) as "h2" | "h3" | "h4" | "h5" | "h6";
      blocks.push(
        <Tag key={`b${key++}`} className={headingClass(level)}>
          {renderInline(heading[2], `h${key}`)}
        </Tag>,
      );
      index += 1;
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      blocks.push(<hr key={`b${key++}`} className="my-8 border-border" />);
      index += 1;
      continue;
    }

    // Blockquote
    if (line.trimStart().startsWith(">")) {
      const quote: string[] = [];
      while (index < lines.length && lines[index].trimStart().startsWith(">")) {
        quote.push(lines[index].replace(/^\s*>\s?/, ""));
        index += 1;
      }
      blocks.push(
        <blockquote
          key={`b${key++}`}
          className="my-5 border-l-2 border-primary/60 pl-4 italic text-muted-foreground">
          {renderInline(quote.join(" "), `q${key}`)}
        </blockquote>,
      );
      continue;
    }

    // Lists
    const unordered = line.match(/^\s*[-*+]\s+(.*)$/);
    const ordered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (unordered || ordered) {
      const items: string[] = [];
      while (index < lines.length) {
        const item = lines[index].match(
          ordered ? /^\s*\d+[.)]\s+(.*)$/ : /^\s*[-*+]\s+(.*)$/,
        );
        if (!item) break;
        items.push(item[1]);
        index += 1;
      }
      const ListTag = ordered ? "ol" : "ul";
      blocks.push(
        <ListTag
          key={`b${key++}`}
          className={`my-5 space-y-2 pl-5 ${ordered ? "list-decimal" : "list-disc"} marker:text-primary`}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex} className="leading-relaxed text-foreground/90">
              {renderInline(item, `l${key}-${itemIndex}`)}
            </li>
          ))}
        </ListTag>,
      );
      continue;
    }

    // Paragraph
    const paragraph: string[] = [];
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
    blocks.push(
      <p key={`b${key++}`} className="my-4 leading-relaxed text-foreground/90">
        {renderInline(paragraph.join(" "), `p${key}`)}
      </p>,
    );
  }

  return (
    <div className={className}>
      {blocks.map((block, blockIndex) => (
        <Fragment key={blockIndex}>{block}</Fragment>
      ))}
    </div>
  );
}
