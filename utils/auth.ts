import jwt from "jsonwebtoken";

export function verifyAuthToken(token: string | undefined) {
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    console.error("JWT Verification Failed:", error);
    return null;
  }
}

export function getTokenFromRequest(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;
  const tokenMatch = cookieHeader.match(/auth_token=([^;]+)/);
  return tokenMatch ? tokenMatch[1] : null;
}
