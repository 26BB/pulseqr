import React from 'react';
import { Smartphone, LayoutDashboard, SplitSquareVertical, Zap, RefreshCw, QrCode } from 'lucide-react';

// Optimization: Static array hoisted outside component to prevent array allocation on every render
const TABLE_OPTIONS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15'];

export default function DemoBar({
  currentView,
  onViewChange,
  currentTable,
  onTableChange,
  onSimulateFeedback,
  onResetData,
  alertCount,
  onOpenStandee,
  onOpenDocs,
}) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Brand & Context */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1E60FF] text-[#FFD000] font-black flex items-center justify-center text-base shadow-sm">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-white">PulseQR</span>
              <span className="bg-[#FFD000] text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                MVP • Variant 1
              </span>
              {alertCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  <span>🚨</span> {alertCount} Alert{alertCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400">Brew & Beans • Lane 5, Koregaon Park, Pune</div>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => onViewChange('diner')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentView === 'diner'
                ? 'bg-[#1E60FF] text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Diner Mobile</span>
          </button>
          
          <button
            onClick={() => onViewChange('admin')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentView === 'admin'
                ? 'bg-[#1E60FF] text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Owner Admin</span>
          </button>

          <button
            onClick={() => onViewChange('split')}
            className={`hidden md:flex px-3 py-1.5 rounded-lg font-bold items-center gap-1.5 transition-all cursor-pointer ${
              currentView === 'split'
                ? 'bg-[#1E60FF] text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>
        </div>

        {/* Demo Controls */}
        <div className="flex items-center gap-2">
          {/* Table Selector */}
          <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1">
            <span className="text-[10px] text-slate-400">Table:</span>
            <select
              value={currentTable}
              onChange={(e) => onTableChange(e.target.value)}
              className="bg-transparent font-bold text-[#FFD000] text-xs focus:outline-none cursor-pointer"
            >
              {TABLE_OPTIONS.map((t) => (
                <option key={t} value={t} className="bg-slate-900 text-white">
                  #{t}
                </option>
              ))}
            </select>
          </div>

          {/* PM Docs Button */}
          <button
            onClick={onOpenDocs}
            className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8C00] hover:from-[#FF5530] hover:to-[#FF7700] text-white font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow cursor-pointer"
            title="Read PRD, Market Sizing, User Research & GTM Docs"
          >
            <span>📚</span>
            <span>PM Docs</span>
          </button>

          {/* Standees Button */}
          <button
            onClick={onOpenStandee}
            className="bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
            title="Generate and print table QR standees"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">QR Standees</span>
          </button>

          {/* Simulate Action Button */}
          <button
            onClick={onSimulateFeedback}
            className="bg-[#FFD000] hover:bg-[#ECC000] text-slate-950 font-black px-3 py-1.5 rounded-lg flex items-center gap-1 shadow transition-all cursor-pointer"
            title="Simulate a real diner scanning and submitting feedback"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate Scan</span>
          </button>

          {/* Reset */}
          <button
            onClick={onResetData}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Reset data to default seed"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
}
