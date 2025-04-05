import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/utils/auth";
const isBrowserRequest = (req: NextRequest): boolean => {
  const userAgent = req.headers.get("user-agent") || "";
  const referer = req.headers.get("referer") || "";
  return (
    !req.headers.get("Authorization") &&
    (!referer || userAgent.includes("Mozilla"))
  );
};

const authenticateUser = (req: NextRequest) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const authToken = authHeader.split("Bearer ")[1];
  return verifyAuthToken(authToken);
};
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const postId = params.id;

  const post = await prisma.post.findUnique({
    where: { id: parseInt(postId) },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}
