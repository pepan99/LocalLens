"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFoundState = () => {
  return (
    <div className="container flex flex-col justify-center items-center min-h-[60vh]">
      <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
      <p className="text-gray-500 mb-6">
        The event you are looking for does not exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/events">Back to Events</Link>
      </Button>
    </div>
  );
};

export default NotFoundState;
