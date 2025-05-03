import { auth } from "@/auth";
import SignInButton from "@/components/public/sign-in-button";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (session?.user) return redirect("/dashboard");

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h1 className="text-2xl">Welcome to LocalLens!</h1>
      <p className="pb-5">To continue please sign in</p>
      <SignInButton />
    </div>
  );
};

export default Page;
