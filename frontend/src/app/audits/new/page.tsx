"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auditApi } from "../../../services/auditApi";

export default function NewAuditPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!url.trim()) return;
    setLoading(true);
    try {
      const audit = await auditApi.create(url.trim());
      router.push(`/audits/${audit.audit_id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail ?? err.message ?? "Audit failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-lg rounded-2xl border bg-white p-8 shadow-sm">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Run New Audit</h2>
        <p className="mb-6 text-sm text-gray-500">Enter a website URL to run a complete SEO audit powered by the mock engine.</p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              Website URL
            </label>
            <input
              id="url"
              type="url"
              required
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Running Audit...
              </span>
            ) : "Run Audit"}
          </button>
        </form>
      </div>
    </div>
  );
}
