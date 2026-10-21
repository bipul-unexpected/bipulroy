import { useEffect, useRef, useState } from "react";
import { listPublishedContent, type ContentKind, type RemoteContent } from "../lib/content";

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
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [kind]);

  return { items, loading, available: items.length > 0 };
}
