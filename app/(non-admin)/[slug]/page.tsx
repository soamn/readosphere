import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
    <div className="container mx-auto post space-y-6">
      <Breadcrumb className="list-none flex items-center gap-2  ">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink>{post.title}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: post?.content || "" }}
      ></div>

      <Script
        type="application/ld+json"
        suppressHydrationWarning
        key={"blog-jsonld"}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
};

export default PostPage;
