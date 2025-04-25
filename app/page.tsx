"use client";

import { useState, useEffect, Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Filters } from "@/components/listings/filters";
import { ProductCard } from "@/components/listings/product-card";
import { SearchBar } from "@/components/listings/search-bar";
import { generatePlaceholderImage } from "@/utils/image";
import { sortBy, groupBy } from "@/utils/array";
import { capitalizeWords } from "@/utils/string";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Mock data for initial development
const MOCK_LISTINGS_RAW = [
  {
    id: "1",
    title: "calculus textbook",
    price: 450,
    imageUrl: "",
    location: "north campus",
    category: "books",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: "2",
    title: "study desk",
    price: 1200,
    imageUrl: "",
    location: "south campus",
    category: "furniture",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: "3",
    title: "scientific calculator",
    price: 800,
    imageUrl: "",
    location: "east campus",
    category: "electronics",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: "4",
    title: "laptop stand",
    price: 350,
    imageUrl: "",
    location: "west campus",
    category: "electronics",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
  {
    id: "5",
    title: "college hoodie",
    price: 600,
    imageUrl: "",
    location: "north campus",
    category: "clothing",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
  },
  {
    id: "6",
    title: "chemistry lab manual",
    price: 250,
    imageUrl: "",
    location: "south campus",
    category: "books",
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
  },
];

// Process the mock data using our utility functions
const MOCK_LISTINGS = MOCK_LISTINGS_RAW.map((listing) => ({
  ...listing,
  title: capitalizeWords(listing.title),
  location: capitalizeWords(listing.location),
  category: capitalizeWords(listing.category),
  imageUrl: generatePlaceholderImage(
    300,
    300,
    listing.title,
    "e2e8f0",
    "64748b"
  ),
}));

// Add description field to mock data
const MOCK_LISTINGS_WITH_DESCRIPTION = MOCK_LISTINGS.map((listing) => ({
  ...listing,
  description: `This is a ${listing.title.toLowerCase()} available for sale in ${
    listing.location
  }.`,
}));

function HomeContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [filteredListings, setFilteredListings] = useState(
    MOCK_LISTINGS_WITH_DESCRIPTION
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    category: "all",
    location: "all",
    sort: "newest",
  });
  const searchParams = useSearchParams();

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Apply URL search params on initial load
  useEffect(() => {
    const category = searchParams.get("category") || "all";
    const location = searchParams.get("location") || "all";
    const query = searchParams.get("query") || "";
    const sort = (searchParams.get("sortBy") as string) || activeFilters.sort;

    setSearchQuery(query);
    setActiveFilters((prev) => ({
      ...prev,
      category,
      location,
      sort,
    }));

    applyFilters(query, { category, location, sort });
  }, [searchParams, activeFilters.sort]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, activeFilters);
  };

  // Handle filter changes
  const handleFilterChange = (filters: {
    category?: string;
    location?: string;
    sort?: string;
  }) => {
    const newFilters = { ...activeFilters, ...filters };
    setActiveFilters(newFilters);
    applyFilters(searchQuery, newFilters);
  };

  // Apply filters to listings
  const applyFilters = (
    query: string,
    filters: {
      category: string;
      location: string;
      sort: string;
    }
  ) => {
    let results = [...MOCK_LISTINGS_WITH_DESCRIPTION];

    // Apply search query
    if (query) {
      const searchTerms = query.toLowerCase().split(" ");
      results = results.filter((listing) =>
        searchTerms.some(
          (term) =>
            listing.title.toLowerCase().includes(term) ||
            listing.category.toLowerCase().includes(term) ||
            listing.description.toLowerCase().includes(term)
        )
      );
    }

    // Apply category filter
    if (filters.category && filters.category !== "all") {
      results = results.filter(
        (listing) =>
          listing.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Apply location filter
    if (filters.location && filters.location !== "all") {
      results = results.filter(
        (listing) =>
          listing.location.toLowerCase() === filters.location.toLowerCase()
      );
    }

    // Apply sorting
    switch (filters.sort) {
      case "price_asc":
        results = sortBy(results, "price", "asc");
        break;
      case "price_desc":
        results = sortBy(results, "price", "desc");
        break;
      case "newest":
      default:
        results = sortBy(results, "createdAt", "desc");
        break;
    }

    setFilteredListings(results);
  };

  // Group listings by category for display
  const listingsByCategory = groupBy(filteredListings, "category");

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

  // Empty state when no listings match filters
  const noListings = filteredListings.length === 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1" id="main-content" aria-label="Main content">
        <Container className="py-8">
          <div className="mb-8 max-w-3xl">
            <PageHeader
              title="Campus Marketplace"
              description="Buy and sell second-hand items on campus easily and safely."
            >
              <div className="mt-4">
                <SearchBar
                  onSearch={handleSearch}
                  initialValue={searchQuery}
                  placeholder="Search for textbooks, furniture, electronics..."
                />
              </div>
            </PageHeader>
          </div>

          <div className="mt-8" aria-label="Filter options">
            <Filters
              onFilterChange={handleFilterChange}
              initialFilters={activeFilters}
            />
          </div>

          {noListings ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-2">No Listings Found</h2>
              <p className="text-muted-foreground mb-6">
                No items match your current search criteria. Try adjusting your
                filters or search query.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilters({
                    category: "all",
                    location: "all",
                    sort: "newest",
                  });
                  setFilteredListings(MOCK_LISTINGS_WITH_DESCRIPTION);
                }}
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <>
              {/* Display listings sorted by active sort */}
              <section aria-labelledby="listings-heading" className="mb-8">
                <h2
                  id="listings-heading"
                  className="text-2xl font-semibold mb-4"
                >
                  {activeFilters.sort === "price_asc"
                    ? "Listings by Price (Low to High)"
                    : activeFilters.sort === "price_desc"
                    ? "Listings by Price (High to Low)"
                    : "Latest Listings"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredListings.slice(0, 8).map((listing) => (
                    <ProductCard
                      key={listing.id}
                      id={listing.id}
                      title={listing.title}
                      price={listing.price}
                      imageUrl={listing.imageUrl}
                      location={listing.location}
                      category={listing.category}
                      createdAt={listing.createdAt}
                    />
                  ))}
                </div>
              </section>

              {/* Display listings grouped by category */}
              {Object.keys(listingsByCategory).length > 1 && (
                <section aria-labelledby="categories-heading" className="mt-12">
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
                          <Link
                            href={`/?category=${category.toLowerCase()}`}
                            className="text-sm text-primary hover:underline"
                            aria-labelledby={`category-${category.toLowerCase()}`}
                          >
                            View all in {category}
                          </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                          {listings.slice(0, 4).map((listing) => (
                            <ProductCard
                              key={listing.id}
                              id={listing.id}
                              title={listing.title}
                              price={listing.price}
                              imageUrl={listing.imageUrl}
                              location={listing.location}
                              category={listing.category}
                              createdAt={listing.createdAt}
                            />
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </section>
              )}
            </>
          )}
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
