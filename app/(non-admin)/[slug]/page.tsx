import { prisma } from "@/lib/prisma";

export const revalidate = 7200;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    select: { slug: true },
  });

  return posts.map((post) => ({ slug: post.slug }));
}

const PostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug: slug },
    include: {
      category: true,
    },
  });

  return (
    <div className="container mx-auto post">
      <div dangerouslySetInnerHTML={{ __html: post?.content || "" }}></div>
    </div>
  );
};

export default PostPage;
