"use client";

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Download, FileText, Calendar, Clock, MoreVertical, Search, Share2, Plus } from 'lucide-react';

const reports = [
  { id: 1, title: 'Weekly SEO Health Summary', type: 'Scheduled', url: 'stripe.com', date: 'Oct 24, 2023', size: '2.4 MB' },
  { id: 2, title: 'Core Web Vitals Audit', type: 'Manual', url: 'vercel.com', date: 'Oct 23, 2023', size: '1.1 MB' },
  { id: 3, title: 'Competitor Analysis: Q3', type: 'Scheduled', url: 'linear.app', date: 'Oct 20, 2023', size: '4.5 MB' },
  { id: 4, title: 'Technical SEO Deep Dive', type: 'Manual', url: 'stripe.com', date: 'Oct 15, 2023', size: '3.2 MB' },
];

export default function ReportsPage() {
  return (
    <AppLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Reports Center</h1>
          <p className="text-muted-foreground mt-1">Manage, download, and schedule your SEO intelligence reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-card border border-border/50 text-foreground text-sm font-medium rounded-xl hover:bg-muted transition-colors flex items-center shadow-sm">
            <Calendar className="w-4 h-4 mr-2" /> Schedule Report
          </button>
          <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20 flex items-center">
            <Plus className="w-4 h-4 mr-2" /> Generate New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-1">124</h3>
          <p className="text-sm text-muted-foreground">Total Reports Generated</p>
        </div>
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-success" />
          </div>
          <h3 className="text-2xl font-bold mb-1">8</h3>
          <p className="text-sm text-muted-foreground">Active Scheduled Reports</p>
        </div>
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mb-4">
            <Download className="w-6 h-6 text-warning" />
          </div>
          <h3 className="text-2xl font-bold mb-1">45.2 MB</h3>
          <p className="text-sm text-muted-foreground">Storage Used</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border/50 flex justify-between items-center bg-card/50">
          <h3 className="font-semibold text-lg">Report Archive</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Search reports..." className="pl-9 pr-4 py-2 text-sm bg-background border border-border/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary w-64" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-medium">Report Name</th>
                <th className="px-6 py-4 font-medium">Target URL</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Date Generated</th>
                <th className="px-6 py-4 font-medium">Size</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-muted/10 transition-colors group">
                  <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                    <div className="p-2 rounded bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
                      <FileText className="w-4 h-4" />
                    </div>
                    {report.title}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{report.url}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                      report.type === 'Scheduled' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-500/10 text-slate-500'
                    }`}>
                      {report.type === 'Scheduled' && <Clock className="w-3 h-3 mr-1" />}
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{report.date}</td>
                  <td className="px-6 py-4 text-muted-foreground">{report.size}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Download PDF">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Share Report">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
