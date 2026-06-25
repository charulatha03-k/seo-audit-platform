"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auditApi, AuditReport } from "../../services/auditApi";

export default function HistoryPage() {
  const [audits, setAudits] = useState<AuditReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auditApi.list(0, 200)
      .then(setAudits)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const scoreColor = (s: number | null) =>
    s === null ? "text-gray-400" : s >= 80 ? "text-green-600" : s >= 60 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Audit History</h2>
        <Link href="/audits/new" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          + New Audit
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : audits.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-gray-400">
          No audits yet. <Link href="/audits/new" className="text-blue-600 hover:underline">Run your first audit.</Link>
        </div>
      ) : (
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500">#</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">URL</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Overall</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">SEO</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Perf</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Issues</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Date</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {audits.map((a) => (
                <tr key={a.audit_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{a.audit_id}</td>
                  <td className="px-6 py-4 max-w-[200px]">
                    <Link href={`/audits/${a.audit_id}`} className="text-blue-600 hover:underline truncate block">
                      {a.url}
                    </Link>
                  </td>
                  <td className={`px-6 py-4 font-bold ${scoreColor(a.scores.overall_score)}`}>
                    {a.scores.overall_score?.toFixed(1) ?? "—"}
                  </td>
                  <td className={`px-6 py-4 ${scoreColor(a.scores.seo_score)}`}>{a.scores.seo_score?.toFixed(1) ?? "—"}</td>
                  <td className={`px-6 py-4 ${scoreColor(a.scores.performance_score)}`}>{a.scores.performance_score?.toFixed(1) ?? "—"}</td>
                  <td className="px-6 py-4 text-red-500 font-medium">{a.issue_count}</td>
                  <td className="px-6 py-4 text-gray-400">{a.audit_date ? new Date(a.audit_date).toLocaleDateString() : "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${a.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
