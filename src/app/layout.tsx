import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LocalLens - Discover Events Around You",
  description:
    "Discover public events, meetups and recommendations based on location, interests and friend activity.",
  icons: { icon: "./favicon.ico" },
  openGraph: {
    title: "LocalLens - Discover Events Around You",
    description:
      "Discover public events, meetups and recommendations based on location, interests and friend activity.",
    url: "https://locallens.app",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LocalLens - Discover Events Around You",
    description:
      "Discover public events, meetups and recommendations based on location, interests and friend activity.",
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {/* Main content with higher z-index */}
          <main className="z-10 min-h-screen flex items-center justify-center">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
