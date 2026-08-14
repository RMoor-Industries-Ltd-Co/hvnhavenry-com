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
  title: "HVN Havenry — Atmosphere, Ritual & Elevated Living",
  description:
    "HVN Havenry composes atmosphere — ember lines, chambers, diffusers, and room mists crafted to shape the character of a space. Not a store, a Havenry.",
  keywords: ["HVN Havenry", "ember line", "atmosphere", "home fragrance", "chambers", "diffusers", "room mist", "ritual"],
  openGraph: {
    title: "HVN Havenry — Atmosphere, Ritual & Elevated Living",
    description: "Atmosphere, considered. Not a store, a Havenry.",
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
        {/* Preload the Section 1 hero film so it starts buffering immediately (React 19
            hoists this to <head>). The section-2 splash is intentionally left lazy. */}
        <link
          rel="preload"
          as="video"
          href="/assets/hero/hero__hvn-havenry__section01.mp4"
          type="video/mp4"
          fetchPriority="high"
        />
        <LandscapeGate>{children}</LandscapeGate>
      </body>
    </html>
  );
}
