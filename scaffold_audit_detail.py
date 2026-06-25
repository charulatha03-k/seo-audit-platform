import os

files = {
    'frontend/app/audits/[id]/page.tsx': '''"use client";

import { useEffect, use } from "react";
import { useAuditStore } from "../../../store/auditStore";

export default function AuditDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { currentAudit, loading, error, fetchAuditById } = useAuditStore();

  useEffect(() => {
    if (id) {
      fetchAuditById(parseInt(id as string, 10));
    }
  }, [id, fetchAuditById]);

  if (loading) return <div className="p-6">Loading audit details...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!currentAudit) return <div className="p-6">Audit not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Audit #{currentAudit.id}</h2>
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {currentAudit.status.toUpperCase()}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">Overall Score</h3>
          <div className="text-2xl font-bold">{currentAudit.overall_score?.toFixed(1) || "-"}</div>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">SEO Score</h3>
          <div className="text-2xl font-bold">{currentAudit.seo_score?.toFixed(1) || "-"}</div>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">Performance</h3>
          <div className="text-2xl font-bold">{currentAudit.performance_score?.toFixed(1) || "-"}</div>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">Accessibility</h3>
          <div className="text-2xl font-bold">{currentAudit.accessibility_score?.toFixed(1) || "-"}</div>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">Compatibility</h3>
          <div className="text-2xl font-bold">{currentAudit.compatibility_score?.toFixed(1) || "-"}</div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow space-y-4">
          <h3 className="text-xl font-bold">Issues Found ({currentAudit.issues?.length || 0})</h3>
          <div className="space-y-4">
            {currentAudit.issues?.map((issue) => (
              <div key={issue.id} className="border-l-4 border-red-500 pl-4 py-2">
                <div className="font-semibold">{issue.title}</div>
                <div className="text-sm text-gray-600">{issue.description}</div>
                <div className="mt-2 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 inline-block rounded">
                  {issue.severity.toUpperCase()} | {issue.category.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow space-y-4">
          <h3 className="text-xl font-bold">AI Recommendations</h3>
          <div className="space-y-4">
            {currentAudit.recommendations?.map((rec) => (
              <div key={rec.id} className="border-l-4 border-green-500 pl-4 py-2">
                <div className="font-semibold">{rec.title}</div>
                <div className="text-sm text-gray-600">{rec.recommendation}</div>
                <div className="mt-2 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 inline-block rounded">
                  Impact: {rec.impact.toUpperCase()} | Priority: {rec.priority.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
'''
}

for filepath, content in files.items():
    with open(filepath, 'w') as f:
        f.write(content)
