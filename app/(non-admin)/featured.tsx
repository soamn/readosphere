import { Timeline } from "@/components/ui/timeline";
import { prisma } from "@/lib/prisma";
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
  const data = posts.map((post) => ({
    title: post.title,
    link: post.slug,
    img: post.thumbnail || "/bg-readospherecom.jpg",
    category: post.category?.name || "Uncategorized",
  }));
  return (
    <>
      <section className="w-full relative mb-20 hidden md:block">
        <div className="absolute w-160 h-[50%] bg-zinc-900 top-0">
          <div className=" absolute w-2 h-screen  bg-zinc-900 right-0"></div>
        </div>
        <img
          src="/feature.jpg"
          alt=""
          className="w-full h-screen object-cover"
        />
        <div className="absolute w-160 h-[50%] bg-zinc-900 bottom-0 right-0">
          <div className=" absolute w-2 h-screen  bg-zinc-900 left-0 -top-full"></div>
        </div>
      </section>
      <div className="w-full">
        <Timeline data={data} />
      </div>
    </>
  );
};

export default Featured;
