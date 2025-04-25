"use client";

import { ProductCard } from "./product-card";
import { Listing } from "@/types/listing";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  listings: Listing[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function ProductGrid({
  listings,
  isLoading = false,
  emptyMessage = "No listings found",
}: ProductGridProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[300px] w-full rounded-md" />
        ))}
      </div>
    );
  }

  // Empty state
  if (!listings || listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground text-center">{emptyMessage}</p>
      </div>
    );
  }

  // Grid of product cards
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {listings.map((listing) => (
        <ProductCard
          key={listing.id}
          id={listing.id}
          title={listing.title}
          price={listing.price}
          imageUrl={listing.image_url || ""}
          location={listing.location}
          category={listing.category}
          createdAt={listing.created_at}
        />
      ))}
    </div>
  );
}
