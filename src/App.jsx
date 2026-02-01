import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NotesProvider } from './context/NotesContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import Layout from './components/Layout';
import RecordPage from './pages/RecordPage';
import NotesListPage from './pages/NotesListPage';
import NoteDetailPage from './pages/NoteDetailPage';
import AnalysisPage from './pages/AnalysisPage';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import PaywallModal from './components/PaywallModal';

function App() {
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState(null);

  const openPaywall = (feature = null) => {
    setPaywallFeature(feature);
    setShowPaywall(true);
  };

  return (
    <BrowserRouter>
      <SubscriptionProvider>
        <NotesProvider>
          <Layout onUpgradeClick={() => openPaywall()}>
            <Routes>
              <Route path="/" element={<RecordPage onUpgradeClick={openPaywall} />} />
              <Route path="/notes" element={<NotesListPage />} />
              <Route path="/notes/:id" element={<NoteDetailPage />} />
              <Route path="/notes/:id/analyze" element={<AnalysisPage onUpgradeClick={openPaywall} />} />
              <Route path="/chat" element={<ChatPage onUpgradeClick={openPaywall} />} />
              <Route path="/settings" element={<SettingsPage onUpgradeClick={openPaywall} />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>

          {/* Global Paywall Modal */}
          <PaywallModal
            isOpen={showPaywall}
            onClose={() => setShowPaywall(false)}
            feature={paywallFeature}
          />
        </NotesProvider>
      </SubscriptionProvider>
    </BrowserRouter>
  );
}

export default App;
