import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyAuthToken } from "@/utils/auth";
import { revalidatePath } from "next/cache";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: number }> }
) {
  const token = getTokenFromRequest(req);
  if (!token || !verifyAuthToken(token)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const id = (await context.params).id;

  const { name, description } = await req.json();

  const categoryId = Number(id);
  if (isNaN(categoryId)) {
    return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
  }

  try {
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: { name, description },
    });
    revalidatePath(`/${category.id}`);
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(req);
    if (!token || !verifyAuthToken(token)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await prisma.category.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
