"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { dashboardApi, DashboardData } from "../../services/dashboardApi";

const ScoreCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className={`rounded-xl border bg-white p-6 shadow-sm`}>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className={`mt-1 text-3xl font-bold ${color}`}>{value ? value.toFixed(1) : "—"}</p>
  </div>
);

const severityColors: Record<string, string> = {
  critical: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-blue-100 text-blue-800",
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashboardApi.getSummary()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  );

  if (error) return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
      Failed to load dashboard: {error}. Is the backend running?
    </div>
  );

  if (!data) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Link href="/audits/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
          + Run New Audit
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border bg-white p-6 shadow-sm lg:col-span-1">
          <p className="text-sm font-medium text-gray-500">Total Audits</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{data.total_audits}</p>
        </div>
        <ScoreCard label="Avg SEO Score" value={data.average_seo_score} color="text-green-600" />
        <ScoreCard label="Avg Performance" value={data.average_performance_score} color="text-blue-600" />
        <ScoreCard label="Avg Accessibility" value={data.average_accessibility_score} color="text-purple-600" />
        <ScoreCard label="Avg Compatibility" value={data.average_compatibility_score} color="text-orange-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Audits Table */}
        <div className="lg:col-span-2 rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Recent Audits</h3>
          {data.recent_audits.length === 0 ? (
            <p className="text-gray-500 text-sm">No audits yet. <Link href="/audits/new" className="text-blue-600 hover:underline">Run your first audit.</Link></p>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-3 pr-4 font-medium">URL</th>
                    <th className="pb-3 pr-4 font-medium">Score</th>
                    <th className="pb-3 pr-4 font-medium">Issues</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.recent_audits.map((a) => (
                    <tr key={a.audit_id} className="hover:bg-gray-50">
                      <td className="py-3 pr-4">
                        <Link href={`/audits/${a.audit_id}`} className="text-blue-600 hover:underline max-w-[200px] truncate block">
                          {a.url}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 font-semibold">{a.overall_score?.toFixed(1)}</td>
                      <td className="py-3 pr-4 text-red-600">{a.issue_count}</td>
                      <td className="py-3 text-gray-400">{a.audit_date ? new Date(a.audit_date).toLocaleDateString() : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Issues by Severity */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Issues by Severity</h3>
          <div className="space-y-3">
            {Object.entries(data.issues_by_severity).length === 0 ? (
              <p className="text-sm text-gray-400">No issues yet.</p>
            ) : (
              Object.entries(data.issues_by_severity).map(([sev, count]) => (
                <div key={sev} className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${severityColors[sev] || "bg-gray-100 text-gray-700"}`}>
                    {sev}
                  </span>
                  <span className="text-lg font-bold text-gray-800">{count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
