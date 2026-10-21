import type { ReactNode } from "react";

/**
 * Shown when a content collection has nothing published yet.
 *
 * The studio owns every collection, so a section can legitimately be empty.
 * Rather than filling the page with placeholder work, the section explains
 * what is happening and points visitors at the owner.
 */
export function ContentEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border/70 bg-card/40 px-6 py-10 text-center sm:py-12">
      <p className="text-sm font-semibold text-foreground dark:text-white">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
