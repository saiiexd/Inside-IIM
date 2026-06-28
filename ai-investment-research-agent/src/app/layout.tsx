import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Investment Research Agent",
  description:
    "Institutional-grade investment research powered by LangGraph, Gemini 1.5 Pro, and Tavily Search. Enter any company name and receive a comprehensive AI-generated investment analysis in seconds.",
  keywords: [
    "AI investment research",
    "LangGraph",
    "Gemini",
    "stock analysis",
    "SWOT analysis",
    "financial research AI",
  ],
  robots: "noindex, nofollow", // Private assignment; remove for public launch
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
