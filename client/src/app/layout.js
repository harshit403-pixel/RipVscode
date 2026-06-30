import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import PageTransition from "@/components/PageTransition";

import "@fontsource/inter";
import "@fontsource/cormorant-garamond";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "RipVSCode",
  description: "Real-time collaborative code editor",
};

export default function RootLayout({
  children,
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="font-['Inter'] bg-[#F7F5F0] text-[#111111]">
        <Providers>
          <PageTransition />
          {children}
        </Providers>
      </body>
    </html>
  );
}