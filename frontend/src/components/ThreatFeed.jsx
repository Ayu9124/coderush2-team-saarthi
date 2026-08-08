import React from 'react';
import { Radio, AlertCircle } from 'lucide-react';

export default function ThreatFeed() {
  const feeds = [
    { title: 'New Vishing Vector Identified', detail: 'SIP trunk spoofing State Bank Toll-Free', severity: 'HIGH' },
    { title: 'Deepfake Model Variant V2.4', detail: 'Lip-sync artifact offset reduced to 120ms', severity: 'MED' },
    { title: 'Coordinated Mule Account Ring', detail: 'Axis Bank ACC-8812 linked to 3 complaints', severity: 'HIGH' }
  ];

  return (
    <div className="p-5 rounded-3xl border border-[#EBDCCF] bg-[#FFFDF9] shadow-sm font-mono space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-[#EBDCCF]">
        <div className="flex items-center space-x-2">
          <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C1F18]">
            Live Threat Stream Feed
          </h3>
        </div>
        <span className="text-[10px] text-rose-700 font-bold px-2 py-0.5 rounded-full bg-rose-500/10">
          STREAM ACTIVE
        </span>
      </div>

      <div className="space-y-2">
        {feeds.map((f, i) => (
          <div key={i} className="p-3 rounded-2xl bg-[#F5ECE3] border border-[#EBDCCF] space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-[#2C1F18]">
              <span>{f.title}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold ${f.severity === 'HIGH' ? 'bg-rose-500/20 text-rose-700' : 'bg-amber-500/20 text-amber-800'}`}>
                {f.severity}
              </span>
            </div>
            <p className="text-[11px] text-[#7D6B5D]">{f.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
