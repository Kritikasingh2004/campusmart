"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectOption {
  value: string;
  label: string;
}

interface DataSelectProps {
  options: SelectOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

export function DataSelect({
  options,
  defaultValue,
  onChange,
  className,
  placeholder = "Select an option",
  label,
  disabled = false,
}: DataSelectProps) {
  const [selectedValue, setSelectedValue] = useState(defaultValue || options[0]?.value || "");

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Select
        value={selectedValue}
        onValueChange={handleValueChange}
        defaultValue={defaultValue}
        disabled={disabled}
      >
        <SelectTrigger className={className || "w-[180px]"}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
