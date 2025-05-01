"use client";

import { ProductCard } from "@/components/listings/product-card";
import { ShoppingBag, Tag } from "lucide-react";
import { Listing } from "@/types/listing";

interface ListingsSectionProps {
  listings: Listing[];
  sortBy?: string | null;
}

export function ListingsSection({ listings, sortBy }: ListingsSectionProps) {
  return (
    <section aria-labelledby="listings-heading">
      <div className="bg-card rounded-xl border p-6 shadow-sm">
        <h2
          id="listings-heading"
          className="text-2xl font-semibold mb-6 flex items-center"
        >
          {sortBy === "price_asc" ? (
            <>
              <Tag className="h-6 w-6 mr-2 text-primary" />
              Listings by Price (Low to High)
            </>
          ) : sortBy === "price_desc" ? (
            <>
              <Tag className="h-6 w-6 mr-2 text-primary" />
              Listings by Price (High to Low)
            </>
          ) : (
            <>
              <ShoppingBag className="h-6 w-6 mr-2 text-primary" />
              Latest Listings
            </>
          )}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.slice(0, 9).map((listing) => (
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
    </section>
  );
}
