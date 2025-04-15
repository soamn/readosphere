import { Search } from "@/components/search";
import { ArrowRight } from "lucide-react";
import React from "react";

const Navigation = () => {
  return (
    <>
      <ul className="w-full flex flex-col md:flex-row items-start  gap-1 lg:gap-x-10">
        <li className="navigation">
          <a href="/#">THE INNER SHELF</a>
        </li>

        <li className="navigation">
          <a href="/#">MINDFUL READS</a>
        </li>

        <li className="navigation">
          <a href="/about">ABOUT</a>
        </li>

        <li className="tracking-widest  md:text-xs lg:text-xl ">
          <Search />
        </li>
      </ul>
    </>
  );
};

export default Navigation;
