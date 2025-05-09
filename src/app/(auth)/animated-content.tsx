"use client";

import { usePathname } from "next/navigation";
import React from "react";
import "./fade-in.css";

interface AnimatedContentProps {
  children: React.ReactNode;
}

const AnimatedContent: React.FC<AnimatedContentProps> = ({ children }) => {
  const pathname = usePathname();

  return pathname === "/map" ? (
    <div key={pathname} className="mt-16 w-full">
      {children}
    </div>
  ) : (
    <div className="relative z-10 flex-1 w-full bg-black/20 top-1/12 flex justify-center">
      <div className="relative w-full max-w-screen-2xl">
        <div key={pathname} className="page-fade-in mt-16 w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AnimatedContent;
