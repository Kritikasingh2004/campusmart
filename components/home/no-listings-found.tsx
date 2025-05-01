"use client";

import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export function NoListingsFound() {
  return (
    <div className="bg-card rounded-xl border p-12 shadow-sm text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <ShoppingBag className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">
        No Listings Found
      </h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        No items match your current search criteria. Try adjusting
        your filters or search query.
      </p>
      <Button
        size="lg"
        className="rounded-full"
        onClick={() => {
          // Reset filters by navigating to the base URL
          window.location.href = window.location.pathname;
        }}
      >
        Clear All Filters
      </Button>
    </div>
  );
}
