"use client";

import { useEffect, useState } from "react";
import { issuesApi, IssueListResponse } from "../../services/issuesApi";
import { AuditIssue } from "../../services/auditApi";

const severityColors: Record<string, string> = {
  critical: "bg-red-100 text-red-800 border-red-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-blue-100 text-blue-800 border-blue-200",
};

export default function IssuesPage() {
  const [data, setData] = useState<IssueListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [severity, setSeverity] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchIssues = (params?: object) => {
    setLoading(true);
    issuesApi.list({ severity: severity || undefined, category: category || undefined, search: search || undefined, limit: 100, ...params })
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchIssues(); }, [severity, category, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Issues</h2>
        {data && <span className="text-sm text-gray-500">{data.total} total issues</span>}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 rounded-xl border bg-white p-4 shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search issues..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Search
          </button>
        </form>
        <select value={severity} onChange={(e) => setSeverity(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="">All Categories</option>
          <option value="seo">SEO</option>
          <option value="performance">Performance</option>
          <option value="accessibility">Accessibility</option>
          <option value="compatibility">Compatibility</option>
        </select>
        {(severity || category || search) && (
          <button onClick={() => { setSeverity(""); setCategory(""); setSearch(""); setSearchInput(""); }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
            Clear
          </button>
        )}
      </div>

      {/* Issues List */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-gray-400">
          No issues found. {!severity && !category && !search ? "Run an audit first." : "Try adjusting your filters."}
        </div>
      ) : (
        <div className="space-y-3">
          {data.items.map((issue: AuditIssue) => (
            <div key={issue.id} className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize border ${severityColors[issue.severity] || "bg-gray-100 text-gray-700"}`}>
                  {issue.severity}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium capitalize border border-gray-200">
                  {issue.category}
                </span>
                <span className="ml-auto text-xs text-gray-400">Audit #{issue.audit_id}</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">{issue.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
              {issue.recommendation && (
                <p className="text-xs text-gray-500 italic border-t pt-2 mt-2">💡 {issue.recommendation}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
