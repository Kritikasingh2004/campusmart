"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useRouter, useSearchParams } from "next/navigation";
import { isValidPrice } from "@/utils/validation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent } from "@/components/ui/card";
import { Search, SlidersHorizontal } from "lucide-react";

// Define the form schema with Zod
const searchFormSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  minPrice: z
    .string()
    .refine((val) => !val || isValidPrice(val), {
      message: "Min price must be a valid number.",
    })
    .optional(),
  maxPrice: z
    .string()
    .refine((val) => !val || isValidPrice(val), {
      message: "Max price must be a valid number.",
    })
    .optional(),
  sortBy: z.enum(["newest", "price_asc", "price_desc"]),
});

// Infer the type from the schema
type SearchFormValues = z.infer<typeof searchFormSchema>;

// Categories and locations
const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "books", label: "Books" },
  { value: "electronics", label: "Electronics" },
  { value: "furniture", label: "Furniture" },
  { value: "clothing", label: "Clothing" },
  { value: "other", label: "Other" },
];

const LOCATIONS = [
  { value: "", label: "All Locations" },
  { value: "north-campus", label: "North Campus" },
  { value: "south-campus", label: "South Campus" },
  { value: "east-campus", label: "East Campus" },
  { value: "west-campus", label: "West Campus" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

interface SearchFormProps {
  onSearch?: (values: SearchFormValues) => void;
  compact?: boolean;
}

export function SearchForm({ onSearch, compact = false }: SearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(!compact);

  // Initialize the form with react-hook-form
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      query: searchParams.get("query") || "",
      category: searchParams.get("category") || "",
      location: searchParams.get("location") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      sortBy:
        (searchParams.get("sortBy") as SearchFormValues["sortBy"]) || "newest",
    },
  });

  // Handle form submission
  const onSubmit = (data: SearchFormValues) => {
    // Build query string
    const params = new URLSearchParams();

    if (data.query) params.set("query", data.query);
    if (data.category) params.set("category", data.category);
    if (data.location) params.set("location", data.location);
    if (data.minPrice) params.set("minPrice", data.minPrice);
    if (data.maxPrice) params.set("maxPrice", data.maxPrice);
    if (data.sortBy) params.set("sortBy", data.sortBy);

    // Update URL
    const queryString = params.toString();
    const url = queryString ? `/?${queryString}` : "/";
    router.push(url);

    // Call the callback
    if (onSearch) {
      onSearch(data);
    }
  };

  // Reset filters
  const handleReset = () => {
    form.reset({
      query: "",
      category: "",
      location: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
    });

    router.push("/");

    if (onSearch) {
      onSearch({
        query: "",
        category: "",
        location: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "newest",
      });
    }
  };

  // Toggle filters visibility (for mobile)
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search for items..."
                          className="pl-9 pr-4"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {compact && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={toggleFilters}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              )}

              <Button type="submit">Search</Button>
            </div>

            {(showFilters || !compact) && (
              <div className={compact ? "mt-4" : ""}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORIES.map((category) => (
                              <SelectItem
                                key={category.value}
                                value={category.value}
                              >
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="All Locations" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {LOCATIONS.map((location) => (
                              <SelectItem
                                key={location.value}
                                value={location.value}
                              >
                                {location.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sortBy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sort By</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {SORT_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="minPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Price (₹)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Price (₹)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="Any"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="mr-2"
                  >
                    Reset Filters
                  </Button>
                  <Button type="submit">Apply Filters</Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
