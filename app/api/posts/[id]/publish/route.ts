import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: { id: string } } // ✅ Correctly typed params
) {
  try {
    const id = parseInt(params.id, 10); // ✅ Parse once

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const existingPost = await prisma.post.findUnique({
      where: { id }, // ✅ Already parsed
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Toggle published status
    const updatedPost = await prisma.post.update({
      where: { id },
      data: { published: !existingPost.published },
    });

    return NextResponse.json({
      message: `Post ${updatedPost.published ? "published" : "unpublished"}`,
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
