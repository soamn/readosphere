import EditStudio from "./edit";

export default async function EditPage({ params }: { params: { id: string } }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${(await params).id}/edit`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    return <div className="text-center">Error loading post</div>;
  }

  const post = await res.json();

  return <EditStudio initialData={post} />;
}
