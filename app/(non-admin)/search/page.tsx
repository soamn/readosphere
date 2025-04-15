"use client";

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Post } from "@/types/post";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Head from "next/head";

import Image from "next/image";

function SearchPageInner() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    fetch(`/api/posts/search?s=${query}`)
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch((error) => console.error("Search error:", error))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <>
      <Head>
        <title>Search Results for "{query}" | ReadOsphere</title>
        <meta
          name="description"
          content={`Search results for "${query}" on Readosphere.`}
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`Search Results for "${query}"`} />
        <meta property="og:description" content={` "${query}".`} />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://readosphere.com/search?q=${encodeURIComponent(
            query
          )}`}
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={` "${query}"`} />
        <meta
          name="twitter:description"
          content={`Find about "${query}" on Readosphere.`}
        />
        <link
          rel="canonical"
          href={`https://gierlist.com/search?q=${encodeURIComponent(query)}`}
        />
      </Head>
      <div className="max-w-3xl mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-4">
          Search Results for "{query}"
        </h1>

        {loading && <p className="text-gray-500">Loading...</p>}

        {results.length === 0 && !loading ? (
          <p className="text-gray-600">No results found.</p>
        ) : (
          <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
            {results.map((post, i) => (
              <Link href={`/${post.slug}`} key={post.slug}>
                <BentoGridItem
                  title={post.metaTitle}
                  description={post.metaDescription}
                  header={
                    post.thumbnail ? (
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        width="300px"
                        height="150"
                      />
                    ) : (
                      <img
                        src={`http://readosphere.com/opengraph-image.png`}
                        alt={post.title}
                        width="300px"
                        height="150px"
                      />
                    )
                  }
                  className={i === 3 || i === 6 ? "md:col-span-2" : ""}
                />
              </Link>
            ))}
          </BentoGrid>
        )}
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading search results...</div>}>
      <SearchPageInner />
    </Suspense>
  );
}
