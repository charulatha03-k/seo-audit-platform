"use client";

import { useEffect, useState } from "react";
import { recommendationsApi, RecommendationListResponse } from "../../services/recommendationsApi";

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-green-100 text-green-700 border-green-200",
};

export default function RecommendationsPage() {
  const [data, setData] = useState<RecommendationListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [priority, setPriority] = useState("");
  const [impact, setImpact] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    recommendationsApi.list({ priority: priority || undefined, impact: impact || undefined, search: search || undefined, limit: 100 })
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [priority, impact, search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">AI Recommendations</h2>
        {data && <span className="text-sm text-gray-500">{data.total} total recommendations</span>}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 rounded-xl border bg-white p-4 shadow-sm">
        <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); }} className="flex gap-2 flex-1 min-w-[200px]">
          <input type="text" placeholder="Search recommendations..."
            value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
          <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Search</button>
        </form>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select value={impact} onChange={(e) => setImpact(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="">All Impacts</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-gray-400">
          No recommendations found. Run an audit first.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.items.map((rec) => (
            <div key={rec.id} className="rounded-xl border-l-4 border-green-500 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize border ${priorityColors[rec.priority]}`}>
                  Priority: {rec.priority}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize border ${priorityColors[rec.impact]}`}>
                  Impact: {rec.impact}
                </span>
                <span className="ml-auto text-xs text-gray-400">Audit #{rec.audit_id}</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">{rec.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{rec.recommendation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
