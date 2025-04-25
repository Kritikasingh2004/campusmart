"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Locations data
const LOCATIONS = [
  { value: "all", label: "All Locations" },
  { value: "north-campus", label: "North Campus" },
  { value: "south-campus", label: "South Campus" },
  { value: "east-campus", label: "East Campus" },
  { value: "west-campus", label: "West Campus" },
];

interface LocationSelectProps {
  defaultValue?: string;
  onLocationChange?: (location: string) => void;
  className?: string;
}

export function LocationSelect({
  defaultValue = "all",
  onLocationChange,
  className,
}: LocationSelectProps) {
  const [selectedLocation, setSelectedLocation] = useState(defaultValue);

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
    if (onLocationChange) {
      onLocationChange(value);
    }
  };

  return (
    <Select
      value={selectedLocation}
      onValueChange={handleLocationChange}
      defaultValue={defaultValue}
    >
      <SelectTrigger className={className || "w-[180px]"}>
        <SelectValue placeholder="Select Location" />
      </SelectTrigger>
      <SelectContent>
        {LOCATIONS.map((location) => (
          <SelectItem key={location.value} value={location.value}>
            {location.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
