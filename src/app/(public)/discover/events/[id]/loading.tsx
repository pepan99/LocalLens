import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex justify-between flex-row items-start">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Skeleton className="h-5 w-40 mb-1" />
                <Skeleton className="h-5 w-32" />
              </div>

              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-5 w-64 mb-3" />
                <Skeleton className="h-[300px] w-full rounded-md" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Event Actions */}
        <div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />

              <div className="pt-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4 mb-4" />

              <div className="flex gap-2 mt-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Loading;
