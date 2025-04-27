import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileClient } from "@/components/profile/profile-client";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();

  // Get user and redirect if not authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Fetch user profile data
  const { data: profile, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Container className="py-8">
            <PageHeader
              title="My Profile"
              description="View and update your profile information"
            />

            <div className="mt-8">
              {!profile ? (
                <div className="space-y-4 max-w-2xl mx-auto">
                  <Skeleton className="h-32 w-32 rounded-full mx-auto" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <ProfileClient initialProfile={profile} />
              )}
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    </AuthGuard>
  );
}
