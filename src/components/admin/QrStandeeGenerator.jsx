import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, Download, Sparkles, Coffee, ShieldCheck, Check } from 'lucide-react';

export default function QrStandeeGenerator({ onClose, settings }) {
  const [selectedTable, setSelectedTable] = useState('04');
  const [printAll, setPrintAll] = useState(false);
  const totalTables = settings?.tableCount || 15;

  const tablesList = Array.from({ length: totalTables }, (_, i) =>
    (i + 1).toString().padStart(2, '0')
  );

  const getDinerUrl = (table) => {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?view=diner&table=${table}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative my-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFD000] text-slate-950 flex items-center justify-center text-xl font-bold shadow">
              🖨️
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                Acrylic Table Standee & QR Generator
              </h3>
              <p className="text-xs text-slate-500">
                Ready-to-print A6 table tent cards with dynamic QR codes for each table
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">Preview Table:</span>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-extrabold text-[#1E60FF] text-xs px-2.5 py-1.5 rounded-lg focus:outline-none"
            >
              {tablesList.map((t) => (
                <option key={t} value={t}>
                  Table #{t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-[#1E60FF] hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow glow-blue cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print A6 Standees</span>
            </button>
            <button
              onClick={() => alert('Downloaded ZIP of high-res print SVGs for Tables 01 to 15.')}
              className="border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>SVG Package</span>
            </button>
          </div>
        </div>

        {/* Printable Standee Mockup (Electric Blue & Sunny Yellow Aesthetic) */}
        <div className="flex justify-center p-2">
          <div
            id="printableStandeeCard"
            className="w-full max-w-[320px] rounded-3xl bg-gradient-to-b from-[#1E60FF] via-[#0F47D4] to-slate-950 text-white p-6 shadow-2xl text-center border-4 border-slate-800 relative overflow-hidden"
          >
            {/* Ambient Corner Glows */}
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#FFD000]/25 rounded-full blur-xl"></div>
            <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-blue-400/20 rounded-full blur-xl"></div>

            {/* Brand Logo & Title */}
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#FFD000] text-slate-950 mx-auto flex items-center justify-center text-2xl shadow-lg mb-2">
                ☕
              </div>
              <h4 className="text-xl font-black tracking-tight text-white">
                {settings?.cafeName || 'Brew & Beans'}
              </h4>
              <p className="text-xs text-blue-200">
                {settings?.branch || 'Koregaon Park, Pune'}
              </p>

              {/* Table Pill */}
              <div className="inline-block bg-[#FFD000] text-slate-950 font-black px-5 py-1.5 rounded-full text-sm my-4 shadow-lg glow-yellow tracking-wider">
                TABLE #{selectedTable}
              </div>

              {/* Dynamic QR Code Surface */}
              <div className="bg-white p-3 rounded-2xl inline-block shadow-2xl mx-auto my-1 border-2 border-white/50">
                <QRCodeSVG
                  value={getDinerUrl(selectedTable)}
                  size={150}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%231E60FF'/><text x='50' y='68' font-size='50' text-anchor='middle' fill='%23FFD000'>⚡</text></svg>",
                    x: undefined,
                    y: undefined,
                    height: 28,
                    width: 28,
                    excavate: true,
                  }}
                />
              </div>

              <div className="mt-3">
                <div className="text-xs font-black text-[#FFD000] tracking-wide uppercase">
                  Scan for 10% Off Your Bill 🎁
                </div>
                <p className="text-[11px] text-blue-100 mt-0.5">
                  Point any phone camera • No app install
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-white/15 text-[10px] text-blue-200/80 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#FFD000]" />
                <span>Powered by <strong>PulseQR</strong></span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400 mt-4">
          Scan with your real phone to test live feedback submission on Table #{selectedTable}!
        </div>

      </div>
    </div>
  );
}
