"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { BarChart3, Wrench } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="flex h-[80vh] items-center justify-center animate-in fade-in zoom-in duration-500">
      <GlassCard className="max-w-md w-full p-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20">
          <BarChart3 className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Deep Analytics</h2>
        <p className="text-muted-foreground mb-8">
          The Analytics dashboard is currently under development. Soon you'll be able to view aggregate trends, identify systemic SEO issues, and generate scheduled PDF reports.
        </p>
        <div className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 px-4 py-2 rounded-full">
          <Wrench className="w-4 h-4" /> Coming Soon
        </div>
      </GlassCard>
    </div>
  );
}
