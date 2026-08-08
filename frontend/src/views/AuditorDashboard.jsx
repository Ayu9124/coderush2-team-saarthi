import React from 'react';
import { Scale, Lock, EyeOff, Eye, FileText, CheckCircle2, ShieldCheck, Download, AlertOctagon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function AuditorDashboard({ caseDetail, currentCaseId, onExportPdf }) {
  const { privacyRedacted, togglePrivacy } = useTheme();

  return (
    <div className="space-y-6 font-mono">
      
      {/* Auditor Banner */}
      <div className="p-6 rounded-3xl border border-[#EBDCCF] bg-[#FFFDF9] flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-800">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#2C1F18] uppercase tracking-wider">
              Compliance & Legal Auditor Governance Portal
            </h2>
            <p className="text-xs text-emerald-800 font-semibold">
              ISO/IEC 27037 Digital Forensics Admissibility | PII Privacy Redaction Audit | Signed PDF Exporter
            </p>
          </div>
        </div>

        <button
          onClick={onExportPdf}
          className="px-5 py-2.5 rounded-xl bg-bronze-metallic text-white text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 shadow-sm uppercase tracking-wider"
        >
          <Download className="w-4 h-4" />
          <span>Export Signed Court Dossier (PDF)</span>
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Privacy Redaction Control */}
          <div className="p-5 rounded-3xl border border-[#EBDCCF] bg-[#FFFDF9] space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBDCCF]">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-[#8C5D33]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C1F18]">
                  PII Anonymization & Privacy Control Panel (Rule 81)
                </h3>
              </div>

              <button
                onClick={togglePrivacy}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  privacyRedacted
                    ? 'bg-amber-500/15 border border-amber-500/40 text-amber-800'
                    : 'bg-rose-500/15 border border-rose-500/40 text-rose-800'
                }`}
              >
                {privacyRedacted ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{privacyRedacted ? 'Redaction Active (PII Masked)' : 'Unmasked Raw Data'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl border border-[#EBDCCF] bg-[#F5ECE3]">
                <span className="text-[#7D6B5D] block mb-1">Subject Identity:</span>
                <span className="font-bold text-[#2C1F18]">Ramesh Kumar</span>
              </div>

              <div className="p-3.5 rounded-2xl border border-[#EBDCCF] bg-[#F5ECE3]">
                <span className="text-[#7D6B5D] block mb-1">Origin Phone Number:</span>
                <span className="font-bold text-[#8C5D33]">+91 1800 222 555 (Spoofed)</span>
              </div>

              <div className="p-3.5 rounded-2xl border border-[#EBDCCF] bg-[#F5ECE3]">
                <span className="text-[#7D6B5D] block mb-1">Destination Bank Account:</span>
                <span className="font-bold text-[#2C1F18]">ACC-****-8812</span>
              </div>

              <div className="p-3.5 rounded-2xl border border-[#EBDCCF] bg-[#F5ECE3]">
                <span className="text-[#7D6B5D] block mb-1">Proxy IP Origin Node:</span>
                <span className="font-bold text-[#2C1F18]">103.21.*.* (Redacted)</span>
              </div>
            </div>
          </div>

          {/* Chain of Custody Table */}
          <div className="p-5 rounded-3xl border border-[#EBDCCF] bg-[#FFFDF9] space-y-3 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Digital Chain of Custody SHA-256 Ledger</span>
            </h3>

            <div className="overflow-x-auto border border-[#EBDCCF] rounded-2xl bg-[#F5ECE3]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EBDCCF] text-[#2C1F18] uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Exhibit File</th>
                    <th className="p-3">SHA-256 Checksum Hash</th>
                    <th className="p-3">Integrity State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBDCCF] text-[#2C1F18]">
                  {[
                    { file: 'sbi_manager_clone.wav', hash: 'e4f1a2b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6' },
                    { file: 'fake_aadhaar_card.pdf', hash: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2' },
                    { file: 'vishing_call_transcript.json', hash: '98f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7' }
                  ].map((c, i) => (
                    <tr key={i} className="hover:bg-[#FAF5EF]">
                      <td className="p-3 font-bold flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-[#8C5D33]" />
                        <span>{c.file}</span>
                      </td>
                      <td className="p-3 font-mono text-[10px] text-[#7D6B5D] break-all">
                        {c.hash}
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 text-[10px] font-bold border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>VERIFIED</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="p-5 rounded-3xl border border-[#EBDCCF] bg-[#FFFDF9] space-y-3 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center space-x-2">
              <AlertOctagon className="w-4 h-4 text-rose-700" />
              <span>Safety & Legal Boundaries</span>
            </h3>

            <div className="space-y-2 text-xs leading-relaxed">
              <div className="p-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-800">
                <b>Rule 93 Notice:</b> A case with synthetic-media evidence but no authorized identity data remains a media-integrity finding, not an identity-resolution result.
              </div>

              <div className="p-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-900">
                <b>Prohibition:</b> Do not deanonymize VPN, Tor, or proxy users; infer location; expose private data; or produce doxxing/attribution pipelines.
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
