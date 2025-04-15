"use client";

import Image from "next/image";
import Navigation from "./navigation";
import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className=" group relative mt-20">
      <div className="h-[20rem] w-full overflow-hidden">
        <Image
          src="/footer.jpg"
          width={1920}
          height={1080}
          alt="Footer image"
          className="w-full h-full object-cover object-top select-none 
  [mask-image:linear-gradient(to_top,_white_20%,_transparent_100%)]"
        />
      </div>

      <div className="absolute top-2  w-full text-center space-y-4 z-50 md:p-4 p-10 max-w-full ">
        <p className="text-lg md:text-xl  leading-relaxed">
          Since this is my imaginary slow space, Pardon my slow movements
          <br />
          Until I come back with new story, stay chill just like Pewdiepie.
          Tada! !!!
          <br />
        </p>
        {/* 
        <div className="w-full mt-10 hidden md:block">
          <Navigation />
        </div> */}
      </div>

      <p className="text-xs sm:text-sm text-gray-300 absolute bottom-0 text-center w-full p-2 ">
        © {new Date().getFullYear()} Readosphere. All rights reserved.{" "}
        <a href="https://github.com/soamn" target="_blank">
          <Github className="inline-block ml-1" size={14} />
        </a>
      </p>
    </footer>
  );
}
