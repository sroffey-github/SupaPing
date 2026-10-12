
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

const siteUrl = "https://www.supaping.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  applicationName: "SupaPing",

  title: {
    default: "SupaPing — Keep Your Supabase Database Active",
    template: "%s | SupaPing",
  },

  description:
    "Keep your Supabase project active with lightweight, scheduled database keep-alive checks. Monitor your configured projects from one simple dashboard.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName: "SupaPing",
    title: "SupaPing — Keep Your Supabase Database Active",
    description:
      "Lightweight, scheduled keep-alive checks for Supabase projects, with a simple monitoring dashboard.",
    images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630, alt: "SupaPing" }],
  },

  twitter: {
    card: "summary_large_image",
    title: "SupaPing — Keep Your Supabase Database Active",
    description:
      "Lightweight, scheduled keep-alive checks for Supabase projects.",
    images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630, alt: "SupaPing" }],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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
      lang="en-GB"
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
