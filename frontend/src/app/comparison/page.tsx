"use client";

import { useEffect, useState } from "react";
import { auditApi, AuditReport } from "../../services/auditApi";
import { comparisonApi, ComparisonResult } from "../../services/comparisonApi";

const diffColor = (v: number, lowerIsBetter = false) => {
  if (v === 0) return "text-gray-400";
  const positive = lowerIsBetter ? v < 0 : v > 0;
  return positive ? "text-green-600" : "text-red-500";
};

const diffPrefix = (v: number) => (v > 0 ? "+" : "");

import { AppLayout } from "../../components/layout/AppLayout";

export default function ComparisonPage() {
  const [audits, setAudits] = useState<AuditReport[]>([]);
  const [audit1Id, setAudit1Id] = useState("");
  const [audit2Id, setAudit2Id] = useState("");
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    auditApi.list(0, 200).then(setAudits).catch(console.error);
  }, []);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audit1Id || !audit2Id) return;
    if (audit1Id === audit2Id) { setError("Please select two different audits."); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await comparisonApi.compare(Number(audit1Id), Number(audit2Id));
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.detail ?? "Comparison failed.");
    } finally {
      setLoading(false);
    }
  };

  const scoreLabels: Record<string, string> = {
    seo_score: "SEO",
    performance_score: "Performance",
    accessibility_score: "Accessibility",
    compatibility_score: "Compatibility",
    overall_score: "Overall",
  };
  const metricLabels: Record<string, { label: string; unit: string; lowerIsBetter: boolean }> = {
    lcp: { label: "LCP", unit: "s", lowerIsBetter: true },
    cls: { label: "CLS", unit: "", lowerIsBetter: true },
    inp: { label: "INP", unit: "ms", lowerIsBetter: true },
    fcp: { label: "FCP", unit: "s", lowerIsBetter: true },
    ttfb: { label: "TTFB", unit: "ms", lowerIsBetter: true },
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Compare Audits</h2>

        {/* Selection Form */}
        <form onSubmit={handleCompare} className="glass-card rounded-xl border border-border/50 p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Audit 1 (Baseline)</label>
              <select value={audit1Id} onChange={(e) => setAudit1Id(e.target.value)} required
                className="w-full rounded-lg border border-border/50 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground">
                <option value="">Select audit...</option>
                {audits.map((a) => (
                  <option key={a.audit_id} value={a.audit_id}>
                    #{a.audit_id} — {a.url} ({a.scores.overall_score?.toFixed(1)})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Audit 2 (Compare To)</label>
              <select value={audit2Id} onChange={(e) => setAudit2Id(e.target.value)} required
                className="w-full rounded-lg border border-border/50 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground">
                <option value="">Select audit...</option>
                {audits.map((a) => (
                  <option key={a.audit_id} value={a.audit_id}>
                    #{a.audit_id} — {a.url} ({a.scores.overall_score?.toFixed(1)})
                  </option>
                ))}
              </select>
            </div>
          </div>
          {error && <p className="mt-3 text-sm text-danger">{error}</p>}
          <button type="submit" disabled={loading} className="mt-4 rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50">
            {loading ? "Comparing..." : "Compare"}
          </button>
        </form>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Score Comparison */}
            <div className="glass-card rounded-xl border border-border/50 p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4">Score Comparison</h3>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 text-muted-foreground">
                      <th className="pb-3 text-left font-medium">Metric</th>
                      <th className="pb-3 text-center font-medium">Audit #{result.audit1.audit_id}</th>
                      <th className="pb-3 text-center font-medium">Audit #{result.audit2.audit_id}</th>
                      <th className="pb-3 text-center font-medium">Difference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {Object.entries(result.score_diff).map(([key, diff]) => (
                      <tr key={key}>
                        <td className="py-3 pr-4 font-medium capitalize text-foreground">{scoreLabels[key] || key}</td>
                        <td className="py-3 text-center text-foreground">{(result.audit1.scores as any)[key]?.toFixed(1) ?? "—"}</td>
                        <td className="py-3 text-center text-foreground">{(result.audit2.scores as any)[key]?.toFixed(1) ?? "—"}</td>
                        <td className={`py-3 text-center font-bold ${diffColor(diff)}`}>
                          {diffPrefix(diff)}{diff.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Metrics Comparison */}
            <div className="glass-card rounded-xl border border-border/50 p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4">Core Web Vitals Comparison</h3>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 text-muted-foreground">
                      <th className="pb-3 text-left font-medium">Metric</th>
                      <th className="pb-3 text-center font-medium">Audit #{result.audit1.audit_id}</th>
                      <th className="pb-3 text-center font-medium">Audit #{result.audit2.audit_id}</th>
                      <th className="pb-3 text-center font-medium">Difference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {Object.entries(result.metric_diff).map(([key, diff]) => {
                      const meta = metricLabels[key];
                      return (
                        <tr key={key}>
                          <td className="py-3 pr-4 font-medium text-foreground">{meta?.label || key.toUpperCase()}</td>
                          <td className="py-3 text-center text-foreground">{(result.audit1.metrics as any)[key]}{meta?.unit}</td>
                          <td className="py-3 text-center text-foreground">{(result.audit2.metrics as any)[key]}{meta?.unit}</td>
                          <td className={`py-3 text-center font-bold ${diffColor(diff, meta?.lowerIsBetter)}`}>
                            {diffPrefix(diff)}{diff.toFixed(2)}{meta?.unit}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
