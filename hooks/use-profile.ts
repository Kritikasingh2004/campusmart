"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/utils/supabase/client";
import { useFormSubmit } from "./use-form-submit";
import { toast } from "sonner";
import { User } from "@/types/user";
import {
  resizeImage,
  compressImage,
  blobToFile,
  deleteImageFromStorage,
} from "@/utils/image";

export function useProfile() {
  const { user } = useAuth();
  const supabase = createClient();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { handleSubmit, isSubmitting, error } = useFormSubmit<User>();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }

        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, supabase]);

  const createProfile = async (
    profileData: Omit<User, "id" | "created_at">
  ) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    return handleSubmit(
      async () => {
        const newProfile = {
          ...profileData,
          id: user.id,
        };

        const { data, error } = await supabase
          .from("users")
          .insert([newProfile])
          .select()
          .single();

        if (error) {
          throw error;
        }

        setProfile(data);
        return data;
      },
      {
        successMessage: "Profile created successfully",
        errorMessage: "Failed to create profile",
      }
    );
  };

  const updateProfile = async (profileData: Partial<User>) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    return handleSubmit(
      async () => {
        const { data, error } = await supabase
          .from("users")
          .update(profileData)
          .eq("id", user.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setProfile(data);
        return data;
      },
      {
        successMessage: "Profile updated successfully",
        errorMessage: "Failed to update profile",
      }
    );
  };

  const uploadAvatar = async (file: File) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    return handleSubmit(
      async () => {
        // First, get the current user profile to check for existing avatar
        const { data: currentProfile, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        let oldAvatarPath: string | null = null;

        // Extract the old avatar path if it exists
        if (currentProfile?.avatar_url) {
          try {
            console.log(
              "Extracting path from old avatar URL:",
              currentProfile.avatar_url
            );

            const url = new URL(currentProfile.avatar_url);
            const fullPath = url.pathname;
            console.log("Full URL path:", fullPath);

            // Different extraction methods to handle various URL formats
            // Method 1: Extract using storage path pattern
            if (fullPath.includes("/storage/v1/object/public/avatars/")) {
              oldAvatarPath = fullPath.split(
                "/storage/v1/object/public/avatars/"
              )[1];
              console.log("Method 1 extracted path:", oldAvatarPath);
            }
            // Method 2: Extract using bucket name
            else if (fullPath.includes("/avatars/")) {
              const pathParts = fullPath.split("/");
              const avatarsIndex = pathParts.indexOf("avatars");

              if (avatarsIndex !== -1 && avatarsIndex < pathParts.length - 1) {
                oldAvatarPath = pathParts.slice(avatarsIndex + 1).join("/");
                console.log("Method 2 extracted path:", oldAvatarPath);
              }
            }
            // Method 3: Just use the filename if we can extract it
            else {
              oldAvatarPath = fullPath.split("/").pop() || "";
              console.log("Method 3 extracted path:", oldAvatarPath);
            }
          } catch (error) {
            console.warn("Could not parse old avatar URL:", error);
          }
        }

        // Process the image: resize, crop (already done by AvatarUpload), and compress
        const resizedImage = await resizeImage(file, 400, 400);

        // Convert File to Blob for compression
        const imageBlob = await resizedImage
          .arrayBuffer()
          .then((buffer) => new Blob([buffer], { type: resizedImage.type }));

        // Compress the image
        const compressedBlob = await compressImage(imageBlob, 0.5, 400);

        // Convert back to File for upload
        const processedImage = blobToFile(compressedBlob, file.name);

        // Upload the file to Supabase Storage
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
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
          .from("avatars")
          .getPublicUrl(filePath);

        // Update the user profile with the new avatar URL
        const { data, error } = await supabase
          .from("users")
          .update({ avatar_url: publicURL.publicUrl })
          .eq("id", user.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        // Delete the old avatar if it exists
        if (currentProfile?.avatar_url) {
          // Use the utility function to delete the old avatar
          await deleteImageFromStorage(
            supabase,
            "avatars",
            currentProfile.avatar_url
          );
        }

        setProfile(data);
        return data;
      },
      {
        successMessage: "Avatar uploaded successfully",
        errorMessage: "Failed to upload avatar",
      }
    );
  };

  return {
    profile,
    loading,
    isSubmitting,
    error,
    createProfile,
    updateProfile,
    uploadAvatar,
  };
}
