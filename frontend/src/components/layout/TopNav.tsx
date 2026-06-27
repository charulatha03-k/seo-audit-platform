"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Search, Sun, Moon, Plus, LogOut, User, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { ProfileSettingsModal } from "../ui/ProfileSettingsModal";

export function TopNav() {
  const [isDark, setIsDark] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      setIsDark(true);
    }
  };

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#0f172a]/50 px-4 shadow-sm backdrop-blur-xl sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-slate-900 dark:text-white bg-transparent placeholder:text-slate-400 focus:ring-0 sm:text-sm"
            placeholder="Search audits, issues, or documentation..."
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Link
            href="/audits/new"
            className="hidden lg:flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
            New Audit
          </Link>
          
          <button
            type="button"
            className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors"
            onClick={toggleTheme}
          >
            <span className="sr-only">Toggle theme</span>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button type="button" className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200 dark:lg:bg-slate-700" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              type="button" 
              className="-m-1.5 flex items-center p-1.5 focus:outline-none"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 overflow-hidden">
                {user?.profile_picture ? (
                  <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'
                )}
              </div>
            </button>
            
            {isProfileOpen && (
              <div className="absolute right-0 z-10 mt-2.5 w-56 origin-top-right rounded-xl bg-card border border-border/50 py-2 shadow-lg ring-1 ring-black/5 focus:outline-none">
                <div className="px-4 py-3 border-b border-border/50">
                  <p className="text-sm font-medium text-foreground">{user?.full_name || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email || 'user@example.com'}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { setIsSettingsModalOpen(true); setIsProfileOpen(false); }}
                    className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <SettingsIcon className="mr-3 h-4 w-4 text-muted-foreground" />
                    Profile Settings
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <LogOut className="mr-3 h-4 w-4 text-muted-foreground" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
      </div>
      </div>
      {isSettingsModalOpen && <ProfileSettingsModal onClose={() => setIsSettingsModalOpen(false)} />}
    </header>
  );
}
