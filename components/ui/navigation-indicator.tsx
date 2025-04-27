"use client";

import { useNavigation } from "@/contexts/navigation-context";

export function NavigationIndicator() {
  const { isNavigating } = useNavigation();

  if (!isNavigating) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-background">
      <div className="h-full bg-primary animate-progress-indeterminate" />
    </div>
  );
}
