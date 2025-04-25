export default function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Listing Detail</h1>
      <p>Listing details for ID: {params.id} will go here</p>
    </div>
  );
}
