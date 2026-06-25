import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SEO Audit Platform",
  description: "AI-Powered SEO Audit Platform",
};

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/audits/new", label: "New Audit" },
  { href: "/issues", label: "Issues" },
  { href: "/recommendations", label: "Recommendations" },
  { href: "/comparison", label: "Compare" },
  { href: "/history", label: "History" },
  { href: "/reports", label: "Reports" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
