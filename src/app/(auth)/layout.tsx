import { auth } from "@/auth";
import NavBar from "@/components/dashboard/nav-bar";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";
import AnimatedContent from "./animated-content";

const Map = dynamic(() => import("@/components/map/map"), {
  loading: () => (
    <p className="flex h-screen w-screen items-center justify-center">
      Loading Map...
    </p>
  ),
});

const AuthLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="min-h-screen h-full w-full flex flex-col relative">
      <NavBar />
      <div className="inset-0 z-0">
        <Map />
      </div>
      <div className="z-10 flex justify-center">
        <AnimatedContent>{children}</AnimatedContent>
      </div>
    </div>
  );
};

export default AuthLayout;
