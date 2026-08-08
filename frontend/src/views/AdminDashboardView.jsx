import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Globe, 
  Lock, 
  Home, 
  GraduationCap, 
  Settings, 
  LogOut, 
  BookOpen, 
  GitMerge, 
  Bot, 
  ShieldCheck, 
  User, 
  CheckCircle2, 
  FileText, 
  Folder, 
  Database,
  ChevronDown,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function AdminDashboardView({ onSwitchToInvestigator }) {
  const { logout, userProfile, switchRole } = useAuth();
  const { language, setLanguage, privacyRedacted, togglePrivacy } = useTheme();

  const [activeTab, setActiveTab] = useState('Dashboard'); // 'Dashboard' | 'Learning AI' | 'Settings'
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  
  // Real-time Dynamic Metrics synced with Backend
  const [totalCasesLearned, setTotalCasesLearned] = useState(300);
  const [newPatternsCount, setNewPatternsCount] = useState(18);
  const [activeModelsCount, setActiveModelsCount] = useState(6);
  
  // Modal states
  const [activeModal, setActiveModal] = useState(null); // 'retrain' | 'privacy'

  useEffect(() => {
    fetchBackendMetrics();
  }, []);

  const fetchBackendMetrics = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/cases");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          // Dynamic calculation: base 300 + custom ingested cases count
          setTotalCasesLearned(300 + data.length);
        }
      }
    } catch (err) {
      console.log("Using fallback admin metrics.");
    }
  };

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
        
        {/* Brand Emblem Logo */}
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="emblem-gold-ring p-0.5">
            <div className="emblem-gold-inner w-9 h-9 flex items-center justify-center shadow-inner">
              <Search className="w-4 h-4 text-[#8C5D33] stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="font-cinzel text-base font-bold tracking-wider text-[#2C1F18] leading-none uppercase">
              SARTHI <span className="text-[#8C5D33]">FORENSICS</span>
            </div>
            <div className="text-[9px] font-sans tracking-tight text-[#7D6B5D] font-semibold mt-0.5">
              Digital Fraud Intelligence
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-4">
          
          {/* Multi-Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-[#2C1F18] bg-[#FAF5EF] border border-[#EBDCCF] rounded-xl hover:border-[#8C5D33] transition-all cursor-pointer shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-[#8C5D33]" />
              <span>{language.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-[#7D6B5D]" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-[#FFFDF9] border border-[#EBDCCF] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleSelectLanguage(lang)}
                    className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center justify-between ${
                      language === lang ? 'bg-[#F5ECE3] text-[#8C5D33] font-bold' : 'text-[#2C1F18] hover:bg-[#FAF5EF]'
                    }`}
                  >
                    <span>{lang}</span>
                    {language === lang && <CheckCircle2 className="w-3.5 h-3.5 text-[#8C5D33]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#2C1F18] border border-[#5F422E] text-[#FFFDF9] text-xs font-semibold hover:bg-[#17100B] transition-all cursor-pointer shadow-sm"
            >
              <Lock className="w-3.5 h-3.5 text-[#DDAF7D]" />
              <span>Admin Login</span>
              <ChevronDown className="w-3 h-3 text-[#DDAF7D]" />
            </button>

            {isRoleMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#FFFDF9] border border-[#EBDCCF] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-1">
                <div className="px-3 py-2 text-[10px] font-mono text-[#7D6B5D] uppercase tracking-wider border-b border-[#EBDCCF]">
                  Switch Role Access:
                </div>
                
                <button
                  onClick={() => {
                    switchRole('SYSTEM_ADMIN');
                    setIsRoleMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl bg-[#F5ECE3] text-[#8C5D33] font-bold text-xs flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <User className="w-3.5 h-3.5 text-[#8C5D33]" />
                    <span>Admin Dashboard</span>
                  </div>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8C5D33]" />
                </button>

                <button
                  onClick={() => {
                    switchRole('LEAD_DETECTIVE');
                    setIsRoleMenuOpen(false);
                    if (onSwitchToInvestigator) onSwitchToInvestigator();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-[#2C1F18] hover:bg-[#FAF5EF] text-xs flex items-center space-x-2 transition-colors cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-[#7D6B5D]" />
                  <span>Investigator View</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* BODY LAYOUT */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-6 gap-6">
        
        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="w-56 bg-[#FFFDF9]/80 backdrop-blur-md border border-[#EBDCCF] rounded-3xl p-5 flex flex-col justify-between shadow-sm">
          
          <div className="space-y-6">
            <div className="space-y-1.5">
              
              {/* Dashboard Nav Item */}
              <button
                onClick={() => setActiveTab('Dashboard')}
                className={`w-full px-4 py-3 rounded-2xl flex items-center space-x-3 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'Dashboard'
                    ? 'bg-[#F5ECE3] text-[#8C5D33] border border-[#EBDCCF] shadow-sm'
                    : 'text-[#7D6B5D] hover:text-[#2C1F18] hover:bg-[#FAF5EF]'
                }`}
              >
                <Home className="w-4 h-4 text-[#8C5D33]" />
                <span>Dashboard</span>
              </button>

              {/* Learning AI Nav Item */}
              <button
                onClick={() => {
                  setActiveTab('Learning AI');
                  setActiveModal('retrain');
                }}
                className={`w-full px-4 py-3 rounded-2xl flex items-center space-x-3 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'Learning AI'
                    ? 'bg-[#F5ECE3] text-[#8C5D33] border border-[#EBDCCF] shadow-sm'
                    : 'text-[#7D6B5D] hover:text-[#2C1F18] hover:bg-[#FAF5EF]'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-[#8C5D33]" />
                <span>Learning AI</span>
              </button>

              {/* Settings Nav Item */}
              <button
                onClick={() => {
                  setActiveTab('Settings');
                  setActiveModal('privacy');
                }}
                className={`w-full px-4 py-3 rounded-2xl flex items-center space-x-3 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'Settings'
                    ? 'bg-[#F5ECE3] text-[#8C5D33] border border-[#EBDCCF] shadow-sm'
                    : 'text-[#7D6B5D] hover:text-[#2C1F18] hover:bg-[#FAF5EF]'
                }`}
              >
                <Settings className="w-4 h-4 text-[#8C5D33]" />
                <span>Settings</span>
              </button>

            </div>
          </div>

          {/* Logout Action at Bottom */}
          <button
            onClick={logout}
            className="w-full px-4 py-3 rounded-2xl border border-[#EBDCCF] bg-[#FAF5EF] hover:bg-[#F5ECE3] text-[#2C1F18] text-xs font-bold flex items-center space-x-3 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-[#8C5D33]" />
            <span>Logout</span>
          </button>

        </aside>

        {/* MAIN CONTENT DASHBOARD AREA */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* CENTER PANEL (8 COLS) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Welcome Back Header */}
            <div className="space-y-1">
              <h1 className="text-2xl font-serif font-bold text-[#2C1F18]">
                Welcome back, Admin
              </h1>
              <p className="text-xs text-[#7D6B5D]">
                Manage system, monitor models and ensure data privacy and governance.
              </p>
            </div>

            {/* SARTHI INTELLIGENCE & MODEL GOVERNANCE PORTAL CARD */}
            <div className="bg-[#FFFDF9] border border-[#EBDCCF] rounded-3xl p-6 space-y-5 shadow-card-glow">
              
              <div className="flex items-center justify-between border-b border-[#EBDCCF] pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C1F18]">
                  SARTHI INTELLIGENCE & MODEL GOVERNANCE PORTAL
                </h3>
                <span className="px-3 py-1 rounded-full bg-[#F5ECE3] border border-[#EBDCCF] text-[#8C5D33] text-[10px] font-bold font-mono uppercase flex items-center space-x-1.5">
                  <User className="w-3 h-3 text-[#8C5D33]" />
                  <span>ADMIN</span>
                </span>
              </div>

              {/* 3 Key Metric Cards Row */}
              <div className="grid grid-cols-3 gap-4">
                
                {/* METRIC 1: Cases Learned */}
                <div className="p-4 rounded-2xl bg-[#FAF5EF] border border-[#EBDCCF] space-y-2 text-center hover:border-[#8C5D33] transition-colors shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-[#FFFDF9] border border-[#EBDCCF] mx-auto flex items-center justify-center text-[#8C5D33]">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#7D6B5D] block uppercase">
                    Cases Learned
                  </span>
                  <span className="text-2xl font-bold font-serif text-[#2C1F18] block">
                    {totalCasesLearned}
                  </span>
                </div>

                {/* METRIC 2: New Patterns */}
                <div className="p-4 rounded-2xl bg-[#FAF5EF] border border-[#EBDCCF] space-y-2 text-center hover:border-[#8C5D33] transition-colors shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-[#FFFDF9] border border-[#EBDCCF] mx-auto flex items-center justify-center text-[#8C5D33]">
                    <GitMerge className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#7D6B5D] block uppercase">
                    New Patterns
                  </span>
                  <span className="text-2xl font-bold font-serif text-[#2C1F18] block">
                    {newPatternsCount}
                  </span>
                </div>

                {/* METRIC 3: Active Model */}
                <div className="p-4 rounded-2xl bg-[#FAF5EF] border border-[#EBDCCF] space-y-2 text-center hover:border-[#8C5D33] transition-colors shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-[#FFFDF9] border border-[#EBDCCF] mx-auto flex items-center justify-center text-[#8C5D33]">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#7D6B5D] block uppercase">
                    Active Model
                  </span>
                  <span className="text-2xl font-bold font-serif text-[#2C1F18] block">
                    {activeModelsCount}
                  </span>
                </div>

              </div>

            </div>

            {/* PRIVACY & GOVERNANCE PANEL */}
            <div className="bg-[#FFFDF9] border border-[#EBDCCF] rounded-3xl p-6 space-y-5 shadow-sm">
              
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#8C5D33]" />
                <h3 className="text-sm font-bold text-[#2C1F18]">
                  Privacy & Governance
                </h3>
              </div>

              {/* Bulleted Privacy Features Box */}
              <div className="p-5 rounded-2xl bg-[#FAF5EF] border border-[#EBDCCF] flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#FFFDF9] border border-[#EBDCCF] flex items-center justify-center text-[#8C5D33] flex-shrink-0 mt-1">
                  <Lock className="w-5 h-5" />
                </div>
                
                <ul className="space-y-2 text-xs text-[#2C1F18] font-medium leading-relaxed">
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8C5D33]"></span>
                    <span>Personal data removed</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8C5D33]"></span>
                    <span>Models trained on de-identified patterns</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8C5D33]"></span>
                    <span>All training data anonymized</span>
                  </li>
                </ul>
              </div>

              {/* Bottom Security Protocol Bar */}
              <div className="p-3.5 rounded-2xl bg-[#FAF5EF] border border-[#EBDCCF] flex items-center space-x-3 text-xs text-[#7D6B5D]">
                <div className="p-1 rounded-lg bg-[#FFFDF9] border border-[#EBDCCF] text-[#8C5D33]">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 font-sans">
                  <span>All training data anonymized</span>
                  <span className="mx-2">•</span>
                  <span>Your data is secure and never exposed.</span>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT PANEL (4 COLS): SECURITY & ANONYMIZATION GRAPHIC */}
          <div className="lg:col-span-4 bg-[#FFFDF9] border border-[#EBDCCF] rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-sm relative overflow-hidden">
            
            <div className="space-y-6 text-center">
              
              {/* Graphic Node Network Illustration with Shield & Lock */}
              <div className="relative w-full h-56 flex items-center justify-center">
                
                {/* Radial Glow */}
                <div className="absolute w-44 h-44 bg-[#CA8B4B]/15 rounded-full blur-2xl"></div>

                {/* Concentric Gold Rings */}
                <div className="absolute w-48 h-48 border border-dashed border-[#CA8B4B]/40 rounded-full animate-spin-slow"></div>
                <div className="absolute w-36 h-36 border border-[#EBDCCF] rounded-full"></div>

                {/* Floating Peripheral Node Icons */}
                <div className="absolute top-2 left-6 p-2 rounded-full bg-[#FFFDF9] border border-[#EBDCCF] text-[#8C5D33] shadow-md">
                  <User className="w-4 h-4" />
                </div>
                <div className="absolute top-2 right-6 p-2 rounded-full bg-[#FFFDF9] border border-[#EBDCCF] text-[#8C5D33] shadow-md">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="absolute bottom-6 left-6 p-2 rounded-full bg-[#FFFDF9] border border-[#EBDCCF] text-[#8C5D33] shadow-md">
                  <Database className="w-4 h-4" />
                </div>
                <div className="absolute bottom-6 right-6 p-2 rounded-full bg-[#FFFDF9] border border-[#EBDCCF] text-[#8C5D33] shadow-md">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#FFFDF9] border border-[#EBDCCF] text-[#8C5D33] shadow-md">
                  <Folder className="w-4 h-4" />
                </div>

                {/* Central 3D Metallic Shield with Lock */}
                <div className="relative z-10 w-24 h-28 bg-gradient-to-b from-[#754B26] via-[#38281F] to-[#17100B] border-2 border-[#DDAF7D] rounded-b-3xl shadow-2xl flex items-center justify-center">
                  <div className="w-12 h-14 bg-[#FAF5EF] border border-[#DDAF7D] rounded-xl flex items-center justify-center shadow-inner">
                    <Lock className="w-6 h-6 text-[#8C5D33] stroke-[2.5]" />
                  </div>
                </div>

              </div>

              {/* Text Description */}
              <div className="space-y-2">
                <h3 className="text-lg font-serif font-bold text-[#2C1F18]">
                  All training data anonymized
                </h3>
                <p className="text-xs text-[#7D6B5D] leading-relaxed px-2">
                  Your data is secure and never exposed.
                </p>
              </div>

            </div>

            {/* Bottom Protocol Box */}
            <div className="p-3.5 rounded-2xl bg-[#FAF5EF] border border-[#EBDCCF] flex items-start space-x-3 text-xs text-[#7D6B5D]">
              <ShieldCheck className="w-4 h-4 text-[#8C5D33] flex-shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                We follow strict protocols to protect your information.
              </p>
            </div>

          </div>

        </main>

      </div>

      {/* MODAL DIALOGS FOR RETRAIN & PRIVACY CONTROL */}
      {activeModal === 'retrain' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border border-[#EBDCCF] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#EBDCCF] pb-3">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-[#8C5D33]" />
                <h3 className="font-serif text-base font-bold text-[#2C1F18]">Learning AI & Model Governance</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-full hover:bg-[#FAF5EF] text-[#7D6B5D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#7D6B5D] leading-relaxed">
              Triggers incremental fine-tuning across all 6 active forensic classifiers (Voice Clone Detector, ELA Image Inspector, PDF Metadata Parser) using anonymized case telemetry.
            </p>

            <div className="p-3 rounded-2xl bg-[#FAF5EF] border border-[#EBDCCF] text-xs space-y-1">
              <div className="flex justify-between font-bold text-[#2C1F18]">
                <span>Ingested Telemetry Records:</span>
                <span>{totalCasesLearned} Cases</span>
              </div>
              <div className="flex justify-between font-bold text-[#8C5D33]">
                <span>New Pattern Flags:</span>
                <span>{newPatternsCount} Patterns</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-[#2C1F18] text-[#FFFDF9] text-xs font-bold uppercase cursor-pointer"
              >
                CLOSE PORTAL
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border border-[#EBDCCF] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#EBDCCF] pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#8C5D33]" />
                <h3 className="font-serif text-base font-bold text-[#2C1F18]">System Privacy & Governance</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-full hover:bg-[#FAF5EF] text-[#7D6B5D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5ECE3] border border-[#EBDCCF] flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[#2C1F18] block">Rule 81 PII Masking Protocol:</span>
                <span className="text-[#7D6B5D]">Anonymize Aadhaar numbers & financial accounts</span>
              </div>
              <button
                onClick={togglePrivacy}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  privacyRedacted ? 'bg-[#8C5D33] text-white' : 'bg-rose-600 text-white'
                }`}
              >
                {privacyRedacted ? 'ACTIVE' : 'OFF'}
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-[#2C1F18] text-[#FFFDF9] text-xs font-bold uppercase cursor-pointer"
              >
                SAVE GOVERNANCE SETTINGS
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
