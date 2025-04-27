"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { ListingDetail } from "@/components/listings/listing-detail";
import { Skeleton } from "@/components/ui/skeleton";
import { Listing } from "@/types/listing";

interface ListingDetailClientProps {
  id: string;
  mockListing: Listing;
}

export function ListingDetailClient({
  id,
  mockListing,
}: ListingDetailClientProps) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);

        // Import createClient here to avoid "use client" directive issues
        const { createClient } = await import("@/utils/supabase/client");
        const supabase = createClient();

        // Fetch the listing from Supabase
        const { data, error } = await supabase
          .from("listings")
          .select("*, users(*)")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          console.log("Fetched listing:", data);
          setListing(data);
        } else {
          // Fallback to mock data if no real data is found
          console.log("No listing found, using mock data");
          setListing(mockListing);
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
        // Fallback to mock data on error
        setListing(mockListing);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, mockListing]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Container className="py-8">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-64 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
            </div>
          ) : listing ? (
            <ListingDetail listing={listing} />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Listing Not Found</h2>
              <p className="text-muted-foreground">
                The listing you&apos;re looking for doesn&apos;t exist or has
                been removed.
              </p>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
