"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FiltersProps {
  onFilterChange?: (filters: {
    category?: string;
    location?: string;
    sort?: string;
    search?: string;
  }) => void;
}

export function Filters({ onFilterChange }: FiltersProps) {
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    sort: "newest",
    search: "",
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search listings..."
          className="pl-8"
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select
          value={filters.category}
          onValueChange={(value) => handleFilterChange("category", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            <SelectItem value="books">Books</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="furniture">Furniture</SelectItem>
            <SelectItem value="clothing">Clothing</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.location}
          onValueChange={(value) => handleFilterChange("location", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Locations</SelectItem>
            <SelectItem value="north-campus">North Campus</SelectItem>
            <SelectItem value="south-campus">South Campus</SelectItem>
            <SelectItem value="east-campus">East Campus</SelectItem>
            <SelectItem value="west-campus">West Campus</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.sort}
          onValueChange={(value) => handleFilterChange("sort", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
