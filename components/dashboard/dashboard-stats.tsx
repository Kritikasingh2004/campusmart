"use client";

import { useEffect, useState } from "react";
import { useListings } from "@/hooks/use-listings";
import { useAuth } from "@/contexts/auth-context";
import { formatPrice } from "@/utils/format";
import { calculateAverage } from "@/utils/number";
import { groupBy } from "@/utils/array";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Package, DollarSign, TrendingUp, ShoppingBag } from "lucide-react";

interface DashboardStatsProps {
  userId?: string;
}

export function DashboardStats({ userId }: DashboardStatsProps) {
  const { user } = useAuth();
  const { listings, loading } = useListings({ userId: userId || user?.id });
  const [stats, setStats] = useState({
    totalListings: 0,
    totalValue: 0,
    averagePrice: 0,
    categoryData: [] as { name: string; value: number }[],
    priceData: [] as { name: string; value: number }[],
  });

  // Calculate stats when listings change
  useEffect(() => {
    if (listings && listings.length > 0) {
      // Calculate basic stats
      const totalListings = listings.length;
      const totalValue = listings.reduce((sum, item) => sum + item.price, 0);
      const averagePrice = calculateAverage(listings.map((item) => item.price));

      // Group by category
      const listingsByCategory = groupBy(listings, "category");
      const categoryData = Object.entries(listingsByCategory).map(
        ([name, items]) => ({
          name,
          value: items.length,
        })
      );

      // Create price ranges
      const priceRanges = [
        { min: 0, max: 500, name: "₹0-500" },
        { min: 500, max: 1000, name: "₹500-1000" },
        { min: 1000, max: 2000, name: "₹1000-2000" },
        { min: 2000, max: 5000, name: "₹2000-5000" },
        { min: 5000, max: Infinity, name: "₹5000+" },
      ];

      const priceData = priceRanges.map((range) => ({
        name: range.name,
        value: listings.filter(
          (item) => item.price >= range.min && item.price < range.max
        ).length,
      }));

      setStats({
        totalListings,
        totalValue,
        averagePrice,
        categoryData,
        priceData,
      });
    }
  }, [listings]);

  // Loading state
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-20" />
              </CardTitle>
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Empty state
  if (!listings || listings.length === 0) {
    return null; // Don't show stats if there are no listings
  }

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Listings
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalListings}</div>
            <p className="text-xs text-muted-foreground">
              Items you have listed for sale
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(stats.totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Combined value of all listings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(stats.averagePrice)}
            </div>
            <p className="text-xs text-muted-foreground">
              Average price per listing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Most Common Category
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {stats.categoryData.length > 0
                ? stats.categoryData.sort((a, b) => b.value - a.value)[0].name
                : "None"}
            </div>
            <p className="text-xs text-muted-foreground">
              Your most listed category
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Listings by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Listings by Price Range</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.priceData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {stats.priceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
