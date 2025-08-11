"use client";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React, { useEffect, useRef, useState } from "react";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useParams, useRouter } from "next/navigation";
import { Category } from "@prisma/client";

const UpdatePlugin = () => {
  const router = useRouter();
  const { id } = useParams();
  async function fetchPost() {
    const response = await fetch(`/api/posts/${id}`);
    const data = await response.json();
    if (!data.success) {
      router.replace("/404");
    }
    const post = data.message.post;
    setTitle(post.metaTitle);
    setDescription(post.metaDescription);
    setSlug(post.slug);
    setTags(post.metaTags);
    setexistingThumbnail(post.thumbnail);
    setFeatured(post.isFeatured);
    setPublished(post.published);
    setCategoryId(post.categoryId);
  }
  useEffect(() => {
    fetchPost();
  }, []);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File>();
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const [existingThumbnail, setexistingThumbnail] = useState<string>();
  const [published, setPublished] = useState<boolean>();
  const [featured, setFeatured] = useState<boolean>();
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string>("");
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

  const updateHtml = () => {
    setSending(true);
    if (!title || !description || !slug || !tags) {
      setError("All fields are required");
      setSending(false);
      return;
    }
    editor.update(async () => {
      const data = new FormData();
      if (thumbnail) {
        data.append("thumbnail", thumbnail);
      }
      const htmlString = $generateHtmlFromNodes(editor, null);
      data.append("metaTitle", title);
      data.append("metaDescription", description);
      data.append("tags", tags);
      data.append("published", published ? "1" : "0");
      data.append("isFeatured", featured ? "1" : "0");
      data.append("slug", slug);
      data.append("content", htmlString);
      data.append("categoryId", categoryId);

      try {
        const res = await fetch(`/api/posts/${id}`, {
          method: "PUT",
          body: data,
        });
        const response = await res.json();
        alert(response.message);
        setError("");
        setSending(false);
        router.refresh();
      } catch (error) {
        setSending(false);
        console.error(error);
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
            value={title}
            onChange={(e) => {
              setSlug(
                e.target.value
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "")
              );
              setTitle(e.target.value);
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            value={tags}
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

        <div>
          <label className="block font-bold mb-2">Is Post Featured?</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                value="false"
                checked={featured === false}
                onChange={() => setFeatured(false)}
                name="featured"
                className=" p-2 rounded-lg cursor-pointer"
              />
              No
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                value="true"
                checked={featured === true}
                onChange={() => setFeatured(true)}
                name="featured"
                className=" p-2 rounded-lg cursor-pointer"
              />
              Yes
            </label>
          </div>
        </div>

        <div>
          <label className="block font-bold mb-2">Is Post Published?</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                value="false"
                checked={published === false}
                onChange={() => setPublished(false)}
                name="published"
                className=" p-2 rounded-lg cursor-pointer"
              />
              No
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                value="true"
                checked={published === true}
                onChange={() => setPublished(true)}
                name="published"
                className=" p-2 rounded-lg cursor-pointer"
              />
              Yes
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block font-bold">
            Select Category?
          </label>
          <select
            className="outline p-2 rounded-lg"
            name="category"
            id="category"
            value={categoryId ?? ""}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="" disabled>
              {" "}
              Select Category{" "}
            </option>
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
            className="p-2 outline bg-zinc-900 text-white rounded-lg"
            onClick={() => thumbnailRef?.current?.click()}
          >
            {thumbnail ? thumbnail.name : "Upload Thumbnail "}
          </button>
        </div>
      </div>

      <div className=" w-full flex justify-center items-center mt-5 space-x-2">
        <button
          disabled={sending}
          onClick={updateHtml}
          className="bg-zinc-800 rounded-lg text-white px-3 p-2 cursor-pointer "
        >
          Update
        </button>
      </div>
      {existingThumbnail && (
        <img
          src={existingThumbnail}
          width={300}
          className="m-auto mt-2 rounded-md"
        ></img>
      )}
      {error && <div className="text-red-500">* {error}</div>}
    </div>
  );
};

export default UpdatePlugin;
