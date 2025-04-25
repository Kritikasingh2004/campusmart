import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const width = parseInt(searchParams.get("width") || "300", 10);
  const height = parseInt(searchParams.get("height") || "300", 10);
  const text = searchParams.get("text") || "No Image";
  const bgColor = searchParams.get("bgColor") || "e2e8f0";
  const textColor = searchParams.get("textColor") || "64748b";

  // Create a simple SVG placeholder
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#${bgColor}" />
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${
        Math.min(width, height) / 15
      }px" fill="#${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>
  `;

  return new NextResponse(svgContent, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
