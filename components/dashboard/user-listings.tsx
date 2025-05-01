"use client";

import { useState, useEffect } from "react";
import { useListings } from "@/hooks/use-listings";
import { useAuth } from "@/contexts/auth-context";
import { Listing } from "@/types/listing";

import { formatRelativeTime } from "@/utils/date";
import { formatPrice } from "@/utils/format";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ListingActions } from "@/components/dashboard/listing-actions";

interface UserListingsProps {
  limit?: number;
  userId?: string;
  showSold?: boolean;
  refreshTrigger?: number;
  onStatusChange?: () => void;
}

export function UserListings({
  limit,
  userId,
  showSold,
  refreshTrigger = 0,
  onStatusChange,
}: UserListingsProps) {
  const { user } = useAuth();
  const { listings, loading, error, fetchListings } = useListings({
    userId: userId || user?.id,
    showSold,
  });
  const [displayListings, setDisplayListings] = useState<Listing[]>([]);
  const [activeListings, setActiveListings] = useState<Listing[]>([]);
  const [soldListings, setSoldListings] = useState<Listing[]>([]);

  // Refresh listings when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchListings();
    }
  }, [refreshTrigger, fetchListings]);

  // Update display listings when listings change or limit changes
  useEffect(() => {
    if (listings) {
      // Filter active and sold listings
      const active = listings.filter((listing) => !listing.is_sold);
      const sold = listings.filter((listing) => listing.is_sold);

      setActiveListings(limit ? active.slice(0, limit) : active);
      setSoldListings(limit ? sold.slice(0, limit) : sold);
      setDisplayListings(limit ? listings.slice(0, limit) : listings);
    }
  }, [listings, limit]);

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Listings</CardTitle>
          <CardDescription>Manage your marketplace listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-destructive">
            Error loading listings: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!displayListings.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Listings</CardTitle>
          <CardDescription>Manage your marketplace listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              You haven&apos;t created any listings yet.
            </p>
            <Button asChild>
              <Link href="/create-listing">Create Your First Listing</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Listings</CardTitle>
        <CardDescription>Manage your marketplace listings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" className="mb-4">
          <TabsList>
            <TabsTrigger value="active">Active Listings</TabsTrigger>
            <TabsTrigger value="sold">Sold Items</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeListings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No active listings found
                      </TableCell>
                    </TableRow>
                  ) : (
                    activeListings.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {listing.title}
                        </TableCell>
                        <TableCell>{formatPrice(listing.price)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{listing.category}</Badge>
                        </TableCell>
                        <TableCell>{listing.location}</TableCell>
                        <TableCell>
                          {formatRelativeTime(listing.created_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            <ListingActions
                              listing={listing}
                              variant="buttons"
                              onDelete={(updatedListing) => {
                                if (updatedListing && updatedListing.is_sold) {
                                  // If the listing was marked as sold, add it to soldListings
                                  setSoldListings([
                                    updatedListing,
                                    ...soldListings,
                                  ]);
                                  // Also refresh the listings to ensure data consistency
                                  fetchListings();
                                  // Notify parent component to update stats
                                  if (onStatusChange) {
                                    onStatusChange();
                                  }
                                }
                                // Remove from active listings
                                setActiveListings(
                                  activeListings.filter(
                                    (item) => item.id !== listing.id
                                  )
                                );
                              }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="sold">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {soldListings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No sold items found
                      </TableCell>
                    </TableRow>
                  ) : (
                    soldListings.map((listing) => (
                      <TableRow key={listing.id} className="bg-muted/30">
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {listing.title}
                          <Badge variant="secondary" className="ml-2">
                            Sold
                          </Badge>
                        </TableCell>
                        <TableCell>{formatPrice(listing.price)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{listing.category}</Badge>
                        </TableCell>
                        <TableCell>{listing.location}</TableCell>
                        <TableCell>
                          {formatRelativeTime(listing.created_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            <ListingActions
                              listing={listing}
                              variant="buttons"
                              onDelete={() => {
                                // Update the listings after deletion
                                setSoldListings(
                                  soldListings.filter(
                                    (item) => item.id !== listing.id
                                  )
                                );
                                // Also refresh the listings to ensure data consistency
                                fetchListings();
                              }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {limit && listings.length > limit && (
          <div className="mt-4 text-center">
            <Button variant="outline" asChild>
              <Link href="/dashboard">View All Listings</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
