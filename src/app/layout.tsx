import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { Providers } from "@/components/Providers";
import { ThemeProvider } from "@/components/ThemeProvider";
import Script from "next/script";
import { config } from "@/lib/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CetakGO - Jasa Print & Fotocopy Online Terpercaya",
  description: "Cetak dokumen anda dari rumah, kami antar sampai tujuan. Cepat, Murah, dan Berkualitas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Midtrans Snap JS - Sandbox */}
        <Script 
          src="https://app.sandbox.midtrans.com/snap/snap.js" 
          data-client-key={config.MIDTRANS_CLIENT_KEY}
          strategy="lazyOnload"
        />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-50`}>
        <Providers>
          <ThemeProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-grow dark:bg-gray-900 transition-colors duration-200">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
