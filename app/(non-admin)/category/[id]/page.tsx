import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

const CategoryPage = async (context: { params: Promise<{ id: number }> }) => {
  const id = (await context.params).id;

  const posts = await prisma.post.findMany({
    where: {
      categoryId: Number(id),
      published: true,
    },
    include: {
      category: true,
    },
  });

  if (!posts || posts.length === 0) {
    return notFound();
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-20 mt-50">
      {/* Category Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 sm:mb-10">
        {posts[0]?.category?.name}
      </h1>

      {/* Post List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            href={`/${post.slug}`}
            key={post.id}
            className="border border-gray-200 hover:border-black rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all bg-white"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-black mb-2">
              {post.metaTitle}
            </h2>
            <p className="text-gray-500 text-sm sm:text-base line-clamp-3">
              {post.metaDescription}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
