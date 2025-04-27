"use client";

import { useState } from "react";
import { useListingForm } from "@/hooks/use-listing-form";
import { Listing } from "@/types/listing";
import Link from "next/link";
import { toast } from "sonner";
import { useNavigation } from "@/contexts/navigation-context";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Eye, Pencil, MoreVertical, Trash2, Share } from "lucide-react";

interface ListingActionsProps {
  listing: Listing;
  onDelete?: () => void;
  variant?: "dropdown" | "buttons";
}

export function ListingActions({
  listing,
  onDelete,
  variant = "dropdown",
}: ListingActionsProps) {
  const { deleteListing, isSubmitting } = useListingForm(listing.id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { startNavigation } = useNavigation();

  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteListing();
      toast.success("Listing deleted successfully");
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Failed to delete listing");
    }
  };

  // Handle share
  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/listing/${listing.id}`;

      if (navigator.share) {
        await navigator.share({
          title: listing.title,
          text: `Check out this listing: ${listing.title}`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // Dropdown variant
  if (variant === "dropdown") {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild onClick={() => startNavigation()}>
              <Link href={`/listing/${listing.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild onClick={() => startNavigation()}>
              <Link href={`/edit-listing/${listing.id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShare}>
              <Share className="mr-2 h-4 w-4" />
              Share
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                listing and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isSubmitting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // Buttons variant
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        asChild
        className="flex items-center gap-1"
        onClick={() => startNavigation()}
      >
        <Link href={`/listing/${listing.id}`}>
          <Eye className="h-4 w-4 mr-1" /> View
        </Link>
      </Button>
      <Button
        variant="outline"
        size="sm"
        asChild
        className="flex items-center gap-1"
        onClick={() => startNavigation()}
      >
        <Link href={`/edit-listing/${listing.id}`}>
          <Pencil className="h-4 w-4 mr-1" /> Edit
        </Link>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        className="flex items-center gap-1"
      >
        <Share className="h-4 w-4 mr-1" /> Share
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-destructive border-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              listing and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
