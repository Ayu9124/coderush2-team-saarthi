import React, { useState, useEffect } from 'react';
import { GitCompare, AlertTriangle } from 'lucide-react';

export default function CaseComparisonView({ currentCaseId }) {
  const sampleMatches = [
    {
      matched_case_id: 'CR-2025-882',
      matched_title: 'Loan Vishing Scam Syndicate',
      similarity_score: 94,
      shared_entities: ['Voice Payload Hash #E4F1', 'SIP Gateway 103.21.244.12', 'Mule Account ACC-8812'],
      recommended_action: 'Merge cases & issue joint freeze warrant to Axis Bank.'
    }
  ];

  return (
    <div className="p-5 rounded-3xl border border-[#EBDCCF] bg-[#FFFDF9] shadow-sm font-mono space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-[#EBDCCF]">
        <div className="flex items-center space-x-2">
          <GitCompare className="w-4 h-4 text-[#8C5D33]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C1F18]">
            Cross-Case Intelligence Comparison
          </h3>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8C5D33]/15 text-[#8C5D33] font-bold">
          Ring Correlation Active
        </span>
      </div>

      <p className="text-xs text-[#7D6B5D]">
        Scans historic archives to identify matching voice payload hashes, shared proxy IPs, duplicate device IDs, and collusive mule accounts.
      </p>

      <div className="space-y-2">
        {sampleMatches.map((match, idx) => (
          <div key={idx} className="p-3 rounded-2xl border border-[#EBDCCF] bg-[#F5ECE3] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xs text-[#8C5D33]">
                  [{match.matched_case_id}]
                </span>
                <span className="text-xs font-semibold text-[#2C1F18]">
                  {match.matched_title}
                </span>
              </div>
              <span className="text-xs font-extrabold text-rose-700 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">
                {match.similarity_score}% Ring Similarity
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-[#7D6B5D] uppercase font-bold block">
                Identified Overlapping Indicators:
              </span>
              {match.shared_entities.map((se, i) => (
                <div key={i} className="flex items-center space-x-2 text-xs text-amber-800 font-semibold">
                  <AlertTriangle className="w-3 h-3 text-amber-700 flex-shrink-0" />
                  <span>{se}</span>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-emerald-800 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/30 font-bold">
              Action: {match.recommended_action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
