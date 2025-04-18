import { Metadata } from "next";
import Link from "next/link";
import { Frown } from "lucide-react";
import React from "react";

export function generateMetadata(): Metadata {
  return {
    title: "404 | Page Not Found",
    description: "Sorry, the page you are looking for does not exist.",
  };
}

const NotFound = () => {
  return (
    <div className=" flex flex-col items-center  0 px-4 mt-50">
      <div className="text-center">
        <Frown className="w-16 h-16  mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
        <p className="text-lg  mb-6">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <Link
          href="/"
          className="inline-block  text-white underline underline-offset-8"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
