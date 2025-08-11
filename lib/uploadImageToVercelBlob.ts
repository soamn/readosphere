import sharp from "sharp";
import { put } from "@vercel/blob";

/**
 * Processes an image (base64) and uploads to Vercel Blob Storage
 *
 * @param base64Image string — data URL format e.g. "data:image/jpeg;base64,..."
 * @param folder string — logical folder name for organization
 * @param fileBaseName string — base slug for the file name
 * @returns string — public URL to the uploaded file
 */
export async function uploadImageToVercelBlob(
  base64Image: string,
  folder: string,
  fileBaseName: string
): Promise<string> {
  const matches = base64Image.match(/^data:(.+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid image format");

  const mimeType = matches[1];
  const ext = mimeType.split("/")[1];
  const buffer = Buffer.from(matches[2], "base64");

  const resizedBuffer = await sharp(buffer)
    .resize(1200, 630, { fit: "cover" })
    .toFormat((ext === "jpg" ? "jpeg" : ext) as keyof sharp.FormatEnum)
    .toBuffer();

  const fileName = `${folder}/${fileBaseName}-${Date.now()}.${ext}`;

  const { url } = await put(fileName, resizedBuffer, {
    access: "public",
    contentType: mimeType,
  });

  return url;
}
