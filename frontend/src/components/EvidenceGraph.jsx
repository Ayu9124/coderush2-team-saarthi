import React, { useState, useCallback, useMemo } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  User, 
  PhoneCall, 
  Mic, 
  Video, 
  FileText, 
  Building2, 
  Globe, 
  Smartphone,
  ShieldAlert,
  X,
  Lock,
  Share2
} from 'lucide-react';

const ForensicNode = ({ data }) => {
  const { label, type, riskScore, centrality, details } = data;

  const getIcon = () => {
    switch (type) {
      case 'victim': return <User className="w-4 h-4 text-[#8C5D33]" />;
      case 'phone': return <PhoneCall className="w-4 h-4 text-cyan-600" />;
      case 'audio': return <Mic className="w-4 h-4 text-rose-600" />;
      case 'video': return <Video className="w-4 h-4 text-amber-600" />;
      case 'document': return <FileText className="w-4 h-4 text-purple-600" />;
      case 'bank_account': return <Building2 className="w-4 h-4 text-rose-700" />;
      case 'ip': return <Globe className="w-4 h-4 text-blue-600" />;
      case 'device': return <Smartphone className="w-4 h-4 text-indigo-600" />;
      default: return <ShieldAlert className="w-4 h-4 text-[#7D6B5D]" />;
    }
  };

  const isHighRisk = riskScore >= 0.8;

  return (
    <div className={`px-4 py-3 rounded-2xl border font-mono min-w-[210px] transition-all bg-[#FFFDF9] shadow-md ${
      isHighRisk 
        ? 'border-rose-400 bg-rose-50/40' 
        : 'border-[#EBDCCF] hover:border-[#8C5D33]'
    }`}>
      <Handle type="target" position={Position.Top} className="!bg-[#8C5D33] w-2.5 h-2.5" />
      
      <div className="flex items-center justify-between space-x-2 mb-1.5">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-[#F5ECE3] border border-[#EBDCCF]">
            {getIcon()}
          </div>
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#7D6B5D]">
            {type}
          </span>
        </div>
        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
          isHighRisk ? 'bg-rose-500/20 text-rose-700 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-800 border border-emerald-500/40'
        }`}>
          {Math.round(riskScore * 100)}% RISK
        </span>
      </div>

      <div className="text-xs font-bold text-[#2C1F18] truncate">
        {label}
      </div>

      <div className="flex items-center justify-between text-[10px] text-[#7D6B5D] mt-2 pt-1.5 border-t border-[#EBDCCF]">
        <span>Centrality: {centrality}</span>
        <span className="text-[#8C5D33] font-bold hover:underline">Inspect Node →</span>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-[#8C5D33] w-2.5 h-2.5" />
    </div>
  );
};

export default function EvidenceGraph({ graphData }) {
  const nodeTypes = useMemo(() => ({ forensicNode: ForensicNode }), []);

  const defaultNodes = [
    { id: '1', type: 'forensicNode', position: { x: 250, y: 0 }, data: { label: 'Ramesh Kumar (Victim)', type: 'victim', riskScore: 0.1, centrality: 0.25, details: { phone: '+91 98****1102', account: 'SBI Savings' } } },
    { id: '2', type: 'forensicNode', position: { x: 100, y: 150 }, data: { label: '+91 1800 222 555 (Spoofed)', type: 'phone', riskScore: 0.92, centrality: 0.85, details: { provider: 'SIP Gateway', caller_id: 'SBI Manager' } } },
    { id: '3', type: 'forensicNode', position: { x: 400, y: 150 }, data: { label: 'sbi_manager_clone.wav', type: 'audio', riskScore: 0.95, centrality: 0.9, details: { duration: '42s', model: 'ElevenLabs TTS' } } },
    { id: '4', type: 'forensicNode', position: { x: 250, y: 300 }, data: { label: 'fake_aadhaar_card.pdf', type: 'document', riskScore: 0.94, centrality: 0.78, details: { ela_residual: '94%', exif_tool: 'Photoshop 24.1' } } },
    { id: '5', type: 'forensicNode', position: { x: 50, y: 300 }, data: { label: 'ACC-8812 (Mule Bank)', type: 'bank_account', riskScore: 0.88, centrality: 0.72, details: { bank: 'Axis Bank', state: 'Active Mule' } } },
    { id: '6', type: 'forensicNode', position: { x: 450, y: 300 }, data: { label: '103.21.244.12 (Proxy IP)', type: 'ip', riskScore: 0.82, centrality: 0.65, details: { location: 'New Delhi Node', exit: 'VPN Proxy' } } },
  ];

  const defaultEdges = [
    { id: 'e1-2', source: '1', target: '2', label: 'INBOUND VISHING CALL', animated: true, style: { stroke: '#CA8B4B', strokeWidth: 2 } },
    { id: 'e2-3', source: '2', target: '3', label: 'VOICE CLONE PAYLOAD', style: { stroke: '#E11D48', strokeWidth: 2 } },
    { id: 'e2-4', source: '2', target: '4', label: 'WHATSAPP DOCUMENT SHARE', style: { stroke: '#CA8B4B', strokeWidth: 2 } },
    { id: 'e4-5', source: '4', target: '5', label: 'FRAUDULENT OTP TRANSFER', style: { stroke: '#E11D48', strokeWidth: 2 } },
    { id: 'e2-6', source: '2', target: '6', label: 'SIP ROUTE HOP', style: { stroke: '#8C5D33', strokeWidth: 2 } },
  ];

  const [nodes, setNodes] = useState(graphData?.nodes || defaultNodes);
  const [edges, setEdges] = useState(graphData?.edges || defaultEdges);
  const [selectedNode, setSelectedNode] = useState(null);

  React.useEffect(() => {
    if (graphData && graphData.nodes) {
      setNodes(graphData.nodes);
      setEdges(graphData.edges);
    }
  }, [graphData]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  return (
    <div className="relative w-full h-[520px] rounded-3xl border border-[#EBDCCF] bg-[#FFFDF9] overflow-hidden shadow-sm">
      
      {/* React Flow Graph */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background color="#EBDCCF" gap={32} size={1} />
        <Controls className="!bg-[#FFFDF9] !border-[#EBDCCF] !text-[#2C1F18] !rounded-xl !shadow-sm" />
        <MiniMap 
          nodeColor={(node) => (node.data?.riskScore >= 0.8 ? '#E11D48' : '#8C5D33')}
          className="!bg-[#FFFDF9] !border-[#EBDCCF] !rounded-xl"
        />
      </ReactFlow>

      {/* Floating Header Tag */}
      <div className="absolute top-4 left-4 bg-[#FFFDF9]/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#EBDCCF] text-xs font-mono text-[#2C1F18] flex items-center space-x-3 shadow-sm">
        <Share2 className="w-4 h-4 text-[#8C5D33]" />
        <span className="font-bold uppercase tracking-wider">Evidence Topology Canvas</span>
        <span className="px-2 py-0.5 rounded-full bg-[#8C5D33]/15 text-[#8C5D33] font-extrabold text-[10px]">
          {nodes.length} ENTITIES | {edges.length} EDGES
        </span>
      </div>

      {/* Selected Node Inspector Drawer */}
      {selectedNode && (
        <div className="absolute top-4 right-4 w-80 bg-[#FFFDF9]/95 backdrop-blur-2xl border border-[#EBDCCF] rounded-3xl p-5 shadow-2xl z-20 text-xs font-mono">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EBDCCF]">
            <span className="font-extrabold text-[#8C5D33] uppercase tracking-wider">Entity Forensic Inspector</span>
            <button 
              onClick={() => setSelectedNode(null)} 
              className="p-1 rounded-full hover:bg-[#F5ECE3] text-[#7D6B5D] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[#7D6B5D] text-[10px] uppercase font-bold block">Label:</span>
              <div className="font-extrabold text-[#2C1F18] text-sm break-all">{selectedNode.data?.label}</div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#7D6B5D]">Entity Type:</span>
              <span className="uppercase text-[#8C5D33] font-extrabold bg-[#8C5D33]/10 px-2 py-0.5 rounded border border-[#8C5D33]/30">
                {selectedNode.data?.type}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#7D6B5D]">Calculated Risk Score:</span>
              <span className={`font-extrabold text-sm ${selectedNode.data?.riskScore >= 0.8 ? 'text-rose-600' : 'text-emerald-700'}`}>
                {Math.round((selectedNode.data?.riskScore || 0) * 100)}%
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#7D6B5D]">Degree Centrality:</span>
              <span className="text-[#2C1F18] font-bold">{selectedNode.data?.centrality}</span>
            </div>

            <div className="pt-2 border-t border-[#EBDCCF]">
              <span className="text-[#7D6B5D] text-[10px] uppercase font-bold block mb-1.5">Metadata Attributes:</span>
              <div className="bg-[#F5ECE3] p-3 rounded-xl border border-[#EBDCCF] space-y-1.5 text-[11px]">
                {Object.entries(selectedNode.data?.details || {}).map(([key, val]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-[#7D6B5D] capitalize">{key.replace('_', ' ')}:</span>
                    <span className="text-[#2C1F18] font-semibold truncate max-w-[140px]">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center space-x-1.5 text-[10px] text-emerald-800 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/30 font-bold">
                <Lock className="w-3.5 h-3.5" />
                <span>SHA-256 Custody Signature Verified</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
