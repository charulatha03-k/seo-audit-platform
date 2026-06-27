"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0b0f19]">
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen">
        <TopNav />
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
