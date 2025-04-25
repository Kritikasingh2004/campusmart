"use client";

import { useState, useEffect } from "react";
import { useUser } from "./use-user";
import { useSupabase } from "./use-supabase";
import { useFormSubmit } from "./use-form-submit";
import { Listing } from "@/types/listing";
import { resizeImage } from "@/utils/image";

export function useListingForm(listingId?: string) {
  const { user } = useUser();
  const supabase = useSupabase();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(listingId ? true : false);
  const { handleSubmit, isSubmitting, error } = useFormSubmit<Listing>();

  // Fetch listing if ID is provided
  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("id", listingId)
          .single();

        if (error) {
          throw error;
        }

        setListing(data);
      } catch (error) {
        console.error("Error fetching listing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId, supabase]);

  const createListing = async (
    listingData: Omit<Listing, "id" | "user_id" | "created_at" | "image_url">,
    image?: File
  ) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    return handleSubmit(
      async () => {
        let imageUrl = "";

        // Upload image if provided
        if (image) {
          // Resize image before uploading
          const resizedImage = await resizeImage(image, 1200, 1200);

          // Upload to Supabase Storage
          const fileExt = image.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 15)}.${fileExt}`;
          const filePath = `listings/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("listings")
            .upload(filePath, resizedImage);

          if (uploadError) {
            throw uploadError;
          }

          // Get the public URL
          const { data: publicURL } = supabase.storage
            .from("listings")
            .getPublicUrl(filePath);

          imageUrl = publicURL.publicUrl;
        }

        // Create the listing
        const newListing = {
          ...listingData,
          user_id: user.id,
          image_url: imageUrl,
        };

        const { data, error } = await supabase
          .from("listings")
          .insert([newListing])
          .select()
          .single();

        if (error) {
          throw error;
        }

        setListing(data);
        return data;
      },
      {
        successMessage: "Listing created successfully",
        errorMessage: "Failed to create listing",
        redirectTo: "/dashboard",
      }
    );
  };

  const updateListing = async (
    listingData: Partial<Omit<Listing, "id" | "user_id" | "created_at">>,
    image?: File
  ) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    if (!listingId) {
      throw new Error("Listing ID is required");
    }

    return handleSubmit(
      async () => {
        const updateData: Record<string, unknown> = { ...listingData };

        // Upload image if provided
        if (image) {
          // Resize image before uploading
          const resizedImage = await resizeImage(image, 1200, 1200);

          // Upload to Supabase Storage
          const fileExt = image.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 15)}.${fileExt}`;
          const filePath = `listings/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("listings")
            .upload(filePath, resizedImage);

          if (uploadError) {
            throw uploadError;
          }

          // Get the public URL
          const { data: publicURL } = supabase.storage
            .from("listings")
            .getPublicUrl(filePath);

          updateData.image_url = publicURL.publicUrl;
        }

        // Update the listing
        const { data, error } = await supabase
          .from("listings")
          .update(updateData)
          .eq("id", listingId)
          .eq("user_id", user.id) // Ensure the user owns the listing
          .select()
          .single();

        if (error) {
          throw error;
        }

        setListing(data);
        return data;
      },
      {
        successMessage: "Listing updated successfully",
        errorMessage: "Failed to update listing",
        redirectTo: "/dashboard",
      }
    );
  };

  const deleteListing = async () => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    if (!listingId) {
      throw new Error("Listing ID is required");
    }

    return handleSubmit(
      async () => {
        // Get the listing first to check ownership and get the image URL
        const { data: listing, error: fetchError } = await supabase
          .from("listings")
          .select("*")
          .eq("id", listingId)
          .eq("user_id", user.id) // Ensure the user owns the listing
          .single();

        if (fetchError) {
          throw fetchError;
        }

        // Delete the listing
        const { error } = await supabase
          .from("listings")
          .delete()
          .eq("id", listingId)
          .eq("user_id", user.id);

        if (error) {
          throw error;
        }

        // Delete the image if it exists
        if (listing.image_url) {
          // Extract the file path from the URL
          const url = new URL(listing.image_url);
          const pathParts = url.pathname.split("/");
          const filePath = pathParts
            .slice(pathParts.indexOf("listings"))
            .join("/");

          if (filePath) {
            await supabase.storage.from("listings").remove([filePath]);
            // We don't throw on image deletion error as the listing is already deleted
          }
        }

        setListing(null);
        return listing;
      },
      {
        successMessage: "Listing deleted successfully",
        errorMessage: "Failed to delete listing",
        redirectTo: "/dashboard",
      }
    );
  };

  return {
    listing,
    loading,
    isSubmitting,
    error,
    createListing,
    updateListing,
    deleteListing,
  };
}
