import React, { useState } from 'react';
import { 
  Search, 
  Globe, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Shield, 
  ArrowRight, 
  Briefcase, 
  CheckCircle2, 
  FileText, 
  ChevronDown,
  Sparkles,
  Layers,
  X,
  Info,
  BookOpen,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { useAuth, ROLES } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function LandingLoginPage() {
  const { login } = useAuth();
  const { language, setLanguage } = useTheme();

  const [selectedRole, setSelectedRole] = useState('LEAD_DETECTIVE');
  const [investigatorIdInput, setInvestigatorIdInput] = useState('inv.sarthi@cybercrime.gov.in');
  const [passwordInput, setPasswordInput] = useState('CYBER-2026-DELHI');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [autoFilled, setAutoFilled] = useState(true);

  // Modal / Dropdown States
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'about' | 'solutions' | 'suite' | 'docs' | 'support' | 'forgot'

  const handleAutoFillInvestigator = () => {
    setSelectedRole('LEAD_DETECTIVE');
    setInvestigatorIdInput('inv.sarthi@cybercrime.gov.in');
    setPasswordInput('CYBER-2026-DELHI');
    setAutoFilled(true);
    setTimeout(() => setAutoFilled(false), 2000);
  };

  const handleAutoFillAdmin = () => {
    setSelectedRole('SYSTEM_ADMIN');
    setInvestigatorIdInput('admin.sarthi@cybercrime.gov.in');
    setPasswordInput('ADMIN-2026-ROOT');
    setAutoFilled(true);
    setTimeout(() => setAutoFilled(false), 2000);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const isAdmin = selectedRole === 'SYSTEM_ADMIN' || investigatorIdInput.includes('admin');
    login(isAdmin ? 'SYSTEM_ADMIN' : selectedRole, isAdmin ? 'ADMIN-ROOT-001' : 'INV-8821-DELHI');
  };

  const languages = ['English', 'Hindi (हिंदी)', 'Spanish (Español)', 'French (Français)'];

  return (
    <div className="min-h-screen bg-forensic-pattern flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Background Floating Nodes/Glow Deco */}
      <div className="absolute top-[-10%] left-[-5%] w-[450px] h-[450px] bg-[#CA8B4B]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#8C5D33]/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* TOP NAVIGATION BAR */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-20">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveModal(null)}>
          <div className="emblem-gold-ring">
            <div className="emblem-gold-inner w-10 h-10 flex items-center justify-center shadow-inner">
              <Search className="w-5 h-5 text-[#8C5D33] stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="font-cinzel text-lg font-bold tracking-wider text-[#2C1F18] leading-none uppercase">
              SARTHI <span className="text-[#8C5D33]">FORENSICS</span>
            </div>
            <div className="text-[10px] font-sans tracking-tight text-[#7D6B5D] mt-1 font-semibold">
              Digital Fraud Intelligence
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#38281F]">
          <button onClick={() => setActiveModal('about')} className="hover:text-[#8C5D33] transition-colors cursor-pointer">
            About
          </button>
          <button onClick={() => setActiveModal('solutions')} className="hover:text-[#8C5D33] transition-colors cursor-pointer">
            Solutions
          </button>
          <button onClick={() => setActiveModal('suite')} className="hover:text-[#8C5D33] transition-colors cursor-pointer">
            Investigation Suite
          </button>
          <button onClick={() => setActiveModal('docs')} className="hover:text-[#8C5D33] transition-colors cursor-pointer">
            Documentation
          </button>
          <button onClick={() => setActiveModal('support')} className="hover:text-[#8C5D33] transition-colors cursor-pointer">
            Support
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          
          {/* Language Selector Dropdown */}
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

          {/* Investigator Login Button */}
          <button
            onClick={() => {
              const el = document.getElementById('login-card-portal');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-medium text-[#38281F] bg-[#FFFDF9] border border-[#EBDCCF] rounded-xl hover:border-[#8C5D33] transition-all cursor-pointer shadow-sm"
          >
            <Lock className="w-3.5 h-3.5 text-[#8C5D33]" />
            <span>Investigator Login</span>
          </button>

        </div>
      </header>

      {/* MAIN HERO & LOGIN CONTAINER */}
      <main className="w-full max-w-7xl mx-auto px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* LEFT HERO SECTION */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* AI Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#F2E8DC] border border-[#E8D9C8] text-xs font-semibold text-[#8C5D33]">
            <span className="w-2 h-2 rounded-full bg-[#8C5D33] animate-pulse"></span>
            <span>AI Powered Digital Investigation Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-[#2C1F18] leading-[1.12] tracking-tight">
            Every Digital <br />
            Evidence <br />
            Tells <span className="font-serif italic font-normal text-[#2C1F18]">a </span>
            <span className="bg-gradient-to-r from-[#B57F48] to-[#754B26] bg-clip-text text-transparent font-serif italic">
              Story
            </span>
          </h1>

          {/* Quote Section */}
          <div className="relative pl-6 py-1 border-l-2 border-[#DDAF7D]">
            <p className="font-serif italic text-lg sm:text-xl text-[#38281F]">
              <span className="text-[#8C5D33] font-serif text-2xl font-bold mr-1">“</span>
              Truth leaves patterns. Our job is to reveal them.
              <span className="text-[#8C5D33] font-serif text-2xl font-bold ml-1">”</span>
            </p>
          </div>

          {/* Sub-Badges Row */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg border border-[#EBDCCF] bg-[#FFFDF9]/60 text-xs font-medium text-[#7D6B5D]">
              <Shield className="w-3.5 h-3.5 text-[#8C5D33]" />
              <span>Confidence Scored</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg border border-[#EBDCCF] bg-[#FFFDF9]/60 text-xs font-medium text-[#7D6B5D]">
              <Lock className="w-3.5 h-3.5 text-[#8C5D33]" />
              <span>Privacy Preserving</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg border border-[#EBDCCF] bg-[#FFFDF9]/60 text-xs font-medium text-[#7D6B5D]">
              <FileText className="w-3.5 h-3.5 text-[#8C5D33]" />
              <span>Evidence Driven</span>
            </div>
          </div>

          {/* Description Paragraph */}
          <p className="text-sm text-[#7D6B5D] leading-relaxed max-w-xl">
            Sarthi Forensics helps fraud analysts, journalists, trust & safety teams, and authorized investigators detect synthetic media, caller-ID spoofing, manipulated documents, coordinated fraud networks, and digital evidence while preserving provenance and confidence scoring.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveModal('solutions')}
              className="px-6 py-3 rounded-full bg-bronze-metallic text-white text-sm font-semibold flex items-center space-x-2 cursor-pointer transition-transform"
            >
              <span>Explore Solutions</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveModal('suite')}
              className="px-6 py-3 rounded-full border border-[#DDAF7D] bg-[#FFFDF9]/80 hover:bg-[#F7E8D5] text-[#38281F] text-sm font-semibold flex items-center space-x-2 transition-colors cursor-pointer shadow-sm"
            >
              <Briefcase className="w-4 h-4 text-[#8C5D33]" />
              <span>See Investigation Suite</span>
            </button>
          </div>

        </div>

        {/* RIGHT LOGIN PORTAL CARD */}
        <div id="login-card-portal" className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-md bg-[#FFFDF9] border border-[#EBDCCF] shadow-card-glow rounded-3xl p-7 sm:p-8 space-y-5 relative">
            
            {/* Top Emblem Logo & Title */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="emblem-gold-ring p-1 shadow-md mb-1">
                <div className="emblem-gold-inner w-16 h-16 flex items-center justify-center shadow-inner">
                  <Search className="w-8 h-8 text-[#8C5D33] stroke-[2.2]" />
                </div>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#2C1F18] tracking-tight">
                Sarthi Forensics
              </h2>
              <p className="text-xs text-[#7D6B5D] font-medium">
                Digital Fraud Investigation Portal
              </p>
            </div>

            {/* Divider with Label */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-[#EBDCCF]"></div>
              <span className="flex-shrink mx-3 text-[11px] text-[#7D6B5D] font-medium uppercase tracking-wider">
                Authorized Investigator Login
              </span>
              <div className="flex-grow border-t border-[#EBDCCF]"></div>
            </div>


            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Quick Auto-Fill Demo Credentials Grid */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleAutoFillInvestigator}
                  className={`py-2 px-2.5 rounded-xl border text-[11px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center space-x-1 shadow-sm ${
                    selectedRole === 'LEAD_DETECTIVE'
                      ? 'bg-[#8C5D33] text-white border-[#754B26]'
                      : 'bg-[#F5ECE3] text-[#8C5D33] border-[#CA8B4B]/40 hover:border-[#8C5D33]'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-[#DDAF7D]" />
                  <span>🕵️ INVESTIGATOR</span>
                </button>

                <button
                  type="button"
                  onClick={handleAutoFillAdmin}
                  className={`py-2 px-2.5 rounded-xl border text-[11px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center space-x-1 shadow-sm ${
                    selectedRole === 'SYSTEM_ADMIN'
                      ? 'bg-[#2C1F18] text-[#DDAF7D] border-[#8C5D33]'
                      : 'bg-[#F5ECE3] text-[#2C1F18] border-[#CA8B4B]/40 hover:border-[#2C1F18]'
                  }`}
                >
                  <Lock className="w-3 h-3 text-[#DDAF7D]" />
                  <span>👤 ADMIN LOGIN</span>
                </button>
              </div>

              {/* Investigator Badge Email */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#7D6B5D] block">
                  Official Badge Email:
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 absolute left-3.5 text-[#7D6B5D]" />
                  <input
                    type="text"
                    value={investigatorIdInput}
                    onChange={(e) => setInvestigatorIdInput(e.target.value)}
                    required
                    placeholder="inv.sarthi@cybercrime.gov.in"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F5ECE3] border border-[#EBDCCF] rounded-xl text-xs text-[#2C1F18] font-mono focus:outline-none focus:border-[#8C5D33] focus:ring-2 focus:ring-[#8C5D33]/15 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#7D6B5D] block">
                  Security Passcode:
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 absolute left-3.5 text-[#7D6B5D]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                    placeholder="CYBER-2026-DELHI"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#F5ECE3] border border-[#EBDCCF] rounded-xl text-xs text-[#2C1F18] font-mono focus:outline-none focus:border-[#8C5D33] focus:ring-2 focus:ring-[#8C5D33]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-[#7D6B5D] hover:text-[#2C1F18] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Options Row */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 text-[#7D6B5D] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="rounded border-[#EBDCCF] text-[#8C5D33] focus:ring-[#8C5D33] accent-[#8C5D33]"
                  />
                  <span>Remember this Device</span>
                </label>

                <button
                  type="button"
                  onClick={() => setActiveModal('forgot')}
                  className="text-[#8C5D33] hover:underline font-medium cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-bronze-metallic text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-md hover:scale-[1.01]"
              >
                <span>ACCESS INVESTIGATION PORTAL</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>

            {/* OR Divider */}
            <div className="relative flex py-0.5 items-center">
              <div className="flex-grow border-t border-[#EBDCCF]"></div>
              <span className="flex-shrink mx-3 text-[10px] text-[#7D6B5D] font-bold uppercase tracking-widest">
                OR
              </span>
              <div className="flex-grow border-t border-[#EBDCCF]"></div>
            </div>

            {/* Restricted Access Box */}
            <div className="p-3.5 rounded-xl border border-[#EBDCCF] bg-[#FAF5EF] flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-[#8C5D33]/15 text-[#8C5D33] flex-shrink-0 mt-0.5">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#2C1F18] tracking-tight">Restricted Access</h4>
                <p className="text-[11px] text-[#7D6B5D] leading-snug mt-0.5">
                  Only authorized investigators may access forensic evidence and investigation tools.
                </p>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-[#EBDCCF] bg-[#FAF5EF] py-4 px-6 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-[#7D6B5D] gap-2">
          <div>
            © 2026 <span className="font-semibold text-[#2C1F18]">Sarthi Forensics</span>. Team Saarthi | CodeRush 2.0 Hackathon.
          </div>
          <div className="flex items-center space-x-6">
            <span>ISO/IEC 27037 Compliant</span>
            <span>•</span>
            <span>SHA-256 Provenance</span>
            <span>•</span>
            <span>Privacy Preserved</span>
          </div>
        </div>
      </footer>

      {/* MODALS (About, Solutions, Suite, Docs, Support, Forgot) */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-[#2C1F18]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border border-[#EBDCCF] rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#F5ECE3] text-[#7D6B5D] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === 'about' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-[#8C5D33]">
                  <Info className="w-5 h-5" />
                  <h3 className="font-serif text-lg font-bold text-[#2C1F18]">About Sarthi Forensics</h3>
                </div>
                <p className="text-xs text-[#7D6B5D] leading-relaxed">
                  Sarthi Forensics is an end-to-end AI-powered digital fraud investigation platform developed for CodeRush 2.0 Hackathon. It enables fraud analysts, trust & safety experts, and law enforcement to detect synthetic media, voice clones, caller-ID spoofing, and forged documents while maintaining cryptographic chain of custody.
                </p>
              </div>
            )}

            {activeModal === 'solutions' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-[#8C5D33]">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-serif text-lg font-bold text-[#2C1F18]">Forensic Solutions Overview</h3>
                </div>
                <ul className="text-xs text-[#7D6B5D] space-y-2">
                  <li className="p-2.5 rounded-xl bg-[#F5ECE3] border border-[#EBDCCF]">
                    <strong className="text-[#2C1F18]">Voice & Audio Forensics:</strong> ElevenLabs/VALL-E clone detection & spectral phase variance analysis.
                  </li>
                  <li className="p-2.5 rounded-xl bg-[#F5ECE3] border border-[#EBDCCF]">
                    <strong className="text-[#2C1F18]">Document Error Level Analysis (ELA):</strong> Compression artifact heatmap & font kerning mismatch inspector.
                  </li>
                  <li className="p-2.5 rounded-xl bg-[#F5ECE3] border border-[#EBDCCF]">
                    <strong className="text-[#2C1F18]">Cross-Case Ring Comparator:</strong> Correlates shared mule accounts, proxy IPs, and voice hashes across historical cases.
                  </li>
                </ul>
              </div>
            )}

            {activeModal === 'suite' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-[#8C5D33]">
                  <Briefcase className="w-5 h-5" />
                  <h3 className="font-serif text-lg font-bold text-[#2C1F18]">Investigation Suite Architecture</h3>
                </div>
                <p className="text-xs text-[#7D6B5D] leading-relaxed">
                  The suite features a multi-role RBAC architecture (Lead Detective, Triage Specialist, Legal Auditor) integrated with an interactive evidence topology graph, RAG AI Copilot, and automated court PDF dossier export.
                </p>
              </div>
            )}

            {activeModal === 'docs' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-[#8C5D33]">
                  <BookOpen className="w-5 h-5" />
                  <h3 className="font-serif text-lg font-bold text-[#2C1F18]">Platform Documentation</h3>
                </div>
                <p className="text-xs text-[#7D6B5D] leading-relaxed">
                  All evidence ingested is cryptographically hashed using SHA-256 and logged into an immutable digital chain of custody ledger adhering to ISO/IEC 27037 standards.
                </p>
              </div>
            )}

            {activeModal === 'support' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-[#8C5D33]">
                  <HelpCircle className="w-5 h-5" />
                  <h3 className="font-serif text-lg font-bold text-[#2C1F18]">Investigator Support</h3>
                </div>
                <p className="text-xs text-[#7D6B5D]">
                  For emergency forensic assistance or legal audit requests, contact Team Saarthi command center at <span className="font-mono text-[#8C5D33]">support@sarthi-forensics.gov.in</span>.
                </p>
              </div>
            )}

            {activeModal === 'forgot' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-[#8C5D33]">
                  <ShieldAlert className="w-5 h-5" />
                  <h3 className="font-serif text-lg font-bold text-[#2C1F18]">Password Recovery Notice</h3>
                </div>
                <p className="text-xs text-[#7D6B5D] leading-relaxed">
                  For security protocols, password resets for forensic investigator accounts require multi-factor authorization from your Law Enforcement Agency Lead Admin.
                </p>
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
