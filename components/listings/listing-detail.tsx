"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Listing } from "@/types/listing";
import { User } from "@/types/user";
import { formatPrice } from "@/utils/format";
import { formatRelativeTime } from "@/utils/date";
import { ListingActions } from "@/components/dashboard/listing-actions";
import { UserInfo } from "@/components/profile/user-info";
import { useUser } from "@/hooks/use-user";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Calendar, Tag, AlertCircle, LogIn } from "lucide-react";

interface ListingDetailProps {
  listing: Listing;
  seller?: User;
  isLoading?: boolean;
}

export function ListingDetail({
  listing,
  seller,
  isLoading = false,
}: ListingDetailProps) {
  const { user } = useUser();
  const [sellerData, setSellerData] = useState<User | null>(null);

  // If seller is not provided, try to get it from the listing.users relation
  useEffect(() => {
    const getSeller = async () => {
      if (seller) {
        setSellerData(seller);
        return;
      }

      // If listing has users data from a join, use that
      if (listing.users) {
        setSellerData(listing.users);
        return;
      }

      // Otherwise fetch the seller data
      try {
        const { createClient } = await import("@/utils/supabase/client");
        const supabase = createClient();

        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", listing.user_id)
          .single();

        if (error) {
          console.error("Error fetching seller:", error);
          return;
        }

        if (data) {
          setSellerData(data);
        }
      } catch (error) {
        console.error("Error in seller fetch:", error);
      }
    };

    getSeller();
  }, [listing, seller]);

  const isCurrentUserListing = user?.id === listing.user_id;

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="pt-4">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg border bg-background">
          {listing.image_url ? (
            <Image
              src={listing.image_url}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
        </div>

        {/* Listing details */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">{listing.title}</h1>
            <p className="text-2xl font-bold text-primary mt-2">
              {formatPrice(listing.price)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {listing.location}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {listing.category}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Posted {formatRelativeTime(listing.created_at)}
            </Badge>
          </div>

          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="seller">Seller</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4 pt-4">
              <div>
                <h3 className="font-medium">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line mt-2">
                  {listing.description}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="seller" className="pt-4">
              {sellerData ? (
                <UserInfo user={sellerData} />
              ) : (
                <Card>
                  <CardContent className="p-4">
                    <p className="text-muted-foreground">
                      Seller information not available
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="pt-4 flex gap-4">
            {isCurrentUserListing ? (
              <ListingActions listing={listing} variant="buttons" />
            ) : user ? (
              <>
                <Button className="flex-1" asChild>
                  <Link href={`mailto:${sellerData?.email || ""}`}>
                    Contact Seller
                  </Link>
                </Button>
                {sellerData?.phone && (
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href={`tel:${sellerData.phone}`}>Call Seller</Link>
                  </Button>
                )}
              </>
            ) : (
              <div className="w-full space-y-3">
                <Alert variant="default" className="bg-muted/50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Contact details are only visible to logged-in users for
                    security purposes.
                  </AlertDescription>
                </Alert>
                <div className="flex justify-center">
                  <Button asChild>
                    <Link href="/login" className="w-full">
                      <LogIn className="h-4 w-4 mr-2" />
                      Log in
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Similar listings would go here */}
    </div>
  );
}
