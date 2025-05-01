"use client";

import { ProductCard } from "@/components/listings/product-card";
import { NavigationLink } from "@/components/ui/navigation-link";
import { BookOpen, ChevronRight } from "lucide-react";
import { Listing } from "@/types/listing";
import { getCategoryIcon } from "@/utils/category";

interface CategorySectionProps {
  categories: Record<string, Listing[]>;
}

export function CategorySection({ categories }: CategorySectionProps) {
  if (Object.keys(categories).length <= 1) {
    return null;
  }

  return (
    <section aria-labelledby="categories-heading">
      <div className="bg-card rounded-xl border p-6 shadow-sm">
        <h2
          id="categories-heading"
          className="text-2xl font-semibold mb-6 flex items-center"
        >
          <BookOpen className="h-6 w-6 mr-2 text-primary" />
          Listings by Category
        </h2>
        <div className="space-y-8">
          {Object.entries(categories).map(
            ([category, listings]) => (
              <div key={category} className="pb-6 last:pb-0 last:border-0 border-b last:mb-0">
                <div className="flex items-center justify-between mb-4">
                  <h3
                    id={`category-${category.toLowerCase()}`}
                    className="text-xl font-medium flex items-center"
                  >
                    {getCategoryIcon(category)}
                    {category}
                  </h3>
                  <NavigationLink
                    href={`/?category=${category.toLowerCase()}`}
                    className="text-sm text-primary hover:underline flex items-center group"
                    aria-labelledby={`category-${category.toLowerCase()}`}
                  >
                    View all in {category}
                    <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
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
        </div>
      </div>
    </section>
  );
}
