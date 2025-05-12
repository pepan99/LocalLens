"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import LocationProvider from "./map/location_provider";
import { Toaster } from "./ui/sonner";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <LocationProvider>
          <Toaster />
          {children}
        </LocationProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};
