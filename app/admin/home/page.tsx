"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import SmallEditor, { getEditorHtml } from "./simplerte";

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
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [heroImageBase64, setHeroImageBase64] = useState<string | null>(null);
  const [featuredImageBase64, setFeaturedImageBase64] = useState<string | null>(
    null
  );
  const [originalHeroImageUrl, setOriginalHeroImageUrl] = useState<
    string | null
  >(null);
  const [originalFeaturedImageUrl, setOriginalFeaturedImageUrl] = useState<
    string | null
  >(null);
  const [heroTextLine1, setHeroTextLine1] = useState("");
  const [heroTextLine2, setHeroTextLine2] = useState("");
  const [featuredHeading1, setFeaturedHeading1] = useState("");
  const [featuredHeading2, setFeaturedHeading2] = useState("");
  const [smallParagraph, setSmallParagraph] = useState("");
  const [aboutHeading, setAboutHeading] = useState("");
  const [aboutParagraph, setAboutParagraph] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setOriginalHeroImageUrl(data.heroImage || null);
        setOriginalFeaturedImageUrl(data.featuredImage || null);
        setHeroImageBase64(null);
        setFeaturedImageBase64(null);
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

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    const html = getEditorHtml();
    const heroImageToSend = heroImageBase64 ?? originalHeroImageUrl;
    const featuredImageToSend = featuredImageBase64 ?? originalFeaturedImageUrl;

    const payload: HomePagePayload = {
      heroTextLine1,
      heroTextLine2,
      featuredHeading1,
      featuredHeading2,
      smallParagraph,
      aboutHeading,
      aboutParagraph: html,
      heroImage: heroImageToSend,
      featuredImage: featuredImageToSend,
    };

    try {
      const res = await fetch("/api/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update homepage");

      setHeroImageBase64(null);
      setFeaturedImageBase64(null);
      setOriginalHeroImageUrl(heroImageToSend);
      setOriginalFeaturedImageUrl(featuredImageToSend);
      alert("Update Successfull");
      window.location.reload();
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

      <div className="space-y-6">
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
          {/* Hero Image Preview */}
          {heroImageBase64 ? (
            <img
              src={heroImageBase64}
              alt="Hero Preview"
              className="mt-2 w-full rounded shadow"
            />
          ) : originalHeroImageUrl ? (
            <img
              src={originalHeroImageUrl}
              alt="Hero Preview"
              className="mt-2 w-full rounded shadow"
            />
          ) : null}
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
          {featuredImageBase64 ? (
            <img
              src={featuredImageBase64}
              alt="Featured Preview"
              className="mt-2 w-full rounded shadow"
            />
          ) : originalFeaturedImageUrl ? (
            <img
              src={originalFeaturedImageUrl}
              alt="Featured Preview"
              className="mt-2 w-full rounded shadow"
            />
          ) : null}
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
        <label className="font-semibold">About Paragraph</label>
        <div className="relative overflow-clip m-auto max-w-5xl">
          <SmallEditor html={aboutParagraph} />
        </div>
        <Button onClick={handleSubmit} className="w-full" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
export default HomePageSettings;
