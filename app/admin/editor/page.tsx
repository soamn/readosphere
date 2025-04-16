"use client";
import React, { useEffect, useState } from "react";
import Studio from "./studio";
import { z } from "zod";
import { toast } from "sonner";
import { Category } from "@/types/category";
import { useRouter } from "next/navigation";

const PostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  metaTitle: z.string().min(1, "Meta Title is Required"),
  metaDescription: z.string().min(1, "Description is required"),
  tags: z.string().min(1, "Tags are required"),
  content: z.string().min(1, "Content is required"),
  slug: z.string().min(1, "Slug is required"),
  category: z.number().min(1, "Category is required"),
  thumbnail: z.string(),
});

type PostData = z.infer<typeof PostSchema>;

const page = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await res.json();
        const filteredCategories = data.map(
          ({ id, name }: { id: number; name: string }) => ({ id, name })
        );

        setCategories(filteredCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const [html, setHTML] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [metaTitle, setMetaTitle] = useState<string>("");
  const [metaDescription, setMetaDescription] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [category, setCategory] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    title?: string;
    metaTitle?: string;
    metaDescription?: string;
    tags?: string;
    content?: string;
    slug?: string;
    category?: string;
  }>({});

  const data = {
    title,
    metaTitle,
    metaDescription,
    html,
    tags,
    slug,
    categories,
    category,
    thumbnail,
    errors,
    setHTML,
    setTitle,
    setMetaTitle,
    setMetaDescription,
    setTags,
    setSlug,
    setCategory,
    setThumbnail,
  };

  const handleSave = async () => {
    const postData: PostData = {
      title,
      metaTitle,
      metaDescription,
      tags,
      content: html,
      slug,
      category: Number(category),
      thumbnail,
    };

    const validation = PostSchema.safeParse(postData);

    if (!validation.success) {
      const formattedErrors = validation.error.format();
      setErrors((prev) => ({
        ...prev,
        title: formattedErrors.title?._errors?.[0],
        metaTitle: formattedErrors.metaTitle?._errors?.[0],
        metaDescription: formattedErrors.metaDescription?._errors?.[0],
        tags: formattedErrors.tags?._errors?.[0],
        content: formattedErrors.content?._errors?.[0],
        slug: formattedErrors.slug?._errors?.[0],
        category: formattedErrors.category?._errors?.[0],
      }));
      return;
    }

    setErrors({});
    try {
      setSaving(true);
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create post");

      toast("Post created successfully");
      setSaving(false);
      router.push("/admin/dashboard");
    } catch (error) {
      toast("Error creating post");
    }
  };
  if (categories.length === 0) {
    return <div className="text-center">Loading...</div>;
  }

  return saving ? (
    <div className="text-center">Saving</div>
  ) : (
    <Studio data={data} handleSave={handleSave} />
  );
};

export default page;
