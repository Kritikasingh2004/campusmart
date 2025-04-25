"use client";

import { useState } from "react";
import { CategorySelect } from "@/components/listings/category-select";
import { LocationSelect } from "@/components/listings/location-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CategorySelectExamplePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Category & Location Select Examples</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Select</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <CategorySelect 
                defaultValue={selectedCategory} 
                onCategoryChange={handleCategoryChange} 
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Selected category: <span className="font-medium">{selectedCategory}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location Select</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <LocationSelect 
                defaultValue={selectedLocation} 
                onLocationChange={handleLocationChange} 
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Selected location: <span className="font-medium">{selectedLocation}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Combined Example</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CategorySelect 
                  defaultValue={selectedCategory} 
                  onCategoryChange={handleCategoryChange} 
                  className="w-full"
                />
                <LocationSelect 
                  defaultValue={selectedLocation} 
                  onLocationChange={handleLocationChange} 
                  className="w-full"
                />
              </div>
              <div className="pt-2">
                <Button onClick={() => alert(`Category: ${selectedCategory}, Location: ${selectedLocation}`)}>
                  Apply Filters
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Current filters: Category = <span className="font-medium">{selectedCategory}</span>, 
                Location = <span className="font-medium">{selectedLocation}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
