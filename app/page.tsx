import Link from "next/link";
import React from "react";

const HomePage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl">Welcome</h1>
      <Link href="/events">Show Events</Link>
    </div>
  );
};

export default HomePage;
