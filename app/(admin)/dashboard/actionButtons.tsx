"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ActionButtonsProps {
  postId: number;
  published: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ postId, published }) => {
  const [isPublished, setIsPublished] = useState(published);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const togglePublish = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}/publish`, {
        method: "PATCH",
      });
      if (response.ok) {
        setIsPublished((prev) => !prev);
        startTransition(() => {
          router.refresh();
        });
      }
    } catch (error) {
      console.error("Error toggling publish status:", error);
    }
    setLoading(false);
  };

  const deletePost = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}/delete`, {
        method: "DELETE",
      });
      if (response.ok) {
        startTransition(() => {
          router.refresh();
        });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-2 justify-center items-center">
      <Button
        onClick={togglePublish}
        disabled={loading || isPending}
        variant={isPublished ? "outline" : "default"}
      >
        {loading || isPending ? (
          <>
            <Loader2 className="animate-spin" />
            {"Processing"}
          </>
        ) : isPublished ? (
          "Unpublish"
        ) : (
          "Publish"
        )}
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="text-red-500 " disabled={loading || isPending}>
            <Trash2 />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this post?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              post.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 ">
            <Button
              disabled={loading || isPending}
              variant="destructive"
              onClick={deletePost}
            >
              <Trash2 />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActionButtons;
