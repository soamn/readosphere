import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyAuthToken } from "@/utils/auth";



export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token || !verifyAuthToken(token)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const recommendations = await prisma.recommendation.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(recommendations);
  } catch {
    return NextResponse.json({ message: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const token = getTokenFromRequest(req);
  if (!token || !verifyAuthToken(token)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description, imageUrl, isActive, link } = body;

    if (!name || !description || !imageUrl || isActive === undefined) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const recommendation = await prisma.recommendation.create({
      data: { name, description, imageUrl, isActive, link },
    });

    return NextResponse.json(recommendation);
  } catch {
    return NextResponse.json({ message: "Failed to create" }, { status: 500 });
  }
}
