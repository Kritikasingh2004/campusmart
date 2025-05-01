export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  location: string;
  category: string;
  user_id: string;
  created_at: string;
  is_sold: boolean;
  users?: any; // This will hold the joined user data from Supabase
}

export interface ListingFormData {
  title: string;
  description: string;
  price: number;
  image_url?: string;
  location: string;
  category: string;
}

export type Category =
  | "books"
  | "electronics"
  | "furniture"
  | "clothing"
  | "other";

export type Location =
  | "north-campus"
  | "south-campus"
  | "east-campus"
  | "west-campus";
