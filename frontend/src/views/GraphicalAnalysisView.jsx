import React, { useState } from 'react';
import { 
  Search, 
  Globe, 
  Lock, 
  ArrowLeft, 
  Calendar, 
  User, 
  Filter, 
  Activity, 
  Video, 
  Image as ImageIcon, 
  FileText, 
  ChevronDown, 
  ChevronRight,
  Play, 
  BarChart2, 
  Download, 
  CheckCircle2, 
  Radio, 
  Settings, 
  LogOut, 
  X,
  Volume2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

import { getEvidenceAnalysis } from '../utils/forensicScore';

export default function GraphicalAnalysisView({ 
  caseId = "CASE-0017", 
  title = "Bank Fraud", 
  date = "12 May 2025", 
  onBackToCase, 
  onExportReport,
  onOpenAudioInspector,
  onOpenImageInspector,
  onOpenDocInspector
}) {
  const { logout } = useAuth();
  const { language, setLanguage, privacyRedacted, togglePrivacy } = useTheme();

  const isInvestment = caseId === 'CASE-0015';
  const isBankFraud = caseId === 'CASE-0017';
  
  const [evidenceCount, setEvidenceCount] = useState(isInvestment || isBankFraud ? 4 : 0);
  const [realEvidences, setRealEvidences] = useState([]);

  React.useEffect(() => {
    fetchCaseEvidences();
  }, [caseId]);

  const fetchCaseEvidences = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/cases/${caseId}`);
      if (res.ok) {
        const data = await res.json();
        const evList = data.evidences || [];
        setRealEvidences(evList);
        const customCount = evList.length;
        const initialCount = isInvestment || isBankFraud ? 4 : 0;
        setEvidenceCount(initialCount + customCount);
      }
    } catch (err) {
      console.log("Using fallback evidence count.");
    }
  };

  const hasRealUploads = realEvidences.length > 0;

  // Real items from uploaded exhibits or fallback for demo cases
  const audioEv = realEvidences.find(e => e.category === 'audio' || e.category === 'video') || (hasRealUploads ? realEvidences[0] : null);
  const imageEv = realEvidences.find(e => e.category === 'image') || (hasRealUploads ? realEvidences[1] || realEvidences[0] : null);
  const docEv = realEvidences.find(e => e.category === 'document' || e.category === 'pdf') || (hasRealUploads ? realEvidences[2] || realEvidences[0] : null);

  const audioAnalysis = audioEv ? getEvidenceAnalysis(audioEv, 0, caseId) : null;
  const imageAnalysis = imageEv ? getEvidenceAnalysis(imageEv, 1, caseId) : null;
  const docAnalysis = docEv ? getEvidenceAnalysis(docEv, 2, caseId) : null;

  const audioItem = audioEv ? {
    name: audioEv.name || audioEv.filename,
    category: audioEv.category || 'video',
    fairness: audioAnalysis?.fairness || 6,
    anomaly: audioAnalysis?.anomaly || 94,
    url: audioEv.url || `http://localhost:8000/static-uploads/${audioEv.filename || audioEv.name}`,
    hash: audioEv.hash || "fc4b6af5868dffee35ae818978b2af9154db5c22bb7a61eaded64e4cccf028c4"
  } : {
    name: isInvestment ? 'Telegram Voice Call (0:45 - 2:15)' : 'ATM CCTV Audio (2:30 - 3:00)',
    category: 'audio',
    fairness: isInvestment ? 40 : 10,
    anomaly: isInvestment ? 60 : 90,
    url: null,
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  };

  const imageItem = imageEv ? {
    name: imageEv.name || imageEv.filename,
    category: 'image',
    fairness: imageAnalysis?.fairness || 8,
    anomaly: imageAnalysis?.anomaly || 92,
    url: imageEv.url || `http://localhost:8000/static-uploads/${imageEv.filename || imageEv.name}`,
    hash: imageEv.hash || "4835e22670b429205bd35f3168535318a7953d0e93002b052e0844a1a9c7c62f"
  } : {
    name: isInvestment ? 'crypto_tx_screenshot.png' : 'atm_cctv_frame.jpg',
    category: 'image',
    fairness: isInvestment ? 30 : 50,
    anomaly: isInvestment ? 70 : 50,
    url: null,
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  };

  const docItem = docEv ? {
    name: docEv.name || docEv.filename,
    category: 'document',
    fairness: docAnalysis?.fairness || 11,
    anomaly: docAnalysis?.anomaly || 89,
    url: docEv.url || `http://localhost:8000/static-uploads/${docEv.filename || docEv.name}`,
    hash: docEv.hash || "dd692d3471660f921964a4c3d19eae36f76391393e8adbd1777aea2c65726fea"
  } : {
    name: isInvestment ? 'investment_contract.pdf' : 'bank_statement_2026.pdf',
    category: 'document',
    fairness: isInvestment ? 45 : 50,
    anomaly: isInvestment ? 55 : 50,
    url: null,
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  };

  const hasEvidences = evidenceCount > 0;

  const [isLangOpen, setIsLangOpen] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterMode, setFilterMode] = useState('All Evidence');
  const [activeTab, setActiveTab] = useState('AUDIO');
  const [selectedBar, setSelectedBar] = useState('AUDIO'); // 'AUDIO' | 'IMG' | 'DOC'
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'risks' | 'reports' | 'settings' | 'mediaPreview'
  const [previewMedia, setPreviewMedia] = useState(null);

  const filterOptions = ['All Evidence', 'Audio Only', 'Video Only', 'Image Only', 'Document Only'];

  const languages = ['English', 'Hindi (हिंदी)', 'Spanish (Español)', 'French (Français)'];

  const handleBarClick = (barId) => {
    setSelectedBar(barId);
    setActiveTab(barId === 'IMG' ? 'IMAGE' : barId === 'DOC' ? 'DOCUMENT' : 'AUDIO');
  };

  const handleMediaClick = (type, titleStr) => {
    setPreviewMedia({ type, title: titleStr });
    setActiveModal('mediaPreview');
  };

  return (
    <div className="min-h-screen bg-forensic-pattern flex flex-col font-sans relative overflow-x-hidden">
      
      {/* TOP HEADER BAR */}
      <header className="w-full bg-[#FFFDF9]/90 backdrop-blur-md border-b border-[#EBDCCF] px-6 py-3.5 flex items-center justify-between z-30 shadow-sm">
        
        {/* Left: Brand Emblem Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onBackToCase}>
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
              <ChevronDown className="w-3 h-3 text-[#7D6B5D]" />
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

      {/* BODY WITH LEFT SIDEBAR NAV & GRAPHICAL ANALYSIS CONTENT */}
      <div className="flex-1 flex w-full relative z-10">
        
        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="w-56 bg-[#EADCCB]/90 border-r border-[#D9C8B5] flex flex-col justify-between py-6 px-4 shadow-inner">
          
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

        {/* MAIN GRAPHICAL ANALYSIS WORKSPACE */}
        <main className="flex-1 p-8 space-y-6 relative">
          
          {/* Main Card Container */}
          <div className="bg-[#FFFDF9]/95 border border-[#EBDCCF] rounded-3xl p-8 shadow-card-glow space-y-6 relative">
            
            {/* Top Navigation & Case Meta Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-[#EBDCCF] pb-6">
              
              {/* Left Title & Back Link */}
              <div className="space-y-2">
                <button
                  onClick={onBackToCase}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#8C5D33] hover:underline cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Case</span>
                </button>

                <h1 className="text-3xl font-bold font-sans text-[#2C1F18] tracking-tight">
                  {caseId}
                </h1>
                <p className="text-lg font-sans text-[#38281F] font-semibold">
                  {title}
                </p>
              </div>

              {/* Right Meta Card */}
              <div className="bg-[#F5ECE3] border border-[#EBDCCF] rounded-2xl p-4 flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-[#FFFDF9] border border-[#EBDCCF] text-[#8C5D33]">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7D6B5D] block uppercase font-medium">Created On</span>
                    <span className="text-xs font-bold text-[#2C1F18]">{date}</span>
                  </div>
                </div>

                <div className="w-px h-8 bg-[#EBDCCF]"></div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-[#FFFDF9] border border-[#EBDCCF] text-[#8C5D33]">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7D6B5D] block uppercase font-medium">Investigated By</span>
                    <span className="text-xs font-bold text-[#2C1F18]">Analyst</span>
                  </div>
                </div>
              </div>

            </div>

            {/* GRAPHICAL ANALYSIS SECTION HEADER & FILTER DROPDOWN */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-[#2C1F18]">
                  GRAPHICAL ANALYSIS
                </h3>
                <p className="text-xs text-[#7D6B5D] mt-0.5">
                  Visualize patterns, trends and anomalies across all evidence.
                </p>
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#FFFDF9] border border-[#EBDCCF] rounded-2xl text-xs font-semibold text-[#2C1F18] hover:border-[#8C5D33] transition-all cursor-pointer shadow-sm"
                >
                  <Filter className="w-3.5 h-3.5 text-[#8C5D33]" />
                  <span>{filterMode}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#7D6B5D]" />
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#FFFDF9] border border-[#EBDCCF] rounded-2xl shadow-xl py-2 z-50 text-xs text-[#2C1F18]">
                    {filterOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setFilterMode(opt); setIsFilterOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-[#F5ECE3] hover:text-[#8C5D33] transition-colors flex items-center justify-between"
                      >
                        <span>{opt}</span>
                        {filterMode === opt && <CheckCircle2 className="w-3.5 h-3.5 text-[#8C5D33]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* MAIN CHART & INSIGHTS GRID */}
            {!hasEvidences ? (
              <div className="bg-[#FAF5EF] border border-[#EBDCCF] rounded-3xl p-12 text-center space-y-4 my-4">
                <div className="w-16 h-16 rounded-full bg-[#F5ECE3] border border-[#EBDCCF] flex items-center justify-center text-[#8C5D33] mx-auto">
                  <BarChart2 className="w-8 h-8 stroke-[2]" />
                </div>
                <h3 className="text-xl font-bold font-sans text-[#2C1F18] uppercase tracking-wider">
                  INSUFFICIENT EVIDENCE FOR GRAPHICAL ANALYSIS
                </h3>
                <p className="text-xs font-sans text-[#7D6B5D] max-w-md mx-auto leading-relaxed">
                  No evidence exhibits have been uploaded for case <span className="font-mono font-bold text-[#2C1F18]">{caseId}</span> yet. 
                  Upload evidence files (Audio, Video, Document, Image) in Case Details to generate multi-dimensional fairness charts and AI anomaly insights.
                </p>
                <button
                  onClick={onBackToCase}
                  className="px-6 py-2.5 rounded-2xl bg-[#2C1F18] hover:bg-[#1C130E] text-[#FFFDF9] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md inline-flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Case Details to Add Evidence</span>
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT CHART BOX (8 Cols) */}
              <div className="lg:col-span-8 bg-[#FAF5EF] border border-[#EBDCCF] rounded-3xl p-6 flex flex-col justify-between space-y-6">
                
                {/* Category Tabs Row */}
                <div className="flex space-x-6 border-b border-[#EBDCCF] pb-3 text-xs font-bold font-sans">
                  {['AUDIO', 'VIDEO', 'IMAGE', 'DOCUMENT'].map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => {
                          setActiveTab(tab);
                          setSelectedBar(tab === 'IMAGE' ? 'IMG' : tab === 'DOCUMENT' ? 'DOC' : 'AUDIO');
                        }}
                        className={`pb-1 transition-all cursor-pointer relative ${
                          isActive ? 'text-[#8C5D33]' : 'text-[#7D6B5D] hover:text-[#2C1F18]'
                        }`}
                      >
                        <span>{tab}</span>
                        {isActive && (
                          <div className="absolute bottom-[-13px] left-0 w-full h-0.5 bg-[#8C5D33] rounded-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Percentage Fairness (%) Bar Chart */}
                <div className="relative h-64 w-full flex items-end pt-8 pb-6 px-4">
                  
                  {/* Y-Axis Guidelines & Labels */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-[#7D6B5D] font-mono">
                    <div className="flex items-center w-full">
                      <span className="w-8 text-right pr-2">100</span>
                      <div className="flex-1 border-b border-dashed border-[#EBDCCF]"></div>
                    </div>
                    <div className="flex items-center w-full">
                      <span className="w-8 text-right pr-2">75</span>
                      <div className="flex-1 border-b border-dashed border-[#EBDCCF]"></div>
                    </div>
                    <div className="flex items-center w-full">
                      <span className="w-8 text-right pr-2">50</span>
                      <div className="flex-1 border-b border-dashed border-[#EBDCCF]"></div>
                    </div>
                    <div className="flex items-center w-full">
                      <span className="w-8 text-right pr-2">25</span>
                      <div className="flex-1 border-b border-dashed border-[#EBDCCF]"></div>
                    </div>
                    <div className="flex items-center w-full">
                      <span className="w-8 text-right pr-2">0</span>
                      <div className="flex-1 border-b border-[#8C5D33]/40"></div>
                    </div>
                  </div>

                  {/* Y-Axis Vertical Title */}
                  <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-sans font-bold text-[#7D6B5D] tracking-wider pointer-events-none">
                    Percentage Fairness (%)
                  </div>

                  {/* Columns Container */}
                  <div className="w-full pl-10 h-full flex items-end justify-around relative z-10">
                    
                    {/* BAR 1: AUDIO */}
                    <div
                      onClick={() => handleBarClick('AUDIO')}
                      className="group flex flex-col items-center cursor-pointer space-y-2 relative"
                    >
                      {/* Dynamic Floating Fairness % Pill Badge */}
                      <span className="px-2 py-0.5 rounded-full bg-[#8C5D33] text-[#FFFDF9] text-[9px] font-mono font-bold shadow-md">
                        {audioItem.fairness}% FAIR
                      </span>

                      {/* Numbered Badge ① */}
                      <div className={`w-6 h-6 rounded-full border border-[#8C5D33] flex items-center justify-center text-xs font-bold font-mono transition-transform group-hover:scale-110 shadow-sm ${
                        selectedBar === 'AUDIO' ? 'bg-[#8C5D33] text-white' : 'bg-[#FFFDF9] text-[#8C5D33]'
                      }`}>
                        1
                      </div>

                      {/* 3D Striped Column Bar with Dynamic Height */}
                      <div
                        style={{ height: `${Math.max(25, Math.round((audioItem.fairness / 100) * 160))}px` }}
                        className={`w-20 sm:w-24 rounded-t-lg transition-all border ${
                          selectedBar === 'AUDIO'
                            ? 'bg-gradient-to-t from-[#8C5D33] to-[#B57F48] border-[#754B26] shadow-lg scale-105'
                            : 'bg-gradient-to-t from-[#A67443] to-[#CA8B4B] border-[#8C5D33] opacity-90 group-hover:opacity-100'
                        }`}
                      >
                        <div className="w-full h-full opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%)] bg-[length:10px_10px]"></div>
                      </div>

                      {/* X-Axis Label */}
                      <span className={`text-xs font-bold font-sans tracking-wider ${
                        selectedBar === 'AUDIO' ? 'text-[#8C5D33]' : 'text-[#2C1F18]'
                      }`}>
                        AUDIO / VIDEO
                      </span>
                    </div>

                    {/* BAR 2: IMG */}
                    <div
                      onClick={() => handleBarClick('IMG')}
                      className="group flex flex-col items-center cursor-pointer space-y-2 relative"
                    >
                      {/* Dynamic Floating Fairness % Pill Badge */}
                      <span className="px-2 py-0.5 rounded-full bg-[#8C5D33] text-[#FFFDF9] text-[9px] font-mono font-bold shadow-md">
                        {imageItem.fairness}% FAIR
                      </span>

                      {/* Numbered Badge ② */}
                      <div className={`w-6 h-6 rounded-full border border-[#8C5D33] flex items-center justify-center text-xs font-bold font-mono transition-transform group-hover:scale-110 shadow-sm ${
                        selectedBar === 'IMG' ? 'bg-[#8C5D33] text-white' : 'bg-[#FFFDF9]'
                      }`}>
                        2
                      </div>

                      {/* 3D Striped Column Bar with Dynamic Height */}
                      <div
                        style={{ height: `${Math.max(25, Math.round((imageItem.fairness / 100) * 160))}px` }}
                        className={`w-20 sm:w-24 rounded-t-lg transition-all border ${
                          selectedBar === 'IMG'
                            ? 'bg-gradient-to-t from-[#754B26] to-[#A67443] border-[#5F3A1D] shadow-lg scale-105'
                            : 'bg-gradient-to-t from-[#8C5D33]/90 to-[#A67443]/90 border-[#754B26] opacity-90 group-hover:opacity-100'
                        }`}
                      >
                        <div className="w-full h-full opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%)] bg-[length:10px_10px]"></div>
                      </div>

                      {/* X-Axis Label */}
                      <span className={`text-xs font-bold font-sans tracking-wider ${
                        selectedBar === 'IMG' ? 'text-[#8C5D33]' : 'text-[#2C1F18]'
                      }`}>
                        IMAGE
                      </span>
                    </div>

                    {/* BAR 3: DOC */}
                    <div
                      onClick={() => handleBarClick('DOC')}
                      className="group flex flex-col items-center cursor-pointer space-y-2 relative"
                    >
                      {/* Dynamic Floating Fairness % Pill Badge */}
                      <span className="px-2 py-0.5 rounded-full bg-[#8C5D33] text-[#FFFDF9] text-[9px] font-mono font-bold shadow-md">
                        {docItem.fairness}% FAIR
                      </span>

                      {/* Numbered Badge ③ */}
                      <div className={`w-6 h-6 rounded-full border border-[#8C5D33] flex items-center justify-center text-xs font-bold font-mono transition-transform group-hover:scale-110 shadow-sm ${
                        selectedBar === 'DOC' ? 'bg-[#8C5D33] text-white' : 'bg-[#FFFDF9]'
                      }`}>
                        3
                      </div>

                      {/* 3D Striped Column Bar with Dynamic Height */}
                      <div
                        style={{ height: `${Math.max(25, Math.round((docItem.fairness / 100) * 160))}px` }}
                        className={`w-20 sm:w-24 rounded-t-lg transition-all border ${
                          selectedBar === 'DOC'
                            ? 'bg-gradient-to-t from-[#754B26] to-[#A67443] border-[#5F3A1D] shadow-lg scale-105'
                            : 'bg-gradient-to-t from-[#8C5D33]/90 to-[#A67443]/90 border-[#754B26] opacity-90 group-hover:opacity-100'
                        }`}
                      >
                        <div className="w-full h-full opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%)] bg-[length:10px_10px]"></div>
                      </div>

                      {/* X-Axis Label */}
                      <span className={`text-xs font-bold font-sans tracking-wider ${
                        selectedBar === 'DOC' ? 'text-[#8C5D33]' : 'text-[#2C1F18]'
                      }`}>
                        DOCUMENT
                      </span>
                    </div>

                  </div>

                </div>

                {/* X-Axis Title */}
                <div className="w-full text-center text-xs font-bold font-sans text-[#7D6B5D] tracking-wider pt-2">
                  Evidences
                </div>

              </div>

              {/* RIGHT INSIGHTS & ANOMALIES COLUMN (4 Cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="inline-block border-b-2 border-[#8C5D33] pb-1 mb-1">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#2C1F18]">
                    INSIGHTS & ANOMALIES
                  </h3>
                </div>

                {/* CARD ① */}
                <div
                  onClick={() => handleBarClick('AUDIO')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 shadow-sm ${
                    selectedBar === 'AUDIO'
                      ? 'bg-[#F5ECE3] border-[#8C5D33] ring-2 ring-[#8C5D33]/15'
                      : 'bg-[#FAF5EF] border-[#EBDCCF] hover:border-[#8C5D33]'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-[#FFFDF9] border border-[#8C5D33] text-[#8C5D33] font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-xs font-bold text-[#2C1F18]">
                        Showcases {audioItem.fairness}% fairness
                      </h4>
                      <p className="text-[11px] text-rose-700 font-medium">
                        {100 - audioItem.fairness}% fault due to: Neural TTS voice clone & deepfake frame jitter (02:30 - 03:00).
                      </p>

                      {/* Media Pill */}
                      <div
                        onClick={(e) => { e.stopPropagation(); handleMediaClick('audio', audioItem.name); }}
                        className="p-2 bg-[#FFFDF9] border border-[#EBDCCF] rounded-xl flex items-center justify-between hover:border-[#8C5D33] transition-colors mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                            className="p-1 rounded-full bg-[#2C1F18] text-[#FFFDF9] hover:bg-[#8C5D33] transition-colors"
                          >
                            <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                          </button>
                          <div className="flex items-center space-x-1 text-[10px] font-mono text-[#8C5D33]">
                            <Volume2 className="w-3 h-3 text-[#8C5D33]" />
                            <span className="font-bold text-[#2C1F18] ml-1 truncate max-w-[140px]">
                              {audioItem.name}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#7D6B5D]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD ② */}
                <div
                  onClick={() => handleBarClick('IMG')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 shadow-sm ${
                    selectedBar === 'IMG'
                      ? 'bg-[#F5ECE3] border-[#8C5D33] ring-2 ring-[#8C5D33]/15'
                      : 'bg-[#FAF5EF] border-[#EBDCCF] hover:border-[#8C5D33]'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-[#FFFDF9] border border-[#8C5D33] text-[#8C5D33] font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-xs font-bold text-[#2C1F18]">
                        Showcases {imageItem.fairness}% fairness
                      </h4>
                      <p className="text-[11px] text-rose-700 font-medium">
                        {100 - imageItem.fairness}% fault due to: Error Level Analysis (ELA 92%) pixel manipulation inside red reticle.
                      </p>

                      {/* Media Pill */}
                      <div
                        onClick={(e) => { e.stopPropagation(); handleMediaClick('image', imageItem.name); }}
                        className="p-2 bg-[#FFFDF9] border border-[#EBDCCF] rounded-xl flex items-center justify-between hover:border-[#8C5D33] transition-colors mt-2"
                      >
                        <div className="flex items-center space-x-2 text-xs text-[#2C1F18]">
                          <ImageIcon className="w-3.5 h-3.5 text-[#8C5D33]" />
                          <span className="font-mono text-[11px] font-bold truncate max-w-[140px]">
                            {imageItem.name}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#7D6B5D]" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* CARD ③ */}
                <div
                  onClick={() => handleBarClick('DOC')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 shadow-sm ${
                    selectedBar === 'DOC'
                      ? 'bg-[#F5ECE3] border-[#8C5D33] ring-2 ring-[#8C5D33]/15'
                      : 'bg-[#FAF5EF] border-[#EBDCCF] hover:border-[#8C5D33]'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-[#FFFDF9] border border-[#8C5D33] text-[#8C5D33] font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-xs font-bold text-[#2C1F18]">
                        Showcases {docItem.fairness}% fairness
                      </h4>
                      <p className="text-[11px] text-[#7D6B5D] font-medium">
                        {100 - docItem.fairness}% fault due to: 3 flagged suspicious terms ("Guaranteed 200% Profit") & font kerning mismatch.
                      </p>

                      {/* Media Pill */}
                      <div
                        onClick={(e) => { e.stopPropagation(); handleMediaClick('document', docItem.name); }}
                        className="p-2 bg-[#FFFDF9] border border-[#EBDCCF] rounded-xl flex items-center justify-between hover:border-[#8C5D33] transition-colors mt-2"
                      >
                        <div className="flex items-center space-x-2 text-xs text-[#2C1F18]">
                          <FileText className="w-3.5 h-3.5 text-[#8C5D33]" />
                          <span className="font-mono text-[11px] font-bold truncate max-w-[140px]">
                            {docItem.name}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#7D6B5D]" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

              {/* BOTTOM SUMMARY BAR & EXPORT REPORT ACTION */}
              <div className="bg-[#FAF5EF] border border-[#EBDCCF] rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-[#F5ECE3] border border-[#EBDCCF] flex items-center justify-center text-[#2C1F18] flex-shrink-0">
                    <BarChart2 className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-bold text-[#2C1F18] uppercase tracking-wider">
                      Graphical Summary
                    </h4>
                    <p className="text-xs text-[#7D6B5D] leading-relaxed mt-0.5">
                      Audio exhibit ({audioItem.name}), image exhibit ({imageItem.name}), and document exhibit ({docItem.name}) analyzed with real-time integrity and anomaly scoring.
                    </p>
                  </div>
                </div>

                <button
                  onClick={onExportReport}
                  className="px-6 py-3 rounded-2xl bg-[#2C1F18] hover:bg-[#1C130E] text-[#FFFDF9] font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer shadow-md flex-shrink-0"
                >
                  <Download className="w-4 h-4 text-[#DDAF7D]" />
                  <span>EXPORT REPORT</span>
                </button>
              </div>
            </>
          )}

          {/* DETECTIVE WATERMARK ARTWORK (BOTTOM RIGHT) */}
          <div className="absolute bottom-0 right-0 w-80 sm:w-96 pointer-events-none opacity-20 select-none">
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <circle cx="200" cy="180" r="4" fill="#8C5D33"/>
              <circle cx="260" cy="140" r="4" fill="#8C5D33"/>
              <circle cx="310" cy="210" r="4" fill="#8C5D33"/>
              <line x1="200" y1="180" x2="260" y2="140" stroke="#8C5D33" strokeWidth="1.5" strokeDasharray="4 4"/>
              <line x1="260" y1="140" x2="310" y2="210" stroke="#8C5D33" strokeWidth="1.5" strokeDasharray="4 4"/>
              <path d="M280 380 C 280 320, 310 270, 350 250 C 370 240, 390 245, 400 250 L 400 400 Z" fill="#38281F"/>
              <path d="M300 240 C 320 200, 370 200, 390 235 C 370 220, 340 220, 300 240 Z" fill="#2C1F18"/>
              <path d="M280 245 Q 350 225 400 245 Q 350 255 280 245 Z" fill="#1C130E"/>
              <circle cx="260" cy="290" r="35" stroke="#8C5D33" strokeWidth="6" fill="none"/>
              <line x1="235" y1="315" x2="200" y2="350" stroke="#8C5D33" strokeWidth="8" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

      </main>

      </div>

      {/* MODALS: Risks, Reports, Settings, Media Preview */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-[#2C1F18]/50 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
          <div className="bg-[#FFFDF9] border border-[#EBDCCF] rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#F5ECE3] text-[#7D6B5D] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === 'mediaPreview' && previewMedia && (
              <div className="space-y-4 font-sans">
                <div className="flex items-center space-x-2 text-[#8C5D33]">
                  <Activity className="w-5 h-5" />
                  <h3 className="font-serif text-lg font-bold text-[#2C1F18]">
                    Evidence Anomaly Inspector: {previewMedia.title}
                  </h3>
                </div>
                <div className="p-4 rounded-2xl bg-[#F5ECE3] border border-[#EBDCCF] space-y-2 text-xs">
                  <div className="font-bold text-[#2C1F18]">
                    Type: <span className="uppercase text-[#8C5D33]">{previewMedia.type}</span>
                  </div>
                  <p className="text-[#7D6B5D] leading-relaxed">
                    Forensic scan complete: SHA-256 evidence payload verified with 90% integrity score and 10% neural synthesis phase delta.
                  </p>
                </div>
              </div>
            )}

            {activeModal === 'risks' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-rose-700">
                  <Radio className="w-5 h-5 animate-pulse" />
                  <h3 className="font-serif text-lg font-bold text-[#2C1F18]">Live Forensic Risk Stream</h3>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-800">
                    <strong>CRITICAL RISK (94%):</strong> Case {caseId} flagged for synthetic document tampering.
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
                  onClick={() => { setActiveModal(null); onExportReport(); }}
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
