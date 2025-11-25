"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { ThemeToggle } from './ThemeToggle';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { items } = useCart();
  const pathname = usePathname();
  const { data: session } = useSession();

  // Hide Navbar on Admin and Courier pages
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/courier')) {
    return null;
  }

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 rounded-2xl glass border border-white/40 dark:border-gray-700/40 shadow-2xl backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 mr-12 group">
              <div className="relative h-12 w-40 dark:brightness-0 dark:invert transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-lg">
                <Image 
                  src="/logo.png" 
                  alt="CetakGO Logo" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              {[
                { label: 'Home', href: '/' },
                { label: 'About Us', href: '/about' },
                { label: 'Track Order', href: session ? "/track" : "/login" },
              ].map((link) => (
                <Link 
                  key={link.label}
                  href={link.href} 
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                    pathname === link.href 
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <Link 
                href="/order" 
                className="ml-2 px-6 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
              >
                Order Now
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            
            <Link 
              href={session ? "/cart" : "/login"} 
              className="relative p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 group"
            >
              <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 rounded-full shadow-md animate-bounce-short">
                  {items.length}
                </span>
              )}
            </Link>

            {/* Auth Buttons */}
            {session ? (
              <div className="flex items-center gap-3 pl-3 ml-2 border-l-2 border-gray-100 dark:border-gray-700/50">
                {session.user?.role === 'admin' ? (
                  <Link href="/admin" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-bold text-sm transition-all hover:shadow-sm">
                    <User className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                ) : session.user?.role === 'courier' ? (
                  <Link href="/courier" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-bold text-sm transition-all hover:shadow-sm">
                    <User className="h-4 w-4" />
                    <span>Courier</span>
                  </Link>
                ) : (
                  <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-bold text-sm transition-all hover:shadow-md hover:bg-white dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs">
                      {session.user?.name?.charAt(0)}
                    </div>
                    <span>{session.user?.name?.split(' ')[0]}</span>
                  </Link>
                )}
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="ml-2 px-5 py-2 rounded-full font-bold text-sm text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              >
                Login
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-3">
            <Link href={session ? "/cart" : "/login"} className="relative p-2 text-gray-900 dark:text-white">
              <ShoppingCart className="h-6 w-6" />
              {items.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                  {items.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden absolute w-full glass border-t border-white/20 dark:border-gray-700/30 overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pt-4 pb-6 space-y-2 bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl">
          {[
            { label: 'Home', href: '/' },
            { label: 'Order Now', href: '/order' },
            { label: 'About Us', href: '/about' },
            { label: 'Track Order', href: session ? "/track" : "/login" },
          ].map((link) => (
            <Link 
              key={link.label}
              href={link.href} 
              className="block px-4 py-3 rounded-xl text-base font-bold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          
          <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
            <div className="flex items-center justify-between px-4 mb-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Appearance</span>
              <ThemeToggle />
            </div>
            
            {session ? (
              <div className="space-y-2">
                {session.user?.role === 'admin' ? (
                  <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <User className="h-5 w-5 text-blue-600" />
                    Admin Dashboard
                  </Link>
                ) : session.user?.role === 'courier' ? (
                  <Link href="/courier" className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <User className="h-5 w-5 text-blue-600" />
                    Courier Dashboard
                  </Link>
                ) : (
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm">
                      {session.user?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{session.user?.name}</p>
                      <p className="text-xs text-gray-500">View Profile</p>
                    </div>
                  </Link>
                )}
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="block w-full text-center px-4 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
