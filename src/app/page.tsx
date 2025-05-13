import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (session?.user) {
    return redirect("/map");
  } else {
    return redirect("/discover");
  }
};

export default Page;
