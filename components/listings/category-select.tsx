"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Categories data
const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "books", label: "Books" },
  { value: "electronics", label: "Electronics" },
  { value: "furniture", label: "Furniture" },
  { value: "clothing", label: "Clothing" },
  { value: "other", label: "Other" },
];

interface CategorySelectProps {
  defaultValue?: string;
  onCategoryChange?: (category: string) => void;
  className?: string;
}

export function CategorySelect({
  defaultValue = "all",
  onCategoryChange,
  className,
}: CategorySelectProps) {
  const [selectedCategory, setSelectedCategory] = useState(defaultValue);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (onCategoryChange) {
      onCategoryChange(value);
    }
  };

  return (
    <Select
      value={selectedCategory}
      onValueChange={handleCategoryChange}
      defaultValue={defaultValue}
    >
      <SelectTrigger className={className || "w-[180px]"}>
        <SelectValue placeholder="Select Category" />
      </SelectTrigger>
      <SelectContent>
        {CATEGORIES.map((category) => (
          <SelectItem key={category.value} value={category.value}>
            {category.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
