"use client";

import Navigation from "./navigation";

export default function Footer() {
  return (
    <footer className=" group relative ">
      <div className="h-[20rem] w-full overflow-hidden">
        <img
          src="/footer.jpg"
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
        © {new Date().getFullYear()} Readosphere. All rights reserved.
      </p>
    </footer>
  );
}
