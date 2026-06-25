"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auditApi, AuditReport } from "../../services/auditApi";

export default function ReportsPage() {
  const [audits, setAudits] = useState<AuditReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auditApi.list(0, 200)
      .then((all) => setAudits(all.filter((a) => a.status === "completed")))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
      <p className="text-sm text-gray-500">View detailed audit reports for all completed audits.</p>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : audits.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-gray-400">
          No completed audits yet. <Link href="/audits/new" className="text-blue-600 hover:underline">Run your first audit.</Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {audits.map((a) => (
            <div key={a.audit_id} className="rounded-xl border bg-white p-5 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400">Audit #{a.audit_id}</span>
                <span className="text-xs text-gray-400">{a.audit_date ? new Date(a.audit_date).toLocaleDateString() : "—"}</span>
              </div>
              <p className="text-sm font-semibold text-gray-800 break-all truncate">{a.url}</p>
              <div className="flex gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{a.scores.overall_score?.toFixed(0)}</div>
                  <div className="text-xs text-gray-400">Overall</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{a.scores.seo_score?.toFixed(0)}</div>
                  <div className="text-xs text-gray-400">SEO</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-500">{a.issue_count}</div>
                  <div className="text-xs text-gray-400">Issues</div>
                </div>
              </div>
              <Link href={`/audits/${a.audit_id}`}
                className="mt-auto block w-full rounded-lg border border-blue-600 py-2 text-center text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
                View Full Report →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
