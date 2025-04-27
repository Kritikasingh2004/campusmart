"use client";

import { User } from "@/types/user";
import { useProfile } from "@/hooks/use-profile";
import { formatRelativeTime } from "@/utils/date";
import { getInitials } from "@/utils/string";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Calendar, Mail, Edit } from "lucide-react";

interface UserInfoProps {
  user?: User | null;
  isCurrentUser?: boolean;
}

export function UserInfo({
  user: propUser,
  isCurrentUser = false,
}: UserInfoProps) {
  const { profile, loading } = useProfile();

  // Use provided user or profile from hook
  const user = propUser || profile;

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-start gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // No user state
  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>User information not available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This user profile could not be loaded or does not exist.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-4">
        <Avatar className="h-16 w-16 border-2 border-border">
          {user.avatar_url ? (
            <AvatarImage
              src={user.avatar_url}
              alt={user.name}
              onError={(e) => {
                console.error("Failed to load avatar image:", user.avatar_url);
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
            className="bg-primary/10 text-primary text-xl"
            data-fallback
            hidden={!!user.avatar_url}
          >
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-xl">{user.name}</CardTitle>
          <CardDescription className="flex items-center mt-1">
            <Mail className="h-3.5 w-3.5 mr-1" />
            {user.email || "Email not provided"}
          </CardDescription>
          <div className="flex flex-wrap gap-2 mt-2">
            {user.location && (
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {user.location}
              </Badge>
            )}
            {user.created_at && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Joined {formatRelativeTime(user.created_at)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {user.bio && (
          <div>
            <h3 className="text-sm font-medium mb-1">About</h3>
            <p className="text-sm text-muted-foreground">{user.bio}</p>
          </div>
        )}

        {user.phone && (
          <div>
            <h3 className="text-sm font-medium mb-1">Contact</h3>
            <p className="text-sm text-muted-foreground flex items-center">
              <Phone className="h-3.5 w-3.5 mr-1" />
              {user.phone}
            </p>
          </div>
        )}
      </CardContent>

      {isCurrentUser && (
        <CardFooter>
          <Button variant="outline" size="sm" asChild className="w-full">
            <Link href="/profile">
              <Edit className="h-4 w-4 mr-2" />
              View Profile
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
