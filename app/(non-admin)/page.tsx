import React from "react";
import CategoryMap from "./accordian";
import Hero from "./hero";
import RecommendationList from "./recommendations";

const page = () => {
  return (
    <>
      <Hero />
      <CategoryMap />
      <RecommendationList />
    </>
  );
};

export default page;
