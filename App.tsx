
import React, { useState, useEffect, Suspense, lazy, useCallback, memo } from 'react';
import { jsPDF } from 'jspdf';
import { USER_DATA, ICONS } from './constants';
import { Skill } from './types';

const ComicBackground = lazy(() => import('./components/ComicBackground'));

const BrandLogo = memo(({ className = "" }: { className?: string }) => (
  <div className={`relative ${className} select-none group perspective-1000`}>
    {/* Background Glow Layer */}
    <div className="absolute inset-0 bg-[#1a73e8] opacity-0 group-hover:opacity-10 blur-[60px] rounded-full transition-opacity duration-700"></div>
    
    <svg viewBox="0 0 512 512" className="w-full h-full drop-shadow-2xl transition-all duration-700 group-hover:rotate-y-12 group-hover:rotate-x-12 animate-[float_6s_ease-in-out_infinite]" aria-hidden="true">
      <defs>
        <radialGradient id="logo-glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#1a73e8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1a73e8" stopOpacity="0" />
        </radialGradient>
        
        <linearGradient id="scan-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor="#1a73e8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>

        <filter id="glitch">
          <feOffset in="SourceGraphic" dx="-2" dy="0" result="offset1" />
          <feColorMatrix in="offset1" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
          <feOffset in="SourceGraphic" dx="2" dy="0" result="offset2" />
          <feColorMatrix in="offset2" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="cyan" />
          <feBlend in="red" in2="cyan" mode="screen" />
        </filter>
      </defs>

      {/* Orbiting Ring 1 */}
      <circle cx="256" cy="256" r="245" fill="none" stroke="#e8eaed" strokeWidth="1" strokeDasharray="10 20" className="animate-[spin_40s_linear_infinite]" />
      
      {/* Orbiting Ring 2 (Counter-spin) */}
      <circle cx="256" cy="256" r="235" fill="none" stroke="#dadce0" strokeWidth="0.5" strokeDasharray="5 15" className="animate-[spin_30s_linear_infinite_reverse]" />

      {/* Main Structural Quadrants */}
      <path d="M256 26 A 230 230 0 0 1 486 256" fill="none" stroke="#4285F4" strokeWidth="12" strokeLinecap="round" className="logo-segment segment-blue shadow-glow" />
      <path d="M486 256 A 230 230 0 0 1 256 486" fill="none" stroke="#34A853" strokeWidth="12" strokeLinecap="round" className="logo-segment segment-green" />
      <path d="M256 486 A 230 230 0 0 1 26 256" fill="none" stroke="#FBBC05" strokeWidth="12" strokeLinecap="round" className="logo-segment segment-yellow" />
      <path d="M26 256 A 230 230 0 0 1 256 26" fill="none" stroke="#EA4335" strokeWidth="12" strokeLinecap="round" className="logo-segment segment-red" />
      
      {/* Circuitry Traces */}
      <g className="opacity-40 group-hover:opacity-100 transition-opacity duration-500">
        <path d="M256 100 V140 M256 372 V412 M100 256 H140 M372 256 H412" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" className="animate-pulse" />
        <circle cx="256" cy="256" r="180" fill="none" stroke="#f1f3f4" strokeWidth="1" />
      </g>

      {/* The Core Triangle */}
      <path d="M256 180 L140 380 L372 380 Z" fill="#1a73e8" fillOpacity="0.08" className="transition-all duration-500 group-hover:scale-110 group-hover:fillOpacity-20 origin-center" />
      
      {/* Persona Icon */}
      <g fill="#5f6368" className="transition-colors group-hover:fill-[#1a73e8] group-hover:filter-[url(#glitch)]">
        <circle cx="256" cy="145" r="26" className="animate-[ping-slow_4s_ease-in-out_infinite]" />
        <circle cx="256" cy="145" r="22" />
        <path d="M280 180h-48c-8 0-15 7-15 15v85c0 5 4 10 10 10s10-5 10-10v-60h5v180c0 8 7 15 15 15s15-7 15-15v-110h5v110c0 8 7 15 15 15s15-7 15-15V195c0-8-7-15-15-15z" />
      </g>
      
      {/* Integrated Nameplate */}
      <g className="translate-y-4">
        <rect x="106" y="280" width="300" height="75" fill="white" rx="16" className="shadow-2xl" />
        <text x="256" y="332" textAnchor="middle" className="font-black text-[44px] tracking-tighter" fill="#202124">VISHNUNATH</text>
        
        {/* Advanced Scanning Beam */}
        <rect x="106" y="280" width="120" height="75" fill="url(#scan-grad)" className="animate-[scan-move_2.5s_cubic-bezier(0.4,0,0.2,1)_infinite]" />
      </g>

      {/* Pulsing Nodes */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
        <g key={idx}>
          <circle 
            cx={256 + 230 * Math.cos(angle * Math.PI / 180)} 
            cy={256 + 230 * Math.sin(angle * Math.PI / 180)} 
            r="8" 
            className="animate-ping opacity-20"
            fill={['#4285F4', '#34A853', '#FBBC05', '#EA4335'][idx % 4]} 
          />
          <circle 
            cx={256 + 230 * Math.cos(angle * Math.PI / 180)} 
            cy={256 + 230 * Math.sin(angle * Math.PI / 180)} 
            r="5" 
            fill="white" 
            stroke={['#4285F4', '#34A853', '#FBBC05', '#EA4335'][idx % 4]} 
            strokeWidth="3"
          />
        </g>
      ))}
    </svg>

    {/* Creative Status Overlay (Appears on Hover) */}
    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
      <div className="flex items-center gap-2 px-4 py-1.5 bg-black/5 backdrop-blur-md rounded-full border border-black/10">
        <div className="w-2 h-2 rounded-full bg-[#34a853] animate-pulse"></div>
        <span className="text-[10px] font-bold text-[#5f6368] uppercase tracking-[0.2em]">System Status: Optimal</span>
      </div>
    </div>

    <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotateX(0deg); }
        50% { transform: translateY(-25px) rotateX(8deg); }
      }
      @keyframes scan-move {
        0% { transform: translateX(-200px); }
        100% { transform: translateX(400px); }
      }
      @keyframes ping-slow {
        0% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.4); opacity: 0; }
        100% { transform: scale(1); opacity: 0; }
      }
      .logo-segment {
        stroke-dasharray: 400;
        stroke-dashoffset: 400;
        animation: draw-segment 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
      @keyframes draw-segment {
        to { stroke-dashoffset: 0; }
      }
      .segment-blue { animation-delay: 0.1s; }
      .segment-green { animation-delay: 0.3s; }
      .segment-yellow { animation-delay: 0.5s; }
      .segment-red { animation-delay: 0.7s; }
      
      .perspective-1000 { perspective: 1000px; }
      .rotate-y-12 { transform: rotateY(15deg) rotateX(5deg); }
      
      .shadow-glow {
        filter: drop-shadow(0 0 5px currentColor);
      }
    `}</style>
  </div>
));

const Navbar = memo(({ activeSection, scrollToSection }: any) => (
  <nav className="fixed top-0 w-full z-[120] header-glass py-3" aria-label="Main Navigation">
    <div className="container mx-auto px-6 flex justify-between items-center">
      <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="flex items-center gap-4 group">
        <BrandLogo className="w-12 h-12" />
        <div className="flex flex-col text-left">
          <span className="font-semibold text-[#202124] text-base leading-none">Vishnunath</span>
          <span className="text-[9px] font-medium text-[#5f6368] uppercase tracking-wider mt-0.5">Systems Core</span>
        </div>
      </button>
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center mr-6">
          {['about', 'expertise', 'experience'].map((id) => (
            <a key={id} href={`#${id}`} onClick={(e) => scrollToSection(e, id)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === id ? 'text-[#1a73e8] bg-[#e8f0fe]' : 'text-[#5f6368] hover:bg-[#f1f3f4]'}`}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </div>
        <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="ml-2 px-6 py-2 btn-google btn-google-primary text-sm shadow-md">Contact</a>
      </div>
    </div>
  </nav>
));

