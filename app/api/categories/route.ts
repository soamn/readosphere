import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyAuthToken } from "@/utils/auth";

export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token || !verifyAuthToken(token)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name, description } = await req.json();
    if (!name)
      return NextResponse.json({ error: "Name required" }, { status: 400 });

    const category = await prisma.category.create({
      data: { name, description },
    });
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
