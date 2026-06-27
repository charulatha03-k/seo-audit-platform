import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/layout/Shell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SEO Audit Platform | Premium Enterprise SaaS",
  description: "Enterprise-grade SEO Audit and Intelligence Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body className={inter.className}>
        <Shell>
          {children}
        </Shell>
      </body>
    </html>
  );
}
