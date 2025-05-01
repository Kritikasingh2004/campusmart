"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useListingForm } from "@/hooks/use-listing-form";
import { Listing } from "@/types/listing";
import { ImageUpload } from "./image-upload";
import { isValidPrice } from "@/utils/validation";
import { FORM_CATEGORIES, FORM_LOCATIONS } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define the form schema with Zod
const listingFormSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters.",
    })
    .max(100, {
      message: "Title must be less than 100 characters.",
    }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(1000, {
      message: "Description must be less than 1000 characters.",
    }),
  price: z.string().refine((val) => isValidPrice(val), {
    message: "Price must be a valid number greater than 0.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  location: z.string({
    required_error: "Please select a location.",
  }),
});

// Infer the type from the schema
type ListingFormValues = z.infer<typeof listingFormSchema>;

// Use categories and locations from constants

interface ListingFormProps {
  listing?: Listing | null;
  isEditMode?: boolean;
}

export function ListingForm({ listing, isEditMode = false }: ListingFormProps) {
  const { isSubmitting, createListing, updateListing } = useListingForm(
    isEditMode ? listing?.id : undefined
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Initialize the form with react-hook-form
  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: FORM_CATEGORIES[0].value,
      location: FORM_LOCATIONS[0].value,
    },
  });

  // Update form values when listing data is available
  useEffect(() => {
    if (isEditMode && listing) {
      form.reset({
        title: listing.title || "",
        description: listing.description || "",
        price: listing.price?.toString() || "",
        category: listing.category || "",
        location: listing.location || "",
      });

      // Set image preview from listing data
      setImagePreview(listing.image_url || null);
    }
  }, [form, listing, isEditMode]);

  // Handle form submission
  const onSubmit = async (data: ListingFormValues) => {
    try {
      const listingData = {
        ...data,
        price: parseFloat(data.price),
        is_sold: false,
      };

      if (isEditMode && listing?.id) {
        await updateListing(listingData, imageFile || undefined);
      } else {
        await createListing(listingData, imageFile || undefined);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  // Handle image change
  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      // New file selected - create a preview URL
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    } else if (isEditMode && listing?.image_url && !file) {
      // In edit mode with no new file - revert to original image if available
      setImagePreview(listing.image_url);
    } else {
      // No file and no original image
      setImagePreview(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Listing" : "Create Listing"}</CardTitle>
        <CardDescription>
          {isEditMode
            ? "Update your listing information"
            : "Add details about the item you want to sell"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="mb-6">
              <FormLabel className="block mb-2">Item Image</FormLabel>
              <ImageUpload
                initialImage={imagePreview}
                onImageChange={handleImageChange}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="What are you selling?" {...field} />
                  </FormControl>
                  <FormDescription>
                    A clear, concise title helps buyers find your item.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your item in detail"
                      className="resize-none min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include condition, age, brand, and any other relevant
                    details.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Set a fair price for your item.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FORM_CATEGORIES.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the category that best fits your item.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FORM_LOCATIONS.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Where on campus can buyers meet you?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Listing"
                : "Create Listing"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
