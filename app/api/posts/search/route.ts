import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("s");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { metaTitle: { contains: query } },
          { metaDescription: { contains: query } },
          { metaTags: { contains: query } },
          { content: { contains: query } },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error searching posts:", error);
    return NextResponse.json(
      { error: "Failed to search posts" },
      { status: 500 }
    );
  }
}
