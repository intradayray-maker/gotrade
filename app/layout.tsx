// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "GoTrade",
  description: "GoTrade blends smart long-term investing with automated short-term execution.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0B0B0F] text-white">
        {children}
      </body>
    </html>
  );
}
