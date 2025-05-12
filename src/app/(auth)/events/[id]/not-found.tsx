import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import Link from "next/link";

export const EventNotFound = () => {
  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center">
        <div className="flex justify-center">
          <Calendar className="h-24 w-24 text-gray-300" />
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          Event not found
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          The event you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <div className="mt-10">
          <Button asChild>
            <Link href="/events">Return to events</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventNotFound;
