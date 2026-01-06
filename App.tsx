
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { USER_DATA, ICONS } from './constants';
import { Skill } from './types';

// Lazy load ChatWidget to speed up initial paint
const ChatWidget = lazy(() => import('./components/ChatWidget'));

const TechBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Background Mesh Overlay */}
      <div className="absolute inset-0 tech-grid opacity-[0.03]"></div>

      {/* --- INFRASTRUCTURE LAYER --- */}
      {/* Server Rack - The Foundation */}
      <div className="absolute top-[12%] left-[4%] w-40 h-40 animate-float-slow opacity-[0.12]">
        <svg viewBox="0 0 24 24" fill="none" stroke="#7c6837" strokeWidth="1.2">
          <rect x="4" y="2" width="16" height="20" rx="2" fill="#7c6837" fillOpacity="0.05"/>
          <path d="M4 7h16M4 12h16M4 17h16"/>
          <circle cx="7" cy="4.5" r="0.6" fill="#7c6837"/>
          <circle cx="7" cy="9.5" r="0.6" fill="#7c6837"/>
          <circle cx="7" cy="14.5" r="0.6" fill="#7c6837"/>
          <circle cx="7" cy="19.5" r="0.6" fill="#7c6837"/>
          <rect x="15" y="4" width="2" height="1" rx="0.5" fill="#22c55e" fillOpacity="0.5" className="animate-pulse"/>
        </svg>
      </div>

      {/* Cloud Node - Hybrid Integration */}
      <div className="absolute top-[38%] right-[8%] w-48 h-48 animate-drift-horizontal opacity-[0.08]">
        <svg viewBox="0 0 24 24" fill="none" stroke="#433929" strokeWidth="1">
          <path d="M17.5 19c3.037 0 5.5-2.463 5.5-5.5 0-2.73-1.995-4.996-4.604-5.419C17.848 4.636 14.73 2 11 2 7.73 2 4.976 4.053 3.931 6.942 1.706 7.646 0 9.684 0 12c0 2.761 2.239 5 5 5h2" fill="#433929" fillOpacity="0.03"/>
          <path d="M12 12v7m0 0l-3-3m3 3l3-3" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="2 2" />
        </svg>
      </div>

      {/* --- SECURITY & NETWORKING LAYER --- */}
      {/* Firewall Shield - Security Specialist */}
      <div className="absolute top-[65%] left-[6%] w-32 h-32 animate-pulse-slow opacity-[0.1]">
        <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#ef4444" fillOpacity="0.05"/>
          <path d="M12 8v4M12 16h.01" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Router / Switch - Data Flow */}
      <div className="absolute bottom-[15%] right-[25%] w-36 h-36 animate-float opacity-[0.1]">
        <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.2">
          <rect x="2" y="7" width="20" height="10" rx="2" fill="#3b82f6" fillOpacity="0.03"/>
          <circle cx="6" cy="12" r="1" fill="#3b82f6"/>
          <circle cx="10" cy="12" r="1" fill="#3b82f6"/>
          <circle cx="14" cy="12" r="1" fill="#3b82f6"/>
          <circle cx="18" cy="12" r="1" fill="#22c55e" className="animate-pulse"/>
          <path d="M4 17l-2 4M20 17l2 4" />
        </svg>
      </div>

      {/* --- COMPUTING & DATA LAYER --- */}
      {/* CPU / Microchip - Processing Power */}
      <div className="absolute top-[15%] right-[35%] w-28 h-28 animate-spin-very-slow opacity-[0.12]">
        <svg viewBox="0 0 24 24" fill="none" stroke="#7c6837" strokeWidth="1">
          <rect x="4" y="4" width="16" height="16" rx="2" fill="#7c6837" fillOpacity="0.05"/>
          <rect x="9" y="9" width="6" height="6" rx="1" stroke="#433929"/>
          <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" stroke="#433929"/>
        </svg>
      </div>

      {/* Database Cylinder - Storage Expert */}
      <div className="absolute bottom-[28%] left-[30%] w-24 h-24 animate-drift-vertical opacity-[0.1]">
        <svg viewBox="0 0 24 24" fill="none" stroke="#7c6837" strokeWidth="1.2">
          <ellipse cx="12" cy="5" rx="9" ry="3" fill="#7c6837" fillOpacity="0.05"/>
          <path d="M3 5v14c0 1.657 4.03 3 9 3s9-1.343 9-3V5" />
          <path d="M3 12c0 1.657 4.03 3 9 3s9-1.343 9-3" strokeDasharray="3 3"/>
        </svg>
      </div>

      {/* --- INTERFACE LAYER --- */}
      {/* Remote Support Laptop - User Management */}
      <div className="absolute top-[55%] right-[20%] w-32 h-32 animate-float-slow opacity-[0.08]">
        <svg viewBox="0 0 24 24" fill="none" stroke="#433929" strokeWidth="1.2">
          <rect x="2" y="4" width="20" height="12" rx="2" fill="#433929" fillOpacity="0.03"/>
          <path d="M2 16h20l2 4H0l2-4z" />
          <circle cx="12" cy="10" r="2" stroke="#7c6837" strokeWidth="1" />
          <path d="M10 14h4" stroke="#7c6837" strokeWidth="1"/>
        </svg>
      </div>

      {/* Network Globe - Global Scale */}
      <div className="absolute top-[75%] left-[45%] w-40 h-40 animate-pulse-slow opacity-[0.06]">
        <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="0.8">
          <circle cx="12" cy="12" r="10" fill="#3b82f6" fillOpacity="0.02"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      </div>

      {/* --- DECORATIVE DATA PARTICLES --- */}
      <div className="absolute top-[20%] left-[20%] w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-ping opacity-20"></div>
      <div className="absolute top-[80%] right-[40%] w-2 h-2 bg-[#3b82f6] rounded-full animate-ping opacity-20" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute bottom-[45%] left-[15%] w-1 h-1 bg-[#ef4444] rounded-full animate-ping opacity-15" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-[10%] left-[50%] w-2 h-2 bg-[#7c6837] rounded-full animate-ping opacity-10" style={{ animationDelay: '4.5s' }}></div>

      {/* "Live Data" Connection Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
        <path d="M 50 100 Q 150 150 200 100" stroke="#7c6837" fill="none" strokeWidth="0.5" strokeDasharray="4 4" className="animate-radar-sweep"/>
        <path d="M 800 300 Q 700 400 900 500" stroke="#3b82f6" fill="none" strokeWidth="0.5" strokeDasharray="4 4" className="animate-radar-sweep"/>
      </svg>
    </div>
  );
};

const CompassLogo = ({ className = "", color = "#7c6837" }: { className?: string, color?: string }) => (
  <div className={`relative ${className} group select-none`}>
    <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-md transition-transform duration-1000">
      <circle cx="200" cy="200" r="185" fill="none" stroke={color} strokeWidth="1" strokeDasharray="1 10.15" opacity="0.3" className="animate-spin-slow" />
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
      <line x1="200" y1="200" x2="200" y2="40" stroke={color} strokeWidth="2" opacity="0.2" className="animate-radar-sweep origin-center" />
    </svg>
  </div>
);

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    }, { rootMargin: '-10% 0px -60% 0px', threshold: 0 });

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

    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
      sectionObserver.disconnect();
      revealObserver.disconnect();
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 70;
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

  const handleDownloadResume = async () => {
    try {
      const { jsPDF } = await import('jspdf');
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
      doc.text(`${USER_DATA.email} | ${USER_DATA.phoneNumber}`, margin, y);
      y += 10;
      doc.line(margin, y, 190, y);
      y += 15;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Experience", margin, y);
      y += 10;
      USER_DATA.experience.forEach(exp => {
        doc.setFontSize(11);
        doc.text(`${exp.role} @ ${exp.company}`, margin, y);
        y += 6;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(exp.description, 170);
        doc.text(lines, margin, y);
        y += (lines.length * 5) + 10;
      });
      doc.save('Vishnunath_CV.pdf');
    } catch (err) { alert("Failed to generate PDF."); }
  };

  return (
    <div className="min-h-screen selection:bg-[#7c6837] selection:text-white relative bg-[#fbf9f4]">
      {/* Dynamic Background */}
      <TechBackground />

      {/* Skill Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 animate-in fade-in duration-300 backdrop-blur-md bg-black/50" onClick={() => setSelectedSkill(null)}>
          <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-4xl overflow-hidden animate-in zoom-in-95 duration-300 relative flex flex-col md:flex-row max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedSkill(null)} className="absolute top-4 right-4 z-20 w-10 h-10 bg-[#fbf9f4] hover:bg-[#433929] hover:text-white rounded-full flex items-center justify-center shadow-md transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <div className="w-full md:w-1/3 bg-[#433929] p-8 flex flex-col items-center justify-center text-white">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-[#7c6837] mb-4">
                {getSkillIcon(selectedSkill.name)}
              </div>
              <p className="font-black text-xl">0x{selectedSkill.level}</p>
            </div>
            <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-center bg-white overflow-y-auto">
              <span className="text-[#7c6837] font-black text-[10px] uppercase tracking-widest mb-2">{selectedSkill.category}</span>
              <h3 className="text-3xl font-black text-[#433929] uppercase mb-4 leading-tight">{selectedSkill.name}</h3>
              <p className="text-slate-600 font-medium leading-relaxed italic">{selectedSkill.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled || isMobileMenuOpen ? 'glass shadow-lg py-2' : 'bg-transparent py-4 md:py-8'}`}>
        <div className="absolute top-0 left-0 h-[3px] bg-gradient-to-r from-[#7c6837] to-[#433929] transition-all duration-200" style={{ width: `${scrollProgress}%` }} />
        <div className="container mx-auto px-4 flex justify-between items-center relative z-10">
          <a href="#home" onClick={(e) => scrollToSection(e, 'home')} className="flex items-center gap-3 group">
            <CompassLogo className="w-10 h-10 md:w-12 md:h-12" />
            <span className="font-black text-[#433929] text-base md:text-lg tracking-tighter uppercase group-hover:text-[#7c6837] transition-colors">VISHNUNATH</span>
          </a>

          <div className="hidden lg:flex items-center gap-2">
            {['about', 'expertise', 'experience', 'education'].map((id) => (
              <a key={id} href={`#${id}`} onClick={(e) => scrollToSection(e, id)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeSection === id ? 'bg-[#433929] text-white' : 'text-slate-500 hover:text-[#433929]'}`}>
                {id}
              </a>
            ))}
            <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="ml-4 px-6 py-2 bg-[#433929] text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#7c6837] transition-all">Contact</a>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-[#433929]">
            {isMobileMenuOpen ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-[#fbf9f4] border-t border-slate-100 p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300 shadow-2xl z-50">
            {['about', 'expertise', 'experience', 'education', 'contact'].map(id => (
              <a key={id} href={`#${id}`} onClick={(e) => scrollToSection(e, id)} className={`w-full p-4 rounded-xl text-sm font-black uppercase tracking-widest border transition-all ${activeSection === id ? 'bg-[#433929] text-white' : 'bg-white text-slate-600'}`}>
                {id}
              </a>
            ))}
          </div>
        )}
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex flex-col justify-center items-center px-4 pt-20 text-center relative">
          <div className="reveal">
            <CompassLogo className="w-40 h-40 md:w-56 md:h-56 mx-auto mb-8 animate-float" />
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-[#433929] mb-6 leading-tight tracking-tighter max-w-4xl mx-auto">
              Infrastructure at <span className="text-[#7c6837] italic">Enterprise</span> Scale.
            </h1>
            <p className="text-base sm:text-xl text-slate-500 mb-10 max-w-2xl mx-auto font-medium">
              IT Specialist overseeing <span className="font-black text-[#433929]">16,000 servers</span> with modern virtualization and proactive resilience protocols.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="px-10 py-4 bg-[#433929] text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#7c6837] transition-all shadow-xl">Explore Profile</a>
              <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="px-10 py-4 bg-white border border-slate-200 text-[#433929] rounded-xl font-black uppercase tracking-widest text-xs hover:border-[#7c6837] transition-all">Get In Touch</a>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 md:py-32 bg-transparent px-4 border-y border-slate-100 relative">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="reveal">
                <h2 className="text-4xl md:text-6xl font-black text-[#433929] mb-8 leading-none tracking-tighter">
                  Absolute <br/> <span className="text-[#7c6837] italic">Stability.</span>
                </h2>
                <div className="space-y-6 text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                  <p>I operate at the core of enterprise technology, managing over <span className="text-[#433929] font-bold">16,000 nodes</span> in a hybrid-cloud environment.</p>
                  <p>With 8+ years of deep technical immersion, I specialize in Windows Server lifecycles, VMWare vCenter, and Hyper-V orchestration at massive scale.</p>
                  <p>My methodology focuses on <span className="text-[#7c6837] font-bold italic">zero-downtime architecture</span> and automated incident resolution.</p>
                </div>
              </div>
              <div className="reveal grid grid-cols-2 gap-4">
                {[
                  { label: "Years Exp", val: "8+" },
                  { label: "Active Nodes", val: "16K" },
                  { label: "SLA Uptime", val: "99.9%" },
                  { label: "Response", val: "24/7" }
                ].map((s, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center hover:shadow-lg transition-all">
                    <p className="text-3xl font-black text-[#433929] mb-1">{s.val}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Expertise Section */}
        <section id="expertise" className="py-20 md:py-32 bg-white/40 backdrop-blur-sm px-4 relative">
          <div className="container mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#433929] mb-4 uppercase tracking-tighter">Technical Arsenal</h2>
            <p className="text-slate-500 font-medium">Modular components of my infrastructure core.</p>
          </div>
          <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {USER_DATA.skills.map((skill, i) => (
              <div key={i} onClick={() => setSelectedSkill(skill)} className="reveal group p-8 bg-[#fbf9f4] border border-slate-100 rounded-3xl hover:bg-[#433929] hover:text-white transition-all cursor-pointer shadow-sm hover:shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-white/50 flex items-center justify-center text-[#7c6837] mb-6 group-hover:bg-white group-hover:scale-110 transition-all">
                  {getSkillIcon(skill.name)}
                </div>
                <h3 className="font-black text-xl mb-2 uppercase tracking-tight leading-tight">{skill.name}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Level: {skill.level}%</p>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-20 md:py-32 bg-transparent px-4 relative">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl md:text-6xl font-black text-[#433929] mb-16 text-center uppercase tracking-tighter">Roadmap</h2>
            <div className="space-y-12">
              {USER_DATA.experience.map((exp, i) => (
                <div key={i} className="reveal flex gap-6 md:gap-10">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#433929] rounded-xl flex items-center justify-center text-white font-black text-xs">
                      {USER_DATA.experience.length - i}
                    </div>
                    <div className="w-px h-full bg-slate-200 mt-4"></div>
                  </div>
                  <div className="pb-12 w-full">
                    <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                      <span className="text-[#7c6837] font-black text-[10px] uppercase tracking-widest">{exp.period}</span>
                      <h3 className="text-2xl md:text-3xl font-black text-[#433929] mt-2 leading-tight uppercase">{exp.role}</h3>
                      <p className="text-lg font-bold text-[#7c6837] mb-4 italic">{exp.company}</p>
                      <p className="text-slate-600 font-medium leading-relaxed">{exp.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="py-20 md:py-32 bg-white/40 backdrop-blur-sm px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black text-[#433929] uppercase tracking-tighter">Academic Pillars</h2>
              <p className="text-slate-500 font-medium mt-2">Foundational knowledge and core system specializations.</p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {USER_DATA.education.map((edu, i) => (
                <div key={i} className="reveal flex flex-col group bg-[#fbf9f4] border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all h-full">
                  <div className="p-8 md:p-10 bg-gradient-to-br from-[#433929] to-[#7c6837] text-white">
                    <div className="flex justify-between items-center mb-6">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                      </div>
                      <span className="text-3xl font-black opacity-30">{edu.year}</span>
                    </div>
                    <h3 className="text-2xl font-black uppercase leading-tight">{edu.degree}</h3>
                  </div>
                  
                  <div className="p-8 md:p-10 flex flex-col flex-1 bg-white">
                    <p className="text-[#7c6837] font-black uppercase text-[10px] tracking-widest mb-2">Institution</p>
                    <p className="text-slate-800 font-bold mb-8 text-lg leading-tight">{edu.institution}</p>
                    
                    <div className="mt-auto space-y-6">
                      <div className="flex justify-between items-end border-b border-slate-50 pb-4">
                        <span className="text-slate-400 font-black text-[9px] uppercase tracking-widest">Graduation Score</span>
                        <span className="text-xl font-black text-[#433929]">{edu.percentage}</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                         <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Credential Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 md:py-32 bg-transparent px-4 border-t border-slate-100 relative">
          <div className="container mx-auto max-w-5xl text-center">
            <div className="reveal">
              <h2 className="text-4xl md:text-7xl font-black text-[#433929] mb-10 leading-tight uppercase tracking-tighter">
                Scale with <br/> <span className="text-[#7c6837] italic">Certainty.</span>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
                <a href={`mailto:${USER_DATA.email}`} className="group p-10 bg-[#433929] rounded-3xl text-white text-left transition-all hover:scale-[1.02] shadow-2xl">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                    <ICONS.Mail />
                  </div>
                  <p className="font-mono text-[9px] text-[#7c6837] uppercase tracking-widest mb-2">Secure Channel</p>
                  <h3 className="text-2xl font-black uppercase mb-4">Email Transmission</h3>
                  <p className="text-white/60 text-sm font-mono truncate">{USER_DATA.email}</p>
                </a>

                <a href={USER_DATA.whatsappUrl} target="_blank" rel="noopener noreferrer" className="group p-10 bg-green-500 rounded-3xl text-white text-left transition-all hover:scale-[1.02] shadow-2xl">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                    <ICONS.WhatsApp />
                  </div>
                  <p className="font-mono text-[9px] text-white/60 uppercase tracking-widest mb-2">Real-time Connect</p>
                  <h3 className="text-2xl font-black uppercase mb-4">WhatsApp Direct</h3>
                  <p className="text-white text-sm font-bold mt-2">{USER_DATA.phoneNumber}</p>
                </a>

                <button onClick={handleDownloadResume} className="group p-10 bg-white border border-slate-200 rounded-3xl text-left transition-all hover:border-[#7c6837] hover:scale-[1.02] shadow-sm">
                  <div className="w-12 h-12 bg-[#433929] text-white rounded-xl flex items-center justify-center mb-6">
                    <ICONS.Download />
                  </div>
                  <p className="font-mono text-[9px] text-slate-400 uppercase tracking-widest mb-2">Professional Asset</p>
                  <h3 className="text-2xl font-black text-[#433929] uppercase mb-4">Download Resume</h3>
                  <p className="text-slate-500 text-sm font-medium">Synthesize high-fidelity PDF</p>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 bg-white/80 border-t border-slate-100 text-center px-4 relative z-10">
        <div className="container mx-auto flex flex-col items-center gap-6">
          <CompassLogo className="w-12 h-12 grayscale opacity-40" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">© {new Date().getFullYear()} M. Vishnunath • Infrastructure Specialist</p>
          <div className="flex gap-4">
             <a href={USER_DATA.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-slate-100 rounded-xl hover:bg-[#433929] hover:text-white transition-all hover-scale-pulse"><ICONS.Linkedin /></a>
             <a href={USER_DATA.whatsappUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-slate-100 rounded-xl hover:bg-green-500 hover:text-white transition-all"><ICONS.WhatsApp /></a>
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className={`fixed bottom-24 right-6 p-4 bg-white border border-slate-200 rounded-2xl shadow-xl z-40 transition-all ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m18 15-6-6-6 6"/></svg>
      </button>

      <Suspense fallback={null}><ChatWidget /></Suspense>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float 10s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        
        @keyframes driftHorizontal { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(30px); } }
        .animate-drift-horizontal { animation: driftHorizontal 12s ease-in-out infinite; }
        
        @keyframes driftVertical { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(40px); } }
        .animate-drift-vertical { animation: driftVertical 15s ease-in-out infinite; }

        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
        .animate-spin-very-slow { animation: spin-slow 25s linear infinite; }
        
        @keyframes radar-sweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-radar-sweep { animation: radar-sweep 4s linear infinite; }
        
        @keyframes pulse-slow { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.2; transform: scale(1.05); } }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
      `}} />
    </div>
  );
};

export default App;
