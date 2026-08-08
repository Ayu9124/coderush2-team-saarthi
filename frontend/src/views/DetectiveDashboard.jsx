import React from 'react';
import MetricsRow from '../components/MetricsRow';
import EvidenceGraph from '../components/EvidenceGraph';
import TimelineView from '../components/TimelineView';
import AgentAnalysisPanel from '../components/AgentAnalysisPanel';
import AudioWaveformViewer from '../components/AudioWaveformViewer';
import DocumentElaInspector from '../components/DocumentElaInspector';
import CaseComparisonView from '../components/CaseComparisonView';
import AICopilot from '../components/AICopilot';
import ThreatFeed from '../components/ThreatFeed';

export default function DetectiveDashboard({ caseDetail, currentCaseId, onCopilotQuery }) {
  return (
    <div className="space-y-6">
      
      {/* Metrics Header Row */}
      <MetricsRow 
        caseDetail={caseDetail}
        riskSummary={caseDetail?.risk_summary}
      />

      {/* Main Investigation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols wide): Topology Graph, Visualizers, Multi-Agent Diagnostics */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Interactive Evidence Topology Graph */}
          <EvidenceGraph graphData={caseDetail?.graph} />

          {/* Multimodal Forensic Inspectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AudioWaveformViewer voiceData={caseDetail?.agents?.voice} />
            <DocumentElaInspector docData={caseDetail?.agents?.document} />
          </div>

          {/* Multi-Agent AI Forensics Diagnostics */}
          <AgentAnalysisPanel 
            agents={caseDetail?.agents} 
            riskSummary={caseDetail?.risk_summary}
          />

          {/* Cross-Case Intelligence Comparison */}
          <CaseComparisonView currentCaseId={currentCaseId} />

          {/* Chronological Event Timeline */}
          <TimelineView timeline={caseDetail?.case?.timeline} />

        </div>

        {/* Right Column (1 Col wide): AI Copilot & Live Threat Feed */}
        <div className="space-y-6">
          
          {/* AI Investigator Copilot */}
          <AICopilot 
            currentCaseId={currentCaseId}
            onQuerySubmit={onCopilotQuery}
          />

          {/* Live Threat Stream Feed */}
          <ThreatFeed />

        </div>

      </div>

    </div>
  );
}
