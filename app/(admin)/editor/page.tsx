"use client";
import React, { useEffect, useState } from "react";
import Studio from "./studio";
import { z } from "zod";
import { toast } from "sonner";
import { Category } from "@/types/category";
import { useRouter } from "next/navigation";
const PostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tags: z.string().min(1, "Tags are required"),
  content: z.string().min(1, "Content is required"),
  slug: z.string().min(1, "Slug is required"),
  category: z.number().min(1, "category is required"),
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
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [category, setCategory] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    tags?: string;
    content?: string;
    slug?: string;
    categories?: Category[];
    category?: string;
  }>({});
  const data = {
    title,
    description,
    html,
    tags,
    slug,
    categories,
    category,
    errors,
    setHTML,
    setTitle,
    setDescription,
    setTags,
    setSlug,
    setCategory,
  };

  const handleSave = async () => {
    const postData: PostData = {
      title,
      description,
      tags,
      content: html,
      slug,
      category: Number(category),
    };
    const validation = PostSchema.safeParse(postData);

    if (!validation.success) {
      const formattedErrors = validation.error.format();
      setErrors((prev) => ({
        ...prev,
        title: formattedErrors.title?._errors?.[0] || prev.title,
        description:
          formattedErrors.description?._errors?.[0] || prev.description,
        tags: formattedErrors.tags?._errors?.[0] || prev.tags,
        content: formattedErrors.content?._errors?.[0] || prev.content,
        slug: formattedErrors.slug?._errors?.[0] || prev.slug,
        category: formattedErrors.category?._errors?.[0] || prev.category,
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
      router.push("/dashboard");
    } catch (error) {
      toast("Error creating post");
    }
  };

  return saving ? (
    <div className="text-center">Saving</div>
  ) : (
    <Studio data={data} handleSave={handleSave} />
  );
};

export default page;
