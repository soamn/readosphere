import { createReadStream, statSync } from "fs";
import { join } from "path";
import mime from "mime";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;

  const filePath = join(process.cwd(), "uploads", ...path);

  try {
    const stat = statSync(filePath);
    const stream = createReadStream(filePath);
    const mimeType = mime.getType(filePath) || "application/octet-stream";

    return new Response(stream as any, {
      headers: {
        "Content-Type": mimeType,
        "Content-Length": stat.size.toString(),
      },
    });
  } catch (err) {
    return new Response("File not found", { status: 404 });
  }
}
