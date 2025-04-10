import React from "react";
import CategoryMap from "./accordian";
import Hero from "./hero";
import RecommendationList from "./recommendations";
import BookOrbit from "./svg";

const page = () => {
  return (
    <>
      <BookOrbit />
      <Hero />
      <CategoryMap />
      <RecommendationList />
    </>
  );
};

export default page;
