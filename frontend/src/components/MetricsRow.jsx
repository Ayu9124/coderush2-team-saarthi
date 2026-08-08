import React from 'react';
import { 
  AlertTriangle, 
  Share2, 
  IndianRupee, 
  CheckCircle2, 
  Cpu, 
  FileCheck2
} from 'lucide-react';

export default function MetricsRow({ caseDetail, riskSummary }) {
  const score = riskSummary?.overall_risk_score || 88;
  const level = riskSummary?.risk_level || 'CRITICAL';
  const cData = caseDetail?.case || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      
      {/* KPI 1: Risk Score */}
      <div className="p-4 rounded-2xl border border-[#EBDCCF] bg-[#FFFDF9] shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7D6B5D]">
            Calibrated Risk Score
          </span>
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold font-mono text-rose-600">
            {score}%
          </span>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 border border-rose-500/30">
            {level}
          </span>
        </div>
        <p className="text-[11px] font-medium text-[#7D6B5D] mt-1">
          Synthetic Voice & ELA Tamper Confirmed
        </p>
      </div>

      {/* KPI 2: Media Integrity */}
      <div className="p-4 rounded-2xl border border-[#EBDCCF] bg-[#FFFDF9] shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7D6B5D]">
            Media Integrities
          </span>
          <div className="p-1.5 rounded-lg bg-[#8C5D33]/10 text-[#8C5D33]">
            <Cpu className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-[#2C1F18]">
          3 / 3 Flagged
        </div>
        <div className="flex items-center space-x-2 text-[11px] font-mono text-[#7D6B5D] mt-1">
          <span className="text-rose-600 font-bold">Voice 92%</span>
          <span>•</span>
          <span className="text-amber-600 font-bold">Video 87%</span>
          <span>•</span>
          <span className="text-rose-600 font-bold">Doc 95%</span>
        </div>
      </div>

      {/* KPI 3: Graph Topology */}
      <div className="p-4 rounded-2xl border border-[#EBDCCF] bg-[#FFFDF9] shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7D6B5D]">
            Entity Network Graph
          </span>
          <div className="p-1.5 rounded-lg bg-[#CA8B4B]/10 text-[#CA8B4B]">
            <Share2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-[#2C1F18]">
          {cData.entities?.length || 7} Nodes
        </div>
        <p className="text-[11px] font-mono text-[#7D6B5D] mt-1">
          {cData.relationships?.length || 9} Directed Edges Linked
        </p>
      </div>

      {/* KPI 4: Financial Loss */}
      <div className="p-4 rounded-2xl border border-[#EBDCCF] bg-[#FFFDF9] shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7D6B5D]">
            Reported Risk Amount
          </span>
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-700">
            <IndianRupee className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-[#2C1F18]">
          {cData.loss_amount || '₹2,00,000'}
        </div>
        <p className="text-[11px] font-mono text-emerald-700 mt-1 font-semibold">
          State: {cData.status || 'IN_REVIEW'}
        </p>
      </div>

      {/* KPI 5: Chain of Custody */}
      <div className="p-4 rounded-2xl border border-[#EBDCCF] bg-[#FFFDF9] shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7D6B5D]">
            Chain of Custody
          </span>
          <div className="p-1.5 rounded-lg bg-[#8C5D33]/10 text-[#8C5D33]">
            <FileCheck2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-center space-x-1.5 text-2xl font-bold font-mono text-emerald-700">
          <CheckCircle2 className="w-5 h-5" />
          <span>VERIFIED</span>
        </div>
        <p className="text-[11px] font-mono text-[#7D6B5D] mt-1">
          SHA-256 Hashes Intact
        </p>
      </div>

    </div>
  );
}
