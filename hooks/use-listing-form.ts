"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/utils/supabase/client";
import { useFormSubmit } from "./use-form-submit";
import { Listing } from "@/types/listing";
import {
  resizeImage,
  compressImage,
  blobToFile,
  deleteImageFromStorage,
} from "@/utils/image";

export function useListingForm(listingId?: string) {
  const { user } = useAuth();
  const supabase = createClient();
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
          // Process the image: resize, crop (already done by ImageUpload), and compress
          const resizedImage = await resizeImage(image, 1200, 1200);

          // Convert File to Blob for compression
          const imageBlob = await resizedImage
            .arrayBuffer()
            .then((buffer) => new Blob([buffer], { type: resizedImage.type }));

          // Compress the image
          const compressedBlob = await compressImage(imageBlob, 0.8, 1200);

          // Convert back to File for upload
          const processedImage = blobToFile(compressedBlob, image.name);

          // Upload to Supabase Storage
          const fileExt = image.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 15)}.${fileExt}`;
          const filePath = `listings/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("listings")
            .upload(filePath, processedImage, {
              upsert: false,
              metadata: {
                owner: user.id, // Set the owner metadata for RLS policies
              },
            });

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
          is_sold: false,
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
        // First, get the current listing to check for existing image
        const { data: currentListing, error: fetchError } = await supabase
          .from("listings")
          .select("*")
          .eq("id", listingId)
          .eq("user_id", user.id) // Ensure the user owns the listing
          .single();

        if (fetchError) {
          throw fetchError;
        }

        const updateData: Record<string, unknown> = { ...listingData };
        let oldImagePath: string | null = null;

        // Extract the old image path if it exists
        if (currentListing?.image_url) {
          try {
            console.log(
              "Extracting path from old image URL:",
              currentListing.image_url
            );

            const url = new URL(currentListing.image_url);
            const fullPath = url.pathname;
            console.log("Full URL path:", fullPath);

            // Different extraction methods to handle various URL formats
            // Method 1: Extract using storage path pattern
            if (fullPath.includes("/storage/v1/object/public/listings/")) {
              oldImagePath = fullPath.split(
                "/storage/v1/object/public/listings/"
              )[1];
              console.log("Method 1 extracted path:", oldImagePath);
            }
            // Method 2: Extract using bucket name
            else if (fullPath.includes("/listings/")) {
              const pathParts = fullPath.split("/");
              const listingsIndex = pathParts.indexOf("listings");

              if (
                listingsIndex !== -1 &&
                listingsIndex < pathParts.length - 1
              ) {
                oldImagePath = pathParts.slice(listingsIndex + 1).join("/");
                console.log("Method 2 extracted path:", oldImagePath);
              }
            }
            // Method 3: Just use the filename if we can extract it
            else {
              oldImagePath = fullPath.split("/").pop() || "";
              console.log("Method 3 extracted path:", oldImagePath);
            }
          } catch (error) {
            console.warn("Could not parse old image URL:", error);
          }
        }

        // Upload image if provided
        if (image) {
          // Process the image: resize, crop (already done by ImageUpload), and compress
          const resizedImage = await resizeImage(image, 1200, 1200);

          // Convert File to Blob for compression
          const imageBlob = await resizedImage
            .arrayBuffer()
            .then((buffer) => new Blob([buffer], { type: resizedImage.type }));

          // Compress the image
          const compressedBlob = await compressImage(imageBlob, 0.8, 1200);

          // Convert back to File for upload
          const processedImage = blobToFile(compressedBlob, image.name);

          // Upload to Supabase Storage
          const fileExt = image.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 15)}.${fileExt}`;
          const filePath = `listings/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("listings")
            .upload(filePath, processedImage, {
              upsert: false,
              metadata: {
                owner: user.id, // Set the owner metadata for RLS policies
              },
            });

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

        // Delete the old image if a new one was uploaded
        if (currentListing?.image_url && image) {
          // Use the utility function to delete the old image
          await deleteImageFromStorage(
            supabase,
            "listings",
            currentListing.image_url
          );
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

  const markAsSold = async () => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    if (!listingId) {
      throw new Error("Listing ID is required");
    }

    return handleSubmit(
      async () => {
        // Get the listing first to check ownership
        const { error: fetchError } = await supabase
          .from("listings")
          .select("*")
          .eq("id", listingId)
          .eq("user_id", user.id) // Ensure the user owns the listing
          .single();

        if (fetchError) {
          throw fetchError;
        }

        // Update the listing to mark as sold
        const { data, error } = await supabase
          .from("listings")
          .update({ is_sold: true })
          .eq("id", listingId)
          .eq("user_id", user.id) // Ensure the user owns the listing
          .select("*, users(*)") // Include user data for display
          .single();

        if (error) {
          throw error;
        }

        setListing(data);
        return data;
      },
      {
        successMessage: "Listing marked as sold",
        errorMessage: "Failed to mark listing as sold",
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
          // Use the utility function to delete the image
          await deleteImageFromStorage(supabase, "listings", listing.image_url);
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
    markAsSold,
  };
}
