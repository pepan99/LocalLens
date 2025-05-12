import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";

export const EditEventNotFound = () => {
  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center">
        <div className="flex justify-center">
          <Edit className="h-24 w-24 text-gray-300" />
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          Cannot edit event
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          The event you&apos;re trying to edit doesn&apos;t exist or you
          don&apos;t permission to edit it.
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

export default EditEventNotFound;
