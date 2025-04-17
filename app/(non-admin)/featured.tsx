import Timeline from "@/components/ui/timeline";
import { prisma } from "@/lib/prisma";
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

  const data = posts.map((post) => {
    const dateObj = new Date(post.updatedAt);
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const year = dateObj.getFullYear();
    const formattedDate = `${month}.${day}.${year}`;

    return {
      title: post.title,
      link: post.slug,
      img: post.thumbnail || "/feature.jpg",
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
