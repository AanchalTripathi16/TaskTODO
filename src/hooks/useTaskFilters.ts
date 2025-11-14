"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

interface UseTaskFiltersProps {
  initialQuery: string;
  initialPage: number;
  pageSize: number;
}

export const useTaskFilters = ({
  initialQuery,
  initialPage,
  pageSize,
}: UseTaskFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const commit = useCallback(
    (query: string, page: number) => {
      const params = new URLSearchParams(
        searchParams ? searchParams.toString() : ""
      );

      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }

      params.set("page", String(page));
      params.set("pageSize", String(pageSize));

      const nextUrl = `${pathname}?${params.toString()}`;

      startTransition(() => {
        router.push(nextUrl);
        router.refresh();
      });
    },
    [pathname, router, searchParams, pageSize, startTransition]
  );

  const handleSearch = useCallback(
    (query: string) => {
      setQuery(query);
      commit(query, 1);
    },
    [commit]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      commit(query, page);
    },
    [commit, query]
  );

  return {
    query,
    page: initialPage,
    pageSize,
    handleSearch,
    handlePageChange,
    isPending,
  };
};
