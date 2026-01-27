import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/RainbowKitProvider";
import { FarcasterInit } from "@/components/FarcasterInit";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { Providers } from "./providers";
import { FarcasterInit } from "@/components/FarcasterInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Space Invaders | Earn ETH",
  description: "Play Space Invaders and earn ETH rewards on Base",
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://space-odessey.vercel.app/splash.jpg",
      button: {
        title: "Play Space Invaders",
        action: {
          type: "launch_app",
          name: "Space Odessey",
          url: "https://space-odessey.vercel.app/",
          splashImageUrl: "https://space-odessey.vercel.app/splash.jpg",
          splashBackgroundColor: "#000000",
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <FarcasterInit />
          {children}
        </Providers>
      </body>
    </html>
  );
}
