"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

interface NavigationContextType {
  isNavigating: boolean;
  startNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  // Reset the state when the route changes
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname, searchParams]);

  // Listen for navigation events from Next.js Router
  useEffect(() => {
    const handleStart = () => {
      setIsNavigating(true);
    };

    // Add event listeners for router events
    window.addEventListener("beforeunload", handleStart);

    // Clean up event listeners
    return () => {
      window.removeEventListener("beforeunload", handleStart);
    };
  }, [router]);

  // Function to trigger navigation state with auto-reset
  const startNavigation = () => {
    setIsNavigating(true);

    // Auto-reset after 5 seconds to prevent indefinite loading state
    setTimeout(() => {
      setIsNavigating(false);
    }, 5000);
  };

  return (
    <NavigationContext.Provider value={{ isNavigating, startNavigation }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
