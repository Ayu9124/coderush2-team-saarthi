import React from 'react';
import { Clock, ShieldAlert, FileText, PhoneCall, CheckCircle } from 'lucide-react';

export default function TimelineView({ timeline = [] }) {
  const defaultEvents = [
    { time: '14:22:05', title: 'Inbound Vishing Call Received', desc: '+91 1800 222 555 spoofed caller-ID', icon: PhoneCall, color: 'text-rose-600' },
    { time: '14:23:40', title: 'ElevenLabs Voice Clone Matched', desc: 'Phase variance 0.94 anomaly flagged', icon: ShieldAlert, color: 'text-rose-600' },
    { time: '14:26:10', title: 'Fake Aadhaar PDF Received', desc: 'Photoshop EXIF tag & 95% ELA delta', icon: FileText, color: 'text-purple-600' },
    { time: '14:28:00', title: 'Mule Account Transfer Attempt', desc: '₹2,00,000 to ACC-8812 flagged', icon: CheckCircle, color: 'text-emerald-700' }
  ];

  const events = timeline.length > 0 ? timeline : defaultEvents;

  return (
    <div className="p-5 rounded-3xl border border-[#EBDCCF] bg-[#FFFDF9] shadow-sm font-mono space-y-4">
      <div className="flex items-center space-x-2 pb-2 border-b border-[#EBDCCF]">
        <Clock className="w-4 h-4 text-[#8C5D33]" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C1F18]">
          Chronological Event Sequence Timeline
        </h3>
      </div>

      <div className="relative border-l-2 border-[#EBDCCF] ml-3 space-y-4 py-1">
        {events.map((ev, idx) => {
          const Icon = ev.icon || Clock;
          return (
            <div key={idx} className="relative pl-6">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#FFFDF9] border-2 border-[#8C5D33] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#8C5D33]"></div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#8C5D33] block">{ev.time}</span>
                <span className="text-xs font-bold text-[#2C1F18] block">{ev.title}</span>
                <span className="text-[11px] text-[#7D6B5D] block mt-0.5">{ev.desc}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
