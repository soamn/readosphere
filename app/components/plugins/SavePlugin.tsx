"use client";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React, { useRef, useState, useEffect } from "react";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useRouter } from "next/navigation";
import { Category } from "@prisma/client";

const SavePlugin = () => {
  const router = useRouter();
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [thumbnail, setThumbnail] = useState<File>();
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const [editor] = useLexicalComposerContext();
  const [sending, setSending] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const saveHtml = () => {
    setSending(true);
    if (!metaTitle || !metaDescription || !slug || !tags || !categoryId) {
      setError("All fields are required");
      setSending(false);
      return;
    }

    editor.update(async () => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      const data = new FormData();

      if (thumbnail) {
        data.append("thumbnail", thumbnail);
      }
      data.append("metaTitle", metaTitle);
      data.append("metaDescription", metaDescription);
      data.append("slug", slug);
      data.append("tags", tags);
      data.append("content", htmlString);
      data.append("categoryId", categoryId);

      try {
        const res = await fetch("/api/posts", {
          method: "POST",
          body: data,
        });
        const response = await res.json();
        setSending(false);
        alert(response.message);
        setError("");
        router.refresh();
      } catch (error) {
        setSending(false);
        alert(error);
      }
    });
  };

  return (
    <div className="relative left-6 max-w-3xl m-auto">
      <div className="w-full grid grid-cols-2 place-items-center gap-4">
        <div>
          <label htmlFor="title" className="block font-bold">
            Enter Meta Title?
          </label>
          <input
            onChange={(e) => {
              setSlug(
                e.target.value
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "")
              );
              setMetaTitle(e.target.value);
            }}
            name="title"
            id="title"
            type="text"
            placeholder="Enter meta title"
            className="outline p-2 rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="description" className="block font-bold">
            Enter Meta Description?
          </label>
          <textarea
            onChange={(e) => setMetaDescription(e.target.value)}
            name="description"
            id="description"
            placeholder="Enter meta description"
            className="outline p-2 rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="tags" className="block font-bold">
            Enter Meta Tags ?
          </label>
          <input
            onChange={(e) => setTags(e.target.value)}
            name="tags"
            id="tags"
            type="text"
            placeholder="Enter meta tags"
            className="outline p-2 rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="slug" className="block font-bold">
            Enter Slug ?
          </label>
          <input
            onChange={(e) => {
              setSlug(
                e.target.value
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "")
              );
            }}
            name="slug"
            id="slug"
            type="text"
            value={slug}
            placeholder="Enter Slugs"
            className="outline p-2 rounded-lg"
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label htmlFor="category" className="block font-bold">
            Select Category?
          </label>
          <select
            className="outline p-2 rounded-lg"
            name="category"
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value=""> Select Category </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <input
            hidden
            ref={thumbnailRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setThumbnail(file);
              }
            }}
            name="thumbnail"
            id="thumbnail"
            type="file"
            accept="image/*"
            className="outline p-2 rounded-lg hidden"
          />
          <button
            type="button"
            className="p-2 outline text-white rounded-lg"
            onClick={() => thumbnailRef?.current?.click()}
          >
            {thumbnail ? thumbnail.name : "Upload Thumbnail"}
          </button>
        </div>
      </div>

      <div className="w-full flex justify-center items-center mt-5 space-x-2">
        <button
          disabled={sending}
          onClick={saveHtml}
          className="bg-zinc-800 rounded-lg text-white px-3 p-2 cursor-pointer"
        >
          Save
        </button>
      </div>

      {error && <div className="text-red-500">* {error}</div>}
    </div>
  );
};

export default SavePlugin;
