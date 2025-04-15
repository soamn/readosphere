"use client";
import { ArrowRight } from "lucide-react";
import { useScroll, useTransform, motion } from "motion/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  link: string;
  img: string;
  date: string;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 0.8], [0, height]);

  return (
    <div className="w-full font-sans " ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg md:text-8xl text-center font-extralight tracking-widest  relative top-35 left-52">
          Featured
        </h2>
      </div>

      <div ref={ref} className="relative mx-auto">
        {data.map((item, index) => {
          const isLeft = index % 2 === 0;
          return (
            <div
              key={index}
              className="flex flex-col lg:flex-row py-12 relative"
            >
              {isLeft && (
                <div className="w-full flex flex-col lg:flex-row justify-between lg:space-x-40">
                  <div className="w-full h-[50rem] overflow-clip ">
                    <Image
                      src={item.img}
                      alt={item.title}
                      width={1920}
                      height={1080}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-full flex flex-col items-start self-end px-4 lg:px-0  ]">
                    <h3 className="text-2xl lg:text-4xl tracking-widest font-extralight uppercase text-red-600">
                      {item.title}
                    </h3>
                    <span className="text-lg lg:text-2xl text-[#656565]   uppercase mt-4 text-[#656565">
                      {item.date}
                    </span>
                    <div className="relative group w-full lg:w-1/2">
                      <a
                        href={`/${item.link}`}
                        className="tracking-widest w-full flex justify-between items-center mt-10 lg:mt-20 text-[#656565] "
                      >
                        View post
                        <ArrowRight />
                      </a>
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#656565] transition-opacity duration-300 group-hover:opacity-0"></span>
                    </div>
                  </div>
                </div>
              )}

              {!isLeft && (
                <div className="w-full flex flex-col lg:flex-row justify-between lg:space-x-40">
                  {/* Text section on the left */}
                  <div className="w-full flex flex-col items-end self-end px-4 lg:px-0">
                    <h3 className="text-2xl lg:text-4xl tracking-widest font-extralight uppercase text-red-600">
                      {item.title}
                    </h3>
                    <span className="text-lg lg:text-2xl text-[#656565]  uppercase mt-4">
                      {item.date}
                    </span>
                    <div className="relative group w-full lg:w-1/2">
                      <a
                        href={`/${item.link}`}
                        className="tracking-widest w-full flex justify-between items-center mt-10 lg:mt-20 text-[#656565] "
                      >
                        View post
                        <ArrowRight />
                      </a>
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#656565] transition-opacity duration-300 group-hover:opacity-0"></span>
                    </div>
                  </div>

                  {/* Image section on the right */}
                  <div className="w-full h-[50rem] overflow-clip">
                    <Image
                      width={1920}
                      height={1080}
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Vertical timeline */}
        <div
          style={{ height: `${height}px` }}
          className="absolute left-1/2 -translate-x-1/2 top-38 w-[2px] hidden lg:block"
        >
          <div className="absolute inset-0 w-[2px] bg-neutral-400 dark:bg-neutral-700" />
          {Array.from({ length: Math.floor(height / 120) }).map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 -translate-x-1/2 w-10 h-[1px] bg-neutral-500 dark:bg-neutral-600"
              style={{ top: `${i * 120}px` }}
            />
          ))}
          <motion.div
            style={{
              height: heightTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-white dark:bg-white"
          />
        </div>
      </div>
    </div>
  );
};
