import React, { useState } from 'react';
import { Layers, Eye, Sliders, FileText } from 'lucide-react';

export default function DocumentElaInspector({ docName = "fake_aadhaar_card.pdf", docData = {} }) {
  const [showElaHeatmap, setShowElaHeatmap] = useState(true);
  const [elaThreshold, setElaThreshold] = useState(85);

  return (
    <div className="p-5 rounded-3xl border border-[#EBDCCF] bg-[#FFFDF9] shadow-sm font-mono space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EBDCCF]">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-700 border border-purple-500/30">
            <Layers className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#2C1F18] uppercase tracking-wider">
              Document Error Level Analysis (ELA) Inspector
            </h4>
            <span className="text-[11px] text-[#7D6B5D]">Exhibit: {docName} | Engine: EasyOCR + EXIF</span>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-800 text-xs font-bold border border-purple-500/30">
          FORGERY PROBABILITY 95%
        </span>
      </div>

      {/* Document Visualizer */}
      <div className="relative h-56 bg-[#F5ECE3] rounded-2xl p-4 border border-[#EBDCCF] flex items-center justify-center overflow-hidden">
        
        {/* Mock ID Card */}
        <div className="w-full max-w-md h-full bg-[#FFFDF9] border border-[#EBDCCF] rounded-xl p-4 flex flex-col justify-between relative shadow-sm">
          
          <div className="flex justify-between items-center border-b border-[#EBDCCF] pb-2">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-purple-700" />
              <span className="text-xs font-bold text-[#2C1F18] uppercase">GOVERNMENT ID CARD (AADHAAR)</span>
            </div>
            <span className="text-[10px] text-[#7D6B5D] font-mono">VER-2026</span>
          </div>

          <div className="flex space-x-4 my-2 items-center">
            <div className="w-16 h-20 bg-[#F5ECE3] border border-[#EBDCCF] rounded-lg flex flex-col items-center justify-center text-[10px] text-[#7D6B5D]">
              <span className="text-lg">👤</span>
              <span>[PHOTO]</span>
            </div>

            <div className="flex-1 space-y-2">
              <div>
                <span className="text-[10px] text-[#7D6B5D] block">NAME:</span>
                <span className="text-sm font-bold text-[#2C1F18]">Ramesh Kumar</span>
              </div>

              <div className={`p-2 rounded-lg border transition-all ${
                showElaHeatmap 
                  ? 'bg-rose-500/15 border-rose-500 text-rose-800' 
                  : 'bg-[#F5ECE3] border-[#EBDCCF] text-[#2C1F18]'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold">AADHAAR: 4912 8821 9012</span>
                  {showElaHeatmap && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-600 text-white font-extrabold">
                      FORGED BASELINE
                    </span>
                  )}
                </div>
                {showElaHeatmap && (
                  <span className="text-[10px] text-rose-700 font-semibold block mt-1">
                    • ELA Delta: 94% Residual Spike | Photoshop EXIF Tag Identified
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-[#7D6B5D] border-t border-[#EBDCCF] pt-2">
            <span>EXIF: Adobe Photoshop 24.1 (Windows)</span>
            <span className="text-rose-700 font-bold">Font Kerning Mismatch: 96%</span>
          </div>

        </div>

      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between text-xs pt-1">
        <button
          onClick={() => setShowElaHeatmap(!showElaHeatmap)}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center space-x-2 ${
            showElaHeatmap 
              ? 'bg-purple-700 text-white shadow-sm' 
              : 'bg-[#F5ECE3] border border-[#EBDCCF] text-[#38281F]'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>{showElaHeatmap ? 'ELA HEATMAP ACTIVE' : 'SHOW RAW DOCUMENT'}</span>
        </button>

        <div className="flex items-center space-x-3 text-[#38281F]">
          <Sliders className="w-4 h-4 text-purple-700" />
          <span>Compression Sensitivity:</span>
          <input
            type="range"
            min="30"
            max="100"
            value={elaThreshold}
            onChange={(e) => setElaThreshold(e.target.value)}
            className="w-24 accent-purple-700 cursor-pointer"
          />
          <span className="font-extrabold text-purple-700">{elaThreshold}%</span>
        </div>
      </div>

    </div>
  );
}
