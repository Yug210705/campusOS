import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CampusOS | AI Student Platform",
  description: "The AI-powered Student Operating System.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { UserProvider } from "@/context/UserContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} font-sans antialiased`}>
      <body className="min-h-[100dvh] flex flex-col bg-slate-50 text-slate-900 overflow-x-hidden selection:bg-primary/20">
        <UserProvider>
          <main className="flex-1 pb-24 relative">{children}</main>
          <BottomNav />
        </UserProvider>
      </body>
    </html>
  );
}
