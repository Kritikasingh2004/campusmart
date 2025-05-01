"use client";

import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

export function HeroSectionSkeleton() {
  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
      <Container className="py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <Skeleton className="h-12 w-3/4 mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-2/3 mb-6" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-12 w-36 rounded-full" />
              <Skeleton className="h-12 w-36 rounded-full" />
            </div>
          </div>
          <div className="flex-shrink-0 w-full md:w-1/3 lg:w-2/5 flex justify-center">
            <Skeleton className="w-full max-w-sm aspect-square rounded-2xl" />
          </div>
        </div>
      </Container>
    </div>
  );
}
