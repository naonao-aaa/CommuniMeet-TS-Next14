import Link from "next/link";
import React from "react";
import Hero from "@/components/Hero";
import InfoBoxes from "@/components/InfoBoxes";
import HomeEvents from "@/components/HomeEvents";

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <InfoBoxes />
      <HomeEvents />
    </>
  );
};

export default HomePage;
