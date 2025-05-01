/**
 * Application-wide constants
 */

// Categories for listings
export const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "books", label: "Books" },
  { value: "electronics", label: "Electronics" },
  { value: "furniture", label: "Furniture" },
  { value: "clothing", label: "Clothing" },
  { value: "other", label: "Other" },
];

// Locations for listings
export const LOCATIONS = [
  { value: "all", label: "All Locations" },
  { value: "north-campus", label: "North Campus" },
  { value: "south-campus", label: "South Campus" },
  { value: "east-campus", label: "East Campus" },
  { value: "west-campus", label: "West Campus" },
];

// Form-specific categories (without "all")
export const FORM_CATEGORIES = CATEGORIES.filter(cat => cat.value !== "all");

// Form-specific locations (without "all")
export const FORM_LOCATIONS = LOCATIONS.filter(loc => loc.value !== "all");

// Price ranges for filtering
export const PRICE_RANGES = [
  { min: 0, max: 500, name: "₹0-500" },
  { min: 500, max: 1000, name: "₹500-1000" },
  { min: 1000, max: 2000, name: "₹1000-2000" },
  { min: 2000, max: 5000, name: "₹2000-5000" },
  { min: 5000, max: Infinity, name: "₹5000+" },
];

// Chart colors
export const CHART_COLORS = [
  "#0088FE", 
  "#00C49F", 
  "#FFBB28", 
  "#FF8042", 
  "#8884D8"
];
