/**
 * ADS INTELLIGENCE - Main App with Routing
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { OverviewPage } from './pages/OverviewPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { CRMPage } from './pages/CRMPage';
import { CompetitorsPage } from './pages/CompetitorsPage';
import { MarketPage } from './pages/MarketPage';
import { AudiencesPage } from './pages/AudiencesPage';
import { CreativesPage } from './pages/CreativesPage';
import { ExperimentsPage } from './pages/ExperimentsPage';
import { PerformancePage } from './pages/PerformancePage';
import { LearningPage } from './pages/LearningPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/crm" element={<CRMPage />} />
          <Route path="/competitors" element={<CompetitorsPage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/audiences" element={<AudiencesPage />} />
          <Route path="/creatives" element={<CreativesPage />} />
          <Route path="/experiments" element={<ExperimentsPage />} />
          <Route path="/performance" element={<PerformancePage />} />
          <Route path="/learning" element={<LearningPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
};

export default App;