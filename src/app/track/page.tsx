"use client";

import { useState, useEffect } from 'react';
import { Search, Package, MapPin, Clock, CheckCircle, Truck, AlertCircle, CreditCard, Calendar, ChevronRight, XCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Order = {
  orderId: string;
  customer: {
    name: string;
    address: string;
  };
  items: any[];
  totalAmount: number;
  payment: {
    status: string;
    method?: string;
    paymentType?: string;
    paymentDetails?: {
      bank?: string;
      issuer?: string;
    };
  };
  delivery?: {
    method: string;
    price: number;
  };
  createdAt: string;
};

export default function TrackOrderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-mesh">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/orders?orderId=${orderId}`);
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error('Order not found. Please check your Order ID.');
        }
        throw new Error(data.error || 'Failed to fetch order details.');
      }

      if (data && data.length > 0) {
        setOrder(data[0]);
      } else {
        setError('Order not found. Please check your Order ID.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'pending': return 1;
      case 'paid': return 2;
      case 'processing': return 3;
      case 'shipped': return 4;
      case 'completed': return 5;
      case 'failed': return -1;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const currentStep = order ? getStatusStep(order.payment.status) : 0;
  const isFailed = currentStep === -1;

  const steps = [
    { label: 'Pesanan Dibuat', icon: Clock },
    { label: 'Pembayaran', icon: CreditCard },
    { label: 'Diproses', icon: Package },
    { label: 'Dikirim', icon: Truck },
    { label: 'Selesai', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-mesh pt-28 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Lacak Pesanan
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Masukkan ID Pesanan Anda untuk melihat status terkini pengiriman dokumen Anda.
          </p>
        </div>

        {/* Search Section */}
        <div className="glass-card rounded-2xl shadow-xl p-8 mb-10 transition-all duration-300 hover:shadow-2xl animate-scale-in relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10 transition-transform duration-700 group-hover:scale-110" />
          
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <div className="relative group/input">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Masukkan Order ID"
                className="w-full pl-12 sm:pl-14 pr-20 sm:pr-32 py-4 sm:py-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-base sm:text-lg shadow-sm group-hover/input:shadow-md"
              />
              <Search className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 sm:h-6 sm:w-6 group-hover/input:text-blue-500 transition-colors" />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 px-4 sm:px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-105 active:scale-95 text-sm sm:text-base"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span className="hidden sm:inline">Lacak</span>
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="glass-card bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 p-6 rounded-xl mb-8 animate-fade-in flex items-center gap-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full shrink-0">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-bold text-red-900 dark:text-red-300 text-lg">Pesanan Tidak Ditemukan</h3>
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {order && (
          <div className="space-y-8 animate-slide-up">
            {/* Timeline Card */}
            <div className={`glass-card rounded-2xl shadow-xl overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] ${
              isFailed 
                ? 'border-red-200/50 dark:border-red-700/50' 
                : 'border-gray-200/50 dark:border-gray-700/50'
            }`}>
              <div className={`p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                isFailed 
                  ? 'bg-red-50/50 dark:bg-red-900/20 border-red-100 dark:border-red-800' 
                  : 'bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700'
              }`}>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">#{order.orderId}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      isFailed ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      order.payment.status === 'paid' || order.payment.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      order.payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {order.payment.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB
                  </div>
                </div>
              </div>

              <div className="p-8">
                {isFailed ? (
                  <div className="flex flex-col items-center justify-center text-center py-8">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6 animate-pulse">
                      <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pesanan Gagal / Dibatalkan</h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md">
                      Mohon maaf, pesanan Anda tidak dapat diproses. Silakan hubungi layanan pelanggan kami untuk informasi lebih lanjut atau lakukan pemesanan ulang.
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Progress Bar Background (Horizontal for desktop, Vertical for mobile) */}
                    <div className="absolute left-5 top-5 bottom-5 w-1 bg-gray-200 dark:bg-gray-700 rounded-full sm:left-0 sm:right-0 sm:top-5 sm:bottom-auto sm:w-full sm:h-1" />
                    
                    {/* Active Progress Bar */}
                    <div 
                      className="absolute left-5 top-5 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out sm:left-0 sm:top-5 sm:h-1 sm:bg-gradient-to-r"
                      style={{ 
                        height: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 2.5rem)`, 
                        // On desktop, we use width instead of height
                        // Note: Tailwind arbitrary values in style prop for responsive logic is tricky, 
                        // so we handle the 'sm' breakpoint logic via CSS classes where possible or inline styles with media query awareness if needed.
                        // However, inline styles don't support media queries directly. 
                        // A better approach for responsive progress bar direction:
                      }}
                    />
                    {/* We need separate progress bars for mobile (vertical) and desktop (horizontal) to handle the transition cleanly */}
                    <div className="absolute left-5 top-5 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out sm:hidden"
                         style={{ height: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }} />
                    
                    <div className="hidden sm:block absolute left-0 top-5 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                         style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }} />

                    <div className="flex flex-col sm:flex-row justify-between relative gap-8 sm:gap-0">
                      {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = index + 1 <= currentStep;
                        const isCurrent = index + 1 === currentStep;

                        return (
                          <div key={index} className="flex sm:flex-col items-center group gap-4 sm:gap-0">
                            <div 
                              className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 z-10 shrink-0 ${
                                isActive 
                                  ? 'bg-blue-600 border-blue-100 dark:border-blue-900 text-white shadow-lg scale-110' 
                                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'
                              } ${isCurrent ? 'ring-4 ring-blue-500/20 animate-pulse' : ''}`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <p className={`mt-0 sm:mt-3 text-sm sm:text-sm font-bold text-left sm:text-center transition-colors duration-300 ${
                              isActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-400 dark:text-gray-600'
                            }`}>
                              {step.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Customer & Shipping */}
              <div className="glass-card rounded-2xl shadow-md p-6 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-700 group">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:scale-110 transition-transform">
                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  Pengiriman
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">Penerima</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{order.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">Alamat</p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{order.customer.address}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">Metode</p>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900 dark:text-white capitalize">{order.delivery?.method || '-'}</span>
                      {order.delivery?.price ? (
                        <span className="text-gray-600 dark:text-gray-400">Rp {order.delivery.price.toLocaleString('id-ID')}</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="glass-card rounded-2xl shadow-md p-6 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-700 group">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:scale-110 transition-transform">
                    <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  Pembayaran
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">Metode</p>
                    <p className="font-semibold text-gray-900 dark:text-white capitalize">
                      {order.payment.status === 'pending' ? (
                        order.payment.paymentDetails?.bank || order.payment.paymentDetails?.issuer ? (
                          <span>
                            {order.payment.paymentDetails?.bank ? `Bank ${order.payment.paymentDetails.bank.toUpperCase()}` :
                             order.payment.paymentDetails?.issuer ? `QRIS (${order.payment.paymentDetails.issuer.toUpperCase()})` :
                             order.payment.paymentType?.replace(/_/g, ' ') || order.payment.method || '-'}
                          </span>
                        ) : (
                          <span className="text-yellow-600 dark:text-yellow-400 italic">Belum Dipilih</span>
                        )
                      ) : (
                        <span>
                          {order.payment.paymentDetails?.bank ? `Bank ${order.payment.paymentDetails.bank.toUpperCase()}` :
                           order.payment.paymentDetails?.issuer ? `QRIS (${order.payment.paymentDetails.issuer.toUpperCase()})` :
                           (order.payment.status === 'failed' || order.payment.status === 'cancelled') && (!order.payment.paymentDetails?.bank && !order.payment.paymentDetails?.issuer && !order.payment.paymentType) ? '-' :
                           order.payment.paymentType?.replace(/_/g, ' ') || order.payment.method || '-'}
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">Status</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase ${
                      isFailed ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      order.payment.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {order.payment.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">Total Tagihan</p>
                    <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                      Rp {order.totalAmount.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="glass-card rounded-2xl shadow-md p-6 border border-gray-200/50 dark:border-gray-700/50 md:col-span-1 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-700 group">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:scale-110 transition-transform">
                    <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  Ringkasan Item
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total <span className="font-bold text-gray-900 dark:text-white">{order.items.length} file</span> dalam pesanan ini.
                  </p>
                  <div className="max-h-40 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                        <div className="truncate flex-1 mr-2">
                          <p className="font-medium text-gray-900 dark:text-white truncate">{item.fileName}</p>
                          <p className="text-xs text-gray-500">{item.pageCount} Hal • {item.settings?.copies || 1}x</p>
                        </div>
                        <span className="text-xs font-bold text-gray-500 bg-white dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 capitalize">
                          {item.serviceType === 'print' ? 'Print' : item.serviceType}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
