import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuthToken } from "@/utils/auth";

function getTokenFromRequest(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;
  const tokenMatch = cookieHeader.match(/auth_token=([^;]+)/);
  return tokenMatch ? tokenMatch[1] : null;
}

export async function PUT(req: Request, context: { params: { id: string } }) {
  const token = getTokenFromRequest(req);
  if (!token || !verifyAuthToken(token)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description, imageUrl, isActive, link } = body;
    const id = context.params.id;

    const updated = await prisma.recommendation.update({
      where: { id: Number(id) },
      data: { name, description, imageUrl, isActive, link },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const token = getTokenFromRequest(req);
  if (!token || !verifyAuthToken(token)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = context.params.id;

    await prisma.recommendation.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch {
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 });
  }
}
