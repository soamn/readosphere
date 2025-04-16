import { MoveRight } from "lucide-react";
import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <>
      <section className="w-full h-[43rem] relative overflow-hidden group">
        <Image
          src="/hero1.jpg"
          alt="hero image"
          width={1920}
          height={1080}
          className="w-full h-[43rem] object-cover select-none group-hover:blur-[4px] transition-all duration-300 [mask-image:linear-gradient(to_bottom,_white,_transparent)]"
        />
        <div className="absolute w-full top-[40%] text-center cursor-pointer px-4">
          <h1 className="flex flex-col text-5xl md:text-6xl lg:text-8xl group-hover:text-white transition-all duration-300">
            <span className="font-extralight selection:bg-black/30 tracking-widest">
              Rediscover the
            </span>
            <span className="font-extrabold selection:bg-black/30 tracking-widest py-4 font-rakkas">
              Beauty of Reading
            </span>
          </h1>
        </div>
      </section>

      <section className="flex flex-col mb-20 md:px-20  text-[#FEFEFE] gap-y-7 lg:gap-0">
        {/* Heading: "Each word holds" */}
        <h2 className="text-4xl md:6xl  lg:text-8xl  tracking-widest whitespace-nowrap  text-center   lg:text-left">
          Each word holds
        </h2>

        {/* Subtexts & CTA */}
        <div className="flex justify-center   w-full ">
          <div className="flex flex-col items-center md:items-start w-fit lg:ml-90">
            <p className="text-base md:text-md   text-center ">
              Inviting you to immerse yourself
            </p>
            <p className="text-base md:text-md text-center md:text-left">
              in the rich tapestry of the words...
            </p>

            {/* CTA Button */}
            <div className="relative group w-full top-5">
              <a
                href="#"
                className="tracking-widest w-full flex text-lg sm:text-xl lg:text-2xl"
              >
                <span className="w-full flex items-center">
                  <MoveRight className="ml-auto" />
                </span>
              </a>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white transition-opacity duration-300 group-hover:opacity-0"></span>
            </div>
          </div>
        </div>

        {/* Heading: "a story" */}
        <div className="flex justify-center lg:justify-end  ">
          <h2 className="text-5xl md:text-6xl  lg:text-8xl  tracking-widest whitespace-nowrap text-center ">
            a story
          </h2>
        </div>
      </section>
    </>
  );
};

export default Hero;
