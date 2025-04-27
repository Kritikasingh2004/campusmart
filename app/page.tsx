"use client";

import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { EnhancedFilters } from "@/components/listings/enhanced-filters";
import { ProductCard } from "@/components/listings/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { NavigationLink } from "@/components/ui/navigation-link";
import { useSearchParams } from "next/navigation";
import { useListingsFilter } from "@/hooks/use-listings-filter";
import { groupBy } from "@/utils/array";

function HomeContent() {
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
          <Container className="py-8">
            <div className="mb-8 max-w-3xl">
              <Skeleton className="h-10 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-6" />
              <Skeleton className="h-12 w-full" />
            </div>

            <div className="mt-8">
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="mt-8">
              <Skeleton className="h-8 w-1/3 mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-lg overflow-hidden border">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1" id="main-content" aria-label="Main content">
        <Container className="py-8">
          <div className="mb-8 max-w-3xl">
            <PageHeader
              title="Campus Marketplace"
              description="Buy and sell second-hand items on campus easily and safely."
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Filters */}
            <div
              className="w-full md:w-64 lg:w-72 flex-shrink-0"
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
                <div className="text-center py-16">
                  <h2 className="text-2xl font-semibold mb-2">
                    No Listings Found
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    No items match your current search criteria. Try adjusting
                    your filters or search query.
                  </p>
                  <Button
                    onClick={() => {
                      // Reset filters by navigating to the base URL
                      window.location.href = window.location.pathname;
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-12">
                  {/* Display listings sorted by active sort */}
                  <section aria-labelledby="listings-heading">
                    <h2
                      id="listings-heading"
                      className="text-2xl font-semibold mb-4"
                    >
                      {searchParams.get("sortBy") === "price_asc"
                        ? "Listings by Price (Low to High)"
                        : searchParams.get("sortBy") === "price_desc"
                        ? "Listings by Price (High to Low)"
                        : "Latest Listings"}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredListings.slice(0, 9).map((listing) => (
                        <ProductCard
                          key={listing.id}
                          id={listing.id}
                          title={listing.title}
                          price={listing.price}
                          imageUrl={listing.image_url}
                          location={listing.location}
                          category={listing.category}
                          createdAt={listing.created_at}
                        />
                      ))}
                    </div>
                  </section>

                  {/* Display listings grouped by category */}
                  {Object.keys(listingsByCategory).length > 1 && (
                    <section aria-labelledby="categories-heading">
                      <h2
                        id="categories-heading"
                        className="text-2xl font-semibold mb-4"
                      >
                        Listings by Category
                      </h2>
                      {Object.entries(listingsByCategory).map(
                        ([category, listings]) => (
                          <div key={category} className="mb-8">
                            <div className="flex items-center justify-between">
                              <h3
                                id={`category-${category.toLowerCase()}`}
                                className="text-xl font-medium mb-4"
                              >
                                {category}
                              </h3>
                              <NavigationLink
                                href={`/?category=${category.toLowerCase()}`}
                                className="text-sm text-primary hover:underline"
                                aria-labelledby={`category-${category.toLowerCase()}`}
                              >
                                View all in {category}
                              </NavigationLink>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                              {listings.slice(0, 3).map((listing) => (
                                <ProductCard
                                  key={listing.id}
                                  id={listing.id}
                                  title={listing.title}
                                  price={listing.price}
                                  imageUrl={listing.image_url}
                                  location={listing.location}
                                  category={listing.category}
                                  createdAt={listing.created_at}
                                />
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </section>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
