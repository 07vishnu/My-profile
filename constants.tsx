
import React from 'react';
import { PersonalData, Experience, Skill } from './types';

export interface AIConfig {
  handoffTrigger: string;
  availabilityStatus: 'online' | 'busy' | 'away';
  awayMessage: string;
  waTemplate: string;
  handoffInstruction: string;
}

// Extended type to include resume-specific fields
export interface ExtendedPersonalData extends PersonalData {
  education: {
    degree: string;
    institution: string;
    year: string;
    percentage: string;
  }[];
  certifications: string[];
  extraCurricular: string[];
  whatsappUrl: string;
  phoneNumber: string;
  hobbies: string[];
  languages: string[];
  location: string;
  // Default/Fallback config
  aiConfig: AIConfig;
}

export const USER_DATA: ExtendedPersonalData = {
  name: "M. VISHNUNATH",
  title: "IT Infrastructure Specialist (Windows & VM Support)",
  tagline: "Managing mission-critical infrastructure at scale, from legacy systems to hybrid cloud environments.",
  bio: "I am a seasoned System Administrator with over 8 years of professional experience. My journey began with 6 years at TVS Mobility (2016-2022) and currently continues at HCL (since Sep 2022), where I manage a massive environment of approximately 16,000 servers. I specialize in high-stakes incident management (P1-P3), virtualization at scale, and robust backup solutions.",
  email: "vishnunath.m95@gmail.com",
  linkedinUrl: "https://www.linkedin.com/in/vishnunath-m-2b77a9101",
  phoneNumber: "+91 99440 12688",
  whatsappUrl: "https://wa.me/919944012688?text=Hello%20Vishnunath,%20I'm%20querying%20the%20System%20Core.",
  location: "Madurai, Tamil Nadu, India",
  hobbies: ["Tech Blogging", "Strategic Gaming", "Continuous Learning", "Infrastructure Home-Labing"],
  languages: ["English", "Tamil"],
  aiConfig: {
    handoffTrigger: "BRIDGE_TO_HUMAN",
    availabilityStatus: 'online',
    awayMessage: "Vishnu is currently resolving a high-priority server incident. I have logged your request; please proceed to WhatsApp to queue your query.",
    waTemplate: "Hello Vishnunath, I'm reaching out from your portfolio. I have a query that your AI agent suggested you handle personally: ",
    handoffInstruction: "I apologize, but I have reached the threshold of my current technical knowledge regarding this specific query. I have flagged this for Vishnunath's personal review. He typically responds personally within a few hours."
  },
  skills: [
    { 
      name: "Windows Server (2003-2022)", 
      category: "Backend", 
      level: 95,
      description: "Enterprise persistence requires managing the old while deploying the new. I maintain legacy systems (2003/2008) that run critical industrial processes while architecting modern 2022 environments with hardened security policies and global Active Directory orchestration."
    },
    { 
      name: "VMware / vCenter / ESXi", 
      category: "Tools", 
      level: 95,
      description: "In an environment of 16,000 nodes, virtualization is the foundation. I manage massive vCenter clusters, optimizing distributed resource scheduling (DRS) and ensuring high availability (HA). This means zero-downtime migrations for mission-critical workloads."
    },
    { 
      name: "Networking & Connectivity", 
      category: "Backend", 
      level: 92,
      description: "Data only matters if it can move. I orchestrate complex enterprise networks including VLAN tagging, static routing, and VPN tunneling to ensure seamless connectivity between distributed data center clusters."
    },
    { 
      name: "Hyper-V Administration", 
      category: "Tools", 
      level: 90,
      description: "Specialized in Microsoft's virtualization stack, I manage failover clusters and Virtual Machine Manager (VMM) to provide high-resiliency hosting for core enterprise applications."
    },
    { 
      name: "ServiceNow / ITSM", 
      category: "Tools", 
      level: 95,
      description: "Infrastructure management is about more than just servers; it's about service. I utilize ServiceNow to manage rigorous P1/P2/P3 incident lifecycles, ensuring every disruption is triaged and resolved within SLA thresholds."
    },
    { 
      name: "AI & AI Agents", 
      category: "Tools", 
      level: 85,
      description: "The future of infrastructure is autonomous. I integrate Gemini AI to perform proactive diagnostics, automated log summarization, and predictive health checks across server nodes to catch failures before they happen."
    },
    { 
      name: "Monitoring (Spectrum)", 
      category: "Tools", 
      level: 90,
      description: "Visibility is safety. Using CA Spectrum, I maintain 100% observability over network and server faults, translating thousands of raw system events into actionable recovery steps."
    },
    { 
      name: "Backup (Rubrik)", 
      category: "Tools", 
      level: 85,
      description: "Backups are the ultimate safety net. I manage Rubrik's immutable snapshot architecture, guaranteeing that data can be recovered instantly even in the event of ransomware or catastrophic hardware failure."
    },
    { 
      name: "Hardware Diagnostics", 
      category: "Backend", 
      level: 95,
      description: "Physical uptime starts with the iron. I provide deep diagnostics for Dell PowerEdge, HP ProLiant, and Lenovo server hardware, coordinating rack-level repairs and life-cycle management."
    }
  ],
  projects: [],
  experience: [
    {
      company: "HCLTech",
      role: "IT Infrastructure Specialist",
      period: "Sep 2022 - Present",
      description: "Managing 16,000+ servers including VCenter, Hyper-V, and VMware. Handling P1/P2/P3 user incidents via ServiceNow. Monitoring via Moogsoft and Spectrum. Vendor management for physical hardware failures and ESX hosts. Managing enterprise backups using Rubrik."
    },
    {
      company: "TVS MOBILITY",
      role: "System Administrator",
      period: "2016 - Aug 2022",
      description: "Managed Active Directory, server infrastructure, and Office 365. Handled hardware/software issues and network configurations for 6 years, ensuring high availability and proactive maintenance. Conducted proactive assessments of infrastructure capacity and performance."
    }
  ],
  education: [
    {
      degree: "B.E. (CSE)",
      institution: "Kamaraj College of Engineering and Technology",
      year: "2016",
      percentage: "60%"
    },
    {
      degree: "Diploma (CSE)",
      institution: "GMS.MAVMM Polytechnic College",
      year: "2013",
      percentage: "76.7%"
    }
  ],
  certifications: [
    "IBM Certification on Cloud Computing",
    "MCSA (In Progress)"
  ],
  extraCurricular: []
};

