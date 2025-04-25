"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileForm } from "@/components/profile/profile-form";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditProfilePage() {
  const { profile, loading } = useUser();

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Container className="py-8">
            <PageHeader
              title="Edit Profile"
              description="Update your profile information"
            />

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
                <ProfileForm profile={profile} isEditMode={true} />
              )}
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    </AuthGuard>
  );
}
