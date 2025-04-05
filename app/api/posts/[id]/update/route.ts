import path from "path";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { mkdir, writeFile } from "fs/promises";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: number }> }
) {
  const { params } = context;
  const id = (await params).id;

  try {
    const {
      title,
      metaTitle,
      metaDescription,
      metaTags,
      content,
      categoryId,
      slug,
      thumbnail,
    } = await req.json();

    if (
      !title ||
      !metaTitle ||
      !metaDescription ||
      !metaTags ||
      !content ||
      !slug ||
      !categoryId
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    let savedThumbnailPath: string | null = null;

    // Only process thumbnail if it's a base64-encoded image
    const isBase64Image =
      typeof thumbnail === "string" && thumbnail.startsWith("data:image");

    if (isBase64Image) {
      const matches = thumbnail.match(/^data:(.+);base64,(.+)$/);
      if (!matches) {
        return NextResponse.json(
          { error: "Invalid image format" },
          { status: 400 }
        );
      }

      const mimeType = matches[1];
      const ext = mimeType.split("/")[1];
      const buffer = Buffer.from(matches[2], "base64");

      const resizedBuffer = await sharp(buffer)
        .resize(1200, 630, { fit: "cover" })
        .toFormat(ext === "jpg" ? "jpeg" : (ext as keyof sharp.FormatEnum))
        .toBuffer();

      const now = new Date();
      const folderName = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`;
      const uploadDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        folderName
      );
      await mkdir(uploadDir, { recursive: true });

      const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "");
      const fileName = `${safeSlug}-${Date.now()}.${ext}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, resizedBuffer);
      savedThumbnailPath = `/uploads/${folderName}/${fileName}`;
    }

    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        title,
        metaTitle,
        metaDescription,
        metaTags,
        slug,
        content,
        ...(savedThumbnailPath && { thumbnail: savedThumbnailPath }),
        category: { connect: { id: categoryId } },
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
