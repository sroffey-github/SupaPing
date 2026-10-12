import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SupaPing - Your database. Still awake.",
  description:
    "Keep your free-tier databases awake with lightweight, scheduled keep-alive heartbeats.",
  applicationName: "SupaPing",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#EEF2F6",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`light ${geist.variable} ${geistMono.variable}`}
    >
      <body>
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          theme="light"
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}