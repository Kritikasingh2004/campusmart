"use client";

import { DataSelect } from "@/components/ui/data-select";
import { CATEGORIES } from "@/lib/constants";

interface CategorySelectProps {
  defaultValue?: string;
  onCategoryChange?: (category: string) => void;
  className?: string;
  label?: string;
  disabled?: boolean;
}

export function CategorySelect({
  defaultValue = "all",
  onCategoryChange,
  className,
  label,
  disabled,
}: CategorySelectProps) {
  return (
    <DataSelect
      options={CATEGORIES}
      defaultValue={defaultValue}
      onChange={onCategoryChange}
      className={className}
      placeholder="Select Category"
      label={label}
      disabled={disabled}
    />
  );
}
