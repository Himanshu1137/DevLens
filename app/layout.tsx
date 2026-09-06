import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevLens V4 | GitHub Career Evidence Analyzer",
  description: "Upload a resume, match it with GitHub evidence, compare developer profiles, audit README quality and get an actionable portfolio improvement roadmap.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
