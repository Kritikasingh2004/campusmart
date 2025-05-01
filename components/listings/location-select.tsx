"use client";

import { DataSelect } from "@/components/ui/data-select";
import { LOCATIONS } from "@/lib/constants";

interface LocationSelectProps {
  defaultValue?: string;
  onLocationChange?: (location: string) => void;
  className?: string;
  label?: string;
  disabled?: boolean;
}

export function LocationSelect({
  defaultValue = "all",
  onLocationChange,
  className,
  label,
  disabled,
}: LocationSelectProps) {
  return (
    <DataSelect
      options={LOCATIONS}
      defaultValue={defaultValue}
      onChange={onLocationChange}
      className={className}
      placeholder="Select Location"
      label={label}
      disabled={disabled}
    />
  );
}
