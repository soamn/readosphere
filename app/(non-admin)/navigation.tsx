import { Search } from "@/components/search";
import { ArrowRight } from "lucide-react";
import React from "react";

const Navigation = () => {
  return (
    <>
      <ul className="w-full flex flex-col md:flex-row  space-x-15 ">
        <li className="hover:underline hover:cursor-pointer underline-offset-8 tracking-widest transition-all duration-300 text-xl text-nowrap ">
          <a href="/catrgory/1">THE INNER SHELF</a>
        </li>
        <li className="hover:underline hover:cursor-pointer underline-offset-8 tracking-widest transition-all duration-300 text-xl text-nowrap"></li>
        <li className="hover:underline hover:cursor-pointer underline-offset-8 tracking-widest transition-all duration-300 text-xl text-nowrap">
          <a href="/category/2">MINDFUL READS</a>
        </li>
        <li className="hover:underline hover:cursor-pointer underline-offset-8 tracking-widest transition-all duration-300 text-xl text-nowrap">
          <a href="">THOUGHT BEHIND</a>
        </li>
        <li className=" hover:cursor-pointer underline-offset-8 tracking-widest transition-all duration-300 group  text-xl text-nowrap">
          <Search />
        </li>
      </ul>
    </>
  );
};

export default Navigation;
