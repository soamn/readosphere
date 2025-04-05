// lib/data.ts
import { prisma } from "./prisma";

export async function getPostById(id: number) {
  return prisma.post.findUnique({
    where: { id },
    include: { category: true },
  });
}

export async function getAllCategories() {
  return prisma.category.findMany();
}
