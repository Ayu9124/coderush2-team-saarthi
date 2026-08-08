import React, { useState } from 'react';
import { 
  Mic, 
  Video, 
  FileText, 
  Globe, 
  Share2, 
  AlertTriangle, 
  Sparkles
} from 'lucide-react';

export default function AgentAnalysisPanel({ agents = {}, riskSummary = {} }) {
  const [activeTab, setActiveTab] = useState('voice');

  const sampleAgents = {
    voice: {
      agent: 'Voice Forensic Ensemble Agent',
      model_version: 'v2.4-Whisper-ElevenLabs',
      confidence_score: 0.92,
      signals: {
        spectral_phase_flatness: '0.94 (Unnatural)',
        vocal_tract_length: 'Inconsistent',
        neural_tts_signature: 'ElevenLabs Model V2',
        packet_jitter: '18ms (VoIP Gateway)'
      },
      transcription: 'Hello Ramesh, I am calling from State Bank manager desk. Send OTP immediately.',
      explanations: [
        'Spectral phase variance indicates synthetic TTS voice synthesis.',
        'VoIP SIP caller-ID header spoofed via external Gateway.'
      ],
      recommendation: 'High Risk: Synthetic voice clone attack confirmed.'
    },
    video: {
      agent: 'Video & Face Deepfake Agent',
      model_version: 'v1.8-DeepFace-LipSync',
      confidence_score: 0.87,
      signals: {
        lip_audio_offset: '180ms delay',
        eye_blink_rate: '0.05 Hz (Abnormal)',
        face_jitter_std: '4.2 pixels',
        keyframe_ela: 'High Compression Delta'
      },
      explanations: [
        'Lip movement desynchronized with audio stream.',
        'Facial landmark boundary artifacts detected in keyframes.'
      ],
      recommendation: 'High Risk: Deepfake face swap detected.'
    },
    document: {
      agent: 'Document Forgery Agent',
      model_version: 'v3.1-EasyOCR-ELA',
      confidence_score: 0.95,
      signals: {
        font_kerning_mismatch: '96% Confirmed',
        exif_editing_tag: 'Adobe Photoshop 24.1',
        ela_residual_spike: '94% Tampered',
        qr_code_checksum: 'Invalid Hash'
      },
      explanations: [
        'Aadhaar number text layer re-rendered over original background.',
        'EXIF metadata reveals Photoshop modification timestamp.'
      ],
      recommendation: 'High Risk: Document forged using image editing software.'
    },
    metadata: {
      agent: 'Network & Metadata Agent',
      model_version: 'v1.2-SIP-ProxyInspector',
      confidence_score: 0.78,
      signals: {
        origin_ip: '103.21.244.12 (Proxy)',
        sip_user_agent: 'Asterisk PBX v16',
        tower_hops: '3 Anomalous Hops',
        device_velocity: 'Impossible Travel'
      },
      explanations: [
        'Incoming caller ID spoofed via Asterisk PBX SIP trunk.',
        'Proxy IP matches known scam node cluster.'
      ],
      recommendation: 'Medium Risk: Anonymized proxy origin.'
    },
    network: {
      agent: 'Coordinated Ring Network Agent',
      model_version: 'v2.0-GraphX-MuleNet',
      confidence_score: 0.85,
      signals: {
        mule_accounts_linked: '4 Accounts',
        shared_device_id: 'DEV-8821-DELHI',
        ring_similarity: '94% Match',
        historical_cases: 'CR-2025-882'
      },
      explanations: [
        'Destination bank account linked to active loan scam ring in Jaipur.',
        'Device fingerprint shared across 3 historic vishing complaints.'
      ],
      recommendation: 'High Risk: Coordinated cyber fraud syndicate active.'
    }
  };

  const agentData = agents[activeTab] || sampleAgents[activeTab] || sampleAgents.voice;

  const tabs = [
    { id: 'voice', label: 'Voice Agent', icon: Mic, color: 'text-rose-700' },
    { id: 'video', label: 'Video Agent', icon: Video, color: 'text-amber-700' },
    { id: 'document', label: 'Document Agent', icon: FileText, color: 'text-purple-700' },
    { id: 'metadata', label: 'Metadata Agent', icon: Globe, color: 'text-blue-700' },
    { id: 'network', label: 'Network Agent', icon: Share2, color: 'text-[#8C5D33]' },
  ];

  return (
    <div className="p-5 rounded-3xl border border-[#EBDCCF] bg-[#FFFDF9] shadow-sm font-mono space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EBDCCF]">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#8C5D33]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C1F18]">
            Multi-Agent AI Forensics Diagnostics
          </h3>
        </div>
        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#8C5D33]/15 text-[#8C5D33] font-bold">
          Ensemble Scored
        </span>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1.5 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#8C5D33] text-white shadow-sm'
                  : 'bg-[#F5ECE3] text-[#7D6B5D] hover:text-[#2C1F18]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Body */}
      <div className="space-y-4 bg-[#F5ECE3]/60 p-4 rounded-2xl border border-[#EBDCCF]">
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#2C1F18]">
              {agentData.agent}
            </h4>
            <p className="text-[11px] text-[#7D6B5D]">
              Model: {agentData.model_version}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#7D6B5D] block">Confidence Score</span>
            <span className="text-lg font-bold text-rose-700">
              {Math.round((agentData.confidence_score || 0.9) * 100)}%
            </span>
          </div>
        </div>

        {/* Signals Table */}
        <div>
          <span className="text-xs text-[#8C5D33] font-bold uppercase block mb-2">
            Forensic Signals Detected:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {Object.entries(agentData.signals || {}).map(([key, val]) => (
              <div key={key} className="p-2.5 rounded-xl bg-[#FFFDF9] border border-[#EBDCCF] flex justify-between">
                <span className="text-[#7D6B5D] capitalize">{key.replace(/_/g, ' ')}:</span>
                <span className="text-[#2C1F18] font-bold">{String(val)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Voice Transcript if voice */}
        {activeTab === 'voice' && agentData.transcription && (
          <div className="p-3 rounded-xl bg-[#FFFDF9] border border-[#EBDCCF]">
            <span className="text-[10px] text-[#7D6B5D] uppercase font-bold block mb-1">
              Whisper STT Transcript:
            </span>
            <p className="text-xs italic text-[#8C5D33] font-semibold">
              "{agentData.transcription}"
            </p>
          </div>
        )}

        {/* XAI Diagnostics */}
        <div>
          <span className="text-xs text-amber-800 font-bold uppercase block mb-2">
            Explainable AI Reasoning (XAI)
          </span>
          <div className="space-y-1.5">
            {(agentData.explanations || []).map((exp, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-[#2C1F18]">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                <span>{exp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 text-xs font-bold">
          {agentData.recommendation}
        </div>

      </div>

    </div>
  );
}
