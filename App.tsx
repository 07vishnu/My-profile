
import React, { useState, useEffect, Suspense, lazy, useCallback, memo } from 'react';
import { jsPDF } from 'jspdf';
import { USER_DATA, ICONS } from './constants';
import { Skill } from './types';
import { getLatestNewsText, NewsArticle } from './services/geminiService';

const ChatWidget = lazy(() => import('./components/ChatWidget'));
const ComicBackground = lazy(() => import('./components/ComicBackground'));

const GoogleLoader = () => (
  <div className="flex flex-col gap-4 justify-center items-center py-20" role="status" aria-label="Loading latest news">
    <div className="flex gap-1">
      <div className="w-3 h-3 rounded-full bg-[#4285F4] animate-bounce"></div>
      <div className="w-3 h-3 rounded-full bg-[#EA4335] animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-3 h-3 rounded-full bg-[#FBBC05] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-3 h-3 rounded-full bg-[#34A853] animate-bounce" style={{ animationDelay: '0.3s' }}></div>
    </div>
    <p className="text-xs font-medium text-[#5f6368] animate-pulse">Syncing with Tech Intelligence...</p>
  </div>
);

const BrandLogo = memo(({ className = "" }: { className?: string }) => (
  <div className={`relative ${className} select-none group`}>
    <svg viewBox="0 0 512 512" className="w-full h-full drop-shadow-sm transition-all duration-500 group-hover:scale-105 group-hover:animate-[logo-pulse_3s_ease-in-out_infinite]" aria-hidden="true">
      {/* Outer Ring */}
      <circle cx="256" cy="256" r="230" fill="none" stroke="#dadce0" strokeWidth="4" />
      <circle cx="256" cy="256" r="215" fill="none" stroke="#f1f3f4" strokeWidth="2" />
      
      {/* Compass Arcs (Google Colors) */}
      <path d="M256 26 A 230 230 0 0 1 486 256" fill="none" stroke="#4285F4" strokeWidth="8" strokeLinecap="round" />
      <path d="M486 256 A 230 230 0 0 1 256 486" fill="none" stroke="#34A853" strokeWidth="8" strokeLinecap="round" />
      <path d="M256 486 A 230 230 0 0 1 26 256" fill="none" stroke="#FBBC05" strokeWidth="8" strokeLinecap="round" />
      <path d="M26 256 A 230 230 0 0 1 256 26" fill="none" stroke="#EA4335" strokeWidth="8" strokeLinecap="round" />

      {/* Radar Sweep Effect (The Deployment Present) */}
      <circle cx="256" cy="256" r="230" fill="none" stroke="#1a73e8" strokeWidth="2" className="animate-[radar-ping_10s_linear_infinite] opacity-0" />

      {/* Cardinal Points */}
      <path d="M256 10 L276 50 L236 50 Z" fill="#EA4335" />
      <path d="M256 502 L236 462 L276 462 Z" fill="#34A853" />
      <path d="M502 256 L462 236 L462 276 Z" fill="#4285F4" />
      <path d="M10 256 L50 276 L50 236 Z" fill="#FBBC05" />

      {/* Central Path and Man Silhouette */}
      <path d="M256 180 L140 420 L372 420 Z" fill="#1a73e8" fillOpacity="0.05" />
      
      <g fill="#5f6368" className="transition-colors group-hover:fill-[#1a73e8]">
        <circle cx="256" cy="145" r="24" />
        <path d="M280 175h-48c-8 0-15 7-15 15v90c0 5 4 10 10 10s10-5 10-10v-65h5v190c0 8 7 15 15 15s15-7 15-15v-110h5v110c0 8 7 15 15 15s15-7 15-15V190c0-8-7-15-15-15z" />
      </g>

      <rect x="106" y="280" width="300" height="70" fill="white" rx="12" className="shadow-sm" />
      <rect x="106" y="280" width="300" height="70" fill="none" stroke="#dadce0" strokeWidth="2" rx="12" />
      
      <text x="256" y="328" textAnchor="middle" className="font-bold text-[44px] tracking-tight" fill="#202124">VISHNUNATH</text>
    </svg>
    <style>{`
      @keyframes logo-pulse {
        0%, 100% { transform: scale(1.05); }
        50% { transform: scale(1.08); }
      }
      @keyframes radar-ping {
        0% { transform: scale(0.8); opacity: 0; }
        50% { opacity: 0.3; }
        100% { transform: scale(1.4); opacity: 0; }
      }
    `}</style>
  </div>
));

