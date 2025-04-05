"use client";

import Link from "next/link";
import { Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-offWhite   px-6 mt-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <h2 className="text-2xl font-bold">Readosphere</h2>
          <p className="mt-2 text-sm ">
            Discover book reviews, summaries & recommendations curated for
            readers.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Explore</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link href="/" className="text-highlight">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-highlight">
                About
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-highlight">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Connect</h3>
          <div className="flex space-x-4">
            <a href="mailto:negiaman@gmail.com" className="">
              <Mail size={20} />
            </a>
            <a
              href="https://twitter.com/soamn"
              target="_blank"
              rel="noopener noreferrer"
              className=" "
            >
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-sm text-secondary">
        &copy; {new Date().getFullYear()} Readosphere. All rights reserved.
      </div>
    </footer>
  );
}
