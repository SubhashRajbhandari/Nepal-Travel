import type { Metadata } from "next";
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