const Navbar = memo(({ activeSection, scrollToSection, isNewsMode, setIsNewsMode }: any) => (
  <nav className="fixed top-0 w-full z-[120] header-glass" aria-label="Main Navigation">
    {/* Live Status Ticker */}
    <div className="bg-[#202124] text-white py-1 px-6 overflow-hidden hidden md:block">
      <div className="flex items-center gap-8 animate-[ticker_30s_linear_infinite] whitespace-nowrap text-[9px] font-mono tracking-widest uppercase">
        <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#34a853]"></span> System Health: Nominal</span>
        <span>Node Cluster: 16,000 Connected</span>
        <span>Uptime: 99.992%</span>
        <span>Latency: 12ms</span>
        <span className="text-[#FBBC05]">Security Protocol: Active</span>
        <span>VMware Cluster: Synchronized</span>
        <span>HCLTech Infrastructure Bridge: Stable</span>
        {/* Repeated for seamless loop */}
        <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#34a853]"></span> System Health: Nominal</span>
        <span>Node Cluster: 16,000 Connected</span>
        <span>Uptime: 99.992%</span>
      </div>
    </div>
    
    <div className="container mx-auto px-6 flex justify-between items-center py-3">
      <button 
        onClick={() => { setIsNewsMode(false); window.scrollTo({top:0, behavior:'smooth'}); }} 
        className="flex items-center gap-4 group"
        aria-label="Scroll to top"
      >
        <BrandLogo className="w-10 h-10" />
        <div className="flex flex-col text-left">
          <span className="font-semibold text-[#202124] text-base leading-none">Vishnunath</span>
          <span className="text-[9px] font-medium text-[#5f6368] uppercase tracking-wider mt-0.5">Systems Core</span>
        </div>
      </button>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center mr-6">
          {['about', 'expertise', 'experience'].map((id) => (
            <a 
              key={id} 
              href={`#${id}`} 
              onClick={(e) => scrollToSection(e, id)} 
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === id && !isNewsMode ? 'text-[#1a73e8] bg-[#e8f0fe]' : 'text-[#5f6368] hover:bg-[#f1f3f4]'}`}
              aria-current={activeSection === id && !isNewsMode ? 'page' : undefined}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </div>
        <button 
          onClick={() => setIsNewsMode(true)} 
          className={`px-5 py-2 btn-google text-sm flex items-center gap-2 ${isNewsMode ? 'bg-[#1a73e8] text-white shadow-md' : 'text-[#5f6368] hover:bg-[#f1f3f4]'}`}
          aria-pressed={isNewsMode}
        >
          <ICONS.News /> <span className="hidden sm:inline">News Radar</span>
        </button>
        <a 
          href="#contact" 
          onClick={(e) => scrollToSection(e, 'contact')} 
          className="ml-2 px-6 py-2 btn-google btn-google-primary text-sm shadow-md"
        >
          Contact
        </a>
      </div>
    </div>
    <style>{`
      @keyframes ticker {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `}</style>
  </nav>
));

const SkillCard = memo(({ skill, onClick, icon }: any) => (
  <button 
    onClick={onClick} 
    aria-label={`View details for ${skill.name} proficiency`}
    className="google-card p-6 cursor-pointer flex items-start gap-4 transition-all duration-300 group hover:scale-[1.03] hover:shadow-2xl hover:border-black hover:border-2 text-left w-full"
  >
    <div className="w-12 h-12 rounded-lg bg-[#f8f9fa] flex items-center justify-center text-[#5f6368] group-hover:text-[#1a73e8] transition-colors" aria-hidden="true">
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="font-semibold text-[#202124] text-base mb-1">{skill.name}</h3>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1 bg-[#e8eaed] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#1a73e8] transition-all duration-1000" 
            style={{ width: `${skill.level}%` }}
            role="progressbar"
            aria-valuenow={skill.level}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${skill.name} skill level`}
          ></div>
        </div>
        <span className="text-[10px] font-medium text-[#5f6368]">{skill.level}%</span>
      </div>
    </div>
  </button>
));

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isNewsMode, setIsNewsMode] = useState(false);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);

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
    doc.setFontSize(9);
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
      doc.setTextColor(95, 99, 104);
      doc.text(`${exp.company} | ${exp.period}`, 20, y + 5);
      doc.setTextColor(32, 33, 36);
      const lines = doc.splitTextToSize(exp.description, 170);
      doc.text(lines, 20, y + 10);
      y += (lines.length * 5) + 15;
    });
    doc.save(`Resume_Vishnunath.pdf`);
  }, []);

  const loadLatestNews = useCallback(async (forceRefresh = false) => {
    setIsNewsLoading(true);
    setNewsError(null);
    try {
      const result = await getLatestNewsText(forceRefresh);
      if (result.articles.length === 0 && forceRefresh) {
        throw new Error("No news articles found.");
      }
      setNews(result.articles);
    } catch (e) {
      console.error(e);
      setNewsError("Failed to fetch latest tech news. Please try again later.");
    } finally {
      setIsNewsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLatestNews();
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find(e => e.isIntersecting);
      if (visible) setActiveSection(visible.target.id);
    }, { threshold: 0.5 });
    ['home', 'about', 'expertise', 'experience', 'contact'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [loadLatestNews]);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setIsNewsMode(false);
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
    }
  };

  const getSkillIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('windows')) return <ICONS.Windows />;
    if (n.includes('vmware')) return <ICONS.VMware />;
    if (n.includes('network')) return <ICONS.Network />;
    return <ICONS.Bot />;
  };

  return (
    <div className="min-h-screen relative">
      <Suspense fallback={null}>
        <ComicBackground />
      </Suspense>

      <Navbar 
        activeSection={activeSection} 
        scrollToSection={scrollToSection} 
        isNewsMode={isNewsMode} 
        setIsNewsMode={setIsNewsMode} 
      />

      <main className="pt-32 pb-20 relative z-10">
        {isNewsMode ? (
          <div className="container mx-auto px-6 max-w-5xl animate-in fade-in duration-500">
            <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h2 className="text-3xl font-semibold text-[#202124] mb-2">Tech Radar</h2>
                <p className="text-[#5f6368] text-sm">Latest industry updates curated by AI Intelligence cluster.</p>
              </div>
              <button 
                onClick={() => loadLatestNews(true)}
                disabled={isNewsLoading}
                aria-label="Refresh news feed"
                className="px-6 py-2.5 btn-google border-2 border-[#dadce0] text-[#1a73e8] bg-white hover:bg-[#f8f9fa] text-sm hover:border-black transition-all flex items-center gap-2 group disabled:opacity-70"
              >
                <div className={isNewsLoading ? "animate-spin" : "group-hover:rotate-12 transition-transform"} aria-hidden="true">
                  <ICONS.Bot />
                </div>
                {isNewsLoading ? 'Scanning Infrastructure...' : 'Check Today\'s News'}
              </button>
            </div>
            
            {isNewsLoading ? <GoogleLoader /> : newsError ? (
              <div className="bg-[#fce8e6] border border-[#ea4335] rounded-2xl p-10 text-center flex flex-col items-center gap-4 animate-in slide-in-from-top-4" role="alert">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#ea4335] shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <div className="max-w-md">
                  <p className="text-lg font-semibold text-[#d93025] mb-2">{newsError}</p>
                  <p className="text-sm text-[#5f6368]">Our uplink to the tech news cluster is currently experiencing latency. Check your connection or retry the handshake.</p>
                </div>
                <button onClick={() => loadLatestNews(true)} className="mt-4 px-8 py-3 btn-google btn-google-primary text-sm shadow-md flex items-center gap-2">Retry Uplink</button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((article) => (
                  <article key={article.id} className="google-card p-6 flex flex-col h-full group bg-white/80 backdrop-blur-sm">
                    <span className="text-[10px] font-bold text-[#1a73e8] uppercase tracking-wider mb-2">{article.publishedAt}</span>
                    <h3 className="text-lg font-semibold text-[#202124] mb-3 leading-snug group-hover:text-[#1a73e8] transition-colors">{article.title}</h3>
                    <p className="text-[#5f6368] text-sm leading-relaxed mb-6 line-clamp-3">{article.summary}</p>
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="mt-auto text-sm font-medium text-[#1a73e8] hover:underline flex items-center gap-1">
                      Explore Coverage <ICONS.ExternalLink aria-hidden="true" />
                    </a>
                  </article>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <section id="home" className="container mx-auto px-6 py-20 lg:py-40 flex flex-col items-center text-center relative overflow-visible">
              <div className="mb-12 relative animate-in zoom-in duration-700">
                <BrandLogo className="w-32 h-32 md:w-48 md:h-48" />
                <div className="absolute -top-10 -right-20 hidden lg:block animate-bounce" aria-hidden="true">
                  <div className="bg-white border-2 border-black p-4 rounded-3xl relative after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:w-4 after:h-4 after:bg-white after:border-b-2 after:border-r-2 after:border-black after:rotate-45 after:-translate-x-1/2">
                    <p className="text-xs font-black uppercase tracking-tight">System Status: Optimal!</p>
                  </div>
                </div>
              </div>
              <h1 className="text-5xl lg:text-7xl font-semibold text-[#202124] mb-8 tracking-tight max-w-5xl drop-shadow-sm">
                The Infrastructure Architect for the Enterprise.
              </h1>
              <p className="text-xl lg:text-2xl text-[#5f6368] mb-12 max-w-3xl leading-relaxed">
                Expert orchestration of <span className="text-[#1a73e8] font-medium">16,000 server nodes</span> at HCLTech. Building stability through precision systems management.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button onClick={(e) => scrollToSection(e, 'about')} className="px-12 py-4 btn-google btn-google-primary text-base shadow-lg hover:scale-105 active:scale-95 transition-transform">Professional Background</button>
                <button onClick={() => setIsNewsMode(true)} className="px-12 py-4 btn-google border-2 border-[#dadce0] text-[#1a73e8] bg-white hover:bg-[#f8f9fa] text-base hover:border-black transition-all">Live Tech Radar</button>
              </div>
            </section>

            <section id="about" className="bg-[#f8f9fa]/80 backdrop-blur-md py-24 px-6 border-y-2 border-[#dadce0]">
              <div className="container mx-auto max-w-5xl">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                  <div className="reveal active">
                    <h2 className="text-3xl font-semibold text-[#202124] mb-8">Uptime Protocol: 99.9%</h2>
                    <p className="text-lg text-[#5f6368] leading-relaxed mb-6">
                      I operate at the intersection of legacy reliability and modern scalability. My focus is on ensuring mission-critical availability for massive enterprise server clusters across the globe.
                    </p>
                    <p className="text-[#5f6368] leading-relaxed">
                      With deep expertise in Windows Server lifecycles and VMware virtualization, I manage high-stakes incident remediation for tier-1 infrastructure.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[{ label: "Managed Nodes", v: "16K" }, { label: "Uptime SLA", v: "99.9%" }, { label: "Professional Exp", v: "8Y+" }, { label: "System Health", v: "Healthy" }].map(i => (
                      <div key={i.label} className="bg-white p-8 rounded-2xl border-2 border-[#dadce0] text-center shadow-sm hover:shadow-xl hover:border-black transition-all">
                        <p className="text-3xl font-black text-[#1a73e8]">{i.v}</p>
                        <p className="text-xs font-medium text-[#5f6368] uppercase tracking-widest mt-2">{i.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section id="expertise" className="py-24 px-6 relative">
              <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16 reveal active">
                  <h2 className="text-3xl font-semibold text-[#202124] mb-4">Core Competencies</h2>
                  <p className="text-[#5f6368]">Advanced technical deck for enterprise infrastructure operations.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {USER_DATA.skills.map((skill) => (
                    <SkillCard key={skill.name} skill={skill} onClick={() => setSelectedSkill(skill)} icon={getSkillIcon(skill.name)} />
                  ))}
                </div>
              </div>
            </section>

            <section id="experience" className="py-24 px-6 bg-[#f8f9fa]/80 backdrop-blur-md border-y-2 border-[#dadce0]">
              <div className="container mx-auto max-w-4xl">
                <h2 className="text-3xl font-semibold text-[#202124] mb-20 text-center reveal active">Career Trajectory</h2>
                <div className="space-y-16">
                  {USER_DATA.experience.map((exp, i) => (
                    <div key={i} className="flex gap-8 group reveal active">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-white border-2 border-[#dadce0] rounded-full flex items-center justify-center text-[#1a73e8] font-bold text-sm shadow-sm group-hover:border-black transition-all">
                          {USER_DATA.experience.length - i}
                        </div>
                        <div className="flex-1 w-[2px] bg-[#dadce0] my-4" aria-hidden="true"></div>
                      </div>
                      <div className="pb-12 flex-1">
                        <div className="google-card p-10 bg-white hover:border-black hover:border-2 transition-all">
                          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                            <div>
                              <h3 className="text-2xl font-semibold text-[#202124] mb-1">{exp.role}</h3>
                              <p className="text-[#1a73e8] font-medium text-lg">{exp.company}</p>
                            </div>
                            <span className="text-xs font-semibold text-[#5f6368] bg-[#f1f3f4] px-4 py-2 rounded-full uppercase tracking-wider border border-[#dadce0]">{exp.period}</span>
                          </div>
                          <p className="text-[#5f6368] leading-relaxed text-base">{exp.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="contact" className="py-32 px-6 text-center">
              <div className="container mx-auto max-w-4xl">
                <div className="mb-12">
                   <BrandLogo className="w-24 h-24 mx-auto mb-8 opacity-50 grayscale hover:grayscale-0 transition-all" />
                   <h2 className="text-5xl font-semibold text-[#202124] mb-6">Ready to scale your next project?</h2>
                   <p className="text-xl text-[#5f6368] mb-16 max-w-2xl mx-auto">Connect for high-priority infrastructure orchestration or strategic enterprise inquiries.</p>
                </div>
                <div className="grid sm:grid-cols-3 gap-6">
                  <a href={`mailto:${USER_DATA.email}`} className="google-card p-8 bg-white/90 hover:bg-[#e8f0fe] hover:border-black hover:border-2 transition-all flex flex-col items-center gap-4 group">
                    <div className="w-14 h-14 bg-[#e8f0fe] rounded-full flex items-center justify-center text-[#1a73e8] group-hover:scale-110 transition-transform border border-transparent group-hover:border-black" aria-hidden="true"><ICONS.Mail /></div>
                    <span className="text-sm font-semibold text-[#202124]">Primary Mail</span>
                  </a>
                  <a href={USER_DATA.whatsappUrl} target="_blank" rel="noopener noreferrer" className="google-card p-8 bg-white/90 hover:bg-[#e6f4ea] hover:border-black hover:border-2 transition-all flex flex-col items-center gap-4 group">
                    <div className="w-14 h-14 bg-[#e6f4ea] rounded-full flex items-center justify-center text-[#34a853] group-hover:scale-110 transition-transform border border-transparent group-hover:border-black" aria-hidden="true"><ICONS.WhatsApp /></div>
                    <span className="text-sm font-semibold text-[#202124]">Secure Bridge</span>
                  </a>
                  <button onClick={generateResumePDF} className="google-card p-8 bg-white/90 hover:bg-[#f1f3f4] hover:border-black hover:border-2 transition-all flex flex-col items-center gap-4 group">
                    <div className="w-14 h-14 bg-[#f1f3f4] rounded-full flex items-center justify-center text-[#202124] group-hover:scale-110 transition-transform border border-transparent group-hover:border-black" aria-hidden="true"><ICONS.Download /></div>
                    <span className="text-sm font-semibold text-[#202124]">System Ledger</span>
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="py-24 bg-[#f8f9fa] border-t-2 border-[#dadce0] text-center px-6 relative z-10">
        <div className="container mx-auto flex flex-col items-center gap-12">
          {/* Subtle Activity Log (The Deployment Present) */}
          <div className="w-full max-w-xs h-12 overflow-hidden bg-[#e8eaed] rounded-lg p-2 text-left font-mono text-[8px] text-[#5f6368] opacity-50 select-none">
            <div className="animate-[scroll-logs_10s_linear_infinite]">
              <p>> Fetching node_data.json...</p>
              <p>> Cluster 094 health check: OK</p>
              <p>> Rubrik Snapshot 002: Immutable</p>
              <p>> ServiceNow API: Handshake Complete</p>
              <p>> Vercel Edge Deployment: Online</p>
              <p>> Syncing Global Inventory...</p>
            </div>
          </div>
          <BrandLogo className="w-16 h-16 grayscale opacity-20" />
          <nav className="flex flex-wrap justify-center gap-10 text-sm font-medium text-[#5f6368]" aria-label="Footer Navigation">
            <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="hover:text-[#1a73e8] uppercase tracking-widest font-bold">Background</a>
            <a href="#expertise" onClick={(e) => scrollToSection(e, 'expertise')} className="hover:text-[#1a73e8] uppercase tracking-widest font-bold">Skill Set</a>
            <a href="#experience" onClick={(e) => scrollToSection(e, 'experience')} className="hover:text-[#1a73e8] uppercase tracking-widest font-bold">Career Ledger</a>
            <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-[#1a73e8] uppercase tracking-widest font-bold">Connect</a>
          </nav>
          <div className="flex flex-col gap-2">
            <div className="text-[11px] text-[#9aa0a6] uppercase tracking-[0.3em] font-semibold">
              © {new Date().getFullYear()} M. Vishnunath • Infrastructure Protocol Portfolio
            </div>
            <div className="text-[9px] text-[#bdc1c6] uppercase tracking-[0.1em]">
              Powered by Google Gemini 3 Intelligence • Optimized for Vercel Edge
            </div>
          </div>
        </div>
      </footer>

      {/* SKILL MODAL */}
      {selectedSkill && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-white/60 animate-in fade-in duration-300" 
          onClick={() => setSelectedSkill(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xl bg-white rounded-[32px] shadow-3xl overflow-hidden relative border-2 border-black animate-in zoom-in-95 duration-500" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedSkill(null)} className="absolute top-8 right-8 z-20 w-12 h-12 hover:bg-[#f1f3f4] rounded-full flex items-center justify-center transition-colors border border-[#dadce0] hover:border-black">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2.5" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <div className="p-14">
              <div className="flex items-center gap-8 mb-12">
                 <div className="w-20 h-20 bg-[#e8f0fe] rounded-[24px] flex items-center justify-center text-[#1a73e8] text-4xl shadow-sm border-2 border-black">
                   {getSkillIcon(selectedSkill.name)}
                 </div>
                 <div>
                    <span className="text-[11px] font-bold text-[#1a73e8] uppercase tracking-[0.3em] mb-2 block">{selectedSkill.category}</span>
                    <h3 className="text-4xl font-semibold text-[#202124] tracking-tight">{selectedSkill.name}</h3>
                 </div>
              </div>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-semibold text-[#5f6368]">Systems Optimization</span>
                    <span className="text-sm font-bold text-[#1a73e8] bg-[#e8f0fe] px-3 py-1 rounded-full border border-[#1a73e8]">{selectedSkill.level}%</span>
                  </div>
                  <div className="w-full h-3 bg-[#f1f3f4] rounded-full overflow-hidden border border-[#dadce0]">
                    <div className="h-full bg-[#1a73e8] rounded-full transition-all duration-1000" style={{ width: `${selectedSkill.level}%` }}></div>
                  </div>
                </div>
                <div className="h-px bg-[#f1f3f4]"></div>
                <p className="text-[#5f6368] text-lg leading-relaxed italic font-medium">"{selectedSkill.description}"</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={null}><ChatWidget /></Suspense>
      <style>{`
        @keyframes scroll-logs {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100%); }
        }
      `}</style>
    </div>
  );
};

export default App;
