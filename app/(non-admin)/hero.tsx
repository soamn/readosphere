import { MoveRight } from "lucide-react";
import Image from "next/image";
import React from "react";

import * as motion from "motion/react-client";

const Hero = (data: any) => {
  const heroText1 = data.content.heroText1;
  const heroText2 = data.content.heroText2;
  const heroImage = data.content.heroImage;
  const featuredText1 = data.content.featuredText1;
  const featuredText2 = data.content.featuredText2;
  const smallpgArray = data.content.smallparagraph.split(" ");
  const smallparagraph1 = smallpgArray.slice(0, 5).join(" ");
  const smallparagraph2 = smallpgArray.slice(5).join(" ");
  return (
    <>
      <section className="w-full h-[43rem] relative overflow-hidden ">
        <Image
          src={`/${heroImage}`}
          alt="hero image"
          width={1920}
          height={1080}
          className="w-full h-[43rem] object-cover select-none  transition-all duration-300 [mask-image:linear-gradient(to_bottom,_white,_transparent)]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileTap={{ scale: 0.95 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute w-full top-[40%] text-center cursor-pointer px-4"
        >
          <h1 className="flex flex-col text-5xl md:text-6xl lg:text-[4.6rem]  ">
            <span className="font-extralight selection:bg-black/30 tracking-widest">
              {heroText1}
            </span>
            <span className="font-extrabold selection:bg-black/30 tracking-widest py-4 font-rakkas">
              {heroText2}
            </span>
          </h1>
        </motion.div>
      </section>

      <section className="flex flex-col mb-20 md:px-20  text-[#FEFEFE] gap-y-7 lg:gap-0">
        {/* Heading: "Each word holds" */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3 }}
          className="text-4xl md:6xl  lg:text-[4.6rem]  tracking-widest whitespace-nowrap  text-center   lg:text-left cursor-pointer"
        >
          {featuredText1}
        </motion.h2>

        {/* Subtexts & CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3 }}
          className="flex justify-center   w-full "
        >
          <div className="flex flex-col items-center md:items-start w-fit lg:ml-90">
            <p className="text-base md:text-xl   text-center tracking-wider">
              {smallparagraph1}
            </p>
            <p className="text-base md:text-xl text-center md:text-left tracking-wider">
              {smallparagraph2}
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
        </motion.div>

        {/* Heading: "a story" */}
        <div className="flex justify-center lg:justify-end  ">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3 }}
            className="text-5xl md:text-6xl cursor-pointer lg:text-[4.6rem]  tracking-widest whitespace-nowrap text-center lg:relative -top-12"
          >
            {featuredText2}
          </motion.h2>
        </div>
      </section>
    </>
  );
};

export default Hero;
