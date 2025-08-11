import path from "path";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { mkdir, writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { uploadImageToVercelBlob } from "@/lib/uploadImageToVercelBlob";

const isBrowserRequest = (req: NextRequest): boolean => {
  const userAgent = req.headers.get("user-agent") || "";
  const referer = req.headers.get("referer") || "";
  return (
    !req.headers.get("Authorization") &&
    (!referer || userAgent.includes("Mozilla"))
  );
};

export async function GET(req: NextRequest) {
  if (isBrowserRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const metaTitle = formData.get("metaTitle") as string;
  const metaDescription = formData.get("metaDescription") as string;
  const slug = formData.get("slug") as string;
  const metaTags = formData.get("tags") as string;
  const content = formData.get("content") as string;
  const categoryId = formData.get("categoryId") as string;
  const file = formData.get("thumbnail") as File;
  try {
    const exisitingPost = await prisma.post.findFirst({
      where: {
        slug: slug,
      },
    });
    if (exisitingPost) {
      return NextResponse.json({
        status: 403,
        success: false,
        message: "Post already exists with this slug",
      });
    }

    let savedThumbnailPath: string = "";

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

      savedThumbnailPath = await uploadImageToVercelBlob(
        dataUrl,
        folderName,
        safeSlug
      );
    }

    const adminUser = await prisma.user.findFirst({
      where: { email: "admin@readosphere.com" },
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: "Admin user not found" },
        { status: 400 }
      );
    }
    const newPost = await prisma.post.create({
      data: {
        metaTitle,
        metaDescription,
        metaTags,
        content,
        slug,
        thumbnail: savedThumbnailPath,
        category: { connect: { id: Number(categoryId) } },
        user: { connect: { id: adminUser.id } },
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({
      status: 201,
      message: "Successfully created post",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
