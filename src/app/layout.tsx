import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Cairo,
  Inter,
} from "next/font/google";
import "./globals.css";

// الخط الإنجليزي للعناوين (فخم)
const displayEn = Cormorant_Garamond({
  variable: "--font-display-en",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

// الخط العربي الأساسي (Cairo)
const bodyAr = Cairo({
  variable: "--font-body-ar",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

// fallback للإنجليزي
const bodyEn = Inter({
  variable: "--font-body-en",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "House of Antiques",
  description: "House of Antiques Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${displayEn.variable} ${bodyAr.variable} ${bodyEn.variable}`}
    >
      <body className="font-sans bg-[#070809] text-[#f5f1ea]">
        
        {children}
      </body>
    </html>
  );
}