"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, ArrowRight, CheckCircle2, Lock, Mail, User, Building } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    let score = 0;
    if (formData.password.length > 8) score += 1;
    if (/[A-Z]/.test(formData.password)) score += 1;
    if (/[0-9]/.test(formData.password)) score += 1;
    if (/[^A-Za-z0-9]/.test(formData.password)) score += 1;
    setPasswordStrength(score);
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.fullName,
          company_name: formData.companyName
        }),
      });

      if (res.ok) {
        const data = await res.json();
        login(data.access_token, { 
          id: Date.now(), 
          email: formData.email, 
          full_name: formData.fullName, 
          company_name: formData.companyName 
        });
        router.push('/dashboard');
      } else {
        const err = await res.json();
        alert(err.detail || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const strengthColors = ['bg-muted', 'bg-destructive', 'bg-warning', 'bg-success', 'bg-success'];

  return (
    <div className="min-h-screen bg-background flex font-sans selection:bg-primary/30">
      
      {/* Left Panel - Hero/Brand Area */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0B0F19] to-[#111827] flex-col justify-between p-12">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/20">
            S
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">SEO Audit Platform</span>
        </div>

        <div className="relative z-10 max-w-lg mt-20">
          <h1 className="text-4xl font-bold tracking-tight text-white leading-tight mb-6">
            Scale your infrastructure <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">
              with Enterprise SEO
            </span>
          </h1>
          <p className="text-lg text-slate-400 mb-10 leading-relaxed">
            Get comprehensive site audits, historical comparisons, and actionable insights to drive organic growth.
          </p>

          <div className="space-y-4">
            {[
              "Unlimited technical audits",
              "Advanced Core Web Vitals tracking",
              "Enterprise RBAC and team management"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-12 w-[120%] p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl translate-x-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <span className="font-medium text-white">Platform Uptime</span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-success/20 text-success">99.99%</span>
          </div>
          <div className="h-16 flex items-end gap-1.5">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="w-full bg-success rounded-t-sm" style={{ height: `${80 + Math.random() * 20}%` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-y-auto">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:32px_32px] dark:bg-grid-slate-400/[0.05]" />
        
        <div className="w-full max-w-md relative z-10 py-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Create your account</h2>
            <p className="text-muted-foreground">Join the platform to access enterprise features.</p>
          </div>

          <div className="glass-card p-8 rounded-2xl">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-border/50 rounded-xl leading-5 bg-card/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm"
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Company</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-border/50 rounded-xl leading-5 bg-card/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm"
                      placeholder="Acme Inc."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Work Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-border/50 rounded-xl leading-5 bg-card/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm"
                    placeholder="jane@company.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-border/50 rounded-xl leading-5 bg-card/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
                {formData.password.length > 0 && (
                  <div className="mt-2 flex gap-1 h-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div 
                        key={i} 
                        className={`flex-1 rounded-full ${passwordStrength >= i ? strengthColors[passwordStrength] : 'bg-muted'}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-border/50 rounded-xl leading-5 bg-card/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-start pt-2">
                <input
                  id="terms"
                  name="termsAccepted"
                  type="checkbox"
                  required
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary/50 border-border rounded cursor-pointer mt-0.5"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-muted-foreground">
                  I agree to the <Link href="#" className="text-primary hover:text-primary/80 transition-colors">Terms of Service</Link> and <Link href="#" className="text-primary hover:text-primary/80 transition-colors">Privacy Policy</Link>.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.termsAccepted || formData.password !== formData.confirmPassword}
                className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all group disabled:opacity-50 disabled:cursor-not-allowed pt-2"
              >
                {loading ? 'Setting up...' : 'Create Account'}
                {!loading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
