import Image from "next/image";
import React from "react";

const Catalogue = () => {
  return (
    <section className="w-full relative flex flex-col-reverse lg:flex-row  mt-20 px-4 md:px-10 lg:px-40 gap-8 overflow-x-clip mb-10">
      {/* Decorative Bird Image (Hidden on small screens) */}
      <Image
        width={1920}
        height={1080}
        src="/bird2.png"
        alt="Bird"
        className="w-[40rem]  absolute z-50 right-20 top-10 hidden lg:block  "
      />

      {/* Background Image */}
      <Image
        width={1920}
        height={1080}
        src="/catalogue.jpg"
        alt="catalogue_background"
        className="w-full h-[30rem] md:h-[500px] lg:h-[500px] object-cover  rounded-xl "
      />

      {/* Content Overlay */}
      <div className="absolute left-0 lg:left-40  w-full h-full flex p-3">
        <div className="text-black max-w-xl p-4 md:p-10 lg:p-20  rounded-md ">
          <h2 className="text-4xl md:text-6xl lg:text-8xl lg:text-nowrap">
            Stories told, softly
          </h2>
          <p className="text-md md:text-lg lg:text-2xl mt-4 lg:text-nowrap leading-8">
            In a world that's always online —scrolling, responding, and
            connecting,
            <br /> I longed for a space that moved slower. A long-awaited corner
            of my imagination <br />
            —one that has been inside from my childhood, where stories once
            bloomed, and still do. <br />
          </p>
          <p className="mt-4 text-md md:text-lg lg:text-2xl lg:text-nowrap ">
            This is my way of gently weaving together the three companions that
            have always grounded me: <br /> <b>nature, books, and the calm</b>
            <i>(that I still continue to chase).</i>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Catalogue;
