import Link from "next/link";
import React from "react";
import Hero from "@/components/Hero";
import InfoBoxes from "@/components/InfoBoxes";
import HomeEvents from "@/components/HomeEvents";
import FeaturedEvents from "@/components/FeaturedEvents";

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <InfoBoxes />
      <FeaturedEvents /> {/* 注目イベント */}
      <HomeEvents />
    </>
  );
};

export default HomePage;
