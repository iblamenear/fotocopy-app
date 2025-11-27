"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { User, Package, Clock, CheckCircle, XCircle, Loader2, Edit2, Camera, Save, CreditCard, Truck, RefreshCw, ChevronDown, ChevronUp, Wallet, ShoppingBag, Activity, Search, Filter } from "lucide-react";
import Link from "next/link";

interface Order {
  orderId: string;
  totalAmount: number;
  createdAt: string;
  payment: {
    status: string;
  };
  delivery: {
    method: string;
  };
  items: any[];
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    image: '',
    address: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchOrders();
      fetchUserProfile();
    }
  }, [session]);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data.user);
        setEditForm({
          name: data.user.name || '',
          phone: data.user.phone || '',
          image: data.user.image || '',
          address: data.user.address || ''
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders?userId=${(session?.user as any)?.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'processing': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'shipped': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getIconStyles = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600';
      case 'processing': return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600';
      case 'shipped': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600';
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-600';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-600';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600';
    }
  };

  const handlePayment = (token: string, orderId?: string) => {
    if ((window as any).snap) {
      (window as any).snap.pay(token, {
        onSuccess: async function(result: any) {
          console.log("Payment success:", result);
          // Manually check status to update DB immediately (fix for localhost)
          try {
            await fetch('/api/midtrans/status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId: result.order_id }),
            });
          } catch (e) {
            console.error("Failed to manual check status", e);
          }
          fetchOrders(); // Refresh orders
        },
        onPending: async function(result: any) {
          console.log("Pending result:", result);
          
          // Extract payment details
          let paymentDetails: any = {};
          
          if (result.va_numbers && result.va_numbers.length > 0) {
            paymentDetails.bank = result.va_numbers[0].bank;
            paymentDetails.vaNumber = result.va_numbers[0].va_number;
          } else if (result.permata_va_number) {
             paymentDetails.bank = 'permata';
             paymentDetails.vaNumber = result.permata_va_number;
          } else if (result.bill_key && result.biller_code) {
            paymentDetails.bank = 'mandiri';
            paymentDetails.billKey = result.bill_key;
            paymentDetails.billerCode = result.biller_code;
          } else if (result.payment_type === 'qris') {
             paymentDetails.issuer = result.issuer || 'GOPAY';
          }

          if (orderId) {
            try {
              await fetch('/api/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId,
                  status: 'pending',
                  paymentType: result.payment_type,
                  paymentDetails
                }),
              });
              fetchOrders();
            } catch (error) {
              console.error("Failed to update order with pending details", error);
            }
          } else {
             fetchOrders();
          }
        },
        onError: function(result: any) {
          console.error("Payment failed", result);
        },
        onClose: function() {
          console.log('Customer closed the popup without finishing the payment');
          fetchOrders();
        }
      });
    } else {
      console.error("Snap.js not loaded");
    }
  };

  const handleChangePaymentMethod = async (orderId: string) => {
    try {
      const res = await fetch('/api/orders/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (res.ok) {
        handlePayment(data.token, orderId);
      } else {
        alert(`Failed to change payment method: ${data.error}`);
      }
    } catch (error) {
      console.error("Error changing payment method", error);
      alert("An error occurred while changing payment method");
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      console.log('Sending profile update:', editForm);
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();

      if (res.ok) {
        await fetchUserProfile();
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        console.error("Update failed response:", data);
        alert(`Failed to update profile: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error updating profile", error);
      alert("An error occurred while updating profile");
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setEditForm(prev => ({ ...prev, image: dataUrl }));
        };
      };
    }
  };

  const handleCancel = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: 'failed' }),
      });

      if (res.ok) {
        fetchOrders();
      } else {
        alert("Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order", error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = activeTab === 'all' ? true :
      activeTab === 'pending' ? order.payment.status === 'pending' :
      activeTab === 'processing' ? ['paid', 'processing'].includes(order.payment.status) :
      activeTab === 'shipped' ? order.payment.status === 'shipped' :
      activeTab === 'completed' ? order.payment.status === 'completed' :
      activeTab === 'cancelled' ? ['failed', 'cancelled'].includes(order.payment.status) : true;

    const matchesSearch = order.orderId.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 min-h-screen bg-gradient-mesh transition-colors duration-200">
      {/* Profile Header & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 animate-fade-in">
        {/* Profile Card */}
        <div className="lg:col-span-2 glass-card rounded-2xl shadow-xl overflow-hidden border border-white/40 dark:border-white/20 relative group transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] hover:border-blue-400/60 dark:hover:border-blue-500/40 backdrop-blur-2xl flex flex-col">
          {/* Cover Photo */}
          <div className="h-20 bg-gradient-to-r from-blue-400 to-indigo-400 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
          </div>

          <div className="px-6 py-6 relative flex-1 flex flex-col justify-center bg-gradient-to-b from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-800/30 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative group/avatar shrink-0">
                <div className="h-24 w-24 md:h-28 md:w-28 rounded-2xl p-1 shadow-2xl ring-4 ring-white/90 dark:ring-gray-700/90 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/50 dark:to-indigo-900/50 group-hover/avatar:scale-105 transition-transform duration-300">
                  <div className="h-full w-full rounded-xl overflow-hidden relative">
                    {editForm.image || userProfile?.image ? (
                      <img src={isEditing ? editForm.image : (userProfile?.image || editForm.image)} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-white dark:bg-gray-800">
                        <User className="h-10 w-10 md:h-12 md:w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
                {isEditing && (
                  <label className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-400 to-indigo-400 text-white p-2.5 rounded-xl cursor-pointer hover:shadow-lg hover:shadow-blue-400/20 transition-all hover:scale-110 active:scale-95 z-10 border-2 border-white dark:border-gray-800">
                    <Camera className="h-4 w-4" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>

              {/* Profile Info / Edit Form */}
              <div className="flex-1 min-w-0 w-full">
                {isEditing ? (
                  <div className="space-y-3 bg-white/90 dark:bg-gray-800/90 p-4 rounded-xl backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 animate-fade-in shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Nama Lengkap</label>
                        <input 
                          type="text" 
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Nomor Telepon</label>
                        <input 
                          type="tel" 
                          value={editForm.phone}
                          onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                          className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                          placeholder="08..."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Alamat Lengkap</label>
                        <textarea 
                          value={editForm.address}
                          onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                          className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm resize-none"
                          placeholder="Alamat lengkap..."
                          rows={2}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        Batal
                      </button>
                      <button 
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-md hover:shadow-blue-500/30 flex items-center gap-2 disabled:opacity-50"
                      >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Simpan
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col md:flex-row items-center gap-3 mb-2 justify-center md:justify-start">
                        <h1 className="text-2xl font-black text-gray-800 dark:text-white truncate tracking-tight">
                          {userProfile?.name || session.user?.name}
                        </h1>
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-blue-400 to-indigo-400 text-white shadow-md shadow-blue-400/20">
                          {userProfile?.role || (session.user as any)?.role || 'User'}
                        </span>
                      </div>
                      
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center justify-center md:justify-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        {userProfile?.email || session.user?.email}
                      </p>
                      
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs font-medium text-gray-600 dark:text-gray-300">
                        {userProfile?.phone ? (
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30">
                            <span className="text-emerald-500 dark:text-emerald-400">📞</span>
                            <span>{userProfile.phone}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic px-3 py-1.5">No. Telepon -</span>
                        )}

                        {userProfile?.address ? (
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30 max-w-full md:max-w-[200px]">
                            <span className="text-rose-500 dark:text-rose-400 shrink-0">📍</span>
                            <span className="truncate">{userProfile.address}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic px-3 py-1.5">Alamat -</span>
                        )}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="shrink-0 w-full md:w-auto px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all shadow-lg shadow-blue-400/20 hover:shadow-blue-400/30 hover:scale-105 flex items-center justify-center gap-2 group/btn"
                    >
                      <Edit2 className="h-4 w-4 group-hover/btn:rotate-12 transition-transform" />
                      <span>Edit Profil</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="space-y-4">
          <div className="glass-card p-5 rounded-2xl border border-white/40 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group cursor-pointer backdrop-blur-xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 relative overflow-hidden hover:border-blue-300/50 dark:hover:border-blue-500/30">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
              <Package className="h-20 w-20 text-blue-500" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300 shrink-0 text-white">
                <Package className="h-7 w-7" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider mb-1">Total Pesanan</p>
                <p className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">
                  {orders.length}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium mt-1">Pesanan dibuat</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/40 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group cursor-pointer backdrop-blur-xl bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/10 dark:to-teal-900/10 relative overflow-hidden hover:border-emerald-300/50 dark:hover:border-emerald-500/30">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
              <CreditCard className="h-20 w-20 text-emerald-500" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300 shrink-0 text-white">
                <CreditCard className="h-7 w-7" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-wider mb-1">Total Pengeluaran</p>
                <p className="text-3xl font-black text-gray-800 dark:text-white tracking-tight truncate">
                  Rp {orders.filter(o => ['paid', 'processing', 'shipped', 'completed'].includes(o.payment.status))
                            .reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString('id-ID')}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium mt-1">Akumulasi sukses</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/40 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group cursor-pointer backdrop-blur-xl bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10 relative overflow-hidden hover:border-amber-300/50 dark:hover:border-amber-500/30">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
              <Clock className="h-20 w-20 text-amber-500" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300 shrink-0 text-white">
                <Clock className="h-7 w-7" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-amber-500 dark:text-amber-400 uppercase tracking-wider mb-1">Pesanan Aktif</p>
                <p className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">
                  {orders.filter(o => ['pending', 'paid', 'processing', 'shipped'].includes(o.payment.status)).length}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium mt-1">Sedang berjalan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order History & Filters */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Riwayat Pesanan
          </h2>
          
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Cari Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'pending', label: 'Menunggu' },
            { id: 'processing', label: 'Diproses' },
            { id: 'shipped', label: 'Dikirim' },
            { id: 'completed', label: 'Selesai' },
            { id: 'cancelled', label: 'Dibatalkan' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto" />
            <p className="mt-2 text-gray-600 dark:text-gray-400 font-medium">Memuat riwayat pesanan...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-xl border border-gray-200/50 dark:border-gray-700/50 border-dashed transition-colors duration-200">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tidak ada pesanan ditemukan</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">
              {searchQuery ? `Tidak ada pesanan dengan ID "${searchQuery}"` : 'Belum ada pesanan di kategori ini.'}
            </p>
            {activeTab === 'all' && !searchQuery && (
              <Link href="/order" className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-lg shadow-lg text-white bg-blue-600 hover:bg-blue-700 transition-all hover:scale-105">
                Buat Pesanan Baru
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map((order) => (
              <div 
                key={order.orderId} 
                className="glass-card rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:shadow-2xl hover:scale-[1.02] hover:bg-white/60 dark:hover:bg-gray-800/60 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 animate-fade-in cursor-pointer group"
                onClick={() => setExpandedOrderId(expandedOrderId === order.orderId ? null : order.orderId)}
              >
                <div className="p-6">
                  {/* Header - Always Visible */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${getIconStyles(order.payment.status)}`}>
                        {order.payment.status === 'shipped' ? <Truck className="h-6 w-6" /> :
                         order.payment.status === 'processing' ? <RefreshCw className="h-6 w-6" /> :
                         order.payment.status === 'completed' ? <CheckCircle className="h-6 w-6" /> :
                         order.payment.status === 'failed' ? <XCircle className="h-6 w-6" /> :
                         order.payment.status === 'paid' ? <CreditCard className="h-6 w-6" /> :
                         <Clock className="h-6 w-6" />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-lg">{order.orderId}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 mt-4 sm:mt-0">
                      <div className="text-right">
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Belanja</p>
                        <p className="font-bold text-blue-600 dark:text-blue-400 text-base sm:text-lg">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(order.payment.status)}`}>
                        {order.payment.status.toUpperCase()}
                      </div>
                      <div className={`transition-transform duration-300 ${expandedOrderId === order.orderId ? 'rotate-180' : ''}`}>
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <div className={`grid transition-all duration-300 ease-in-out ${
                    expandedOrderId === order.orderId ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0'
                  }`}>
                    <div className="overflow-hidden">
                      <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-sm cursor-default" onClick={(e) => e.stopPropagation()}>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 mb-1">Metode Pengiriman</p>
                            <p className="font-medium text-gray-900 dark:text-white capitalize">
                              {(order.delivery as any)?.method || '-'} 
                              {(order.delivery as any)?.price ? ` (Rp ${(order.delivery as any).price.toLocaleString('id-ID')})` : ''}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 mb-1">Metode Pembayaran</p>
                            <p className="font-medium text-gray-900 dark:text-white capitalize">
                              {order.payment.status === 'pending' ? (
                                (order.payment as any)?.paymentDetails?.bank || (order.payment as any)?.paymentDetails?.issuer ? (
                                  <span>
                                    {(order.payment as any)?.paymentDetails?.bank ? `Bank ${(order.payment as any).paymentDetails.bank.toUpperCase()}` :
                                     (order.payment as any)?.paymentDetails?.issuer ? `QRIS (${(order.payment as any).paymentDetails.issuer.toUpperCase()})` :
                                     (order.payment as any)?.paymentType?.replace(/_/g, ' ') || '-'}
                                  </span>
                                ) : (
                                  <span className="text-yellow-600 dark:text-yellow-400 italic">Belum Dipilih</span>
                                )
                              ) : (
                                <span>
                                  {(order.payment as any)?.paymentDetails?.bank ? `Bank ${(order.payment as any).paymentDetails.bank.toUpperCase()}` :
                                   (order.payment as any)?.paymentDetails?.issuer ? `QRIS (${(order.payment as any).paymentDetails.issuer.toUpperCase()})` :
                                   (order.payment as any)?.paymentType?.replace(/_/g, ' ') || '-'}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        
                        <div className="cursor-default" onClick={(e) => e.stopPropagation()}>
                          <p className="text-sm text-gray-800 dark:text-gray-200 font-bold mb-3">Detail Item:</p>
                          <ul className="space-y-3 mb-6">
                            {order.items.map((item: any, idx: number) => (
                              <li key={idx} className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between items-start">
                                  <span className="font-bold text-base">{item.fileName}</span>
                                  <div className="flex flex-col items-end gap-1">
                                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full capitalize">
                                      {item.serviceType === 'print' ? 'Print/FC' : item.serviceType === 'photo' ? 'Cetak Foto' : item.serviceType}
                                    </span>
                                    {item.price && (
                                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                                        Rp {item.price.toLocaleString('id-ID')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-600 dark:text-gray-400">
                                  <p>Halaman: <span className="font-medium text-gray-900 dark:text-white">{item.pageCount}</span></p>
                                  <p>Rangkap: <span className="font-medium text-gray-900 dark:text-white">{item.settings?.copies || 1}x</span></p>
                                  
                                  {item.serviceType !== 'binding' && (
                                    <>
                                      <p>Ukuran: <span className="font-medium text-gray-900 dark:text-white">{item.settings?.paperSize}</span></p>
                                      {item.serviceType !== 'photo' && (
                                        <p>Warna: <span className="font-medium text-gray-900 dark:text-white">{item.settings?.color === 'bw' ? 'Hitam Putih' : 'Berwarna'}</span></p>
                                      )}
                                    </>
                                  )}
                                  
                                  {(item.serviceType === 'print' || item.serviceType === 'binding') && item.settings?.binding !== 'none' && (
                                    <p className="col-span-2">Jilid: <span className="font-medium text-gray-900 dark:text-white capitalize">{item.settings?.binding}</span></p>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>

                          {/* Payment Breakdown */}
                          <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-100 dark:border-gray-700 mb-6 space-y-2">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Rincian Pembayaran</h4>
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                              <span>Subtotal Item</span>
                              <span>Rp {order.items.reduce((sum: number, item: any) => sum + (item.price || 0), 0).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                              <span>Ongkos Kirim</span>
                              <span>Rp {((order.delivery as any)?.price || 0).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                              <span>Biaya Layanan</span>
                              <span>Rp {(order.totalAmount - order.items.reduce((sum: number, item: any) => sum + (item.price || 0), 0) - ((order.delivery as any)?.price || 0)).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-600 mt-2">
                              <span>Total Bayar</span>
                              <span>Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                            </div>
                          </div>

                          {/* Action Buttons for Pending Orders */}
                          {order.payment.status === 'pending' && (
                            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                              <button
                                onClick={() => handlePayment((order.payment as any).transactionId, order.orderId)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                              >
                                <CheckCircle className="h-4 w-4" />
                                {(order.payment as any)?.paymentDetails?.bank || (order.payment as any)?.paymentDetails?.issuer ? 'Selesaikan Pembayaran' : 'Bayar Sekarang'}
                              </button>
                              <button
                                onClick={() => handleChangePaymentMethod(order.orderId)}
                                className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50 dark:text-yellow-400 text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                              >
                                <CreditCard className="h-4 w-4" />
                                Ubah Metode
                              </button>
                              <button
                                onClick={() => handleCancel(order.orderId)}
                                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                              >
                                <XCircle className="h-4 w-4" />
                                Batalkan
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
