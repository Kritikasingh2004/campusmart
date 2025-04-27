import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth-context";
import { NavigationProvider } from "@/contexts/navigation-context";
import { NavigationIndicator } from "@/components/ui/navigation-indicator";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CampusMart - Buy and Sell Second-Hand Items on Campus",
  description:
    "Find affordable textbooks, furniture, electronics, and more from fellow students. The trusted marketplace for campus communities.",
  keywords:
    "campus marketplace, student marketplace, second-hand, used textbooks, college furniture, student deals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <NavigationProvider>
            <NavigationIndicator />
            {children}
            <Toaster />
          </NavigationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
