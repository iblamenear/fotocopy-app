"use client";

import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, Clock, Truck, XCircle, Package, CreditCard, TrendingUp, Filter, ChevronDown, ChevronUp, Search } from 'lucide-react';
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
    method: string;
  };
  createdAt: string;
};

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Auto refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.payment.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-blue-700 bg-blue-50 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      case 'pending': return 'text-yellow-700 bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
      case 'processing': return 'text-indigo-700 bg-indigo-50 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800';
      case 'shipped': return 'text-orange-700 bg-orange-50 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800';
      case 'completed': return 'text-green-700 bg-green-50 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case 'failed': return 'text-red-700 bg-red-50 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      default: return 'text-gray-700 bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh p-4 sm:p-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage orders and monitor performance</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button 
              onClick={fetchOrders}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:scale-105 active:scale-95 text-gray-700 dark:text-gray-200 transition-all font-bold border border-gray-200 dark:border-gray-700"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 relative overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
            <div className="absolute -right-6 -top-6 h-24 w-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-colors"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                  <Package className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> +12%
                </span>
              </div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Pesanan</h3>
              <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{orders.length}</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 relative overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
            <div className="absolute -right-6 -top-6 h-24 w-24 bg-yellow-500/10 rounded-full blur-xl group-hover:bg-yellow-500/20 transition-colors"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl text-yellow-600 dark:text-yellow-400">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Menunggu</h3>
              <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                {orders.filter(o => o.payment.status === 'pending').length}
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 relative overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
            <div className="absolute -right-6 -top-6 h-24 w-24 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-colors"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <RefreshCw className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Diproses</h3>
              <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                {orders.filter(o => o.payment.status === 'processing').length}
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 relative overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
            <div className="absolute -right-6 -top-6 h-24 w-24 bg-green-500/10 rounded-full blur-xl group-hover:bg-green-500/20 transition-colors"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
                  <CreditCard className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Pendapatan</h3>
              <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                Rp {orders.reduce((sum, o) => o.payment.status === 'paid' || o.payment.status === 'completed' ? sum + (o.totalAmount || 0) : sum, 0).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/50 dark:bg-gray-800/50 p-2 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
          <div className="flex gap-1 overflow-x-auto w-full sm:w-auto p-1 no-scrollbar">
            {['all', 'pending', 'paid', 'processing', 'shipped', 'completed', 'failed'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-all duration-200 ${
                  filter === s 
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md scale-105' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          
          <div className="relative w-full sm:w-64 mr-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div 
              key={order.orderId} 
              className="glass-card rounded-2xl shadow-sm border border-white/40 dark:border-gray-700/40 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.005] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl"
            >
              {/* Concise View (Header) */}
              <div className="p-6 cursor-pointer group" onClick={() => setExpandedOrderId(expandedOrderId === order.orderId ? null : order.orderId)}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-5">
                    <div className={`p-4 rounded-2xl shadow-inner ${
                      order.payment.status === 'paid' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                      order.payment.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600' :
                      order.payment.status === 'processing' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' :
                      order.payment.status === 'shipped' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' :
                      order.payment.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                      'bg-red-100 dark:bg-red-900/30 text-red-600'
                    }`}>
                      {order.payment.status === 'shipped' ? <Truck className="h-6 w-6" /> :
                       order.payment.status === 'processing' ? <RefreshCw className="h-6 w-6" /> :
                       order.payment.status === 'completed' ? <CheckCircle className="h-6 w-6" /> :
                       order.payment.status === 'failed' ? <XCircle className="h-6 w-6" /> :
                       order.payment.status === 'paid' ? <CreditCard className="h-6 w-6" /> :
                       <Clock className="h-6 w-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">#{order.orderId}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.payment.status)}`}>
                          {order.payment.status}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{order.customer.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 justify-between md:justify-end w-full md:w-auto pl-20 md:pl-0">
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Amount</p>
                      <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                        Rp {(order.totalAmount || 0).toLocaleString('id-ID')}
                      </p>
                    </div>
                    
                    <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 ${expandedOrderId === order.orderId ? 'rotate-180 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''}`}>
                      <ChevronDown className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed View (Expanded) */}
              <div className={`grid transition-all duration-500 ease-in-out ${
                expandedOrderId === order.orderId ? 'grid-rows-[1fr] opacity-100 border-t border-gray-100 dark:border-gray-700/50' : 'grid-rows-[0fr] opacity-0'
              }`}>
                <div className="overflow-hidden bg-gray-50/50 dark:bg-gray-800/30">
                  <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Customer Info */}
                    <div className="space-y-6">
                      <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        Customer Details
                      </h4>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">Name</p>
                          <p className="font-medium text-gray-900 dark:text-white">{order.customer.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">Contact</p>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">{order.customer.email}</p>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">{order.customer.phone}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">Shipping Address</p>
                          <p className="font-medium text-gray-900 dark:text-white text-sm leading-relaxed">{order.customer.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-6 lg:col-span-2">
                      <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                        <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">
                          <Package className="w-4 h-4" />
                        </div>
                        Order Items ({order.items.length})
                      </h4>
                      <div className="grid gap-3">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-blue-300 dark:hover:border-blue-700">
                            <div className="flex items-start gap-4">
                              <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 font-bold text-xs">
                                {idx + 1}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 dark:text-white text-lg">{item.fileName}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-md font-medium capitalize">
                                    {item.serviceType === 'print' ? 'Print / FC' : item.serviceType === 'photo' ? 'Cetak Foto' : item.serviceType}
                                  </span>
                                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md font-medium">
                                    {item.pageCount} Halaman
                                  </span>
                                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md font-medium">
                                    {item.settings?.copies || 1} Rangkap
                                  </span>
                                  {item.serviceType !== 'binding' && (
                                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md font-medium">
                                      {item.settings?.paperSize}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {item.settings?.binding !== 'none' && (
                              <div className="text-right">
                                <span className="inline-block px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-bold capitalize">
                                  Binding: {item.settings?.binding}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="lg:col-span-3 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="text-sm bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <span className="text-gray-500 dark:text-gray-400">Payment Method: </span>
                        <span className="font-bold text-gray-900 dark:text-white capitalize ml-1">
                          {(order as any).payment?.paymentDetails?.bank ? `Bank ${(order as any).payment.paymentDetails.bank.toUpperCase()}` :
                           (order as any).payment?.paymentDetails?.issuer ? `QRIS (${(order as any).payment.paymentDetails.issuer.toUpperCase()})` :
                           (order as any).payment?.paymentType?.replace(/_/g, ' ') || '-'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">Update Status:</label>
                        <div className="relative w-full sm:w-48">
                          <select
                            value={order.payment.status}
                            onChange={(e) => updateStatus(order.orderId, e.target.value)}
                            className="w-full appearance-none text-sm font-medium text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 py-2.5 pl-4 pr-10 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredOrders.length === 0 && (
            <div className="p-16 text-center text-gray-500 dark:text-gray-400 glass-card rounded-2xl flex flex-col items-center justify-center">
              <div className="h-20 w-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No orders found</h3>
              <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
