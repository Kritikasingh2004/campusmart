"use client";

import { useEffect } from "react";
import { useListings } from "@/hooks/use-listings";
import { useAuth } from "@/contexts/auth-context";
import { formatPrice } from "@/utils/format";
import { calculateDashboardStats, CHART_COLORS } from "@/utils/dashboard";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  CheckCircle2,
  CreditCard,
} from "lucide-react";

import { StatCard } from "./stat-card";
import { CategoryPieChart } from "./category-pie-chart";
import { PriceBarChart } from "./price-bar-chart";
import { ChartContainer } from "./chart-container";

interface DashboardStatsProps {
  userId?: string;
  refreshTrigger?: number;
}

export function DashboardStats({
  userId,
  refreshTrigger = 0,
}: DashboardStatsProps) {
  const { user } = useAuth();
  const { listings, loading, fetchListings } = useListings({
    userId: userId || user?.id,
    showSold: true, // Make sure to include sold items
  });

  // Refresh listings when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchListings();
    }
  }, [refreshTrigger, fetchListings]);

  // Calculate stats when listings change
  const stats = calculateDashboardStats(listings || []);

  // Loading state
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCard
            key={i}
            title={<Skeleton className="h-4 w-20" />}
            value={<Skeleton className="h-8 w-full" />}
            description={<Skeleton className="h-4 w-1/2 mt-2" />}
            icon={() => <Skeleton className="h-4 w-4" />}
          />
        ))}
      </div>
    );
  }

  // Empty state - only hide if there are truly no listings (not even sold ones)
  if (!listings) {
    return null; // Don't show stats if listings data is not available
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Listings"
          value={stats.totalListings}
          description="Items you have listed for sale"
          icon={Package}
        />
        <StatCard
          title="Total Value"
          value={formatPrice(stats.totalValue)}
          description="Combined value of all listings"
          icon={DollarSign}
        />
        <StatCard
          title="Average Price"
          value={formatPrice(stats.averagePrice)}
          description="Average price per listing"
          icon={TrendingUp}
        />
        <StatCard
          title="Most Common Category"
          value={stats.mostCommonCategory}
          description="Your most listed category"
          icon={ShoppingBag}
        />
      </div>

      <h3 className="text-lg font-semibold mt-8">Sold Items Stats</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Items Sold"
          value={stats.totalSold}
          description="Total number of items sold"
          icon={CheckCircle2}
        />
        <StatCard
          title="Revenue"
          value={formatPrice(stats.totalSoldValue)}
          description="Total value of sold items"
          icon={CreditCard}
        />
        <StatCard
          title="Sell Rate"
          value={stats.sellRate}
          description="Percentage of listings sold"
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartContainer title="Listings by Category">
          <CategoryPieChart data={stats.categoryData} colors={CHART_COLORS} />
        </ChartContainer>
        <ChartContainer title="Listings by Price Range">
          <PriceBarChart
            data={stats.priceData}
            colors={CHART_COLORS}
            domain={
              stats.priceData.every((item) => item.value === 0)
                ? [0, 1]
                : undefined
            }
          />
        </ChartContainer>
      </div>
    </div>
  );
}
