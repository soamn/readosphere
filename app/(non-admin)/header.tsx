"use client";
import { Diamond, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState, useRef } from "react";
import Navigation from "./navigation";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <header className="absolute top-0 w-full z-50  ">
      <div className="max-w-7xl mx-auto px-6  py-6 md:py-15 flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          <Diamond fill="#ffdd76" />
          <Link href="/" className="text-xl  lg:text-3xl tracking-widest">
            <span className="font-extrabold">ReadO</span>
            <span className="font-extralight">sphere</span>
          </Link>
        </div>

        <div className="hidden md:block">
          <Navigation />
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md  transition"
          >
            {menuOpen ? <X className="bg-white text-black" /> : <Menu />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          ref={menuRef}
          className="md:hidden px-6 py-4  shadow-md rounded-md bg-zinc-900"
        >
          <Navigation />
        </div>
      )}
    </header>
  );
};

export default Header;
