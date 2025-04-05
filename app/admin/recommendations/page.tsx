"use client";

import React, { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { z } from "zod";

interface Recommendation {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  link?: string;
}

const RecommendationSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  description: z.string().min(1, "Description required"),
  imageUrl: z.string().url("Invalid image URL"),
  link: z.string().url("Invalid link").optional().or(z.literal("")),
  isActive: z.boolean(),
});

const RecommendationPage = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [open, setOpen] = useState(false);
  const [editRec, setEditRec] = useState<Recommendation | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");
  const [isActive, setIsActive] = useState(false);

  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recommendations", { cache: "no-store" });
      const data = await res.json();
      setRecommendations(data);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setImageUrl("");
    setLink("");
    setIsActive(false);
    setEditRec(null);
    setError(null);
    setOpen(false);
  };

  const handleSave = async () => {
    setError(null);

    const payload = {
      name,
      description,
      imageUrl,
      link,
      isActive,
    };

    const result = RecommendationSchema.safeParse(payload);

    if (!result.success) {
      const firstError = result.error.errors[0]?.message || "Invalid input";
      setError(firstError);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/recommendations${editRec ? `/${editRec.id}` : ""}`,
        {
          method: editRec ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result.data),
        }
      );

      const updated = await res.json();
      setRecommendations((prev) =>
        editRec
          ? prev.map((r) => (r.id === updated.id ? updated : r))
          : [...prev, updated]
      );

      resetForm();
    } catch (err) {
      console.error("Error saving recommendation:", err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/recommendations/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) return;

      setRecommendations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Error deleting:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-10 flex flex-col gap-5">
      <Button
        onClick={() => {
          resetForm();
          setOpen(true);
        }}
        disabled={loading}
        className="w-fit"
      >
        Add Recommendation
      </Button>

      <Card className="ring-2 ring-zinc-800 bg-transparent rounded-2xl p-5">
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <Table>
              <TableCaption>Manage Recommendations</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recommendations.length > 0 ? (
                  recommendations.map((rec) => (
                    <TableRow key={rec.id}>
                      <TableCell>{rec.name}</TableCell>
                      <TableCell>{rec.description}</TableCell>
                      <TableCell>
                        <img
                          src={rec.imageUrl}
                          alt={rec.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell>
                        {rec.link ? (
                          <a
                            href={rec.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            Visit
                          </a>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {rec.isActive ? "Active" : "Inactive"}
                      </TableCell>
                      <TableCell className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditRec(rec);
                            setName(rec.name);
                            setDescription(rec.description);
                            setImageUrl(rec.imageUrl);
                            setLink(rec.link || "");
                            setIsActive(rec.isActive);
                            setOpen(true);
                          }}
                          disabled={loading || deletingId !== null}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="outline"
                          className="text-red-500"
                          onClick={() => handleDelete(rec.id)}
                          disabled={loading || deletingId === rec.id}
                        >
                          {deletingId === rec.id ? "Deleting..." : <Trash2 />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No recommendations yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent key={editRec?.id || "new"}>
          <DialogHeader>
            <DialogTitle>
              {editRec ? "Edit Recommendation" : "Add Recommendation"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
            <Input
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={loading}
            />
            <Input
              placeholder="Link (optional)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              disabled={loading}
            />
            <div className="flex items-center gap-2">
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
                disabled={loading}
              />
              <span className="text-sm text-muted-foreground">
                Active Recommendation
              </span>
            </div>
            <Button disabled={loading} onClick={handleSave}>
              {loading ? "Saving..." : editRec ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecommendationPage;
