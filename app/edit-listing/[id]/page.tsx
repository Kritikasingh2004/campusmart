import { generatePlaceholderImage } from "@/utils/image";
import { EditListingClient } from "./client";

// Mock data for initial development
const MOCK_LISTING = {
  id: "1",
  title: "Calculus Textbook",
  description:
    "Calculus: Early Transcendentals, 8th Edition. In excellent condition with minimal highlighting. Perfect for Calculus I and II courses.",
  price: 450,
  image_url: generatePlaceholderImage(600, 400, "Calculus Textbook"),
  location: "North Campus",
  category: "Books",
  user_id: "user123",
  created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
};

type Params = Promise<{ id: string }>;

export default async function EditListingPage({ params }: { params: Params }) {
  const { id } = await params;

  return <EditListingClient id={id} mockListing={MOCK_LISTING} />;
}
