import { auth } from "@/auth";
import NavBar from "@/components/dashboard/nav-bar";
import MapCaller from "@/components/map/map/map-caller";
import { getEvents } from "@/modules/events/server/queries";
import { hasUnseenEventInvitations } from "@/modules/invitations/server/queries";
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

  const hasNewNotification = await hasUnseenEventInvitations(session.user.id);

  return (
    <div className="min-h-screen h-full w-full flex flex-col relative">
      <NavBar hasNewNotification={hasNewNotification} />
      <div className="absolute mt-12 inset-0 z-0">
        <MapCaller events={events} />
      </div>
      {children}
    </div>
  );
};
export default AuthLayout;
