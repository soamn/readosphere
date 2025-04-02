import React from "react";

const Hero = () => {
  return (
    <section>
      <h1 className="text-5xl font-bold">
        <span>Mindfull Reading</span> <br />A guide towards mindfulness
      </h1>
      <div className=" p-4 font-bold text-secondary">
        <span>Updated On | </span>
        <time dateTime="2025-04-01">April 1, 2025</time>
      </div>
      <article className="text-xl ">
        <p className=" mb-5">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur nihil
          ab ex obcaecati.{" "}
          <a href=".df" className="relative text-highlight no-underline group">
            Soluta esse
            <span className="absolute left-0 bottom-[-3px] w-full h-[2px] bg-highlight transition-transform duration-100  group-hover:scale-x-0"></span>
          </a>
          exercitationem totam! Veritatis, doloremque molestias.
        </p>

        <p className="mb-5">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur nihil
          ab ex obcaecati. <br />
          <a href=".df" className="relative text-highlight no-underline group">
            Soluta esse exercitationem
            <span className="absolute left-0 bottom-[-3px] w-full h-[2px] bg-highlight transition-transform duration-100  group-hover:scale-x-0"></span>
          </a>{" "}
          totam! Veritatis, doloremque molestias.
        </p>

        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur nihil
          ab ex obcaecati. Soluta esse exercitationem totam! Veritatis,
          doloremque molestias. nihil ab ex obcaecati. Soluta esse
          exercitationem totam! Veritatis, doloremque molestias. nihil ab ex
          obcaecati. Soluta esse exercitationem totam! Veritatis, doloremque
          molestias.
        </p>
      </article>
    </section>
  );
};

export default Hero;
