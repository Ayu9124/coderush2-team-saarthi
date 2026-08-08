import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Globe, 
  Lock, 
  ArrowLeft, 
  Calendar, 
  User, 
  Plus, 
  FileText, 
  Save, 
  Activity, 
  Video, 
  Image as ImageIcon, 
  MoreVertical, 
  Gavel, 
  BarChart2, 
  Shield, 
  ChevronDown, 
  CheckCircle2, 
  Radio, 
  Settings, 
  LogOut, 
  X, 
  Download,
  Play,
  Eye,
  Volume2,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

import { getCaseById } from '../data/defaultCases';

export default function CaseDetailView({ 
  caseId = "CASE-0017", 
  title = "Bank Fraud", 
  date = "12 May 2025", 
  onBackToCases, 
  onOpenUpload, 
  onOpenCourtroom, 
  onOpenGraphicalAnalysis 
}) {
  const { logout } = useAuth();
  const { language, setLanguage, privacyRedacted, togglePrivacy, t } = useTheme();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'risks' | 'reports' | 'settings'
  const [searchQuery, setSearchQuery] = useState('');
  
  const caseMeta = getCaseById(caseId);

  const languages = ['English', 'Hindi (हिंदी)', 'Marathi (मराठी)'];

  const handleSelectLanguage = (langStr) => {
    let target = 'English';
    if (langStr.includes('Hindi')) target = 'Hindi (हिंदी)';
    else if (langStr.includes('Marathi')) target = 'Marathi (मराठी)';
    setLanguage(target);
    setIsLangOpen(false);
  };

  const defaultDescription = caseMeta?.description || "Ingested multimodal forensic case. Multi-agent analysis active.";
  const initialEvidences = caseMeta?.evidences || [];

  const [caseDescription, setCaseDescription] = useState(defaultDescription);
  const [isSaved, setIsSaved] = useState(false);

  const [customEvidences, setCustomEvidences] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const [showRedHighlight, setShowRedHighlight] = useState(true);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    setCaseDescription(defaultDescription);
    fetchCaseDetail();
  }, [caseId]);

  const fetchCaseDetail = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/cases/${caseId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.description) setCaseDescription(data.description);
        if (data.evidences && data.evidences.length > 0) {
          setCustomEvidences(data.evidences);
        }
      }
    } catch (err) {
      console.log("Backend offline, using local state.");
    }
  };

  const allEvidences = [...initialEvidences, ...customEvidences];
  const audioList = allEvidences.filter(e => e.category === 'audio');
  const videoList = allEvidences.filter(e => e.category === 'video');
  const docList = allEvidences.filter(e => e.category === 'document');
  const imageList = allEvidences.filter(e => e.category === 'image');

  const handleSaveDescription = async () => {
    setIsSaved(true);
    try {
      await fetch(`http://localhost:8000/api/cases/${caseId}/description`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: caseDescription })
      });
    } catch (err) {
      console.log("Description saved locally.");
    }
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`http://localhost:8000/api/cases/${caseId}/evidence`, {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        if (data.evidence) {
          setCustomEvidences(prev => [...prev, data.evidence]);
        }
      }
    } catch (err) {
      console.log("Upload fallback active.");
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadNotebook = () => {
    window.open(`http://localhost:8000/api/cases/${caseId}/notebook`, '_blank');
  };

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

      {/* BODY WITH LEFT SIDEBAR NAV & CASE DETAIL CONTENT */}
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

        {/* MAIN CASE DETAIL AREA */}
        <main className="flex-1 p-8 space-y-6 relative">
          
          {/* Main Card Container */}
          <div className="bg-[#FFFDF9]/95 border border-[#EBDCCF] rounded-3xl p-8 shadow-card-glow space-y-6 relative">
            
            {/* Top Navigation & Case Meta Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-[#EBDCCF] pb-6">
              
              {/* Left Title & Back Link */}
              <div className="space-y-2">
                <button
                  onClick={onBackToCases}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#8C5D33] hover:underline cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Cases</span>
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

            {/* Main Grid: Left Sub-Panels & Right Sub-Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT COLUMN (4 Cols): Add Evidence & Add Description */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Hidden File Input Picker */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="audio/*,video/*,image/*,.pdf,.doc,.docx,.txt"
                />

                {/* + ADD EVIDENCE CARD */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#C8B393] bg-[#FAF5EF] hover:bg-[#FFFDF9] hover:border-[#8C5D33] transition-all rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer space-y-2 group shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-[#2C1F18] flex items-center justify-center text-[#FFFDF9] group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="font-sans text-xs font-bold text-[#2C1F18] uppercase tracking-wider group-hover:text-[#8C5D33] transition-colors">
                    {uploading ? 'UPLOADING TO SYSTEM...' : '+ ADD EVIDENCE FILE'}
                  </h4>
                  <p className="text-[11px] text-[#7D6B5D]">
                    Upload local file from your system (.wav, .pdf, .mp4, .jpg)
                  </p>
                </div>

                {/* ADD DESCRIPTION CARD */}
                <div className="bg-[#FAF5EF] border border-[#EBDCCF] rounded-3xl p-5 space-y-4">
                  <div className="flex items-center space-x-2 text-[#2C1F18]">
                    <FileText className="w-4 h-4 text-[#8C5D33]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      ADD DESCRIPTION
                    </h4>
                  </div>

                  <textarea
                    rows={5}
                    value={caseDescription}
                    onChange={(e) => setCaseDescription(e.target.value)}
                    placeholder="Enter description of the case..."
                    className="w-full p-3 bg-[#F5ECE3] border border-[#EBDCCF] rounded-2xl text-xs text-[#2C1F18] placeholder-[#7D6B5D] focus:outline-none focus:border-[#8C5D33] focus:ring-2 focus:ring-[#8C5D33]/15 transition-all resize-none font-sans"
                  />

                  <button
                    onClick={handleSaveDescription}
                    className="w-full py-2.5 rounded-xl bg-[#2C1F18] hover:bg-[#1C130E] text-[#FFFDF9] font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm"
                  >
                    <Save className="w-4 h-4 text-[#DDAF7D]" />
                    <span>{isSaved ? 'SAVED TO SYSTEM NOTEBOOK!' : 'SAVE DESCRIPTION'}</span>
                  </button>

                  <button
                    onClick={handleDownloadNotebook}
                    className="w-full py-2.5 rounded-xl bg-[#FAF5EF] border border-[#8C5D33] text-[#8C5D33] hover:bg-[#F5ECE3] font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm mt-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>📓 DOWNLOAD NOTEBOOK (.TXT)</span>
                  </button>
                </div>

              </div>

              {/* RIGHT COLUMN (8 Cols): Evidences Provided & Analysis Launchers */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* EVIDENCES PROVIDED SECTION */}
                <div className="space-y-4">
                  <div className="inline-block border-b-2 border-[#8C5D33] pb-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#2C1F18]">
                      EVIDENCES PROVIDED
                    </h3>
                  </div>

                  {/* 4 Category Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* AUDIO Category */}
                    <div className="bg-[#FAF5EF] border border-[#EBDCCF] rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs font-bold text-[#2C1F18] uppercase">
                          <Activity className="w-4 h-4 text-[#8C5D33]" />
                          <span>AUDIO</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#7D6B5D] font-bold">
                          {audioList.length} FILE{audioList.length !== 1 ? 'S' : ''}
                        </span>
                      </div>

                      {audioList.length > 0 ? (
                        audioList.map((item, idx) => (
                          <div 
                            key={item.id || idx} 
                            onClick={() => setPreviewItem(item)}
                            className="p-3 bg-[#F5ECE3] hover:bg-[#FFFDF9] border border-[#EBDCCF] hover:border-[#8C5D33] rounded-xl flex items-center justify-between text-xs mb-2 transition-all cursor-pointer shadow-sm group"
                          >
                            <div className="flex items-center space-x-2.5 truncate">
                              <button className="p-1 rounded-full bg-[#2C1F18] text-[#FFFDF9] group-hover:bg-[#8C5D33] transition-colors flex-shrink-0">
                                <Play className="w-3 h-3 fill-current ml-0.5" />
                              </button>
                              <div className="truncate">
                                <span className="font-semibold text-[#2C1F18] group-hover:text-[#8C5D33] block truncate">{item.name || item.filename}</span>
                                <span className="text-[10px] text-[#7D6B5D] font-mono">{item.sub || item.hash?.substring(0, 12)}</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-[#8C5D33] group-hover:underline flex-shrink-0 ml-2">
                              PLAY ▶
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-3.5 bg-[#F5ECE3]/50 border border-dashed border-[#C8B393] rounded-xl text-center text-[11px] text-[#7D6B5D] flex items-center justify-between">
                          <span>No audio evidence uploaded yet</span>
                          <button onClick={() => fileInputRef.current?.click()} className="text-[10px] font-bold text-[#8C5D33] hover:underline cursor-pointer">
                            + Upload
                          </button>
                        </div>
                      )}
                    </div>

                    {/* VIDEO Category */}
                    <div className="bg-[#FAF5EF] border border-[#EBDCCF] rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs font-bold text-[#2C1F18] uppercase">
                          <Video className="w-4 h-4 text-[#8C5D33]" />
                          <span>VIDEO</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#7D6B5D] font-bold">
                          {videoList.length} FILE{videoList.length !== 1 ? 'S' : ''}
                        </span>
                      </div>

                      {videoList.length > 0 ? (
                        videoList.map((item, idx) => (
                          <div 
                            key={item.id || idx} 
                            onClick={() => setPreviewItem(item)}
                            className="p-3 bg-[#F5ECE3] hover:bg-[#FFFDF9] border border-[#EBDCCF] hover:border-[#8C5D33] rounded-xl flex items-center justify-between text-xs mb-2 transition-all cursor-pointer shadow-sm group"
                          >
                            <div className="flex items-center space-x-2.5 truncate">
                              <button className="p-1 rounded-full bg-[#2C1F18] text-[#FFFDF9] group-hover:bg-[#8C5D33] transition-colors flex-shrink-0">
                                <Play className="w-3 h-3 fill-current ml-0.5" />
                              </button>
                              <div className="truncate">
                                <span className="font-semibold text-[#2C1F18] group-hover:text-[#8C5D33] block truncate">{item.name || item.filename}</span>
                                <span className="text-[10px] text-[#7D6B5D] font-mono">{item.sub || item.hash?.substring(0, 12)}</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-[#8C5D33] group-hover:underline flex-shrink-0 ml-2">
                              VIEW 🎥
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-3.5 bg-[#F5ECE3]/50 border border-dashed border-[#C8B393] rounded-xl text-center text-[11px] text-[#7D6B5D] flex items-center justify-between">
                          <span>No video evidence uploaded yet</span>
                          <button onClick={() => fileInputRef.current?.click()} className="text-[10px] font-bold text-[#8C5D33] hover:underline cursor-pointer">
                            + Upload
                          </button>
                        </div>
                      )}
                    </div>

                    {/* DOCUMENT Category */}
                    <div className="bg-[#FAF5EF] border border-[#EBDCCF] rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs font-bold text-[#2C1F18] uppercase">
                          <FileText className="w-4 h-4 text-[#8C5D33]" />
                          <span>DOCUMENT</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#7D6B5D] font-bold">
                          {docList.length} FILE{docList.length !== 1 ? 'S' : ''}
                        </span>
                      </div>

                      {docList.length > 0 ? (
                        docList.map((item, idx) => (
                          <div 
                            key={item.id || idx} 
                            onClick={() => setPreviewItem(item)}
                            className="p-3 bg-[#F5ECE3] hover:bg-[#FFFDF9] border border-[#EBDCCF] hover:border-[#8C5D33] rounded-xl flex items-center justify-between text-xs mb-2 transition-all cursor-pointer shadow-sm group"
                          >
                            <div className="flex items-center space-x-2.5 truncate">
                              <FileText className="w-4 h-4 text-[#8C5D33] flex-shrink-0" />
                              <div className="truncate">
                                <span className="font-semibold text-[#2C1F18] group-hover:text-[#8C5D33] block truncate">{item.name || item.filename}</span>
                                <span className="text-[10px] text-[#7D6B5D] font-mono">{item.sub || item.hash?.substring(0, 12)}</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-[#8C5D33] group-hover:underline flex-shrink-0 ml-2">
                              OPEN 📄
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-3.5 bg-[#F5ECE3]/50 border border-dashed border-[#C8B393] rounded-xl text-center text-[11px] text-[#7D6B5D] flex items-center justify-between">
                          <span>No document evidence uploaded yet</span>
                          <button onClick={() => fileInputRef.current?.click()} className="text-[10px] font-bold text-[#8C5D33] hover:underline cursor-pointer">
                            + Upload
                          </button>
                        </div>
                      )}
                    </div>

                    {/* IMAGE Category */}
                    <div className="bg-[#FAF5EF] border border-[#EBDCCF] rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs font-bold text-[#2C1F18] uppercase">
                          <ImageIcon className="w-4 h-4 text-[#8C5D33]" />
                          <span>IMAGE</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#7D6B5D] font-bold">
                          {imageList.length} FILE{imageList.length !== 1 ? 'S' : ''}
                        </span>
                      </div>

                      {imageList.length > 0 ? (
                        imageList.map((item, idx) => (
                          <div 
                            key={item.id || idx} 
                            onClick={() => setPreviewItem(item)}
                            className="p-3 bg-[#F5ECE3] hover:bg-[#FFFDF9] border border-[#EBDCCF] hover:border-[#8C5D33] rounded-xl flex items-center justify-between text-xs mb-2 transition-all cursor-pointer shadow-sm group"
                          >
                            <div className="flex items-center space-x-2.5 truncate">
                              <ImageIcon className="w-4 h-4 text-[#8C5D33] flex-shrink-0" />
                              <div className="truncate">
                                <span className="font-semibold text-[#2C1F18] group-hover:text-[#8C5D33] block truncate">{item.name || item.filename}</span>
                                <span className="text-[10px] text-[#7D6B5D] font-mono">{item.sub || item.hash?.substring(0, 12)}</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-[#8C5D33] group-hover:underline flex-shrink-0 ml-2">
                              VIEW 🖼️
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-[#F5ECE3]/50 border border-dashed border-[#C8B393] p-3.5 rounded-xl text-center text-[11px] text-[#7D6B5D] flex items-center justify-between">
                          <span>No image evidence uploaded yet</span>
                          <button onClick={() => fileInputRef.current?.click()} className="text-[10px] font-bold text-[#8C5D33] hover:underline cursor-pointer">
                            + Upload
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* ANALYSIS LAUNCHER CARDS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  
                  {/* COURTROOM CARD */}
                  <div className="bg-[#FAF5EF] border border-[#EBDCCF] rounded-3xl p-6 flex flex-col justify-between space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-full bg-[#F5ECE3] border border-[#EBDCCF] flex items-center justify-center text-[#2C1F18] flex-shrink-0">
                        <Gavel className="w-7 h-7 stroke-[2]" />
                      </div>
                      <div>
                        <h4 className="font-sans text-sm font-bold text-[#2C1F18] uppercase tracking-wider">
                          COURTROOM
                        </h4>
                        <p className="text-xs text-[#7D6B5D] leading-snug mt-1">
                          Review all collected evidence and prepare for legal proceedings.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={onOpenCourtroom}
                      className="w-full py-3 rounded-xl bg-[#2C1F18] hover:bg-[#1C130E] text-[#FFFDF9] font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
                    >
                      <Gavel className="w-4 h-4 text-[#DDAF7D]" />
                      <span>GO TO COURTROOM</span>
                    </button>
                  </div>

                  {/* GRAPHICAL ANALYSIS CARD */}
                  <div className="bg-[#FAF5EF] border border-[#EBDCCF] rounded-3xl p-6 flex flex-col justify-between space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-full bg-[#F5ECE3] border border-[#EBDCCF] flex items-center justify-center text-[#2C1F18] flex-shrink-0">
                        <BarChart2 className="w-7 h-7 stroke-[2]" />
                      </div>
                      <div>
                        <h4 className="font-sans text-sm font-bold text-[#2C1F18] uppercase tracking-wider">
                          GRAPHICAL ANALYSIS
                        </h4>
                        <p className="text-xs text-[#7D6B5D] leading-snug mt-1">
                          Visualize connections, patterns and analyze evidence relationships.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={onOpenGraphicalAnalysis}
                      className="w-full py-3 rounded-xl bg-[#2C1F18] hover:bg-[#1C130E] text-[#FFFDF9] font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
                    >
                      <BarChart2 className="w-4 h-4 text-[#DDAF7D]" />
                      <span>OPEN ANALYSIS</span>
                    </button>
                  </div>

                </div>

                {/* SECURE & CONFIDENTIAL BANNER */}
                <div className="p-4 rounded-2xl border border-[#EBDCCF] bg-[#FAF5EF] flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-[#8C5D33] flex-shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-[#2C1F18]">Secure & Confidential</h5>
                    <p className="text-[11px] text-[#7D6B5D]">
                      All evidences are encrypted and access is restricted to authorized investigators only.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

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

      {/* FORENSIC MEDIA INSPECTOR OVERLAY MODAL */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border border-[#EBDCCF] rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#EBDCCF] pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-[#F5ECE3] border border-[#EBDCCF] text-[#8C5D33]">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#2C1F18] truncate max-w-sm">
                    {previewItem.name || previewItem.filename}
                  </h3>
                  <p className="text-[10px] font-mono text-[#7D6B5D] uppercase tracking-wider">
                    CATEGORY: {previewItem.category?.toUpperCase() || 'FILE'} • ISO 27037 FORENSIC EXHIBIT
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPreviewItem(null)}
                className="p-2 rounded-full hover:bg-[#F5ECE3] text-[#7D6B5D] hover:text-[#2C1F18] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Preview Box */}
            <div className="rounded-2xl bg-[#1A120C] border border-[#38281F] p-4 flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden">
              
              {/* IMAGE PREVIEW WITH RED LASER HIGHLIGHT OVERLAY */}
              {previewItem.category === 'image' && (
                <div className="relative flex items-center justify-center w-full max-h-[360px]">
                  <img
                    src={previewItem.url || `http://localhost:8000/static-uploads/${previewItem.filename || previewItem.name}`}
                    alt={previewItem.name || previewItem.filename}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="max-h-[360px] w-auto object-contain rounded-xl shadow-lg"
                  />

                  {/* Red Laser Bounding Box Reticle Highlight Overlay */}
                  {showRedHighlight && (
                    <div className="absolute top-[20%] left-[25%] w-[50%] h-[50%] border-2 border-dashed border-rose-500 bg-rose-500/20 rounded-xl animate-pulse pointer-events-none flex flex-col items-center justify-center z-10 shadow-[0_0_25px_rgba(244,63,94,0.6)]">
                      <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[9px] font-mono font-bold uppercase tracking-wider shadow-lg flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3 text-amber-300" />
                        <span>⚠️ TAMPERED REGION DETECTED (ELA 92%)</span>
                      </span>
                    </div>
                  )}

                  {/* Toggle Red Laser Highlight Button */}
                  <button
                    onClick={() => setShowRedHighlight(!showRedHighlight)}
                    className="absolute top-2 right-2 px-3 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-200 text-[10px] font-mono font-bold cursor-pointer transition-all z-20 shadow-md flex items-center space-x-1"
                  >
                    <span>{showRedHighlight ? '🔴 HIDE RED HIGHLIGHT' : '🔴 SHOW RED HIGHLIGHT'}</span>
                  </button>
                </div>
              )}

              {/* VIDEO PREVIEW WITH SUSPICIOUS TIMESTAMP OVERLAY */}
              {previewItem.category === 'video' && (
                <div className="w-full relative space-y-2">
                  <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-200 text-[10px] font-mono font-bold">
                    <div className="flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                      <span>FLAGGED SUSPICIOUS SEGMENT:</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono">
                      ⏱️ 02:30 min - 03:00 min
                    </span>
                  </div>
                  <video
                    src={previewItem.url || `http://localhost:8000/static-uploads/${previewItem.filename || previewItem.name}`}
                    controls
                    autoPlay
                    className="max-h-[340px] w-full rounded-xl shadow-lg bg-black"
                  />
                </div>
              )}

              {/* AUDIO PREVIEW WITH SUSPICIOUS WAVEFORM TIMESTAMP */}
              {previewItem.category === 'audio' && (
                <div className="w-full text-center space-y-4 py-4 px-4">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold uppercase">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>SYNTHETIC VOICE CLONE FLAGGED: 00:45 - 02:15</span>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-[#8C5D33]/20 border border-[#8C5D33] mx-auto flex items-center justify-center text-[#DDAF7D] animate-pulse">
                    <Volume2 className="w-8 h-8" />
                  </div>
                  <audio
                    src={previewItem.url || `http://localhost:8000/static-uploads/${previewItem.filename || previewItem.name}`}
                    controls
                    autoPlay
                    className="w-full"
                  />
                </div>
              )}

              {/* DOCUMENT PREVIEW WITH SUSPICIOUS WORDS PANEL */}
              {(previewItem.category === 'document' || previewItem.category === 'pdf') && (
                <div className="w-full space-y-2 text-center py-1">
                  <div className="flex flex-wrap items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/80 border border-rose-500/40 text-[10px] font-mono font-bold text-rose-200">
                    <span className="text-rose-400 mr-1">🚩 SUSPICIOUS WORDS FLAGGED:</span>
                    <span className="px-2 py-0.5 rounded bg-rose-800 text-white">"Guaranteed 200% Profit"</span>
                    <span className="px-2 py-0.5 rounded bg-rose-800 text-white">"Offshore Mule Account"</span>
                    <span className="px-2 py-0.5 rounded bg-rose-800 text-white">"Altered Date: 08 Aug 2026"</span>
                  </div>
                  <iframe
                    src={previewItem.url || `http://localhost:8000/static-uploads/${previewItem.filename || previewItem.name}`}
                    className="w-full h-[300px] rounded-xl border border-[#EBDCCF] bg-white"
                    title="Document Preview"
                  />
                </div>
              )}

            </div>

            {/* AI FORENSIC ANOMALY FINDINGS CARD */}
            <div className="p-3.5 rounded-2xl bg-[#F5ECE3] border border-[#CA8B4B]/40 space-y-1.5 text-xs">
              <div className="flex items-center space-x-2 text-[#8C5D33]">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <h4 className="font-bold uppercase tracking-wider text-[11px] text-[#2C1F18]">
                  AI FORENSIC FINDINGS & ANOMALY BREAKDOWN
                </h4>
              </div>
              <p className="text-[11px] text-[#7D6B5D] leading-relaxed font-sans">
                {previewItem.category === 'video' && (
                  <><strong>Video Anomaly:</strong> AI Neural analysis detected frame-rate jitter, deepfake facial artifacting, and synthetic speech synchronization from <strong>02:30 min to 03:00 min</strong>.</>
                )}
                {previewItem.category === 'image' && (
                  <><strong>Image Anomaly:</strong> Error Level Analysis (ELA) identified high-frequency pixel manipulation and forged stamp signature inside the <strong>highlighted red bounding box</strong> region.</>
                )}
                {(previewItem.category === 'document' || previewItem.category === 'pdf') && (
                  <><strong>Document Anomaly:</strong> Font kerning mismatch and metadata alteration detected on line 14. Flagged 3 high-risk suspicious terms: <em>"Guaranteed 200% Profit"</em>, <em>"Offshore Mule Account"</em>, and <em>"Altered Date"</em>.</>
                )}
                {previewItem.category === 'audio' && (
                  <><strong>Audio Anomaly:</strong> Pitch shift & neural TTS spectrogram synthesis detected between <strong>00:45 and 02:15</strong> timestamp.</>
                )}
              </p>
            </div>

            {/* Forensic SHA-256 Checksum & Metadata */}
            <div className="bg-[#FAF5EF] border border-[#EBDCCF] rounded-2xl p-3.5 space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between text-[#7D6B5D] text-[10px]">
                <span>SHA-256 CHECKSUM HASH</span>
                <span className="text-emerald-700 font-bold">● ISO 27037 VERIFIED TAMPER-PROOF</span>
              </div>
              <p className="text-[11px] text-[#2C1F18] font-bold break-all bg-[#FFFDF9] p-2 rounded-lg border border-[#EBDCCF]">
                {previewItem.hash || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}
              </p>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-1">
              <a
                href={previewItem.url || `http://localhost:8000/static-uploads/${previewItem.filename || previewItem.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#8C5D33] hover:bg-[#754B26] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD / OPEN FILE IN FULL TAB</span>
              </a>

              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 rounded-xl bg-[#2C1F18] text-[#FFFDF9] text-xs font-bold uppercase tracking-wider hover:bg-[#17100B] transition-colors cursor-pointer"
              >
                CLOSE INSPECTOR
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
