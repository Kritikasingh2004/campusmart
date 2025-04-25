"use client";

import { useState, useEffect } from "react";
import { useListings } from "@/hooks/use-listings";
import { useUser } from "@/hooks/use-user";
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
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface UserListingsProps {
  limit?: number;
  userId?: string;
}

export function UserListings({ limit, userId }: UserListingsProps) {
  const { user } = useUser();
  const { listings, loading, error, deleteListing } = useListings({
    userId: userId || user?.id,
  });
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [displayListings, setDisplayListings] = useState<Listing[]>([]);

  // Update display listings when listings change or limit changes
  useEffect(() => {
    if (listings) {
      setDisplayListings(limit ? listings.slice(0, limit) : listings);
    }
  }, [listings, limit]);

  // Handle delete
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      setIsDeleting(id);
      try {
        await deleteListing(id);
      } catch (error) {
        console.error("Error deleting listing:", error);
      } finally {
        setIsDeleting(null);
      }
    }
  };

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
              <Link href="/upload">Create Your First Listing</Link>
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayListings.map((listing) => (
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
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/listing/${listing.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/edit-listing/${listing.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isDeleting === listing.id}
                        onClick={() => handleDelete(listing.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

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
