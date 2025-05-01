"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Listing } from "@/types/listing";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export function useListingsFilter() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const searchParams = useSearchParams();

  // Apply filters based on URL parameters
  const applyFilters = useCallback(
    (allListings: Listing[]) => {
      const query = searchParams.get("query") || "";
      const category = searchParams.get("category") || "all";
      const location = searchParams.get("location") || "all";
      const minPrice = searchParams.get("minPrice") || "";
      const maxPrice = searchParams.get("maxPrice") || "";
      const sortBy = searchParams.get("sortBy") || "newest";

      let results = [...allListings];

      // Apply search query
      if (query) {
        const searchTerms = query.toLowerCase().split(" ");
        results = results.filter((listing) =>
          searchTerms.some(
            (term) =>
              listing.title.toLowerCase().includes(term) ||
              listing.category.toLowerCase().includes(term) ||
              listing.description.toLowerCase().includes(term)
          )
        );
      }

      // Apply category filter
      if (category && category !== "all") {
        results = results.filter(
          (listing) => listing.category.toLowerCase() === category.toLowerCase()
        );
      }

      // Apply location filter
      if (location && location !== "all") {
        results = results.filter(
          (listing) => listing.location.toLowerCase() === location.toLowerCase()
        );
      }

      // Apply price range filters
      if (minPrice) {
        const min = parseFloat(minPrice);
        if (!isNaN(min)) {
          results = results.filter((listing) => listing.price >= min);
        }
      }

      if (maxPrice) {
        const max = parseFloat(maxPrice);
        if (!isNaN(max)) {
          results = results.filter((listing) => listing.price <= max);
        }
      }

      // Apply sorting
      switch (sortBy) {
        case "price_asc":
          results.sort((a, b) => a.price - b.price);
          break;
        case "price_desc":
          results.sort((a, b) => b.price - a.price);
          break;
        case "newest":
        default:
          results.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
          break;
      }

      setFilteredListings(results);
    },
    [searchParams]
  );

  // Fetch listings from Supabase (only once)
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("listings")
          .select("*, users(*)")
          .eq("is_sold", false) // Only fetch listings that are not sold
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setListings(data || []);
      } catch (err) {
        console.error("Error fetching listings:", err);
        toast.error("Failed to load listings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [supabase]);

  // Apply filters whenever search parameters change
  useEffect(() => {
    if (listings.length > 0) {
      applyFilters(listings);
    }
  }, [listings, searchParams, applyFilters]);

  // Handle filter changes (for manual filter updates)
  const handleFilterChange = useCallback(() => {
    // This is now primarily used for programmatic filter changes
    // Most filtering happens automatically via the searchParams useEffect
    if (listings.length > 0) {
      applyFilters(listings);
    }
  }, [listings, applyFilters]);

  return {
    isLoading,
    listings,
    filteredListings,
    handleFilterChange,
  };
}
