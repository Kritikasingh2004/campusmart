"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { CATEGORIES, LOCATIONS } from "@/lib/constants";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

// Define the filter values type directly
interface FilterValues {
  query?: string;
  category?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
}

interface EnhancedFiltersProps {
  onFilterChange?: (filters: FilterValues) => void;
  layout?: "sidebar" | "horizontal";
  className?: string;
}

export function EnhancedFilters({
  onFilterChange,
  layout = "horizontal",
  className = "",
}: EnhancedFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(layout === "sidebar");

  // Get initial price values from URL or set defaults
  const initialMinPrice = searchParams.get("minPrice") || "";
  const initialMaxPrice = searchParams.get("maxPrice") || "";

  // Maximum price for slider (can be adjusted based on your data)
  const MAX_PRICE = 10000;

  // Convert string prices to numbers for the slider
  const getInitialSliderValue = (): [number, number] => {
    const min = initialMinPrice ? parseInt(initialMinPrice) : 0;
    const max = initialMaxPrice ? parseInt(initialMaxPrice) : MAX_PRICE;
    return [min, max];
  };

  const [priceRange, setPriceRange] = useState<[number, number]>(
    getInitialSliderValue()
  );
  const [localFilters, setLocalFilters] = useState<FilterValues>({
    query: searchParams.get("query") || "",
    category: searchParams.get("category") || "All Categories",
    location: searchParams.get("location") || "All Locations",
    minPrice: initialMinPrice,
    maxPrice: initialMaxPrice,
    sortBy: searchParams.get("sortBy") || "newest",
  });

  // Update URL when filters change
  const updateUrl = (filters: FilterValues) => {
    const params = new URLSearchParams();

    // Trim the query before setting it in URL
    const trimmedQuery = filters.query?.trim();
    if (trimmedQuery) params.set("query", trimmedQuery);
    if (filters.category && filters.category !== "All Categories")
      params.set("category", filters.category);
    if (filters.location && filters.location !== "All Locations")
      params.set("location", filters.location);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.sortBy && filters.sortBy !== "newest")
      params.set("sortBy", filters.sortBy);

    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;

    // Use replace to avoid adding to history stack for every filter change
    router.replace(url, { scroll: false });
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);

    // Don't apply filters automatically on change - wait for user to click Apply
  };

  // Handle price range slider changes
  const handlePriceRangeChange = (values: number[]) => {
    if (values.length === 2) {
      const [min, max] = values;
      setPriceRange([min, max]);

      // Update the filter values
      setLocalFilters((prev) => ({
        ...prev,
        minPrice: min > 0 ? min.toString() : "",
        maxPrice: max < MAX_PRICE ? max.toString() : "",
      }));
    }
  };

  // Apply all filters
  const applyFilters = () => {
    updateUrl(localFilters);
    onFilterChange?.(localFilters);
    if (layout === "horizontal") setShowAdvanced(false);
  };

  // Reset all filters
  const resetFilters = () => {
    const defaultFilters = {
      query: "",
      category: "All Categories",
      location: "All Locations",
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
    };

    setLocalFilters(defaultFilters);
    updateUrl(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  // Toggle advanced filters visibility
  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  // Create a mobile filter trigger for small screens
  const MobileFilterTrigger = () => (
    <Button
      variant="outline"
      size="sm"
      className="md:hidden flex items-center gap-2"
      onClick={() => setShowMobileFilters(true)}
    >
      <SlidersHorizontal className="h-4 w-4" />
      <span>Filters</span>
    </Button>
  );

  // The search bar component - used in both layouts
  const SearchBar = () => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        applyFilters();
      }}
      className="flex gap-2 w-full"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search listings..."
          className="pl-9 pr-10 [&::-webkit-search-cancel-button]:hidden [&::-ms-clear]:hidden"
          value={localFilters.query || ""}
          onChange={(e) => handleFilterChange("query", e.target.value)}
          aria-label="Search listings"
        />
        {localFilters.query && (
          <button
            type="button"
            onClick={() => {
              handleFilterChange("query", "");
              // Clear search and apply immediately
              setTimeout(() => applyFilters(), 0);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground flex items-center justify-center w-6 h-6 rounded-full hover:bg-muted/50 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button type="submit">Search</Button>
    </form>
  );

  // The filter options component - used in both layouts
  const FilterOptions = () => (
    <div className="space-y-6">
      {/* Category filter */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Category</h3>
        <Select
          value={localFilters.category || "All Categories"}
          onValueChange={(value) => handleFilterChange("category", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location filter */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Location</h3>
        <Select
          value={localFilters.location || "All Locations"}
          onValueChange={(value) => handleFilterChange("location", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            {LOCATIONS.map((location) => (
              <SelectItem key={location.value} value={location.value}>
                {location.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort filter */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Sort By</h3>
        <Select
          value={localFilters.sortBy || "newest"}
          onValueChange={(value) => handleFilterChange("sortBy", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range filter */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Price Range</h3>
        <div className="space-y-6 pt-1">
          {/* Price Range Slider */}
          <Slider
            defaultValue={priceRange}
            min={0}
            max={MAX_PRICE}
            step={100}
            onValueChange={handlePriceRangeChange}
            className="my-6"
          />

          {/* Price Range Display */}
          <div className="flex justify-between text-sm text-muted-foreground mb-4">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1] === MAX_PRICE ? "Any" : priceRange[1]}</span>
          </div>

          {/* Price Range Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="min-price"
                className="text-sm font-medium mb-2 block"
              >
                Min Price (₹)
              </label>
              <Input
                id="min-price"
                type="number"
                min="0"
                placeholder="0"
                value={localFilters.minPrice || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterChange("minPrice", value);

                  // Update slider when input changes
                  if (value) {
                    const min = parseInt(value);
                    setPriceRange([min, priceRange[1]]);
                  } else {
                    setPriceRange([0, priceRange[1]]);
                  }
                }}
              />
            </div>
            <div>
              <label
                htmlFor="max-price"
                className="text-sm font-medium mb-2 block"
              >
                Max Price (₹)
              </label>
              <Input
                id="max-price"
                type="number"
                min="0"
                placeholder="Any"
                value={localFilters.maxPrice || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterChange("maxPrice", value);

                  // Update slider when input changes
                  if (value) {
                    const max = parseInt(value);
                    setPriceRange([priceRange[0], max]);
                  } else {
                    setPriceRange([priceRange[0], MAX_PRICE]);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 pt-4 mt-6">
        <Button
          type="button"
          onClick={applyFilters}
          className="w-full bg-primary hover:bg-primary/90 h-11"
        >
          Apply Filters
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={resetFilters}
          className="w-full h-11"
        >
          Reset All
        </Button>
      </div>
    </div>
  );

  // Render different layouts based on the layout prop
  if (layout === "sidebar") {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="md:hidden">
          <div className="flex items-center justify-between">
            <MobileFilterTrigger />
            <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
              <SheetContent
                side="left"
                className="w-[90vw] max-w-[400px] p-0 overflow-y-auto"
              >
                <SheetTitle className="sr-only">Filters</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">Filters</h2>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <FilterOptions />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <Card className="hidden md:block sticky top-4">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <FilterOptions />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default horizontal layout
  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Search input */}
          <div className="flex gap-2 items-center">
            <SearchBar />
            <MobileFilterTrigger />
          </div>

          {/* Mobile filter sheet */}
          <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
            <SheetContent
              side="left"
              className="w-[90vw] max-w-[400px] p-0 overflow-y-auto"
            >
              <SheetTitle className="sr-only">Filters</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-xl font-semibold">Filters</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <FilterOptions />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop filters */}
          <div className="hidden md:block">
            {/* Basic filters always visible */}
            <div className="flex flex-wrap gap-2">
              <Select
                value={localFilters.category || "All Categories"}
                onValueChange={(value) => handleFilterChange("category", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={localFilters.location || "All Locations"}
                onValueChange={(value) => handleFilterChange("location", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((location) => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={localFilters.sortBy || "newest"}
                onValueChange={(value) => handleFilterChange("sortBy", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={toggleAdvanced}
                aria-expanded={showAdvanced}
                aria-controls="advanced-filters"
                className="ml-auto"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Advanced filters (price range) */}
            {showAdvanced && (
              <div id="advanced-filters" className="pt-4 border-t mt-4">
                <div className="space-y-6">
                  <h3 className="text-sm font-medium">Price Range</h3>

                  {/* Price Range Slider */}
                  <div className="pt-2">
                    <Slider
                      defaultValue={priceRange}
                      min={0}
                      max={MAX_PRICE}
                      step={100}
                      onValueChange={handlePriceRangeChange}
                      className="mb-6"
                    />
                  </div>

                  {/* Price Range Inputs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="min-price-horizontal"
                        className="text-sm font-medium mb-1 block"
                      >
                        Min Price (₹)
                      </label>
                      <Input
                        id="min-price-horizontal"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={localFilters.minPrice || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleFilterChange("minPrice", value);

                          // Update slider when input changes
                          if (value) {
                            const min = parseInt(value);
                            setPriceRange([min, priceRange[1]]);
                          } else {
                            setPriceRange([0, priceRange[1]]);
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="max-price-horizontal"
                        className="text-sm font-medium mb-1 block"
                      >
                        Max Price (₹)
                      </label>
                      <Input
                        id="max-price-horizontal"
                        type="number"
                        min="0"
                        placeholder="Any"
                        value={localFilters.maxPrice || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleFilterChange("maxPrice", value);

                          // Update slider when input changes
                          if (value) {
                            const max = parseInt(value);
                            setPriceRange([priceRange[0], max]);
                          } else {
                            setPriceRange([priceRange[0], MAX_PRICE]);
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Price Range Display */}
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₹{priceRange[0]}</span>
                    <span>
                      ₹{priceRange[1] === MAX_PRICE ? "Any" : priceRange[1]}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetFilters}
              >
                Reset All
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={applyFilters}
                className="bg-primary hover:bg-primary/90"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
