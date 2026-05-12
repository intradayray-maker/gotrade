import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlowTrade",
  description: "Smart long-term investing meets automated short-term execution.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0B0B0F] text-white">{children}</body>
    </html>
  );
}
