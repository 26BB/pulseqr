import React from 'react';
import { FUNNEL_STATS, POPULAR_TAGS, BARISTAS } from '../../data/mockData';
import { Star } from 'lucide-react';

export default function AnalyticsView({ feedbacks }) {
  const total = feedbacks.length;
  const avgFood = (
    feedbacks.reduce((acc, f) => acc + f.ratings.food, 0) / total || 4.4
  ).toFixed(1);
  const avgService = (
    feedbacks.reduce((acc, f) => acc + f.ratings.service, 0) / total || 4.6
  ).toFixed(1);
  const avgAmbiance = (
    feedbacks.reduce((acc, f) => acc + f.ratings.ambiance, 0) / total || 3.8
  ).toFixed(1);

  return (
    <div className="space-y-6">
      
      {/* 1. AARRR Conversion Funnel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              AARRR Diner Experience Funnel (Last 30 Days)
            </h3>
            <p className="text-xs text-slate-500">
              Drop-off visualization from physical table QR scan to completed feedback
            </p>
          </div>
          <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
            47.4% Net Completion
          </span>
        </div>

        {/* Funnel Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-2xl p-4 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Step 1: Scanned QR</div>
            <div className="text-2xl font-black text-[#1E60FF] mt-1">{FUNNEL_STATS.scans}</div>
            <div className="text-[10px] text-slate-500 mt-1">100% Base Scans</div>
          </div>

          <div className="bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-2xl p-4 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Step 2: Opened Form</div>
            <div className="text-2xl font-black text-slate-800 dark:text-white mt-1">{FUNNEL_STATS.opens}</div>
            <div className="text-[10px] text-emerald-600 font-bold mt-1">71.0% Open Rate</div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 rounded-2xl p-4 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Step 3: Rated Emojis</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">{FUNNEL_STATS.submissions}</div>
            <div className="text-[10px] text-emerald-600 font-bold mt-1">66.7% Submitted</div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-2xl p-4 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Step 4: Added Comment</div>
            <div className="text-2xl font-black text-amber-600 mt-1">{FUNNEL_STATS.withComments}</div>
            <div className="text-[10px] text-amber-700 font-bold mt-1">46.8% High Signal</div>
          </div>

        </div>
      </div>

      {/* 2. Category Performance & Baristas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-3">
            Category Breakdown Scores
          </h4>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Coffee & Food Quality</span>
                <span className="text-[#1E60FF]">{avgFood} / 5.0 ★</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#1E60FF] h-full rounded-full transition-all duration-500"
                  style={{ width: `${(avgFood / 5) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Service Speed & Barista Hospitality</span>
                <span className="text-emerald-600">{avgService} / 5.0 ★</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(avgService / 5) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Vibe & Music Ambiance</span>
                <span className="text-amber-500">{avgAmbiance} / 5.0 ★</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(avgAmbiance / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Baristas Leaderboard */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-3">
            On-Shift Barista Hospitality Scores
          </h4>

          <div className="space-y-2.5">
            {BARISTAS.map((b, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#1E60FF] flex items-center justify-center font-bold text-xs">
                    #{i + 1}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <span>{b.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{b.badge}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">{b.count} tables served today</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-emerald-600 flex items-center gap-0.5 justify-end">
                    <span>{b.rating}</span>
                    <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                  </div>
                  <div className="text-[10px] text-slate-400">Hospitality Avg</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Sentiment Tag Cloud */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">
          Keyword Sentiment Cloud
        </h4>
        <p className="text-xs text-slate-500 mb-3">
          Most frequent phrases extracted from Pune diner reviews
        </p>

        <div className="flex flex-wrap gap-2">
          {POPULAR_TAGS.map((t, i) => {
            const isPos = t.type === 'positive';
            return (
              <span
                key={i}
                className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                  isPos
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                }`}
              >
                <span>{t.name}</span>
                <span className="text-[10px] opacity-70">({t.count})</span>
              </span>
            );
          })}
        </div>
      </div>

    </div>
  );
}
