"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface PlaceholderImageProps {
  text?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function PlaceholderImage({
  text = "No Image",
  width = 300,
  height = 300,
  className,
}: PlaceholderImageProps) {
  // Generate a simple SVG placeholder with text
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#e2e8f0" />
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${
        Math.min(width, height) / 15
      }px" fill="#64748b" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>
  `;

  const svgBase64 = Buffer.from(svgContent).toString("base64");
  const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted",
        className
      )}
      style={{ width, height }}
    >
      <Image
        src={dataUrl}
        alt={text}
        width={width}
        height={height}
        className="object-cover"
      />
    </div>
  );
}