const SkillCard = memo(({ skill, onClick, icon }: any) => (
  <button onClick={onClick} className="google-card p-6 cursor-pointer flex items-start gap-4 transition-all duration-300 group hover:scale-[1.03] hover:shadow-2xl hover:border-black hover:border-2 text-left w-full">
    <div className="w-12 h-12 rounded-lg bg-[#f8f9fa] flex items-center justify-center text-[#5f6368] group-hover:text-[#1a73e8] transition-colors">
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="font-semibold text-[#202124] text-base mb-1">{skill.name}</h3>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1 bg-[#e8eaed] rounded-full overflow-hidden">
          <div className="h-full bg-[#1a73e8] transition-all duration-1000" style={{ width: `${skill.level}%` }}></div>
        </div>
        <span className="text-[10px] font-medium text-[#5f6368]">{skill.level}%</span>
      </div>
    </div>
  </button>
));

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const generateResumePDF = useCallback(() => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
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
    doc.setFont("helvetica", "bold");
    doc.text("Professional Experience", 20, y);
    y += 10;
    USER_DATA.experience.forEach(exp => {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(exp.role, 20, y);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
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
    }, { threshold: 0.5 });
    ['home', 'about', 'expertise', 'experience', 'contact'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
  };

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
    <div className="min-h-screen relative selection:bg-[#1a73e8]/30">
      <Suspense fallback={null}><ComicBackground /></Suspense>
      <Navbar activeSection={activeSection} scrollToSection={scrollToSection} />
      <main className="pt-24 pb-20 relative z-10">
        <section id="home" className="container mx-auto px-6 py-20 lg:py-40 flex flex-col items-center text-center">
          <div className="mb-16 animate-in zoom-in duration-700">
            <BrandLogo className="w-56 h-56 md:w-72 md:h-72" />
          </div>
          <h1 className="text-5xl lg:text-7xl font-semibold text-[#202124] mb-8 tracking-tight max-w-5xl">The Infrastructure Architect for the Enterprise.</h1>
          <p className="text-xl lg:text-2xl text-[#5f6368] mb-12 max-w-3xl leading-relaxed">
            Expert orchestration of <span className="text-[#1a73e8] font-medium">16,000 server nodes</span>. Building stability through precision systems management.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={(e) => scrollToSection(e, 'about')} className="px-12 py-4 btn-google btn-google-primary text-base shadow-lg hover:scale-105 transition-transform">Professional Background</button>
            <button onClick={(e) => scrollToSection(e, 'expertise')} className="px-12 py-4 btn-google border-2 border-[#dadce0] text-[#1a73e8] bg-white hover:bg-[#f8f9fa] text-base hover:border-black hover:scale-105 transition-transform">Technical Expertise</button>
          </div>
        </section>

        <section id="about" className="bg-[#f8f9fa]/80 backdrop-blur-md py-24 px-6 border-y border-[#dadce0]">
          <div className="container mx-auto max-w-5xl">
            <div className="grid lg:grid-cols-2 gap-20 items-start">
              <div>
                <h2 className="text-3xl font-semibold text-[#202124] mb-8">Uptime Protocol: 99.9%</h2>
                <p className="text-lg text-[#5f6368] leading-relaxed mb-6">{USER_DATA.bio}</p>
                <div className="mt-10 p-6 bg-white rounded-2xl border border-[#dadce0] shadow-sm">
                  <h3 className="text-sm font-bold text-[#1a73e8] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ICONS.User /> Beyond the Servers
                  </h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    <div>
                      <p className="text-[10px] text-[#9aa0a6] uppercase font-bold mb-1">Passions</p>
                      <p className="text-sm text-[#202124] font-medium">{USER_DATA.hobbies.join(", ")}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#9aa0a6] uppercase font-bold mb-1">Localization</p>
                      <p className="text-sm text-[#202124] font-medium">{USER_DATA.location}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#9aa0a6] uppercase font-bold mb-1">Languages</p>
                      <p className="text-sm text-[#202124] font-medium">{USER_DATA.languages.join(", ")}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[{ label: "Managed Nodes", v: "16K" }, { label: "Uptime SLA", v: "99.9%" }, { label: "Professional Exp", v: "8Y+" }, { label: "System Health", v: "Healthy" }].map(i => (
                  <div key={i.label} className="bg-white p-8 rounded-2xl border border-[#dadce0] text-center shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-3xl font-black text-[#1a73e8]">{i.v}</p>
                    <p className="text-xs font-medium text-[#5f6368] uppercase tracking-widest mt-2">{i.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="expertise" className="py-24 px-6"><div className="container mx-auto max-w-6xl"><div className="text-center mb-16"><h2 className="text-3xl font-semibold text-[#202124] mb-4">Core Competencies</h2><p className="text-[#5f6368]">Advanced technical deck for enterprise operations.</p></div><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{USER_DATA.skills.map((skill) => (<SkillCard key={skill.name} skill={skill} onClick={() => setSelectedSkill(skill)} icon={getSkillIcon(skill.name)} />))}</div></div></section>

        <section id="experience" className="py-24 px-6 bg-[#f8f9fa]/80 backdrop-blur-md border-y border-[#dadce0]"><div className="container mx-auto max-w-4xl"><h2 className="text-3xl font-semibold text-[#202124] mb-20 text-center">Career Trajectory</h2><div className="space-y-16">{USER_DATA.experience.map((exp, i) => (<div key={i} className="flex gap-8 group"><div className="flex flex-col items-center"><div className="w-12 h-12 bg-white border border-[#dadce0] rounded-full flex items-center justify-center text-[#1a73e8] font-bold text-sm shadow-sm group-hover:border-[#1a73e8] transition-all">{USER_DATA.experience.length - i}</div><div className="flex-1 w-[2px] bg-[#dadce0] my-4"></div></div><div className="pb-12 flex-1"><div className="google-card p-10 bg-white hover:border-[#1a73e8] transition-all"><h3 className="text-2xl font-semibold text-[#202124] mb-1">{exp.role}</h3><p className="text-[#1a73e8] font-medium text-lg mb-4">{exp.company}</p><p className="text-[#5f6368] leading-relaxed text-base">{exp.description}</p></div></div></div>))}</div></div></section>

        <section id="contact" className="py-32 px-6 text-center"><div className="container mx-auto max-w-4xl"><h2 className="text-5xl font-semibold text-[#202124] mb-6">Ready to scale your next project?</h2><div className="grid sm:grid-cols-3 gap-6 mt-16">
          <a href={`mailto:${USER_DATA.email}`} className="google-card p-8 bg-white/90 hover:bg-[#e8f0fe] transition-all flex flex-col items-center gap-4 group"><div className="w-14 h-14 bg-[#e8f0fe] rounded-full flex items-center justify-center text-[#1a73e8] group-hover:scale-110 transition-transform"><ICONS.Mail /></div><span className="text-sm font-semibold text-[#202124]">Primary Mail</span></a>
          <a href={USER_DATA.whatsappUrl} target="_blank" rel="noopener noreferrer" className="google-card p-8 bg-white/90 hover:bg-[#e6f4ea] transition-all flex flex-col items-center gap-4 group"><div className="w-14 h-14 bg-[#e6f4ea] rounded-full flex items-center justify-center text-[#34a853] group-hover:scale-110 transition-transform"><ICONS.WhatsApp /></div><span className="text-sm font-semibold text-[#202124]">Secure Bridge</span></a>
          <button onClick={generateResumePDF} className="google-card p-8 bg-white/90 hover:bg-[#f1f3f4] transition-all flex flex-col items-center gap-4 group"><div className="w-14 h-14 bg-[#f1f3f4] rounded-full flex items-center justify-center text-[#202124] group-hover:scale-110 transition-transform"><ICONS.Download /></div><span className="text-sm font-semibold text-[#202124]">System Ledger</span></button>
        </div></div></section>
      </main>

      <footer className="py-24 bg-[#f8f9fa] border-t border-[#dadce0] text-center px-6 relative z-10"><div className="container mx-auto flex flex-col items-center gap-12">
        <div className="w-full max-w-xs h-12 overflow-hidden bg-[#e8eaed] rounded-lg p-2 text-left font-mono text-[8px] text-[#5f6368] opacity-50"><div className="animate-[scroll-logs_10s_linear_infinite]"><p>&gt; Node 094 health check: OK</p><p>&gt; Snapshot: Immutable</p><p>&gt; ServiceNow: Connected</p><p>&gt; Deployment: Online</p></div></div>
        <div className="text-[11px] text-[#9aa0a6] uppercase tracking-[0.3em] font-semibold">© {new Date().getFullYear()} M. Vishnunath • Protocol Portfolio</div>
      </div></footer>

      {/* MODAL */}
      {selectedSkill && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-white/60" onClick={() => setSelectedSkill(null)}>
          <div className="w-full max-w-xl bg-white rounded-[32px] shadow-3xl overflow-hidden relative border border-[#dadce0] p-14 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedSkill(null)} className="absolute top-8 right-8 w-12 h-12 hover:bg-[#f1f3f4] rounded-full flex items-center justify-center transition-colors">✕</button>
            <h3 className="text-4xl font-semibold text-[#202124] mb-8">{selectedSkill.name}</h3>
            <p className="text-[#5f6368] text-lg leading-relaxed">{selectedSkill.description}</p>
          </div>
        </div>
      )}

      <style>{`@keyframes scroll-logs { 0% { transform: translateY(0); } 100% { transform: translateY(-100%); } }`}</style>
    </div>
  );
};

export default App;
