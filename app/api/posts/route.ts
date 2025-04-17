import path from "path";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { mkdir, writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
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
    return NextResponse.redirect(new URL("/not-found", req.url));
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
  try {
    const {
      title,
      metaTitle,
      metaDescription,
      tags,
      content,
      slug,
      category,
      thumbnail,
    } = await req.json();

    if (
      !title ||
      !metaTitle ||
      !metaDescription ||
      !tags ||
      !content ||
      !slug ||
      !category
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    let savedThumbnailPath: string | null = null;

    if (thumbnail) {
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
        .toFormat(ext === "jpg" ? "jpeg" : ext)
        .toBuffer();

      const now = new Date();
      const folderName = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`;
      const uploadDir = path.join(process.cwd(), "uploads", folderName); // not public
      await mkdir(uploadDir, { recursive: true });

      const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "");
      const fileName = `${safeSlug}-${Date.now()}.${ext}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, resizedBuffer);

      // Save the path for the API route
      savedThumbnailPath = `/api/uploads/${folderName}/${fileName}`;
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
        title,
        metaTitle,
        metaDescription,
        metaTags: tags,
        content,
        slug,
        thumbnail: savedThumbnailPath,
        category: { connect: { id: Number(category) } },
        user: { connect: { id: adminUser.id } },
      },
    });

    revalidatePath("/");
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
