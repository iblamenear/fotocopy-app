"use client";

import { useCart } from '@/context/CartContext';
import { Trash2, ArrowRight, FileText, ShoppingCart, Printer, BookOpen, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CartPage() {
  const { items, removeItem, total, toggleSelection, toggleAll } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-mesh">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const allSelected = items.length > 0 && items.every(item => item.selected);
  const selectedCount = items.filter(item => item.selected).length;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-mesh pt-28 pb-12 transition-colors duration-200 flex items-center justify-center px-4">
        <div className="max-w-lg w-full glass-card p-10 rounded-3xl shadow-2xl text-center border border-gray-200/50 dark:border-gray-700/50 animate-scale-in relative overflow-hidden group">
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 -z-10" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          
          <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:scale-110 transition-transform duration-300">
            <ShoppingCart className="h-14 w-14 text-gray-400 dark:text-gray-500" />
          </div>
          
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Keranjang Kosong</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-xs mx-auto leading-relaxed">
            Sepertinya Anda belum menambahkan dokumen apapun untuk dicetak.
          </p>
          
          <Link href="/order" className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-105">
            Mulai Pesan Sekarang
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'print': return <Printer className="h-5 w-5" />;
      case 'binding': return <BookOpen className="h-5 w-5" />;
      case 'photo': return <ImageIcon className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getServiceColor = (type: string) => {
    switch (type) {
      case 'print': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'binding': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'photo': return 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh pt-28 pb-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Keranjang Belanja</h1>
          <span className="px-4 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-bold">
            {items.length} Item
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Select All Header */}
            <div className="glass-card rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-5 flex items-center gap-4 transition-all duration-300 hover:shadow-md">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  checked={allSelected}
                  onChange={(e) => toggleAll(e.target.checked)}
                  className="w-6 h-6 text-blue-600 rounded-lg border-gray-300 focus:ring-blue-500 cursor-pointer transition-all"
                />
              </div>
              <span className="font-bold text-gray-700 dark:text-gray-200 text-lg">Pilih Semua Item</span>
            </div>

            {items.map((item) => (
              <div key={item.id} className="glass-card rounded-2xl shadow-md border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] hover:border-blue-300 dark:hover:border-blue-700 group animate-slide-up">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                  <div className="pt-2">
                    <input 
                      type="checkbox" 
                      checked={item.selected ?? true}
                      onChange={() => toggleSelection(item.id)}
                      className="w-6 h-6 text-blue-600 rounded-lg border-gray-300 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                  
                  <div className={`p-3 sm:p-4 rounded-2xl ${getServiceColor(item.serviceType)} shadow-sm group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                    {getServiceIcon(item.serviceType)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg truncate max-w-[180px] sm:max-w-sm" title={item.fileName}>
                          {item.fileName}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs font-medium">{item.fileSize}</span>
                          <span>•</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">{item.pageCount} Halaman</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        title="Hapus Item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                        <span className="block text-gray-500 dark:text-gray-400 text-[10px] uppercase font-bold mb-1">Layanan</span>
                        <span className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm capitalize truncate block">
                          {item.serviceType === 'print' ? 'Print / FC' : item.serviceType}
                        </span>
                      </div>
                      
                      {item.serviceType !== 'binding' && (
                        <>
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                            <span className="block text-gray-500 dark:text-gray-400 text-[10px] uppercase font-bold mb-1">Warna</span>
                            <span className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm truncate block">
                              {item.settings.color === 'bw' ? 'Hitam Putih' : 'Berwarna'}
                            </span>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                            <span className="block text-gray-500 dark:text-gray-400 text-[10px] uppercase font-bold mb-1">Ukuran</span>
                            <span className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm truncate block">
                              {item.settings.paperSize}
                            </span>
                          </div>
                        </>
                      )}
                      
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                        <span className="block text-gray-500 dark:text-gray-400 text-[10px] uppercase font-bold mb-1">Jumlah</span>
                        <span className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm truncate block">
                          {item.settings.copies} Rangkap
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        Rp {item.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 sticky top-24 transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                Ringkasan Pesanan
              </h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Total Item Dipilih</span>
                  <span className="font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">{selectedCount} file</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-gray-900 dark:text-white">Rp {total.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-gray-200 dark:border-gray-700 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-gray-900 dark:text-white text-lg">Total Bayar</span>
                  <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                    Rp {total.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {selectedCount > 0 ? (
                <Link 
                  href="/checkout"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02]"
                >
                  Lanjut ke Pembayaran
                  <ArrowRight className="h-6 w-6" />
                </Link>
              ) : (
                <button 
                  disabled
                  className="w-full py-4 bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2 cursor-not-allowed transition-colors"
                >
                  Pilih Item Dulu
                  <AlertCircle className="h-5 w-5" />
                </button>
              )}
              
              <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">
                Pastikan pesanan Anda sudah benar sebelum melanjutkan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
