import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Mic, Activity, AlertTriangle } from 'lucide-react';

export default function AudioWaveformViewer({ audioFile = "sbi_manager_clone.wav", voiceData = {} }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(14);
  const duration = 42;
  const canvasRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;

      const barCount = 64;
      const barWidth = (width / barCount) - 2;

      for (let i = 0; i < barCount; i++) {
        let barHeight;
        if (isPlaying) {
          barHeight = Math.sin(phase + i * 0.2) * 35 + 40 + Math.random() * 15;
        } else {
          barHeight = Math.sin(i * 0.3) * 20 + 30;
        }

        const isAnomalyZone = i >= 22 && i <= 38;
        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        if (isAnomalyZone) {
          ctx.fillStyle = '#E11D48'; // Rose red for neural TTS anomaly
        } else {
          ctx.fillStyle = '#8C5D33'; // Warm bronze for natural formant
        }

        ctx.fillRect(x, y, barWidth, barHeight);
      }

      if (isPlaying) {
        phase += 0.15;
        setCurrentTime((prev) => (prev >= duration ? 0 : prev + 0.1));
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying]);

  return (
    <div className="p-5 rounded-3xl border border-[#EBDCCF] bg-[#FFFDF9] shadow-sm font-mono space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EBDCCF]">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/30">
            <Mic className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#2C1F18] uppercase tracking-wider flex items-center space-x-2">
              <span>Audio Forensic Spectrum Analyzer</span>
              <Activity className="w-4 h-4 text-[#8C5D33]" />
            </h4>
            <span className="text-[11px] text-[#7D6B5D]">Payload: {audioFile} | Duration: {duration}s</span>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-700 text-xs font-bold border border-rose-500/30 animate-pulse">
          ELEVENLABS TTS CLONE 92%
        </span>
      </div>

      {/* Real HTML5 Canvas Spectrum */}
      <div className="relative h-28 bg-[#F5ECE3] rounded-2xl p-2 border border-[#EBDCCF] flex items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} width={600} height={100} className="w-full h-full" />
        
        {/* Anomaly Zone Marker */}
        <div className="absolute top-2 left-[35%] w-[25%] h-6 bg-rose-500/20 border border-rose-500/60 rounded-md flex items-center justify-center text-[10px] text-rose-800 font-bold">
          <AlertTriangle className="w-3 h-3 mr-1 text-rose-600" />
          <span>Synthetic Phase Artifact</span>
        </div>
      </div>

      {/* Controls & Metrics Bar */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-xl bg-bronze-metallic text-white font-extrabold transition-all cursor-pointer flex items-center space-x-2 shadow-sm"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'PAUSE WAVEFORM' : 'ANALYZE SPECTRUM'}</span>
          </button>

          <span className="text-[#38281F] font-mono font-bold">
            00:{Math.floor(currentTime).toString().padStart(2, '0')} / 00:{duration}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-[11px]">
          <span className="px-2.5 py-1 rounded-lg bg-[#F5ECE3] border border-[#EBDCCF] text-[#8C5D33] font-semibold">
            Pitch Var: 0.12 Hz (Unnatural)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-700 font-bold">
            VoIP SIP Gateway
          </span>
        </div>
      </div>

    </div>
  );
}
