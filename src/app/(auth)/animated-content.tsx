"use client";

import { usePathname } from "next/navigation";
import React from "react";
import "./fade-in.css";

interface AnimatedContentProps {
  children: React.ReactNode;
}

const AnimatedContent: React.FC<AnimatedContentProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      className="absolute page-fade-in top-1/12 flex w-full max-w-screen-2xl"
    >
      {children}
    </div>
  );
};

export default AnimatedContent;
