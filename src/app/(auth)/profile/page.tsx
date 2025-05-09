import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ProfilePage = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      <Card>
        <CardContent className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user?.image ?? ""} alt={user?.name ?? "User"} />
            <AvatarFallback>{user?.name?.charAt(0) ?? "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xl font-semibold">{user?.name}</p>
            <p className="text-gray-500">{user?.email}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Welcome to your profile page. Here you can manage your event
              preferences and map visibility.
            </p>
            <Button className="mt-4">Edit Profile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
