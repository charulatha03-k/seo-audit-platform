"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Search, 
  Globe, 
  AlertCircle, 
  Lightbulb, 
  BarChart3, 
  ArrowLeftRight, 
  FileText, 
  History, 
  Settings 
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "New Audit", href: "/audits/new", icon: Search },
  { name: "Websites", href: "/websites", icon: Globe },
  { name: "Issues", href: "/issues", icon: AlertCircle },
  { name: "Recommendations", href: "/recommendations", icon: Lightbulb },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Compare", href: "/comparison", icon: ArrowLeftRight },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "History", href: "/history", icon: History },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#0f172a]/50 backdrop-blur-xl">
      <div className="flex h-16 shrink-0 items-center px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Search className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            SEO Audit Pro
          </span>
        </Link>
      </div>
      
      <nav className="flex flex-1 flex-col px-4 pt-6">
        <ul role="list" className="flex flex-1 flex-col gap-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-primary/10 text-primary dark:bg-primary/20" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 shrink-0 ${isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
    </aside>
  );
}
