import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { LandscapeGate } from "@/components/ui/LandscapeGate";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "HVN Havenry — Curated Great Rooms",
  description:
    "Discover extraordinary living spaces. HVN Havenry crafts bespoke luxury environments — library walls, corner bars, executive desks, and plush sofas worthy of your grandest imagination.",
  keywords: ["luxury furniture", "great rooms", "bespoke interiors", "HVN Havenry"],
  openGraph: {
    title: "HVN Havenry — Curated Great Rooms",
    description: "Rooms only one can dream of. Now yours.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-[#0d0b09] text-[#e8dcc8] antialiased overflow-x-hidden">
        {/* Preload the Section 1 hero so it paints immediately (React 19 hoists this
            to <head>). The section-2 splash is intentionally left to load lazily. */}
        <link
          rel="preload"
          as="image"
          href="/assets/hero/hero__hvn-havenry__section01.png"
          fetchPriority="high"
        />
        <LandscapeGate>{children}</LandscapeGate>
      </body>
    </html>
  );
}
