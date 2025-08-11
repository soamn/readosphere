import Timeline from "@/app/components/ui/timeline";
import { prisma } from "@/lib/prisma";
import { Post } from "@prisma/client";
import Image from "next/image";
import React from "react";

const Featured = async () => {
  const posts = await prisma.post.findMany({
    where: {
      isFeatured: true,
      published: true,
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  const data = posts.map((post: Post) => {
    const dateObj = new Date(post.updatedAt);
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const year = dateObj.getFullYear();
    const formattedDate = `${month}.${day}.${year}`;

    return {
      title: post.metaTitle,
      link: post.slug,
      img: post.thumbnail || "featured-1745070056699.jpg",
      date: formattedDate,
    };
  });

  return (
    <>
      <div className="w-full ">
        <Timeline data={data} />
      </div>
    </>
  );
};

export default Featured;
