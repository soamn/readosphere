import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const deletedPost = await prisma.post.delete({
      where: { id },
    });

    if (deletedPost.thumbnail) {
      const filePath = path.join(
        process.cwd(),
        "public",
        deletedPost.thumbnail
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the file
      }
    }

    revalidatePath(`/${deletedPost.slug}`);
    revalidatePath("/");

    return NextResponse.json({
      message: `Post ${deletedPost.title} deleted successfully`,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
