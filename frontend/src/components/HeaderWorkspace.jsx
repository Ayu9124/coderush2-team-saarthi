import React from 'react';
import { 
  Search, 
  Eye, 
  EyeOff, 
  FileText, 
  PlusCircle, 
  Lock, 
  FolderOpen,
  LogOut,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function HeaderWorkspace({ 
  cases = [], 
  currentCaseId, 
  onSelectCase, 
  onOpenUpload, 
  onOpenCustody, 
  onExportPdf 
}) {
  const { privacyRedacted, togglePrivacy } = useTheme();
  const { userProfile, logout } = useAuth();

  const roleObj = userProfile?.role || {};

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EBDCCF] bg-[#FFFDF9]/95 backdrop-blur-xl px-6 py-3 flex items-center justify-between shadow-sm">
      
      {/* Brand Title & Active Role Badge */}
      <div className="flex items-center space-x-4">
        <div className="emblem-gold-ring p-0.5">
          <div className="emblem-gold-inner w-8 h-8 flex items-center justify-center">
            <Search className="w-4 h-4 text-[#8C5D33] stroke-[2.5]" />
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-bold font-cinzel tracking-wider text-[#2C1F18] uppercase">
              SARTHI <span className="text-[#8C5D33]">FORENSICS</span>
            </h1>
            
            {/* Role Badge */}
            {roleObj.title && (
              <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full border ${roleObj.badgeColor || 'bg-[#8C5D33]/15 text-[#8C5D33] border-[#8C5D33]/30'}`}>
                {roleObj.title}
              </span>
            )}
          </div>
          <p className="text-[10px] text-[#7D6B5D] font-medium tracking-tight">
            Digital Fraud Investigation Workspace
          </p>
        </div>
      </div>

      {/* Case Selector Dropdown & Custody Shortcut */}
      <div className="flex items-center space-x-4">
        <div className="relative flex items-center">
          <FolderOpen className="w-4 h-4 absolute left-3 text-[#7D6B5D] pointer-events-none" />
          <select
            value={currentCaseId}
            onChange={(e) => onSelectCase(e.target.value)}
            className="pl-9 pr-8 py-1.5 text-xs font-mono rounded-xl bg-[#F5ECE3] border border-[#EBDCCF] text-[#2C1F18] focus:outline-none focus:border-[#8C5D33] cursor-pointer shadow-sm font-semibold"
          >
            {cases.map((c) => {
              const cid = c.case_id || c.caseId;
              const risk = c.overall_risk_score || 85;
              return (
                <option key={cid} value={cid}>
                  [{cid}] {c.title} ({risk}%)
                </option>
              );
            })}
          </select>
        </div>

        {/* Chain of Custody Badge */}
        <button
          onClick={onOpenCustody}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-xl bg-[#8C5D33]/10 border border-[#8C5D33]/30 text-[#8C5D33] hover:bg-[#8C5D33]/20 transition-all cursor-pointer"
          title="Inspect SHA-256 Custody Trail"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>SHA-256 Custody</span>
        </button>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center space-x-3">
        {/* Ingest Case */}
        <button
          onClick={onOpenUpload}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-[#F5ECE3] border border-[#EBDCCF] text-[#2C1F18] hover:border-[#8C5D33] shadow-sm transition-all cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5 text-[#8C5D33]" />
          <span>Ingest Case</span>
        </button>

        {/* Export PDF Report */}
        <button
          onClick={onExportPdf}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-extrabold rounded-xl bg-bronze-metallic text-white hover:opacity-95 shadow-sm transition-all cursor-pointer uppercase tracking-wider"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Export Dossier</span>
        </button>

        {/* Privacy Redaction Toggle */}
        <button
          onClick={togglePrivacy}
          className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
            privacyRedacted
              ? 'bg-[#CA8B4B]/15 border-[#CA8B4B]/40 text-[#8C5D33]'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-700'
          }`}
          title={privacyRedacted ? "PII Redaction Active" : "Unmasked Raw Data"}
        >
          {privacyRedacted ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{privacyRedacted ? 'Privacy ON' : 'Unmasked'}</span>
        </button>

        {/* Logout / Switch Role */}
        <button
          onClick={logout}
          className="p-2 rounded-xl bg-[#F5ECE3] border border-[#EBDCCF] text-[#7D6B5D] hover:text-[#2C1F18] hover:border-[#8C5D33] transition-all cursor-pointer ml-1"
          title="Return to Login Portal"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

    </header>
  );
}
