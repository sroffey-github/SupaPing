import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "SupaPing - Your database. Still awake.",
  description: "Keep your free-tier databases awake with lightweight, scheduled keep-alive heartbeats.",
  applicationName: "SupaPing",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#EEF2F6",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="light">
    <body>
      <Toaster
        position="bottom-right"
        richColors
        closeButton
        theme="light"
      />
      {children}
    </body>
  </html>;
}