export const ICONS = {
  Github: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
  ),
  Linkedin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
  ),
  WhatsApp: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3l-1.5 4.5Z"/><path d="M9.4 8.9c.4.2.8.5 1.1.9l.4.5c.3.4.4.8.2 1.2-.2.3-.6.6-1 1l-.2.2c-.3.3-.6.7-.4 1.2.2.4.6.9 1.1 1.4.5.5 1 .9 1.4 1.1.5.2.9-.1 1.2-.4l.2-.2c.4-.4.7-.8 1-.6.4.2.8.3 1.2.2.4-.2.7-.4.9-.8.2-.4.1-.9-.2-1.2l-.5-.4c-.4-.3-.7-.6-.9-1.1"/></svg>
  ),
  Mail: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  ),
  Send: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
  ),
  Bot: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
  ),
  Windows: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="12" x2="21" y2="12"/></svg>
  ),
  VMware: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 2h10l3 3v10l-3 3H7l-3-3V5z"/><path d="M7 8h10"/><path d="M7 12h10"/><path d="M7 16h10"/></svg>
  ),
  HyperV: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M4 12h5"/><path d="M15 12h5"/><path d="M12 4v5"/><path d="M12 15v5"/></svg>
  ),
  Backup: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
  ),
  AI: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/><circle cx="12" cy="14" r="1"/></svg>
  ),
  Hardware: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M2 12h2"/><path d="M20 12h2"/></svg>
  ),
  Network: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1-1v3"/><path d="M12 12V8"/></svg>
  ),
  ExternalLink: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
  )
};
