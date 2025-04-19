// app/api/homepage/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyAuthToken } from "@/utils/auth";
import path from "path";
import { mkdir, writeFile, unlink } from "fs/promises";
import sharp from "sharp";
import { revalidatePath } from "next/cache";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

async function saveImage(imageBase64: string, fileName: string) {
  if (typeof imageBase64 !== "string" || !imageBase64.startsWith("data:")) {
    throw new Error("Invalid image format");
  }

  const commaIndex = imageBase64.indexOf(",");
  if (commaIndex < 0) {
    throw new Error("Invalid base64 image data");
  }

  const meta = imageBase64.substring(5, commaIndex);
  const [mimeType] = meta.split(";");
  const base64Data = imageBase64.substring(commaIndex + 1);

  const ext = mimeType.split("/")[1];
  const buffer = Buffer.from(base64Data, "base64");
  const resizedBuffer = await sharp(buffer)
    .toFormat(ext === "jpg" ? "jpeg" : (ext as keyof sharp.FormatEnum))
    .toBuffer();

  // 5) Save to disk
  const uploadPath = path.join(UPLOAD_DIR, "homepage");
  await mkdir(uploadPath, { recursive: true });
  await writeFile(path.join(uploadPath, fileName), resizedBuffer);

  // 6) Return the API path
  return `api/uploads/homepage/${fileName}`;
}

async function deleteOldImage(imagePath: string) {
  const relativePath = imagePath.replace(/^\/?api\/?/, "").replace(/^\/+/, "");
  const filePath = path.join(process.cwd(), relativePath);
  try {
    await unlink(filePath);
  } catch {}
}

export async function GET() {
  try {
    const content = await prisma.homepage.findFirst({
      orderBy: { createdAt: "desc" },
    });
    if (!content) {
      return NextResponse.json(
        {
          heroText1: "",
          heroText2: "",
          featuredText1: "",
          featuredText2: "",
          smallparagraph: "",
          aboutheading: "",
          aboutparagraph: "",
          heroImage: null,
          featuredImage: null,
        },
        { status: 200 }
      );
    }
    return NextResponse.json(content, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token || !verifyAuthToken(token)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {
      heroTextLine1,
      heroTextLine2,
      featuredHeading1,
      featuredHeading2,
      smallParagraph,
      aboutHeading,
      aboutParagraph,
      heroImage: heroImageBase64,
      featuredImage: featuredImageBase64,
    } = await req.json();

    const timestamp = Date.now();
    const heroImageName = `hero-${timestamp}.jpg`;
    const featuredImageName = `featured-${timestamp}.jpg`;

    let savedHeroImagePath: string | null = null;
    let savedFeaturedImagePath: string | null = null;

    // Save new images if provided
    if (heroImageBase64) {
      savedHeroImagePath = await saveImage(heroImageBase64, heroImageName);
    }
    if (featuredImageBase64) {
      savedFeaturedImagePath = await saveImage(
        featuredImageBase64,
        featuredImageName
      );
    }

    // Fetch existing record to remove old images
    const existing = await prisma.homepage.findFirst({ where: { id: 1 } });

    if (existing) {
      if (heroImageBase64 && existing.heroImage) {
        await deleteOldImage(existing.heroImage);
      }
      if (featuredImageBase64 && existing.featuredImage) {
        await deleteOldImage(existing.featuredImage);
      }
    }

    // Upsert the homepage record
    const upserted = await prisma.homepage.upsert({
      where: { id: 1 },
      update: {
        heroText1: heroTextLine1,
        heroText2: heroTextLine2,
        featuredText1: featuredHeading1,
        featuredText2: featuredHeading2,
        smallparagraph: smallParagraph,
        aboutheading: aboutHeading,
        aboutparagraph: aboutParagraph,
        heroImage: savedHeroImagePath || existing?.heroImage,
        featuredImage: savedFeaturedImagePath || existing?.featuredImage,
      },
      create: {
        heroText1: heroTextLine1,
        heroText2: heroTextLine2,
        featuredText1: featuredHeading1,
        featuredText2: featuredHeading2,
        smallparagraph: smallParagraph,
        aboutheading: aboutHeading,
        aboutparagraph: aboutParagraph,
        heroImage: savedHeroImagePath,
        featuredImage: savedFeaturedImagePath,
      },
    });

    // Revalidate Next.js cache
    revalidatePath("/");

    return NextResponse.json(upserted, { status: 200 });
  } catch (err) {
    console.error("PUT /api/homepage error:", err);
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    );
  }
}
