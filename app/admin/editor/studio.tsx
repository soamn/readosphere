import { Suspense, useState, useEffect } from "react";
import { z } from "zod";
import dynamic from "next/dynamic";
import { X, Maximize, ToggleLeft, ToggleRight, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const Editor = dynamic(() => import("@/app/admin/editor/editor"), {
  ssr: false,
  loading: () => <p className="text-white p-4">Loading Editor...</p>,
});

type StudioProps = {
  data: {
    title: string;
    description: string;
    html: string;
    tags: string;
    errors: {
      title?: string;
      description?: string;
      tags?: string;
      content?: string;
    };
    setHTML: React.Dispatch<React.SetStateAction<string>>;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    setTags: React.Dispatch<React.SetStateAction<string>>;
  };
  handleSave: () => void;
};

export default function Studio({
  data: {
    title,
    description,
    html,
    tags,
    errors,
    setHTML,
    setTitle,
    setDescription,
    setTags,
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
          {/* Editor Panel */}
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
              </div>

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

          {/* Preview Panel */}
          <ResizablePanel
            className={` bg-gray-50 p-4 overflow-auto relative text-black ${
              isEditorFullscreen ? "hidden" : "block"
            }`}
            style={{ scrollbarWidth: "none" }}
          >
            <button
              className="absolute top-2 right-2"
              onClick={togglePreviewFullscreen}
            >
              {isPreviewFullscreen ? <Minimize /> : <Maximize size={18} />}
            </button>
            <div
              className="prose max-w-none whitespace-pre-wrap prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </Suspense>
  );
}
