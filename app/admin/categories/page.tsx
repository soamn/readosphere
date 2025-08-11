"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Textarea } from "@/app/components/ui/textarea";
import { Category } from "@prisma/client";

const Page = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data: Category[] = await res.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/categories${editCategory ? `/${editCategory.id}` : ""}`,
        {
          method: editCategory ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description }),
        }
      );

      if (!res.ok) throw new Error("Failed to save category");
      const updatedCategory = await res.json();

      setCategories((prev) =>
        editCategory
          ? prev.map((cat) =>
              cat.id === updatedCategory.id ? updatedCategory : cat
            )
          : [...prev, updatedCategory]
      );

      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");

      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditCategory(null);
    setOpen(false);
  };

  return (
    <div className="p-10 flex flex-col gap-5">
      <Button
        onClick={() => setOpen(true)}
        className="w-fit"
        disabled={loading}
      >
        Add Category
      </Button>

      <Card className="ring-2 ring-zinc-800 bg-transparent rounded-2xl p-5">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center">Loading categories...</p>
          ) : (
            <Table>
              <TableCaption>Manage Categories</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length > 0 ? (
                  categories.map((category: Category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell className="flex justify-center gap-2">
                        <Button
                          variant={"outline"}
                          onClick={() => {
                            setEditCategory(category);
                            setName(category.name);
                            setDescription(category.description as string);
                            setOpen(true);
                          }}
                          disabled={loading || deletingId !== null}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          className="text-red-500"
                          variant={"outline"}
                          onClick={() => handleDelete(category.id)}
                          disabled={loading || deletingId === category.id}
                        >
                          {deletingId === category.id ? (
                            "Deleting..."
                          ) : (
                            <Trash2 />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No Categories Yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            placeholder="Enter category name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="selection:bg-white selection:text-black"
          />
          <Textarea
            placeholder="Enter category description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            className="selection:bg-white selection:text-black"
          />
          <Button disabled={loading} onClick={handleSave} className="mt-3">
            {loading ? "Saving..." : editCategory ? "Update" : "Create"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
