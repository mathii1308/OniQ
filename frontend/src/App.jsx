import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import NewAssessment from './pages/NewAssessment';
import AnalysisProcess from './pages/AnalysisProcess';
import AssessmentResult from './pages/AssessmentResult';
import QualityReport from './pages/QualityReport';
import History from './pages/History';
import Verification from './pages/Verification';

import { fetchHealth, fetchAssessments, analyzeBatchImage } from './services/api';

export default function App() {
  // Check if a procurement center is already logged in
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('oniq_logged_in_center');
    return saved ? JSON.parse(saved) : null;
  });

  const [screen, setScreen] = useState(() => (currentUser ? 'dashboard' : 'auth'));
  const [systemMode, setSystemMode] = useState(null);
  const [assessments, setAssessments] = useState([]);
  
  // Transient state for flow
  const [newMeta, setNewMeta] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  // Check backend health & fetch center-scoped assessments on mount and screen/user change
  useEffect(() => {
    async function init() {
      const modeData = await fetchHealth();
      setSystemMode(modeData);

      if (currentUser) {
        const items = await fetchAssessments("", "", currentUser.center_name);
        setAssessments(items);
      } else {
        setAssessments([]);
      }
    }
    init();
  }, [screen, currentUser]);

  const handleLoginSuccess = (user) => {
    localStorage.setItem('oniq_logged_in_center', JSON.stringify(user));
    setCurrentUser(user);
    setScreen('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('oniq_logged_in_center');
    setCurrentUser(null);
    setAssessments([]);
    setScreen('auth');
  };

  // Handler when user submits batch image in NewAssessment page
  const handleStartAnalysis = async (metaData) => {
    setNewMeta(metaData);
    setAnalysisResult(null);
    setScreen('process');

    try {
      const res = await analyzeBatchImage(metaData.file);
      setAnalysisResult(res);
    } catch (err) {
      console.error("Analysis failed:", err);
      alert(`🚫 Image Rejection Alert:\n\n${err.message}`);
      setScreen('new_assessment');
    }
  };

  // Called when 6-stage process animation completes
  const handleProcessComplete = () => {
    if (analysisResult) {
      setScreen('result');
    } else {
      setScreen('new_assessment');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
      <Navbar
        currentScreen={screen}
        setScreen={setScreen}
        systemMode={systemMode}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main style={{ flex: '1', maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '24px 20px' }}>
        {screen === 'auth' && (
          <AuthPage onLoginSuccess={handleLoginSuccess} />
        )}

        {screen === 'dashboard' && (
          <Dashboard
            assessments={assessments}
            setScreen={setScreen}
            setSelectedAssessment={setSelectedAssessment}
            currentUser={currentUser}
          />
        )}

        {screen === 'new_assessment' && (
          <NewAssessment
            onStartAnalysis={handleStartAnalysis}
            currentUser={currentUser}
          />
        )}

        {screen === 'process' && (
          <AnalysisProcess onComplete={handleProcessComplete} isReady={!!analysisResult} />
        )}

        {screen === 'result' && (
          <AssessmentResult
            resultData={analysisResult}
            metadata={newMeta}
            setScreen={setScreen}
            setSelectedAssessment={setSelectedAssessment}
          />
        )}

        {screen === 'report' && (
          <QualityReport
            assessment={selectedAssessment || assessments[0]}
            setScreen={setScreen}
          />
        )}

        {screen === 'history' && (
          <History
            assessments={assessments}
            setScreen={setScreen}
            setSelectedAssessment={setSelectedAssessment}
          />
        )}

        {screen === 'verify' && (
          <Verification
            initialId={selectedAssessment?.assessment_id || "ONQ-2026-001"}
            setScreen={setScreen}
            setSelectedAssessment={setSelectedAssessment}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print" style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--border-color)',
        padding: '20px',
        textAlign: 'center',
        fontSize: '12px',
        color: 'var(--text-muted)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
          <div>
            <strong>OniQ</strong> — Intelligent Onion Quality Assessment • SIH 2026 Prototype (PS ID 26031)
          </div>
          <div>
            {currentUser 
              ? `Logged in as: ${currentUser.center_name} (${currentUser.center_code})`
              : 'Designated for procurement center validation • Standardized & Traceable Assessment'
            }
          </div>
        </div>
      </footer>
    </div>
  );
}
