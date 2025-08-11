import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { uploadImageToVercelBlob } from "@/lib/uploadImageToVercelBlob";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { params } = context;
  const slug = (await params).slug;
  console.log("slug", slug);
  try {
    const post = await prisma.post.findFirst({
      where: {
        id: Number(slug),
      },
    });
    if (!post) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "Post Not Found",
      });
    }
    return NextResponse.json({
      status: 200,
      success: true,
      message: { post },
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Failed to complete the request",
    });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const formData = await req.formData();
  const metaTitle = formData.get("metaTitle") as string;
  const metaDescription = formData.get("metaDescription") as string;
  const slug = formData.get("slug") as string;
  const metaTags = formData.get("tags") as string;
  const published = formData.get("published") as string;
  const featured = formData.get("featured") as string;
  const content = formData.get("content") as string;
  const file = formData.get("thumbnail") as File;
  const categoryId = formData.get("categoryId") as string;

  const { params } = context;
  const id = (await params).slug;

  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id, 10) },
    });

    let thumbnailPath = post?.thumbnail ?? "";
    if (file && post?.thumbnail) {
      await del(post.thumbnail);
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Data = buffer.toString("base64");

      const now = new Date();
      const folderName = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`;

      const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "");

      thumbnailPath = await uploadImageToVercelBlob(
        base64Data,
        folderName,
        safeSlug
      );
    }

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Data = buffer.toString("base64");
      const dataUrl = `data:image/png;base64,${base64Data}`;
      const now = new Date();
      const folderName = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`;

      const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "");

      thumbnailPath = await uploadImageToVercelBlob(
        dataUrl,
        folderName,
        safeSlug
      );
    }

    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        metaTitle,
        metaDescription,
        slug,
        metaTags,
        content,
        category: { connect: { id: Number(categoryId) } },
        published: published === "1",
        isFeatured: featured === "1",
        thumbnail: thumbnailPath,
      },
    });

    revalidatePath(`/${updatedPost.slug}`);
    revalidatePath("/");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Post updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Failed to complete the request",
    });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { params } = context;
  const { slug } = await params;
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(slug) },
    });

    if (!post) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "Post not found",
      });
    }

    if (post.thumbnail) {
      await del(post.thumbnail);
    }

    await prisma.post.delete({
      where: { slug: post.slug },
    });

    revalidatePath(`/${slug}`);
    revalidatePath("/");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Failed to complete the request",
    });
  }
}
