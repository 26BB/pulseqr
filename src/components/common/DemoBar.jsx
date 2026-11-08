import React, { useMemo, memo } from 'react';
import { Smartphone, LayoutDashboard, SplitSquareVertical, Zap, RefreshCw, QrCode } from 'lucide-react';

const DEFAULT_TABLE_COUNT = 15;

// Optimization: Memoize DemoBar to prevent re-rendering when parent App state changes unless props actually change
const DemoBar = memo(function DemoBar({
  currentView,
  onViewChange,
  currentTable,
  onTableChange,
  onSimulateFeedback,
  onResetData,
  alertCount,
  onOpenStandee,
  onOpenDocs,
  tableCount = DEFAULT_TABLE_COUNT,
}) {
  // Optimization: Dynamically compute table options array memoized on tableCount setting
  const tableOptions = useMemo(() => {
    const count = Math.min(100, Math.max(1, Number(tableCount) || DEFAULT_TABLE_COUNT));
    return Array.from({ length: count }, (_, i) => (i + 1).toString().padStart(2, '0'));
  }, [tableCount]);

  return (
    <header className="sticky top-0 z-40 bg-white text-slate-900 border-b border-slate-200 shadow-sm px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Brand & Context */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1E60FF] text-white font-bold flex items-center justify-center text-sm shadow-sm">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-slate-900">PulseQR</span>
              <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                MVP • Variant 1
              </span>
              {alertCount > 0 && (
                <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span>🚨</span> {alertCount} Alert{alertCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-500">Brew & Beans • Lane 5, Koregaon Park, Pune</div>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div role="tablist" aria-label="View switch options" className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            role="tab"
            aria-selected={currentView === 'diner'}
            onClick={() => onViewChange('diner')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E60FF] ${
              currentView === 'diner'
                ? 'bg-white text-[#1E60FF] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Diner Mobile</span>
          </button>
          
          <button
            type="button"
            role="tab"
            aria-selected={currentView === 'admin'}
            onClick={() => onViewChange('admin')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E60FF] ${
              currentView === 'admin'
                ? 'bg-white text-[#1E60FF] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Owner Admin</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={currentView === 'split'}
            onClick={() => onViewChange('split')}
            className={`hidden md:flex px-3 py-1.5 rounded-lg font-semibold items-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E60FF] ${
              currentView === 'split'
                ? 'bg-white text-[#1E60FF] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Side-by-Side</span>
          </button>
        </div>

        {/* Demo Controls */}
        <div className="flex items-center gap-2">
          {/* Table Selector */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
            <label htmlFor="demo-table-select" className="text-[10px] text-slate-500">
              Table:
            </label>
            <select
              id="demo-table-select"
              aria-label="Select demo table number"
              value={currentTable}
              onChange={(e) => onTableChange(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E60FF] rounded cursor-pointer"
            >
              {tableOptions.map((t) => (
                <option key={t} value={t} className="bg-white text-slate-900">
                  #{t}
                </option>
              ))}
            </select>
          </div>

          {/* PM Docs Button */}
          <button
            type="button"
            onClick={onOpenDocs}
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            title="Read PRD, Market Sizing, User Research & GTM Docs"
          >
            <span aria-hidden="true">📚</span>
            <span>PM Docs</span>
          </button>

          {/* Standees Button */}
          <button
            type="button"
            onClick={onOpenStandee}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            title="Generate and print table QR standees"
          >
            <QrCode className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">QR Standees</span>
          </button>

          {/* Simulate Action Button */}
          <button
            type="button"
            onClick={onSimulateFeedback}
            className="bg-[#1E60FF] hover:bg-[#0D4EE8] text-white font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E60FF]"
            title="Simulate a real diner scanning and submitting feedback"
          >
            <Zap className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Simulate Scan</span>
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={onResetData}
            aria-label="Reset data to default seed"
            className="text-slate-600 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            title="Reset data to default seed"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

      </div>
    </header>
  );
});

export default DemoBar;
