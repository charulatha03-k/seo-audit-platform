"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Settings, Wrench } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex h-[80vh] items-center justify-center animate-in fade-in zoom-in duration-500">
      <GlassCard className="max-w-md w-full p-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20">
          <Settings className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Platform Settings</h2>
        <p className="text-muted-foreground mb-8">
          The Settings module is currently under development. Soon you'll be able to manage team members, configure global audit parameters, and update your billing preferences.
        </p>
        <div className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 px-4 py-2 rounded-full">
          <Wrench className="w-4 h-4" /> Coming Soon
        </div>
      </GlassCard>
    </div>
  );
}
