"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid admin credentials');
      } else {
        // We rely on middleware or client-side check to ensure they are actually admin
        // But for now, just redirect to admin dashboard
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-mesh py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200 relative overflow-hidden">
      {/* Animated Background Elements - Darker/More Professional Tone */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-400/20 dark:bg-slate-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full space-y-8 glass-card p-8 sm:p-10 rounded-3xl shadow-2xl transition-all duration-300 border border-white/40 dark:border-gray-700/40 animate-scale-in hover:shadow-3xl relative z-10 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-800 dark:to-black rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300 border-4 border-white/20">
            <ShieldCheck className="h-10 w-10 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-black tracking-tight text-gray-900 dark:text-white">Admin Portal</h2>
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">Restricted Access</span>
          </div>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50/80 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-700 dark:text-red-400 flex items-center gap-2 backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}
          
          <div className="space-y-5">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-slate-600 dark:group-focus-within:text-slate-300 transition-colors" />
              </div>
              <input
                type="email"
                required
                className="appearance-none rounded-xl relative block w-full pl-11 px-4 py-3.5 border border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500 focus:bg-white dark:focus:bg-gray-800 sm:text-sm transition-all duration-200 backdrop-blur-sm shadow-sm"
                placeholder="Admin Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-slate-600 dark:group-focus-within:text-slate-300 transition-colors" />
              </div>
              <input
                type="password"
                required
                className="appearance-none rounded-xl relative block w-full pl-11 px-4 py-3.5 border border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500 focus:bg-white dark:focus:bg-gray-800 sm:text-sm transition-all duration-200 backdrop-blur-sm shadow-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-slate-800 to-black hover:from-slate-700 hover:to-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-slate-500/30 transition-all hover:scale-[1.02]"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Authenticate
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
