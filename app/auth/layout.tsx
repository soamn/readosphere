import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAuthToken } from "@/utils/auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authToken = (await cookies()).get("auth_token")?.value;
  if (authToken && verifyAuthToken(authToken)) {
    redirect("/admin/dashboard");
  }

  return <>{children}</>;
}
