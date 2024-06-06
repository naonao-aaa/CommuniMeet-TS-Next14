import Link from "next/link";
import React from "react";
import Hero from "@/components/Hero";
import InfoBoxes from "@/components/InfoBoxes";

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <InfoBoxes />
    </>
  );
};

export default HomePage;
