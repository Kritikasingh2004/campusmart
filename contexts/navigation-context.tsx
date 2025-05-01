"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Suspense,
} from "react";
import { usePathname, useRouter } from "next/navigation";

interface NavigationContextType {
  isNavigating: boolean;
  startNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

// Inner provider that uses searchParams
function NavigationProviderInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  // Reset the state when the route changes
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

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

// Loading fallback for the navigation provider
function NavigationProviderFallback() {
  return null; // Simple fallback that doesn't show anything
}

// Outer provider that wraps the inner provider in Suspense
export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<NavigationProviderFallback />}>
      <NavigationProviderInner>{children}</NavigationProviderInner>
    </Suspense>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
