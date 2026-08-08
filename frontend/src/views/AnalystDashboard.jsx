import React, { useState } from 'react';
import { 
  Search, 
  Globe, 
  Lock, 
  AlertTriangle, 
  FileText, 
  Settings, 
  LogOut, 
  Plus, 
  ChevronDown,
  CheckCircle2,
  X,
  Radio,
  Download,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import CaseDossierBook from '../components/CaseDossierBook';
import LiveFeedBanner from '../components/LiveFeedBanner';
import LiveTickerBar from '../components/LiveTickerBar';
import OsintLookupModal from '../components/OsintLookupModal';
import { useWebSocket } from '../hooks/useWebSocket';

import { DEFAULT_CASES } from '../data/defaultCases';

export default function AnalystDashboard({ onSelectCase, onOpenUpload, onExportPdf }) {
  const { logout, investigatorId } = useAuth();
  const { language, setLanguage, privacyRedacted, togglePrivacy, t } = useTheme();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isOsintOpen, setIsOsintOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'risks' | 'reports' | 'settings'
  const [searchQuery, setSearchQuery] = useState('');

  const [casesList, setCasesList] = useState(
    DEFAULT_CASES.map(c => ({
      caseId: c.case_id || c.caseId,
      title: c.title,
      date: c.date || '08 Aug 2026'
    }))
  );

  // Handle incoming real-time WebSocket events
  const handleWebSocketMessage = React.useCallback((data) => {
    if (data.event === 'NEW_CASE_INGESTED' && data.case) {
      const newBook = {
        caseId: data.case.case_id || data.case.caseId,
        title: data.case.title,
        date: data.case.date || '08 Aug 2026'
      };
      setCasesList(prev => [newBook, ...prev.filter(c => c.caseId !== newBook.caseId)]);
    }
  }, []);

  const { isConnected } = useWebSocket('ws://localhost:8000/ws/cases', handleWebSocketMessage);

  React.useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/cases");
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const formatted = data.map(c => ({
            caseId: c.case_id || c.caseId,
            title: c.title,
            date: c.date || '08 Aug 2026'
          }));
          setCasesList(formatted);
        }
      }
    } catch (err) {
      console.log("Backend offline, using default cases.");
    }
  };

  const filteredCases = casesList.filter(c => 
    (c.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.caseId || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const languages = ['English', 'Hindi (हिंदी)', 'Marathi (मराठी)'];

  const handleSelectLanguage = (langStr) => {
    let target = 'English';
    if (langStr.includes('Hindi')) target = 'Hindi (हिंदी)';
    else if (langStr.includes('Marathi')) target = 'Marathi (मराठी)';
    setLanguage(target);
    setIsLangOpen(false);
  };

  return (
    <div className="min-h-screen bg-forensic-pattern flex flex-col font-sans relative overflow-x-hidden">
      
      {/* TOP HEADER BAR */}
      <header className="w-full bg-[#FFFDF9]/90 backdrop-blur-md border-b border-[#EBDCCF] px-6 py-3.5 flex items-center justify-between z-30 shadow-sm">
        
        {/* Left: Brand Emblem Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectCase(null)}>
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
              {t('brand_sub')}
            </div>
          </div>
        </div>

        {/* Center: Search Input Bar */}
        <div className="flex-1 max-w-xl mx-8 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7D6B5D]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search_placeholder')}
            className="w-full pl-10 pr-4 py-2 bg-[#F5ECE3] border border-[#EBDCCF] rounded-2xl text-xs text-[#2C1F18] placeholder-[#7D6B5D] focus:outline-none focus:border-[#8C5D33] focus:ring-2 focus:ring-[#8C5D33]/15 transition-all"
          />
        </div>

        {/* Right: OSINT Search, Live Feed Status, Language Selector & Login Badge */}
        <div className="flex items-center space-x-3">
          
          {/* OSINT Threat Intelligence Button */}
          <button
            onClick={() => setIsOsintOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-[#FFFDF9] bg-[#2C1F18] border border-[#8C5D33]/60 rounded-xl hover:bg-[#8C5D33] transition-all cursor-pointer shadow-md uppercase tracking-wider"
          >
            <Globe className="w-3.5 h-3.5 text-[#DDAF7D]" />
            <span>OSINT LOOKUP</span>
          </button>

          {/* Live Feed Banner Status Indicator */}
          <LiveFeedBanner isConnected={isConnected} liveCount={casesList.length} />

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
                    onClick={() => handleSelectLanguage(lang)}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#F5ECE3] hover:text-[#8C5D33] transition-colors flex items-center justify-between"
                  >
                    <span>{lang}</span>
                    {language === lang && <CheckCircle2 className="w-3.5 h-3.5 text-[#8C5D33]" />}
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

      {/* LIVE CYBERCRIME TELEMETRY TICKER BAR */}
      <LiveTickerBar />

      {/* LIVE OSINT THREAT LOOKUP MODAL */}
      <OsintLookupModal isOpen={isOsintOpen} onClose={() => setIsOsintOpen(false)} />

      {/* BODY WITH LEFT SIDEBAR NAV & MAIN CASES AREA */}
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
              <span className="group-hover:text-[#8C5D33] transition-colors">{t('risks')}</span>
            </button>

            {/* Reports Button */}
            <button
              onClick={() => setActiveModal('reports')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#2C1F18] hover:bg-[#FAF5EF] transition-all cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-xl bg-[#8C5D33]/15 border border-[#8C5D33]/30 flex items-center justify-center text-[#8C5D33] group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <span className="group-hover:text-[#8C5D33] transition-colors">{t('reports')}</span>
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setActiveModal('settings')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#2C1F18] hover:bg-[#FAF5EF] transition-all cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-xl bg-[#8C5D33]/15 border border-[#8C5D33]/30 flex items-center justify-center text-[#8C5D33] group-hover:scale-105 transition-transform">
                <Settings className="w-4 h-4" />
              </div>
              <span className="group-hover:text-[#8C5D33] transition-colors">{t('settings')}</span>
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
              <span>{t('logout')}</span>
            </button>
          </div>

        </aside>

        {/* MAIN WORKSPACE AREA */}
        <main className="flex-1 p-8 space-y-8 relative">
          
          {/* Welcome Header */}
          <div className="space-y-1 border-b border-[#EBDCCF] pb-4">
            <h1 className="text-3xl sm:text-4xl font-bold font-sans text-[#2C1F18] tracking-tight">
              {t('welcome')}
            </h1>
            <p className="text-sm font-sans text-[#7D6B5D]">
              {t('welcome_sub')}
            </p>
          </div>

          {/* Section: YOUR CASES */}
          <div className="space-y-6">
            <div className="inline-block">
              <h3 className="text-xs font-bold font-sans uppercase tracking-widest text-[#2C1F18]">
                {t('your_cases')}
              </h3>
              <div className="w-full h-0.5 bg-[#8C5D33] mt-1 rounded-full"></div>
            </div>

            {/* 3D Case Dossier Books Grid Row */}
            <div className="flex flex-wrap items-center gap-6">
              {filteredCases.map((c) => (
                <CaseDossierBook
                  key={c.caseId}
                  caseId={c.caseId}
                  title={c.title}
                  date={c.date}
                  onClick={() => onSelectCase(c.caseId)}
                />
              ))}
            </div>
          </div>

          {/* Section: CREATE NEW CASE CARD */}
          <div className="pt-2">
            <div
              onClick={onOpenUpload}
              className="w-48 h-64 rounded-2xl border-2 border-dashed border-[#C8B393] bg-[#FFFDF9]/60 hover:bg-[#FFFDF9] hover:border-[#8C5D33] transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer shadow-sm group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#F5ECE3] border border-[#EBDCCF] flex items-center justify-center text-[#8C5D33] mb-3 group-hover:scale-110 transition-transform">
                <Plus className="w-7 h-7 stroke-[2.5]" />
              </div>
              <span className="font-sans text-xs font-bold text-[#2C1F18] tracking-wider uppercase group-hover:text-[#8C5D33] transition-colors leading-relaxed">
                {t('create_new_case')}
              </span>
            </div>
          </div>

          {/* DETECTIVE WATERMARK ARTWORK (BOTTOM RIGHT) */}
          <div className="absolute bottom-0 right-0 w-80 sm:w-96 pointer-events-none opacity-20 select-none">
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              {/* Crime Map Nodes */}
              <circle cx="200" cy="180" r="4" fill="#8C5D33"/>
              <circle cx="260" cy="140" r="4" fill="#8C5D33"/>
              <circle cx="310" cy="210" r="4" fill="#8C5D33"/>
              <line x1="200" y1="180" x2="260" y2="140" stroke="#8C5D33" strokeWidth="1.5" strokeDasharray="4 4"/>
              <line x1="260" y1="140" x2="310" y2="210" stroke="#8C5D33" strokeWidth="1.5" strokeDasharray="4 4"/>

              {/* Detective Figure Silhouette Outline */}
              <path d="M280 380 C 280 320, 310 270, 350 250 C 370 240, 390 245, 400 250 L 400 400 Z" fill="#38281F"/>
              {/* Fedora Hat */}
              <path d="M300 240 C 320 200, 370 200, 390 235 C 370 220, 340 220, 300 240 Z" fill="#2C1F18"/>
              <path d="M280 245 Q 350 225 400 245 Q 350 255 280 245 Z" fill="#1C130E"/>

              {/* Magnifying Glass */}
              <circle cx="260" cy="290" r="35" stroke="#8C5D33" strokeWidth="6" fill="none"/>
              <line x1="235" y1="315" x2="200" y2="350" stroke="#8C5D33" strokeWidth="8" strokeLinecap="round"/>
            </svg>
          </div>

        </main>

      </div>

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
                    <strong>CRITICAL RISK (94%):</strong> Case CR-2026-002 flagged for synthetic Aadhaar document forgery.
                  </div>
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900">
                    <strong>HIGH RISK (88%):</strong> Case CR-2026-001 flagged for ElevenLabs neural TTS voice clone vishing attack.
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
                  <span>Export Current Court Dossier (PDF)</span>
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
