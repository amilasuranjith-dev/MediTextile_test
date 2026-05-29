"use client";

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock, Info, Loader } from 'lucide-react';
import { login } from '@/app/actions/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await login(formData);
      if (result.success) {
        setSuccessMsg(result.simulated ? 'Simulated login successful! Redirecting...' : 'Authenticated successfully! Redirecting...');
        // Refresh routing context and redirect
        setTimeout(() => {
          router.push('/admin');
          router.refresh();
        }, 800);
      } else {
        setErrorMsg(result.error || 'Authentication failed');
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-150/60 dark:border-slate-700 shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center text-primary dark:text-blue-400 mx-auto shadow-sm">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-gray-900 dark:text-white">
            MediTex Admin Console
          </h1>
          <p className="text-xs text-gray-400">
            Log in to manage medical products and B2B quote inquiries
          </p>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-400 text-xs p-4 rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-650 dark:text-emerald-400 text-xs p-4 rounded-xl font-medium flex items-center gap-2">
            <Loader className="w-4 h-4 animate-spin text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
                Administrator Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@meditex.eu"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 pl-11 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-500 placeholder-gray-400"
                />
                <Mail className="w-4.5 h-4.5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 pl-11 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-500 placeholder-gray-400"
                />
                <Lock className="w-4.5 h-4.5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 bg-primary hover:bg-blue-700 disabled:bg-blue-450 text-white font-bold text-sm rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Verifying Credentials...
              </>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>

        {/* Fallback Credential Info Alert */}
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl p-4.5 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>Developer Sandbox Environment</span>
          </div>
          <p className="leading-relaxed text-gray-600 dark:text-gray-400 font-medium">
            If Supabase keys are not set in `.env.local`, use the following fallback details to preview dashboard operations:
          </p>
          <div className="grid grid-cols-2 gap-x-2 pt-1 font-semibold text-gray-800 dark:text-gray-200 border-t border-amber-500/10">
            <span>Email: admin@meditex.eu</span>
            <span>Password: admin123</span>
          </div>
        </div>

      </div>
    </div>
  );
}
