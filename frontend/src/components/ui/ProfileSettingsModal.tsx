import React, { useState } from "react";
import { GlassCard } from "./GlassCard";
import { X, Save, User, Building, Image as ImageIcon } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { apiClient } from "@/services/apiClient";

interface ProfileSettingsModalProps {
  onClose: () => void;
}

export function ProfileSettingsModal({ onClose }: ProfileSettingsModalProps) {
  const { user, updateUser } = useAuthStore();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [companyName, setCompanyName] = useState(user?.company_name || "");
  const [profilePicture, setProfilePicture] = useState(user?.profile_picture || "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const res = await apiClient.put("/auth/me", {
        full_name: fullName,
        company_name: companyName,
        profile_picture: profilePicture || null,
      });
      updateUser(res.data);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      <GlassCard className="relative w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-foreground mb-6">Profile Settings</h2>
        
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" /> Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <Building className="w-4 h-4 text-muted-foreground" /> Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              placeholder="Acme Corp"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-muted-foreground" /> Profile Picture URL
            </label>
            <input
              type="url"
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
              className="w-full rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              placeholder="https://example.com/photo.jpg"
            />
            {profilePicture && (
              <div className="mt-3 flex items-center gap-3 p-3 rounded-lg bg-card border border-border/50">
                <img src={profilePicture} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-border/50" />
                <span className="text-xs text-muted-foreground">Preview</span>
              </div>
            )}
          </div>
          
          {error && <p className="text-sm text-danger font-medium">{error}</p>}
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
            >
              {isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Save Changes</>}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
