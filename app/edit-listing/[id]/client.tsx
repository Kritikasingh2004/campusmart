"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ListingForm } from "@/components/listings/listing-form";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Listing } from "@/types/listing";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface EditListingClientProps {
  id: string;
}

export function EditListingClient({ id }: EditListingClientProps) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const router = useRouter();

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
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            // Record not found error
            toast.error("Listing not found");
          } else {
            console.error("Database error:", error.message);
            toast.error("Failed to load listing");
          }
          return;
        }

        if (!data) {
          toast.error("Listing not found");
          return;
        }

        setListing(data);
      } catch (error) {
        console.error("Error fetching listing:", error);
        toast.error("Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  // Check if user is the owner of the listing
  useEffect(() => {
    if (!loading && listing && user) {
      if (listing.user_id !== user.id) {
        toast.error("You don't have permission to edit this listing");
        router.push(`/listing/${id}`);
      }
    }
  }, [listing, loading, user, id, router]);

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Container className="py-8">
            <PageHeader
              title="Edit Listing"
              description="Update your listing information"
            />

            <div className="mt-8">
              {loading ? (
                <div className="space-y-4 max-w-2xl mx-auto">
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : listing ? (
                <ListingForm listing={listing} isEditMode={true} />
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold mb-2">Listing Not Found</h2>
                  <p className="text-muted-foreground">
                    The listing you&apos;re trying to edit doesn&apos;t exist or
                    has been removed.
                  </p>
                </div>
              )}
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    </AuthGuard>
  );
}
