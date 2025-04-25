"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ListingForm } from "@/components/listings/listing-form";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function UploadListingPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Container className="py-8">
            <PageHeader
              title="Create Listing"
              description="Add details about the item you want to sell"
            />

            <div className="mt-8">
              <ListingForm />
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    </AuthGuard>
  );
}
