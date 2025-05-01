import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div>
      <h1>Current user: {session.user.name}</h1>
      <pre>{JSON.stringify(session.user, null, 2)}</pre>
    </div>
  );
};

export default Page;
