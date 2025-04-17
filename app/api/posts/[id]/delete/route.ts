import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;

  try {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const existingPost = await prisma.post.findUnique({
      where: { id: numericId },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const deletedPost = await prisma.post.delete({
      where: { id: numericId },
    });

    if (deletedPost.thumbnail) {
      const thumbnailRelativePath = deletedPost.thumbnail.replace(/^\/api/, "");
      const filePath = path.join(process.cwd(), thumbnailRelativePath);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    revalidatePath(`/${deletedPost.slug}`);
    revalidatePath("/");

    return NextResponse.json({
      message: `Post "${deletedPost.title}" deleted successfully.`,
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
