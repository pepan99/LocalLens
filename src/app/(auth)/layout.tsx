import { auth } from "@/auth";
import NavBar from "@/components/dashboard/nav-bar";
import MapCaller from "@/components/map/map/map-caller";
import { getEvents } from "@/modules/events/server/queries";
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

  const events = await getEvents();

  if (!events) {
    return <div>Loading...</div>;
  }

  console.log("Events in AuthLayout:", events);

  return (
    <div className="min-h-screen h-full w-full flex flex-col relative">
      <NavBar />
      <div className="absolute mt-12 inset-0 z-0">
        <MapCaller events={events} />
      </div>
      <AnimatedContent>{children}</AnimatedContent>
    </div>
  );
};

export default AuthLayout;
