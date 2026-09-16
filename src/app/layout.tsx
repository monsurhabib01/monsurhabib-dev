import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Monsur Habib | PWA & Full-Stack Engineer",
  description:
    "Full-stack engineer building installable PWAs, AI/N8N automations, and secure backend systems — with deep fintech fraud-detection expertise for Bangladesh's MFS ecosystem.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    title: "Monsur Habib | PWA & Full-Stack Engineer",
    description:
      "Building installable PWAs, N8N automations, and secure backend systems. Available for freelance & remote work.",
    url: "https://monsur-dev.pages.dev",
    siteName: "Monsur.Dev",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}