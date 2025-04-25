"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileForm } from "@/components/profile/profile-form";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function CreateProfilePage() {
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
