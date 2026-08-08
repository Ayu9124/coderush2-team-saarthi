import React, { useState } from 'react';
import { UploadCloud, Zap, FileText, AlertTriangle } from 'lucide-react';
import AudioWaveformViewer from '../components/AudioWaveformViewer';
import DocumentElaInspector from '../components/DocumentElaInspector';

export default function TriageDashboard({ caseDetail, onOpenUpload }) {
  const cData = caseDetail?.case || {};

  return (
    <div className="space-y-6 font-mono">
      
      {/* Triage Banner */}
      <div className="p-6 rounded-3xl border border-[#EBDCCF] bg-[#FFFDF9] flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-[#8C5D33]/15 text-[#8C5D33]">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#2C1F18] uppercase tracking-wider">
              Triage & Ingestion Specialist Portal
            </h2>
            <p className="text-xs text-[#7D6B5D] mt-0.5">
              High-Velocity Multimodal Ingestion | Frame-by-Frame Inspector | ELA Compression Scanning
            </p>
          </div>
        </div>

        <button
          onClick={onOpenUpload}
          className="px-5 py-2.5 rounded-xl bg-bronze-metallic text-white text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 shadow-sm"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Ingest New Media Exhibit</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          <AudioWaveformViewer voiceData={caseDetail?.agents?.voice} />
          <DocumentElaInspector docData={caseDetail?.agents?.document} />

          {/* Exhibits Queue */}
          <div className="p-5 rounded-3xl border border-[#EBDCCF] bg-[#FFFDF9] space-y-3 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C5D33]">
              Attached Case Exhibits Queue ({cData.custody?.length || 3} Files)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { file: 'sbi_manager_clone.wav', hash: 'e4f1a2b8c9d0e1f2a3b4c5d6e7f8...' },
                { file: 'fake_aadhaar_card.pdf', hash: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4...' },
                { file: 'vishing_call_transcript.json', hash: '98f7e6d5c4b3a2f1e0d9c8b7a6f5...' }
              ].map((ex, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl border border-[#EBDCCF] bg-[#F5ECE3] flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-4 h-4 text-[#8C5D33]" />
                    <div>
                      <span className="text-xs font-bold text-[#2C1F18] block">{ex.file}</span>
                      <span className="text-[10px] text-[#7D6B5D] font-mono">{ex.hash}</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 font-bold border border-emerald-500/30">
                    SCANNED
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Rapid Signal Checklist */}
        <div className="space-y-6">
          <div className="p-5 rounded-3xl border border-[#EBDCCF] bg-[#FFFDF9] space-y-3 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Rapid Forensic Signal Checklist</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 flex justify-between items-center text-rose-800">
                <span>ElevenLabs TTS Match</span>
                <span className="font-bold">92% (High Risk)</span>
              </div>

              <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 flex justify-between items-center text-amber-800">
                <span>Lip-Sync Audio Delay</span>
                <span className="font-bold">180ms Offset</span>
              </div>

              <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 flex justify-between items-center text-rose-800">
                <span>Aadhaar ELA Font Tamper</span>
                <span className="font-bold">95% Confirmed</span>
              </div>

              <div className="p-3 rounded-xl border border-[#8C5D33]/30 bg-[#8C5D33]/10 flex justify-between items-center text-[#8C5D33]">
                <span>SIP Caller ID Spoof</span>
                <span className="font-bold">68% Flagged</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
