import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ActionButtons from "@/app/admin/dashboard/actionButtons";
import { Post } from "@/types/post";

const Dashboard = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
    cache: "no-store",
  });
  const posts: Post[] = await response.json();
  return (
    <div className="p-6 flex gap-5 flex-col">
      <Card className="max-w-52 bg-transparent">
        <CardHeader>
          <CardTitle>Total Posts</CardTitle>
          <CardDescription>You have {posts.length} posts</CardDescription>
        </CardHeader>
      </Card>

      <div className="ring-2 ring-zinc-800 rounded-2xl p-5">
        <Table>
          <TableCaption>A list of your posts.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length > 0 ? (
              posts.map((post: Post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">
                    {post.metaTitle.slice(0, 20)}
                  </TableCell>
                  <TableCell>{post.metaDescription.slice(0, 20)}</TableCell>
                  <TableCell>{post.metaTags.slice(0, 20)}</TableCell>
                  <TableCell>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {post.published ? "Published" : "Draft"}
                  </TableCell>
                  <TableCell>
                    <ActionButtons
                      postId={post.id}
                      published={post.published}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No posts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;
