"use client";
import { Search } from "@/components/search";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0  w-full flex flex-col md:flex-row items-center z-50 px-4 md:px-32 justify-between bg-offWhite transition-all ${
        isScrolled ? "shadow-sm py-2" : "md:py-12 py-5"
      }`}
    >
      <div className="text-xl md:text-2xl font-bold">
        <Link href="/" className="text-secondary">
          ReadOsphere.com
        </Link>
      </div>

      <div className="flex items-center space-x-4 md:space-x-10 relative w-full md:w-auto justify-between md:justify-end ">
        <Search />
        <button
          className="flex space-x-1 items-center hover:bg-gray-200 cursor-pointer  mt-2 p-2 rounded-md"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="hidden md:inline">Menu</span>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute top-24  md:top-24 right-0 md:right-5 md:w-lg  bg-white shadow-md rounded-md p-5 w-full "
        >
          <div className="text-secondary font-bold text-center text-xl">
            Readosphere
          </div>
          <ul>
            {categories.length > 0 ? (
              categories.map((category: { id: number; name: string }) => (
                <li
                  key={category.id}
                  className="py-2 px-3 hover:underline cursor-pointer text-highlight"
                >
                  <Link href={`/category/${category.id}`}>{category.name}</Link>
                </li>
              ))
            ) : (
              <li className="py-2 px-3 text-gray-500">No categories</li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
