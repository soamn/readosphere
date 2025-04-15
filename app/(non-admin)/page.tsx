import React from "react";
import Hero from "./hero";
import RecommendationList from "./recommendations";
import Featured from "./featured";
import Catalogue from "./catalogue";
import Header from "./header";

const page = () => {
  return (
    <>
      {" "}
      <Header />
      <main className="min-h-screen flex flex-col ">
        <Hero />
        <div className="h-full w-full overflow-clip">
          <Featured />
        </div>
        <Catalogue />
        <RecommendationList />
      </main>
    </>
  );
};

export default page;
