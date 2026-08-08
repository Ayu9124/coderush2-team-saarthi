import React from 'react';
import { ShieldAlert, Activity, Radio, AlertOctagon } from 'lucide-react';

export default function LiveTickerBar() {
  return (
    <div className="w-full bg-[#1A130E] border-b border-[#8C5D33]/40 px-4 py-1.5 flex items-center justify-between text-xs text-[#FFFDF9] z-20 overflow-hidden shadow-inner">
      <div className="flex items-center space-x-2 flex-shrink-0 bg-[#2C1F18] px-3 py-0.5 rounded-md border border-[#8C5D33]/40">
        <Activity className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#DDAF7D]">
          LIVE TELEMETRY STREAM
        </span>
      </div>

      <div className="flex-1 overflow-hidden mx-4 relative">
        <div className="whitespace-nowrap animate-marquee flex items-center space-x-8 text-[11px] font-mono text-[#DDAF7D]/90">
          <span className="flex items-center space-x-1">
            <ShieldAlert className="w-3 h-3 text-rose-400 inline mr-1" />
            [1930 HELPLINE FEED] High-Risk Vishing Call Intercepted (Delhi NCR) • 92% TTS Voice Clone Match
          </span>
          <span className="text-[#8C5D33]">•</span>
          <span className="flex items-center space-x-1">
            <Radio className="w-3 h-3 text-amber-400 inline mr-1" />
            [ETHERSCAN STREAM] 1,420.5 ETH Liquidity Transfer Flagged to Blacklisted Wallet 0x71C...
          </span>
          <span className="text-[#8C5D33]">•</span>
          <span className="flex items-center space-x-1">
            <AlertOctagon className="w-3 h-3 text-rose-400 inline mr-1" />
            [ABUSE_IPDB ALERT] 42 Spoofed Gateway IPs Blocked (Tencent Cloud Node 118.25.6.1)
          </span>
        </div>
      </div>

      <div className="flex-shrink-0 text-[10px] font-mono text-[#DDAF7D]/70 bg-[#2C1F18] px-2.5 py-0.5 rounded border border-[#8C5D33]/30">
        ISO 27037 REAL-TIME VERIFIED
      </div>
    </div>
  );
}
