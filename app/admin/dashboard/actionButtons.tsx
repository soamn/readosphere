"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";

interface ActionButtonsProps {
  postId: number;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ postId }) => {
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const deletePost = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
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
        onClick={() => router.push(`/admin/editor/${postId}`)}
        disabled={loading || isPending}
        variant="outline"
      >
        <Pencil />
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
