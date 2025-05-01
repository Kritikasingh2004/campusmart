"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

function NotFoundContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <Container className="py-16">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
            <p className="text-muted-foreground mb-8">
              The page you are looking for doesn&apos;t exist or has been moved.
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Return to Home
              </Link>
            </Button>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

// Loading fallback for the 404 page
function NotFoundLoadingFallback() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <Container className="py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="h-16 w-32 bg-primary/20 rounded-md animate-pulse mx-auto mb-4" />
            <div className="h-8 w-48 bg-muted rounded-md animate-pulse mx-auto mb-2" />
            <div className="h-4 w-64 bg-muted/50 rounded-md animate-pulse mx-auto mb-8" />
            <div className="h-10 w-40 bg-primary/30 rounded-full animate-pulse mx-auto" />
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={<NotFoundLoadingFallback />}>
      <NotFoundContent />
    </Suspense>
  );
}
