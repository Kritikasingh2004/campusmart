import { calculateAverage } from "./number";
import { groupBy } from "./array";

// Define types for listings and stats
export interface Listing {
  id: string;
  price: number;
  category: string;
  is_sold: boolean;
  [key: string]: any;
}

export interface DashboardStats {
  totalListings: number;
  totalValue: number;
  averagePrice: number;
  categoryData: { name: string; value: number }[];
  priceData: { name: string; value: number }[];
  totalSold: number;
  totalSoldValue: number;
  mostCommonCategory: string;
  sellRate: string;
}

// Define price ranges
export const PRICE_RANGES = [
  { min: 0, max: 500, name: "₹0-500" },
  { min: 500, max: 1000, name: "₹500-1000" },
  { min: 1000, max: 2000, name: "₹1000-2000" },
  { min: 2000, max: 5000, name: "₹2000-5000" },
  { min: 5000, max: Infinity, name: "₹5000+" },
];

// Define chart colors
export const CHART_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

// Calculate dashboard stats from listings
export function calculateDashboardStats(listings: Listing[]): DashboardStats {
  if (!listings || listings.length === 0) {
    return getEmptyStats();
  }

  // Separate active and sold listings
  const activeListings = listings.filter((listing) => !listing.is_sold);
  const soldListings = listings.filter((listing) => listing.is_sold);

  // Calculate basic stats
  const totalListings = listings.length;
  const totalValue = listings.reduce((sum, item) => sum + item.price, 0);
  const averagePrice = calculateAverage(listings.map((item) => item.price));

  // Calculate sold items stats
  const totalSold = soldListings.length;
  const totalSoldValue = soldListings.reduce((sum, item) => sum + item.price, 0);

  // Determine which listings to use for charts
  // If all items are sold, use all listings for charts
  const listingsForCharts = activeListings.length > 0 ? activeListings : listings;

  // Group by category
  const listingsByCategory = groupBy(listingsForCharts, "category");
  const categoryData = Object.entries(listingsByCategory).map(([name, items]) => ({
    name,
    value: items.length,
  }));

  // Create price data
  const priceData = PRICE_RANGES.map((range) => ({
    name: range.name,
    value: listingsForCharts.filter(
      (item) => item.price >= range.min && item.price < range.max
    ).length,
  }));

  // Calculate sell rate
  const sellRate = totalListings > 0
    ? `${Math.round((totalSold / totalListings) * 100)}%`
    : "0%";

  // Get most common category
  const mostCommonCategory = categoryData.length > 0
    ? categoryData.sort((a, b) => b.value - a.value)[0].name
    : "None";

  return {
    totalListings,
    totalValue,
    averagePrice,
    categoryData,
    priceData,
    totalSold,
    totalSoldValue,
    mostCommonCategory,
    sellRate,
  };
}

// Get empty stats for when there are no listings
export function getEmptyStats(): DashboardStats {
  return {
    totalListings: 0,
    totalValue: 0,
    averagePrice: 0,
    categoryData: [{ name: "No Data", value: 1 }],
    priceData: PRICE_RANGES.map(range => ({ name: range.name, value: 0 })),
    totalSold: 0,
    totalSoldValue: 0,
    mostCommonCategory: "None",
    sellRate: "0%",
  };
}
