"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function useNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Reset the state when the route changes
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname, searchParams]);
  
  // Function to trigger navigation state
  const startNavigation = () => {
    setIsNavigating(true);
  };
  
  return {
    isNavigating,
    startNavigation
  };
}
