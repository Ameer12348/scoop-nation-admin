import EditBanner from "@/components/banners/EditBanner";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <EditBanner id={id} />
    </div>
  );
}
