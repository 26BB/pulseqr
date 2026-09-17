import React, { useState, useMemo, useCallback, memo } from 'react';
import AnalyticsView from './AnalyticsView';
import SettingsView from './SettingsView';
import FeedbackDetailModal from './FeedbackDetailModal';
import {
  Activity,
  BarChart3,
  Settings,
  ArrowUpRight,
  CheckCircle,
  QrCode,
} from 'lucide-react';

// Optimization: Memoize AdminDashboard to prevent re-rendering when parent App re-renders (e.g. table parameter change, modal toggles) unless props change
const AdminDashboard = memo(function AdminDashboard({
  feedbacks,
  settings,
  onResolveFeedback,
  onSaveSettings,
  onResetData,
  onOpenStandees,
}) {
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'analytics' | 'settings'
  const [filter, setFilter] = useState('all'); // 'all' | 'alert' | '5star'
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Optimization: Single-pass O(N) calculation for dashboard statistics.
  // Combines 3 separate array traversals (.filter, .reduce, .filter) and avoids intermediate array allocations.
  const { total, pendingAlerts, avgRating, totalAlertsCount } = useMemo(() => {
    const totalCount = feedbacks.length;
    if (!totalCount) {
      return { total: 0, pendingAlerts: 0, avgRating: '0.0', totalAlertsCount: 0 };
    }

    let pending = 0;
    let alerts = 0;
    let scoreSum = 0;

    for (let i = 0; i < totalCount; i++) {
      const f = feedbacks[i];
      scoreSum += f.overallScore || 0;
      if (f.isAlert) {
        alerts++;
        if (f.status === 'ALERT_TRIGGERED') {
          pending++;
        }
      }
    }

    return {
      total: totalCount,
      pendingAlerts: pending,
      avgRating: (scoreSum / totalCount).toFixed(1),
      totalAlertsCount: alerts,
    };
  }, [feedbacks]);

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((f) => {
      if (filter === 'alert') return f.isAlert;
      if (filter === '5star') return f.overallScore >= 4.5;
      return true;
    });
  }, [feedbacks, filter]);

  // Optimization: Memoize feedback selection callback so FeedbackCard child components don't re-render when parent state changes
  const handleSelectFeedback = useCallback((fb) => {
    setSelectedFeedback(fb);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      
      {/* Top Header: Stitch "Good Morning, Rohan!" Bar */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4A90FF] to-blue-600 text-white flex items-center justify-center text-2xl font-black shadow-md">
            ☕
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>Good Morning, {settings?.ownerName?.split(' ')[0] || 'Rohan'}!</span>
                <span className="text-2xl">☕</span>
              </h2>
              <span className="bg-blue-50 text-[#4A90FF] text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                {settings?.branch || 'Koregaon Park, Pune'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Operations Lead: <strong className="text-slate-700">{settings?.ownerName || 'Rohan Kulkarni'}</strong> • Auto WhatsApp Damage Control Active
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('live')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'live'
                ? 'bg-[#4A90FF] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live Operations</span>
            {pendingAlerts > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-[#4A90FF] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>AARRR Funnel</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#4A90FF] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Cafe Settings</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: LIVE OPERATIONS */}
      {activeTab === 'live' && (
        <div className="space-y-6">
          
          {/* 4 VIBRANT CHROMATIC TILES (Directly from Stitch "Cafe Pulse" Design System) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Tile 1: Vibrant Blue (#4A90FF) */}
            <div className="bg-gradient-to-br from-[#4A90FF] to-[#2563EB] text-white rounded-3xl p-5 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-100">
                  Today's Feedbacks
                </span>
                <span className="w-7 h-7 rounded-xl bg-white/20 text-white flex items-center justify-center text-xs font-bold">
                  📊
                </span>
              </div>
              <div className="text-3xl font-black">{total}</div>
              <div className="text-xs text-blue-100 font-bold mt-2 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+18% vs yesterday</span>
              </div>
            </div>

            {/* Tile 2: Fresh Emerald (#10B981 / #34D399) */}
            <div className="bg-gradient-to-br from-[#10B981] to-[#059669] text-white rounded-3xl p-5 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-100">
                  Overall Avg Rating
                </span>
                <span className="w-7 h-7 rounded-xl bg-white/20 text-white flex items-center justify-center text-xs font-bold">
                  ★
                </span>
              </div>
              <div className="text-3xl font-black flex items-center gap-1.5">
                <span>{avgRating}</span>
                <span className="text-yellow-300 text-xl">★</span>
              </div>
              <div className="text-xs text-emerald-100 font-bold mt-2">
                Very Good • 92% Positive
              </div>
            </div>

            {/* Tile 3: Coral Red (#FF6B6B / #EF4444) */}
            <div
              className={`rounded-3xl p-5 text-white shadow-md relative overflow-hidden transition-all ${
                pendingAlerts > 0
                  ? 'bg-gradient-to-br from-[#FF6B6B] to-[#EF4444] animate-pulse ring-4 ring-rose-200'
                  : 'bg-gradient-to-br from-[#FF8C8C] to-[#F87171]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-rose-100">
                  Negative Alerts
                </span>
                <span className="w-7 h-7 rounded-xl bg-white/20 text-white flex items-center justify-center text-xs font-bold">
                  ⚠️
                </span>
              </div>
              <div className="text-3xl font-black">{pendingAlerts}</div>
              <div className="text-xs text-rose-100 font-bold mt-2 flex items-center gap-1">
                {pendingAlerts > 0 ? (
                  <span>Action Needed On Floor 🚩</span>
                ) : (
                  <span>Zero Pending Alerts ✨</span>
                )}
              </div>
            </div>

            {/* Tile 4: Violet Purple (#8B5CF6 / #7C3AED) */}
            <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] text-white rounded-3xl p-5 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-purple-100">
                  Completion Rate
                </span>
                <span className="w-7 h-7 rounded-xl bg-white/20 text-white flex items-center justify-center text-xs font-bold">
                  ⚡
                </span>
              </div>
              <div className="text-3xl font-black">78%</div>
              <div className="text-xs text-purple-100 font-medium mt-2">
                ~50 scans / table / week
              </div>
            </div>

          </div>

          {/* 2-Column Operational Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 8 Cols: Live Stream */}
            <div className="lg:col-span-8 bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col">
              
              {/* Header & Filter Pills */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm uppercase tracking-wider text-slate-900">
                    Live Table Feedback Stream
                  </h3>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                      filter === 'all'
                        ? 'bg-[#4A90FF] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All ({feedbacks.length})
                  </button>

                  <button
                    onClick={() => setFilter('alert')}
                    className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                      filter === 'alert'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Alerts ({totalAlertsCount})
                  </button>

                  <button
                    onClick={() => setFilter('5star')}
                    className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                      filter === '5star'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    5★ Praises
                  </button>
                </div>
              </div>

              {/* Feed Items */}
              <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                {filteredFeedbacks.map((fb) => (
                  <FeedbackCard
                    key={fb.id}
                    fb={fb}
                    onSelect={handleSelectFeedback}
                  />
                ))}
              </div>

            </div>

            {/* Right 4 Cols: Stitch Donut Breakdown & Standees */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Category Breakdown Donut Card from Stitch */}
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm">
                <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider mb-3">
                  Category Breakdown
                </h4>

                <div className="flex items-center gap-4 py-2">
                  <div className="relative w-28 h-28 shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#F1F5F9" strokeWidth="4"></circle>
                      <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#4A90FF" strokeWidth="4.5" strokeDasharray="45 55" strokeDashoffset="0"></circle>
                      <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10B981" strokeWidth="4.5" strokeDasharray="35 65" strokeDashoffset="-45"></circle>
                      <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#FF6B6B" strokeWidth="4.5" strokeDasharray="20 80" strokeDashoffset="-80"></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-sm font-black text-slate-900">{avgRating}★</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Overall</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs flex-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#4A90FF]"></span> Food
                      </span>
                      <span className="font-black text-[#4A90FF]">4.4★ (45%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span> Service
                      </span>
                      <span className="font-black text-[#10B981]">4.6★ (35%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B]"></span> Ambiance
                      </span>
                      <span className="font-black text-[#FF6B6B]">3.8★ (20%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Standees Promotion Card */}
              <div className="bg-gradient-to-br from-[#FFD700] via-[#FFA726] to-[#FF8C00] text-slate-950 rounded-3xl p-5 shadow-md">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-2xl">🖨️</span>
                  <h4 className="font-black text-sm uppercase tracking-wider">
                    Acrylic Standees Generator
                  </h4>
                </div>
                <p className="text-xs text-slate-900/90 mb-4 leading-relaxed font-medium">
                  Generate high-res A6 acrylic standees with scannable QR codes for Tables 01–{settings?.tableCount || 15}.
                </p>
                <button
                  onClick={onOpenStandees}
                  className="w-full bg-slate-950 hover:bg-slate-800 text-white font-black py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-[#FFD700]" />
                  <span>Open Standee Generator</span>
                </button>
              </div>

              {/* Damage Control Status Box */}
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm">
                <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider mb-2">
                  Damage Control Status
                </h4>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Target Phone:</span>
                    <span className="font-mono font-bold text-slate-900">{settings?.ownerPhone || '+91 98230 12345'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Threshold:</span>
                    <span className="font-bold text-rose-600">Ratings ≤ {settings?.alertThreshold || 2} Stars</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: AARRR FUNNEL & ANALYTICS */}
      {activeTab === 'analytics' && <AnalyticsView feedbacks={feedbacks} />}

      {/* VIEW 3: CAFE SETTINGS */}
      {activeTab === 'settings' && (
        <SettingsView
          settings={settings}
          onSaveSettings={onSaveSettings}
          onResetData={onResetData}
        />
      )}

      {/* Feedback Detail Modal */}
      {selectedFeedback && (
        <FeedbackDetailModal
          feedback={selectedFeedback}
          settings={settings}
          onClose={() => setSelectedFeedback(null)}
          onResolve={(id, newStatus, note) => {
            onResolveFeedback(id, newStatus, note);
            setSelectedFeedback(null);
          }}
        />
      )}

    </div>
  );
});

export default AdminDashboard;

// Optimization: Memoize FeedbackCard component to prevent unnecessary re-renders of list items when parent tab or modal states change
const FeedbackCard = React.memo(function FeedbackCard({ fb, onSelect }) {
  const isPendingAlert = fb.isAlert && fb.status === 'ALERT_TRIGGERED';
  return (
    <div
      onClick={() => onSelect(fb)}
      className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
        isPendingAlert
          ? 'bg-rose-50/90 border-rose-300 ring-2 ring-rose-200'
          : 'bg-slate-50/80 border-slate-200 hover:border-[#4A90FF]/50'
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span
            className={`font-black px-2.5 py-0.5 rounded-lg text-xs ${
              isPendingAlert
                ? 'bg-rose-600 text-white'
                : 'bg-slate-900 text-white'
            }`}
          >
            Table #{fb.table}
          </span>
          <span className="text-xs text-slate-400">• {fb.displayTime}</span>
          <span
            className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
              fb.overallScore >= 4.5
                ? 'bg-emerald-100 text-emerald-800'
                : fb.overallScore >= 3.0
                ? 'bg-blue-100 text-blue-800'
                : 'bg-rose-100 text-rose-700'
            }`}
          >
            {fb.overallScore >= 4.5 ? '😍' : fb.overallScore >= 3 ? '😊' : '😡'}{' '}
            {fb.overallScore}★
          </span>
        </div>

        <div>
          {isPendingAlert ? (
            <span className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs px-3 py-1 rounded-lg flex items-center gap-1 shadow animate-pulse">
              <span>🚩</span>
              <span>Damage Control</span>
            </span>
          ) : fb.status === 'RESOLVED' ? (
            <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Resolved</span>
            </span>
          ) : (
            <span className="text-slate-400 text-xs">View Details →</span>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-800 mb-2 leading-relaxed font-normal">
        "{fb.comment}"
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-[11px]">
        <div className="flex flex-wrap gap-1">
          {fb.tags?.map((t, idx) => (
            <span
              key={idx}
              className="bg-white text-slate-600 px-2 py-0.5 rounded-md border border-slate-200 font-medium"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="text-slate-400">
          Barista: <strong className="text-slate-700">{fb.barista || 'Pranav'}</strong>
        </div>
      </div>
    </div>
  );
});
