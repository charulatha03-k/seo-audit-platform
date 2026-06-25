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
        <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
          <header className="sticky top-0 z-10 flex h-14 items-center border-b bg-white px-6 shadow-sm gap-6">
            <Link href="/dashboard" className="text-base font-bold text-blue-600 shrink-0">
              SEO Audit
            </Link>
            <nav className="flex items-center gap-1 overflow-x-auto">
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href}
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap transition-colors">
                  {l.label}
                </Link>
              ))}
            </nav>
          </header>
          <main className="flex-1 p-6 max-w-7xl mx-auto w-full">{children}</main>
        </div>
      </body>
    </html>
  );
}
