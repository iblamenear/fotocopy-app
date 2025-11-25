"use client";

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Settings, ShoppingCart, Check, Loader2, Plus, Image as ImageIcon, FileType, Trash2, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface UploadedFile {
  id: string;
  file: File;
  pageCount: number;
  isCounting: boolean;
}

export default function OrderPage() {
  const { addItem } = useCart();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  // Service Type
  const [serviceType, setServiceType] = useState<'print' | 'laminating' | 'binding' | 'photo'>('print');

  // Print Settings
  const [color, setColor] = useState<'bw' | 'color'>('bw');
  const [paperSize, setPaperSize] = useState<'A4' | 'F4' | 'A3' | 'A5' | '4R' | '10R' | '3x4'>('A4');
  const [binding, setBinding] = useState<'none' | 'staples' | 'softcover' | 'hardcover'>('none');
  const [copies, setCopies] = useState(1);

  const countPdfPages = async (file: File): Promise<number> => {
    try {
      // Dynamically import pdfjs-dist to avoid SSR issues
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      return pdf.numPages;
    } catch (error: any) {
      console.error('Error counting pages:', error);
      alert(`Gagal membaca jumlah halaman PDF ${file.name}: ${error.message}. Diasumsikan 1 halaman.`);
      return 1;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      pageCount: 0,
      isCounting: file.type === 'application/pdf'
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Process PDF page counting
    for (const fileObj of newFiles) {
      if (fileObj.file.type === 'application/pdf') {
        countPdfPages(fileObj.file).then(pages => {
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileObj.id ? { ...f, pageCount: pages, isCounting: false } : f
          ));
        });
      } else {
        // For non-PDFs, default to 1
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, pageCount: 1, isCounting: false } : f
        ));
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    // maxFiles removed to allow multiple
  });

  // Reset defaults when service type changes
  useEffect(() => {
    if (serviceType === 'photo') {
      setPaperSize('4R');
      setColor('color');
      setBinding('none');
    } else if (serviceType === 'print') {
      setPaperSize('A4');
    }
  }, [serviceType]);

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const calculatePricePerFile = (pages: number) => {
    let price = 0;
    const pageCount = pages > 0 ? pages : 1;

    if (serviceType === 'print') {
      // Base price per page
      let basePrice = 0;
      if (paperSize === 'A4') basePrice = color === 'bw' ? 500 : 1500;
      if (paperSize === 'A5') basePrice = color === 'bw' ? 300 : 1000;
      if (paperSize === 'F4') basePrice = color === 'bw' ? 600 : 1700;
      if (paperSize === 'A3') basePrice = color === 'bw' ? 1500 : 3000;

      price = basePrice * pageCount * copies;

      // Binding cost
      if (binding === 'staples') price += 2000;
      if (binding === 'softcover') price += 15000;
      if (binding === 'hardcover') price += 35000;
    } else if (serviceType === 'laminating') {
      const laminatingPrice = paperSize === 'A3' ? 10000 : 5000;
      price = laminatingPrice * pageCount * copies;
    } else if (serviceType === 'binding') {
      if (binding === 'staples') price += 5000;
      if (binding === 'softcover') price += 20000;
      if (binding === 'hardcover') price += 40000;
      price = price * copies;
    } else if (serviceType === 'photo') {
      let photoPrice = 0;
      if (paperSize === '3x4') photoPrice = 1000;
      if (paperSize === '4R') photoPrice = 3000;
      if (paperSize === '10R') photoPrice = 15000;
      if (paperSize === 'A4') photoPrice = 10000; // A4 Photo Paper
      
      price = photoPrice * pageCount * copies;
    }

    return price;
  };

  const calculateTotalPrice = () => {
    return uploadedFiles.reduce((total, file) => {
      return total + calculatePricePerFile(file.pageCount);
    }, 0);
  };

  const handleAddToCart = () => {
    if (uploadedFiles.length > 0) {
      uploadedFiles.forEach(fileObj => {
        addItem({
          id: Math.random().toString(36).substr(2, 9),
          file: fileObj.file,
          fileName: fileObj.file.name,
          fileSize: (fileObj.file.size / 1024 / 1024).toFixed(2) + ' MB',
          pageCount: fileObj.pageCount,
          serviceType,
          settings: {
            color,
            paperSize,
            copies,
            binding
          },
          price: calculatePricePerFile(fileObj.pageCount)
        });
      });
      
      // Reset form
      setUploadedFiles([]);
      setCopies(1);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText className="h-8 w-8 text-red-500" />;
    if (['doc', 'docx'].includes(ext || '')) return <FileText className="h-8 w-8 text-blue-500" />;
    if (['jpg', 'jpeg', 'png'].includes(ext || '')) return <ImageIcon className="h-8 w-8 text-purple-500" />;
    return <FileType className="h-8 w-8 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-mesh pt-28 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Upload Dokumen</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Silakan upload file dokumen atau foto Anda di bawah ini, lalu atur spesifikasi cetak sesuai kebutuhan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Upload & Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dropzone */}
            <div 
              {...getRootProps()} 
              className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center cursor-pointer transition-all duration-300 overflow-hidden group
                ${isDragActive 
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 scale-[1.02] shadow-2xl' 
                  : 'glass-card border-gray-300/50 dark:border-gray-700/50 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl hover:scale-[1.01]'
                }`}
            >
              <input {...getInputProps()} />
              
              {/* Animated Background Elements */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <Upload className={`h-10 w-10 text-blue-600 dark:text-blue-400 ${isDragActive ? 'animate-bounce' : ''}`} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {isDragActive ? 'Lepaskan file di sini...' : 'Drag & Drop file di sini'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                Atau klik area ini untuk memilih file dari perangkat Anda. Mendukung PDF, Word, JPG, dan PNG.
              </p>
              
              <div className="flex flex-wrap justify-center gap-3">
                {['PDF', 'DOCX', 'JPG', 'PNG'].map((ext) => (
                  <span key={ext} className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 shadow-sm">
                    {ext}
                  </span>
                ))}
              </div>
            </div>

            {/* File List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-4 animate-slide-up">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">File yang Diupload</h3>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold">
                    {uploadedFiles.length} File
                  </span>
                </div>
                
                <div className="grid gap-4">
                  {uploadedFiles.map((fileObj) => (
                    <div key={fileObj.id} className="glass-card p-4 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-700 group">
                      <div className="flex items-center gap-5 overflow-hidden">
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-300">
                          {getFileIcon(fileObj.file.name)}
                        </div>
                        <div className="min-w-0 flex-1 mr-2">
                          <p className="font-bold text-gray-900 dark:text-white truncate text-sm sm:text-base">{fileObj.file.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                              {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                            {fileObj.isCounting ? (
                              <span className="flex items-center text-xs text-blue-600 dark:text-blue-400 font-medium">
                                <Loader2 className="h-3 w-3 animate-spin mr-1" /> Menghitung...
                              </span>
                            ) : (
                              <span className="flex items-center text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded">
                                <Check className="h-3 w-3 mr-1" /> {fileObj.pageCount} Halaman
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeFile(fileObj.id); }} 
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        title="Hapus File"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {uploadedFiles.length === 0 && (
              <div className="text-center py-12 opacity-50">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">Belum ada file yang diupload</p>
              </div>
            )}
          </div>
        
          {/* Right Column: Configuration */}
          <div>
            <div className="glass-card p-6 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 sticky top-24 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <Settings className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Konfigurasi</h2>
              </div>

              {/* Service Type Selection */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">Jenis Layanan</label>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                  {(['print', 'laminating', 'binding', 'photo'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setServiceType(type)}
                      className={`py-3 px-2 text-sm font-medium rounded-xl capitalize transition-all duration-300 border ${
                        serviceType === type 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-[1.02]' 
                          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {type === 'print' ? 'Print / FC' : type === 'binding' ? 'Jilid Saja' : type === 'photo' ? 'Cetak Foto' : type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {/* Options based on Service Type */}
                
                {serviceType !== 'binding' && (
                  <div className="grid grid-cols-2 gap-4">
                    {serviceType !== 'photo' && (
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase">Warna</label>
                        <div className="relative">
                          <select 
                            value={color} 
                            onChange={(e) => setColor(e.target.value as any)}
                            className="w-full appearance-none rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                          >
                            <option value="bw">Hitam Putih</option>
                            <option value="color">Berwarna</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className={serviceType === 'photo' ? 'col-span-2' : 'col-span-2 sm:col-span-1'}>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase">Ukuran Kertas</label>
                      <div className="relative">
                        <select 
                          value={paperSize}
                          onChange={(e) => setPaperSize(e.target.value as any)}
                          className="w-full appearance-none rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                        >
                          {serviceType === 'photo' ? (
                            <>
                              <option value="3x4">3x4 cm</option>
                              <option value="4R">4R (10x15 cm)</option>
                              <option value="10R">10R (20x25 cm)</option>
                              <option value="A4">A4 Photo Paper</option>
                            </>
                          ) : (
                            <>
                              <option value="A4">A4</option>
                              <option value="A5">A5</option>
                              <option value="F4">F4 (Folio)</option>
                              <option value="A3">A3</option>
                            </>
                          )}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(serviceType === 'print' || serviceType === 'binding') && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase">Jilid / Finishing</label>
                    <div className="relative">
                      <select 
                        value={binding}
                        onChange={(e) => setBinding(e.target.value as any)}
                        className="w-full appearance-none rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                      >
                        <option value="none">Tanpa Jilid</option>
                        <option value="staples">Staples (+Rp 2.000)</option>
                        <option value="softcover">Soft Cover (+Rp 15.000)</option>
                        <option value="hardcover">Hard Cover (+Rp 35.000)</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase">Jumlah Rangkap (Copies)</label>
                  <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 overflow-hidden">
                    <button 
                      onClick={() => setCopies(Math.max(1, copies - 1))}
                      className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      min="1" 
                      value={copies}
                      onChange={(e) => setCopies(parseInt(e.target.value) || 1)}
                      className="w-full text-center border-none focus:ring-0 text-gray-900 dark:text-white bg-transparent p-2 font-bold"
                    />
                    <button 
                      onClick={() => setCopies(copies + 1)}
                      className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Estimasi Total</span>
                  <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
                    Rp {calculateTotalPrice().toLocaleString('id-ID')}
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={uploadedFiles.length === 0}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 transform ${
                    uploadedFiles.length > 0
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02]' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-6 w-6" />
                  Tambah ke Keranjang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
