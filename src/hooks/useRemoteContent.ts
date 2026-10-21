import { useEffect, useRef, useState } from "react";
import { listPublishedContent, type ContentKind, type RemoteContent } from "../lib/content";

/** Hard deadline for a content section, so a slow network cannot spin forever. */
const CONTENT_DEADLINE_MS = 10000;

/**
 * Loads published content for a collection from Appwrite.
 *
 * The public site always keeps working: when the collection is empty or
 * Appwrite is unreachable the caller falls back to the bundled content in
 * `src/data/portfolio.ts`.
 */
export function useRemoteContent<T>(
  kind: ContentKind,
  map: (item: RemoteContent) => T | null,
): { items: T[]; loading: boolean; available: boolean } {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const mapper = useRef(map);
  mapper.current = map;

  useEffect(() => {
    let active = true;
    setLoading(true);

    // A section must never spin forever: whatever happens to the request, the
    // loading state ends and the section falls back to its empty state.
    const deadline = setTimeout(() => {
      if (!active) return;
      setItems([]);
      setLoading(false);
    }, CONTENT_DEADLINE_MS);

    listPublishedContent(kind)
      .then((documents) => {
        if (!active) return;
        const mapped: T[] = [];
        for (const document of documents) {
          const value = mapper.current(document);
          if (value) mapped.push(value);
        }
        setItems(mapped);
      })
      .catch(() => {
        if (!active) return;
        setItems([]);
      })
      .finally(() => {
        if (!active) return;
        clearTimeout(deadline);
        setLoading(false);
      });

    return () => {
      active = false;
      clearTimeout(deadline);
    };
  }, [kind]);

  return { items, loading, available: items.length > 0 };
}
