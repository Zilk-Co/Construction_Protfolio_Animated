import { useMemo } from "react";
import { useGetPageContent } from "@workspace/api-client-react";
import type { PageContentItem } from "@workspace/api-zod";

export type PageContentMap = Map<string, string> & { __items?: PageContentItem[] };

/**
 * Loads all page content once (one query) and exposes a fast lookup for the
 * given page. Falls back to the provided default value when no saved value
 * exists for the key.
 */
export function usePageContent(page: string) {
  const { data, isLoading, error } = useGetPageContent();

  const lookup = useMemo(() => {
    const map: PageContentMap = new Map();
    const pageData = data?.pages?.find((p) => p.page === page);
    if (pageData) {
      for (const item of pageData.items) {
        map.set(item.key, item.value);
      }
      map.__items = pageData.items;
    }
    return map;
  }, [data, page]);

  function get(key: string, fallback: string): string {
    const v = lookup.get(key);
    return v !== undefined && v !== null && v !== "" ? v : fallback;
  }

  function getOrEmpty(key: string): string {
    return lookup.get(key) ?? "";
  }

  function has(key: string): boolean {
    return lookup.has(key) && lookup.get(key) !== "";
  }

  return { get, getOrEmpty, has, isLoading, error, items: lookup.__items ?? [] };
}

/**
 * Static helper for places where we already have the data hydrated.
 */
export function buildPageContentMap(items: PageContentItem[]): PageContentMap {
  const map: PageContentMap = new Map();
  for (const item of items) {
    map.set(item.key, item.value);
  }
  map.__items = items;
  return map;
}
