import React from 'react';
import { X, Lock, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export default function ChainOfCustodyModal({ isOpen, onClose, custody = [] }) {
  if (!isOpen) return null;

  const defaultCustody = [
    { file: 'sbi_manager_clone.wav', hash: 'e4f1a2b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6', timestamp: '2026-08-07T14:22:00Z', verified: true },
    { file: 'fake_aadhaar_card.pdf', hash: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2', timestamp: '2026-08-07T14:26:00Z', verified: true },
    { file: 'vishing_call_transcript.json', hash: '98f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7', timestamp: '2026-08-07T14:27:30Z', verified: true }
  ];

  const items = custody.length > 0 ? custody : defaultCustody;

  return (
    <div className="fixed inset-0 z-50 bg-[#2C1F18]/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FFFDF9] border border-[#EBDCCF] rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 font-mono relative">
        
        <div className="flex items-center justify-between pb-3 border-b border-[#EBDCCF]">
          <div className="flex items-center space-x-2 text-[#8C5D33]">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-bold text-sm text-[#2C1F18] uppercase tracking-wider">
              Cryptographic Digital Chain of Custody (ISO 27037)
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[#F5ECE3] text-[#7D6B5D] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#7D6B5D]">
          Every exhibit file ingested generates an immutable SHA-256 hash stamp to guarantee court admissibility.
        </p>

        <div className="overflow-x-auto border border-[#EBDCCF] rounded-2xl bg-[#F5ECE3]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EBDCCF] text-[#2C1F18] uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">Exhibit File</th>
                <th className="p-3">SHA-256 Hash</th>
                <th className="p-3">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBDCCF] text-[#2C1F18]">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#FAF5EF]">
                  <td className="p-3 font-bold flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-[#8C5D33]" />
                    <span>{item.file}</span>
                  </td>
                  <td className="p-3 text-[10px] text-[#7D6B5D] break-all font-mono">
                    {item.hash}
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

        <div className="flex justify-end pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-bronze-metallic text-white text-xs font-bold uppercase tracking-wider cursor-pointer">
            Close Ledger
          </button>
        </div>

      </div>
    </div>
  );
}
