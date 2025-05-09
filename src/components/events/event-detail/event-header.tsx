"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const EventHeader = () => {
  return (
    <div className="mb-6">
      <Button variant="outline" asChild className="mb-4">
        <Link href="/events">
          <span className="mr-2">←</span> Back to Events
        </Link>
      </Button>
    </div>
  );
};

export default EventHeader;
