import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-medium">CampusMart</h3>
            <p className="text-sm text-muted-foreground">
              Buy and sell second-hand items on campus easily and safely.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/upload"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sell Item
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/?category=books"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Books
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=electronics"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=furniture"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Furniture
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=clothing"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clothing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">
                Email: support@campusmart.com
              </li>
              <li className="text-muted-foreground">Phone: +91 1234567890</li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CampusMart. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
