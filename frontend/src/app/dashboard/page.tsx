"use client";

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend
} from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, Activity, Globe, ShieldAlert, Zap, 
  Smartphone, Search, FileText, CheckCircle2, AlertTriangle, XCircle,
  MoreVertical, Download, ExternalLink, RefreshCw, ArrowRight
} from 'lucide-react';

// --- DEFAULT / FALLBACK DATA ---
const defaultTrendData = [
  { name: 'Mon', seo: 0, perf: 0 },
];

const defaultSeverityData = [
  { name: 'Critical', value: 0, color: '#EF4444' },
  { name: 'High', value: 0, color: '#F59E0B' },
  { name: 'Medium', value: 0, color: '#3B82F6' },
  { name: 'Low', value: 0, color: '#10B981' },
];

const severityData = [
  { name: 'Critical', value: 12, color: '#EF4444' },
  { name: 'High', value: 24, color: '#F59E0B' },
  { name: 'Medium', value: 45, color: '#3B82F6' },
  { name: 'Low', value: 19, color: '#10B981' },
];

const categoryData = [
  { name: 'SEO', value: 40 },
  { name: 'Performance', value: 30 },
  { name: 'Accessibility', value: 15 },
  { name: 'Security', value: 10 },
  { name: 'Mobile', value: 5 },
];
const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];

const recentAudits = [
  { id: 1, url: 'stripe.com', score: 98, perf: 95, acc: 100, issues: 2, status: 'Completed', date: '2 mins ago' },
  { id: 2, url: 'linear.app', score: 95, perf: 92, acc: 98, issues: 5, status: 'Completed', date: '1 hr ago' },
  { id: 3, url: 'vercel.com', score: 100, perf: 99, acc: 100, issues: 0, status: 'Completed', date: '3 hrs ago' },
  { id: 4, url: 'example.com', score: 45, perf: 32, acc: 55, issues: 142, status: 'Failed', date: '1 day ago' },
  { id: 5, url: 'github.com', score: 92, perf: 88, acc: 95, issues: 12, status: 'Running', date: 'Just now' },
];

const recommendations = [
  { id: 1, title: 'Implement lazy loading for below-fold images', impact: 92, diff: 'Medium', type: 'Performance' },
  { id: 2, title: 'Fix 14 missing canonical tags', impact: 85, diff: 'Easy', type: 'SEO' },
  { id: 3, title: 'Minify CSS and JavaScript payloads', impact: 78, diff: 'Hard', type: 'Performance' },
  { id: 4, title: 'Add alt attributes to 24 images', impact: 65, diff: 'Easy', type: 'Accessibility' },
];

// --- COMPONENTS ---

