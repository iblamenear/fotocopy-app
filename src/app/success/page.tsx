"use client";

import Link from 'next/link';
import { CheckCircle, ArrowRight, Package, Home, Copy, Check } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-mesh transition-colors duration-200 pt-28 pb-12 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="max-w-lg w-full text-center relative z-10">
        <div className="glass-card p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 animate-scale-in">
          
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center relative shadow-lg mx-auto animate-bounce">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Pesanan Berhasil!</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
            Terima kasih telah memesan. Dokumen Anda akan segera kami proses.
          </p>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-8 border border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider font-bold">Kode Pesanan</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-mono font-bold text-gray-900 dark:text-white tracking-wide">
                {orderId || 'N/A'}
              </span>
              {orderId && (
                <button 
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
                  title="Salin Kode"
                >
                  {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Link 
              href="/track" 
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02]"
            >
              <Package className="h-5 w-5" />
              Lacak Pesanan
            </Link>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link 
                href="/" 
                className="py-3 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-[1.02]"
              >
                <Home className="h-5 w-5" />
                Beranda
              </Link>
              <Link 
                href="/order" 
                className="py-3 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-[1.02]"
              >
                <ArrowRight className="h-5 w-5" />
                Pesan Lagi
              </Link>
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Butuh bantuan? <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-bold">Hubungi CS Kami</a>
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
