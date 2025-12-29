
import React from 'react';
import { PersonalData, Experience, Skill } from './types';

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
}

export const USER_DATA: ExtendedPersonalData = {
  name: "M. VISHNUNATH",
  title: "IT Infrastructure Specialist (Windows & VM Support)",
  tagline: "Managing mission-critical infrastructure at scale, from legacy systems to hybrid cloud environments.",
  bio: "I am a seasoned System Administrator with over 8 years of professional experience. My journey began with 6 years at TVS Mobility (2016-2022) and currently continues at HCL (since Sep 2022), where I manage a massive environment of approximately 16,000 servers. I specialize in high-stakes incident management (P1-P3), virtualization at scale, and robust backup solutions.",
  email: "vishnunath.m95@gmail.com",
  linkedinUrl: "https://www.linkedin.com/in/vishnunath-m-2b77a9101?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
  phoneNumber: "+91 99440 12688",
  whatsappUrl: "https://wa.me/919944012688?text=Hi%20Vishnu,%20I%20have%20a%20question%20from%20your%20AI%20Agent.",
  skills: [
    { 
      name: "Windows Server (2003-2022)", 
      category: "Backend", 
      level: 95,
      description: "Expertise in the complete Windows Server lifecycle. From maintaining critical legacy 2003/2008 systems to deploying modern 2022 environments. Skilled in Active Directory orchestration, Group Policy management, and OS-level hardening for enterprise security compliance."
    },
    { 
      name: "VMware / vCenter / ESXi", 
      category: "Tools", 
      level: 95,
      description: "Specialized in high-density virtualization. Managing vCenter clusters at massive scale, optimizing ESXi host performance, and ensuring seamless workload migration. Deep knowledge of vMotion, High Availability (HA), and Distributed Resource Scheduler (DRS) in environments with 16k+ nodes."
    },
    { 
      name: "Hyper-V Administration", 
      category: "Tools", 
      level: 90,
      description: "Microsoft's virtualization stack management. Proficient in Failover Clustering, Virtual Machine Manager (VMM), and architecting resilient Hyper-V environments for enterprise workloads."
    },
    { 
      name: "ServiceNow / ITSM", 
      category: "Tools", 
      level: 95,
      description: "Professional incident and change management. Orchestrating P1/P2/P3 incident lifecycles, maintaining rigorous SLAs, and utilizing ITSM workflows to ensure streamlined service delivery across global teams."
    },
    { 
      name: "AI & AI Agents", 
      category: "Tools", 
      level: 85,
      description: "Integrating Generative AI and autonomous LLM agents into infrastructure workflows. Expertise in leveraging the Gemini API for proactive system health diagnostics, automated incident summarization, and building intelligent agents for streamlined IT operations."
    },
    { 
      name: "Monitoring (Moogsoft/Spectrum)", 
      category: "Tools", 
      level: 90,
      description: "Proactive infrastructure observability. Utilizing Moogsoft AIOps for event correlation and CA Spectrum for network/server fault isolation. Turning noise into actionable alerts to maintain 99.9% uptime."
    },
    { 
      name: "Backup (Rubrik)", 
      category: "Tools", 
      level: 85,
      description: "Data resilience and recovery expert. Managing Rubrik's immutable backup snapshots, ensuring rapid point-in-time recovery, and orchestrating enterprise-wide data protection strategies."
    },
    { 
      name: "Hardware Troubleshooting", 
      category: "Backend", 
      level: 95,
      description: "Deep physical infrastructure diagnostics. Expertise in Dell PowerEdge, HP ProLiant, and Lenovo server hardware. Skilled in rack-level troubleshooting, vendor coordination (OEM case logging), and datacenter lifecycle management."
    },
    { 
      name: "Linux Administration", 
      category: "Backend", 
      level: 80,
      description: "Proficient in Linux environment management and troubleshooting as part of heterogeneous data center operations."
    },
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
    },
    {
      degree: "SSLC",
      institution: "M.M Higher Secondary School",
      year: "2010",
      percentage: "56.7%"
    }
  ],
  certifications: [
    "IBM Certification on Cloud Computing",
    "MCSA (Studying)"
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
  ServiceNow: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><polyline points="12 10 16 14 22 8"/></svg>
  ),
  Monitoring: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
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
  Download: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
  ),
  ExternalLink: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 22 3 22 10"/><line x1="10" y1="14" x2="22" y2="2"/></svg>
  )
};
