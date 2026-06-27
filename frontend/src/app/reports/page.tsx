"use client";

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Download, FileText, Calendar, Clock, MoreVertical, Search, Share2, Plus } from 'lucide-react';


export default function ReportsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[80vh] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Reports Center</h1>
          <p className="text-muted-foreground mt-1">Manage, download, and schedule your SEO intelligence reports.</p>
        </div>
        <div className="flex items-center gap-3 opacity-50 cursor-not-allowed">
          <button disabled className="px-4 py-2 bg-card border border-border/50 text-foreground text-sm font-medium rounded-xl flex items-center shadow-sm">
            <Calendar className="w-4 h-4 mr-2" /> Schedule Report
          </button>
          <button disabled className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl shadow-sm shadow-primary/20 flex items-center">
            <Plus className="w-4 h-4 mr-2" /> Generate New
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <GlassCard className="max-w-md p-10 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <FileText className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">No Reports Yet</h2>
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
            The reporting module is currently being upgraded for enterprise scale. 
            Soon, you will be able to schedule automated weekly summaries, generate compliance reports, 
            and export deep-dive analytics directly from this dashboard.
          </p>
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-muted/50 text-muted-foreground text-sm font-medium border border-border/50">
            <Clock className="w-4 h-4 mr-2" /> Coming Q4 2026
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
