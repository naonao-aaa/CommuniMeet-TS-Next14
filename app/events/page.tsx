import Link from "next/link";
import React from "react";

const EventsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl">Events</h1>
      <Link href="/">Go Home</Link>
    </div>
  );
};

export default EventsPage;
