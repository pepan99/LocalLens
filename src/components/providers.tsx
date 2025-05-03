"use client";

import { SessionProvider } from "next-auth/react";
import { type PropsWithChildren } from "react";

export const Providers = ({ children }: PropsWithChildren) => (
  <SessionProvider>{children}</SessionProvider>
);
