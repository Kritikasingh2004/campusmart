import { ReactNode, ElementType } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type IconComponent = LucideIcon | ElementType;

interface StatCardProps {
  title: ReactNode;
  value: ReactNode;
  description: ReactNode;
  icon: IconComponent | (() => ReactNode);
  className?: string;
  iconClassName?: string;
  valueClassName?: string;
  descriptionClassName?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  className,
  iconClassName,
  valueClassName,
  descriptionClassName,
}: StatCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {typeof Icon === "function" && !("$$typeof" in Icon) ? (
          <Icon />
        ) : (
          <Icon
            className={cn("h-4 w-4 text-muted-foreground", iconClassName)}
          />
        )}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", valueClassName)}>{value}</div>
        <span
          className={cn(
            "text-xs text-muted-foreground block",
            descriptionClassName
          )}
        >
          {description}
        </span>
      </CardContent>
    </Card>
  );
}
