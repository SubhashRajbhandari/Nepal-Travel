import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nepal Travel Recommendation",
  description:
    "Discover destinations in Nepal, plan trips, estimate budgets, and save travel ideas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-950">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
