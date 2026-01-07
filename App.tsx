
import React, { useState, useEffect, Suspense, lazy, useCallback, memo, useMemo, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { USER_DATA, ICONS } from './constants';
import { Skill } from './types';

const ComicBackground = lazy(() => import('./components/ComicBackground'));
const ChatWidget = lazy(() => import('./components/ChatWidget'));

// --- PERFORMANCE: Memoized Sub-components ---

const SystemStat = memo(({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="flex flex-col items-start px-4 border-r border-[#dadce0] dark:border-dark-border last:border-r-0">
    <span className="text-[9px] font-bold text-[#5f6368] dark:text-gray-400 uppercase tracking-tighter">{label}</span>
    <span className={`text-xs font-mono font-bold ${color}`}>{value}</span>
  </div>
));

const MonitorDashboard = memo(() => {
  const [latency, setLatency] = useState(22);
  useEffect(() => {
    const interval = setInterval(() => setLatency(Math.floor(Math.random() * (28 - 18 + 1) + 18)), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:flex fixed top-[72px] left-0 w-full bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-[#dadce0] dark:border-dark-border z-[110] py-1 justify-center animate-in slide-in-from-top duration-500 transition-colors duration-300">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center">
          <SystemStat label="Node Count" value="16,402 Active" color="text-[#1a73e8] dark:text-blue-400" />
          <SystemStat label="Global Uptime" value="99.998%" color="text-[#34a853] dark:text-green-400" />
          <SystemStat label="System Latency" value={`${latency}ms`} color="text-[#fbbc04] dark:text-yellow-400" />
          <SystemStat label="Threat Level" value="Low (Encrypted)" color="text-[#5f6368] dark:text-gray-400" />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`w-1 h-3 rounded-full ${i < 4 ? 'bg-[#34a853] dark:bg-green-500' : 'bg-[#e8eaed] dark:bg-dark-border'} animate-pulse`} style={{ animationDelay: `${i * 0.2}s` }}></div>
            ))}
          </div>
          <span className="text-[10px] font-bold text-[#1a73e8] dark:text-blue-400 uppercase tracking-widest">Core Synchronized</span>
        </div>
      </div>
    </div>
  );
});

const BrandLogo = memo(({ className = "" }: { className?: string }) => (
  <div className={`relative ${className} select-none group perspective-1000`}>
    <div className="absolute inset-0 bg-[#1a73e8] opacity-0 group-hover:opacity-10 blur-[60px] rounded-full transition-opacity duration-700"></div>
    <svg viewBox="0 0 512 512" className="w-full h-full drop-shadow-2xl transition-all duration-700 group-hover:rotate-y-12 group-hover:rotate-x-12 animate-[float_6s_ease-in-out_infinite]" aria-hidden="true">
      <defs>
        <linearGradient id="scan-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor="#1a73e8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <circle cx="256" cy="256" r="245" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 20" className="animate-[spin_40s_linear_infinite] text-gray-200 dark:text-gray-800" />
      <path d="M256 26 A 230 230 0 0 1 486 256" fill="none" stroke="#4285F4" strokeWidth="12" strokeLinecap="round" className="logo-segment segment-blue" />
      <path d="M486 256 A 230 230 0 0 1 256 486" fill="none" stroke="#34A853" strokeWidth="12" strokeLinecap="round" className="logo-segment segment-green" />
      <path d="M256 486 A 230 230 0 0 1 26 256" fill="none" stroke="#FBBC05" strokeWidth="12" strokeLinecap="round" className="logo-segment segment-yellow" />
      <path d="M26 256 A 230 230 0 0 1 256 26" fill="none" stroke="#EA4335" strokeWidth="12" strokeLinecap="round" className="logo-segment segment-red" />
      <path d="M256 180 L140 380 L372 380 Z" fill="#1a73e8" fillOpacity="0.08" className="transition-all duration-500 group-hover:scale-110 group-hover:fillOpacity-20 origin-center" />
      <g fill="currentColor" className="transition-colors group-hover:fill-[#1a73e8] text-[#5f6368] dark:text-gray-400">
        <circle cx="256" cy="145" r="26" className="animate-[ping-slow_4s_ease-in-out_infinite]" />
        <circle cx="256" cy="145" r="22" />
        <path d="M280 180h-48c-8 0-15 7-15 15v85c0 5 4 10 10 10s10-5 10-10v-60h5v180c0 8 7 15 15 15s15-7 15-15v-110h5v110c0 8 7 15 15 15s15-7 15-15V195c0-8-7-15-15-15z" />
      </g>
      <g className="translate-y-4">
        <rect x="106" y="280" width="300" height="75" fill="currentColor" rx="16" className="text-white dark:text-dark-surface" />
        <text x="256" y="332" textAnchor="middle" className="font-black text-[44px] tracking-tighter" fill="currentColor" className="text-[#202124] dark:text-white">VISHNUNATH</text>
        <rect x="106" y="280" width="120" height="75" fill="url(#scan-grad)" className="animate-[scan-move_2.5s_cubic-bezier(0.4,0,0.2,1)_infinite]" />
      </g>
    </svg>
    <style>{`
      @keyframes float { 0%, 100% { transform: translateY(0px) rotateX(0deg); } 50% { transform: translateY(-25px) rotateX(8deg); } }
      @keyframes scan-move { 0% { transform: translateX(-200px); } 100% { transform: translateX(400px); } }
      @keyframes ping-slow { 0% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.4); opacity: 0; } 100% { transform: scale(1); opacity: 0; } }
      .logo-segment { stroke-dasharray: 400; stroke-dashoffset: 400; animation: draw-segment 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
      @keyframes draw-segment { to { stroke-dashoffset: 0; } }
      .perspective-1000 { perspective: 1000px; }
    `}</style>
  </div>
));

const TerminalPalette = memo(({ isOpen, onClose, onCommand }: { isOpen: boolean; onClose: () => void; onCommand: (cmd: string) => void }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-32 px-6" onClick={onClose}>
      <div className="w-full max-w-2xl bg-[#202124] dark:bg-[#0b0e14] rounded-2xl shadow-3xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ea4335]"></div>
            <div className="w-3 h-3 rounded-full bg-[#fbbc04]"></div>
            <div className="w-3 h-3 rounded-full bg-[#34a853]"></div>
            <span className="ml-2 text-[10px] font-mono text-white/40 uppercase tracking-widest">System Query Terminal</span>
          </div>
          <span className="text-[10px] font-mono text-white/20">ESC to exit</span>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3">
            <span className="text-[#34a853] font-mono">$</span>
            <input 
              ref={inputRef}
              className="flex-1 bg-transparent border-none outline-none text-white font-mono text-lg placeholder:text-white/20"
              placeholder="Type /about, /skills, /resume, or /contact..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  onCommand(input);
                  setInput('');
                  onClose();
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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => setIsDarkMode(prev => !prev), []);

  // Keyboard shortcut for Terminal
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
    if (['about', 'expertise', 'experience', 'contact'].includes(c)) {
      document.getElementById(c)?.scrollIntoView({ behavior: 'smooth' });
    } else if (c === 'resume') {
      generateResumePDF();
    }
  };

  const generateResumePDF = useCallback(() => {
    const doc = new jsPDF();
    doc.setFillColor(26, 115, 232);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text(USER_DATA.name, 20, 20);
    doc.setFontSize(10);
    doc.text(USER_DATA.title.toUpperCase(), 20, 28);
    doc.setTextColor(32, 33, 36);
    let y = 60;
    doc.text(`Email: ${USER_DATA.email}`, 20, y);
    doc.text(`Phone: ${USER_DATA.phoneNumber}`, 20, y + 5);
    y += 20;
    doc.setFontSize(14);
    doc.text("Professional Experience", 20, y);
    y += 10;
    USER_DATA.experience.forEach(exp => {
      doc.setFontSize(11);
      doc.text(exp.role, 20, y);
      doc.setFontSize(9);
      doc.text(`${exp.company} | ${exp.period}`, 20, y + 5);
      const lines = doc.splitTextToSize(exp.description, 170);
      doc.text(lines, 20, y + 10);
      y += (lines.length * 5) + 15;
    });
    doc.save(`Resume_Vishnunath.pdf`);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find(e => e.isIntersecting);
      if (visible) setActiveSection(visible.target.id);
    }, { threshold: 0.3 });
    ['home', 'about', 'expertise', 'experience', 'contact'].forEach(id => {
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
    <div className="min-h-screen relative selection:bg-[#1a73e8]/30 overflow-x-hidden transition-colors duration-300 dark:bg-dark-bg dark:text-gray-100">
      <Suspense fallback={null}><ComicBackground /></Suspense>
      <MonitorDashboard />
      
      <nav className="fixed top-0 w-full z-[120] header-glass py-3" aria-label="Main Navigation">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="flex items-center gap-4 group">
            <BrandLogo className="w-10 h-10" />
            <div className="flex flex-col text-left">
              <span className="font-bold text-[#202124] dark:text-white text-base leading-none">Vishnunath</span>
              <span className="text-[9px] font-bold text-[#5f6368] dark:text-gray-400 uppercase tracking-wider mt-0.5">Systems Core</span>
            </div>
          </button>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1">
              {['about', 'expertise', 'experience'].map((id) => (
                <button 
                  key={id} 
                  onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })} 
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeSection === id ? 'text-[#1a73e8] dark:text-blue-400 bg-[#e8f0fe] dark:bg-blue-900/30' : 'text-[#5f6368] dark:text-gray-400 hover:bg-[#f1f3f4] dark:hover:bg-dark-border'}`}
                >
                  {id.toUpperCase()}
                </button>
              ))}
            </div>
            
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-[#f1f3f4] dark:hover:bg-dark-border rounded-full transition-colors text-[#5f6368] dark:text-gray-400"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>

            <button 
              onClick={() => setIsTerminalOpen(true)}
              className="p-2 hover:bg-[#f1f3f4] dark:hover:bg-dark-border rounded-full transition-colors hidden sm:flex text-[#5f6368] dark:text-gray-400"
              title="Open Terminal (⌘+K)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
            </button>
            <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="px-5 py-2 btn-google btn-google-primary text-[10px] font-black tracking-widest shadow-md">HIRE ME</button>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 relative z-10">
        <section id="home" className="container mx-auto px-6 py-20 lg:py-40 flex flex-col items-center text-center">
          <div className="mb-16 animate-in zoom-in duration-700">
            <BrandLogo className="w-56 h-56 md:w-72 md:h-72" />
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-[#202124] dark:text-white mb-8 tracking-tighter max-w-5xl leading-[1.1]">The Architect of Enterprise Persistence.</h1>
          <p className="text-xl lg:text-2xl text-[#5f6368] dark:text-gray-300 mb-12 max-w-3xl leading-relaxed font-medium">
            Mastering the orchestration of <span className="text-[#1a73e8] dark:text-blue-400 font-bold underline decoration-wavy decoration-[#1a73e8]/30 dark:decoration-blue-400/30">16,000 global server nodes</span>. Providing bulletproof stability through system-level precision.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="px-10 py-4 btn-google btn-google-primary text-sm font-bold shadow-xl hover:scale-105 transition-transform tracking-widest">VIEW DOSSIER</button>
            <button onClick={() => setIsTerminalOpen(true)} className="px-10 py-4 btn-google border-2 border-[#dadce0] dark:border-dark-border text-[#1a73e8] dark:text-blue-400 bg-white dark:bg-dark-surface hover:bg-[#f8f9fa] dark:hover:bg-dark-border text-sm font-bold hover:border-black dark:hover:border-blue-400 hover:scale-105 transition-transform tracking-widest uppercase">Query System</button>
          </div>
        </section>

        <section id="about" className="bg-[#f8f9fa]/60 dark:bg-dark-surface/60 backdrop-blur-lg py-32 px-6 border-y border-[#dadce0] dark:border-dark-border relative overflow-hidden transition-colors duration-300">
          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#e8f0fe] dark:bg-blue-900/30 rounded-full text-[#1a73e8] dark:text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a73e8] dark:bg-blue-400 animate-ping"></span> Integrity Check: Passed
                </div>
                <h2 className="text-4xl font-bold text-[#202124] dark:text-white mb-8 tracking-tight leading-tight">Uptime isn't just a metric. <br/>It's a professional oath.</h2>
                <p className="text-lg text-[#5f6368] dark:text-gray-300 leading-relaxed mb-8">{USER_DATA.bio}</p>
                
                <div className="grid grid-cols-2 gap-8 mt-12">
                  <div className="p-6 bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-[#dadce0] dark:border-dark-border">
                    <p className="text-[10px] font-black text-[#1a73e8] dark:text-blue-400 uppercase tracking-widest mb-1">Scale Managed</p>
                    <p className="text-3xl font-black text-[#202124] dark:text-white">16K+</p>
                    <p className="text-xs text-[#5f6368] dark:text-gray-400 mt-1 font-medium italic">Nodes Synchronized</p>
                  </div>
                  <div className="p-6 bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-[#dadce0] dark:border-dark-border">
                    <p className="text-[10px] font-black text-[#34a853] dark:text-green-400 uppercase tracking-widest mb-1">Resolution Time</p>
                    <p className="text-3xl font-black text-[#202124] dark:text-white">94%</p>
                    <p className="text-xs text-[#5f6368] dark:text-gray-400 mt-1 font-medium italic">SLA Compliance</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1a73e8]/20 dark:from-blue-600/10 to-transparent blur-[100px] rounded-full"></div>
                <div className="relative bg-white dark:bg-dark-surface p-10 rounded-[32px] border border-[#dadce0] dark:border-dark-border shadow-2xl transition-colors duration-300">
                  <div className="flex items-center justify-between mb-8 pb-8 border-b border-[#f1f3f4] dark:border-dark-border">
                    <h3 className="font-bold text-[#202124] dark:text-white uppercase tracking-widest text-xs">Environment Meta</h3>
                    <div className="text-[#1a73e8] dark:text-blue-400"><ICONS.Bot /></div>
                  </div>
                  <ul className="space-y-6">
                    {[
                      { label: "Localization", val: USER_DATA.location },
                      { label: "Neural Uplink", val: USER_DATA.languages.join(" & ") },
                      { label: "Hobbies", val: USER_DATA.hobbies[0] + " & " + USER_DATA.hobbies[1] }
                    ].map(item => (
                      <li key={item.label}>
                        <p className="text-[10px] text-[#9aa0a6] dark:text-gray-500 font-bold uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-base text-[#202124] dark:text-gray-100 font-semibold">{item.val}</p>
                      </li>
                    ))}
                  </ul>
                  <button onClick={generateResumePDF} className="w-full mt-10 py-4 bg-[#f8f9fa] dark:bg-dark-border border border-[#dadce0] dark:border-dark-border rounded-xl font-bold text-xs text-[#5f6368] dark:text-gray-300 hover:bg-[#1a73e8] dark:hover:bg-blue-600 hover:text-white hover:border-[#1a73e8] transition-all uppercase tracking-[0.2em]">Generate Dossier PDF</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="expertise" className="py-32 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold text-[#202124] dark:text-white mb-4 tracking-tight">Technical Spectrum</h2>
              <p className="text-[#5f6368] dark:text-gray-400 max-w-2xl mx-auto font-medium">Deep-layer expertise in legacy and next-gen infrastructure management.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {USER_DATA.skills.map((skill) => (
                <button 
                  key={skill.name} 
                  onClick={() => setSelectedSkill(skill)}
                  className="google-card p-8 group text-left relative overflow-hidden flex flex-col transition-colors duration-300"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1a73e8] dark:bg-blue-400 animate-ping"></div>
                  </div>
                  <div className="w-14 h-14 bg-[#f8f9fa] dark:bg-dark-border rounded-2xl flex items-center justify-center text-[#5f6368] dark:text-gray-400 group-hover:text-[#1a73e8] dark:group-hover:text-blue-400 group-hover:bg-[#e8f0fe] dark:group-hover:bg-blue-900/20 transition-all mb-6">
                    {getSkillIcon(skill.name)}
                  </div>
                  <h3 className="text-xl font-bold text-[#202124] dark:text-white mb-2">{skill.name}</h3>
                  <div className="flex-1">
                    <div className="h-1 bg-[#f1f3f4] dark:bg-dark-border rounded-full overflow-hidden mb-4">
                      <div className="h-full bg-[#1a73e8] dark:bg-blue-600 transition-all duration-1000 group-hover:shadow-[0_0_10px_#1a73e8]" style={{ width: `${skill.level}%` }}></div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#1a73e8] dark:text-blue-400 uppercase tracking-widest mt-auto">Learn System Context →</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="py-32 px-6 bg-[#f8f9fa]/30 dark:bg-dark-surface/30 border-y border-[#dadce0] dark:border-dark-border">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl font-bold text-[#202124] dark:text-white mb-24 text-center tracking-tight">Deployment History</h2>
            <div className="space-y-24">
              {USER_DATA.experience.map((exp, i) => (
                <div key={i} className="relative group">
                  <div className="absolute -left-12 top-0 h-full w-[2px] bg-[#f1f3f4] dark:bg-dark-border hidden md:block group-hover:bg-[#1a73e8]/30 dark:group-hover:bg-blue-400/30 transition-colors"></div>
                  <div className="absolute -left-14 top-2 w-6 h-6 rounded-full border-4 border-white dark:border-dark-bg bg-[#f1f3f4] dark:bg-dark-border group-hover:bg-[#1a73e8] dark:group-hover:bg-blue-600 hidden md:block transition-all shadow-sm"></div>
                  <div className="google-card p-12 hover:border-[#1a73e8] dark:hover:border-blue-600 transition-all">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-[#202124] dark:text-white">{exp.role}</h3>
                        <p className="text-[#1a73e8] dark:text-blue-400 font-bold text-lg">{exp.company}</p>
                      </div>
                      <span className="px-4 py-1.5 bg-[#f8f9fa] dark:bg-dark-border border border-[#dadce0] dark:border-dark-border rounded-full text-[10px] font-bold text-[#5f6368] dark:text-gray-400 uppercase tracking-widest">{exp.period}</span>
                    </div>
                    <p className="text-lg text-[#5f6368] dark:text-gray-300 leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-40 px-6 text-center">
          <div className="container mx-auto max-w-4xl">
            <div className="w-20 h-20 bg-[#e8f0fe] dark:bg-blue-900/30 rounded-full flex items-center justify-center text-[#1a73e8] dark:text-blue-400 mx-auto mb-10 animate-bounce">
              <ICONS.Mail />
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-[#202124] dark:text-white mb-8 tracking-tighter leading-tight">Secure your infrastructure's future.</h2>
            <p className="text-xl text-[#5f6368] dark:text-gray-400 mb-16 font-medium">Establishing a direct communication uplink for high-impact project discussions.</p>
            <div className="flex flex-wrap justify-center gap-8">
              <a href={`mailto:${USER_DATA.email}`} className="px-12 py-5 bg-[#1a73e8] text-white rounded-full font-bold text-sm tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center gap-3">
                <ICONS.Mail /> EMAIL PROTOCOL
              </a>
              <a href={USER_DATA.whatsappUrl} target="_blank" rel="noopener noreferrer" className="px-12 py-5 bg-[#34a853] text-white rounded-full font-bold text-sm tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center gap-3">
                <ICONS.WhatsApp /> SECURE BRIDGE
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-24 bg-[#f8f9fa] dark:bg-[#0b0e14] border-t border-[#dadce0] dark:border-dark-border text-center px-6 relative z-10 transition-colors duration-300">
        <div className="container mx-auto">
          <div className="w-full max-w-md mx-auto mb-12 p-6 bg-[#202124] dark:bg-dark-surface rounded-2xl text-left font-mono text-[10px] text-white/40 shadow-xl border border-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 text-[#34a853] animate-pulse uppercase font-black">Online</div>
             <div className="animate-[scroll-logs_15s_linear_infinite] leading-relaxed">
               <p>> Initializing portfolio core...</p>
               <p>> Checking node 16402 health: OPTIMAL</p>
               <p>> Snapshot: [IMMUTABLE] generated</p>
               <p>> VMware Cluster status: STABLE</p>
               <p>> ServiceNow API: CONNECTED</p>
               <p>> Last Incident: RESOLVED</p>
               <p>> Monitoring active: SPECTRUM</p>
               <p>> Deploying Vishnunath v2.0...</p>
             </div>
          </div>
          <p className="text-[11px] text-[#9aa0a6] dark:text-gray-500 uppercase tracking-[0.4em] font-black">© {new Date().getFullYear()} M. Vishnunath • Infrastructure Protocol v1.4</p>
        </div>
      </footer>

      {/* MODAL */}
      {selectedSkill && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-xl bg-black/40" onClick={() => setSelectedSkill(null)}>
          <div className="w-full max-w-2xl bg-white dark:bg-dark-surface rounded-[40px] shadow-3xl overflow-hidden relative border border-[#dadce0] dark:border-dark-border p-12 md:p-16 animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedSkill(null)} className="absolute top-10 right-10 w-12 h-12 hover:bg-[#f1f3f4] dark:hover:bg-dark-border rounded-full flex items-center justify-center transition-colors text-2xl font-light text-gray-500 dark:text-gray-300">✕</button>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f8f9fa] dark:bg-dark-border rounded-full border border-[#dadce0] dark:border-dark-border text-[9px] font-black text-[#5f6368] dark:text-gray-400 uppercase tracking-widest mb-8">System Deep-Dive</div>
            <h3 className="text-4xl font-bold text-[#202124] dark:text-white mb-8 tracking-tight">{selectedSkill.name}</h3>
            <div className="p-8 bg-[#f8f9fa] dark:bg-[#0b0e14]/50 rounded-[24px] border border-[#dadce0] dark:border-dark-border mb-10">
               <p className="text-[#3c4043] dark:text-gray-300 text-lg leading-relaxed font-serif italic">"{selectedSkill.description}"</p>
            </div>
            <div className="flex justify-between items-center pt-8 border-t border-[#f1f3f4] dark:border-dark-border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#e8f0fe] dark:bg-blue-900/30 rounded-full flex items-center justify-center text-[#1a73e8] dark:text-blue-400">
                   <ICONS.Bot />
                </div>
                <div>
                   <p className="text-[10px] font-bold text-[#5f6368] dark:text-gray-500 uppercase tracking-widest">Expertise Level</p>
                   <p className="text-sm font-bold text-[#1a73e8] dark:text-blue-400">{selectedSkill.level}% Synchronized</p>
                </div>
              </div>
              <button onClick={() => setSelectedSkill(null)} className="px-8 py-3 bg-[#202124] dark:bg-blue-600 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all">Dismiss Module</button>
            </div>
          </div>
        </div>
      )}

      <TerminalPalette isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} onCommand={handleCommand} />
      <Suspense fallback={null}><ChatWidget /></Suspense>
      <style>{`
        @keyframes scroll-logs { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default App;
