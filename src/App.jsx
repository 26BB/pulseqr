import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DemoBar from './components/common/DemoBar';
import DinerView from './components/diner/DinerView';
import AdminDashboard from './components/admin/AdminDashboard';
import QrStandeeGenerator from './components/admin/QrStandeeGenerator';
import PmDocsModal from './components/common/PmDocsModal';
import {
  getStoredFeedbacks,
  getStoredSettings,
  addFeedback,
  updateFeedbackStatus,
  saveSettings,
  resetToSeedData,
  subscribeToRealtime,
  generateRandomDemoFeedback,
} from './data/store';

export default function App() {
  // Read URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const initialViewParam = urlParams.get('view') || 'split';
  const rawTableParam = urlParams.get('table') || '04';
  // Security: Sanitize table parameter from URL to prevent unwanted input or injection
  const initialTableParam = typeof rawTableParam === 'string'
    ? rawTableParam.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 10) || '04'
    : '04';

  const [currentView, setCurrentView] = useState(initialViewParam);
  const [currentTable, setCurrentTable] = useState(initialTableParam);
  // Optimization: Lazy state initialization avoids executing synchronous localStorage.getItem
  // and JSON.parse on every re-render of the root App component.
  const [feedbacks, setFeedbacks] = useState(getStoredFeedbacks);
  const [settings, setSettings] = useState(getStoredSettings);
  const [standeesModalOpen, setStandeesModalOpen] = useState(false);
  const [docsModalOpen, setDocsModalOpen] = useState(false);

  // Subscribe to real-time cross-tab updates & browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view')) setCurrentView(params.get('view'));
      if (params.get('table')) {
        const safeTable = params.get('table').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 10) || '04';
        setCurrentTable(safeTable);
      }
    };
    window.addEventListener('popstate', handlePopState);

    const unsubscribe = subscribeToRealtime((msg) => {
      if (msg.type === 'FEEDBACKS_UPDATED') {
        setFeedbacks(msg.payload);
      } else if (msg.type === 'SETTINGS_UPDATED') {
        setSettings(msg.payload);
      } else if (msg.type === 'RESET_ALL') {
        setFeedbacks(getStoredFeedbacks());
        setSettings(getStoredSettings());
      }
    });

    return () => {
      window.removeEventListener('popstate', handlePopState);
      unsubscribe();
    };
  }, []);

  // Sync URL when view or table changes
  // Optimization: Memoize handlers with useCallback so child components wrapped in React.memo (DemoBar, DinerView, AdminDashboard)
  // don't re-render on unrelated state updates (e.g. modal toggle, real-time sync).
  const handleViewChange = useCallback((newView) => {
    setCurrentView(newView);
    const url = new URL(window.location);
    url.searchParams.set('view', newView);
    window.history.replaceState({}, '', url);
  }, []);

  const handleTableChange = useCallback((newTable) => {
    setCurrentTable(newTable);
    const url = new URL(window.location);
    url.searchParams.set('table', newTable);
    window.history.replaceState({}, '', url);
  }, []);

  // Actions
  const handleFeedbackSubmit = useCallback((data) => {
    // Optimization: addFeedback returns the updated feedback array already in memory,
    // avoiding a synchronous localStorage read and JSON.parse.
    const updated = addFeedback(data);
    setFeedbacks(updated);
  }, []);

  const handleResolveFeedback = useCallback((id, newStatus, note) => {
    const updated = updateFeedbackStatus(id, newStatus, note);
    setFeedbacks(updated);
  }, []);

  const handleSaveSettings = useCallback((newSettings) => {
    saveSettings(newSettings);
    setSettings(newSettings);
  }, []);

  const handleResetData = useCallback(() => {
    const { feedbacks: newFbs, settings: newSets } = resetToSeedData();
    setFeedbacks(newFbs);
    setSettings(newSets);
  }, []);

  const handleSimulateFeedback = useCallback(() => {
    // Optimization: generateRandomDemoFeedback returns the updated feedback array already in memory.
    const updated = generateRandomDemoFeedback();
    setFeedbacks(updated);
  }, []);

  const handleOpenStandee = useCallback(() => setStandeesModalOpen(true), []);
  const handleOpenDocs = useCallback(() => setDocsModalOpen(true), []);
  const handleCloseStandee = useCallback(() => setStandeesModalOpen(false), []);
  const handleCloseDocs = useCallback(() => setDocsModalOpen(false), []);

  // Optimization: Single-pass O(N) loop in useMemo avoids intermediate array allocation
  // from feedbacks.filter() when computing pending alert count.
  const pendingAlertCount = useMemo(() => {
    let count = 0;
    for (let i = 0; i < feedbacks.length; i++) {
      const f = feedbacks[i];
      if (f.isAlert && f.status === 'ALERT_TRIGGERED') {
        count++;
      }
    }
    return count;
  }, [feedbacks]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      
      {/* Sticky Top Interactive Demo Bar */}
      <DemoBar
        currentView={currentView}
        onViewChange={handleViewChange}
        currentTable={currentTable}
        onTableChange={handleTableChange}
        onSimulateFeedback={handleSimulateFeedback}
        onResetData={handleResetData}
        alertCount={pendingAlertCount}
        onOpenStandee={handleOpenStandee}
        onOpenDocs={handleOpenDocs}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {currentView === 'diner' && (
          <div className="py-6">
            <DinerView
              table={currentTable}
              onSubmitFeedback={handleFeedbackSubmit}
              settings={settings}
            />
          </div>
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            feedbacks={feedbacks}
            settings={settings}
            onResolveFeedback={handleResolveFeedback}
            onSaveSettings={handleSaveSettings}
            onResetData={handleResetData}
              onOpenStandees={handleOpenStandee}
          />
        )}

        {currentView === 'split' && (
          <div className="max-w-[1600px] mx-auto px-2 sm:px-4 py-6 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Left: Diner Mobile Phone Simulation */}
            <div className="xl:col-span-4 flex flex-col items-center">
              <div className="w-full text-center mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#1E60FF] bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                  📱 Diner Experience (Table #{currentTable})
                </span>
              </div>
              <DinerView
                table={currentTable}
                onSubmitFeedback={handleFeedbackSubmit}
                settings={settings}
              />
            </div>

            {/* Right: Owner Admin Operations Canvas */}
            <div className="xl:col-span-8 flex flex-col">
              <div className="w-full mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                  💻 Live Operations & Feedback Intercept Hub
                </span>
              </div>
              <AdminDashboard
                feedbacks={feedbacks}
                settings={settings}
                onResolveFeedback={handleResolveFeedback}
                onSaveSettings={handleSaveSettings}
                onResetData={handleResetData}
                onOpenStandees={handleOpenStandee}
              />
            </div>
          </div>
        )}
      </main>

      {/* Table QR Standee Generator Modal */}
      {standeesModalOpen && (
        <QrStandeeGenerator
          settings={settings}
          onClose={handleCloseStandee}
        />
      )}

      {/* PM Documentation & Case Study Reader Modal */}
      {docsModalOpen && (
        <PmDocsModal onClose={handleCloseDocs} />
      )}

      {/* Bottom Subtle Status Tag */}
      <footer className="py-3 px-4 text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800">
        PulseQR GTM Launch Simulator • Built for Pune Startups & Founder's Office Roles
      </footer>

    </div>
  );
}
