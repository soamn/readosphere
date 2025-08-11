// app/api/homepage/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyAuthToken } from "@/utils/auth";
import { revalidatePath } from "next/cache";
import { uploadImageToVercelBlob } from "@/lib/uploadImageToVercelBlob";

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
      heroImageBase64,
      featuredImageBase64,
    } = await req.json();

    const timestamp = Date.now();
    let savedHeroImagePath: string | null = null;
    let savedFeaturedImagePath: string | null = null;

    if (heroImageBase64) {
      savedHeroImagePath = await uploadImageToVercelBlob(
        heroImageBase64,
        "homepage",
        `hero-${timestamp}`
      );
    }
    if (featuredImageBase64) {
      savedFeaturedImagePath = await uploadImageToVercelBlob(
        featuredImageBase64,
        "homepage",
        `featured-${timestamp}`
      );
    }

    const existing = await prisma.homepage.findFirst({ where: { id: 1 } });

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
