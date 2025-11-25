"use client";

import { Printer, Truck, ShieldCheck, Users, Star, ArrowRight, Heart, Award, Coffee } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-gradient-mesh transition-colors duration-200 min-h-screen pt-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-grid-slate-100/[0.05] dark:bg-grid-slate-700/[0.05] -z-10" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8 animate-fade-in">
            <Award className="w-4 h-4" />
            <span>Solusi Cetak Terpercaya No. 1</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight animate-slide-up">
            Cetak Dokumen <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Tanpa Ribet
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{animationDelay: '0.1s'}}>
            Mitra cetak digital modern yang mengutamakan kecepatan, kualitas, dan kemudahan. Kirim file dari mana saja, kami antar sampai depan pintu.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{animationDelay: '0.2s'}}>
            <Link href="/order" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105">
              Mulai Cetak Sekarang
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="#features" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-300 backdrop-blur-sm">
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            { label: 'Pesanan Selesai', value: '10K+', icon: Printer, color: 'text-blue-600' },
            { label: 'Pelanggan Puas', value: '5K+', icon: Users, color: 'text-purple-600' },
            { label: 'Rating Layanan', value: '4.9/5', icon: Star, color: 'text-yellow-500' },
            { label: 'Kota Jangkauan', value: '25+', icon: Truck, color: 'text-green-600' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300 animate-scale-in" style={{animationDelay: `${0.3 + (i * 0.1)}s`}}>
              <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features/Mission Section */}
      <div id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Kenapa Memilih Kami?</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Kami menggabungkan teknologi cetak terbaru dengan pelayanan sepenuh hati untuk memberikan hasil terbaik bagi Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: ShieldCheck,
              title: "Jaminan Kualitas",
              desc: "Setiap dokumen melalui proses quality control ketat untuk memastikan hasil cetak yang tajam dan bersih.",
              color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
            },
            {
              icon: Truck,
              title: "Pengiriman Kilat",
              desc: "Bekerja sama dengan kurir terpercaya untuk memastikan dokumen Anda sampai tepat waktu dengan aman.",
              color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600"
            },
            {
              icon: Heart,
              title: "Layanan Personal",
              desc: "Tim support kami siap membantu konsultasi kebutuhan cetak Anda kapan saja dengan ramah.",
              color: "bg-red-100 dark:bg-red-900/30 text-red-600"
            }
          ].map((feature, i) => (
            <div key={i} className="glass-card p-8 rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 group">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${feature.color}`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white/50 dark:bg-gray-800/50 py-24 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">Apa Kata Mereka?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Amalia",
                role: "Mahasiswa",
                content: "Sangat terbantu banget pas lagi skripsi. Tinggal upload, bayar, besoknya udah nyampe kosan. Kualitas kertasnya juga oke banget!",
                avatar: "bg-pink-200"
              },
              {
                name: "Budi Santoso",
                role: "Freelancer",
                content: "Udah langganan buat cetak proposal klien. Hasilnya selalu rapi dan profesional. Adminnya juga fast response kalau ditanya.",
                avatar: "bg-blue-200"
              },
              {
                name: "Linda Kusuma",
                role: "Pemilik UMKM",
                content: "Cetak stiker label buat produk di sini hasilnya tajam dan warnanya keluar banget. Recommended buat yang butuh cetak berkualitas.",
                avatar: "bg-purple-200"
              }
            ].map((testi, i) => (
              <div key={i} className="glass-card p-8 rounded-2xl relative hover:scale-105 hover:shadow-xl transition-all duration-300">
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic">"{testi.content}"</p>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${testi.avatar} flex items-center justify-center text-gray-700 font-bold text-lg`}>
                    {testi.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{testi.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testi.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-4">
        <div className="max-w-5xl mx-auto glass-card rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 -z-10" />
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <Coffee className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Siap Mencetak Dokumen Anda?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
            Nikmati kemudahan mencetak dokumen berkualitas tinggi tanpa harus meninggalkan meja kerja Anda.
          </p>
          <Link href="/order" className="inline-flex items-center px-8 py-4 text-lg font-bold text-white bg-gray-900 dark:bg-blue-600 hover:bg-gray-800 dark:hover:bg-blue-700 rounded-xl shadow-lg transition-all hover:scale-105">
            Buat Pesanan Sekarang
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
