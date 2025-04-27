import { ListingDetailClient } from "./client";

type Params = Promise<{ id: string }>;

export default async function ListingDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  return <ListingDetailClient id={id} />;
}
