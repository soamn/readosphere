import React from "react";
import Hero from "./hero";
import RecommendationList from "./recommendations";
import Featured from "./featured";
import Catalogue from "./catalogue";
import Image from "next/image";

const page = () => {
  return (
    <>
      {" "}
      <main className="min-h-screen flex flex-col ">
        <Hero />
        <Catalogue />
        <div className="h-full w-full overflow-clip">
          <Featured />
        </div>
        <section className="w-full lg:h-screen relative   bg-zinc-900 mt-20">
          <div className="absolute w-1/3 h-[50%] bg-zinc-900 -top-2">
            <div className=" absolute w-2 lg:h-screen h-[106%]  bg-zinc-900 right-0 lg:top-2 top-full"></div>
          </div>
          <Image
            width={1920}
            height={1080}
            src="/feature.jpg"
            alt="feature_image"
            className="w-full h-full object-cover"
          />
          <div className="absolute w-1/3 h-[50%] bg-zinc-900 -bottom-2 right-0">
            <div className=" absolute w-2 lg:h-screen h-[106%]  bg-zinc-900 left-0 lg:bottom-2 -top-[106%]"></div>
          </div>
        </section>
        <RecommendationList />
      </main>
    </>
  );
};

export default page;
