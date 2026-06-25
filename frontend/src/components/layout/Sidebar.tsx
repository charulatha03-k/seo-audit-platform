"use client";

import React from 'react';
import { Bell, Search, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', path: '/dashboard' },
    { label: 'New Audit', icon: 'M12 4v16m8-8H4', path: '/audits/new' },
    { label: 'Issues', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', path: '/issues' },
    { label: 'Recommendations', icon: 'M13 10V3L4 14h7v7l9-11h-7z', path: '/recommendations' },
    { label: 'Compare', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', path: '/comparison' },
    { label: 'Reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', path: '/reports' },
    { label: 'History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', path: '/history' },
  ];

  return (
    <aside className={`fixed top-0 left-0 h-screen bg-card/80 backdrop-blur-xl border-r border-border transition-all duration-300 z-40 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-border/50">
        <div className={`flex items-center gap-2 overflow-hidden ${isOpen ? 'w-auto' : 'w-0 opacity-0'}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-xl shrink-0">
            S
          </div>
          <span className="font-bold text-lg tracking-tight truncate">SEO Audit</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-1.5 rounded-md hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="py-4 px-3 flex flex-col gap-1 h-[calc(100vh-4rem)] overflow-y-auto hide-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.label} href={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'}`}>
              <svg className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className={`font-medium whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>
                {item.label}
              </span>
              {isActive && isOpen && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary ml-auto" />
              )}
            </Link>
          )
        })}

        <div className="mt-auto">
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all duration-200 group">
            <Settings className="w-5 h-5 shrink-0" />
            <span className={`font-medium whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>
              Settings
            </span>
          </Link>
        </div>
      </div>
    </aside>
  );
};
