"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import NavBar from "./nav-bar";

type DashboardLayoutProps = {
  children: React.ReactNode;
  title?: string;
  fullWidth?: boolean;
  className?: string;
};

const DashboardLayout = ({
  children,
  title,
  fullWidth = false,
  className,
}: DashboardLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen h-full w-full flex flex-col">
      {/* Top navigation bar */}
      <NavBar hasNewNotification={false} />

      {/* Main content area */}
      <div className="flex-1 flex mx-auto w-full max-w-screen-2xl px-4 pb-4">
        {/* Floating card for content */}
        <Card
          className={cn(
            "relative mt-4 overflow-auto border-t-4 border-primary transition-all duration-300 rounded-lg shadow-lg backdrop-blur-sm bg-white/95",
            isCollapsed ? "h-12" : "flex-1",
            fullWidth ? "w-full" : "max-w-4xl mx-auto",
            className,
          )}
        >
          {/* Collapse/Expand toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute right-2 top-1.5 h-8 w-8 z-10"
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>

          {/* Card header with title */}
          {title && <div className="px-6 py-2 font-medium">{title}</div>}

          {/* Card content - only shown when not collapsed */}
          <div
            className={cn(
              "transition-all duration-300 overflow-auto",
              isCollapsed ? "h-0" : "flex-1 p-6 pt-2",
            )}
          >
            {children}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardLayout;
