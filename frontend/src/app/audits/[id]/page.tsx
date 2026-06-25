"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { auditApi, AuditReport } from "../../../services/auditApi";

const severityColors: Record<string, string> = {
  critical: "border-red-500 bg-red-50",
  high: "border-orange-500 bg-orange-50",
  medium: "border-yellow-500 bg-yellow-50",
  low: "border-blue-500 bg-blue-50",
};
const severityBadge: Record<string, string> = {
  critical: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-blue-100 text-blue-800",
};
const impactBadge: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
};

const ScoreRing = ({ value, label, color }: { value: number | null; label: string; color: string }) => (
  <div className="flex flex-col items-center gap-1">
    <div className={`flex h-20 w-20 items-center justify-center rounded-full border-4 ${color} text-xl font-bold text-gray-800`}>
      {value?.toFixed(0) ?? "—"}
    </div>
    <span className="text-xs font-medium text-gray-500 text-center">{label}</span>
  </div>
);

type Tab = "overview" | "issues" | "recommendations" | "metrics";

import { AppLayout } from "../../../components/layout/AppLayout";

export default function AuditDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [audit, setAudit] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    auditApi.getById(Number(id))
      .then(setAudit)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <AppLayout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    </AppLayout>
  );
  if (error) return (
    <AppLayout>
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">Error: {error}</div>
    </AppLayout>
  );
  if (!audit) return (
    <AppLayout>
      <div className="p-6 text-muted-foreground">Audit not found.</div>
    </AppLayout>
  );

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "issues", label: `Issues (${audit.issues.length})` },
    { key: "recommendations", label: `Recommendations (${audit.recommendations.length})` },
    { key: "metrics", label: "Core Web Vitals" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              <Link href="/history" className="hover:underline text-primary">Audit History</Link> / #{audit.audit_id}
            </p>
            <h2 className="text-2xl font-bold text-foreground break-all">{audit.url}</h2>
            <p className="text-sm text-muted-foreground mt-1">{audit.audit_date ? new Date(audit.audit_date).toLocaleString() : ""}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${audit.status === "completed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
            {audit.status}
          </span>
        </div>

        {/* Score Rings */}
        <div className="flex flex-wrap gap-6 items-center justify-around rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
          <ScoreRing value={audit.scores.overall_score} label="Overall" color="border-foreground text-foreground" />
          <ScoreRing value={audit.scores.seo_score} label="SEO" color="border-success text-success" />
          <ScoreRing value={audit.scores.performance_score} label="Performance" color="border-primary text-primary" />
          <ScoreRing value={audit.scores.accessibility_score} label="Accessibility" color="border-purple-500 text-purple-500" />
          <ScoreRing value={audit.scores.compatibility_score} label="Compatibility" color="border-orange-500 text-orange-500" />
        </div>

        {/* Tabs */}
        <div className="border-b border-border/50">
          <nav className="flex gap-1">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {tab === "overview" && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="glass-card rounded-xl border border-border/50 p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-3">Scores Summary</h3>
              <div className="space-y-3">
                {Object.entries(audit.scores).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 rounded-full bg-muted/30">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${val ?? 0}%` }} />
                      </div>
                      <span className="text-sm font-semibold text-foreground">{val?.toFixed(1) ?? "—"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-xl border border-border/50 p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-3">Quick Stats</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Total Issues</dt><dd className="font-semibold text-danger">{audit.issue_count}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Recommendations</dt><dd className="font-semibold text-primary">{audit.recommendations.length}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">LCP</dt><dd className="font-semibold text-foreground">{audit.metrics.lcp}s</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">TTFB</dt><dd className="font-semibold text-foreground">{audit.metrics.ttfb}ms</dd></div>
              </dl>
            </div>
          </div>
        )}

        {/* Issues Tab */}
        {tab === "issues" && (
          <div className="space-y-3">
            {audit.issues.length === 0 ? (
              <div className="rounded-xl border border-success/30 bg-success/10 p-6 text-success text-sm">No issues found for this audit.</div>
            ) : (
              audit.issues.map((issue) => (
                <div key={issue.id} className={`glass-card rounded-xl border-l-4 p-5 border-t border-r border-b border-border/50 ${severityColors[issue.severity] || "border-border/50"}`}>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold uppercase ${severityBadge[issue.severity]}`}>{issue.severity}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium capitalize">{issue.category}</span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{issue.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                  {issue.recommendation && (
                    <p className="text-xs text-muted-foreground italic">💡 {issue.recommendation}</p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Recommendations Tab */}
        {tab === "recommendations" && (
          <div className="space-y-3">
            {audit.recommendations.map((rec) => (
              <div key={rec.id} className="glass-card rounded-xl border-l-4 border-l-success border-t border-r border-b border-border/50 p-5">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${impactBadge[rec.priority]}`}>Priority: {rec.priority}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${impactBadge[rec.impact]}`}>Impact: {rec.impact}</span>
                </div>
                <h4 className="font-semibold text-foreground mb-1">{rec.title}</h4>
                <p className="text-sm text-muted-foreground">{rec.recommendation}</p>
              </div>
            ))}
          </div>
        )}

        {/* Metrics Tab */}
        {tab === "metrics" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "LCP (Largest Contentful Paint)", value: `${audit.metrics.lcp}s`, good: (audit.metrics.lcp ?? 99) < 2.5 },
              { label: "CLS (Cumulative Layout Shift)", value: `${audit.metrics.cls}`, good: (audit.metrics.cls ?? 99) < 0.1 },
              { label: "INP (Interaction to Next Paint)", value: `${audit.metrics.inp}ms`, good: (audit.metrics.inp ?? 9999) < 200 },
              { label: "FCP (First Contentful Paint)", value: `${audit.metrics.fcp}s`, good: (audit.metrics.fcp ?? 99) < 1.8 },
              { label: "TTFB (Time to First Byte)", value: `${audit.metrics.ttfb}ms`, good: (audit.metrics.ttfb ?? 9999) < 500 },
            ].map((m) => (
              <div key={m.label} className="glass-card rounded-xl border border-border/50 p-5 shadow-sm">
                <p className="text-sm text-muted-foreground mb-1">{m.label}</p>
                <p className={`text-2xl font-bold ${m.good ? "text-success" : "text-danger"}`}>{m.value}</p>
                <p className={`text-xs mt-1 ${m.good ? "text-success/80" : "text-danger/80"}`}>{m.good ? "✓ Good" : "✗ Needs Improvement"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
