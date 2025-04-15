import { MoveRight } from "lucide-react";
import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <>
      <section className="w-full h-[50rem] relative overflow-hidden">
        <Image
          src="/hero1.jpg"
          alt="hero image"
          width={1920}
          height={1080}
          className="blur hover:blur-none w-full h-[50rem] object-cover select-none 
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

      <section className="w-full flex flex-col lg:flex-row   space-x-20   mb-20 px-20 text-[#FEFEFE]">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl tracking-widest text-center lg:text-left">
          Each word holds
        </h2>

        <div className="flex flex-col  mt-4 lg:mt-10 text-center lg:text-left ">
          <p className="text-md md:text-2xl md:leading-10">
            Inviting vou to immerse yourself <br />
            in the rich tapestry of the words...
          </p>

          <div className="relative group w-full mt-6">
            <a href="#" className="tracking-widest w-full flex text-3xl">
              <span className=" w-full flex items-center">
                <MoveRight className="ml-auto" />
              </span>
            </a>

            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white transition-opacity duration-300 group-hover:opacity-0"></span>
          </div>
        </div>

        <h2 className="flex-1 text-4xl sm:text-5xl md:text-6xl lg:text-8xl tracking-widest text-center lg:text-left mt-4 lg:mt-16 text-nowrap">
          a story
        </h2>
      </section>
    </>
  );
};

export default Hero;
