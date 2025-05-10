import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const ProfilePage = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold">Profile page</h1>
        <div>
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome to your profile page. Here you can see statistics from your
            attended events.
          </p>
        </div>
        <Card className="my-4">
          <h2 className="text-2xl font-bold px-6">Account</h2>
          <CardContent className="flex gap-6 px-6 py-2">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.image ?? ""} alt={user?.name ?? "User"} />
              <AvatarFallback>{user?.name?.charAt(0) ?? "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="pd-2 underline underline-offset-1">Username:</p>
              <p className="text-xl font-semibold">{user?.name}</p>
              <p className="py-2 underline underline-offset-1">Email:</p>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="my-4">
          <h2 className="text-2xl font-bold px-6">Event statistics</h2>
          <CardContent className="flex gap-6 px-6 py-2">
            <div>
              <p className="pd-2 underline underline-offset-1">
                Number of attended events:
              </p>
              <p className="text-xl font-semibold">69</p>
              <p className="py-2 underline underline-offset-1">
                Number of created events:
              </p>
              <p className="text-xl font-semibold">10</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
