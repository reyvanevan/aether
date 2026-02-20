import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AETHER | KROMIA",
  description: "Next.js Headless Luxury E-Commerce by KROMIA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <SmoothScroll>
          <header className="header">
            <div className="header-logo">Aether</div>
            <nav className="nav-links">
              <a href="#">Collection</a>
              <a href="#">About</a>
              <a href="#">Cart [0]</a>
            </nav>
          </header>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
