import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const scrypt = promisify(crypto.scrypt);

async function verifyPassword(storedPassword: string, enteredPassword: string) {
  const [salt, storedHash] = storedPassword.split(":");
  const hashedBuffer = (await scrypt(enteredPassword, salt, 64)) as Buffer;
  return crypto.timingSafeEqual(Buffer.from(storedHash, "hex"), hashedBuffer);
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await verifyPassword(user.password, password))) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not set in environment variables");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({ message: "Login successful" });

    response.headers.append(
      "Set-Cookie",
      serialize("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24,
      })
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
