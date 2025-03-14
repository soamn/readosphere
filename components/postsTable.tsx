"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export function PostsTable() {
  const [posts, setPosts] = useState<
    {
      id: number;
      metaTitle: string;
      metaDescription: string;
      metaTags: string;
      createdAt: string;
      published: boolean;
    }[]
  >([]);
  const [selectedPost, setSelectedPost] = useState<{
    id: number;
    metaTitle: string;
    metaDescription: string;
    metaTags: string;
    createdAt: string;
    published: boolean;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  const handleTogglePublish = async () => {
    if (!selectedPost) return;

    try {
      const response = await fetch(`/api/posts/${selectedPost.id}/publish`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to update post status");
      }

      const updatedPost = await response.json();

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === selectedPost.id
            ? { ...post, published: updatedPost.post.published }
            : post
        )
      );

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <Table className="text-white">
      <TableCaption>A list of your posts.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell className="font-medium">{post.metaTitle}</TableCell>
            <TableCell>{post.metaDescription}</TableCell>
            <TableCell>{post.metaTags}</TableCell>
            <TableCell>{post.createdAt}</TableCell>
            <TableCell>{post.published ? " Published" : " Draft"}</TableCell>
            <TableCell className="text-right">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    onClick={() => {
                      setSelectedPost(post);
                      setIsDialogOpen(true);
                    }}
                  >
                    {post.published ? "Unpublish" : "Publish"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>
                    {selectedPost?.published
                      ? "Unpublish Post"
                      : "Publish Post"}
                  </DialogTitle>
                  <DialogDescription>
                    Are you sure you want to{" "}
                    <span className="font-semibold">
                      {selectedPost?.published ? "unpublish" : "publish"}
                    </span>{" "}
                    the post "
                    <span className="font-semibold">
                      {selectedPost?.metaTitle}
                    </span>
                    "?
                  </DialogDescription>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleTogglePublish}>
                      {selectedPost?.published
                        ? "Confirm Unpublish"
                        : "Confirm Publish"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
