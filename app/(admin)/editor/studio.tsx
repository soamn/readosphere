"use client";
import { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Maximize, ToggleLeft, ToggleRight, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Category } from "@/types/category";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

const Editor = dynamic(() => import("../editor/editor"), {
  ssr: false,
  loading: () => <p className="text-white p-4">Loading Editor...</p>,
});

type StudioProps = {
  data: {
    title: string;
    description: string;
    html: string;
    tags: string;
    slug: string;
    category: string;
    categories: Array<Category>;

    errors: {
      title?: string;
      description?: string;
      tags?: string;
      content?: string;
      slug?: string;
      category?: string;
      categories?: Array<Category>;
    };
    setHTML: React.Dispatch<React.SetStateAction<string>>;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    setTags: React.Dispatch<React.SetStateAction<string>>;
    setSlug: React.Dispatch<React.SetStateAction<string>>;
    setCategory: React.Dispatch<React.SetStateAction<string>>;
  };
  handleSave: () => void;
};

export default function Studio({
  data: {
    title,
    description,
    html,
    tags,
    slug,
    categories,
    errors,
    category,
    setHTML,
    setTitle,
    setDescription,
    setTags,
    setSlug,
    setCategory,
  },
  handleSave,
}: StudioProps) {
  const [isEditorFullscreen, setIsEditorFullscreen] = useState<boolean>(false);
  const [showMetaSection, setShowMetaSection] = useState<boolean>(false);
  const [isPreviewFullscreen, setIsPreviewFullscreen] =
    useState<boolean>(false);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setShowMetaSection(true);
    }
  }, [errors]);

  const toggleEditorFullscreen = () => {
    setIsEditorFullscreen((prev) => {
      if (!prev) setIsPreviewFullscreen(false);
      return !prev;
    });
  };

  const togglePreviewFullscreen = () => {
    setIsPreviewFullscreen((prev) => {
      if (!prev) setIsEditorFullscreen(false);
      return !prev;
    });
  };
  return (
    <Suspense>
      <div className="relative w-full h-screen">
        <ResizablePanelGroup direction="horizontal" className="w-full h-full">
          <ResizablePanel
            className={`relative  min-w-[400px] ${
              isPreviewFullscreen ? "hidden" : "block"
            }`}
          >
            <button
              className="absolute right-2 "
              onClick={toggleEditorFullscreen}
            >
              {isEditorFullscreen ? <Minimize /> : <Maximize size={18} />}
            </button>
            <div
              className="w-full h-full overflow-y-auto p-2"
              style={{ scrollbarWidth: "none" }}
            >
              <button
                onClick={() => setShowMetaSection(!showMetaSection)}
                className="cursor-pointer flex gap-1 justify-center items-center w-full"
              >
                {showMetaSection ? <ToggleRight /> : <ToggleLeft />}
                <span>Meta</span>
              </button>
              <div className={showMetaSection ? "block" : "hidden"}>
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, "")
                    );
                  }}
                />
                {errors.title && (
                  <span className="text-red-500 text-xs">{errors.title}</span>
                )}
                <Textarea
                  className="mt-2"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {errors.description && (
                  <span className="text-red-500 text-xs">
                    {errors.description}
                  </span>
                )}
                <Input
                  className="mt-2"
                  placeholder="Tags (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
                {errors.tags && (
                  <span className="text-red-500 text-xs">{errors.tags}</span>
                )}
                <Input
                  className="mt-2"
                  placeholder="Slug"
                  value={slug}
                  onChange={(e) =>
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, "")
                    )
                  }
                />
                {errors.slug && (
                  <span className="text-red-500 text-xs">{errors.slug}</span>
                )}
                <Select
                  defaultValue="select a value"
                  onValueChange={(value: string) => {
                    setCategory(value);
                  }}
                >
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue>
                      {category
                        ? categories.find((cat) => String(cat.id) === category)
                            ?.name
                        : "Select a category"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.category && (
                  <span className="text-red-500 text-xs">
                    {errors.category}
                  </span>
                )}
              </div>

              <Editor onChange={setHTML} />
              {errors.content && (
                <span className="text-red-500 text-xs">{errors.content}</span>
              )}

              <div className="p-5 w-full flex justify-center">
                <Button onClick={handleSave} className="cursor-pointer">
                  Save
                </Button>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Preview Panel */}
          <ResizablePanel
            className={` bg-offWhite text-body p-4 overflow-auto relative  ${
              isEditorFullscreen ? "hidden" : "block"
            }`}
            style={{ scrollbarWidth: "none" }}
          >
            <button
              className="absolute top-2 right-2"
              onClick={togglePreviewFullscreen}
            >
              {isPreviewFullscreen ? (
                <Minimize size={18} />
              ) : (
                <Maximize size={18} />
              )}
            </button>
            <div
              className="prose max-w-none whitespace-pre-wrap prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4 post"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </Suspense>
  );
}