const MetricCard = ({ title, value, trend, isPositive, icon: Icon, chartData, color }: any) => (
  <div className="glass-card rounded-2xl p-6 flex flex-col relative overflow-hidden group">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <h3 className="text-3xl font-bold tracking-tight text-foreground">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color} bg-opacity-10 text-white shadow-sm`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    
    <div className="flex items-center gap-2 mt-auto z-10">
      <span className={`flex items-center text-xs font-semibold px-2 py-1 rounded-md ${isPositive ? 'text-success bg-success/10' : 'text-danger bg-danger/10'}`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
        {trend}
      </span>
      <span className="text-xs text-muted-foreground">vs last week</span>
    </div>
    
    {/* Mini Background Chart */}
    <div className="absolute bottom-0 left-0 w-full h-16 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <Area type="monotone" dataKey="value" stroke={isPositive ? '#10B981' : '#EF4444'} fill={isPositive ? '#10B981' : '#EF4444'} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default function DashboardPage() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const { apiClient } = await import('@/services/apiClient');
        const res = await apiClient.get('/dashboard/');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const sparklineData1 = [ {value: 30}, {value: 40}, {value: 35}, {value: 50}, {value: 45}, {value: 60}, {value: 70} ];
  const sparklineData2 = [ {value: 80}, {value: 75}, {value: 85}, {value: 60}, {value: 50}, {value: 45}, {value: 40} ];

  // Map API data to component data
  const trendData = data?.score_trends?.length > 0 
    ? data.score_trends.map((t: any) => ({ name: t.date.split('-').slice(1).join('/'), seo: t.seo_score, perf: t.performance_score }))
    : defaultTrendData;

  const issues = data?.issues_by_severity || {};
  const totalIssues = Object.values(issues).reduce((a: any, b: any) => a + b, 0) as number;
  const severityData = [
    { name: 'Critical', value: issues['critical'] || 0, color: '#EF4444' },
    { name: 'High', value: issues['high'] || 0, color: '#F59E0B' },
    { name: 'Medium', value: issues['medium'] || 0, color: '#3B82F6' },
    { name: 'Low', value: issues['low'] || 0, color: '#10B981' },
  ];

  const recentAudits = data?.recent_audits || [];

  return (
    <AppLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Platform intelligence and core metrics overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-card border border-border/50 text-foreground text-sm font-medium rounded-xl hover:bg-muted transition-colors flex items-center shadow-sm">
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </button>
          <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20 flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" /> Run Audit
          </button>
        </div>
      </div>

      {/* SECTION 1: Executive KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard title="Total Audits" value={loading ? "-" : data?.total_audits} trend="Active" isPositive={true} icon={Activity} color="from-primary to-blue-600" chartData={sparklineData1} />
        <MetricCard title="Average SEO Score" value={loading ? "-" : data?.average_seo_score} trend="Overall" isPositive={true} icon={Globe} color="from-success to-emerald-600" chartData={sparklineData2} />
        <MetricCard title="Total Issues Found" value={loading ? "-" : totalIssues} trend="Tracked" isPositive={false} icon={AlertTriangle} color="from-warning to-amber-600" chartData={sparklineData1} />
        <MetricCard title="Avg. Perf Score" value={loading ? "-" : data?.average_performance_score} trend="Web Vitals" isPositive={true} icon={Zap} color="from-danger to-red-600" chartData={sparklineData1} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* SECTION 2: SEO Health Overview (Trend Chart) */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Platform Health Trends</h3>
            <select className="bg-card border border-border/50 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSeo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '13px', fontWeight: 500 }}
                />
                <Area type="monotone" dataKey="seo" name="SEO Score" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorSeo)" />
                <Area type="monotone" dataKey="perf" name="Performance" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorPerf)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION 4: Issues Analytics (Severity Donut) */}
        <div className="glass-card rounded-2xl p-6 flex flex-col">
          <h3 className="font-semibold text-lg mb-6">Issues Breakdown</h3>
          <div className="flex-1 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-bold text-foreground">{loading ? "-" : totalIssues}</span>
              <span className="text-xs text-muted-foreground uppercase font-medium tracking-wider">Total</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {severityData.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-muted-foreground">{item.name}</span>
                <span className="text-sm font-semibold ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* SECTION 5: Recommendations Center */}
        <div className="lg:col-span-1 glass-card rounded-2xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Top Recommendations</h3>
            <button className="text-sm text-primary hover:underline font-medium">View All</button>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto hide-scrollbar pr-2">
            {recommendations.map(rec => (
              <div key={rec.id} className="p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-muted/50 transition-colors group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${rec.type === 'SEO' ? 'bg-primary/10 text-primary' : rec.type === 'Performance' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
                    {rec.type}
                  </span>
                  <span className="text-xs font-semibold text-success flex items-center">
                    +{rec.impact} Impact
                  </span>
                </div>
                <h4 className="font-medium text-sm text-foreground leading-snug mb-3 group-hover:text-primary transition-colors">
                  {rec.title}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {rec.diff} fix
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform group-hover:text-primary" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: Recent Audits Table */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border/50 flex justify-between items-center">
            <h3 className="font-semibold text-lg">Recent Audit Logs</h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Filter websites..." className="pl-9 pr-4 py-1.5 text-sm bg-card border border-border/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Website</th>
                  <th className="px-6 py-4 font-medium text-center">Score</th>
                  <th className="px-6 py-4 font-medium text-center">Issues</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {recentAudits.map((audit: any) => (
                  <tr key={audit.audit_id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center overflow-hidden shrink-0">
                        <img src={`https://logo.clearbit.com/${audit.url}?size=32`} onError={(e) => (e.currentTarget.style.display = 'none')} alt="" className="w-full h-full object-cover" />
                      </div>
                      {audit.url}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-semibold ${audit.overall_score >= 90 ? 'text-success' : audit.overall_score >= 50 ? 'text-warning' : 'text-danger'}`}>
                        {audit.overall_score}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{audit.issue_count}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        audit.status === 'completed' ? 'bg-success/10 text-success' :
                        audit.status === 'running' || audit.status === 'pending' ? 'bg-primary/10 text-primary animate-pulse' :
                        'bg-danger/10 text-danger'
                      }`}>
                        {audit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{audit.audit_date ? new Date(audit.audit_date).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted/50 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* SECTION 6: Website Performance Insights */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-6">Core Web Vitals</h3>
          <div className="space-y-5">
            {[
              { name: 'Largest Contentful Paint (LCP)', val: '1.2s', score: 95, color: 'bg-success' },
              { name: 'First Input Delay (FID)', val: '12ms', score: 98, color: 'bg-success' },
              { name: 'Cumulative Layout Shift (CLS)', val: '0.04', score: 85, color: 'bg-warning' },
              { name: 'Time to Interactive (TTI)', val: '2.4s', score: 60, color: 'bg-danger' },
            ].map(vital => (
              <div key={vital.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{vital.name}</span>
                  <span className="font-semibold">{vital.val}</span>
                </div>
                <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                  <div className={`h-full ${vital.color} rounded-full`} style={{ width: `${vital.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 7: Audit Comparison */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Compare Audits</h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">stripe.com</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center border-b border-border/50 pb-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-medium">Metric</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-medium">Previous</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-medium">Current</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { m: 'SEO Score', p: '88', c: '98', up: true },
              { m: 'Total Issues', p: '14', c: '2', up: true },
              { m: 'Perf Score', p: '82', c: '95', up: true },
              { m: 'Load Time', p: '2.1s', c: '2.5s', up: false },
            ].map((comp, i) => (
              <div key={i} className="grid grid-cols-3 gap-4 text-center items-center">
                <div className="text-sm font-medium text-left">{comp.m}</div>
                <div className="text-sm text-muted-foreground">{comp.p}</div>
                <div className="text-sm font-bold flex items-center justify-center gap-1">
                  {comp.c}
                  {comp.up ? <ArrowUpRight className="w-4 h-4 text-success" /> : <ArrowDownRight className="w-4 h-4 text-danger" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </AppLayout>
  );
}
