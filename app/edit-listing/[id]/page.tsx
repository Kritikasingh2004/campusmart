export default function EditListingPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Listing</h1>
      <p>Edit listing form for ID: {params.id} will go here</p>
    </div>
  );
}
