import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import LandingLoginPage from './views/LandingLoginPage';
import AnalystDashboard from './views/AnalystDashboard';
import CaseDetailView from './views/CaseDetailView';
import GraphicalAnalysisView from './views/GraphicalAnalysisView';
import CourtroomAiAnalysisView from './views/CourtroomAiAnalysisView';
import AdminDashboardView from './views/AdminDashboardView';

import HeaderWorkspace from './components/HeaderWorkspace';
import ChainOfCustodyModal from './components/ChainOfCustodyModal';
import CaseUploadModal from './components/CaseUploadModal';

import DetectiveDashboard from './views/DetectiveDashboard';
import TriageDashboard from './views/TriageDashboard';
import AuditorDashboard from './views/AuditorDashboard';

import { DEFAULT_CASES, getCaseById } from './data/defaultCases';

const API_BASE = "http://localhost:8000/api";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught UI Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF5EF] flex items-center justify-center p-6 text-center font-sans">
          <div className="bg-[#FFFDF9] border border-[#EBDCCF] p-8 rounded-3xl max-w-2xl shadow-xl space-y-4 text-left">
            <div className="flex items-center space-x-3 border-b border-[#EBDCCF] pb-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/15 text-rose-700 flex items-center justify-center font-bold text-lg">
                ⚠️
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#2C1F18]">Sarthi Forensics Error Diagnostic</h2>
                <p className="text-xs text-rose-700 font-mono font-bold">
                  {this.state.error?.toString()}
                </p>
              </div>
            </div>
            
            <pre className="p-4 bg-[#F5ECE3] border border-[#EBDCCF] rounded-2xl text-[11px] font-mono text-[#2C1F18] overflow-x-auto max-h-48">
              {this.state.error?.stack}
            </pre>

            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-2.5 bg-[#8C5D33] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer hover:bg-[#754B26] transition-colors"
            >
              🔄 Reload Investigation Portal
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainWorkspace() {
  const { privacyRedacted } = useTheme();
  const { userRole } = useAuth();

  const [selectedCaseId, setSelectedCaseId] = useState(null); // null = on Analyst Dashboard 3D case books grid
  const [activeAnalysisMode, setActiveAnalysisMode] = useState(null); // null | 'graphical' | 'courtroom' | 'topology'

  const [casesList, setCasesList] = useState(DEFAULT_CASES);

  const [caseDetail, setCaseDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isCustodyOpen, setIsCustodyOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const fetchCases = async () => {
    try {
      const res = await fetch(`${API_BASE}/cases?redact=${privacyRedacted}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) setCasesList(data);
      }
    } catch (err) {
      console.log("Backend offline, using fallback cases.");
    }
  };

  const fetchCaseDetail = async (cid) => {
    if (!cid) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/cases/${cid}?redact=${privacyRedacted}`);
      if (res.ok) {
        const data = await res.json();
        setCaseDetail(data);
      }
    } catch (err) {
      console.log("Backend offline, using local case state.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole) {
      fetchCases();
    }
  }, [userRole, privacyRedacted]);

  useEffect(() => {
    if (userRole && selectedCaseId) {
      fetchCaseDetail(selectedCaseId);
    }
  }, [selectedCaseId, userRole, privacyRedacted]);

  const handleCopilotQuery = async (queryText) => {
    try {
      const res = await fetch(`${API_BASE}/copilot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ case_id: selectedCaseId || 'CASE-0017', query: queryText })
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.log("Copilot fallback response used.");
    }
    return { response: "Analysis complete for " + queryText, sources: ["VoiceAgent", "DocumentAgent"] };
  };

  const handleExportPdf = () => {
    window.open(`${API_BASE}/cases/${selectedCaseId || 'CASE-0017'}/pdf`, '_blank');
  };

  const handleUploadSuccess = (newCaseId) => {
    fetchCases();
    setSelectedCaseId(newCaseId || 'CASE-0017');
    setActiveAnalysisMode(null);
  };

  // 1. If user is NOT logged in, render Landing & Login Portal
  if (!userRole) {
    return <LandingLoginPage />;
  }

  // 1b. If user is logged in as SYSTEM_ADMIN, render Admin Dashboard (matching design mockup)
  if (userRole === 'SYSTEM_ADMIN') {
    return <AdminDashboardView onSwitchToInvestigator={() => {}} />;
  }

  // 2. If user is logged in, but has NOT selected a specific case dossier yet, render Analyst Dashboard (3D case grid)
  if (!selectedCaseId) {
    return (
      <>
        <AnalystDashboard
          onSelectCase={(id) => { setSelectedCaseId(id || 'CASE-0017'); setActiveAnalysisMode(null); }}
          onOpenUpload={() => setIsUploadOpen(true)}
          onExportPdf={handleExportPdf}
        />
        <CaseUploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      </>
    );
  }

  // Find active case metadata
  const currentCaseObj = casesList.find(c => (c.case_id || c.caseId) === selectedCaseId) || getCaseById(selectedCaseId);

  // 3. When a case is selected and no analysis mode is active, render Case Detail View (Matching Screenshot #3!)
  if (!activeAnalysisMode) {
    return (
      <>
        <CaseDetailView
          caseId={currentCaseObj.case_id || currentCaseObj.caseId || selectedCaseId}
          title={currentCaseObj.title}
          date={currentCaseObj.date}
          onBackToCases={() => { setSelectedCaseId(null); setActiveAnalysisMode(null); }}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenCourtroom={() => setActiveAnalysisMode('courtroom')}
          onOpenGraphicalAnalysis={() => setActiveAnalysisMode('graphical')}
        />
        <CaseUploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      </>
    );
  }

  // 4. When user clicks "OPEN ANALYSIS" inside CaseDetailView, render GraphicalAnalysisView (Matching Screenshot #4!)
  if (activeAnalysisMode === 'graphical') {
    return (
      <>
        <GraphicalAnalysisView
          caseId={currentCaseObj.case_id || currentCaseObj.caseId || selectedCaseId}
          title={currentCaseObj.title}
          date={currentCaseObj.date}
          onBackToCase={() => setActiveAnalysisMode(null)}
          onExportReport={handleExportPdf}
          onOpenAudioInspector={() => setActiveAnalysisMode('topology')}
          onOpenImageInspector={() => setActiveAnalysisMode('topology')}
          onOpenDocInspector={() => setActiveAnalysisMode('topology')}
        />
        <CaseUploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      </>
    );
  }

  // 5. When user clicks "GO TO COURTROOM" inside CaseDetailView, render CourtroomAiAnalysisView (Matching Screenshots #5, #6, #7!)
  if (activeAnalysisMode === 'courtroom') {
    return (
      <>
        <CourtroomAiAnalysisView
          caseId={currentCaseObj.case_id || currentCaseObj.caseId || selectedCaseId}
          onBackToCases={() => setActiveAnalysisMode(null)}
          onExportPdf={handleExportPdf}
          onOpenUpload={() => setIsUploadOpen(true)}
        />
        <CaseUploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      </>
    );
  }

  // 6. When user clicks deep topology inspection, render Deep Forensic Topology Canvas
  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1F18] font-sans">
      
      <div className="bg-[#EADCCB] px-6 py-2.5 border-b border-[#D9C8B5] flex items-center justify-between text-xs font-mono">
        <button
          onClick={() => setActiveAnalysisMode('graphical')}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-[#FFFDF9] border border-[#EBDCCF] font-bold text-[#8C5D33] hover:bg-[#F5ECE3] transition-all cursor-pointer shadow-sm"
        >
          <span>← Back to Graphical Analysis ({selectedCaseId})</span>
        </button>
        <div className="flex items-center space-x-3">
          <span className="font-bold text-[#2C1F18]">
            MODE: <span className="text-[#8C5D33] uppercase">Topology & AI Copilot</span>
          </span>
        </div>
      </div>

      <HeaderWorkspace
        cases={casesList}
        currentCaseId={selectedCaseId}
        onSelectCase={(id) => setSelectedCaseId(id)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenCustody={() => setIsCustodyOpen(true)}
        onExportPdf={handleExportPdf}
      />

      <main className="max-w-7xl mx-auto px-6 py-8 pb-16">
        <DetectiveDashboard
          caseDetail={caseDetail}
          currentCaseId={selectedCaseId}
          onCopilotQuery={handleCopilotQuery}
        />
      </main>

      <ChainOfCustodyModal 
        isOpen={isCustodyOpen}
        onClose={() => setIsCustodyOpen(false)}
        custody={caseDetail?.case?.custody}
      />

      <CaseUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <MainWorkspace />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
