"use client";

import { useState, useEffect } from 'react';
import { RefreshCw, MapPin, Phone, CheckCircle, Package, Truck, Navigation, Clock, ChevronRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

type Order = {
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: any[];
  totalAmount: number;
  payment: {
    status: string;
  };
  createdAt: string;
};

export default function CourierPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Fetch only processing or shipped orders for courier
      const res = await fetch('/api/orders?status=active'); 
      const data = await res.json();
      // Filter client-side for specific statuses relevant to courier if needed
      // For now, let's show 'processing' (ready to pick up) and 'shipped' (delivering)
      const courierOrders = data.filter((o: Order) => 
        ['processing', 'shipped'].includes(o.payment.status)
      );
      setOrders(courierOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markAsDelivered = async (orderId: string) => {
    if (!confirm('Are you sure this order is delivered?')) return;
    
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: 'completed' }),
      });
      if (res.ok) {
        fetchOrders();
        alert('Order marked as completed!');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const markAsShipped = async (orderId: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: 'shipped' }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const activeDeliveries = orders.filter(o => o.payment.status === 'shipped').length;
  const pendingPickups = orders.filter(o => o.payment.status === 'processing').length;

  return (
    <div className="min-h-screen bg-gradient-mesh p-4 sm:p-6 transition-colors duration-200">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
              <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/30">
                <Truck className="h-6 w-6" />
              </div>
              Courier Panel
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-1">Manage your deliveries efficiently</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button 
              onClick={fetchOrders}
              className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md hover:scale-105 active:scale-95 text-gray-700 dark:text-gray-200 transition-all border border-gray-200 dark:border-gray-700"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl shadow-lg border border-blue-800/50 relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer bg-gradient-to-br from-blue-800 to-blue-950 text-white">
            <div className="absolute -right-4 -top-4 h-20 w-20 bg-white/10 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 opacity-100">
                <Truck className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Active</span>
              </div>
              <p className="text-3xl font-black">{activeDeliveries}</p>
              <p className="text-xs font-medium text-blue-100 mt-1">Deliveries in progress</p>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer bg-white dark:bg-gray-800">
            <div className="absolute -right-4 -top-4 h-20 w-20 bg-orange-500/10 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 text-orange-700 dark:text-orange-400">
                <Package className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Pickup</span>
              </div>
              <p className="text-3xl font-black text-gray-900 dark:text-white">{pendingPickups}</p>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">Ready to start</p>
            </div>
          </div>
        </div>

        {/* Deliveries List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 px-1">
            <Navigation className="h-5 w-5 text-blue-600" />
            Current Tasks
          </h2>
          
          {orders.map((order) => (
            <div key={order.orderId} className="glass-card rounded-2xl shadow-md border border-gray-200/60 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01] animate-fade-in bg-white dark:bg-gray-900 backdrop-blur-xl group">
              {/* Status Bar */}
              <div className={`h-2 w-full ${
                order.payment.status === 'shipped' ? 'bg-blue-600' : 'bg-orange-500'
              }`} />
              
              <div className="p-5 sm:p-6">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm ${
                        order.payment.status === 'shipped' 
                          ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800' 
                          : 'bg-orange-100 dark:bg-orange-900/60 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-800'
                      }`}>
                        {order.payment.status === 'shipped' ? (
                          <><Truck className="h-3 w-3" /> On The Way</>
                        ) : (
                          <><Package className="h-3 w-3" /> Ready to Pickup</>
                        )}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">#{order.orderId}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{order.customer.name}</h3>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-gray-700 shadow-sm">
                      <Package className="h-3.5 w-3.5" />
                      {order.items.length} Items
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-100 dark:bg-gray-800/80 border border-slate-300 dark:border-gray-700">
                    <div className="bg-white dark:bg-gray-700 p-2.5 rounded-lg shadow-sm text-blue-600 dark:text-blue-400 mt-0.5 border border-gray-200 dark:border-gray-600">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1">Delivery Address</p>
                      <p className="text-sm text-slate-900 dark:text-white leading-relaxed font-bold">{order.customer.address}</p>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.customer.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 dark:text-blue-300 hover:underline mt-2 bg-white dark:bg-blue-900/40 px-3 py-1.5 rounded-md border border-slate-200 dark:border-blue-800 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/60 shadow-sm"
                      >
                        <Navigation className="h-3 w-3" /> Open Maps
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <a 
                      href={`tel:${order.customer.phone}`} 
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-800 dark:text-gray-200 text-sm font-bold transition-all border-2 border-slate-200 dark:border-gray-700 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 hover:text-blue-700 dark:hover:text-blue-400"
                    >
                      <Phone className="h-4 w-4" />
                      Call Customer
                    </a>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700/50">
                  {order.payment.status === 'processing' && (
                    <button
                      onClick={() => markAsShipped(order.orderId)}
                      className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <Truck className="h-5 w-5" />
                      Start Delivery
                    </button>
                  )}
                  
                  {order.payment.status === 'shipped' && (
                    <button
                      onClick={() => markAsDelivered(order.orderId)}
                      className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-green-500/30 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Complete Delivery
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="text-center py-16 bg-white/50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 backdrop-blur-sm">
              <div className="h-20 w-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-10 w-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">All caught up!</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">No active deliveries at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
