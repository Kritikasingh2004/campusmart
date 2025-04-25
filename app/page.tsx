import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Filters } from "@/components/listings/filters";
import { ProductCard } from "@/components/listings/product-card";
import { SearchBar } from "@/components/listings/search-bar";
import { generatePlaceholderImage } from "@/utils/image";
import { sortBy, groupBy } from "@/utils/array";
import { capitalizeWords } from "@/utils/string";

// Mock data for initial development
const MOCK_LISTINGS_RAW = [
  {
    id: "1",
    title: "calculus textbook",
    price: 450,
    imageUrl: "",
    location: "north campus",
    category: "books",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: "2",
    title: "study desk",
    price: 1200,
    imageUrl: "",
    location: "south campus",
    category: "furniture",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: "3",
    title: "scientific calculator",
    price: 800,
    imageUrl: "",
    location: "east campus",
    category: "electronics",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: "4",
    title: "laptop stand",
    price: 350,
    imageUrl: "",
    location: "west campus",
    category: "electronics",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
  {
    id: "5",
    title: "college hoodie",
    price: 600,
    imageUrl: "",
    location: "north campus",
    category: "clothing",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
  },
  {
    id: "6",
    title: "chemistry lab manual",
    price: 250,
    imageUrl: "",
    location: "south campus",
    category: "books",
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
  },
];

// Process the mock data using our utility functions
const MOCK_LISTINGS = MOCK_LISTINGS_RAW.map((listing) => ({
  ...listing,
  title: capitalizeWords(listing.title),
  location: capitalizeWords(listing.location),
  category: capitalizeWords(listing.category),
  imageUrl: generatePlaceholderImage(
    300,
    300,
    listing.title,
    "e2e8f0",
    "64748b"
  ),
}));

// Group listings by category (for demonstration)
const listingsByCategory = groupBy(MOCK_LISTINGS, "category");

// Sort listings by price (for demonstration)
const listingsSortedByPrice = sortBy(MOCK_LISTINGS, "price", "asc");

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Container className="py-8">
          <div className="mb-8 max-w-3xl">
            <PageHeader
              title="Campus Marketplace"
              description="Buy and sell second-hand items on campus easily and safely."
            >
              <div className="mt-4">
                <SearchBar
                  onSearch={(query) => console.log("Search:", query)}
                  placeholder="Search for textbooks, furniture, electronics..."
                />
              </div>
            </PageHeader>
          </div>

          <div className="mt-8">
            <Filters
              onFilterChange={(filters) => console.log("Filters:", filters)}
            />
          </div>

          {/* Display listings sorted by price */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Listings by Price (Low to High)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {listingsSortedByPrice.map((listing) => (
                <ProductCard
                  key={listing.id}
                  id={listing.id}
                  title={listing.title}
                  price={listing.price}
                  imageUrl={listing.imageUrl}
                  location={listing.location}
                  category={listing.category}
                  createdAt={listing.createdAt}
                />
              ))}
            </div>
          </div>

          {/* Display listings grouped by category */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">
              Listings by Category
            </h2>
            {Object.entries(listingsByCategory).map(([category, listings]) => (
              <div key={category} className="mb-8">
                <h3 className="text-xl font-medium mb-4">{category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {listings.map((listing) => (
                    <ProductCard
                      key={listing.id}
                      id={listing.id}
                      title={listing.title}
                      price={listing.price}
                      imageUrl={listing.imageUrl}
                      location={listing.location}
                      category={listing.category}
                      createdAt={listing.createdAt}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
