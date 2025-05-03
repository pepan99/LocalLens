import { auth } from "@/auth";
import { redirect } from "next/navigation";

const AuthLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return children;
};

export default AuthLayout;
