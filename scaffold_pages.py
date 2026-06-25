import os

files = {
    'frontend/app/layout.tsx': '''import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SEO Audit Platform",
  description: "AI-Powered SEO Audit Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50">
          <header className="flex h-16 items-center border-b px-6 bg-white dark:bg-gray-800">
            <h1 className="text-lg font-bold">SEO Audit Platform</h1>
            <nav className="ml-auto flex gap-4">
              <a href="/dashboard" className="text-sm font-medium hover:underline">Dashboard</a>
              <a href="/audits/new" className="text-sm font-medium hover:underline">New Audit</a>
              <a href="/issues" className="text-sm font-medium hover:underline">Issues</a>
            </nav>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
''',
    'frontend/app/page.tsx': '''import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}
''',
    'frontend/app/dashboard/page.tsx': '''"use client";

import { useEffect } from "react";
import { useDashboardStore } from "../../store/dashboardStore";
import Link from "next/link";

export default function DashboardPage() {
  const { summary, loading, error, fetchSummary } = useDashboardStore();

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!summary) return <div>No data available</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border bg-card text-card-foreground shadow bg-white p-6">
          <h3 className="tracking-tight text-sm font-medium text-gray-500">Total Audits</h3>
          <div className="text-2xl font-bold">{summary.total_audits}</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow bg-white p-6">
          <h3 className="tracking-tight text-sm font-medium text-gray-500">Avg SEO</h3>
          <div className="text-2xl font-bold">{summary.average_seo_score?.toFixed(1)}</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow bg-white p-6">
          <h3 className="tracking-tight text-sm font-medium text-gray-500">Avg Perf</h3>
          <div className="text-2xl font-bold">{summary.average_performance_score?.toFixed(1)}</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow bg-white p-6">
          <h3 className="tracking-tight text-sm font-medium text-gray-500">Avg A11y</h3>
          <div className="text-2xl font-bold">{summary.average_accessibility_score?.toFixed(1)}</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow bg-white p-6">
          <h3 className="tracking-tight text-sm font-medium text-gray-500">Avg Compat</h3>
          <div className="text-2xl font-bold">{summary.average_compatibility_score?.toFixed(1)}</div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">Recent Audits</h3>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">URL</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Score</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {summary.recent_audits.map((audit) => (
                  <tr key={audit.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle">
                      <Link href={/audits/} className="text-blue-500 hover:underline">
                        Audit #{audit.id}
                      </Link>
                    </td>
                    <td className="p-4 align-middle">{audit.overall_score?.toFixed(1)}</td>
                    <td className="p-4 align-middle">{audit.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
''',
    'frontend/app/audits/new/page.tsx': '''"use client";

import { useState } from "react";
import { useAuditStore } from "../../../store/auditStore";
import { useRouter } from "next/navigation";

export default function NewAuditPage() {
  const [url, setUrl] = useState("");
  const { runNewAudit, loading, error } = useAuditStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    try {
      const audit = await runNewAudit(url);
      router.push(/audits/);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="rounded-xl border bg-white shadow p-8">
        <h2 className="text-2xl font-bold mb-6">Run New Audit</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Website URL</label>
            <input 
              type="url" 
              required
              className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Running Audit..." : "Run Audit"}
          </button>
        </form>
      </div>
    </div>
  );
}
'''
}

for filepath, content in files.items():
    with open(filepath, 'w') as f:
        f.write(content)
