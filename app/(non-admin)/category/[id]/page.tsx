import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

const CategoryPage = async (context: { params: Promise<{ id: number }> }) => {
  const id = (await context.params).id;

  const posts = await prisma.post.findMany({
    where: {
      categoryId: Number(id),
    },
    include: {
      category: true,
    },
  });

  if (!posts || posts.length === 0) {
    return notFound();
  }

  return (
    <div className="w-full max-w-6xl mt-30 mx-auto px-4 sm:px-6 lg:px-10 py-16">
      {/* Breadcrumb */}
      <Breadcrumb className="list-none flex items-center gap-2 mb-6 ">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <span className="font-medium ">{posts[0]?.category?.name}</span>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Category Title */}
      <h1 className="text-7xl font-bold mb-10 ">{posts[0]?.category?.name}</h1>

      {/* Post List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            href={`/${post.slug}`}
            key={post.id}
            className="border border-gray-200 hover:border-black rounded-2xl p-6 shadow-sm hover:shadow-md transition-all bg-white"
          >
            <h2 className="text-xl font-semibold text-black mb-2">
              {post.title}
            </h2>
            <p className="text-gray-500 line-clamp-3">{post.metaDescription}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
