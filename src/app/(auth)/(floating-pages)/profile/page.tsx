import { auth } from "@/auth";
import MapReturnButton from "@/components/buttons/map-return-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { getUserEventStats } from "@/modules/profile/server/queries";

const ProfilePage = async () => {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return <div className="p-6 text-center">You must be logged in.</div>;
  }

  const stats = await getUserEventStats(user.id);

  return (
    <div className="container">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold">Profile page</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome to your profile page. Here you can see statistics from your
          attended events.
        </p>

        <Card className="my-4">
          <h2 className="text-2xl font-bold px-6">Account</h2>
          <CardContent className="flex gap-6 px-6 py-2">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.image ?? ""} alt={user?.name ?? "User"} />
              <AvatarFallback>{user?.name?.charAt(0) ?? "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="underline underline-offset-1">Username:</p>
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
              <p className="underline underline-offset-1">
                Number of attended events:
              </p>
              <p className="text-xl font-semibold">{stats.attendedEvents}</p>
              <p className="py-2 underline underline-offset-1">
                Number of created events:
              </p>
              <p className="text-xl font-semibold">{stats.createdEvents}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
