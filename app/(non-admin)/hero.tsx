import { MoveRight } from "lucide-react";
import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <>
      <section className="w-full h-[50rem] relative overflow-hidden ">
        <Image
          src="/hero1.jpg"
          alt="hero image"
          width={1920}
          height={1080}
          className="md:blur hover:blur-none w-full h-[50rem] object-cover select-none 
         [mask-image:linear-gradient(to_bottom,_white,_transparent)]"
        />

        <div className="absolute w-full top-[40%] text-center cursor-pointer px-4">
          <h1 className="flex flex-col  text-4xl sm:text-5xl md:text-6xl lg:text-8xl ">
            <span className="font-extralight selection:bg-black/30 tracking-widest">
              Rediscover the
            </span>
            <span className="font-extrabold selection:bg-black/30 tracking-widest py-4 sm:py-6 font-rakkas">
              Beauty of Reading
            </span>
          </h1>
        </div>
      </section>

      <section className="w-full flex flex-col lg:flex-row justify-between items-center lg:items-start lg:gap-10 mb-20 px-6 sm:px-10 lg:px-20 text-[#FEFEFE]">
        {/* Left Heading */}
        <div className="flex-1 text-center w-full ">
          <h2 className="text-3xl md:text-6xl lg:text-8xl tracking-wider text-nowrap relative lg:-top-10">
            Each word holds
          </h2>
        </div>

        {/* Center Text */}
        <div className="flex-1 w-full flex flex-col items-center justify-center lg:items-center lg:text-left ">
          <div className="flex flex-col items-center lg:items-start w-fit">
            <p className="text-lg md:text-lg  lg:text-xl text-center lg:text-left">
              Inviting you to immerse yourself
            </p>
            <p className="text-lg md:text-xs lg:text-xl text-center lg:text-left">
              in the rich tapestry of the words...
            </p>

            <div className="relative group w-full mt-6">
              <a
                href="#"
                className="tracking-widest w-full flex text-xl sm:text-2xl lg:text-3xl"
              >
                <span className="w-full flex items-center">
                  <MoveRight className="ml-auto" />
                </span>
              </a>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white transition-opacity duration-300 group-hover:opacity-0"></span>
            </div>
          </div>
        </div>

        {/* Right Heading */}
        <div className="flex-1 text-center w-full lg:text-center">
          <h2 className="text-3xl md:text-6xl lg:text-8xltracking-wider mt-6 lg:mt-16 text-nowrap">
            a story
          </h2>
        </div>
      </section>
    </>
  );
};

export default Hero;
