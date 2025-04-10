import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AccordionItem } from "@radix-ui/react-accordion";
import { Post } from "@/types/post";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowRight } from "lucide-react";

async function getCategories(): Promise<any[]> {
  try {
    const categories = await prisma.category.findMany({
      include: {
        posts: {
          where: { published: true },
          select: {
            slug: true,
            title: true,
            category: {
              select: {
                name: true,
                id: true,
                description: true,
              },
            },
          },
        },
      },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function CategoryMap() {
  const categories = await getCategories();

  return (
    <section className="mt-10 w-full p-5">
      <div className="flex items-start justify-center relative">
        <div className="absolute -left-1 transform -translate-x-1/2 h-full border-l-8 p-5 rounded-sm border-[#B6C4A2]"></div>
        <Accordion type="multiple" className="w-full flex flex-col gap-5">
          {categories?.length > 0 ? (
            categories.map((category, key) => (
              <AccordionItem
                key={key}
                value={category.name}
                className=" p-5 rounded-lg relative z-10 cursor-pointer bg-white"
              >
                <div className="flex items-center gap-5 relative">
                  <div className="h-8 w-8 rounded-full bg-primary absolute -left-15 text-white bg-regular font-bold flex justify-center items-center">
                    {key + 1}
                  </div>
                  <AccordionTrigger className="text-lg font-semibold cursor-pointer">
                    {category.name}
                  </AccordionTrigger>
                </div>
                <AccordionContent className="p-1">
                  <p>{category.description}</p>
                  <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 py-2">
                    {category.posts.map((post: Post, key: number) => (
                      <Link
                        href={post.slug}
                        key={key}
                        title={post.title}
                        className="p-2 ring-1 flex justify-between  rounded-sm font-bold   min-w-24 text-[#D7A98C] hover:bg-[#D7A98C] hover:text-white transition-all duration-200"
                      >
                        {post.title}
                        <ArrowRight width={15} />
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))
          ) : (
            <p className="text-gray-500">No categories available.</p>
          )}
        </Accordion>
      </div>
    </section>
  );
}
