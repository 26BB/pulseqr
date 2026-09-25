import React, { useState, memo } from 'react';
import { X, MessageSquare, Gift, CheckCircle, AlertTriangle, Clock, User, Coffee } from 'lucide-react';

// Optimization: Memoize FeedbackDetailModal to prevent unnecessary re-renders when parent state updates while viewing modal details
const FeedbackDetailModal = memo(function FeedbackDetailModal({ feedback, onClose, onResolve, settings }) {
  const [note, setNote] = useState('');
  if (!feedback) return null;
  const isAlert = feedback.isAlert && feedback.status !== 'RESOLVED';

  // Generate personalized WhatsApp recovery link
  const defaultWhatsAppText = `Hi ${feedback.guestName || 'there'}! This is ${
    settings?.ownerName || 'Rohan'
  } from ${settings?.cafeName || 'Brew & Beans'}. I noticed your feedback on Table ${
    feedback.table
  }. We sincerely apologize that your experience wasn't up to standard today. We'd love to comp your bill and have a fresh treat brought to your table right away!`;

  const handleWhatsAppClick = () => {
    const encoded = encodeURIComponent(defaultWhatsAppText);
    let phoneDigits = (settings?.ownerPhone || '+919823012345').replace(/\D/g, '');
    if (!phoneDigits) {
      phoneDigits = '919823012345';
    } else if (phoneDigits.length === 10) {
      phoneDigits = '91' + phoneDigits;
    }
    window.open(`https://wa.me/${phoneDigits}?text=${encoded}`, '_blank', 'noopener,noreferrer');
    onResolve(feedback.id, 'RESOLVED', 'Contacted guest via WhatsApp');
  };

  const handleCompVoucher = () => {
    onResolve(feedback.id, 'RESOLVED', `₹150 Comp voucher issued directly to Table ${feedback.table}`);
  };

  const handleDirectResolve = () => {
    onResolve(feedback.id, 'RESOLVED', note || 'Addressed on floor with staff');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title / Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg ${
              isAlert ? 'bg-rose-100 text-rose-600' : 'bg-[#1E60FF]/10 text-[#1E60FF]'
            }`}
          >
            {isAlert ? <AlertTriangle className="w-5 h-5" /> : <Coffee className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                Feedback Details • Table #{feedback.table}
              </h3>
              {isAlert && (
                <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                  NEEDS ATTENTION
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {feedback.displayTime}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" /> Barista: {feedback.barista || 'Pranav'}
              </span>
            </div>
          </div>
        </div>

        {/* Ratings Breakdown Grid */}
        <div className="grid grid-cols-3 gap-2.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 mb-4 text-center">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Food</div>
            <div className="text-lg font-black text-slate-800 dark:text-slate-100">
              {feedback.ratings.food}★
            </div>
          </div>
          <div className="border-x border-slate-200 dark:border-slate-700">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Service</div>
            <div className="text-lg font-black text-slate-800 dark:text-slate-100">
              {feedback.ratings.service}★
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Ambiance</div>
            <div className="text-lg font-black text-slate-800 dark:text-slate-100">
              {feedback.ratings.ambiance}★
            </div>
          </div>
        </div>

        {/* Customer Comment Quote */}
        <div className="mb-4">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Customer Comment:
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 italic leading-relaxed">
            "{feedback.comment}"
          </div>
        </div>

        {/* Tags */}
        {feedback.tags && feedback.tags.length > 0 && (
          <div className="mb-4">
            <div className="text-[11px] font-bold text-slate-500 mb-1.5">Submitted Tags:</div>
            <div className="flex flex-wrap gap-1.5">
              {feedback.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="bg-blue-50 dark:bg-blue-950/40 text-[#1E60FF] border border-blue-200 dark:border-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Existing Resolution Note if any */}
        {feedback.status === 'RESOLVED' && (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-3 mb-4 text-xs text-emerald-800 dark:text-emerald-300">
            <strong className="block font-bold">✓ Incident Resolved</strong>
            <p className="mt-0.5">{feedback.resolutionNote || 'Marked as resolved by manager.'}</p>
          </div>
        )}

        {/* Alert Damage Control Actions */}
        {feedback.status !== 'RESOLVED' && (
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-800 dark:text-white">
              Instant Founder's Office / Manager Actions:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={handleWhatsAppClick}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Damage Control WhatsApp</span>
              </button>

              <button
                onClick={handleCompVoucher}
                className="bg-[#1E60FF] hover:bg-blue-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Issue ₹150 Comp Perk</span>
              </button>
            </div>

            {/* Direct Note & Resolve */}
            <div className="flex gap-2">
              {/* Security: Enforce input length limit (maxLength) to prevent LocalStorage DoS / bloat */}
              <input
                type="text"
                maxLength={500}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional resolution note (e.g. Swapped coffee, apologized)"
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1E60FF]"
              />
              <button
                onClick={handleDirectResolve}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mark Resolved</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
});

export default FeedbackDetailModal;
