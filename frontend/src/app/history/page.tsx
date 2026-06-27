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
    s === null ? "text-muted-foreground" : s >= 80 ? "text-success" : s >= 60 ? "text-warning" : "text-danger";

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Audit History</h2>
          <Link href="/audits/new" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">
            + New Audit
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : audits.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/50 p-12 text-center text-muted-foreground">
            No audits yet. <Link href="/audits/new" className="text-primary hover:underline">Run your first audit.</Link>
          </div>
        ) : (
          <div className="glass-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/20 border-b border-border/50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">#</th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">URL</th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">Overall</th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">SEO</th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">Perf</th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">Issues</th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {audits.map((a) => (
                  <tr key={a.audit_id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{a.audit_id}</td>
                    <td className="px-6 py-4 max-w-[200px]">
                      <Link href={`/audits/${a.audit_id}`} className="text-primary hover:underline truncate block">
                        {a.url}
                      </Link>
                    </td>
                    <td className={`px-6 py-4 font-bold ${scoreColor(a.scores.overall_score)}`}>
                      {a.scores.overall_score?.toFixed(1) ?? "—"}
                    </td>
                    <td className={`px-6 py-4 ${scoreColor(a.scores.seo_score)}`}>{a.scores.seo_score?.toFixed(1) ?? "—"}</td>
                    <td className={`px-6 py-4 ${scoreColor(a.scores.performance_score)}`}>{a.scores.performance_score?.toFixed(1) ?? "—"}</td>
                    <td className="px-6 py-4 text-danger font-medium">{a.issue_count}</td>
                    <td className="px-6 py-4 text-muted-foreground">{a.audit_date ? new Date(a.audit_date).toLocaleDateString() : "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${a.status === "completed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
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
    </>
  );
}
