"use client";
import { Diamond, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState, useRef } from "react";
import Navigation from "./navigation";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <header className="absolute top-0 w-full  px-6 md:px-32 py-6 md:py-20 flex items-center  justify-between  z-50">
      <div className="flex items-center space-x-2 w-full">
        <Diamond fill="#ffdd76" />
        <Link href="/" className="text-xl md:text-3xl tracking-widest">
          <span className="font-extrabold">ReadO</span>
          <span className="font-extralight">sphere</span>
        </Link>
      </div>

      <div className="hidden md:block md:w-full">
        <Navigation />
      </div>

      <div className="md:hidden ">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-md hover:bg-gray-200 transition"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute top-full mt-4 left-0 w-full  shadow-md rounded-md p-5 md:hidden"
        >
          <Navigation />
        </div>
      )}
    </header>
  );
};

export default Header;
