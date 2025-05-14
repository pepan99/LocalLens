import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <Skeleton className="h-10 w-56 mb-2" />
          <Skeleton className="h-6 w-72" />
        </div>
        <Skeleton className="h-10 w-40 mt-4 md:mt-0" />
      </div>

      {/* Search bar */}
      <div className="mb-8">
        <Skeleton className="h-10 w-full md:w-80" />
      </div>

      {/* Map view */}
      <Card className="mb-8">
        <CardHeader>
          <Skeleton className="h-7 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[500px] w-full rounded-md" />
        </CardContent>
      </Card>

      {/* Events list */}
      <Skeleton className="h-8 w-48 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-20" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-4 w-40 mb-3" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4 mb-3" />
              <Skeleton className="h-4 w-24 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Loading;
