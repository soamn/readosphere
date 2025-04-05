"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

export function Search() {
  const placeholders = [
    "Best books to read this year?",
    "Must-read classic novels?",
    "What are some great sci-fi books?",
    "Books similar to '1984' by George Orwell?",
    "Top mystery novels of all time?",
  ];

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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${query}`);
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto" ref={searchRef}>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />

      {loading && <p className="text-gray-500 mt-2">Searching...</p>}

      {showResults && results.length > 0 && (
        <ul className="absolute left-0 w-full mt-2 bg-white shadow-lg rounded-lg overflow-hidden z-50">
          {results.map((post) => (
            <li key={post.id} className="border-b last:border-none">
              <a
                href={`/${post.slug}`}
                className="block px-4 py-2 text-highlight hover:underline underline-offset-4"
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
