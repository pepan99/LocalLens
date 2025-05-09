"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Toaster position="top-right" />
      {children}
    </ThemeProvider>
  );
};
