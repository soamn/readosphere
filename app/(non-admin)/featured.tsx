import  Timeline  from "@/components/ui/timeline";
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
      img: post.thumbnail || "/bg-readospherecom.jpg",
      date: formattedDate,
    };
  });

  return (
    <>
      <section className="w-full h-screen relative mb-20 hidden md:block bg-red-500">
        <div className="absolute w-1/3 h-[50%] bg-zinc-900 top-0">
          <div className=" absolute w-2 h-screen  bg-zinc-900 right-0"></div>
        </div>
        <Image
          width={1920}
          height={1080}
          src="/feature.jpg"
          alt="feature_image"
          className="w-full h-full object-cover"
        />
        <div className="absolute w-1/3 h-[50%] bg-zinc-900 -bottom-0 right-0">
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
