"use client";

import { useState, useEffect, Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Filters } from "@/components/listings/filters";
import { ProductCard } from "@/components/listings/product-card";
import { SearchBar } from "@/components/listings/search-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { NavigationLink } from "@/components/ui/navigation-link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Listing } from "@/types/listing";
import { groupBy } from "@/utils/array";
import { toast } from "sonner";

function HomeContent() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    category: "all",
    location: "all",
    sort: "newest",
  });
  const searchParams = useSearchParams();

  // Fetch listings from Supabase
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("listings")
          .select("*, users(*)")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setListings(data || []);

        // Apply initial filters after data is loaded
        const category = searchParams.get("category") || "all";
        const location = searchParams.get("location") || "all";
        const query = searchParams.get("query") || "";
        const sort =
          (searchParams.get("sortBy") as string) || activeFilters.sort;

        setSearchQuery(query);
        setActiveFilters((prev) => ({
          ...prev,
          category,
          location,
          sort,
        }));

        applyFilters(data || [], query, { category, location, sort });
      } catch (err) {
        console.error("Error fetching listings:", err);
        toast.error("Failed to load listings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [supabase, searchParams]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(listings, query, activeFilters);
  };

  // Handle filter changes
  const handleFilterChange = (filters: {
    category?: string;
    location?: string;
    sort?: string;
  }) => {
    const newFilters = { ...activeFilters, ...filters };
    setActiveFilters(newFilters);
    applyFilters(listings, searchQuery, newFilters);
  };

  // Apply filters to listings
  const applyFilters = (
    allListings: Listing[],
    query: string,
    filters: {
      category: string;
      location: string;
      sort: string;
    }
  ) => {
    let results = [...allListings];

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
        results.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        results.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        results.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
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
                  applyFilters(listings, "", {
                    category: "all",
                    location: "all",
                    sort: "newest",
                  });
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
                          <NavigationLink
                            href={`/?category=${category.toLowerCase()}`}
                            className="text-sm text-primary hover:underline"
                            aria-labelledby={`category-${category.toLowerCase()}`}
                          >
                            View all in {category}
                          </NavigationLink>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                          {listings.slice(0, 4).map((listing) => (
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
