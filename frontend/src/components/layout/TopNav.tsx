"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';

export const TopNav = ({ sidebarOpen }: { sidebarOpen: boolean }) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className={`fixed top-0 right-0 h-16 bg-background/60 backdrop-blur-md border-b border-border/50 z-30 transition-all duration-300 ${sidebarOpen ? 'left-64' : 'left-20'}`}>
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex-1 max-w-xl relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input 
            type="text" 
            placeholder="Search audits, issues, recommendations..." 
            className="block w-full pl-10 pr-3 py-2 border border-border/50 rounded-lg leading-5 bg-card/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all"
          />
        </div>

        <div className="flex items-center gap-4 ml-4">
          <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-white/5">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger ring-2 ring-background"></span>
          </button>
          
          <div className="h-6 w-px bg-border/50 hidden sm:block"></div>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white font-medium shadow-sm">
                <User className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {mounted && user ? (user.full_name || user.email.split('@')[0]) : 'User'}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-card ring-1 ring-black ring-opacity-5 py-1">
                <div className="px-4 py-2 border-b border-border/50">
                  <p className="text-sm font-medium text-foreground truncate">{mounted && user ? user.full_name : ''}</p>
                  <p className="text-xs text-muted-foreground truncate">{mounted && user ? user.email : ''}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-muted/50 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
