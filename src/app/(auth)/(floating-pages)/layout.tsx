"use client";

import MapReturnButton from "@/components/buttons/map-return-button";
import { usePathname } from "next/navigation";
import React from "react";

const FloatingPagesLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();

  if (pathname === "/explore") {
    return (
      <div className="mt-20 ml-5 min-[margin-right]:10 relative w-fit">
        <MapReturnButton
          title="Return to Map"
          className="absolute left-0 -top-10"
        />
        {children}
      </div>
    );
  } else {
    return (
      <div className="mx-auto top-10 sm:top-20 min-[margin-top]:10 container relative">
        <MapReturnButton
          title="Return to Map"
          className="absolute right-0 -top-10"
        />
        {children}
      </div>
    );
  }
};

export default FloatingPagesLayout;
