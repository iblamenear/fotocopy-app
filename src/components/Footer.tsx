"use client";

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Send, CreditCard, ShieldCheck, ArrowRight, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Hide Footer on Admin and Courier pages
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/courier')) {
    return null;
  }

  return (
    <footer className="relative bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-20 pb-10 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="inline-block group">
              <h3 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300">
                Cetak<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">GO</span>
              </h3>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Solusi cetak dokumen modern yang cepat, berkualitas, dan terpercaya. Kami mengantar hasil cetakan langsung ke depan pintu Anda.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: "#", color: "hover:text-blue-600" },
                { icon: Instagram, href: "#", color: "hover:text-pink-600" },
                { icon: Twitter, href: "#", color: "hover:text-sky-500" }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-white dark:hover:bg-gray-700`}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
              Menu Utama
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Beranda', href: '/' },
                { label: 'Pesan Sekarang', href: '/order' },
                { label: 'Lacak Pesanan', href: '/track' },
                { label: 'Tentang Kami', href: '/about' }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm transition-all duration-300 flex items-center gap-2 group"
                  >
                    <ChevronRight className="h-3 w-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-8 h-1 bg-indigo-600 rounded-full"></span>
              Layanan Kami
            </h4>
            <ul className="space-y-3">
              {['Cetak Dokumen', 'Cetak Foto', 'Jilid Buku', 'Laminating'].map((service, index) => (
                <li key={index}>
                  <Link 
                    href="/order" 
                    className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 text-sm transition-all duration-300 flex items-center gap-2 group"
                  >
                    <ChevronRight className="h-3 w-3 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                    <span className="group-hover:translate-x-1 transition-transform">{service}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-8 h-1 bg-purple-600 rounded-full"></span>
              Info Kontak
            </h4>
            
            <div className="space-y-4 mb-6">
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="Email untuk info promo..." 
                  className="w-full pl-4 pr-12 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                />
                <button className="absolute right-2 top-2 bottom-2 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors shadow-md hover:shadow-lg">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400 text-sm group">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:scale-110 transition-transform shrink-0">
                  <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="leading-relaxed">Apartemen Bassura City Kios Tower Flamboyan No AL10, Jakarta</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm group">
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg group-hover:scale-110 transition-transform shrink-0">
                  <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <span>+62 821 2349 7545</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm group">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg group-hover:scale-110 transition-transform shrink-0">
                  <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span>support@cetakgo.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-500 dark:text-gray-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} <span className="font-bold text-gray-700 dark:text-gray-300">CetakGO</span>. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              Pembayaran Aman
            </div>
            <div className="flex gap-3 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <div className="h-8 w-12 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm">
                <span className="text-[10px] font-bold text-blue-800">BCA</span>
              </div>
              <div className="h-8 w-12 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm">
                <span className="text-[10px] font-bold text-orange-600">BNI</span>
              </div>
              <div className="h-8 w-12 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm">
                <span className="text-[10px] font-bold text-blue-600">BRI</span>
              </div>
              <div className="h-8 w-12 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm">
                <span className="text-[10px] font-bold text-red-600">QRIS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
