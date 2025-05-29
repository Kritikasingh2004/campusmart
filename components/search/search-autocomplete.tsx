"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Listing } from "@/types/listing";
import { debounce } from "@/utils/function";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchAutocompleteProps {
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchAutocomplete({
  onSearch,
  className,
}: SearchAutocompleteProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Listing[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sync searchQuery with URL parameters
  useEffect(() => {
    const queryFromUrl = searchParams.get("query") || "";
    setSearchQuery(queryFromUrl);
  }, [searchParams]);

  // Fetch suggestions based on search query
  const fetchSuggestions = useCallback(
    async (query: string) => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery || trimmedQuery.length < 1) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("listings")
          .select(
            "id, title, price, category, description, image_url, location, user_id, created_at, is_sold"
          )
          .eq("is_sold", false)
          .ilike("title", `%${trimmedQuery}%`)
          .limit(5);

        if (error) {
          throw error;
        }

        // Type assertion to ensure data matches Listing type
        setSuggestions((data as Listing[]) || []);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [supabase]
  );

  // Debounced search function
  const debouncedSearch = useCallback(
    (query: string) => {
      // Create a debounced function that accepts any arguments but we'll only use it with a string
      const debouncedFn = debounce(function (q: unknown) {
        fetchSuggestions(q as string);
      }, 300);
      debouncedFn(query);
    },
    [fetchSuggestions]
  );

  // Update suggestions when search query changes
  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [searchQuery, debouncedSearch]);

  // Handle search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  // Handle search form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Trim the search query to remove leading/trailing whitespace
    const trimmedQuery = searchQuery.trim();

    // Update the local state with trimmed query
    setSearchQuery(trimmedQuery);

    // Update URL with search query
    const params = new URLSearchParams(searchParams.toString());
    if (trimmedQuery) {
      params.set("query", trimmedQuery);
    } else {
      params.delete("query");
    }

    // Update URL without refreshing the page
    router.replace(`/?${params.toString()}`, { scroll: false });

    // Close the dropdown
    setIsOpen(false);

    // Call the onSearch callback if provided
    // This is optional since the URL change will trigger filtering in useListingsFilter
    if (onSearch) {
      onSearch(trimmedQuery);
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (listing: Listing) => {
    const trimmedTitle = listing.title.trim();
    setSearchQuery(trimmedTitle);
    setIsOpen(false);

    // Update URL with search query
    const params = new URLSearchParams(searchParams.toString());
    params.set("query", trimmedTitle);

    // Update URL without refreshing the page
    router.replace(`/?${params.toString()}`, { scroll: false });

    // Call the onSearch callback if provided
    // This is optional since the URL change will trigger filtering in useListingsFilter
    if (onSearch) {
      onSearch(trimmedTitle);
    }
  };

  // Clear search query
  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setIsOpen(false);

    // Update URL by removing query parameter
    const params = new URLSearchParams(searchParams.toString());
    params.delete("query");

    // Update URL without refreshing the page
    router.replace(`/?${params.toString()}`, { scroll: false });

    // Call the onSearch callback if provided
    // This is optional since the URL change will trigger filtering in useListingsFilter
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for items..."
            className="pl-10 pr-10 h-12 text-base rounded-r-none border-r-0"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            aria-label="Search for items"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground flex items-center justify-center w-6 h-6 rounded-full hover:bg-muted/50 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          type="submit"
          className="h-12 rounded-l-none bg-slate-900 hover:bg-slate-800"
        >
          Search
        </Button>
      </form>

      {isOpen && (
        <div className="absolute w-full z-50 mt-1 rounded-md border bg-white shadow-md">
          <div className="p-2">
            {isLoading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Loading suggestions...
              </div>
            ) : suggestions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No results found
              </div>
            ) : (
              <div>
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Suggestions
                </div>
                {suggestions.map((listing) => (
                  <div
                    key={listing.id}
                    onClick={() => handleSelectSuggestion(listing)}
                    className="flex justify-between items-center px-2 py-3 text-sm rounded-md cursor-pointer hover:bg-slate-100"
                  >
                    <span className="truncate">{listing.title}</span>
                    <span className="text-muted-foreground ml-2">
                      ₹{listing.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
