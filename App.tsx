import React, { useState, useEffect, useRef } from 'react';
import { USER_DATA, ICONS } from './constants';
import { Skill } from './types';
import ChatWidget from './components/ChatWidget';
import { jsPDF } from 'jspdf';

const CompassLogo = ({ className = "", color = "#7c6837" }: { className?: string, color?: string }) => (
  <div className={`relative ${className} group select-none`}>
    <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-md transition-transform duration-1000">
      {/* Dynamic Outer Ring */}
      <circle cx="200" cy="200" r="185" fill="none" stroke={color} strokeWidth="1" strokeDasharray="1 10.15" opacity="0.3" className="animate-spin-slow" />
      
      {/* Pulse effect */}
      <circle cx="200" cy="200" r="10" fill={color} className="animate-ping opacity-20" />
      
      <g fill={color} className="group-hover:scale-110 transition-transform duration-700 origin-center">
        <path d="M200 10 L212 60 L188 60 Z" />
        <path d="M200 390 L212 340 L188 340 Z" />
        <path d="M390 200 L340 212 L340 188 Z" />
        <path d="M10 200 L60 212 L60 188 Z" />
        <path d="M334 66 L305 105 L295 95 Z" transform-origin="200 200" />
        <path d="M334 66 L305 105 L295 95 Z" transform="rotate(90 200 200)" />
        <path d="M334 66 L305 105 L295 95 Z" transform="rotate(180 200 200)" />
        <path d="M334 66 L305 105 L295 95 Z" transform="rotate(270 200 200)" />
      </g>
      
      <circle cx="200" cy="200" r="160" fill="none" stroke={color} strokeWidth="4" />
      <circle cx="200" cy="200" r="148" fill="#fcfaf4" />
      <path d="M200 160 L60 350 L340 350 Z" fill={color} opacity="0.15" />
      
      <g transform="translate(170, 95) scale(2.5)" fill="#433929">
        <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zM15 9h-6v4h2v9h2v-9h2V9z" />
        <path d="M9 22h2v-8h2v8h2V9H9z" />
      </g>
      <rect x="65" y="240" width="270" height="55" fill="white" stroke={color} strokeWidth="2" rx="2" />
      <text x="200" y="282" textAnchor="middle" className="font-black text-[38px] tracking-[0.05em] uppercase" fill="#433929">VISHNUNATH</text>
      
      {/* Radar Scanline */}
      <line x1="200" y1="200" x2="200" y2="40" stroke={color} strokeWidth="2" opacity="0.2" className="animate-radar-sweep origin-center" />
    </svg>
  </div>
);

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date().toLocaleTimeString()), 1000);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { rootMargin: '-10% 0px -80% 0px', threshold: 0 });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });

    const sections = ['home', 'about', 'expertise', 'experience', 'education', 'contact'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    window.addEventListener('scroll', handleScroll);

    if (selectedSkill) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
      sectionObserver.disconnect();
      revealObserver.disconnect();
      document.body.style.overflow = 'unset';
    };
  }, [selectedSkill]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      window.scrollTo({ 
        top: element.getBoundingClientRect().top + window.scrollY - offset, 
        behavior: 'smooth' 
      });
    }
  };

  const getSkillIcon = (name: string) => {
    if (name.includes('Windows')) return <ICONS.Windows />;
    if (name.includes('VMware')) return <ICONS.VMware />;
    if (name.includes('Hyper-V')) return <ICONS.HyperV />;
    if (name.includes('ServiceNow')) return <ICONS.ServiceNow />;
    if (name.includes('Monitoring')) return <ICONS.Monitoring />;
    if (name.includes('Backup')) return <ICONS.Backup />;
    if (name.includes('AI')) return <ICONS.AI />;
    if (name.includes('Hardware')) return <ICONS.Hardware />;
    return <ICONS.Bot />;
  };

  const handleDownloadResume = () => {
    try {
      const doc = new jsPDF();
      const margin = 20;
      let y = 20;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(67, 57, 41);
      doc.text(USER_DATA.name, margin, y);
      y += 10;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(124, 104, 55);
      doc.text(USER_DATA.title, margin, y);
      y += 15;

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`${USER_DATA.email}  |  +919944012688  |  Madurai, Tamil Nadu`, margin, y);
      y += 5;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, 190, y);
      y += 15;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(67, 57, 41);
      doc.text("Professional Summary", margin, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      const summaryLines = doc.splitTextToSize(USER_DATA.bio, 170);
      doc.text(summaryLines, margin, y);
      y += (summaryLines.length * 5) + 10;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(67, 57, 41);
      doc.text("Professional Experience", margin, y);
      y += 10;

      USER_DATA.experience.forEach((exp) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(67, 57, 41);
        doc.text(exp.role, margin, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(124, 104, 55);
        doc.text(`${exp.company} (${exp.period})`, 190, y, { align: 'right' });
        y += 6;
        
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        const descLines = doc.splitTextToSize(exp.description, 170);
        doc.text(descLines, margin, y);
        y += (descLines.length * 5) + 8;
      });

      y += 5;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(67, 57, 41);
      doc.text("Technical Expertise", margin, y);
      y += 10;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const skillsText = USER_DATA.skills.map(s => s.name).join('  •  ');
      const skillLines = doc.splitTextToSize(skillsText, 170);
      doc.text(skillLines, margin, y);
      y += (skillLines.length * 5) + 12;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(67, 57, 41);
      doc.text("Education", margin, y);
      y += 8;
      USER_DATA.education.forEach(edu => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(edu.degree, margin, y);
        doc.setFont("helvetica", "normal");
        doc.text(`${edu.institution} (${edu.year})`, 190, y, { align: 'right' });
        y += 6;
      });

      doc.save('M_Vishnunath_Professional_CV.pdf');
    } catch (err) {
      console.error("PDF Export Error:", err);
      alert("Encountered an issue during PDF synthesis.");
    }
  };

  return (
    <div className="min-h-screen selection:bg-[#7c6837] selection:text-white relative bg-[#fbf9f4]" onMouseMove={handleMouseMove}>
      
      {/* Skill Modal */}
      {selectedSkill && (
        <div 
          className="fixed inset-0 z-[150] flex items-center justify-center p-6 sm:p-12 animate-in fade-in duration-300 backdrop-blur-md bg-black/40"
          onClick={() => setSelectedSkill(null)}
        >
          <div 
            className="w-full max-w-2xl bg-white rounded-[3rem] shadow-4xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 relative flex flex-col sm:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedSkill(null)}
              className="absolute top-8 right-8 z-20 w-12 h-12 bg-[#fbf9f4] hover:bg-[#433929] hover:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>

            <div className="w-full sm:w-1/3 bg-[#433929] p-12 flex flex-col items-center justify-center text-white relative">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none tech-grid"></div>
              <div className="w-24 h-24 bg-white/10 rounded-[2rem] flex items-center justify-center text-[#7c6837] mb-8 animate-float">
                {getSkillIcon(selectedSkill.name)}
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-[#7c6837] mb-2">Asset_Code</p>
              <p className="font-black text-2xl tracking-tighter">0x{selectedSkill.level}</p>
            </div>

            <div className="w-full sm:w-2/3 p-12 sm:p-16 flex flex-col justify-center">
              <div className="mb-10">
                <span className="px-4 py-2 bg-[#fbf9f4] text-[#7c6837] font-black text-[9px] uppercase tracking-widest rounded-full border border-[#7c6837]/10 inline-block mb-4">
                  {selectedSkill.category} Infrastructure
                </span>
                <h3 className="text-4xl font-black text-[#433929] tracking-tighter leading-none mb-2 uppercase">
                  {selectedSkill.name}
                </h3>
              </div>
              <div className="space-y-10">
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Operational Proficiency</p>
                    <p className="font-bold text-[#7c6837]">{selectedSkill.level}%</p>
                  </div>
                  <div className="h-4 bg-[#fbf9f4] rounded-full overflow-hidden border border-slate-100 p-1 shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-[#7c6837] to-[#433929] rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${selectedSkill.level}%` }}
                    ></div>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-6 top-0 bottom-0 w-1 bg-[#7c6837]/20 rounded-full"></div>
                  <p className="text-slate-600 font-medium text-lg leading-relaxed italic">
                    "{selectedSkill.description || "Specialized infrastructure management protocol ensuring absolute reliability across enterprise environments."}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Background Pattern */}
      <div className="fixed inset-0 tech-grid -z-10 opacity-[0.03]"></div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${isScrolled ? 'glass py-1.5 shadow-2xl border-b border-[#7c6837]/10' : 'bg-transparent py-8'}`}>
        {/* Top Progress Bar */}
        <div 
          className="absolute top-0 left-0 h-[3px] bg-gradient-to-r from-[#7c6837] to-[#433929] transition-all duration-200"
          style={{ width: `${scrollProgress}%` }}
        />
        
        <div className="container mx-auto px-6 flex justify-between items-center relative">
          <a href="#home" onClick={(e) => scrollToSection(e, 'home')} className="flex items-center gap-5 group py-2">
            <CompassLogo className="w-12 h-12 md:w-14 md:h-14 transition-transform duration-500 group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="font-black text-[#433929] text-xl tracking-tighter leading-none uppercase group-hover:text-[#7c6837] transition-colors">VISHNUNATH</span>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="w-1 h-1 bg-[#7c6837] rounded-full animate-ping opacity-60"></span>
                <span className="text-[8px] font-mono uppercase tracking-widest text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">Asset.INFRA_01</span>
              </div>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-1.5 p-1 bg-[#433929]/5 rounded-2xl border border-white/40 shadow-inner overflow-hidden">
            {['about', 'expertise', 'experience', 'education'].map((id, index) => (
              <a 
                key={id} 
                href={`#${id}`} 
                onClick={(e) => scrollToSection(e, id)}
                style={{ transitionDelay: `${index * 50}ms` }}
                className={`relative px-6 py-3 rounded-xl transition-all duration-500 text-[10px] font-black uppercase tracking-[0.3em] overflow-hidden group/link animate-in fade-in slide-in-from-top-2 ${
                  activeSection === id 
                    ? 'text-white bg-[#433929] shadow-lg scale-105' 
                    : 'text-slate-400 hover:text-[#433929] hover:bg-white/50'
                }`}
              >
                <span className="relative z-10">{id}</span>
                {/* Magnetic-like highlight on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#7c6837] to-[#433929] opacity-0 group-hover/link:opacity-10 transition-opacity" />
              </a>
            ))}
            
            <div className="w-px h-6 bg-slate-200 mx-2" />
            
            <a 
              href="#contact" 
              onClick={(e) => scrollToSection(e, 'contact')}
              className="group/contact px-8 py-3 rounded-xl bg-[#433929] text-white hover:bg-[#7c6837] transition-all duration-500 shadow-xl active:scale-95 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3"
            >
              <span>Contact</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover/contact:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>
          
          {/* Subtle Cyber Frame corners on scroll */}
          {isScrolled && (
            <>
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#7c6837]/20 -translate-x-2 -translate-y-2" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#7c6837]/20 translate-x-2 -translate-y-2" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#7c6837]/20 -translate-x-2 translate-y-2" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#7c6837]/20 translate-x-2 translate-y-2" />
            </>
          )}
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex flex-col justify-center items-center pt-24 overflow-hidden bg-white">
          <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
            <div className="reveal">
              <div className="mb-12 inline-block"><CompassLogo className="w-48 h-48 md:w-64 md:h-64 animate-float" /></div>
              <h1 className="text-6xl md:text-[8rem] font-black text-[#433929] mb-8 leading-[0.9] tracking-tighter text-glow max-w-5xl">
                Navigating <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#7c6837] to-[#433929] italic">Absolute</span> Scale.
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 mb-16 max-w-2xl mx-auto leading-relaxed font-medium">
                Infrastructure Specialist managing <span className="text-[#433929] font-black border-b-2 border-[#7c6837]">16,000 servers</span> with unwavering resilience. 
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="px-12 py-6 bg-[#433929] text-white rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] hover:bg-[#7c6837] transition-all shadow-3xl active:scale-95 flex items-center gap-3">Read Profile</a>
              </div>
            </div>
          </div>
        </section>

        {/* About Section - Redesigned 'Identity Profile' */}
        <section id="about" className="py-48 bg-[#fbf9f4] relative overflow-hidden scroll-mt-20 border-y border-slate-100">
          {/* Animated Background Conduits */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
            <svg className="w-full h-full" viewBox="0 0 1000 1000">
              <path d="M-100 500 Q 250 100 500 500 T 1100 500" fill="none" stroke="#7c6837" strokeWidth="2" className="animate-dash" strokeDasharray="10 50" />
              <path d="M-100 400 Q 250 800 500 400 T 1100 400" fill="none" stroke="#433929" strokeWidth="1" className="animate-dash-reverse" strokeDasharray="15 45" />
            </svg>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row gap-24 items-start max-w-7xl mx-auto">
              {/* Left Column: Visual Identity Modules */}
              <div className="w-full lg:w-1/2 reveal">
                <div className="relative">
                  <p className="text-[#7c6837] font-black uppercase tracking-[0.6em] text-[10px] mb-8">Digital_Twin: v2.5</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    {/* Architect Module */}
                    <div className="group bg-white p-10 rounded-[3rem] border-2 border-[#7c6837]/10 hover:border-[#7c6837] transition-all duration-700 shadow-xl hover:shadow-4xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#7c6837]/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                      <div className="w-16 h-16 rounded-2xl bg-[#fbf9f4] flex items-center justify-center text-[#7c6837] mb-8 group-hover:bg-[#433929] group-hover:text-white transition-all transform group-hover:rotate-[360deg] duration-1000">
                         <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                      </div>
                      <h3 className="text-2xl font-black text-[#433929] mb-4 tracking-tighter uppercase">Architect</h3>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed group-hover:text-slate-700 transition-colors">Designing high-availability systems with 16k+ concurrent node resiliency protocols.</p>
                      {/* Technical Detail on Hover */}
                      <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="text-[9px] font-black text-[#7c6837] uppercase tracking-widest">Protocol: HA_Grid</span>
                        <div className="flex gap-1">
                          <div className="w-1 h-1 bg-[#7c6837] rounded-full"></div>
                          <div className="w-1 h-1 bg-[#7c6837] rounded-full"></div>
                          <div className="w-1 h-1 bg-[#7c6837] rounded-full opacity-30"></div>
                        </div>
                      </div>
                    </div>

                    {/* Leader Module */}
                    <div className="group bg-[#433929] p-10 rounded-[3rem] text-white shadow-xl hover:shadow-4xl transition-all duration-700 hover:-translate-y-4 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute w-[200%] h-px bg-white/40 top-1/2 left-0 -translate-y-1/2 animate-slide-right rotate-45"></div>
                      </div>
                      <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-[#7c6837] mb-8 group-hover:bg-[#7c6837] group-hover:text-white transition-all transform group-hover:scale-110 duration-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><polyline points="12 10 16 14 22 8"/></svg>
                      </div>
                      <h3 className="text-2xl font-black mb-4 tracking-tighter uppercase">Leader</h3>
                      <p className="text-white/60 text-sm font-medium leading-relaxed group-hover:text-white transition-colors">Incident Commander for mission-critical failures. Orchestrating global teams under rigorous SLAs.</p>
                      <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between opacity-60">
                        <span className="text-[9px] font-black uppercase tracking-widest">Tier: Level_3</span>
                        <span className="text-[9px] font-mono">0x4D616475726169</span>
                      </div>
                    </div>

                    {/* Stats Module (Spans 2 columns on tablet+) */}
                    <div className="md:col-span-2 group bg-white border-2 border-[#7c6837]/10 p-12 rounded-[4rem] shadow-xl hover:shadow-4xl transition-all duration-700 overflow-hidden relative">
                       <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                          <ICONS.Monitoring />
                       </div>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
                          <div className="text-center md:text-left">
                            <p className="text-4xl font-black text-[#433929] tracking-tighter mb-1">8+</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Experience_Age</p>
                          </div>
                          <div className="text-center md:text-left">
                            <p className="text-4xl font-black text-[#7c6837] tracking-tighter mb-1">16K</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active_Nodes</p>
                          </div>
                          <div className="text-center md:text-left">
                            <p className="text-4xl font-black text-[#433929] tracking-tighter mb-1">99.9%</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Uptime_Metric</p>
                          </div>
                          <div className="text-center md:text-left">
                            <p className="text-4xl font-black text-[#7c6837] tracking-tighter mb-1">24/7</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sys_Status</p>
                          </div>
                       </div>
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#7c6837]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[2000ms] pointer-events-none"></div>
                    </div>
                  </div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 border border-[#7c6837]/20 rounded-full animate-pulse-slow pointer-events-none"></div>
                </div>
              </div>

              {/* Right Column: Narrative Biography */}
              <div className="w-full lg:w-1/2 reveal" style={{ transitionDelay: '0.3s' }}>
                <div className="lg:pl-12">
                  <h2 className="text-6xl md:text-8xl font-black text-[#433929] tracking-tighter leading-none mb-12">
                    Absolute <br/>
                    <span className="text-[#7c6837] italic underline decoration-[#7c6837]/20 underline-offset-8">Resilience.</span>
                  </h2>
                  
                  <div className="space-y-12 relative">
                    <div className="absolute -left-8 top-4 bottom-4 w-px bg-gradient-to-b from-[#7c6837]/50 via-[#7c6837]/10 to-transparent"></div>
                    
                    <div className="relative">
                      <div className="absolute -left-10 top-0 w-4 h-4 rounded-full bg-white border-2 border-[#7c6837] shadow-sm"></div>
                      <p className="text-2xl font-medium text-slate-600 leading-relaxed max-w-2xl">
                        I operate at the intersection of <span className="text-[#433929] font-black">heavy infrastructure</span> and <span className="text-[#433929] font-black italic">high-performance management</span>. 
                      </p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-10 top-0 w-4 h-4 rounded-full bg-white border-2 border-[#7c6837] shadow-sm"></div>
                      <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                        Managing <span className="text-[#7c6837] font-black border-b-2 border-[#7c6837]/10">16,000 nodes</span> is more than a technical role—it's a commitment to enterprise survival. From legacy Windows 2003 stacks to current virtualization benchmarks, I ensure the grid never falters.
                      </p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-10 top-0 w-4 h-4 rounded-full bg-white border-2 border-[#7c6837] shadow-sm"></div>
                      <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                        My career has been defined by the pursuit of zero-downtime excellence. Whether orchestrating rapid point-in-time recoveries or deploying modern hyper-converged environments, my focus remains on absolute stability and strategic scalability.
                      </p>
                    </div>

                    <div className="pt-12 flex flex-wrap gap-4">
                       <div className="px-6 py-3 rounded-2xl bg-white border-2 border-[#7c6837]/10 text-[#433929] font-black text-[10px] uppercase tracking-widest hover:border-[#7c6837] transition-all cursor-default">Precision_Focus</div>
                       <div className="px-6 py-3 rounded-2xl bg-white border-2 border-[#7c6837]/10 text-[#433929] font-black text-[10px] uppercase tracking-widest hover:border-[#7c6837] transition-all cursor-default">Incident_Resolved</div>
                       <div className="px-6 py-3 rounded-2xl bg-white border-2 border-[#7c6837]/10 text-[#433929] font-black text-[10px] uppercase tracking-widest hover:border-[#7c6837] transition-all cursor-default">Infrastructure_First</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes dash {
              to { stroke-dashoffset: -100; }
            }
            .animate-dash {
              animation: dash 10s linear infinite;
            }
            .animate-dash-reverse {
              animation: dash 15s linear infinite reverse;
            }
            @keyframes slide-right {
              0% { transform: translate(-100%, -50%) rotate(45deg); }
              100% { transform: translate(100%, -50%) rotate(45deg); }
            }
            .animate-slide-right {
              animation: slide-right 3s linear infinite;
            }
            @keyframes radar-sweep {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .animate-radar-sweep {
              animation: radar-sweep 4s linear infinite;
            }
          `}} />
        </section>

        {/* Expertise Section */}
        <section id="expertise" className="py-40 bg-white scroll-mt-20">
          <div className="container mx-auto px-6">
            <div className="reveal text-center mb-40 max-w-4xl mx-auto">
              <h2 className="text-6xl font-black mb-6 tracking-tighter text-[#433929]">Technical Arsenal</h2>
              <p className="text-slate-500 font-medium text-xl">Modular architecture of a modern infrastructure veteran.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#7c6837]/10 bg-white shadow-2xl overflow-hidden rounded-[2rem]">
              {USER_DATA.skills.map((skill, i) => (
                <div key={i} onClick={() => setSelectedSkill(skill)} onMouseEnter={() => setHoveredSkill(skill)} onMouseLeave={() => setHoveredSkill(null)}
                  className="reveal group relative p-10 border border-[#7c6837]/10 transition-all duration-500 hover:bg-[#433929] hover:z-20 hover:scale-[1.02] hover:shadow-2xl overflow-hidden min-h-[280px] flex flex-col cursor-pointer">
                  {/* Skill Icon Container with Enhanced Micro-interactions */}
                  <div className="w-16 h-16 rounded-2xl bg-[#fbf9f4] flex items-center justify-center text-[#7c6837] mb-8 group-hover:bg-white group-hover:text-[#433929] transition-all duration-500 transform group-hover:rotate-[15deg] group-hover:scale-110 shadow-sm group-hover:shadow-lg mt-4">
                     <div className="transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-0.5">
                        {getSkillIcon(skill.name)}
                     </div>
                  </div>
                  <h3 className="font-black text-xl mb-4 text-[#433929] tracking-tighter group-hover:text-white transition-colors leading-tight">{skill.name}</h3>
                  <div className="pt-6 border-t border-[#7c6837]/5 group-hover:border-white/10 mt-auto pb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-300">[{skill.category}]</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Career Roadmap */}
        <section id="experience" className="py-40 bg-[#fbf9f4] relative overflow-hidden scroll-mt-20">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{backgroundImage: 'radial-gradient(#433929 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="reveal flex flex-col md:flex-row justify-between items-end mb-32 border-b-2 border-[#7c6837]/10 pb-12">
              <div>
                <p className="text-[#7c6837] font-black uppercase tracking-[0.5em] text-[10px] mb-4">Project: Career Infrastructure</p>
                <h2 className="text-6xl md:text-8xl font-black text-[#433929] tracking-tighter leading-none">The Roadmap.</h2>
              </div>
              <div className="hidden md:block text-right">
                <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-1">System_Clock</p>
                <p className="font-mono text-2xl font-bold text-[#7c6837] tracking-tighter">{systemTime}</p>
              </div>
            </div>
            <div className="relative max-w-6xl mx-auto">
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2 hidden md:block"></div>
              <div className="space-y-32">
                {USER_DATA.experience.map((exp, i) => (
                  <div key={i} className={`reveal relative flex flex-col md:flex-row items-center gap-10 md:gap-20 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="w-full md:w-[45%]">
                      <div className="group relative bg-white border border-slate-200 rounded-3xl p-10 md:p-14 shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-[#7c6837] opacity-0 group-hover:opacity-100 transition-all"></div>
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-8">
                            <div>
                               <span className="font-mono text-[9px] text-[#7c6837] font-black uppercase tracking-[0.3em] mb-2 block">Blade_Slot: 0{USER_DATA.experience.length - i}</span>
                               <h3 className="text-3xl font-black text-[#433929] tracking-tighter mb-1 uppercase">{exp.role}</h3>
                               <p className="text-lg font-bold text-[#7c6837] italic opacity-80">{exp.company}</p>
                            </div>
                            {exp.company === 'HCLTech' && (
                               <div className="w-12 h-12 rounded-full border-2 border-green-500/20 flex items-center justify-center relative">
                                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]"></div>
                               </div>
                            )}
                          </div>
                          <div className="p-8 bg-[#fbf9f4] rounded-2xl border border-slate-100 mb-10 group-hover:bg-[#433929] group-hover:text-white transition-all duration-500">
                             <p className="text-lg leading-relaxed font-medium italic opacity-90">"{exp.description}"</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative flex flex-col items-center justify-center">
                       <div className="w-20 h-20 rounded-2xl bg-[#433929] border-4 border-white shadow-xl flex items-center justify-center z-10 group relative transition-transform hover:rotate-45">
                          <span className="text-white font-black text-xl">0{USER_DATA.experience.length - i}</span>
                       </div>
                    </div>
                    <div className="hidden md:block w-[45%]"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Education Section - Redesigned 'Academic Pillars' */}
        <section id="education" className="py-48 bg-white scroll-mt-20 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#7c6837]/5 blur-[120px] rounded-full pointer-events-none -mr-[400px] -mt-[400px]"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#433929]/5 blur-[100px] rounded-full pointer-events-none -ml-[300px] -mb-[300px]"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="reveal text-center mb-32 max-w-4xl mx-auto">
              <p className="text-[#7c6837] font-black uppercase tracking-[0.6em] text-[10px] mb-4">Foundation Protocol</p>
              <h2 className="text-7xl md:text-[6rem] font-black mb-8 tracking-tighter text-[#433929] leading-none">
                Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c6837] to-[#433929] italic underline decoration-[#7c6837]/30 underline-offset-[16px]">Pillars.</span>
              </h2>
              <p className="text-slate-500 font-medium text-xl leading-relaxed">System-level foundations and core architectural training powering enterprise environments.</p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 gap-12 relative">
                {/* Vertical Knowledge Conduit */}
                <div className="absolute left-[30px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#7c6837]/0 via-[#7c6837]/40 to-[#7c6837]/0 -translate-x-1/2 hidden md:block"></div>
                
                {USER_DATA.education.map((edu, i) => (
                  <div key={i} className={`reveal group relative flex flex-col md:flex-row items-center gap-12 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                    {/* Education Card */}
                    <div className="w-full md:w-[48%] perspective-1000">
                      <div className="relative bg-white border-2 border-[#7c6837]/10 p-10 md:p-14 rounded-[3.5rem] shadow-xl hover:shadow-4xl transition-all duration-700 hover:-translate-y-3 group/card overflow-hidden">
                        {/* Blueprint Grid Overlay on Hover */}
                        <div className="absolute inset-0 opacity-0 group-hover/card:opacity-[0.03] transition-opacity duration-700 tech-grid pointer-events-none"></div>
                        
                        {/* Creative Header */}
                        <div className="flex justify-between items-start mb-10 relative z-10">
                          <div>
                            <span className="font-mono text-[9px] text-[#7c6837] font-black uppercase tracking-[0.4em] mb-3 block">Milestone_v0{USER_DATA.education.length - i}</span>
                            <h3 className="text-3xl md:text-4xl font-black text-[#433929] tracking-tighter leading-tight uppercase mb-2 group-hover/card:text-[#7c6837] transition-colors">{edu.degree}</h3>
                            <p className="text-slate-400 font-bold tracking-tight text-lg">{edu.institution}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-4xl font-black text-[#433929]/10 group-hover/card:text-[#7c6837]/20 transition-all">{edu.year}</span>
                          </div>
                        </div>

                        {/* Creative Content Details */}
                        <div className="flex justify-center relative z-10 pt-8 border-t border-slate-50">
                          <div className="w-full p-6 bg-[#fbf9f4] rounded-3xl border border-slate-100 group-hover/card:bg-[#7c6837] group-hover/card:text-white transition-all duration-500 text-center">
                            <p className="text-[9px] font-black uppercase tracking-widest mb-2 opacity-50">Load_Status</p>
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                  Verified Achievement
                                </p>
                                <p className="text-[10px] opacity-60 font-mono tracking-tight">CRC: 0x{Math.floor(Math.random() * 16777215).toString(16).toUpperCase()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Central Pillar Node */}
                    <div className="relative flex flex-col items-center justify-center z-20">
                      <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white border-8 border-[#fbf9f4] shadow-2xl flex items-center justify-center transition-transform duration-700 group-hover:scale-110 relative">
                        <div className="absolute inset-0 rounded-full border border-[#7c6837]/30 animate-spin-slow"></div>
                        <div className="w-full h-full rounded-full bg-[#433929] flex items-center justify-center text-white font-black text-2xl md:text-3xl">
                          0{USER_DATA.education.length - i}
                        </div>
                      </div>
                      {/* Sub-node metadata */}
                      <div className="absolute top-full mt-4 bg-white px-4 py-1.5 rounded-full border border-slate-100 shadow-sm opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 whitespace-nowrap hidden md:block">
                        <p className="text-[8px] font-black uppercase tracking-widest text-[#7c6837]">Knowledge_Block_Active</p>
                      </div>
                    </div>

                    {/* Empty Space for ZigZag */}
                    <div className="hidden md:block w-[48%]"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-48 bg-[#fbf9f4] relative overflow-hidden scroll-mt-20">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none tech-grid"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="reveal max-w-6xl mx-auto">
              <div className="text-center mb-24">
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-white rounded-full border border-slate-200 shadow-sm mb-8">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Secure Transmission Port Open</span>
                </div>
                <h2 className="text-6xl md:text-[8rem] font-black mb-8 leading-[0.8] text-[#433929] tracking-tighter">
                  Scale with <br/> 
                  <span className="relative">
                    Absolute <span className="text-[#7c6837] italic decoration-4 underline-offset-[12px] underline">Certainty.</span>
                  </span>
                </h2>
              </div>
              <div className="grid lg:grid-cols-3 gap-8 items-stretch perspective-1000">
                <a href={`mailto:${USER_DATA.email}`} className="group relative bg-[#433929] rounded-[4rem] p-10 overflow-hidden flex flex-col justify-between transition-all duration-700 hover:scale-[1.02] hover:shadow-4xl shadow-3xl">
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-[1.2rem] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-[#7c6837] mb-8 group-hover:bg-[#7c6837] group-hover:text-white transition-all duration-500">
                      <ICONS.Mail />
                    </div>
                    <p className="font-mono text-[8px] text-[#7c6837] uppercase tracking-[0.5em] mb-4">Channel_01: SMTP</p>
                    <h3 className="text-2xl font-black text-white tracking-tighter mb-6 group-hover:translate-x-2 transition-transform duration-500">Secure Channel</h3>
                  </div>
                  <div className="relative z-10 flex items-center justify-between mt-auto pt-4">
                    <span className="text-white/40 font-mono text-[10px] truncate max-w-[120px]">{USER_DATA.email}</span>
                    <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-white font-black text-[8px] uppercase tracking-widest group-hover:bg-[#7c6837] transition-all">Transmit</div>
                  </div>
                </a>
                <button onClick={handleDownloadResume} className="group relative bg-white border-2 border-[#7c6837]/20 rounded-[4rem] p-10 overflow-hidden flex flex-col justify-between transition-all duration-700 hover:border-[#7c6837] hover:scale-[1.05] hover:shadow-4xl shadow-xl cursor-pointer">
                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto rounded-full bg-[#fbf9f4] border border-[#7c6837]/10 flex items-center justify-center text-[#7c6837] mb-8 group-hover:bg-[#433929] group-hover:text-white transition-all duration-500 shadow-inner">
                        <ICONS.Download />
                    </div>
                    <div className="text-center">
                        <p className="font-mono text-[8px] text-slate-400 uppercase tracking-[0.5em] mb-2">Primary_Asset: RESUME_PDF</p>
                        <h3 className="text-3xl font-black text-[#433929] tracking-tighter mb-2">Professional CV</h3>
                        <p className="text-[9px] font-black text-[#7c6837] uppercase tracking-widest opacity-60">High-Res PDF • Managed Metadata</p>
                    </div>
                  </div>
                  <div className="relative z-10 flex items-center justify-center mt-auto pt-8">
                    <div className="w-full py-4 bg-[#433929] rounded-2xl text-white font-black text-[9px] uppercase tracking-[0.4em] group-hover:bg-[#7c6837] transition-all flex items-center justify-center gap-3">
                       Download PDF
                    </div>
                  </div>
                </button>
                <a href="tel:+919944012688" className="group relative bg-white border border-slate-200 rounded-[4rem] p-10 overflow-hidden flex flex-col justify-between transition-all duration-700 hover:scale-[1.02] hover:shadow-4xl shadow-2xl">
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-[1.2rem] bg-[#fbf9f4] border border-slate-100 flex items-center justify-center text-[#433929] mb-8 group-hover:bg-[#433929] group-hover:text-white transition-all duration-500">
                      <ICONS.Bot />
                    </div>
                    <p className="font-mono text-[8px] text-slate-400 uppercase tracking-[0.5em] mb-4">Channel_02: VOIP</p>
                    <h3 className="text-2xl font-black text-[#433929] tracking-tighter mb-6 group-hover:translate-x-2 transition-transform duration-500">Direct Line</h3>
                  </div>
                  <div className="relative z-10 flex items-center justify-between mt-auto">
                    <span className="text-slate-400 font-mono text-[10px]">+91 9944012688</span>
                    <div className="px-4 py-2 bg-slate-50 rounded-full border border-slate-100 text-[#433929] font-black text-[8px] uppercase tracking-widest group-hover:bg-[#433929] group-hover:text-white transition-all">Uplink</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-24 bg-white text-slate-400 border-t border-slate-50">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row justify-between items-center gap-20">
          <div className="flex items-center gap-10">
             <CompassLogo className="w-24 h-24 grayscale opacity-30" />
             <div className="flex flex-col">
                <p className="text-[18px] font-black uppercase tracking-[0.5em] text-[#433929]">VISHNUNATH</p>
                <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#7c6837] mt-2">ARCHITECT • SPECIALIST • LEADER</p>
             </div>
          </div>
          <div className="flex flex-wrap justify-center gap-16 text-[11px] font-black uppercase tracking-[0.5em]">
            {['about', 'expertise', 'experience', 'education'].map(id => (<a key={id} href={`#${id}`} onClick={(e) => scrollToSection(e, id)} className="hover:text-[#7c6837] transition-all">{id}</a>))}
          </div>
          <div className="flex gap-8">
             <a href={USER_DATA.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-[2rem] border border-slate-100 flex items-center justify-center hover:bg-[#433929] hover:text-white transition-all shadow-md"><ICONS.Linkedin /></a>
          </div>
        </div>
      </footer>

      <ChatWidget />
      
      <style dangerouslySetInnerHTML={{ __html: `
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
      `}} />
    </div>
  );
};

export default App;