"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react"; // if you're using lucide-react

export function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { id: string; slug: string; metaTitle: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
    setShowResults(true);
    try {
      const response = await fetch(`/api/posts/search?s=${searchQuery}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
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
    <div className="relative w-full max-w-lg mx-auto" ref={searchRef}>
      <form onSubmit={onSubmit} className="flex items-center gap-1 w-32 group">
        <input
          type="text"
          placeholder="SEARCH "
          value={query}
          onChange={handleChange}
          className="w-full  border-none outline-0 focus:outline-0 rounded-lg focus:outline-none text-white"
        />
        <button
          type="submit"
          onClick={onSubmit}
          className="  hover:bg-white rounded-lg hover:text-black transition"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
      <span className="bg-white h-[0.1] w-full block group-hover:hidden transition-all duration-300"></span>

      {loading && <p className="text-black mt-2">Searching...</p>}

      {showResults && results.length > 0 && (
        <ul className="absolute w-full md:-left-32  md:w-fit text-nowrap mt-2 bg-white shadow-lg rounded-lg overflow-hidden z-50 text-black">
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
