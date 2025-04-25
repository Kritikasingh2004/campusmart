import { useState, useEffect, useCallback } from "react";
import { useSupabase } from "./use-supabase";
import { Listing } from "@/types/listing";
import { toast } from "sonner";

export function useListings(options?: {
  userId?: string;
  category?: string;
  location?: string;
}) {
  const supabase = useSupabase();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("listings")
        .select("*, users(*)")
        .order("created_at", { ascending: false });

      if (options?.userId) {
        query = query.eq("user_id", options.userId);
      }

      if (options?.category) {
        query = query.eq("category", options.category);
      }

      if (options?.location) {
        query = query.eq("location", options.location);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setListings(data || []);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to fetch listings")
      );
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  }, [supabase, options?.userId, options?.category, options?.location]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const createListing = async (listing: Omit<Listing, "id" | "created_at">) => {
    try {
      const { data, error } = await supabase
        .from("listings")
        .insert(listing)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast.success("Listing created successfully");
      await fetchListings(); // Refresh listings
      return data;
    } catch (err) {
      console.error("Error creating listing:", err);
      toast.error("Failed to create listing");
      throw err;
    }
  };

  const updateListing = async (id: string, updates: Partial<Listing>) => {
    try {
      const { data, error } = await supabase
        .from("listings")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast.success("Listing updated successfully");
      await fetchListings(); // Refresh listings
      return data;
    } catch (err) {
      console.error("Error updating listing:", err);
      toast.error("Failed to update listing");
      throw err;
    }
  };

  const deleteListing = async (id: string) => {
    try {
      const { error } = await supabase.from("listings").delete().eq("id", id);

      if (error) {
        throw error;
      }

      toast.success("Listing deleted successfully");
      await fetchListings(); // Refresh listings
      return true;
    } catch (err) {
      console.error("Error deleting listing:", err);
      toast.error("Failed to delete listing");
      throw err;
    }
  };

  return {
    listings,
    loading,
    error,
    fetchListings,
    createListing,
    updateListing,
    deleteListing,
  };
}
