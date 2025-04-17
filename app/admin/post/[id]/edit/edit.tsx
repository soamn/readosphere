"use client";

import React, { useState, useEffect } from "react";
import Studio from "../../../editor/studio";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Category } from "@/types/category";

const PostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  metaTitle: z.string().min(1, "Meta Title is required"),
  metaDescription: z.string().min(1, "Description is required"),
  metaTags: z.string().min(1, "Tags are required"),
  content: z.string().min(1, "Content is required"),
  slug: z.string().min(1, "Slug is required"),
  categoryId: z.number().min(1, "Category is required"),
  thumbnail: z.string(),
});

type PostData = z.infer<typeof PostSchema>;

const EditStudio = ({ initialData }: { initialData: any }) => {
  const router = useRouter();
  const [html, setHTML] = useState<string>(initialData.content || "");
  const [title, setTitle] = useState<string>(initialData.title || "");
  const [metaTitle, setMetaTitle] = useState<string>(
    initialData.metaTitle || ""
  );
  const [metaDescription, setMetaDescription] = useState<string>(
    initialData.metaDescription || ""
  );
  const [tags, setTags] = useState<string>(initialData.metaTags || "");
  const [slug, setSlug] = useState<string>(initialData.slug || "");
  const [category, setCategory] = useState<string>(
    String(initialData.categoryId) || "0"
  );
  const [thumbnail, setThumbnail] = useState<string>(
    initialData.thumbnail || ""
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true); // new loading state

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error("Failed to fetch categories");

        const data = await res.json();
        const validCategories = data.map(
          ({ id, name }: { id: number; name: string }) => ({ id, name })
        );

        if (validCategories.length > 0) {
          setCategories(validCategories);
          setLoading(false);

          const categoryExists = validCategories.some(
            (cat: Category) => cat.id === Number(initialData.categoryId)
          );

          if (!categoryExists) {
            setCategory(String(validCategories[0].id));
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [initialData.categoryId]);

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
      metaTags: tags,
      content: html,
      slug,
      categoryId: Number(category),
      thumbnail,
    };

    const validation = PostSchema.safeParse(postData);

    if (!validation.success) {
      const formattedErrors = validation.error.format();
      setErrors({
        title: formattedErrors.title?._errors?.[0] || "",
        metaTitle: formattedErrors.metaTitle?._errors?.[0] || "",
        metaDescription: formattedErrors.metaDescription?._errors?.[0] || "",
        tags: formattedErrors.metaTags?._errors?.[0] || "",
        content: formattedErrors.content?._errors?.[0] || "",
        slug: formattedErrors.slug?._errors?.[0] || "",
        category: formattedErrors.categoryId?._errors?.[0] || "",
      });
      return;
    }

    setErrors({});
    try {
      setSaving(true);
      const response = await fetch(`/api/posts/${initialData.id}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update post");

      toast("Post updated successfully");
      alert("Post updated successfully");
      setSaving(false);
    } catch (error) {
      toast("Error updating post");
    }
  };
  if (loading) return <div className="text-center">Loading...</div>;

  return saving ? (
    <div className="text-center">Saving...</div>
  ) : (
    <Studio data={data} handleSave={handleSave} />
  );
};

export default EditStudio;
