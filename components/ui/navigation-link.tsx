"use client";

import Link from "next/link";
import { useNavigation } from "@/contexts/navigation-context";
import { ComponentProps, MouseEvent } from "react";

type NavigationLinkProps = ComponentProps<typeof Link> & {
  showIndicator?: boolean;
};

export function NavigationLink({
  children,
  showIndicator = true,
  onClick,
  ...props
}: NavigationLinkProps) {
  const { startNavigation } = useNavigation();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (showIndicator) {
      startNavigation();
    }

    // Call the original onClick handler if it exists
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Link {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}
