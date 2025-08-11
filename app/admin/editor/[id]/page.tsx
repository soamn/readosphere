import Editor from "@/app/components/editor";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const value = Number(id);
  if (Number.isNaN(value)) {
    notFound();
  }
  const content = await prisma.post.findFirst({
    where: {
      id: value,
    },
    select: {
      content: true,
    },
  });
  let html = "Hi";
  if (content) {
    html = content.content;
  }
  return (
    <div className="relative overflow-clip m-auto max-w-5xl ">
      <Editor html={html} isUpdate={true} />
    </div>
  );
};

export default page;
