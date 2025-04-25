"use client";

import { useState, useEffect, useCallback } from "react";
import { useSupabase } from "./use-supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { Listing } from "@/types/listing";
import { debounce } from "@/utils/function";

interface SearchFilters {
  query?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "newest" | "price_asc" | "price_desc";
}

export function useSearch(initialFilters: SearchFilters = {}) {
  const supabase = useSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL search params
  const [filters, setFilters] = useState<SearchFilters>(() => {
    const query = searchParams.get("query") || initialFilters.query || "";
    const category =
      searchParams.get("category") || initialFilters.category || "";
    const location =
      searchParams.get("location") || initialFilters.location || "";
    const minPrice = searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : initialFilters.minPrice;
    const maxPrice = searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : initialFilters.maxPrice;
    const sortBy =
      (searchParams.get("sortBy") as SearchFilters["sortBy"]) ||
      initialFilters.sortBy ||
      "newest";

    return { query, category, location, minPrice, maxPrice, sortBy };
  });

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.query) params.set("query", filters.query);
    if (filters.category) params.set("category", filters.category);
    if (filters.location) params.set("location", filters.location);
    if (filters.minPrice !== undefined)
      params.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice !== undefined)
      params.set("maxPrice", filters.maxPrice.toString());
    if (filters.sortBy) params.set("sortBy", filters.sortBy);

    const queryString = params.toString();
    const url = queryString ? `/?${queryString}` : "/";

    // Update URL without refreshing the page
    router.push(url, { scroll: false });
  }, [filters, router]);

  // Fetch listings when filters change
  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("listings")
        .select("*, users!inner(*)", { count: "exact" });

      // Apply filters
      if (filters.query) {
        query = query.ilike("title", `%${filters.query}%`);
      }

      if (filters.category) {
        query = query.eq("category", filters.category);
      }

      if (filters.location) {
        query = query.eq("location", filters.location);
      }

      if (filters.minPrice !== undefined) {
        query = query.gte("price", filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        query = query.lte("price", filters.maxPrice);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        case "price_asc":
          query = query.order("price", { ascending: true });
          break;
        case "price_desc":
          query = query.order("price", { ascending: false });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      setListings(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to fetch listings")
      );
    } finally {
      setLoading(false);
    }
  }, [supabase, filters]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Debounced function for updating search query
  const debouncedSearch = useCallback((query: string) => {
    const debouncedFn = debounce((q: string) => {
      setFilters((prev) => ({ ...prev, query: q }));
    }, 300);
    debouncedFn(query);
  }, []);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const updateSearchQuery = (query: string) => {
    debouncedSearch(query);
  };

  const clearFilters = () => {
    setFilters({});
  };

  return {
    filters,
    listings,
    loading,
    error,
    totalCount,
    updateFilters,
    updateSearchQuery,
    clearFilters,
    refreshListings: fetchListings,
  };
}
