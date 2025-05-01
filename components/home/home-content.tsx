"use client";

import { useSearchParams } from "next/navigation";
import { useListingsFilter } from "@/hooks/use-listings-filter";
import { groupBy } from "@/utils/array";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { EnhancedFilters } from "@/components/listings/enhanced-filters";
import { HeroSection } from "@/components/home/hero-section";
import { HeroSectionSkeleton } from "@/components/home/hero-section-skeleton";
import { NoListingsFound } from "@/components/home/no-listings-found";
import { ListingsSection } from "@/components/home/listings-section";
import { CategorySection } from "@/components/home/category-section";
import { ListingsSkeleton } from "@/components/home/listings-skeleton";

export function HomeContent() {
  const searchParams = useSearchParams();
  const { isLoading, filteredListings, handleFilterChange } = useListingsFilter();

  // Group listings by category for display
  const listingsByCategory = groupBy(filteredListings, "category");

  // Check if we have any listings matching the filters
  const noListings = filteredListings.length === 0;

  // Loading skeleton UI
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <HeroSectionSkeleton />

          <div id="browse">
            <Container className="py-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar Filters Skeleton */}
                <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
                  <div className="h-[500px] w-full rounded-xl bg-accent animate-pulse" />
                </div>

                {/* Main Content Skeleton */}
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1" id="main-content" aria-label="Main content">
        <HeroSection />

        <div id="browse">
          <Container className="py-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Sidebar Filters */}
              <div
                className="w-full md:w-64 lg:w-72 flex-shrink-0 md:sticky md:top-20 md:self-start"
                aria-label="Filter options"
              >
                <EnhancedFilters
                  onFilterChange={handleFilterChange}
                  layout="sidebar"
                />
              </div>

              {/* Main Content */}
              <div className="flex-1">
                {noListings ? (
                  <NoListingsFound />
                ) : (
                  <div className="space-y-12">
                    <ListingsSection 
                      listings={filteredListings} 
                      sortBy={searchParams.get("sortBy")} 
                    />
                    <CategorySection categories={listingsByCategory} />
                  </div>
                )}
              </div>
            </div>
          </Container>
        </div>
      </main>
      <Footer />
    </div>
  );
}
