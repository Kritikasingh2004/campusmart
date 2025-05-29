"use client";

import { useState, useEffect } from "react";
import { NavigationLink } from "@/components/ui/navigation-link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";
import { LogoutButton } from "@/components/auth/logout-button";
import { getInitials } from "@/utils/string";
import { createClient } from "@/utils/supabase/client";
import { User } from "@/types/user";

export function Navbar() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);

  // Fetch user profile from the users table
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching user profile:", error);
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, [user]);

  return (
    <nav className="border-b bg-background sticky top-0 z-10">
      <div className="container mx-auto flex h-16 items-center px-4">
        <NavigationLink href="/" className="text-xl font-bold">
          CampusMart
        </NavigationLink>

        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <NavigationLink href="/create-listing">Sell Item</NavigationLink>
          </Button>

          {!loading && user ? (
            <>
              <Button variant="ghost" asChild>
                <NavigationLink href="/dashboard">Dashboard</NavigationLink>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    {profile?.avatar_url ? (
                      <AvatarImage
                        src={profile.avatar_url}
                        alt={profile.name || user.user_metadata?.name || "User"}
                        onError={(e) => {
                          console.error(
                            "Failed to load navbar avatar:",
                            profile.avatar_url
                          );
                          // Hide the image element on error
                          e.currentTarget.style.display = "none";
                          // Show the fallback
                          e.currentTarget.parentElement
                            ?.querySelector("[data-fallback]")
                            ?.removeAttribute("hidden");
                        }}
                      />
                    ) : null}
                    <AvatarFallback
                      data-fallback
                      hidden={!!profile?.avatar_url}
                    >
                      {getInitials(
                        profile?.name || user.user_metadata?.name || "User"
                      )}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {profile?.name || user.user_metadata?.name || "My Account"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <NavigationLink href="/dashboard">Dashboard</NavigationLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavigationLink href="/profile">My Profile</NavigationLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <LogoutButton variant="ghost" className="w-full text-left">
                      Logout
                    </LogoutButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild>
              <NavigationLink href="/login">Login</NavigationLink>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
