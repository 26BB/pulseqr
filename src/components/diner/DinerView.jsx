import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, ShieldCheck, Copy, Check } from 'lucide-react';

const EMOJIS = [
  { val: 1, symbol: '😡', label: 'Terrible' },
  { val: 2, symbol: '😕', label: 'Poor' },
  { val: 3, symbol: '😐', label: 'Average' },
  { val: 4, symbol: '😊', label: 'Good' },
  { val: 5, symbol: '😍', label: 'Loved it!' },
];

const PRESET_TAGS = [
  'Oat Milk 🥛',
  'Fast Barista ⚡',
  'Flaky Croissant 🥐',
  'High-Speed WiFi 📶',
  'Great Playlist 🎵',
  'AC Cold ❄️',
  'Cold Food ⚠️',
  'Slow Service ⏰',
];

export default function DinerView({ table = '04', onSubmitFeedback, settings }) {
  const [step, setStep] = useState('welcome'); // 'welcome' | 'form' | 'success'
  const [ratings, setRatings] = useState({ food: 5, service: 5, ambiance: 4 });
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState('');
  const [copied, setCopied] = useState(false);
  const [lastSubmissionAlert, setLastSubmissionAlert] = useState(false);

  const handleRating = (category, val) => {
    setRatings((prev) => ({ ...prev, [category]: val }));
  };

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const overall = Number(((ratings.food + ratings.service + ratings.ambiance) / 3).toFixed(1));
    const isAlert =
      ratings.food <= (settings?.alertThreshold || 2) ||
      ratings.service <= (settings?.alertThreshold || 2) ||
      overall <= (settings?.alertThreshold || 2);

    setLastSubmissionAlert(isAlert);

    onSubmitFeedback({
      table,
      ratings,
      comment: comment.trim() || 'Quick emoji feedback submitted.',
      tags: selectedTags.length ? selectedTags : ['Table ' + table + ' ☕'],
      guestName: 'Guest (Table ' + table + ')',
    });

    if (!isAlert) {
      try {
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#FF6B4A', '#FFD700', '#10B981', '#ffffff'],
        });
      } catch (err) {
        console.log('Confetti effect', err);
      }
    }

    setStep('success');
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(settings?.discountCode || 'PULSE10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleReset = () => {
    setStep('welcome');
    setRatings({ food: 5, service: 5, ambiance: 4 });
    setSelectedTags([]);
    setComment('');
    setLastSubmissionAlert(false);
  };

  return (
    <div className="w-full flex justify-center py-4 px-2 sm:px-4">
      {/* Light Clean Device Frame */}
      <div className="w-full max-w-[380px] bg-[#FAF5EE] rounded-[48px] p-3.5 shadow-2xl border-4 border-[#E2D5C7] relative">
        
        {/* Device Speaker & Camera Pill */}
        <div className="w-24 h-4 bg-[#E0D2C2] rounded-full mx-auto mb-2 flex items-center justify-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#C2B29F]"></div>
          <div className="w-8 h-1 rounded-full bg-[#C2B29F]"></div>
        </div>

        {/* Radiant Solar Golden-Orange Background (From Stitch) */}
        <div className="bg-gradient-to-br from-[#FFD700] via-[#FFA726] to-[#FF6B4A] rounded-[36px] overflow-hidden min-h-[600px] p-4 flex flex-col justify-between shadow-inner relative">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between text-xs pb-3 border-b border-white/25">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white text-[#FF6B4A] flex items-center justify-center font-black text-base shadow">
                ☕
              </div>
              <div>
                <span className="font-extrabold tracking-tight block text-sm text-white drop-shadow-xs">
                  {settings?.cafeName || 'Brew & Beans'}
                </span>
                <span className="text-[10px] text-amber-100 font-medium block leading-none">
                  {settings?.branch || 'Koregaon Park, Pune'}
                </span>
              </div>
            </div>

            <div className="bg-white text-[#FF6B4A] font-black px-3 py-1 rounded-full text-xs shadow-sm flex items-center gap-1">
              <span>Table</span>
              <span>#{table}</span>
            </div>
          </div>

          {/* STEP 1: WELCOME SCREEN (Pristine Floating White Card) */}
          {step === 'welcome' && (
            <div className="my-auto py-3">
              <div className="bg-white rounded-[28px] p-5 shadow-xl text-center border border-white/80">
                
                {/* Mascot Icon */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FFF4EE] to-[#FFF9E6] border-2 border-[#FFD0B8] mx-auto flex items-center justify-center text-4xl shadow-md mb-2 animate-bounce-subtle">
                  ☕
                </div>

                <span className="bg-[#FFF4EE] text-[#FF6B4A] font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-[#FF6B4A]/20 uppercase tracking-wide">
                  Takes less than 15 seconds
                </span>

                <h2 className="text-xl font-black text-[#251912] leading-snug mt-2 mb-1.5">
                  How was your experience at {settings?.cafeName || 'Brew & Beans'}?
                </h2>

                <p className="text-xs text-[#6B584F] leading-relaxed mb-4">
                  We'd love to know how your roast, breakfast bites, and vibes were today!
                </p>

                {/* Perk Box */}
                <div className="bg-[#FFF8D6] border-2 border-[#FFD700] rounded-2xl p-3 mb-4 text-left flex items-center gap-3">
                  <div className="text-2xl">🎁</div>
                  <div>
                    <div className="font-extrabold text-xs text-[#7A5700]">Get 10% Off Today's Bill</div>
                    <div className="text-[10px] text-[#9A7400]">Submit 3 quick emoji taps to unlock your instant voucher.</div>
                  </div>
                </div>

                {/* Coral-to-Sunset Button */}
                <button
                  onClick={() => setStep('form')}
                  className="w-full bg-gradient-to-r from-[#FF6B4A] to-[#FF8C00] hover:from-[#FF5530] hover:to-[#FF7700] text-white font-black py-3.5 rounded-full text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-95"
                >
                  <span>Share Your Feedback</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center mt-3">
                <span className="text-[10px] font-bold text-white/95 bg-black/15 backdrop-blur-xs px-3 py-1 rounded-full inline-flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3 text-[#FFD700]" />
                  <span>Instant Web App • No Download or Sign-up Needed</span>
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: FEEDBACK FORM (Pristine White Card) */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="my-auto py-1">
              <div className="bg-white rounded-[28px] p-4 shadow-xl border border-white/80">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="font-black text-xs text-[#251912]">Rate your visit:</span>
                  <span className="bg-[#FFF4EE] text-[#FF6B4A] text-[10px] font-black px-2 py-0.5 rounded-full">
                    Step 2 of 2
                  </span>
                </div>

                {/* Category 1: Food Quality */}
                <div className="mb-2 bg-[#FFFDF9] p-2.5 rounded-2xl border border-[#F0E6DD]">
                  <div className="flex items-center justify-between text-xs font-bold text-[#251912] mb-1.5">
                    <span>Coffee & Food Taste</span>
                    <span className="text-[#FF6B4A] font-black">
                      {ratings.food}/5 {EMOJIS[ratings.food - 1].symbol}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    {EMOJIS.map((e) => (
                      <button
                        key={e.val}
                        type="button"
                        aria-label={e.label}
                        onClick={() => handleRating('food', e.val)}
                        className={`min-w-[44px] min-h-[44px] flex items-center justify-center text-2xl p-1.5 rounded-xl transition-all transform cursor-pointer ${
                          ratings.food === e.val
                            ? 'scale-125 bg-[#FFF4EE] shadow-sm'
                            : 'opacity-65 hover:opacity-100 hover:scale-110'
                        }`}
                        title={e.label}
                      >
                        {e.symbol}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category 2: Service Speed */}
                <div className="mb-2 bg-[#FFFDF9] p-2.5 rounded-2xl border border-[#F0E6DD]">
                  <div className="flex items-center justify-between text-xs font-bold text-[#251912] mb-1.5">
                    <span>Barista Speed & Hospitality</span>
                    <span className="text-[#FF6B4A] font-black">
                      {ratings.service}/5 {EMOJIS[ratings.service - 1].symbol}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    {EMOJIS.map((e) => (
                      <button
                        key={e.val}
                        type="button"
                        aria-label={e.label}
                        onClick={() => handleRating('service', e.val)}
                        className={`min-w-[44px] min-h-[44px] flex items-center justify-center text-2xl p-1.5 rounded-xl transition-all transform cursor-pointer ${
                          ratings.service === e.val
                            ? 'scale-125 bg-[#FFF4EE] shadow-sm'
                            : 'opacity-65 hover:opacity-100 hover:scale-110'
                        }`}
                        title={e.label}
                      >
                        {e.symbol}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category 3: Ambiance */}
                <div className="mb-2 bg-[#FFFDF9] p-2.5 rounded-2xl border border-[#F0E6DD]">
                  <div className="flex items-center justify-between text-xs font-bold text-[#251912] mb-1.5">
                    <span>Vibe, Music & Seating</span>
                    <span className="text-[#FF6B4A] font-black">
                      {ratings.ambiance}/5 {EMOJIS[ratings.ambiance - 1].symbol}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    {EMOJIS.map((e) => (
                      <button
                        key={e.val}
                        type="button"
                        aria-label={e.label}
                        onClick={() => handleRating('ambiance', e.val)}
                        className={`min-w-[44px] min-h-[44px] flex items-center justify-center text-2xl p-1.5 rounded-xl transition-all transform cursor-pointer ${
                          ratings.ambiance === e.val
                            ? 'scale-125 bg-[#FFF4EE] shadow-sm'
                            : 'opacity-65 hover:opacity-100 hover:scale-110'
                        }`}
                        title={e.label}
                      >
                        {e.symbol}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Highlights Chips */}
                <div className="mb-2">
                  <div className="text-[10px] text-[#6B584F] mb-1 font-bold">Quick highlights:</div>
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    {PRESET_TAGS.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleTagToggle(tag)}
                          className={`px-2 py-0.5 rounded-full font-bold transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#FFD700] text-[#251912]'
                              : 'bg-[#FFF4EE] text-[#6B584F] hover:bg-[#FFE8DD]'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Comment */}
                <div className="mb-3">
                  {/* Security: Enforce input length limit to prevent excessive payload / LocalStorage DoS */}
                  <input
                    type="text"
                    maxLength={500}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Optional note for Rohan & team..."
                    className="w-full bg-[#FFFDF9] border border-[#EADFD7] rounded-xl px-3 py-1.5 text-xs text-[#251912] placeholder-[#998A82] focus:outline-none focus:border-[#FF6B4A]"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#FF6B4A] to-[#FF8C00] hover:from-[#FF5530] hover:to-[#FF7700] text-white font-black py-3 rounded-full text-xs transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transform active:scale-95"
                >
                  <span>Submit & Reveal Perk</span>
                  <span>🎁</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS & REWARD */}
          {step === 'success' && (
            <div className="my-auto py-3 text-center">
              <div className="bg-white rounded-[28px] p-5 shadow-xl border border-white/80">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-3xl mb-2 font-black shadow-sm">
                  ✓
                </div>

                <h3 className="text-xl font-black text-[#251912] mb-1">
                  Thank You! 🎉
                </h3>
                <p className="text-xs text-[#6B584F] max-w-[220px] mx-auto mb-4 leading-relaxed">
                  Feedback sent directly to Rohan's live operations dashboard.
                </p>

                {/* Voucher Box */}
                <div className="bg-gradient-to-tr from-[#FFF8D6] to-[#FFF3C2] border-2 border-[#FFD700] rounded-2xl p-4 shadow-sm mb-3">
                  <div className="text-[10px] text-[#7A5700] uppercase font-black tracking-widest">
                    Table #{table} Perk Voucher
                  </div>
                  <div className="text-2xl font-black text-[#FF6B4A] tracking-wider my-1 font-mono">
                    {settings?.discountCode || 'PULSE10'}
                  </div>
                  <div className="text-xs text-emerald-700 font-extrabold mb-2">
                    10% Off On Your Total Bill Today
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="w-full bg-white hover:bg-slate-50 text-[#251912] text-xs font-bold py-2 rounded-xl border border-[#FFD700] transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy Code to Show Server</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Low Rating Alert Notice */}
                {lastSubmissionAlert && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-[11px] text-rose-800 mb-3 text-left">
                    <strong className="font-bold block text-rose-900">⚠️ Instant WhatsApp Alert Dispatched:</strong>
                    Rohan & Floor Lead have been alerted about Table #{table}. We are heading over to make things right!
                  </div>
                )}

                <button
                  onClick={handleReset}
                  className="text-xs text-[#FF6B4A] hover:underline font-bold inline-block p-1 cursor-pointer"
                >
                  Submit another test response
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-2 text-center text-[10px] text-white/95 font-medium border-t border-white/20">
            Powered by <strong>PulseQR</strong> • Koregaon Park, Pune
          </div>

        </div>
      </div>
    </div>
  );
}
