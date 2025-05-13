import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6 py-12">
      <h2 className="text-4xl font-bold mb-4">Event Not Found</h2>
      <p className="text-muted-foreground text-center mb-8">
        The event you&apos;re looking for doesn&apos;t exist or may be private.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/explore">Explore Public Events</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
};
export default NotFound;
