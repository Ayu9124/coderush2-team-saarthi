# Digital Fraud & Synthetic-Media Forensics Platform
**CodeRush 2.0 Hackathon | Cyber Security Track | Problem Statement 1 | Team Saarthi**

An end-to-end, privacy-preserving AI forensics and digital investigation platform designed for trust-and-safety analysts, fraud investigators, and law enforcement teams.

---

## Key Features

1. **Multimodal Forensic Ingestion Pipeline**
   - **Voice Agent**: Transcribes audio (Whisper) and calculates spectral phase variance and neural TTS voice clone signatures (ElevenLabs / VALL-E).
   - **Video & Face Agent**: Analyzes lip-audio synchronization offset (ms), eye blink rate, facial landmark jitter, and Error Level Analysis (ELA) on video keyframes.
   - **Document Agent**: Uses EasyOCR, font baseline & kerning mismatch checks, ELA compression analysis, and EXIF metadata editing tags (Photoshop/GIMP).
   - **Metadata & Network Agent**: Inspects SIP VoIP caller ID spoofing, proxy/Tor exit nodes, cellular tower hops, and device velocity anomalies.

2. **Interactive Evidence Topology Graph**
   - Powered by `@xyflow/react` (React Flow) and `NetworkX`.
   - Visualizes directed relationship edges across Victims, Scam Phones, Voice Clones, Deepfake Videos, Edited Documents, Bank Accounts, IP Clusters, and Devices.
   - Interactive Node Inspector drawer displaying graph centrality, metadata attributes, and cryptographic SHA-256 custody tags.

3. **Multi-Agent AI Copilot Assistant**
   - Natural language RAG assistant allowing investigators to query case context (*"Why is this call flagged?"*, *"Explain privacy rules"*, *"What are the recommended actions?"*).

4. **Privacy Controls & Safety Boundary Enforcement**
   - Toggleable **Privacy Redaction Mode** that automatically pseudonymizes PII (`User-001`, `Phone-XXX`, `Device-YYY`).
   - Strictly enforces safety boundaries: separates media integrity findings from identity attribution and blocks illegal VPN unmasking or auto-doxxing.

5. **Digital Chain of Custody & PDF Investigation Report**
   - Generates immutable cryptographic SHA-256 evidence hashes for every exhibit file.
   - 1-Click export of court/audit-ready PDF Investigation Dossiers using `reportlab`.

6. **Cybersecurity Intelligence UI/UX**
   - Dark Mode (`#0B0F19`) and Light Mode (`#F8FAFC`) matching state-of-the-art cybersecurity monitoring dashboards.
   - Live streaming threat feed (WebSocket endpoint), KPI score gauges, and chronological AI event timeline.

---

## Tech Stack & Architecture

- **Frontend**: React 18, Vite, Tailwind CSS (v4), `@xyflow/react` (React Flow), Framer Motion, Recharts, Lucide React, Canvas Confetti.
- **Backend**: FastAPI, Uvicorn, WebSockets, NetworkX, ReportLab, Scikit-Learn / XGBoost, Pillow, PyPDF2, Pydantic.
- **AI Models & Libraries**: Whisper, DeepFace / OpenCV ELA, EasyOCR, SpeechBrain / Spectral Analysis.

---

## Getting Started

### 1. Run Backend Server (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
- API Base URL: `http://localhost:8000`
- Interactive API Docs: `http://localhost:8000/docs`

### 2. Run Frontend Dashboard (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
- Open browser at: `http://localhost:5173`

---

## Project Structure

```
coderush2-team-saarthi/
├── backend/
│   ├── agents/
│   │   ├── voice_agent.py
│   │   ├── video_agent.py
│   │   ├── document_agent.py
│   │   ├── metadata_agent.py
│   │   ├── network_agent.py
│   │   └── report_agent.py
│   ├── services/
│   │   ├── graph_engine.py
│   │   ├── risk_scorer.py
│   │   ├── privacy_guard.py
│   │   ├── custody_logger.py
│   │   └── ai_copilot.py
│   ├── sample_data/
│   │   ├── case_001_vishing_scam.json
│   │   └── case_002_loan_fraud.json
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── MetricsRow.jsx
│   │   │   ├── EvidenceGraph.jsx
│   │   │   ├── TimelineView.jsx
│   │   │   ├── AgentAnalysisPanel.jsx
│   │   │   ├── AICopilot.jsx
│   │   │   ├── ThreatFeed.jsx
│   │   │   ├── ChainOfCustodyModal.jsx
│   │   │   └── CaseUploadModal.jsx
│   │   ├── context/
│   │   │   └── ThemeContext.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
└── README.md
```

---
*Developed by Team Saarthi for CodeRush 2.0 Hackathon.*
