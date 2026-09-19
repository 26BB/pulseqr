import React, { useState, memo } from 'react';
import { Save, MessageSquare, ShieldAlert, Coffee, RotateCcw, Check } from 'lucide-react';

// Optimization: Memoize SettingsView to prevent re-renders when parent state (e.g., feedbacks) updates while settings tab is active
const SettingsView = memo(function SettingsView({ settings, onSaveSettings, onResetData }) {
  const [formData, setFormData] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTestAlert = () => {
    alert(
      `🚨 TEST WHATSAPP DISPATCHED to ${formData.ownerPhone || '+91 98230 12345'}:\n\n` +
      `"PulseQR Alert: Table 12 submitted 1.5★ rating. Customer reported 'Cold food and slow order'. Intercept immediately before Zomato review!"`
    );
  };

  return (
    <div className="max-w-3xl space-y-6">
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 1. Cafe Profile */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Coffee className="w-5 h-5 text-[#1E60FF]" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Cafe & Outlet Profile
            </h3>
          </div>

          {/* Security: Enforce frontend input length limits (maxLength) to prevent LocalStorage DoS / bloat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Cafe Brand Name
              </label>
              <input
                type="text"
                maxLength={100}
                value={formData.cafeName}
                onChange={(e) => handleChange('cafeName', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1E60FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Branch / Area in Pune
              </label>
              <input
                type="text"
                maxLength={100}
                value={formData.branch}
                onChange={(e) => handleChange('branch', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1E60FF]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Address
              </label>
              <input
                type="text"
                maxLength={200}
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1E60FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Founder / Floor Manager Name
              </label>
              <input
                type="text"
                maxLength={100}
                value={formData.ownerName}
                onChange={(e) => handleChange('ownerName', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1E60FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Active Table Standees Count
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.tableCount}
                onChange={(e) => handleChange('tableCount', Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1E60FF]"
              />
            </div>
          </div>
        </div>

        {/* 2. WhatsApp Instant Alert Settings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                WhatsApp Damage Control Automation
              </h3>
              <p className="text-xs text-slate-500">
                Intercept negative ratings in real time before they reach Google Reviews or Zomato
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Manager WhatsApp Alert Number
                </label>
                <input
                  type="text"
                  maxLength={30}
                  value={formData.ownerPhone}
                  onChange={(e) => handleChange('ownerPhone', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1E60FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Alert Trigger Threshold (Stars)
                </label>
                <select
                  value={formData.alertThreshold}
                  onChange={(e) => handleChange('alertThreshold', Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1E60FF]"
                >
                  <option value={1}>Ratings ≤ 1 Star (Emergency Only)</option>
                  <option value={2}>Ratings ≤ 2 Stars (Recommended)</option>
                  <option value={3}>Ratings ≤ 3 Stars (Sensitive / Quality Focus)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Send Test WhatsApp Damage Control
                </div>
                <div className="text-[11px] text-slate-500">
                  Verify how your phone receives instant table failure notifications
                </div>
              </div>
              <button
                type="button"
                onClick={handleTestAlert}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Test Alert</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Diner Perk Settings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-3">
            Diner Completion Reward Perk
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Discount Voucher Code
              </label>
              <input
                type="text"
                maxLength={20}
                value={formData.discountCode}
                onChange={(e) => handleChange('discountCode', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#1E60FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Perk Description
              </label>
              <input
                type="text"
                value="10% Off on next coffee / bill"
                disabled
                className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Save & Reset Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            className="bg-[#1E60FF] hover:bg-blue-700 text-white font-black px-6 py-3 rounded-2xl text-xs shadow-lg glow-blue flex items-center gap-2 cursor-pointer"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-[#FFD000]" />
                <span>Settings Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onResetData}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-xs font-semibold flex items-center gap-1.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>

      </form>
    </div>
  );
});

export default SettingsView;
