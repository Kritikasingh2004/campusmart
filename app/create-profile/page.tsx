"use client";

import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileForm } from "@/components/profile/profile-form";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Skeleton } from "@/components/ui/skeleton";

// Content component that will be wrapped in Suspense
function CreateProfileContent() {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Container className="py-8">
            <PageHeader
              title="Create Profile"
              description="Set up your profile to start buying and selling"
            />

            <div className="mt-8">
              <ProfileForm />
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    </AuthGuard>
  );
}

// Loading fallback component
function CreateProfileLoadingFallback() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Container className="py-8">
          <div className="space-y-2 mb-8">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <Skeleton className="h-32 w-32 rounded-full" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default function CreateProfilePage() {
  return (
    <Suspense fallback={<CreateProfileLoadingFallback />}>
      <CreateProfileContent />
    </Suspense>
  );
}
