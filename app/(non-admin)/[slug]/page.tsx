import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";

export const revalidate = 7200;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    select: { slug: true },
  });

  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug: slug, published: true },
    include: {
      category: true,
    },
  });
  return {
    title: {
      absolute: post?.metaTitle || "Readosphere",
    },
    description:
      post?.metaDescription || "Read insightful posts on Readosphere.",
    keywords: post?.metaTags,

    openGraph: {
      images: [
        {
          url: post?.thumbnail || "",
        },
      ],
    },
  };
}

const PostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug: slug, published: true },
    include: {
      category: true,
    },
  });

  if (!post) {
    return notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.metaTitle,
    description: post.metaDescription,
    image: post.thumbnail,
    author: {
      "@type": "Person",
      name: "Readosphere",
    },
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://readosphere.com/${post.slug}`,
    },
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-20 ">
      <div className="w-full mx-auto post space-y-6 mt-16 sm:mt-24 md:mt-32 lg:mt-40 px-4 sm:px-6 md:px-10 lg:px-28 lg:py-20 bg-white">
        <div
          className="prose prose-sm sm:prose md:prose-base lg:prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post?.content || "" }}
        ></div>

        <Script
          type="application/ld+json"
          suppressHydrationWarning
          key="blog-jsonld"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </div>
    </div>
  );
};

export default PostPage;
