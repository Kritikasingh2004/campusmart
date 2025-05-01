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
import { SearchAutocomplete } from "@/components/search/search-autocomplete";

export function HomeContent() {
  const searchParams = useSearchParams();
  const { isLoading, filteredListings, handleFilterChange } =
    useListingsFilter();

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

  // Handle search from the SearchAutocomplete component
  // This is now a lightweight function since filtering is handled by the useEffect in useListingsFilter
  // We keep it for potential future enhancements and to maintain the component API
  const handleSearch = (query: string) => {
    // Log the query for debugging purposes
    console.log("Search query:", query);
    // No need to call handleFilterChange() as the URL change will trigger the useEffect in useListingsFilter
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1" id="main-content" aria-label="Main content">
        <HeroSection />

        {/* Search Bar with Autocomplete */}
        <Container className="py-6">
          <div className="max-w-3xl mx-auto">
            <SearchAutocomplete onSearch={handleSearch} />
          </div>
        </Container>

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
