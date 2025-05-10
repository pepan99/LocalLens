"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "./ui/sonner";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Toaster />
      {children}
    </ThemeProvider>
  );
};
