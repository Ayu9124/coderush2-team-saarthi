import React from 'react';
import { Calendar } from 'lucide-react';

export default function CaseDossierBook({ caseId, title, date, onClick }) {
  // Map exact user-provided book artwork assets for pre-existing cases
  const imageMap = {
    'CASE-0017': '/case-0017-book.png',
    'CASE-0015': '/case-0015-book.png',
  };

  const bookImageSrc = imageMap[caseId];

  return (
    <div
      onClick={onClick}
      className="w-48 h-64 cursor-pointer select-none relative group transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.03]"
    >
      {bookImageSrc ? (
        /* Original Pristine Artwork for CASE-0017 and CASE-0015 (Zero Text Overlay) */
        <div className="w-full h-full relative drop-shadow-[0_12px_20px_rgba(44,31,24,0.3)] group-hover:drop-shadow-[0_18px_28px_rgba(140,93,51,0.35)] transition-all">
          <img
            src={bookImageSrc}
            alt={`${caseId} ${title}`}
            className="w-full h-full object-contain rounded-xl"
          />
        </div>
      ) : (
        /* High-Precision 3D Vintage Book Artwork for Dynamic New Cases */
        <div className="w-full h-full relative drop-shadow-[0_12px_20px_rgba(44,31,24,0.3)] group-hover:drop-shadow-[0_18px_28px_rgba(140,93,51,0.35)] transition-all">
          {/* Base Blank Vintage Book Image (Zero Ghost Lines!) */}
          <img
            src="/case-blank-book.png"
            alt={`${caseId} ${title}`}
            className="w-full h-full object-contain rounded-xl"
          />

          {/* Dynamic Content Container */}
          <div className="absolute top-[26%] left-[27%] w-[56%] h-[45%] flex flex-col items-center justify-between text-center pointer-events-none py-1">
            {/* Case ID */}
            <span className="font-sans text-[15px] font-medium text-[#111111] tracking-normal block">
              {caseId}
            </span>

            {/* Vintage Flourish Line */}
            <div className="flex items-center justify-center w-full my-0.5 opacity-80">
              <div className="w-5 h-[1px] bg-[#332211]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#332211] mx-1"></div>
              <div className="w-5 h-[1px] bg-[#332211]"></div>
            </div>

            {/* Case Title */}
            <div className="flex-1 flex items-center justify-center px-1 my-auto">
              <h4 className="font-sans text-[13.5px] font-medium text-[#111111] leading-snug tracking-tight text-center">
                {title}
              </h4>
            </div>
          </div>

          {/* Date Row (Icon + Text) */}
          <div className="absolute top-[62.8%] left-[27%] w-[56%] flex items-center justify-center space-x-1.5 pointer-events-none">
            <Calendar className="w-3.5 h-3.5 text-[#221100] stroke-[2]" />
            <span className="font-sans text-[11px] font-medium text-[#111111] tracking-tight">
              {date || '08 Aug 2026'}
            </span>
          </div>

        </div>
      )}
    </div>
  );
}
