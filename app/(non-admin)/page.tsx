import React from "react";
import Hero from "./hero";
import RecommendationList from "./recommendations";
import Featured from "./featured";
import Catalogue from "./catalogue";

const page = () => {
  return (
    <>
      <Hero />
      <div className="h-full w-full overflow-clip">
        <Featured />
      </div>
      <Catalogue />
      <RecommendationList />
    </>
  );
};

export default page;
