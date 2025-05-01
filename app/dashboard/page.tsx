"use client";

import { useState, useCallback } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { UserListings } from "@/components/dashboard/user-listings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useAuth } from "@/contexts/auth-context";

export default function DashboardPage() {
  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to trigger refresh of both listings and stats
  const refreshDashboard = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Container className="py-8">
            <PageHeader
              title="Dashboard"
              description="Manage your listings and account"
            />

            <Tabs defaultValue="listings" className="mt-6">
              <TabsList className="mb-4">
                <TabsTrigger value="listings">My Listings</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
              </TabsList>

              <TabsContent value="listings" className="space-y-4">
                <UserListings
                  userId={user?.id}
                  showSold={true}
                  refreshTrigger={refreshTrigger}
                  onStatusChange={refreshDashboard}
                />
              </TabsContent>

              <TabsContent value="stats">
                <DashboardStats
                  userId={user?.id}
                  refreshTrigger={refreshTrigger}
                />
              </TabsContent>
            </Tabs>
          </Container>
        </main>
        <Footer />
      </div>
    </AuthGuard>
  );
}
