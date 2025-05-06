import { auth } from "@/auth";
import NavBar from "@/components/dashboard/nav-bar";
import MapCaller from "@/components/map/map-caller";
import { redirect } from "next/navigation";
import React from "react";
import AnimatedContent from "./animated-content";

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
      <div className="absolute mt-12 inset-0 z-0">
        <MapCaller />
      </div>
      <AnimatedContent>{children}</AnimatedContent>
    </div>
  );
};

export default AuthLayout;
