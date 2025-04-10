import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import "../globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import { Toaster } from "sonner";
import { verifyAuthToken } from "@/utils/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Readosphere | Admin",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const authToken = (await cookies()).get("auth_token")?.value;
  const verified = verifyAuthToken(authToken);
  if (!verified) {
    redirect("/auth/login");
  }
  const user =
    typeof verified === "object" && "email" in verified ? verified : null;
  return (
    <SidebarProvider className="dark">
      <AppSidebar user={user} />
      <main className="w-full bg-zincy p-1 dark:text-white">
        <SidebarTrigger />
        {children}
      </main>
      <Toaster />
    </SidebarProvider>
  );
}
