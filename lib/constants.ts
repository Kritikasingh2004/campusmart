/**
 * Application-wide constants
 */

// Categories for listings
export const CATEGORIES = [
  { value: "All Categories", label: "All Categories" },
  { value: "Books", label: "Books" },
  { value: "Electronics", label: "Electronics" },
  { value: "Furniture", label: "Furniture" },
  { value: "Clothing", label: "Clothing" },
  { value: "Other", label: "Other" },
];

// Locations for listings
export const LOCATIONS = [
  { value: "All Locations", label: "All Locations" },
  {
    value: "Faculty of Engineering and Technology",
    label: "Faculty of Engineering and Technology",
  },
  { value: "Faculty of Law", label: "Faculty of Law" },
  {
    value: "Faculty of Yoga & Alternative Medicine",
    label: "Faculty of Yoga & Alternative Medicine",
  },
  {
    value: "Institute of Management Sciences",
    label: "Institute of Management Sciences",
  },
  {
    value: "Department of Pharmaceutical Sciences",
    label: "Department of Pharmaceutical Sciences",
  },
];

// Form-specific categories (without "all")
export const FORM_CATEGORIES = CATEGORIES.filter((cat) => cat.value !== "all");

// Form-specific locations (without "all")
export const FORM_LOCATIONS = LOCATIONS.filter((loc) => loc.value !== "all");

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
  "#8884D8",
];
