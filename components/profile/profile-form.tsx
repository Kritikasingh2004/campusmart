"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProfile } from "@/hooks/use-profile";
import { User } from "@/types/user";
import { AvatarUpload } from "./avatar-upload";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define the form schema with Zod
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location is required.",
  }),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, {
      message: "Phone number must be 10 digits.",
    })
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(500, {
      message: "Bio must be less than 500 characters.",
    })
    .optional(),
});

// Infer the type from the schema
type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  profile?: User | null;
  isEditMode?: boolean;
  readOnly?: boolean;
  onEditToggle?: () => void;
  onProfileUpdate?: (updatedProfile: User) => void;
}

export function ProfileForm({
  profile: profileProp,
  isEditMode = false,
  readOnly = false,
  onEditToggle,
  onProfileUpdate,
}: ProfileFormProps) {
  const {
    profile: userProfile,
    isSubmitting,
    createProfile,
    updateProfile,
    uploadAvatar,
  } = useProfile();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Get the user data from props or context
  const userData = profileProp || userProfile;

  // Initialize the form with react-hook-form and values from the database
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userData?.name || "",
      location: userData?.location || "",
      phone: userData?.phone || "",
      bio: userData?.bio || "",
    },
  });

  // Set avatar preview from user data
  useEffect(() => {
    if (userData?.avatar_url) {
      setAvatarPreview(userData.avatar_url);
    }
  }, [userData]);

  // Handle form submission
  const onSubmit = async (data: ProfileFormValues): Promise<void> => {
    try {
      let updatedProfileData;

      // First update the profile data
      if (isEditMode) {
        updatedProfileData = await updateProfile(data);
      } else {
        updatedProfileData = await createProfile(data);
      }

      // Handle avatar upload if a file was selected
      if (avatarFile) {
        // Use the uploadAvatar function we destructured from useProfile hook
        updatedProfileData = await uploadAvatar(avatarFile);
      }

      // Call the onProfileUpdate callback if provided
      if (onProfileUpdate && updatedProfileData) {
        onProfileUpdate(updatedProfileData);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  // Handle avatar change
  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    if (file) {
      const preview = URL.createObjectURL(file);
      setAvatarPreview(preview);
    } else {
      // If file is null (avatar removed), reset to the original avatar from profile
      const userData = profileProp || userProfile;
      setAvatarPreview(userData?.avatar_url || null);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {readOnly
            ? "My Profile"
            : isEditMode
            ? "Edit Profile"
            : "Create Profile"}
        </CardTitle>
        <CardDescription>
          {readOnly
            ? "Your profile information"
            : isEditMode
            ? "Update your profile information"
            : "Tell us a bit about yourself to get started"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-center mb-6">
              <AvatarUpload
                initialImage={avatarPreview}
                onImageChange={handleAvatarChange}
                readOnly={readOnly}
              />
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your full name"
                      {...field}
                      disabled={readOnly || isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    This is how you&apos;ll appear to others on the platform.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your campus location"
                      {...field}
                      disabled={readOnly || isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    This helps buyers know where to meet you.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="10-digit phone number"
                      {...field}
                      disabled={readOnly || isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be visible to buyers of your items.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell others a bit about yourself"
                      className="resize-none"
                      {...field}
                      disabled={readOnly || isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    A short description that will appear on your profile.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!readOnly && (
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update Profile"
                  : "Create Profile"}
              </Button>
            )}

            {isEditMode && onEditToggle && (
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={() => {
                  // Reset the form to the original values when canceling
                  form.reset({
                    name: userData?.name || "",
                    location: userData?.location || "",
                    phone: userData?.phone || "",
                    bio: userData?.bio || "",
                  });

                  // Reset avatar preview
                  setAvatarPreview(userData?.avatar_url || null);
                  setAvatarFile(null);

                  // Toggle back to read-only mode
                  if (onEditToggle) onEditToggle();
                }}
              >
                Cancel
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
