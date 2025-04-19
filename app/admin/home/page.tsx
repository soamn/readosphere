"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type HomePagePayload = {
  heroTextLine1: string;
  heroTextLine2: string;
  featuredHeading1: string;
  featuredHeading2: string;
  smallParagraph: string;
  aboutHeading: string;
  aboutParagraph: string;
  heroImage: string | null;
  featuredImage: string | null;
};

const HomePageSettings = () => {
  // Raw file state (for potential future use)
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);

  // Always-base64 string states (used for preview and submit)
  const [heroImageBase64, setHeroImageBase64] = useState<string | null>(null);
  const [featuredImageBase64, setFeaturedImageBase64] = useState<string | null>(
    null
  );

  const [heroTextLine1, setHeroTextLine1] = useState("");
  const [heroTextLine2, setHeroTextLine2] = useState("");
  const [featuredHeading1, setFeaturedHeading1] = useState("");
  const [featuredHeading2, setFeaturedHeading2] = useState("");
  const [smallParagraph, setSmallParagraph] = useState("");
  const [aboutHeading, setAboutHeading] = useState("");
  const [aboutParagraph, setAboutParagraph] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        const res = await fetch("/api/homepage");
        if (!res.ok) throw new Error("Failed to fetch homepage data");
        const data = await res.json();

        setHeroTextLine1(data.heroText1 || "");
        setHeroTextLine2(data.heroText2 || "");
        setFeaturedHeading1(data.featuredText1 || "");
        setFeaturedHeading2(data.featuredText2 || "");
        setSmallParagraph(data.smallparagraph || "");
        setAboutHeading(data.aboutheading || "");
        setAboutParagraph(data.aboutparagraph || "");

        // If the API returns base64 already, use it directly. Otherwise fetch and convert:
        if (data.heroImage?.startsWith("data:image/")) {
          setHeroImageBase64(data.heroImage);
        } else if (data.heroImage) {
          const blob = await fetch(`/${data.heroImage}`).then((r) => r.blob());
          setHeroImageBase64(await toBase64(blob as File));
        }

        if (data.featuredImage?.startsWith("data:image/")) {
          setFeaturedImageBase64(data.featuredImage);
        } else if (data.featuredImage) {
          const blob = await fetch(`/${data.featuredImage}`).then((r) =>
            r.blob()
          );
          setFeaturedImageBase64(await toBase64(blob as File));
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchHomePageData();
  }, []);

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (f: File | null) => void,
    setBase64: (b64: string | null) => void
  ) => {
    const file = e.target.files?.[0] ?? null;
    setFile(file);
    if (file) {
      const b64 = await toBase64(file);
      setBase64(b64);
    } else {
      setBase64(null);
    }
  };

  // Rich text formatting
  const handleFormat = (cmd: string) => document.execCommand(cmd, false);
  const handleInput = useCallback(() => {
    setAboutParagraph(editorRef.current?.innerHTML || "");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const payload: HomePagePayload = {
      heroTextLine1,
      heroTextLine2,
      featuredHeading1,
      featuredHeading2,
      smallParagraph,
      aboutHeading,
      aboutParagraph,
      heroImage: heroImageBase64,
      featuredImage: featuredImageBase64,
    };

    try {
      const res = await fetch("/api/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update homepage");
      setSuccess("Homepage updated successfully!");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold mb-4">Update Home Page Settings</h2>

      {success && <div className="text-green-600">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero Image */}
        <div className="space-y-2">
          <label className="font-semibold">Hero Image</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageChange(e, setHeroImageFile, setHeroImageBase64)
            }
          />
          {heroImageBase64 && (
            <img
              src={heroImageBase64}
              alt="Hero Preview"
              className="mt-2 w-full rounded shadow"
            />
          )}
        </div>

        {/* Featured Image */}
        <div className="space-y-2">
          <label className="font-semibold">Featured Image</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageChange(e, setFeaturedImageFile, setFeaturedImageBase64)
            }
          />
          {featuredImageBase64 && (
            <img
              src={featuredImageBase64}
              alt="Featured Preview"
              className="mt-2 w-full rounded shadow"
            />
          )}
        </div>

        {/* Text Inputs */}
        <div className="space-y-2">
          <label className="font-semibold">Hero Text Line 1</label>
          <Input
            value={heroTextLine1}
            onChange={(e) => setHeroTextLine1(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="font-semibold">Hero Text Line 2</label>
          <Input
            value={heroTextLine2}
            onChange={(e) => setHeroTextLine2(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="font-semibold">Featured Heading 1</label>
          <Input
            value={featuredHeading1}
            onChange={(e) => setFeaturedHeading1(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="font-semibold">Featured Heading 2</label>
          <Input
            value={featuredHeading2}
            onChange={(e) => setFeaturedHeading2(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="font-semibold">Small Paragraph</label>
          <Textarea
            value={smallParagraph}
            onChange={(e) => setSmallParagraph(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="font-semibold">About Heading</label>
          <Input
            value={aboutHeading}
            onChange={(e) => setAboutHeading(e.target.value)}
          />
        </div>

        {/* Rich Text Editor */}
        <div className="space-y-2">
          <label className="font-semibold">About Paragraph</label>
          <div className="flex gap-2 mb-1">
            {["bold", "italic", "underline"].map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={() => handleFormat(cmd)}
                className="px-2 py-1 bg-black text-white text-sm rounded hover:bg-gray-800"
              >
                {cmd === "bold" ? "B" : cmd === "italic" ? "I" : "U"}
              </button>
            ))}
          </div>
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            className="border rounded-md p-3 min-h-[150px] bg-white text-black prose max-w-none outline-none focus:ring-2 focus:ring-gray-300"
            dangerouslySetInnerHTML={{ __html: aboutParagraph }}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};

export default HomePageSettings;
