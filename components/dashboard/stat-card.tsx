import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: ReactNode;
  value: ReactNode;
  description: ReactNode;
  icon: LucideIcon | (() => JSX.Element);
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {typeof Icon === "function" && !("$$typeof" in Icon) ? (
          <Icon />
        ) : (
          // @ts-ignore - We know this is a LucideIcon at this point
          <Icon className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <span className="text-xs text-muted-foreground block">
          {description}
        </span>
      </CardContent>
    </Card>
  );
}
