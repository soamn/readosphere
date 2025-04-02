// "use client";
// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import Studio from "../../studio";
// import { z } from "zod";
// import { toast } from "sonner";

// const PostSchema = z.object({
//   title: z.string().min(1, "Title is required"),
//   description: z.string().min(1, "Description is required"),
//   tags: z.string().min(1, "Tags are required"),
//   content: z.string().min(1, "Content is required"),
// });

// type PostData = z.infer<typeof PostSchema>;

// const Page = () => {
//   const searchParams = useSearchParams();
//   const postId = searchParams.get("id"); // Extract `id` from URL query params
//   const [html, setHTML] = useState<string>("");
//   const [title, setTitle] = useState<string>("");
//   const [description, setDescription] = useState<string>("");
//   const [tags, setTags] = useState<string>("");
//   const [errors, setErrors] = useState<{
//     title?: string;
//     description?: string;
//     tags?: string;
//     content?: string;
//   }>({});

//   useEffect(() => {
//     if (postId) {
//       fetch(`/api/posts/${postId}`)
//         .then((res) => res.json())
//         .then((data) => {
//           setTitle(data.title || "");
//           setDescription(data.description || "");
//           setTags(data.tags || "");
//           setHTML(data.content || "");
//         })
//         .catch(() => toast("Error fetching post data"));
//     }
//   }, [postId]);

//   const handleSave = async () => {
//     const postData: PostData = { title, description, tags, content: html };
//     const validation = PostSchema.safeParse(postData);

//     if (!validation.success) {
//       const formattedErrors = validation.error.format();
//       setErrors((prev) => ({
//         ...prev,
//         title: formattedErrors.title?._errors?.[0] || prev.title,
//         description:
//           formattedErrors.description?._errors?.[0] || prev.description,
//         tags: formattedErrors.tags?._errors?.[0] || prev.tags,
//         content: formattedErrors.content?._errors?.[0] || prev.content,
//       }));
//       return;
//     }

//     setErrors({});

//     try {
//       const response = await fetch(
//         postId ? `/api/posts/${postId}` : "/api/posts",
//         {
//           method: postId ? "PUT" : "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(postData),
//         }
//       );

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.error || "Failed to save post");

//       toast(postId ? "Post updated successfully" : "Post created successfully");
//     } catch (error) {
//       toast("Error saving post");
//     }
//   };

//   return (
//     <Studio
//       data={{
//         title,
//         description,
//         html,
//         tags,
//         errors,
//         setHTML,
//         setTitle,
//         setDescription,
//         setTags,
//       }}
//       handleSave={handleSave}
//     />
//   );
// };

// export default Page;
