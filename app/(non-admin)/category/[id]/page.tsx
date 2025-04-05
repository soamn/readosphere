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

  if (posts.length === 0) {
    return notFound();
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Posts in Category {posts[0]?.category?.name}
      </h1>

      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="border p-4 rounded shadow">
            <Link href={`/${post.slug}`}>
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-600">{post.metaDescription}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryPage;
