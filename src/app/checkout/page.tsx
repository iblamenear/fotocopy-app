"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { MapPin, Truck, CreditCard, CheckCircle, ArrowRight, User, Phone, Mail, ShieldCheck, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

declare global {
  interface Window {
    snap: any;
  }
}

export default function CheckoutPage() {
  const { items, total, removeSelectedItems } = useCart();
  const router = useRouter();
  const { data: session } = useSession();

  // Filter only selected items
  const selectedItems = items.filter(item => item.selected);

  const [deliveryMethod, setDeliveryMethod] = useState('regular');
  const [paymentMethod, setPaymentMethod] = useState('qris'); // Kept for UI, but backend handles actual payment type via Snap
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  useEffect(() => {
    if (session?.user) {
      setCustomerName(session.user.name || '');
      setCustomerEmail(session.user.email || '');
      
      // Fetch latest profile to get phone number and address
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          if (data.user?.phone) {
            setCustomerPhone(data.user.phone);
          }
          if (data.user?.address) {
            setCustomerAddress(data.user.address);
          }
        })
        .catch(err => console.error("Failed to fetch profile for checkout", err));
    }
  }, [session]);

  const deliveryOptions = [
    { id: 'instant', name: 'Instant (Gojek/Grab)', price: 20000, time: '1-2 Jam', icon: <Truck className="h-6 w-6" /> },
    { id: 'sameday', name: 'Same Day', price: 15000, time: '6-8 Jam', icon: <Truck className="h-6 w-6" /> },
    { id: 'regular', name: 'Reguler (JNE/J&T)', price: 10000, time: '1-2 Hari', icon: <Truck className="h-6 w-6" /> },
  ];

  const selectedDelivery = deliveryOptions.find(d => d.id === deliveryMethod);
  const shippingCost = selectedDelivery ? selectedDelivery.price : 0;
  const grandTotal = total + shippingCost + 1000; // + Service Fee

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const orderData = {
        userId: session?.user?.id,
        items: selectedItems, // Use selected items only
        customer: {
          name: customerName,
          phone: customerPhone,
          email: customerEmail,
          address: customerAddress,
        },
        delivery: {
          method: selectedDelivery?.name,
          price: shippingCost,
        },
        totalAmount: grandTotal,
      };

      const response = await fetch('/api/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create transaction');
      }

      // Open Midtrans Snap Popup
      window.snap.pay(data.token, {
        onSuccess: function(result: any) {
          console.log('Payment success', result);
          removeSelectedItems();
          router.push(`/success?orderId=${result.order_id}`);
        },
        onPending: function(result: any) {
          console.log('Payment pending', result);
          removeSelectedItems();
          router.push(`/success?orderId=${result.order_id}`); // Or a specific pending page
        },
        onError: function(result: any) {
          console.log('Payment error', result);
          alert('Payment failed!');
          setIsProcessing(false);
        },
        onClose: function() {
          console.log('Customer closed the popup without finishing the payment');
          removeSelectedItems();
          router.push('/profile');
          setIsProcessing(false);
        }
      });

    } catch (error: any) {
      console.error('Checkout Error:', error);
      alert(`Terjadi kesalahan: ${error.message || 'Gagal memproses pesanan'}`);
      setIsProcessing(false);
    }
  };

  if (selectedItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-mesh py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200 flex items-center justify-center">  
        <div className="text-center glass-card p-8 rounded-2xl shadow-xl">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tidak ada item yang dipilih</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Silakan pilih item di keranjang terlebih dahulu.</p>
          <button 
            onClick={() => router.push('/cart')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold"
          >
            Kembali ke Keranjang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-mesh pt-28 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
          <CreditCard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          Checkout Pesanan
        </h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            {/* Address Section */}
            <div className="glass-card p-8 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-md">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-700">
                <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Alamat Pengiriman
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nama Penerima</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      required 
                      type="text" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-10 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                      placeholder="Nama Lengkap" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nomor Telepon</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      required 
                      type="tel" 
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-10 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                      placeholder="0812..." 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      required 
                      type="email" 
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full pl-10 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                      placeholder="email@example.com" 
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Alamat Lengkap</label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea 
                      required 
                      rows={3} 
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full pl-10 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                      placeholder="Nama Jalan, No Rumah, RT/RW, Kelurahan, Kecamatan"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="glass-card p-8 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-md">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-700">
                <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Metode Pengiriman
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {deliveryOptions.map((option) => (
                  <label key={option.id} className={`relative flex flex-col sm:flex-row items-start sm:items-center p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    deliveryMethod === option.id 
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 shadow-md' 
                      : 'border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}>
                    <input 
                      type="radio" 
                      name="delivery" 
                      value={option.id}
                      checked={deliveryMethod === option.id}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-3 rounded-full mr-4 mb-3 sm:mb-0 ${deliveryMethod === option.id ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1 w-full">
                        <span className={`font-bold text-lg ${deliveryMethod === option.id ? 'text-blue-900 dark:text-blue-300' : 'text-gray-900 dark:text-white'}`}>
                          {option.name}
                        </span>
                        <div className="flex items-center gap-2 mt-1 sm:mt-0">
                          {deliveryMethod === option.id && (
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                          )}
                          <span className="font-bold text-gray-900 dark:text-white">Rp {option.price.toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Estimasi tiba: {option.time}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Method Note */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800 flex gap-4 items-start">
              <div className="p-2 bg-white dark:bg-blue-900 rounded-lg shadow-sm">
                <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-blue-900 dark:text-blue-300 text-lg mb-1">Pembayaran Aman</h3>
                <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                  Transaksi Anda diproses dengan aman menggunakan gateway pembayaran Midtrans. Kami mendukung berbagai metode pembayaran termasuk QRIS, Transfer Bank, dan E-Wallet.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 sticky top-24 transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">Ringkasan Pesanan</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Total Item</span>
                  <span className="font-bold text-gray-900 dark:text-white">{selectedItems.length} file</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-white">Rp {total.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Pengiriman</span>
                  <span className="font-medium text-gray-900 dark:text-white">Rp {shippingCost.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Biaya Layanan</span>
                  <span className="font-medium text-gray-900 dark:text-white">Rp 1.000</span>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-gray-200 dark:border-gray-700 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-gray-900 dark:text-white text-lg">Total Bayar</span>
                  <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                    Rp {grandTotal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    Bayar Sekarang
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
              
              <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-4 flex items-center justify-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Pembayaran Terenkripsi & Aman
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
