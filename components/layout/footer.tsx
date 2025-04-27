import { NavigationLink } from "@/components/ui/navigation-link";
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
                <NavigationLink
                  href="/"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Home
                </NavigationLink>
              </li>
              <li>
                <NavigationLink
                  href="/upload"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sell Item
                </NavigationLink>
              </li>
              <li>
                <NavigationLink
                  href="/dashboard"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Dashboard
                </NavigationLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <NavigationLink
                  href="/?category=books"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Books
                </NavigationLink>
              </li>
              <li>
                <NavigationLink
                  href="/?category=electronics"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Electronics
                </NavigationLink>
              </li>
              <li>
                <NavigationLink
                  href="/?category=furniture"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Furniture
                </NavigationLink>
              </li>
              <li>
                <NavigationLink
                  href="/?category=clothing"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clothing
                </NavigationLink>
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
            <NavigationLink
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Terms
            </NavigationLink>
            <NavigationLink
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacy
            </NavigationLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
