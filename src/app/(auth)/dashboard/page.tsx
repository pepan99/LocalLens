import { auth } from "@/auth";
import SignOutButton from "@/components/public/sign-out-button";

const DashboardPage = async () => {
  const session = await auth();

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h1 className="text-2xl">Dashboard</h1>
      <p className="pb-5">Welcome, {session?.user?.name}</p>

      <SignOutButton />
    </div>
  );
};

export default DashboardPage;
