import type { Metadata } from "next";
import "../globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Readosphere",
  description: "This is Readosphere App Improve your reading from here",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className={` antialiase`}>
      <SidebarProvider className="dark">
        <AppSidebar />
        <main className="w-full bg-zincy p-1 dark:text-white">
          <SidebarTrigger />
          {children}
        </main>
        <Toaster />
      </SidebarProvider>
    </body>
  );
}
