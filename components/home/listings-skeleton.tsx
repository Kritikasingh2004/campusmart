"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ListingsSkeleton() {
  return (
    <div className="space-y-12">
      {/* Listings Section Skeleton */}
      <div className="bg-card rounded-xl border p-6 shadow-sm">
        <Skeleton className="h-8 w-1/3 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg overflow-hidden border"
            >
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
