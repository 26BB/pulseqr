import React, { useState, useEffect } from 'react';
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
  const initialTableParam = urlParams.get('table') || '04';

  const [currentView, setCurrentView] = useState(initialViewParam);
  const [currentTable, setCurrentTable] = useState(initialTableParam);
  const [feedbacks, setFeedbacks] = useState(getStoredFeedbacks());
  const [settings, setSettings] = useState(getStoredSettings());
  const [standeesModalOpen, setStandeesModalOpen] = useState(false);
  const [docsModalOpen, setDocsModalOpen] = useState(false);

  // Subscribe to real-time cross-tab updates & browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view')) setCurrentView(params.get('view'));
      if (params.get('table')) setCurrentTable(params.get('table'));
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
  const handleViewChange = (newView) => {
    setCurrentView(newView);
    const url = new URL(window.location);
    url.searchParams.set('view', newView);
    window.history.replaceState({}, '', url);
  };

  const handleTableChange = (newTable) => {
    setCurrentTable(newTable);
    const url = new URL(window.location);
    url.searchParams.set('table', newTable);
    window.history.replaceState({}, '', url);
  };

  // Actions
  const handleFeedbackSubmit = (data) => {
    addFeedback(data);
    setFeedbacks(getStoredFeedbacks());
  };

  const handleResolveFeedback = (id, newStatus, note) => {
    const updated = updateFeedbackStatus(id, newStatus, note);
    setFeedbacks(updated);
  };

  const handleSaveSettings = (newSettings) => {
    saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleResetData = () => {
    const { feedbacks: newFbs, settings: newSets } = resetToSeedData();
    setFeedbacks(newFbs);
    setSettings(newSets);
  };

  const handleSimulateFeedback = () => {
    generateRandomDemoFeedback();
    setFeedbacks(getStoredFeedbacks());
  };

  const pendingAlertCount = feedbacks.filter(
    (f) => f.isAlert && f.status === 'ALERT_TRIGGERED'
  ).length;

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
        onOpenStandee={() => setStandeesModalOpen(true)}
        onOpenDocs={() => setDocsModalOpen(true)}
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
            onOpenStandees={() => setStandeesModalOpen(true)}
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
                onOpenStandees={() => setStandeesModalOpen(true)}
              />
            </div>
          </div>
        )}
      </main>

      {/* Table QR Standee Generator Modal */}
      {standeesModalOpen && (
        <QrStandeeGenerator
          settings={settings}
          onClose={() => setStandeesModalOpen(false)}
        />
      )}

      {/* PM Documentation & Case Study Reader Modal */}
      {docsModalOpen && (
        <PmDocsModal onClose={() => setDocsModalOpen(false)} />
      )}

      {/* Bottom Subtle Status Tag */}
      <footer className="py-3 px-4 text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800">
        PulseQR GTM Launch Simulator • Built for Pune Startups & Founder's Office Roles
      </footer>

    </div>
  );
}
