"use client";

import { Suspense } from "react";
import { HomeContent } from "@/components/home/home-content";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { HeroSectionSkeleton } from "@/components/home/hero-section-skeleton";
import { ListingsSkeleton } from "@/components/home/listings-skeleton";

// Loading fallback component that mimics the structure of HomeContent
function HomeLoadingFallback() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1" id="main-content" aria-label="Main content">
        <HeroSectionSkeleton />

        <Container className="py-6">
          <div className="max-w-3xl mx-auto">
            <div className="h-10 bg-muted rounded-md animate-pulse" />
          </div>
        </Container>

        <div id="browse">
          <Container className="py-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
                <div className="space-y-4">
                  <div className="h-10 bg-muted rounded-md animate-pulse" />
                  <div className="h-40 bg-muted rounded-md animate-pulse" />
                  <div className="h-32 bg-muted rounded-md animate-pulse" />
                </div>
              </div>
              <div className="flex-1">
                <ListingsSkeleton />
              </div>
            </div>
          </Container>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeLoadingFallback />}>
      <HomeContent />
    </Suspense>
  );
}
