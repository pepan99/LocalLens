import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MapBackground } from "@/components/map/map-background";
import FloatingContainer from "@/components/public/floating-container";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LocalLens",
  description: "Don't miss any event",
  icons: { icon: "./favicon.ico" },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <head>
        <title>LocalLens</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="absolute inset-0 -z-10">
          <MapBackground />
        </div>
        <div className="z-10">
          <FloatingContainer>{children}</FloatingContainer>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
