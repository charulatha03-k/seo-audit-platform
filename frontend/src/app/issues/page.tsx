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
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Issues</h2>
          {data && <span className="text-sm text-muted-foreground">{data.total} total issues</span>}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 rounded-xl border border-border/50 bg-card p-4 shadow-sm">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search issues..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 rounded-lg border border-border/50 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
            />
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
              Search
            </button>
          </form>
          <select value={severity} onChange={(e) => setSeverity(e.target.value)}
            className="rounded-lg border border-border/50 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground">
            <option value="">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-border/50 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground">
            <option value="">All Categories</option>
            <option value="seo">SEO</option>
            <option value="performance">Performance</option>
            <option value="accessibility">Accessibility</option>
            <option value="compatibility">Compatibility</option>
          </select>
          {(severity || category || search) && (
            <button onClick={() => { setSeverity(""); setCategory(""); setSearch(""); setSearchInput(""); }}
              className="rounded-lg border border-border/50 bg-card px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50">
              Clear
            </button>
          )}
        </div>

        {/* Issues List */}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : !data || data.items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/50 p-12 text-center text-muted-foreground">
            No issues found. {!severity && !category && !search ? "Run an audit first." : "Try adjusting your filters."}
          </div>
        ) : (
          <div className="space-y-3">
            {data.items.map((issue: AuditIssue) => (
              <div key={issue.id} className="glass-card rounded-xl border border-border/50 p-5 shadow-sm hover:bg-muted/10 transition-colors">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize border ${severityColors[issue.severity] || "bg-muted text-muted-foreground"}`}>
                    {issue.severity}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium capitalize border border-border/50">
                    {issue.category}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">Audit #{issue.audit_id}</span>
                </div>
                <h4 className="font-semibold text-foreground mb-1">{issue.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                {issue.recommendation && (
                  <p className="text-xs text-success italic border-t border-border/50 pt-2 mt-2">💡 {issue.recommendation}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
