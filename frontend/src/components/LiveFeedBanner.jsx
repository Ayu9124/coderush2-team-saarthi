import React from 'react';
import { Activity, Radio } from 'lucide-react';

export default function LiveFeedBanner({ isConnected, liveCount = 0 }) {
  return (
    <div className="flex items-center space-x-3 px-3.5 py-1.5 rounded-full bg-[#2C1F18] border border-[#8C5D33]/40 text-[#FFFDF9] shadow-sm">
      <div className="flex items-center space-x-2">
        <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#DDAF7D]">
          {isConnected ? 'LIVE FEED ACTIVE' : 'CONNECTING TO FEED...'}
        </span>
      </div>

      <div className="w-[1px] h-3 bg-[#8C5D33]/40"></div>

      <div className="flex items-center space-x-1 text-[10px] font-mono text-[#FFFDF9]/80">
        <Radio className="w-3 h-3 text-[#DDAF7D] animate-spin" style={{ animationDuration: '4s' }} />
        <span>CYBER HELPLINE 1930</span>
      </div>
    </div>
  );
}
