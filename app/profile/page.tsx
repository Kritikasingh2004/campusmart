"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileForm } from "@/components/profile/profile-form";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useAuth } from "@/contexts/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }

        console.log("Fetched profile data:", data);
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const toggleEditMode = () => {
    // If we're canceling edit mode, we don't need to do anything special
    // If we're entering edit mode, we're already showing the current profile data
    setIsEditMode(!isEditMode);
  };

  const handleProfileUpdate = (updatedProfile: User) => {
    setProfile(updatedProfile);
    setIsEditMode(false);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Container className="py-8">
            <div className="flex justify-between items-center">
              <PageHeader
                title="My Profile"
                description={
                  isEditMode
                    ? "Update your profile information"
                    : "View your profile information"
                }
              />
              {!isEditMode && (
                <Button
                  onClick={toggleEditMode}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>

            <div className="mt-8">
              {loading ? (
                <div className="space-y-4 max-w-2xl mx-auto">
                  <Skeleton className="h-32 w-32 rounded-full mx-auto" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <ProfileForm
                  profile={profile}
                  isEditMode={isEditMode}
                  onEditToggle={toggleEditMode}
                  onProfileUpdate={handleProfileUpdate}
                  readOnly={!isEditMode}
                />
              )}
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    </AuthGuard>
  );
}
