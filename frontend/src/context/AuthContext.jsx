import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const ROLES = {
  SYSTEM_ADMIN: {
    id: 'SYSTEM_ADMIN',
    title: 'System Administrator',
    subtitle: 'Governance, Model Training & Data Privacy',
    badgeColor: 'bg-[#2C1F18] text-[#DDAF7D] border-[#8C5D33]'
  },
  LEAD_DETECTIVE: {
    id: 'LEAD_DETECTIVE',
    title: 'Lead Detective',
    subtitle: 'Graph Topology & Deepfake Forensics',
    badgeColor: 'bg-[#8C5D33]/15 text-[#8C5D33] border-[#8C5D33]/30'
  },
  TRIAGE_SPECIALIST: {
    id: 'TRIAGE_SPECIALIST',
    title: 'Triage Specialist',
    subtitle: 'Rapid Multimodal Ingestion',
    badgeColor: 'bg-[#CA8B4B]/15 text-[#CA8B4B] border-[#CA8B4B]/30'
  },
  LEGAL_AUDITOR: {
    id: 'LEGAL_AUDITOR',
    title: 'Legal Auditor',
    subtitle: 'ISO 27037 & PII Compliance',
    badgeColor: 'bg-[#5F3A1D]/15 text-[#5F3A1D] border-[#5F3A1D]/30'
  }
};

export function AuthProvider({ children }) {
  const [userRole, setUserRole] = useState(null); // null when on Landing/Login Page
  const [investigatorId, setInvestigatorId] = useState('INV-8821-DELHI');

  const login = (roleId, customId) => {
    if (customId) setInvestigatorId(customId);
    setUserRole(roleId || 'LEAD_DETECTIVE');
  };

  const switchRole = (newRole) => {
    setUserRole(newRole);
  };

  const logout = () => {
    setUserRole(null);
  };

  const userProfile = userRole ? {
    id: investigatorId,
    role: ROLES[userRole] || ROLES.LEAD_DETECTIVE
  } : null;

  return (
    <AuthContext.Provider value={{ userRole, userProfile, login, switchRole, logout, investigatorId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
