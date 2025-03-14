"use client";
import { useState } from "react";
import { z } from "zod";
import dynamic from "next/dynamic";
import { X, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { toast } from "sonner";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
  loading: () => <p className="text-white p-4">Loading Editor...</p>,
});

const PostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tags: z.string().min(1, "Tags are required"),
  content: z.string().min(1, "Content is required"),
});

type PostData = z.infer<typeof PostSchema>;

type FullscreenViewProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  bgColor: string;
};

function FullscreenView({
  isOpen,
  onClose,
  children,
  bgColor,
}: FullscreenViewProps) {
  if (!isOpen) return null;
  return (
    <div className={`fixed inset-0 ${bgColor} p-6 overflow-auto z-50`}>
      <button className="fixed top-4 right-4 z-50" onClick={onClose}>
        <X
          size={18}
          className={bgColor === "bg-black" ? "text-white" : "text-black"}
        />
      </button>
      <div className="w-full h-full overflow-auto">{children}</div>
    </div>
  );
}

export default function EditorComponent() {
  const [html, setHTML] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [isEditorFullscreen, setIsEditorFullscreen] = useState<boolean>(false);
  const [isPreviewFullscreen, setIsPreviewFullscreen] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    tags?: string;
    content?: string;
  }>({});

  const handleSave = async () => {
    const postData: PostData = {
      title,
      description,
      tags,
      content: html,
    };
    const validation = PostSchema.safeParse(postData);
    if (!validation.success) {
      const formattedErrors = validation.error.format();
      setErrors({
        title: formattedErrors.title?._errors?.[0],
        description: formattedErrors.description?._errors?.[0],
        tags: formattedErrors.tags?._errors?.[0],
        content: formattedErrors.content?._errors?.[0],
      });
      return;
    }

    setErrors({});

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast("Failed to create post");
        throw new Error(data.error || "Failed to create post");
      }

      toast("Post created successfully");
    } catch (error) {
      toast("Error creating post");
    }
  };

  return (
    <div className="relative w-full h-screen">
      <FullscreenView
        isOpen={isEditorFullscreen}
        onClose={() => setIsEditorFullscreen(false)}
        bgColor="bg-black"
      >
        <p className="text-white mb-2 sticky top-0 bg-black p-4 z-10">
          Start Your Content Here
        </p>
        <Editor onChange={setHTML} />
      </FullscreenView>

      <FullscreenView
        isOpen={isPreviewFullscreen}
        onClose={() => setIsPreviewFullscreen(false)}
        bgColor="bg-white"
      >
        <div className="prose max-w-none whitespace-pre-wrap p-4">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </FullscreenView>

      {!isEditorFullscreen && !isPreviewFullscreen && (
        <ResizablePanelGroup direction="horizontal" className="w-full h-full">
          <ResizablePanel className="relative h-screen min-w-[400px]">
            <button
              className="absolute top-5 right-2 text-white z-50"
              onClick={() => setIsEditorFullscreen(true)}
            >
              <Maximize size={18} />
            </button>
            <div
              className="w-full h-full bg-black overflow-y-auto text-white p-2"
              style={{ scrollbarWidth: "none" }}
            >
              <p className="text-white mb-2 sticky top-0 bg-black p-4 z-10">
                Start Your Content Here
              </p>
              <Input
                className="mb-2"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
              <Textarea
                className="mb-2"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
              <Input
                className="mb-2"
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              {errors.tags && (
                <p className="text-red-500 text-sm">{errors.tags}</p>
              )}
              <Editor onChange={setHTML} />
              {errors.content && (
                <p className="text-red-500 text-sm">{errors.content}</p>
              )}
              <div className="p-5 w-full flex justify-center">
                <Button onClick={handleSave} className="cursor-pointer">
                  Save
                </Button>
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            className="h-screen bg-gray-50 p-4 overflow-auto relative"
            style={{ scrollbarWidth: "none" }}
          >
            <button
              className="absolute top-2 right-2 z-50"
              onClick={() => setIsPreviewFullscreen(true)}
            >
              <Maximize size={18} />
            </button>
            <div
              className="prose max-w-none whitespace-pre-wrap prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}
