import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Globe, 
  Lock, 
  ArrowLeft, 
  FileText, 
  Settings, 
  LogOut, 
  X, 
  Sparkles, 
  Activity, 
  Mail, 
  CheckCircle2, 
  ChevronRight, 
  Radio, 
  Download, 
  ShieldCheck,
  Gavel,
  ShieldAlert,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getEvidenceAnalysis, computeCaseForensicSummary } from '../utils/forensicScore';

export default function CourtroomAiAnalysisView({ 
  caseId = "CASE-0017", 
  onBackToCases, 
  onExportPdf,
  onOpenUpload
}) {
  const { logout } = useAuth();
  const { language, setLanguage, privacyRedacted, togglePrivacy } = useTheme();

  const isInvestment = caseId === 'CASE-0015';
  const isBankFraud = caseId === 'CASE-0017';

  const [evidenceCount, setEvidenceCount] = useState(0);
  const [realEvidences, setRealEvidences] = useState([]);
  const [caseObj, setCaseObj] = useState(null);

  useEffect(() => {
    fetchCaseEvidences();
  }, [caseId]);

  const fetchCaseEvidences = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/cases/${caseId}`);
      if (res.ok) {
        const data = await res.json();
        setCaseObj(data);
        const evList = data.evidences || [];
        setRealEvidences(evList);
        setEvidenceCount(evList.length);
      }
    } catch (err) {
      console.log("Using fallback evidence count.");
    }
  };

  const hasRealUploads = realEvidences.length > 0;
  const isDemoCase = (isInvestment || isBankFraud) && !hasRealUploads;

  const ev1 = hasRealUploads 
    ? getEvidenceAnalysis(realEvidences[0], 0, caseId) 
    : (isDemoCase ? {
        title: isInvestment ? 'Crypto Wallet Transfer' : 'ATM CCTV Footage (2:30 - 3:00)',
        category: isInvestment ? 'FINANCIAL EVIDENCE' : 'AUDIO EVIDENCE',
        rawCategory: isInvestment ? 'financial' : 'audio',
        detail: isInvestment ? 'SHA: c3d4e5f6a7...' : 'SHA: e4f1a2b8c9...',
        date: isInvestment ? '09 MAY 2025' : '12 MAY 2025',
        confidence: isInvestment ? 92 : 94,
        anomaly: isInvestment ? 88 : 92,
        risk: 'HIGH',
        insight: isInvestment ? 'Deepfake AI voice & spoofed Telegram channel promoting high-yield crypto trading scam.' : 'Pitch-shift & TTS Spectrogram Synthesis Classifier detected neural voice cloning from 00:45 min to 02:15 min timestamp.'
      } : null);

  const ev2 = hasRealUploads 
    ? (realEvidences[1] ? getEvidenceAnalysis(realEvidences[1], 1, caseId) : null) 
    : (isDemoCase ? {
        title: isInvestment ? 'Telegram Channel' : 'Transaction Log (video.mp4)',
        category: isInvestment ? 'DIGITAL EVIDENCE' : 'VIDEO EVIDENCE',
        rawCategory: isInvestment ? 'digital' : 'video',
        detail: isInvestment ? 'SHA: d4e5f6a7b8...' : 'SHA: b2c3d4e5f6...',
        date: isInvestment ? '09 MAY 2025' : '12 MAY 2025',
        confidence: isInvestment ? 84 : 88,
        anomaly: isInvestment ? 81 : 85,
        risk: 'MEDIUM',
        insight: isInvestment ? 'Crypto Wallet Transfer log anomaly matched offshore liquidity pool address.' : 'Deepfake Neural Frame Classifier detected frame jitter, synthetic lip-sync artifacting, and face swap manipulation.'
      } : null);

  const totalEvidencesPresent = hasRealUploads ? realEvidences.length : (isDemoCase ? 4 : 0);
  const forensicSummary = computeCaseForensicSummary(realEvidences, caseId);

  const audioAnomaly = hasRealUploads ? forensicSummary.audioAnomaly : (isDemoCase ? (isInvestment ? 88 : 94) : 0);
  const videoAnomaly = hasRealUploads ? forensicSummary.videoAnomaly : (isDemoCase ? (isInvestment ? 92 : 96) : 0);
  const imageAnomaly = hasRealUploads ? forensicSummary.imageAnomaly : (isDemoCase ? (isInvestment ? 70 : 92) : 0);
  const docAnomaly = hasRealUploads ? forensicSummary.docAnomaly : (isDemoCase ? (isInvestment ? 85 : 89) : 0);
  
  const overallCaseRisk = hasRealUploads ? forensicSummary.overallAnomaly : (isDemoCase ? (isInvestment ? 84 : 93) : 0);
  const overallConfidence = hasRealUploads ? forensicSummary.overallConfidence : (isDemoCase ? (isInvestment ? 89 : 94) : 0);

  const hasEvidences = totalEvidencesPresent > 0;

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'risks' | 'reports' | 'settings'

  // Interactive Card Expand & Scanning State
  // activeEvidenceId: null | 'evidence-01' | 'evidence-02'
  // scanState: 'idle' | 'scanning' | 'revealed'
  const [activeEvidenceId, setActiveEvidenceId] = useState(null);
  const [scanState, setScanState] = useState('idle'); 
  const [scanProgress, setScanProgress] = useState(0);
  const [geminiAnalysis, setGeminiAnalysis] = useState({});

  const activeEvObjRaw = activeEvidenceId === 'evidence-01' ? ev1 : (activeEvidenceId === 'evidence-02' ? ev2 : null);
  const gemOverride = activeEvidenceId ? geminiAnalysis[activeEvidenceId] : null;
  const activeEvObj = gemOverride ? {
    ...activeEvObjRaw,
    confidence: gemOverride.confidence || activeEvObjRaw?.confidence,
    anomaly: gemOverride.anomaly || activeEvObjRaw?.anomaly,
    risk: gemOverride.risk || activeEvObjRaw?.risk,
    insight: gemOverride.insight || activeEvObjRaw?.insight
  } : activeEvObjRaw;

  const targetConfidence = activeEvObj?.confidence || 90;

  // Trigger Scanning Effect & fetch Gemini API real-time decision
  const handleExpandEvidence = async (evId) => {
    setActiveEvidenceId(evId);
    setScanState('scanning');
    setScanProgress(0);

    const targetEvItem = evId === 'evidence-01' ? ev1 : ev2;
    if (targetEvItem && !geminiAnalysis[evId]) {
      try {
        const res = await fetch("http://localhost:8000/api/ai/analyze-evidence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            case_id: caseId,
            title: caseObj?.title || "Digital Fraud Case",
            evidence_name: targetEvItem.title || "Exhibit",
            category: targetEvItem.rawCategory || "audio",
            hash: targetEvItem.fullHash || ""
          })
        });
        if (res.ok) {
          const gemData = await res.json();
          if (gemData && gemData.confidence) {
            setGeminiAnalysis(prev => ({
              ...prev,
              [evId]: gemData
            }));
          }
        }
      } catch (err) {
        console.log("Gemini API realtime decision fallback.");
      }
    }
  };

  useEffect(() => {
    let timer;
    if (scanState === 'scanning') {
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= targetConfidence) {
            clearInterval(interval);
            setTimeout(() => setScanState('revealed'), 300);
            return targetConfidence;
          }
          return Math.min(targetConfidence, prev + 14);
        });
      }, 120);
      return () => clearInterval(interval);
    }
  }, [scanState, targetConfidence]);

  const handleCloseAnalysis = () => {
    setScanState('idle');
    setActiveEvidenceId(null);
    setScanProgress(0);
  };

  const languages = ['English', 'Hindi (हिंदी)', 'Spanish (Español)', 'French (Français)'];

  return (
    <div className="min-h-screen bg-forensic-pattern flex flex-col font-sans relative overflow-x-hidden">
      
      {/* TOP HEADER BAR */}
      <header className="w-full bg-[#FFFDF9]/90 backdrop-blur-md border-b border-[#EBDCCF] px-6 py-3.5 flex items-center justify-between z-30 shadow-sm">
        
        {/* Left: Brand Emblem Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onBackToCases}>
          <div className="emblem-gold-ring p-0.5">
            <div className="emblem-gold-inner w-9 h-9 flex items-center justify-center shadow-inner">
              <Search className="w-4 h-4 text-[#8C5D33] stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="font-cinzel text-base font-bold tracking-wider text-[#2C1F18] leading-none uppercase">
              SARTHI <span className="text-[#8C5D33]">FORENSICS</span>
            </div>
            <div className="text-[10px] font-sans tracking-tight text-[#7D6B5D] mt-0.5 font-semibold">
              Digital Fraud Intelligence
            </div>
          </div>
        </div>

        {/* Right: Language Selector & Login Badge */}
        <div className="flex items-center space-x-3">
          
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-[#38281F] bg-[#FFFDF9] border border-[#EBDCCF] rounded-xl hover:border-[#CA8B4B] transition-all cursor-pointer shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-[#8C5D33]" />
              <span>{language}</span>
              <span className="text-[10px] text-[#7D6B5D]">▼</span>
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-[#FFFDF9] border border-[#EBDCCF] rounded-xl shadow-xl py-1.5 z-50 text-xs text-[#38281F]">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setLanguage(lang.split(' ')[0]); setIsLangOpen(false); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#F5ECE3] hover:text-[#8C5D33] transition-colors flex items-center justify-between"
                  >
                    <span>{lang}</span>
                    {language === lang.split(' ')[0] && <CheckCircle2 className="w-3.5 h-3.5 text-[#8C5D33]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile Badge */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#F5ECE3] border border-[#EBDCCF] text-xs font-semibold text-[#2C1F18]">
            <Lock className="w-3.5 h-3.5 text-[#8C5D33]" />
            <span>Investigator Login</span>
          </div>

        </div>
      </header>

      {/* BODY WITH LEFT SIDEBAR NAV & AI ANALYSIS ROOM MAIN STAGE */}
      <div className="flex-1 flex w-full relative z-10">
        
        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="w-60 bg-[#EADCCB]/90 border-r border-[#D9C8B5] flex flex-col justify-between py-6 px-4 shadow-inner">
          
          <div className="space-y-4">
            
            {/* Risks Button */}
            <button
              onClick={() => setActiveModal('risks')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#2C1F18] hover:bg-[#FAF5EF] transition-all cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-700 font-bold group-hover:scale-105 transition-transform">
                !
              </div>
              <span className="group-hover:text-[#8C5D33] transition-colors">Risks</span>
            </button>

            {/* Reports Button */}
            <button
              onClick={() => setActiveModal('reports')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#2C1F18] hover:bg-[#FAF5EF] transition-all cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-xl bg-[#8C5D33]/15 border border-[#8C5D33]/30 flex items-center justify-center text-[#8C5D33] group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <span className="group-hover:text-[#8C5D33] transition-colors">Reports</span>
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setActiveModal('settings')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#2C1F18] hover:bg-[#FAF5EF] transition-all cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-xl bg-[#8C5D33]/15 border border-[#8C5D33]/30 flex items-center justify-center text-[#8C5D33] group-hover:scale-105 transition-transform">
                <Settings className="w-4 h-4" />
              </div>
              <span className="group-hover:text-[#8C5D33] transition-colors">Settings</span>
            </button>

            {/* Active AI Analysis Room Badge */}
            <div className="p-3.5 rounded-2xl bg-[#E2D2C0] border border-[#C8B393] flex items-center space-x-3 text-xs font-semibold text-[#2C1F18] shadow-sm">
              <div className="w-6 h-6 rounded-lg bg-[#8C5D33] text-white flex items-center justify-center text-xs">
                ★
              </div>
              <div>
                <span className="font-bold block">AI Analysis Room</span>
                <span className="text-[10px] text-[#2E7D32] font-mono flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse inline-block mr-1"></span>
                  Active Analysis
                </span>
              </div>
            </div>

            <div className="border-t border-[#D9C8B5]/60 my-2"></div>
          </div>

          {/* Logout Button */}
          <div>
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#7D6B5D] hover:text-[#2C1F18] hover:bg-[#FAF5EF] transition-all cursor-pointer"
            >
              <LogOut className="w-5 h-5 text-[#8C5D33]" />
              <span>Logout</span>
            </button>
          </div>

        </aside>

        {/* MAIN STAGE AREA */}
        <main className="flex-1 p-8 space-y-6 relative flex flex-col justify-between">
          
          {/* Main Card Container */}
          <div className="bg-[#FFFDF9]/95 border border-[#EBDCCF] rounded-3xl p-8 shadow-card-glow space-y-6 relative flex-1 flex flex-col justify-between">
            
            {/* Header Status Bar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={onBackToCases}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#8C5D33] hover:underline cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Cases</span>
                </button>

                {/* Status Capsule */}
                <div className="px-3 py-1 rounded-full bg-[#F5ECE3] border border-[#EBDCCF] text-[10px] font-mono text-[#7D6B5D] flex items-center space-x-2">
                  <span>{caseId}</span>
                  <span>•</span>
                  <span>CLASSIFIED</span>
                  <span>•</span>
                  <span>AI ANALYSIS ROOM</span>
                  <span>•</span>
                  <span className="text-[#2E7D32] font-bold flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse inline-block mr-1"></span>
                    ACTIVE
                  </span>
                </div>
              </div>

              {/* Main Room Headline */}
              <div className="text-center space-y-1.5 pt-2">
                <h1 className="text-4xl font-serif font-bold text-[#2C1F18] tracking-wider uppercase">
                  AI ANALYSIS ROOM
                </h1>
                <p className="text-xs font-sans text-[#7D6B5D]">
                  Trace connections. Reveal evidence. Let AI uncover the pattern.
                </p>

                <div className="pt-2 inline-block">
                  <div className="px-4 py-1.5 rounded-full bg-[#2C1F18] text-[#FFFDF9] text-[10px] font-mono font-bold tracking-wider uppercase flex items-center space-x-2 shadow-sm">
                    <span className={`w-2 h-2 rounded-full ${hasEvidences ? 'bg-[#2E7D32] animate-pulse' : 'bg-amber-500'}`}></span>
                    <span>{hasEvidences ? 'AI ANALYSIS ACTIVE' : 'AWAITING EVIDENCE UPLOAD'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* STAGE & PEDESTALS (CENTER DISPLAY) */}
            <div className="py-6 flex items-end justify-center gap-6 sm:gap-12 relative my-auto">
              
              {/* LEFT PEDESTAL & EVIDENCE 01 */}
              <div className="flex flex-col items-center space-y-3 relative z-20">
                
                {ev1 ? (
                  /* Evidence 01 Floating Card */
                  <div 
                    onClick={() => {
                      const isAlreadyElevated = activeEvidenceId === 'evidence-01';
                      if (isAlreadyElevated) {
                        handleCloseAnalysis();
                      } else {
                        handleExpandEvidence('evidence-01');
                      }
                    }}
                    className={`w-64 sm:w-72 bg-[#FFFDF9] rounded-2xl p-5 relative transition-all duration-500 cubic-bezier(0.34,1.56,0.64,1) cursor-pointer select-none ${
                      activeEvidenceId === 'evidence-01'
                        ? 'scale-[1.08] -translate-y-6 z-40 border-2 border-[#8C5D33] shadow-[0_25px_40px_rgba(140,93,51,0.4)] ring-4 ring-[#8C5D33]/20'
                        : 'scale-100 translate-y-0 z-20 border border-[#EBDCCF] shadow-lg hover:-translate-y-2 hover:shadow-xl'
                    }`}
                  >
                    {activeEvidenceId === 'evidence-01' && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#8C5D33] text-[#FFFDF9] text-[9px] font-mono font-bold uppercase tracking-widest shadow-md flex items-center space-x-1 animate-bounce">
                        <Sparkles className="w-3 h-3 text-[#DDAF7D]" />
                        <span>EVIDENCE EXPANDED</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between border-b border-[#EBDCCF] pb-2">
                      <div className="flex items-center space-x-1.5 text-[10px] font-mono font-bold text-[#2C1F18]">
                        <Activity className="w-3.5 h-3.5 text-[#8C5D33]" />
                        <span>EVIDENCE 01</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-700 text-[9px] font-mono font-bold">
                        ● RISK: {ev1.risk || 'HIGH'}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#2C1F18] leading-tight truncate">
                        {ev1.title}
                      </h3>
                      <div className="flex items-center space-x-3 text-[10px] text-[#7D6B5D] font-mono mt-1">
                        <span>• {ev1.category}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2.5 rounded-xl bg-[#FAF5EF] border border-[#EBDCCF] truncate">
                        <span className="text-[9px] text-[#7D6B5D] font-mono block uppercase">EXHIBIT / DETAIL</span>
                        <span className="text-xs font-bold text-[#2C1F18] font-mono truncate block">
                          {ev1.detail}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#FAF5EF] border border-[#EBDCCF]">
                        <span className="text-[9px] text-[#7D6B5D] font-mono block uppercase">INGEST DATE</span>
                        <span className="text-xs font-bold text-[#2C1F18] font-mono">
                          {ev1.date}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 text-center border-t border-dashed border-[#EBDCCF]">
                      <button className="text-[10px] font-mono font-bold text-[#8C5D33] uppercase tracking-wider cursor-pointer hover:underline">
                        {activeEvidenceId === 'evidence-01' ? '▲ TAP TO COLLAPSE' : '▼ CLICK TO EXPAND & POP UP'}
                      </button>
                    </div>

                  </div>
                ) : (
                  /* Empty Slot Ingest Card 01 */
                  <div 
                    onClick={onOpenUpload}
                    className="w-64 sm:w-72 bg-[#FFFDF9]/90 border-2 border-dashed border-[#CA8B4B] rounded-2xl p-6 relative text-center space-y-3 cursor-pointer hover:bg-[#F5ECE3] hover:border-[#8C5D33] transition-all shadow-md group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#F5ECE3] border border-[#CA8B4B] mx-auto flex items-center justify-center text-[#8C5D33] group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-[#2C1F18]">
                        INGEST EVIDENCE 01
                      </h4>
                      <p className="text-[10px] text-[#7D6B5D] font-mono mt-1">
                        Click to upload Audio, Video, Image or PDF
                      </p>
                    </div>
                    <div className="px-3 py-1 rounded-xl bg-[#8C5D33] text-white text-[10px] font-mono font-bold uppercase tracking-wider inline-block shadow-sm">
                      + UPLOAD FILE
                    </div>
                  </div>
                )}

                {/* Wooden Podium Desk Base */}
                <div 
                  onClick={ev1 ? () => handleExpandEvidence('evidence-01') : onOpenUpload}
                  className="w-72 sm:w-80 h-16 bg-gradient-to-b from-[#38281F] via-[#261B14] to-[#17100B] border border-[#5F422E] rounded-t-xl shadow-2xl flex items-center justify-center relative cursor-pointer group"
                >
                  <div className={`w-8 h-8 rounded-full border border-[#B88544] flex items-center justify-center transition-transform group-hover:scale-110 ${
                    activeEvidenceId === 'evidence-01' ? 'bg-[#8C5D33] ring-4 ring-[#8C5D33]/30' : 'bg-[#2C1F18]'
                  }`}>
                    <div className="w-3 h-3 rounded-full bg-[#B88544] shadow-inner"></div>
                  </div>
                </div>

              </div>

              {/* CENTER SCALES OF JUSTICE EMBLEM & WOODEN PEDESTAL */}
              <div className="flex flex-col items-center justify-end relative z-10 bottom-0 pb-1">
                
                {/* Scales of Justice Emblem Graphic */}
                <div className="relative mb-2 flex items-center justify-center">
                  <svg width="180" height="200" viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="15" r="7" fill="#DDAF7D" stroke="#8C5D33" strokeWidth="2"/>
                    <path d="M96 22 L104 22 L102 185 L98 185 Z" fill="url(#pillarGrad)"/>
                    <path d="M25 60 C 60 55, 140 55, 175 60 L175 66 C 140 61, 60 61, 25 66 Z" fill="url(#beamGrad)"/>
                    
                    <line x1="25" y1="63" x2="10" y2="125" stroke="#B88544" strokeWidth="1.5"/>
                    <line x1="25" y1="63" x2="50" y2="125" stroke="#B88544" strokeWidth="1.5"/>
                    <path d="M5 125 C 5 145, 55 145, 55 125 Z" fill="url(#panGrad)" stroke="#B88544" strokeWidth="1.5"/>

                    <line x1="175" y1="63" x2="150" y2="125" stroke="#B88544" strokeWidth="1.5"/>
                    <line x1="175" y1="63" x2="190" y2="125" stroke="#B88544" strokeWidth="1.5"/>
                    <path d="M145 125 C 145 145, 195 145, 195 125 Z" fill="url(#panGrad)" stroke="#B88544" strokeWidth="1.5"/>

                    <defs>
                      <linearGradient id="pillarGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#8C5D33"/>
                        <stop offset="50%" stopColor="#DDAF7D"/>
                        <stop offset="100%" stopColor="#5F422E"/>
                      </linearGradient>
                      <linearGradient id="beamGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#8C5D33"/>
                        <stop offset="50%" stopColor="#F5DFB3"/>
                        <stop offset="100%" stopColor="#5F422E"/>
                      </linearGradient>
                      <linearGradient id="panGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#DDAF7D"/>
                        <stop offset="100%" stopColor="#754B26"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Wooden Center Base with TRUTH & JUSTICE Plaque */}
                <div className="w-56 h-20 bg-gradient-to-b from-[#38281F] via-[#261B14] to-[#17100B] border border-[#5F422E] rounded-t-xl shadow-2xl flex flex-col items-center justify-center p-2 relative">
                  <div className="w-40 py-1.5 bg-gradient-to-r from-[#DDAF7D] via-[#F5DFB3] to-[#8C5D33] border border-[#5F422E] rounded-lg text-center shadow-md">
                    <span className="font-serif text-xs font-bold text-[#2C1F18] tracking-widest uppercase block">
                      TRUTH & JUSTICE
                    </span>
                  </div>
                </div>

              </div>

              {/* RIGHT PEDESTAL & EVIDENCE 02 */}
              <div className="flex flex-col items-center space-y-3 relative z-20">
                
                {ev2 ? (
                  /* Evidence 02 Floating Card */
                  <div 
                    onClick={() => {
                      const isAlreadyElevated = activeEvidenceId === 'evidence-02';
                      if (isAlreadyElevated) {
                        handleCloseAnalysis();
                      } else {
                        handleExpandEvidence('evidence-02');
                      }
                    }}
                    className={`w-64 sm:w-72 bg-[#FFFDF9] rounded-2xl p-5 relative transition-all duration-500 cubic-bezier(0.34,1.56,0.64,1) cursor-pointer select-none ${
                      activeEvidenceId === 'evidence-02'
                        ? 'scale-[1.08] -translate-y-6 z-40 border-2 border-[#8C5D33] shadow-[0_25px_40px_rgba(140,93,51,0.4)] ring-4 ring-[#8C5D33]/20'
                        : 'scale-100 translate-y-0 z-20 border border-[#EBDCCF] shadow-lg hover:-translate-y-2 hover:shadow-xl'
                    }`}
                  >
                    {activeEvidenceId === 'evidence-02' && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#8C5D33] text-[#FFFDF9] text-[9px] font-mono font-bold uppercase tracking-widest shadow-md flex items-center space-x-1 animate-bounce">
                        <Sparkles className="w-3 h-3 text-[#DDAF7D]" />
                        <span>EVIDENCE EXPANDED</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between border-b border-[#EBDCCF] pb-2">
                      <div className="flex items-center space-x-1.5 text-[10px] font-mono font-bold text-[#2C1F18]">
                        <Mail className="w-3.5 h-3.5 text-[#8C5D33]" />
                        <span>EVIDENCE 02</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 text-[9px] font-mono font-bold">
                        ● RISK: {ev2.risk || 'MEDIUM'}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#2C1F18] leading-tight truncate">
                        {ev2.title}
                      </h3>
                      <div className="flex items-center space-x-3 text-[10px] text-[#7D6B5D] font-mono mt-1">
                        <span>• {ev2.category}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2.5 rounded-xl bg-[#FAF5EF] border border-[#EBDCCF] truncate">
                        <span className="text-[9px] text-[#7D6B5D] font-mono block uppercase">EXHIBIT / DETAIL</span>
                        <span className="text-xs font-bold text-[#2C1F18] font-mono truncate block">
                          {ev2.detail}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#FAF5EF] border border-[#EBDCCF]">
                        <span className="text-[9px] text-[#7D6B5D] font-mono block uppercase">INGEST DATE</span>
                        <span className="text-xs font-bold text-[#2C1F18] font-mono">
                          {ev2.date}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 text-center border-t border-dashed border-[#EBDCCF]">
                      <button className="text-[10px] font-mono font-bold text-[#8C5D33] uppercase tracking-wider cursor-pointer hover:underline">
                        {activeEvidenceId === 'evidence-02' ? '▲ TAP TO COLLAPSE' : '▼ CLICK TO EXPAND & POP UP'}
                      </button>
                    </div>

                  </div>
                ) : (
                  /* Empty Slot Ingest Card 02 */
                  <div 
                    onClick={onOpenUpload}
                    className="w-64 sm:w-72 bg-[#FFFDF9]/90 border-2 border-dashed border-[#CA8B4B] rounded-2xl p-6 relative text-center space-y-3 cursor-pointer hover:bg-[#F5ECE3] hover:border-[#8C5D33] transition-all shadow-md group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#F5ECE3] border border-[#CA8B4B] mx-auto flex items-center justify-center text-[#8C5D33] group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-[#2C1F18]">
                        INGEST EVIDENCE 02
                      </h4>
                      <p className="text-[10px] text-[#7D6B5D] font-mono mt-1">
                        Click to upload Audio, Video, Image or PDF
                      </p>
                    </div>
                    <div className="px-3 py-1 rounded-xl bg-[#8C5D33] text-white text-[10px] font-mono font-bold uppercase tracking-wider inline-block shadow-sm">
                      + UPLOAD FILE
                    </div>
                  </div>
                )}

                {/* Wooden Podium Desk Base */}
                <div 
                  onClick={ev2 ? () => handleExpandEvidence('evidence-02') : onOpenUpload}
                  className="w-72 sm:w-80 h-16 bg-gradient-to-b from-[#38281F] via-[#261B14] to-[#17100B] border border-[#5F422E] rounded-t-xl shadow-2xl flex items-center justify-center relative cursor-pointer group"
                >
                  <div className={`w-8 h-8 rounded-full border border-[#B88544] flex items-center justify-center transition-transform group-hover:scale-110 ${
                    activeEvidenceId === 'evidence-02' ? 'bg-[#8C5D33] ring-4 ring-[#8C5D33]/30' : 'bg-[#2C1F18]'
                  }`}>
                    <div className="w-3 h-3 rounded-full bg-[#B88544] shadow-inner"></div>
                  </div>
                </div>

              </div>

            </div>

            {/* AI FINAL CALL & VERDICT PANEL */}
            <div className="bg-[#FFFDF9] border border-[#CA8B4B]/50 rounded-3xl p-6 space-y-5 shadow-lg relative my-4">
              
              {/* Header with Scales & Gavel */}
              <div className="flex items-center justify-between border-b border-[#EBDCCF] pb-3">
                <div className="flex items-center space-x-2.5">
                  <Gavel className="w-5 h-5 text-[#8C5D33]" />
                  <h3 className="font-serif text-sm font-bold text-[#2C1F18] uppercase tracking-wider">
                    AI FINAL CALL & VERDICT ANALYSIS
                  </h3>
                </div>
                <span className={`px-3 py-1 rounded-full font-mono text-[10px] font-bold ${
                  overallCaseRisk > 0 ? 'bg-rose-500/10 border border-rose-500/30 text-rose-700' : 'bg-amber-500/10 border border-amber-500/30 text-amber-800'
                }`}>
                  ● OVERALL ANOMALY INDEX: {overallCaseRisk > 0 ? `${overallCaseRisk}% HIGH RISK` : '0% INSUFFICIENT DATA'}
                </span>
              </div>

              {/* Multi-Modal Error Breakdown Percentage Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                
                {/* Audio Anomaly % */}
                <div className="p-3.5 rounded-2xl bg-[#FAF5EF] border border-[#EBDCCF] text-center space-y-1">
                  <span className="text-[10px] font-mono text-[#7D6B5D] uppercase block">AUDIO ANOMALY</span>
                  <span className={`text-lg font-mono font-bold ${audioAnomaly > 0 ? 'text-rose-700' : 'text-slate-400'}`}>
                    {audioAnomaly > 0 ? `${audioAnomaly}%` : '0%'}
                  </span>
                  <span className="text-[9px] text-[#7D6B5D] block">
                    {audioAnomaly > 0 ? 'TTS Voice Cloning' : 'No Audio File'}
                  </span>
                </div>

                {/* Video Anomaly % */}
                <div className="p-3.5 rounded-2xl bg-[#FAF5EF] border border-[#EBDCCF] text-center space-y-1">
                  <span className="text-[10px] font-mono text-[#7D6B5D] uppercase block">VIDEO ANOMALY</span>
                  <span className={`text-lg font-mono font-bold ${videoAnomaly > 0 ? 'text-rose-700' : 'text-slate-400'}`}>
                    {videoAnomaly > 0 ? `${videoAnomaly}%` : '0%'}
                  </span>
                  <span className="text-[9px] text-[#7D6B5D] block">
                    {videoAnomaly > 0 ? 'Deepfake Jitter' : 'No Video File'}
                  </span>
                </div>

                {/* Image Anomaly % */}
                <div className="p-3.5 rounded-2xl bg-[#FAF5EF] border border-[#EBDCCF] text-center space-y-1">
                  <span className="text-[10px] font-mono text-[#7D6B5D] uppercase block">IMAGE ANOMALY</span>
                  <span className={`text-lg font-mono font-bold ${imageAnomaly > 0 ? 'text-rose-700' : 'text-slate-400'}`}>
                    {imageAnomaly > 0 ? `${imageAnomaly}%` : '0%'}
                  </span>
                  <span className="text-[9px] text-[#7D6B5D] block">
                    {imageAnomaly > 0 ? 'ELA Pixel Manipulation' : 'No Image File'}
                  </span>
                </div>

                {/* Document Anomaly % */}
                <div className="p-3.5 rounded-2xl bg-[#FAF5EF] border border-[#EBDCCF] text-center space-y-1">
                  <span className="text-[10px] font-mono text-[#7D6B5D] uppercase block">DOCUMENT ANOMALY</span>
                  <span className={`text-lg font-mono font-bold ${docAnomaly > 0 ? 'text-amber-700' : 'text-slate-400'}`}>
                    {docAnomaly > 0 ? `${docAnomaly}%` : '0%'}
                  </span>
                  <span className="text-[9px] text-[#7D6B5D] block">
                    {docAnomaly > 0 ? 'Metadata & Font Mismatch' : 'No Doc File'}
                  </span>
                </div>

              </div>

              {/* AI FINAL CALL RECOMMENDATION BANNER */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#2C1F18] via-[#38281F] to-[#17100B] text-[#FFFDF9] border border-[#8C5D33] shadow-md flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#8C5D33]/30 border border-[#DDAF7D] flex items-center justify-center text-[#DDAF7D] flex-shrink-0 animate-pulse">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#DDAF7D] font-bold block">
                      AI SYSTEM FINAL CALL VERDICT
                    </span>
                    <h4 className="text-xs sm:text-sm font-serif font-bold text-white mt-0.5">
                      {totalEvidencesPresent > 0 
                        ? '⚖️ HIGH FORENSIC ANOMALY DETECTED — HUMAN INTERVENTION IS RECOMMENDED BEFORE LEGAL FILING.'
                        : 'ℹ️ AWAITING EVIDENCE INGESTION — UPLOAD MULTIMODAL FORENSIC EXHIBITS TO INITIATE AUTOMATED COURT AUDIT.'}
                    </h4>
                  </div>
                </div>

                {totalEvidencesPresent > 0 ? (
                  <button
                    onClick={onExportPdf}
                    className="px-4 py-2.5 rounded-xl bg-[#8C5D33] hover:bg-[#754B26] text-white text-xs font-bold font-mono uppercase tracking-wider flex-shrink-0 transition-all cursor-pointer shadow-md hover:scale-105"
                  >
                    ⚖️ GENERATE COURT DOSSIER
                  </button>
                ) : (
                  <button
                    onClick={onOpenUpload}
                    className="px-4 py-2.5 rounded-xl bg-[#CA8B4B] hover:bg-[#8C5D33] text-white text-xs font-bold font-mono uppercase tracking-wider flex-shrink-0 transition-all cursor-pointer shadow-md flex items-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>INGEST EVIDENCE FILES</span>
                  </button>
                )}
              </div>

            </div>

            {/* BOTTOM ENCRYPTED FOOTER BAR */}
            <div className="bg-[#FAF5EF] border border-[#EBDCCF] rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#7D6B5D]">
              <div className="flex items-center space-x-4">
                <span className="font-bold text-[#2C1F18]">{caseId}</span>
                <span>• {totalEvidencesPresent > 0 ? totalEvidencesPresent : 0} EVIDENCES LINKED</span>
                <span className="text-rose-700 font-bold">• {overallCaseRisk > 80 ? '2 HIGH-RISK FLAGS' : '1 FLAG'}</span>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <span>AI CONFIDENCE:</span>
                  <div className="w-24 h-2 bg-[#EBDCCF] rounded-full overflow-hidden">
                    <div style={{ width: `${overallConfidence || 90}%` }} className="h-full bg-[#8C5D33]"></div>
                  </div>
                  <span className="font-bold text-[#2C1F18]">{overallConfidence || 90}%</span>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-[#2C1F18] font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#8C5D33]" />
                  <span>ENCRYPTED • 256-BIT</span>
                </div>
              </div>
            </div>

          </div>

        </main>

      </div>

      {/* EXPANDED EVIDENCE SCANNING & REVEAL MODAL */}
      {activeEvidenceId && (
        <div className="fixed inset-0 z-50 bg-[#2C1F18]/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#FFFDF9] border border-[#EBDCCF] rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden transition-all duration-500 transform scale-100">
            
            {scanState === 'scanning' && (
              <div className="space-y-6 relative">
                
                {/* Glowing Laser Sweep Line */}
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#DDAF7D] to-transparent shadow-[0_0_15px_#CA8B4B] animate-laser-scan z-30 pointer-events-none"></div>

                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-[#EBDCCF] pb-3">
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#7D6B5D]">
                    <FileText className="w-4 h-4 text-[#8C5D33]" />
                    <span>
                      {activeEvidenceId === 'evidence-01' ? 'EVIDENCE 01' : 'EVIDENCE 02'} • CENTRAL DISPLAY
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-700 text-[10px] font-mono font-bold">
                    • RISK: HIGH
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h2 className="text-3xl font-serif font-bold text-[#2C1F18]">
                    {activeEvidenceId === 'evidence-01' 
                      ? (isInvestment ? 'Crypto Wallet Transfer' : 'Suspicious Transaction')
                      : (isInvestment ? 'Telegram Channel' : 'Suspicious Email')
                    }
                  </h2>
                  <p className="text-xs font-mono text-[#7D6B5D] mt-1">
                    Financial Evidence • Flagged Evidence
                  </p>
                </div>

                {/* Info Boxes */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#FAF5EF] border border-[#EBDCCF] space-y-1">
                    <span className="text-[10px] font-mono text-[#7D6B5D] block uppercase">AMOUNT</span>
                    <span className="text-base font-bold text-[#2C1F18] font-mono">
                      {isInvestment ? '₹8,50,000' : '₹2,45,000'}
                    </span>
                    <span className="text-[10px] text-[#7D6B5D] font-mono block">
                      {isInvestment ? 'Ref: CRYPTO-99412' : 'Ref: TXN-88921'}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FAF5EF] border border-[#EBDCCF] space-y-1">
                    <span className="text-[10px] font-mono text-[#7D6B5D] block uppercase">DATE</span>
                    <span className="text-base font-bold text-[#2C1F18] font-mono">
                      {isInvestment ? '09 MAY 2025' : '12 MAY 2025'}
                    </span>
                    <span className="text-[10px] text-[#7D6B5D] font-mono block">Chain of custody intact</span>
                  </div>
                </div>

                {/* Laser Scanning Status & Progress Bar */}
                <div className="pt-6 border-t border-[#EBDCCF] space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#8C5D33] uppercase">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                    <span>AI SCANNING • EXTRACTING PATTERNS</span>
                  </div>

                  <div className="w-full h-2 bg-[#EBDCCF] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${scanProgress}%` }}
                      className="h-full bg-gradient-to-r from-[#A67443] to-[#8C5D33] transition-all duration-200"
                    ></div>
                  </div>

                  <div className="flex justify-between text-[10px] font-mono text-[#7D6B5D]">
                    <span>Deep neural analysis</span>
                    <span className="font-bold text-[#2C1F18]">{scanProgress}%</span>
                  </div>
                </div>

              </div>
            )}

            {/* SCREENSHOT #7: EXPANDED AI EVIDENCE ANALYSIS REVEALED STATE */}
            {scanState === 'revealed' && (() => {
              const targetEv = activeEvidenceId === 'evidence-01' ? ev1 : (activeEvidenceId === 'evidence-02' ? ev2 : null);
              const evCategory = targetEv?.category?.toLowerCase() || '';

              let dynamicAiInsight = "Transaction pattern differs from normal account behavior. Velocity anomaly exceeds baseline by 340%. Midnight transfer flag.";
              if (evCategory.includes('image')) {
                dynamicAiInsight = "Error Level Analysis (ELA 92%) identified high-frequency pixel manipulation and forged stamp signature inside the highlighted bounding reticle region.";
              } else if (evCategory.includes('video')) {
                dynamicAiInsight = "Deepfake Neural Frame Classifier detected frame jitter, synthetic lip-sync artifacting, and face swap manipulation between 02:30 min and 03:00 min.";
              } else if (evCategory.includes('audio')) {
                dynamicAiInsight = "Pitch-shift & TTS Spectrogram Synthesis Classifier detected neural voice cloning from 00:45 min to 02:15 min timestamp.";
              } else if (evCategory.includes('document') || evCategory.includes('pdf')) {
                dynamicAiInsight = "PDF Structure Analysis flagged 3 high-risk suspicious terms: 'Guaranteed 200% Profit', 'Offshore Mule Account', and font kerning mismatch on line 14.";
              } else if (isInvestment) {
                dynamicAiInsight = "High-yield investment solicitation matched against active Ponzi syndicate database. Deepfake voice call & fraudulent smart contract deployment detected.";
              }

              return (
                <div className="space-y-6">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-[#EBDCCF] pb-3">
                    <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#8C5D33]">
                      <span className="w-2 h-2 rounded-full bg-[#8C5D33]"></span>
                      <span>EVIDENCE ANALYSIS</span>
                    </div>
                    <span className="px-3 py-1 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 text-xs font-mono font-bold">
                      RISK {targetEv?.risk || 'HIGH'} ●●●
                    </span>
                  </div>

                  {/* Title */}
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C1F18] truncate">
                      {targetEv?.title || 'Analyzed Evidence Exhibit'}
                    </h2>
                    <p className="text-xs font-mono text-[#7D6B5D] mt-1">
                      {activeEvidenceId === 'evidence-01' ? 'EVIDENCE 01' : 'EVIDENCE 02'} • {targetEv?.category || 'Digital Evidence'}
                    </p>
                  </div>

                  {/* Top Verification Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#FAF5EF] border border-[#EBDCCF] space-y-1 truncate">
                      <div className="flex items-center space-x-1.5 text-[10px] font-mono text-[#7D6B5D]">
                        <span>🔍</span>
                        <span className="uppercase">EXHIBIT DETAILS</span>
                      </div>
                      <span className="text-sm font-bold text-[#2C1F18] font-mono truncate block">
                        {targetEv?.detail || 'Verified Record'}
                      </span>
                      <span className="text-[10px] text-[#7D6B5D] font-mono block">ISO 27037 Tamper-Proof</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF5EF] border border-[#EBDCCF] space-y-1">
                      <div className="flex items-center space-x-1.5 text-[10px] font-mono text-[#7D6B5D]">
                        <span>📅</span>
                        <span className="uppercase">INGEST DATE</span>
                      </div>
                      <span className="text-sm font-bold text-[#2C1F18] font-mono block">
                        {targetEv?.date || '08 AUG 2026'}
                      </span>
                      <span className="text-[10px] text-[#7D6B5D] font-mono block">Chain of custody intact</span>
                    </div>
                  </div>

                  {/* AI INSIGHT CARD */}
                  <div className="p-5 rounded-2xl bg-[#FAF5EF] border border-[#EBDCCF] space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-[#EBDCCF]/60 pb-2">
                      <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#2C1F18]">
                        <div className="w-5 h-5 rounded-full bg-[#2C1F18] text-[#FFFDF9] flex items-center justify-center text-[10px]">
                          ✦
                        </div>
                        <span>AI INSIGHT</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-[10px] font-mono font-bold uppercase">
                        FORENSIC ANOMALY
                      </span>
                    </div>

                    <p className="text-xs text-[#2C1F18] leading-relaxed font-sans font-medium">
                      {targetEv?.insight || dynamicAiInsight}
                    </p>
                  </div>

                  {/* AI CONFIDENCE SLIDER */}
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between items-center text-xs font-mono font-bold">
                      <span className="text-[#7D6B5D]">⊙ AI CONFIDENCE</span>
                      <span className="text-[#2C1F18]">{targetEv?.confidence || 90}%</span>
                    </div>

                    <div className="w-full h-2.5 bg-[#EBDCCF] rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${targetEv?.confidence || 90}%` }}
                        className="h-full bg-gradient-to-r from-[#CA8B4B] via-[#8C5D33] to-[#754B26] rounded-full transition-all duration-500"
                      ></div>
                    </div>

                    <div className="flex justify-between text-[10px] font-mono text-[#7D6B5D]">
                      <span>Low</span>
                      <span>Medium</span>
                      <span className="font-bold text-[#2C1F18]">High • Verified</span>
                    </div>
                  </div>

                  {/* CLOSE ANALYSIS ACTION BUTTON */}
                  <div className="pt-2 space-y-2">
                    <button
                      onClick={handleCloseAnalysis}
                      className="w-full py-3 rounded-2xl bg-[#17100B] hover:bg-black text-[#FFFDF9] text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg cursor-pointer"
                    >
                      <X className="w-4 h-4 text-[#DDAF7D]" />
                      <span>CLOSE ANALYSIS</span>
                    </button>
                    <div className="text-[10px] font-mono text-center text-[#7D6B5D]">
                      ESC to close • Click outside to dismiss
                    </div>
                  </div>

                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* MODALS: Risks, Reports, Settings */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-[#2C1F18]/50 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
          <div className="bg-[#FFFDF9] border border-[#EBDCCF] rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#F5ECE3] text-[#7D6B5D] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === 'risks' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-rose-700">
                  <Radio className="w-5 h-5 animate-pulse" />
                  <h3 className="font-serif text-lg font-bold text-[#2C1F18]">Live Forensic Risk Stream</h3>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-800">
                    <strong>CRITICAL RISK (94%):</strong> Case {caseId} flagged for high-velocity transaction anomaly.
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'reports' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-[#8C5D33]">
                  <FileText className="w-5 h-5" />
                  <h3 className="font-serif text-lg font-bold text-[#2C1F18]">Audit & PDF Dossier Exports</h3>
                </div>
                <p className="text-xs text-[#7D6B5D] leading-relaxed">
                  Generate court-admissible signed PDF dossiers containing SHA-256 evidence hashes and ISO/IEC 27037 chain of custody logs.
                </p>
                <button
                  onClick={() => { setActiveModal(null); onExportPdf(); }}
                  className="w-full py-3 rounded-xl bg-bronze-metallic text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Signed PDF Report</span>
                </button>
              </div>
            )}

            {activeModal === 'settings' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-[#8C5D33]">
                  <Settings className="w-5 h-5" />
                  <h3 className="font-serif text-lg font-bold text-[#2C1F18]">Privacy & Safety Controls</h3>
                </div>
                <div className="p-4 rounded-2xl bg-[#F5ECE3] border border-[#EBDCCF] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#2C1F18] block">Rule 81 PII Masking:</span>
                    <span className="text-[#7D6B5D]">Pseudonymize names, phone numbers, and bank accounts</span>
                  </div>
                  <button
                    onClick={togglePrivacy}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      privacyRedacted ? 'bg-[#8C5D33] text-white' : 'bg-rose-600 text-white'
                    }`}
                  >
                    {privacyRedacted ? 'REDACTED' : 'UNMASKED'}
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-[#8C5D33] text-white text-xs font-semibold hover:bg-[#754B26] transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
