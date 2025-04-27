"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/utils/supabase/client";
import { useFormSubmit } from "./use-form-submit";
import { toast } from "sonner";
import { User } from "@/types/user";

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
        // Upload the file to Supabase Storage
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, file);

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
