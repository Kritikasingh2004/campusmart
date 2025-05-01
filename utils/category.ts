import { BookOpen, Laptop, Sofa, ShoppingBag } from "lucide-react";
import React from "react";

/**
 * Returns an appropriate icon component based on the category name
 */
export function getCategoryIcon(category: string): React.ReactNode {
  const lowerCategory = category.toLowerCase();

  if (lowerCategory.includes("book") || lowerCategory.includes("textbook")) {
    return React.createElement(BookOpen, {
      className: "h-5 w-5 mr-2 text-primary/70",
    });
  } else if (
    lowerCategory.includes("electronic") ||
    lowerCategory.includes("tech") ||
    lowerCategory.includes("computer")
  ) {
    return React.createElement(Laptop, {
      className: "h-5 w-5 mr-2 text-primary/70",
    });
  } else if (
    lowerCategory.includes("furniture") ||
    lowerCategory.includes("home")
  ) {
    return React.createElement(Sofa, {
      className: "h-5 w-5 mr-2 text-primary/70",
    });
  } else {
    return React.createElement(ShoppingBag, {
      className: "h-5 w-5 mr-2 text-primary/70",
    });
  }
}
