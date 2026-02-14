import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { NotesProvider } from './context/NotesContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { ThemeProvider } from './context/ThemeContext';
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
import PageTransition from './components/PageTransition';
import { AnimatePresence } from 'framer-motion';

function AppRoutes({ openPaywall }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><RecordPage onUpgradeClick={openPaywall} /></PageTransition>} />
        <Route path="/notes" element={<PageTransition><NotesListPage /></PageTransition>} />
        <Route path="/notes/:id" element={<PageTransition><NoteDetailPage /></PageTransition>} />
        <Route path="/notes/:id/analyze" element={<PageTransition><AnalysisPage onUpgradeClick={openPaywall} /></PageTransition>} />
        <Route path="/chat" element={<PageTransition><ChatPage onUpgradeClick={openPaywall} /></PageTransition>} />
        <Route path="/settings" element={<PageTransition><SettingsPage onUpgradeClick={openPaywall} /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><TermsPage /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><PrivacyPage /></PageTransition>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState(null);

  const openPaywall = (feature = null) => {
    setPaywallFeature(feature);
    setShowPaywall(true);
  };

  return (
    <BrowserRouter>
      <ThemeProvider>
        <SubscriptionProvider>
          <NotesProvider>
            <Layout onUpgradeClick={() => openPaywall()}>
              <AppRoutes openPaywall={openPaywall} />
            </Layout>

            {/* Global Paywall Modal */}
            <PaywallModal
              isOpen={showPaywall}
              onClose={() => setShowPaywall(false)}
              feature={paywallFeature}
            />
          </NotesProvider>
        </SubscriptionProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
