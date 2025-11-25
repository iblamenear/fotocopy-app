"use client";

import Link from 'next/link';
import { Upload, Settings, CreditCard, Truck, CheckCircle, ArrowRight, Printer, FileText, HelpCircle, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-mesh transition-colors duration-200 pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-slate-100/[0.05] dark:bg-grid-slate-700/[0.05] -z-10" />
        {/* Abstract Shapes */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-1000 -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 animate-fade-in">
                <Star className="w-4 h-4 fill-current" />
                <span>Jasa Print Online #1 di Indonesia</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-gray-900 dark:text-white animate-slide-up">
                Cetak Dokumen <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  Tanpa Keluar Rumah
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed animate-slide-up" style={{animationDelay: '0.1s'}}>
                Solusi fotocopy dan printing online terpercaya. Upload filemu, atur spesifikasi, bayar, dan tunggu pesanan sampai di depan pintu.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up" style={{animationDelay: '0.2s'}}>
                <Link href="/order" className="group inline-flex justify-center items-center px-8 py-4 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105">
                  Mulai Pesan Sekarang
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#how-it-works" className="inline-flex justify-center items-center px-8 py-4 text-lg font-bold text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-300 backdrop-blur-sm">
                  Cara Pesan
                </Link>
              </div>
            </div>

            {/* 3D-like Illustration Area */}
            <div className="relative hidden lg:block animate-scale-in" style={{animationDelay: '0.3s'}}>
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Floating Cards */}
                <div className="absolute top-0 right-10 w-64 p-6 glass-card rounded-2xl shadow-2xl animate-float z-20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <Printer className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="h-2 w-24 bg-gray-200 rounded mb-2"></div>
                      <div className="h-2 w-16 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-gray-100 rounded"></div>
                    <div className="h-2 w-full bg-gray-100 rounded"></div>
                    <div className="h-2 w-3/4 bg-gray-100 rounded"></div>
                  </div>
                </div>

                <div className="absolute bottom-10 left-10 w-64 p-6 glass-card rounded-2xl shadow-2xl animate-float-delayed z-30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-bold text-gray-900 dark:text-white">Status</div>
                    <div className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full font-bold">Selesai</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">Skripsi.pdf</div>
                      <div className="text-xs text-gray-500">150 Halaman</div>
                    </div>
                  </div>
                </div>

                {/* Decorative Circle */}
                <div className="absolute inset-0 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-full animate-spin-slow -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Layanan Kami</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Kami menyediakan berbagai layanan percetakan berkualitas tinggi untuk kebutuhan kuliah, kantor, maupun pribadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Print Dokumen",
                desc: "Cetak skripsi, makalah, ebook, dan dokumen lainnya dengan kualitas tajam. Tersedia Hitam Putih & Warna.",
                icon: <Printer className="h-8 w-8 text-white" />,
                color: "bg-blue-600"
              },
              {
                title: "Jilid & Finishing",
                desc: "Lengkapi dokumenmu dengan berbagai pilihan jilid: Soft Cover, Hard Cover, Spiral, dan Lakban.",
                icon: <CheckCircle className="h-8 w-8 text-white" />,
                color: "bg-purple-600"
              },
              {
                title: "Antar Jemput",
                desc: "Tidak perlu antri. Kami menyediakan layanan pengiriman instan dan reguler ke seluruh area.",
                icon: <Truck className="h-8 w-8 text-white" />,
                color: "bg-orange-500"
              },
            ].map((feature, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 group animate-fade-in" style={{animationDelay: `${idx * 0.1}s`}}>
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Cara Pesan</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">4 Langkah mudah mencetak dokumen tanpa ribet</p>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 w-full origin-left animate-progress"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Upload File", desc: "Upload file PDF atau Word yang ingin dicetak.", icon: <Upload className="h-6 w-6" /> },
                { step: "02", title: "Atur Pesanan", desc: "Pilih jenis kertas, warna, dan jilid.", icon: <Settings className="h-6 w-6" /> },
                { step: "03", title: "Pembayaran", desc: "Bayar via Transfer, E-Wallet atau COD.", icon: <CreditCard className="h-6 w-6" /> },
                { step: "04", title: "Pengiriman", desc: "Pesanan diantar ke alamat tujuan.", icon: <Truck className="h-6 w-6" /> },
              ].map((item, idx) => (
                <div key={idx} className="relative group">
                  <div className="w-24 h-24 bg-white dark:bg-gray-800 border-4 border-blue-100 dark:border-blue-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 z-10 relative">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white">
                      {item.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-sm text-gray-900 shadow-sm">
                      {item.step}
                    </div>
                  </div>
                  <div className="text-center px-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Pertanyaan Umum</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">Hal yang sering ditanyakan oleh pelanggan kami</p>
        </div>

        <div className="space-y-4">
          {[
            { q: "Berapa lama proses pengerjaan?", a: "Untuk pesanan standar (print dokumen), pengerjaan bisa selesai dalam 1-3 jam tergantung antrian. Pesanan jilid mungkin memakan waktu lebih lama." },
            { q: "Apakah bisa kirim ke luar kota?", a: "Ya, kami melayani pengiriman ke seluruh Indonesia menggunakan ekspedisi terpercaya seperti JNE, J&T, dan SiCepat." },
            { q: "Format file apa yang diterima?", a: "Kami menyarankan format PDF untuk hasil terbaik agar tidak berantakan. Namun kami juga menerima file Word (DOCX) dan Gambar (JPG/PNG)." },
            { q: "Bagaimana jika hasil cetak cacat?", a: "Kami memberikan garansi cetak ulang 100% gratis jika kesalahan berasal dari pihak kami (tinta luntur, kertas rusak, dll)." },
          ].map((faq, idx) => (
            <div key={idx} className="glass-card rounded-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="font-bold text-gray-900 dark:text-white">{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              <div 
                className={`px-6 text-gray-600 dark:text-gray-300 transition-all duration-300 ease-in-out overflow-hidden ${
                  openFaq === idx ? 'max-h-40 py-4 border-t border-gray-100 dark:border-gray-700' : 'max-h-0'
                }`}
              >
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto glass-card rounded-3xl p-12 text-center relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 -z-10" />
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 relative z-10">
            Siap Mencetak Dokumen Anda?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 relative z-10">
            Dapatkan hasil cetak berkualitas dengan harga mahasiswa. Pesan sekarang dan nikmati kemudahannya.
          </p>
          <Link href="/order" className="relative z-10 inline-flex items-center px-10 py-5 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105">
            Buat Pesanan Sekarang
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
