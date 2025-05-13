import { auth } from "@/auth";
import MapReturnButton from "@/components/buttons/map-return-button";
import NavBar from "@/components/dashboard/nav-bar";
import MapCaller from "@/components/map/map/map-caller";
import { getEvents } from "@/modules/events/server/queries";
import { redirect } from "next/navigation";
import React from "react";

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
  return (
    <div className="min-h-screen h-full w-full flex flex-col relative">
      <NavBar />
      <div className="absolute mt-12 inset-0 z-0">
        <MapCaller events={events} />
      </div>
      <div className="m-auto min-[margin-right]:10 relative w-fit">
        <MapReturnButton
          title="Return to Map"
          className="absolute right-0 -top-10"
        />
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
