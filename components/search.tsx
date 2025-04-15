"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MoveRight } from "lucide-react";

export function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { id: string; slug: string; metaTitle: string }[]
  >([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setShowResults(true);
    try {
      const response = await fetch(`/api/posts/search?s=${searchQuery}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const onSubmit = (
    e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e?.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${query}`);
    }
  };

  return (
    <div ref={searchRef} className="relative w-fit">
      <form
        onSubmit={onSubmit}
        className="flex items-center border-b border-white  transition duration-300 hover:border-0 focus-within:border-0 "
      >
        <input
          type="text"
          placeholder="SEARCH"
          value={query}
          onChange={handleChange}
          className="bg-transparent text-white placeholder:text-white focus:outline-none w-24 lg:w-30 md:w-20  "
        />
        <button type="submit" onClick={onSubmit} className="cursor-pointer">
          <MoveRight className="w-4 h-4" />
        </button>
      </form>

      {showResults && results.length > 0 && (
        <ul className="absolute top-full left-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-50 text-black">
          {results.map((post) => (
            <li key={post.id} className="border-b last:border-none">
              <a
                href={`/${post.slug}`}
                className="block px-4 py-2 hover:bg-gray-100 transition"
              >
                {post.metaTitle}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
