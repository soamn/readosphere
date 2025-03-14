import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { title, description, tags, content, userId } = await req.json();

    if (!title || !description || !tags || !content) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    let validUserId = userId;
    if (!userId) {
      const testUser = await prisma.user.upsert({
        where: { email: "testuser@example.com" }, // Unique field to check
        update: {}, // If found, do nothing
        create: {
          name: "Test User",
          email: "testuser@example.com",
          password: "testpassword", // Add a default password
        },
      });
      validUserId = testUser.id;
    } else {
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return NextResponse.json({ error: "User not found" }, { status: 400 });
      }
    }

    const newPost = await prisma.post.create({
      data: {
        metaTitle: title,
        metaDescription: description,
        metaTags: tags,
        content,
        userId: validUserId,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
