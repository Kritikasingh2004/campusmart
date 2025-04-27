import { EditListingClient } from "./client";

type Params = Promise<{ id: string }>;

export default async function EditListingPage({ params }: { params: Params }) {
  const { id } = await params;

  return <EditListingClient id={id} />;
}
