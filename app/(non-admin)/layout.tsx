import type { Metadata } from "next";
import "../globals.css";
import Header from "./header";
import { Quattrocento } from "next/font/google";
import { Oswald } from "next/font/google";
import { Category } from "@/types/category";
const oswald = Oswald({ subsets: ["latin"] });
const quattrocento = Quattrocento({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Readosphere",
    template: "%s - Readosphere",
  },
  description: "This is Readosphere App Improve your reading from here",
  twitter: {
    card: "summary_large_image",
    description: "twitter specific",
  },
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className={`  antialiase bg-offWhite `}>
      <Header />
      <main className="w-full max-w-4xl mx-auto mt-42  items-center min-h-screen p-5">
        {children}
      </main>
    </body>
  );
}
