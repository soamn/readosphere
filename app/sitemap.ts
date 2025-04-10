import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post.findMany({
    where: { published: true }, 
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://readosphere.com/${post.slug}`,
    lastModified: post.updatedAt,
  }));

  return [
    {
      url: `https://readosphere.com`,
      lastModified: new Date(),
    },
    ...postEntries,
  ];
}
