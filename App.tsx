
import React, { useState, useEffect, Suspense, lazy, useCallback, memo, useRef, createContext, useContext } from 'react';
import { jsPDF } from 'jspdf';
import { USER_DATA, ICONS, AIConfig } from './constants';
import { Skill } from './types';
import { fetchDynamicAIConfig } from './services/configService';
import { NOCCenter } from './components/NOCCenter';

const ComicBackground = lazy(() => import('./components/ComicBackground'));
const ChatWidget = lazy(() => import('./components/ChatWidget'));

// --- CONTEXT: To provide dynamic config and theme to deep components ---
export const ConfigContext = createContext<{ config: AIConfig; isDarkMode: boolean }>({ config: USER_DATA.aiConfig, isDarkMode: false });

// --- PERFORMANCE: Memoized Sub-components ---

const SystemStat = memo(({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="flex flex-col items-start px-4 border-r border-google-border last:border-r-0">
    <span className="text-[9px] font-bold text-google-gray uppercase tracking-tighter">{label}</span>
    <span className={`text-xs font-mono font-bold ${color}`}>{value}</span>
  </div>
));

const MonitorDashboard = memo(({ status }: { status: AIConfig['availabilityStatus'] }) => {
  const [metrics, setMetrics] = useState({ latency: 22, cpu: 14, network: 1.2 });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        latency: Math.floor(Math.random() * (28 - 18 + 1) + 18),
        cpu: Math.floor(Math.random() * (18 - 8 + 1) + 8),
        network: parseFloat((Math.random() * (2.5 - 0.5) + 0.5).toFixed(1))
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const statusColors = { online: 'text-google-green', busy: 'text-google-yellow', away: 'text-google-red' };
  const statusBg = { online: 'bg-google-green', busy: 'bg-google-yellow', away: 'bg-google-red' };

  return (
    <div className="fixed top-[64px] md:top-[72px] left-0 w-full header-glass z-[110] py-1 flex justify-center animate-in slide-in-from-top duration-500">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="lg:flex hidden">
            <SystemStat label="Active Clusters" value="16,402 Nodes" color="text-google-blue" />
            <SystemStat label="Global Uptime" value="99.998%" color="text-google-green" />
            <SystemStat label="Latency" value={`${metrics.latency}ms`} color="text-google-yellow" />
          </div>
          <div className="flex flex-col items-start px-2 md:px-4">
            <span className="text-[8px] md:text-[9px] font-bold text-google-gray uppercase tracking-tighter">System Health</span>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${statusBg[status]} animate-pulse`}></span>
              <span className={`text-[10px] md:text-xs font-mono font-bold uppercase ${statusColors[status]}`}>{status}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`w-1 h-3 rounded-full ${i < 4 ? 'bg-google-green' : 'bg-google-border dark:bg-google-border'} animate-pulse`} style={{ animationDelay: `${i * 0.2}s` }}></div>
            ))}
          </div>
          <span className="text-[8px] md:text-[10px] font-bold text-google-blue uppercase tracking-widest font-mono">NODE_STABLE</span>
        </div>
      </div>
    </div>
  );
});

const BrandLogo = memo(({ className = "" }: { className?: string }) => (
  <div className={`relative ${className} select-none group perspective-1000`}>
    <div className="absolute inset-0 bg-google-blue opacity-0 group-hover:opacity-15 blur-[60px] rounded-full transition-opacity duration-1000"></div>
    <div className="absolute inset-0 rounded-full border border-google-blue/10 animate-[spin_20s_linear_infinite]"></div>
    
    <svg viewBox="0 0 512 512" className="w-full h-full drop-shadow-[0_0_15px_rgba(26,115,232,0.1)] transition-all duration-1000 group-hover:rotate-y-12 group-hover:rotate-x-12 animate-[float_6s_ease-in-out_infinite]" aria-hidden="true">
      <defs>
        <linearGradient id="scan-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor="#1a73e8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <filter id="neon-glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <radialGradient id="core-radial">
          <stop offset="0%" stopColor="#1a73e8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1a73e8" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="256" cy="256" r="248" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-google-border opacity-50" />
      <circle cx="256" cy="256" r="240" fill="none" stroke="#1a73e8" strokeWidth="2" strokeDasharray="10 40" className="animate-[spin_60s_linear_infinite] opacity-30" />
      <circle cx="256" cy="256" r="230" fill="none" stroke="#1a73e8" strokeWidth="1" strokeDasharray="5 200" className="animate-[spin_30s_linear_infinite_reverse] opacity-40" />

      <path d="M256 26 A 230 230 0 0 1 486 256" fill="none" stroke="#4285F4" strokeWidth="14" strokeLinecap="round" className="logo-segment segment-blue transition-all group-hover:stroke-width-16" />
      <path d="M486 256 A 230 230 0 0 1 256 486" fill="none" stroke="#34A853" strokeWidth="14" strokeLinecap="round" className="logo-segment segment-green transition-all group-hover:stroke-width-16" />
      <path d="M256 486 A 230 230 0 0 1 26 256" fill="none" stroke="#FBBC05" strokeWidth="14" strokeLinecap="round" className="logo-segment segment-yellow transition-all group-hover:stroke-width-16" />
      <path d="M26 256 A 230 230 0 0 1 256 26" fill="none" stroke="#EA4335" strokeWidth="14" strokeLinecap="round" className="logo-segment segment-red transition-all group-hover:stroke-width-16" />

      <circle cx="256" cy="256" r="100" fill="url(#core-radial)" className="animate-[pulse_4s_ease-in-out_infinite] opacity-5" />
      
      <g fill="currentColor" className="text-google-gray transition-colors group-hover:text-google-blue">
        <circle cx="256" cy="145" r="26" className="animate-[ping-slow_4s_ease-in-out_infinite] opacity-20" />
        <circle cx="256" cy="145" r="22" filter="url(#neon-glow)" className="animate-[core-flicker_3s_infinite]" />
        <path d="M280 180h-48c-8 0-15 7-15 15v85c0 5 4 10 10 10s10-5 10-10v-60h5v180c0 8 7 15 15 15s15-7 15-15v-110h5v110c0 8 7 15 15 15s15-7 15-15V195c0-8-7-15-15-15z" className="transition-all duration-700 group-hover:translate-y-[-2px]" />
        <circle r="4" cx="380" cy="256" className="animate-[orbit_10s_linear_infinite]" />
        <circle r="3" cx="132" cy="256" className="animate-[orbit_7s_linear_infinite_reverse]" />
      </g>

      <g className="translate-y-4">
        <rect x="106" y="280" width="300" height="75" fill="var(--google-bg)" rx="16" className="shadow-lg" />
        <text x="256" y="332" textAnchor="middle" className="font-black text-[44px] tracking-tighter transition-all group-hover:tracking-normal group-hover:fill-google-blue" fill="var(--text-main)">VISHNUNATH</text>
        <rect x="106" y="280" width="4" height="75" fill="#1a73e8" filter="url(#neon-glow)" className="animate-[scan-move_2s_cubic-bezier(0.4,0,0.2,1)_infinite]" />
        <rect x="106" y="280" width="300" height="75" fill="url(#scan-grad)" fillOpacity="0.1" className="pointer-events-none" />
      </g>
    </svg>
    <style>{`
      @keyframes float { 0%, 100% { transform: translateY(0px) rotateX(0deg); } 50% { transform: translateY(-25px) rotateX(5deg); } }
      @keyframes scan-move { 0% { transform: translateX(0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateX(296px); opacity: 0; } }
      @keyframes ping-slow { 0% { transform: scale(1); opacity: 0.4; } 50% { transform: scale(1.8); opacity: 0; } 100% { transform: scale(1); opacity: 0; } }
      @keyframes orbit { from { transform: rotate(0deg) translateX(40px) rotate(0deg); } to { transform: rotate(360deg) translateX(40px) rotate(-360deg); } }
      @keyframes core-flicker { 0%, 100% { opacity: 1; } 45% { opacity: 0.8; } 50% { opacity: 0.9; } 55% { opacity: 0.7; } }
      .logo-segment { stroke-dasharray: 400; stroke-dashoffset: 400; animation: draw-segment 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
      @keyframes draw-segment { to { stroke-dashoffset: 0; } }
      .perspective-1000 { perspective: 1000px; }
      .rotate-y-12 { transform: rotateY(12deg); }
      .rotate-x-12 { transform: rotateX(12deg); }
    `}</style>
  </div>
));

const TerminalPalette = memo(({ isOpen, onClose, onCommand }: { isOpen: boolean; onClose: () => void; onCommand: (cmd: string) => void }) => {
  const [input, setInput] = useState('');
  const [stdout, setStdout] = useState<string[]>([
    "Systems Core Security Shell [v2.4.8-active]",
    "Type '/help' to inspect infrastructure command controls.",
    "Ready for telemetry query coordination..."
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      // Auto-scroll on mount if open
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [stdout]);

  if (!isOpen) return null;

  const runCommandLocal = (fullCmd: string) => {
    const raw = fullCmd.trim();
    if (!raw) return;

    setStdout(prev => [...prev, `vishnu@core:~$ ${raw}`]);
    const cmd = raw.toLowerCase().replace('/', '');

    if (cmd === 'clear') {
      setStdout([]);
      setInput('');
      return;
    }

    if (cmd === 'exit' || cmd === 'quit') {
      onClose();
      setInput('');
      return;
    }

    if (cmd === 'help' || cmd === 'h' || cmd === '?') {
      setStdout(prev => [
        ...prev,
        "Available terminal commands:",
        "  /about, /noc, /expertise, /experience, /contact  --> Scroll to dossier segments",
        "  /ping                                            --> Diagnose server sector latencies",
        "  /nodes                                           --> Query virtual resource clusters status",
        "  /uptime                                          --> Fetch high-availability duration",
        "  /resume                                          --> Compile official resume dossier document",
        "  /exit, /clear                                    --> Exit or purge logs buffer"
      ]);
      setInput('');
      return;
    }

    if (cmd === 'ping') {
      setStdout(prev => [
        ...prev,
        "Ping virtual DB cluster nodes segment [10.142.128.0/24]...",
        "  64 bytes from 10.142.128.14: icmp_seq=1 ttl=128 time=1.8ms",
        "  64 bytes from 10.142.128.23: icmp_seq=2 ttl=128 time=2.1ms",
        "--- DB segment ping statistics ---",
        "  2 packets transmitted, 2 received, 0% packet loss, latency=1.95ms"
      ]);
      setInput('');
      return;
    }

    if (cmd === 'nodes') {
      setStdout(prev => [
        ...prev,
        "Total Environment size: 16,402 hosts active",
        "Hypervisor Layers: VMware ESXi vSphere / Microsoft Hyper-V",
        "Immutable backup snapshot storage pool: OK (Rubrik Orchestrated)",
        "ServiceNow ITIL Ticket Pipeline: OPERATIONAL [0 Critical P1 Pending]"
      ]);
      setInput('');
      return;
    }

    if (cmd === 'uptime') {
      setStdout(prev => [
        ...prev,
        "Systems Active Uptime: 432 days, 14 hours, 23 minutes, 11 seconds",
        "Global High Availability Guarantee: 99.998% compliant",
        "NOC Core Core service status: OPERATIONAL / OPTIMAL"
      ]);
      setInput('');
      return;
    }

    // If it's a section navigation command
    if (['about', 'noc', 'noc-center', 'expertise', 'experience', 'contact', 'resume'].includes(cmd)) {
      onCommand(raw);
      setStdout(prev => [
        ...prev,
        `Redirecting viewport focus to section [${cmd.toUpperCase()}] successfully.`
      ]);
      setInput('');
      if (cmd !== 'resume') {
        // Close on successful section navigation to let the visitor see the scroll
        setTimeout(onClose, 300);
      }
      return;
    }

    // Default error response
    setStdout(prev => [
      ...prev,
      `Command: '${raw}' not recognized. Type '/help' for options.`
    ]);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 md:pt-32 px-4 md:px-6" onClick={onClose}>
      <div className="w-full max-w-2xl bg-[#18181b] rounded-2xl shadow-3xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        
        {/* Terminal Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#121214]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-google-red"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-google-yellow"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-google-green"></div>
            <span className="ml-2 text-[8px] md:text-[10px] font-mono text-white/40 uppercase tracking-widest">NOC Core Shell Systems</span>
          </div>
          <span className="text-[8px] md:text-[10px] font-mono text-white/20">ESC to exit</span>
        </div>

        {/* Stdout Log Area */}
        <div className="p-4 md:p-6 h-[260px] overflow-y-auto font-mono text-[10px] md:text-xs text-[#4af626] space-y-2 select-text selection:bg-[#4af626]/20 bg-[#0c0c0e]">
          {stdout.map((line, i) => (
            <p key={i} className="leading-relaxed whitespace-pre-wrap">{line}</p>
          ))}
          <div ref={terminalEndRef}></div>
        </div>

        {/* Dynamic Command Input bar */}
        <div className="p-4 bg-[#121214] border-t border-white/10">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-[#4af626] font-mono text-xs md:text-sm">vishnu@core:~$</span>
            <input 
              ref={inputRef}
              className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs md:text-sm placeholder:text-white/20"
              placeholder="Enter instruction (/help for suggestions...)"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  runCommandLocal(input);
                }
                if (e.key === 'Escape') onClose();
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
});

// --- MAIN APP ---

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [dynamicConfig, setDynamicConfig] = useState<AIConfig>(USER_DATA.aiConfig);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'VIRTUALIZATION' | 'CORE INFRASTRUCTURE' | 'MONITORING & CLOUD'>('ALL');

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };

  useEffect(() => {
    const updateConfig = async () => {
      try {
        const patch = await fetchDynamicAIConfig();
        setDynamicConfig(prev => ({ ...prev, ...patch }));
      } catch (err) {
        console.error("Config fetch failed", err);
      }
    };
    updateConfig();
    const interval = setInterval(updateConfig, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsTerminalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCommand = (cmd: string) => {
    const c = cmd.toLowerCase().replace('/', '');
    const mapped = c === 'noc' ? 'noc-center' : c;
    if (['about', 'noc-center', 'expertise', 'experience', 'contact'].includes(mapped)) {
      document.getElementById(mapped)?.scrollIntoView({ behavior: 'smooth' });
    } else if (c === 'resume') {
      generateResumePDF();
    }
  };

  const generateResumePDF = useCallback(() => {
    // Initialize standard A4 PDF (Portrait, Millimeters, A4)
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Core parameters for layout
    const margin = 20;
    const pageWidth = 210;
    const printableWidth = pageWidth - (margin * 2); // 170mm
    let y = 15;

    // Helper to draw clean section header with an elegant bottom rule
    const drawSectionHeader = (title: string) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(26, 115, 232); // Google Blue
      doc.text(title.toUpperCase(), margin, y);
      
      doc.setDrawColor(218, 220, 224); // light gray border
      doc.setLineWidth(0.4);
      doc.line(margin, y + 2, margin + printableWidth, y + 2);
      y += 8;
    };

    // Helper for beautiful standard multiline body text
    const drawParagraph = (text: string, fontSize = 9, spacing = 4.5) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(fontSize);
      doc.setTextColor(32, 33, 36); // Charcoal Black
      const lines = doc.splitTextToSize(text, printableWidth);
      
      if (y + (lines.length * spacing) > 275) {
        doc.addPage();
        y = 20;
      }
      
      lines.forEach((line: string) => {
        doc.text(line, margin, y);
        y += spacing;
      });
    };

    // Helper to render customized indented bullet points
    const drawBullet = (text: string, indent = 6, fontSize = 8.5, spacing = 4) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(fontSize);
      doc.setTextColor(32, 33, 36);
      
      const bulletChar = "•";
      const wrapWidth = printableWidth - indent;
      const lines = doc.splitTextToSize(text, wrapWidth);
      
      if (y + (lines.length * spacing) > 275) {
        doc.addPage();
        y = 20;
      }

      // Render bullet icon slightly offset
      doc.text(bulletChar, margin + 1.5, y);

      // Render lines nicely wrapped
      lines.forEach((line: string) => {
        doc.text(line, margin + indent, y);
        y += spacing;
      });
    };

    // --- PAGE 1 HEADER BAR ---
    doc.setFillColor(26, 115, 232); // Deep Google Blue Accent Accent
    doc.rect(margin, y, printableWidth, 3.5, 'F');
    y += 11;

    // Name & Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(23);
    doc.setTextColor(32, 33, 36);
    doc.text("VISHNUNATH M", margin, y);
    y += 6.5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(26, 115, 232);
    doc.text("Wintel and VMware Administrator / IT Infrastructure Specialist", margin, y);
    y += 7.5;

    // Contact Grid with balanced gray labels
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(95, 99, 104); // google gray
    doc.text("Location: Madurai, Tamil Nadu, India", margin, y);
    doc.text("Email: vishnunath.m95@gmail.com", margin + 65, y);
    doc.text("Phone: +91 9944012688", margin + 124, y);
    y += 4.5;
    
    doc.text("LinkedIn: linkedin.com/in/vishnunath-m", margin, y);
    doc.text("Portfolio: https://knowaboutvishnu.vercel.app/", margin + 65, y);
    y += 10;

    // --- PROFESSIONAL SUMMARY ---
    drawSectionHeader("Professional Summary");
    const summaryText = "Wintel and VMware Administrator with 8+ years of experience in Windows Server administration, VMware vSphere, and enterprise infrastructure support. Expertise in incident management (ITIL), SLA management, root cause analysis, and system monitoring. Proven ability to maintain high availability systems and resolve complex issues in large-scale environments.";
    drawParagraph(summaryText, 9.5, 4.8);
    y += 5.5;

    // --- TECHNICAL SKILLS ---
    drawSectionHeader("Technical Skills");
    const skills = [
      "VMware vSphere, ESXi, vCenter, vMotion, DRS, HA clustering technologies",
      "Windows Server Administration (Legacy 2003 through Modern 2022 configurations)",
      "Active Directory Administration, Group Policy (GPO) curation, and role-based access management",
      "Incident Management (ITIL alignment), rigorous SLA enforcement, and OLA governance",
      "System Monitoring: SolarWinds (iObserve), Moogsoft alert pipelines, CA Spectrum",
      "Enterprise Scale Virtualization: VMware vSphere, Microsoft Hyper-V, Nutanix hyperconverged stacks",
      "Durable Backup & Recovery: Rubrik immutable architecture orchestration",
      "PowerShell scripting, repetitive CLI automation, and performance health checking",
      "Server resource fine-tuning, load diagnostics, and root cause analysis (RCA)",
      "SNMP, WMI, and syslog protocols tracking system metrics and trap signals",
      "Enterprise Patch Management, OS build upgrades, compliance reporting, and audits",
      "DNS, DHCP, subnet planning, IP address management (IPAM), and local routing paths"
    ];
    skills.forEach(skill => {
      drawBullet(skill, 6, 8.5, 4.2);
    });
    y += 5.5;

    // --- KEY TECHNOLOGIES ---
    drawSectionHeader("Key Technologies & Vertical Capabilities");
    const keyTechs = [
      "Core OS Support: Windows Server Administration, Server Maintenance, Patch Compliance",
      "Virtualization & Hypervisors: VMware vCenter, VMware ESXi hosts, vMotion hot-migrations, DRS clustering, high-availability setups",
      "Domain Orchestration: Active Directory Administration, User access auditing, Group Policy objects",
      "Incident Response: Incident Management (ITIL protocols), strict SLA Compliance, Root Cause Analysis (RCA)",
      "Telemetry & Monitoring: CA Spectrum, SolarWinds, SNMP traps, WMI diagnostics",
      "Security & Continuity: Rubrik backups, system disaster recovery, physical hardware lifecycle diagnostics"
    ];
    keyTechs.forEach(tech => {
      drawBullet(tech, 6, 8.5, 4.2);
    });
    y += 6.5;

    // --- PROFESSIONAL EXPERIENCE ---
    drawSectionHeader("Professional Experience");

    // Company 1: HCLTech
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(32, 33, 36);
    doc.text("VMware Administrator", margin, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(95, 99, 104);
    doc.text("HCLTech – Tenet Healthcare Project", margin + 45, y);
    doc.text("Sep 2022 – Present", margin + 120, y);
    y += 5;

    const exp1Bullets = [
      "Managing 16,000+ servers in diverse VMware and Hyper-V host environments, overseeing cluster balance and hardware resource consumption limits.",
      "Delivering Windows Server Administration alongside day-to-day VMware vCenter host clusters configurations, troubleshooting kernel resource leaks.",
      "Triage and resolve complex P1/P2/P3 user environment incidents with ServiceNow, securing 100% SLA commitment response targets.",
      "Reduced system outage and node crash ticket resolution cycle duration by approximately 25% through proactive root cause playbook standardizations.",
      "Conducted multiple safe hot live migration tasks (vMotion) and diagnostic checks across active enterprise database host servers with zero user downtime.",
      "Orchestrated monitoring alert parameters with Moogsoft and Spectrum to detect real physical fan failures, drive faults, and hypervisor resource exhaustions.",
      "Prepared thorough Root Cause Analysis (RCA) portfolios for major core service disruptions, suggesting permanent firmware and driver patches to vendor endpoints.",
      "Supervised enterprise recovery operations and secure air-gapped snapshots using modern, immutable Rubrik backup pools."
    ];
    exp1Bullets.forEach(bullet => {
      drawBullet(bullet, 6, 8.5, 4.2);
    });
    y += 3.5;

    // Force elegant page break before the second experience so it stays together perfectly
    doc.addPage();
    y = 20;

    // Decorative blue accent top-header on page 2 to maintain editorial symmetry
    doc.setFillColor(26, 115, 232);
    doc.rect(margin, y, printableWidth, 1.5, 'F');
    y += 8;

    // Company 2: TVS Mobility
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(32, 33, 36);
    doc.text("System Administrator", margin, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(95, 99, 104);
    doc.text("TVS Mobility", margin + 42, y);
    doc.text("Sep 2016 – Sep 2022", margin + 120, y);
    y += 5;

    const exp2Bullets = [
      "Administered multi-site Windows Server structures and active directory forests, provisioning user identities, local directory constraints, and security groups.",
      "Managed Group Policies and role-based folder and registry permissions to prevent security credential hazards and unprivileged access.",
      "Configured and maintained local branch network configurations including switches, routers, firewalls, LAN routing, and core structural connections.",
      "Spearheaded scheduled WSUS patch management pipelines and server health diagnostic monitoring sweeps across 200+ local machines, decreasing vulnerabilities.",
      "Addressed critical physical branch server hardware alerts, executing RAID card transplants, disk swap workflows, and resolving remote Office 365 issues."
    ];
    exp2Bullets.forEach(bullet => {
      drawBullet(bullet, 6, 8.5, 4.2);
    });
    y += 5.5;

    // --- ACHIEVEMENTS ---
    drawSectionHeader("Key Professional Achievements");
    const achievements = [
      "Maintained 100% SLA compliance for critical P1/P2/P3 user incidents within the healthcare support project.",
      "Reduced overall cluster incident resolution lifecycle durations by ~25% through localized script automation.",
      "Supported massive worldwide environment hosting over 16,000 servers under demanding project performance parameters.",
      "Restored monitoring platform trust by rebuilding SNMP queries and suppressing high volumes of redundant alert triggers."
    ];
    achievements.forEach(ach => {
      drawBullet(ach, 6, 8.5, 4.2);
    });
    y += 5.5;

    // --- SELECTED PROJECTS ---
    drawSectionHeader("Highlighted Projects");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(32, 33, 36);
    doc.text("VMware VM Migration & Incident Resolution", margin, y);
    y += 4;
    drawParagraph("Safely migrated active database workloads and server instances in real-time across data center segments. Resolved deep physical-to-virtual connectivity conflicts during off-peak windows, ensuring absolute uptime with zero business disruptions.", 8.5, 4.0);
    y += 4.5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(32, 33, 36);
    doc.text("Telemetry Alert Storm Suppression & Tuning", margin, y);
    y += 4;
    drawParagraph("Conducted statistical analyses of recurring false triggers across Spectrum and SolarWinds configurations. Rewrote localized polling parameters to discard transient spikes, enhancing network team response focus by 40%.", 8.5, 4.0);
    y += 5.5;

    // --- EDUCATION ---
    drawSectionHeader("Education & Qualifications");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(32, 33, 36);
    doc.text("Bachelor of Engineering (B.E.) in Computer Science & Engineering", margin, y);
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(95, 99, 104);
    doc.text("Kamaraj College of Engineering and Technology, Anna University | 2016", margin, y);
    y += 5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(32, 33, 36);
    doc.text("Diploma in Computer Science & Engineering", margin, y);
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(95, 99, 104);
    doc.text("GMS.MAVMM Polytechnic College | 2013", margin, y);
    y += 6.5;

    // --- CERTIFICATIONS ---
    drawSectionHeader("Certifications & Continued Learning");
    const certs = [
      "IBM Certified – Cloud Computing Foundations",
      "Professional Training: VMware Workloads, Cloud Deployments & Virtual Server Infrastructure Support (Percipio)"
    ];
    certs.forEach(cert => {
      drawBullet(cert, 6, 8.5, 4.2);
    });

    // Save of compiled portfolio PDF
    doc.save("VISHNUNATH_M_Resume.pdf");
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find(e => e.isIntersecting);
      if (visible) setActiveSection(visible.target.id);
    }, { threshold: 0.3 });
    ['home', 'about', 'noc-center', 'expertise', 'experience', 'contact'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const getSkillIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('windows')) return <ICONS.Windows />;
    if (n.includes('vmware')) return <ICONS.VMware />;
    if (n.includes('network')) return <ICONS.Network />;
    if (n.includes('ai')) return <ICONS.AI />;
    if (n.includes('backup')) return <ICONS.Backup />;
    if (n.includes('hardware')) return <ICONS.Hardware />;
    return <ICONS.Bot />;
  };

  return (
    <ConfigContext.Provider value={{ config: dynamicConfig, isDarkMode }}>
      <div className="min-h-screen relative selection:bg-google-blue/30 overflow-x-hidden bg-google-bg text-inherit transition-colors duration-500">
        <Suspense fallback={null}><ComicBackground /></Suspense>
        <MonitorDashboard status={dynamicConfig.availabilityStatus} />
        
        <nav className="fixed top-0 w-full z-[120] header-glass py-2 md:py-3" aria-label="Main Navigation">
          <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
            <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="flex items-center gap-2 md:gap-4 group">
              <BrandLogo className="w-8 h-8 md:w-10 md:h-10" />
              <div className="flex flex-col text-left">
                <span className="font-bold text-inherit text-sm md:text-base leading-none">Vishnunath</span>
                <span className="text-[7px] md:text-[9px] font-bold text-google-gray uppercase tracking-wider mt-0.5">Systems Core</span>
              </div>
            </button>
            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden lg:flex items-center gap-1">
                {['about', 'noc-center', 'expertise', 'experience'].map((id) => (
                  <button 
                    key={id} 
                    onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })} 
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${activeSection === id ? 'text-google-blue bg-google-blue/10' : 'text-google-gray hover:bg-google-surface'}`}
                  >
                    {id === 'noc-center' ? 'NOC CORES' : id.toUpperCase()}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={toggleDarkMode}
                className="p-1.5 md:p-2 hover:bg-google-surface rounded-full transition-colors text-google-gray"
                title={isDarkMode ? "NOC Mode Active" : "Enable NOC Mode"}
              >
                {isDarkMode ? <ICONS.Sun /> : <ICONS.NocMode />}
              </button>

              <button 
                onClick={() => setIsTerminalOpen(true)}
                className="p-1.5 md:p-2 hover:bg-google-surface rounded-full transition-colors hidden sm:flex text-google-gray"
                title="Open Terminal (⌘+K)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
              </button>
              <button onClick={generateResumePDF} className="px-3 md:px-5 py-1.5 md:py-2 border border-google-green text-google-green dark:text-google-green hover:bg-google-green/10 transition-colors text-[8px] md:text-[10px] font-bold tracking-widest rounded-full uppercase mr-1">RESUME</button>
              <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="px-3 md:px-5 py-1.5 md:py-2 btn-google btn-google-primary text-[8px] md:text-[10px] font-black tracking-widest shadow-md">HIRE ME</button>
            </div>
          </div>
        </nav>

        <main className="pt-24 md:pt-32 pb-16 md:pb-20 relative z-10">
          <section id="home" className="container mx-auto px-6 py-12 md:py-20 lg:py-40 flex flex-col items-center text-center">
            <div className="mb-8 md:mb-16 animate-in zoom-in duration-700">
              <BrandLogo className="w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72" />
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-8 tracking-tighter max-w-5xl leading-[1.1]">The Architect of Enterprise Persistence.</h1>
            <p className="text-base md:text-xl lg:text-2xl text-google-gray mb-10 max-w-3xl leading-relaxed font-medium">
              Mastering the orchestration of <span className="text-google-blue font-bold underline decoration-wavy decoration-google-blue/30">16,000 global server nodes</span>. Providing bulletproof stability.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="px-6 md:px-10 py-3 md:py-4 btn-google btn-google-primary text-xs md:text-sm font-bold shadow-xl hover:scale-105 transition-transform tracking-widest">VIEW DOSSIER</button>
              <button onClick={generateResumePDF} className="px-6 md:px-10 py-3 md:py-4 btn-google bg-[#34a853] hover:bg-[#2d8d46] text-white text-xs md:text-sm font-bold shadow-xl hover:scale-105 transition-all tracking-widest flex items-center justify-center gap-2">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>
                </svg>
                DOWNLOAD RESUME
              </button>
              <button onClick={() => setIsTerminalOpen(true)} className="px-6 md:px-10 py-3 md:py-4 btn-google border-2 border-google-border text-google-blue dark:text-google-blue bg-google-bg text-xs md:text-sm font-bold hover:border-google-blue hover:scale-105 transition-transform tracking-widest uppercase">Shell</button>
            </div>
          </section>

          <section id="about" className="bg-google-surface/50 py-16 md:py-32 px-4 md:px-6 border-y border-google-border relative overflow-hidden">
            <div className="container mx-auto max-w-5xl relative z-10">
              <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 bg-google-blue/10 rounded-full text-google-blue text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-4 md:mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-google-blue animate-ping"></span> Integrity Check: Passed
                  </div>
                  <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 tracking-tight leading-tight">Uptime isn't just a metric. <br className="hidden md:block"/>It's a professional oath.</h2>
                  <p className="text-base md:text-lg text-google-gray leading-relaxed mb-6 md:mb-8">{USER_DATA.bio}</p>
                  
                  <div className="grid grid-cols-2 gap-4 md:gap-8 mt-8 md:mt-12">
                    <div className="p-4 md:p-6 bg-google-bg rounded-2xl shadow-sm border border-google-border">
                      <p className="text-[8px] md:text-[10px] font-black text-google-blue uppercase tracking-widest mb-1">Scale Managed</p>
                      <p className="text-2xl md:text-3xl font-black">16K+</p>
                      <p className="text-[10px] md:text-xs text-google-gray mt-1 font-medium italic">Nodes Sync</p>
                    </div>
                    <div className="p-4 md:p-6 bg-google-bg rounded-2xl shadow-sm border border-google-border">
                      <p className="text-[8px] md:text-[10px] font-black text-google-green uppercase tracking-widest mb-1">Incident Rate</p>
                      <p className="text-2xl md:text-3xl font-black">94%</p>
                      <p className="text-[10px] md:text-xs text-google-gray mt-1 font-medium italic">SLA Compliance</p>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-google-blue/20 to-transparent blur-[100px] rounded-full"></div>
                  <div className="relative bg-google-bg p-6 md:p-10 rounded-[24px] md:rounded-[32px] border border-google-border shadow-2xl">
                    <div className="flex items-center justify-between mb-6 md:mb-8 pb-4 md:pb-8 border-b border-google-border">
                      <h3 className="font-bold uppercase tracking-widest text-[10px] md:text-xs">Infrastructure Meta</h3>
                      <div className="text-google-blue"><ICONS.Bot /></div>
                    </div>
                    <ul className="space-y-4 md:space-y-6">
                      {[
                        { label: "Localization", val: USER_DATA.location },
                        { label: "Official Profile", val: <a href={USER_DATA.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-google-blue font-bold flex items-center gap-1 hover:underline text-sm md:text-base"><ICONS.Linkedin /> Dossier</a> },
                        { label: "Languages", val: USER_DATA.languages.join(" & ") },
                        { label: "Hobbies", val: USER_DATA.hobbies[0] + " & " + USER_DATA.hobbies[1] }
                      ].map(item => (
                        <li key={item.label}>
                          <p className="text-[8px] md:text-[10px] text-google-gray font-bold uppercase tracking-widest mb-1">{item.label}</p>
                          <div className="text-sm md:text-base font-semibold">{item.val}</div>
                        </li>
                      ))}
                    </ul>
                    <button onClick={generateResumePDF} className="w-full mt-8 md:mt-10 py-3 md:py-4 bg-google-surface border border-google-border rounded-xl font-bold text-[10px] md:text-xs text-google-gray hover:bg-google-blue hover:text-white hover:border-google-blue transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>
                      Download Official Resume (PDF)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="noc-center" className="bg-google-bg/20 border-b border-google-border">
            <NOCCenter />
          </section>

          <section id="expertise" className="py-16 md:py-32 px-4 md:px-6">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-10 md:mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Technical Spectrum</h2>
                <p className="text-sm md:text-base text-google-gray max-w-2xl mx-auto font-medium">Deep-layer expertise in legacy and next-gen infrastructure management.</p>
              </div>

              {/* Dynamic Skill Filters pills */}
              <div className="flex flex-wrap justify-center gap-2 mb-10 md:mb-16">
                {(['ALL', 'VIRTUALIZATION', 'CORE INFRASTRUCTURE', 'MONITORING & CLOUD'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 md:px-6 py-2 rounded-full text-xs font-bold transition-all border ${
                      selectedCategory === cat 
                        ? 'bg-google-blue text-white border-google-blue shadow-lg scale-105' 
                        : 'bg-google-surface text-google-gray border-google-border hover:border-google-blue/50 hover:text-inherit'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {USER_DATA.skills.filter(skill => {
                  if (selectedCategory === 'ALL') return true;
                  const name = skill.name.toLowerCase();
                  if (selectedCategory === 'VIRTUALIZATION') {
                    return name.includes('vmware') || name.includes('hyper-v');
                  }
                  if (selectedCategory === 'CORE INFRASTRUCTURE') {
                    return name.includes('windows') || name.includes('networking') || name.includes('hardware');
                  }
                  if (selectedCategory === 'MONITORING & CLOUD') {
                    return name.includes('monitoring') || name.includes('servicenow') || name.includes('backup') || name.includes('ai');
                  }
                  return true;
                }).map((skill) => (
                  <button 
                    key={skill.name} 
                    onClick={() => setSelectedSkill(skill)}
                    className="google-card p-6 md:p-8 group text-left relative overflow-hidden flex flex-col h-full"
                  >
                    <div className="absolute top-0 right-0 p-3 md:p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                      <div className="w-1.5 h-1.5 rounded-full bg-google-blue animate-ping"></div>
                    </div>
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-google-surface rounded-xl md:rounded-2xl flex items-center justify-center text-google-gray group-hover:text-google-blue group-hover:bg-google-blue/10 transition-all">
                        {getSkillIcon(skill.name)}
                      </div>
                      <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest bg-google-blue/10 text-google-blue px-2 py-1 rounded-full">
                        {skill.category}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">{skill.name}</h3>
                    <div className="flex-1">
                      <div className="h-1 bg-google-border rounded-full overflow-hidden mb-3 md:mb-4">
                        <div className="h-full bg-google-blue transition-all duration-1000 group-hover:shadow-[0_0_10px_#1a73e8]" style={{ width: `${skill.level}%` }}></div>
                      </div>
                    </div>
                    <span className="text-[9px] md:text-[10px] font-bold text-google-blue uppercase tracking-widest mt-auto">Details →</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section id="experience" className="py-16 md:py-32 px-4 md:px-6 bg-google-surface/30 border-y border-google-border">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-16 md:mb-24 text-center tracking-tight">System Deployments</h2>
              <div className="space-y-12 md:space-y-24 relative">
                {/* Mobile Timeline Vertical Line */}
                <div className="absolute left-4 top-0 h-full w-[1px] bg-google-border md:hidden"></div>
                
                {USER_DATA.experience.map((exp, i) => (
                  <div key={i} className="relative group pl-8 md:pl-0">
                    <div className="absolute -left-12 top-0 h-full w-[2px] bg-google-border hidden md:block group-hover:bg-google-blue/30 transition-colors"></div>
                    <div className="absolute -left-[54px] top-2 w-6 h-6 rounded-full border-4 border-google-bg bg-google-border group-hover:bg-google-blue hidden md:block transition-all shadow-sm"></div>
                    
                    {/* Mobile Dot */}
                    <div className="absolute left-[13px] top-4 w-2 h-2 rounded-full bg-google-border md:hidden"></div>
                    
                    <div className="google-card p-6 md:p-12 hover:border-google-blue transition-all">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-3 md:gap-4">
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold">{exp.role}</h3>
                          <p className="text-google-blue font-bold text-base md:text-lg">{exp.company}</p>
                        </div>
                        <span className="px-3 md:px-4 py-1 bg-google-surface border border-google-border rounded-full text-[8px] md:text-[10px] font-bold text-google-gray uppercase tracking-widest w-fit">{exp.period}</span>
                      </div>
                      <p className="text-sm md:text-lg text-google-gray leading-relaxed">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="contact" className="py-20 md:py-40 px-4 md:px-6 text-center">
            <div className="container mx-auto max-w-4xl">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-google-blue/10 rounded-full flex items-center justify-center text-google-blue mx-auto mb-8 md:mb-10 animate-bounce">
                <ICONS.Mail />
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 tracking-tighter leading-tight">Secure your network's future.</h2>
              <p className="text-lg md:text-xl text-google-gray mb-10 md:mb-16 font-medium">Open bridge for consulting, infrastructure design, or enterprise support.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <a href={`mailto:${USER_DATA.email}`} className="px-8 md:px-10 py-4 md:py-5 bg-google-blue text-white rounded-full font-bold text-xs md:text-sm tracking-widest hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3">
                  <ICONS.Mail /> EMAIL
                </a>
                <a href={USER_DATA.whatsappUrl} target="_blank" rel="noopener noreferrer" className="px-8 md:px-10 py-4 md:py-5 bg-google-green text-white rounded-full font-bold text-xs md:text-sm tracking-widest hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3">
                  <ICONS.WhatsApp /> WHATSAPP
                </a>
                <a href={USER_DATA.linkedinUrl} target="_blank" rel="noopener noreferrer" className="px-8 md:px-10 py-4 md:py-5 bg-[#0077b5] text-white rounded-full font-bold text-xs md:text-sm tracking-widest hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3">
                  <ICONS.Linkedin /> LINKEDIN
                </a>
                <a href={USER_DATA.instagramUrl} target="_blank" rel="noopener noreferrer" className="px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white rounded-full font-bold text-xs md:text-sm tracking-widest hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3">
                  <ICONS.Instagram /> INSTAGRAM
                </a>
              </div>
            </div>
          </section>
        </main>

        <footer className="py-16 md:py-24 bg-google-surface border-t border-google-border text-center px-4 md:px-6 relative z-10">
          <div className="container mx-auto">
            <div className="flex justify-center gap-6 mb-8 text-google-gray">
              <a href={USER_DATA.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-google-blue transition-colors"><ICONS.Linkedin /></a>
              <a href={USER_DATA.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-google-red transition-colors"><ICONS.Instagram /></a>
              <a href={`mailto:${USER_DATA.email}`} className="hover:text-google-blue transition-colors"><ICONS.Mail /></a>
            </div>
            <div className="w-full max-w-md mx-auto mb-10 md:mb-12 p-4 md:p-6 bg-[#202124] rounded-2xl text-left font-mono text-[8px] md:text-[10px] text-white/40 shadow-xl border border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-3 md:p-4 text-google-green animate-pulse uppercase font-black text-[7px] md:text-[9px]">NOC_ONLINE</div>
               <div className="animate-[scroll-logs_15s_linear_infinite] leading-relaxed">
                 <p>&gt; Initializing portfolio core...</p>
                 <p>&gt; Checking node 16402 health: OPTIMAL</p>
                 <p>&gt; Snapshot: [IMMUTABLE] generated</p>
                 <p>&gt; VMware Cluster status: STABLE</p>
                 <p>&gt; ServiceNow API: CONNECTED</p>
                 <p>&gt; Uplinks: ACTIVE</p>
                 <p>&gt; Monitoring active: SPECTRUM</p>
                 <p>&gt; Deploying Vishnunath v2.1.2...</p>
               </div>
            </div>
            <p className="text-[9px] md:text-[11px] text-google-gray uppercase tracking-[0.2em] md:tracking-[0.4em] font-black">© {new Date().getFullYear()} M. Vishnunath • Protocol v1.5</p>
          </div>
        </footer>

        {/* MODAL */}
        {selectedSkill && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 backdrop-blur-xl bg-black/40" onClick={() => setSelectedSkill(null)}>
            <div className="w-full max-w-2xl bg-google-bg rounded-[32px] md:rounded-[40px] shadow-3xl overflow-hidden relative border border-google-border p-8 md:p-16 animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedSkill(null)} className="absolute top-6 right-6 md:top-10 md:right-10 w-10 h-10 md:w-12 md:h-12 hover:bg-google-surface rounded-full flex items-center justify-center transition-colors text-xl md:text-2xl font-light text-google-gray">✕</button>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-google-surface rounded-full border border-google-border text-[8px] md:text-[9px] font-black text-google-gray uppercase tracking-widest mb-6 md:mb-8">Deep-Dive</div>
              <h3 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 tracking-tight">{selectedSkill.name}</h3>
              <div className="p-6 md:p-8 bg-google-surface rounded-[20px] md:rounded-[24px] border border-google-border mb-8 md:mb-10">
                 <p className="text-base md:text-lg leading-relaxed font-serif italic text-inherit opacity-90">"{selectedSkill.description}"</p>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center pt-6 md:pt-8 border-t border-google-border gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-google-blue/10 rounded-full flex items-center justify-center text-google-blue">
                     <ICONS.Bot />
                  </div>
                  <div>
                     <p className="text-[8px] md:text-[10px] font-bold text-google-gray uppercase tracking-widest">Proficiency Index</p>
                     <p className="text-sm font-bold text-google-blue">{selectedSkill.level}% Sync</p>
                  </div>
                </div>
                <button onClick={() => setSelectedSkill(null)} className="w-full sm:w-auto px-8 py-3 bg-[#202124] text-white rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all">Close</button>
              </div>
            </div>
          </div>
        )}

        <Suspense fallback={null}><ChatWidget /></Suspense>
        <TerminalPalette isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} onCommand={handleCommand} />
        <style>{`
          @keyframes scroll-logs { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
          .no-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>
      </div>
    </ConfigContext.Provider>
  );
};

export default App;
