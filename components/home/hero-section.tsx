"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { NavigationLink } from "@/components/ui/navigation-link";
import { ShoppingBag, Tag, BookOpen, Laptop, Sofa } from "lucide-react";

export function HeroSection() {
  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
      <Container className="py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Campus Marketplace
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Buy and sell second-hand items on campus easily and safely.
              Find great deals or make some extra cash.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="rounded-full">
                <NavigationLink href="/create-listing">
                  <Tag className="mr-2 h-5 w-5" />
                  Sell an Item
                </NavigationLink>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <NavigationLink href="#browse">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Browse Items
                </NavigationLink>
              </Button>
            </div>
          </div>
          <div className="flex-shrink-0 w-full md:w-1/3 lg:w-2/5 flex justify-center">
            <div className="relative w-full max-w-sm aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-2 shadow-xl">
              <div className="absolute -top-4 -left-4 bg-primary/10 rounded-xl w-24 h-24 animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 bg-primary/10 rounded-xl w-32 h-32 animate-pulse delay-700"></div>
              <div className="relative h-full w-full rounded-xl overflow-hidden border bg-card flex items-center justify-center">
                <div className="grid grid-cols-2 gap-2 p-4 w-full">
                  <div className="aspect-square rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-primary/60" />
                  </div>
                  <div className="aspect-square rounded-lg bg-primary/10 flex items-center justify-center">
                    <Laptop className="h-10 w-10 text-primary/60" />
                  </div>
                  <div className="aspect-square rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sofa className="h-10 w-10 text-primary/60" />
                  </div>
                  <div className="aspect-square rounded-lg bg-primary/10 flex items-center justify-center">
                    <ShoppingBag className="h-10 w-10 text-primary/60" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
