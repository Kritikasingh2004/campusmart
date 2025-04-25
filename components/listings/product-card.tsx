import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/utils/format";
import { formatRelativeTime } from "@/utils/date";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "lucide-react";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  location: string;
  category?: string;
  createdAt?: string;
  isLoading?: boolean;
}

export function ProductCard({
  id,
  title,
  price,
  imageUrl,
  location,
  category,
  createdAt,
  isLoading = false,
}: ProductCardProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <Skeleton className="h-48 w-full rounded-none" />
        </CardHeader>
        <CardContent className="p-4">
          <Skeleton className="h-4 w-2/3 mb-2" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Link href={`/listing/${id}`} className="block h-full">
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
        <CardHeader className="p-0">
          <div className="relative aspect-square overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                <span className="text-sm text-muted-foreground">No image</span>
              </div>
            )}
            {category && (
              <Badge className="absolute top-2 right-2">{category}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-base line-clamp-1">{title}</CardTitle>
          <div className="flex items-center justify-between mt-2">
            <p className="font-bold text-primary">{formatPrice(price)}</p>
            <p className="text-xs text-muted-foreground">{location}</p>
          </div>
          {createdAt && (
            <div className="flex items-center mt-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>{formatRelativeTime(new Date(createdAt))}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
