export const DEFAULT_CASES = [
  {
    case_id: 'CASE-0027',
    caseId: 'CASE-0027',
    title: 'VoIP Vishing Syndicate',
    overall_risk_score: 91,
    status: 'LIVE_FEED_FLAGGED',
    victim: 'Anil Deshmukh',
    loss_amount: '₹4,80,000',
    date: '08 Aug 2026',
    description: '[REALTIME TELEMETRY: CYBER_HELPLINE_1930] Intercepted 1930 helpline recording of automated deepfake caller impersonating HDFC Fraud Cell.',
    investigator_id: 'INV-8821-DELHI',
    evidences: [
      {
        id: 'ev-rt-1786146633',
        category: 'audio',
        name: 'Live_AUDIO_VOIP_Feed.wav',
        sub: '(CYBER_HELPLINE_1930)',
        hash: '80602840f302166702c67c82cd74374498bfe7bfcb3ef477b26c4b6ae791d675'
      }
    ]
  },
  {
    case_id: 'CASE-0026',
    caseId: 'CASE-0026',
    title: 'VoIP Vishing Syndicate',
    overall_risk_score: 91,
    status: 'LIVE_FEED_FLAGGED',
    victim: 'Anil Deshmukh',
    loss_amount: '₹4,80,000',
    date: '08 Aug 2026',
    description: '[REALTIME TELEMETRY: CYBER_HELPLINE_1930] Intercepted 1930 helpline recording of automated deepfake caller impersonating HDFC Fraud Cell.',
    investigator_id: 'INV-8821-DELHI',
    evidences: [
      {
        id: 'ev-rt-1786142764',
        category: 'audio',
        name: 'Live_AUDIO_VOIP_Feed.wav',
        sub: '(CYBER_HELPLINE_1930)',
        hash: 'e5ea8c9c30b750c794d9068f0774d07c8a51c946a42062c4bacaf5b60592fe88'
      }
    ]
  },
  {
    case_id: 'CASE-0025',
    caseId: 'CASE-0025',
    title: 'OTP SCAM',
    overall_risk_score: 85,
    status: 'IN_REVIEW',
    victim: 'Ramesh Kumar',
    loss_amount: '₹2,00,000',
    date: '08 Aug 2026',
    description: 'Ingested multimodal forensic case. Multi-agent analysis active.',
    investigator_id: 'INV-8821-DELHI',
    evidences: []
  },
  {
    case_id: 'CASE-0024',
    caseId: 'CASE-0024',
    title: 'Scam Call',
    overall_risk_score: 85,
    status: 'IN_REVIEW',
    victim: 'Ayush Patil',
    loss_amount: '₹2000',
    date: '08 Aug 2026',
    description: 'Ingested multimodal forensic case. Multi-agent analysis active.',
    investigator_id: 'INV-8821-DELHI',
    evidences: []
  },
  {
    case_id: 'CASE-0021',
    caseId: 'CASE-0021',
    title: 'System Hacking',
    overall_risk_score: 85,
    status: 'IN_REVIEW',
    victim: 'Piysh Gosavi',
    loss_amount: '₹2',
    date: '08 Aug 2026',
    description: 'Ingested multimodal forensic case. Multi-agent analysis active.',
    investigator_id: 'INV-8821-DELHI',
    evidences: []
  },
  {
    case_id: 'CASE-0020',
    caseId: 'CASE-0020',
    title: 'fake call scam',
    overall_risk_score: 85,
    status: 'IN_REVIEW',
    victim: 'ramesh kumar',
    loss_amount: '₹2,00,000',
    date: '08 Aug 2026',
    description: 'Ingested multimodal forensic case. Multi-agent analysis active.',
    investigator_id: 'INV-8821-DELHI',
    evidences: []
  },
  {
    case_id: 'CASE-0017',
    caseId: 'CASE-0017',
    title: 'Bank Fraud',
    overall_risk_score: 88,
    status: 'EVIDENCE_FLAGGED',
    victim: 'Ramesh K. (Redacted)',
    loss_amount: '₹2,45,000',
    date: '12 May 2025',
    description: 'Synthesized Vishing call received impersonating State Bank manager requesting OTP. Fraudulent transfer attempt to Axis Bank mule account ACC-8812.',
    investigator_id: 'INV-8821-DELHI',
    evidences: [
      {
        id: 'audio-1',
        category: 'audio',
        name: 'ATM CCTV Footage (2:30 - 3:00)',
        sub: '2:30 - 3:00',
        hash: 'e4f1a2b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6'
      },
      {
        id: 'video-1',
        category: 'video',
        name: 'Transaction Log',
        sub: '(video.mp4)',
        hash: 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3'
      },
      {
        id: 'doc-1',
        category: 'document',
        name: 'Bank Statement',
        sub: '(statement.pdf)',
        hash: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2'
      },
      {
        id: 'img-1',
        category: 'image',
        name: 'Suspect Profile',
        sub: '(profile.jpg)',
        hash: 'f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5'
      }
    ]
  },
  {
    case_id: 'CASE-0015',
    caseId: 'CASE-0015',
    title: 'Investment Scam',
    overall_risk_score: 82,
    status: 'IN_REVIEW',
    victim: 'Priya S. (Redacted)',
    loss_amount: '₹8,50,000',
    date: '09 May 2025',
    description: 'Deepfake AI voice & spoofed Telegram channel promoting high-yield crypto trading scam. Victims coerced into transferring ₹8,50,000 to offshore liquidity pool.',
    investigator_id: 'INV-8821-DELHI',
    evidences: [
      {
        id: 'audio-2',
        category: 'audio',
        name: 'Telegram Voice Call',
        sub: '0:45 - 2:15',
        hash: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4'
      },
      {
        id: 'video-2',
        category: 'video',
        name: 'Crypto Wallet Transfer Log',
        sub: '(wallet_tx.mp4)',
        hash: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5'
      },
      {
        id: 'doc-2',
        category: 'document',
        name: 'Investment Agreement',
        sub: '(contract.pdf)',
        hash: 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6'
      },
      {
        id: 'img-2',
        category: 'image',
        name: 'Fraudulent Ledger Screenshot',
        sub: '(proof.jpg)',
        hash: 'f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9'
      }
    ]
  }
];

export function getCaseById(id) {
  return DEFAULT_CASES.find(c => c.case_id === id || c.caseId === id) || {
    case_id: id || 'CASE-0017',
    caseId: id || 'CASE-0017',
    title: 'Digital Fraud Case',
    overall_risk_score: 85,
    status: 'IN_REVIEW',
    victim: 'Subject (Redacted)',
    loss_amount: '₹2,00,000',
    date: '08 Aug 2026',
    description: 'Ingested multimodal forensic case. Multi-agent analysis active.',
    investigator_id: 'INV-8821-DELHI',
    evidences: []
  };
}
