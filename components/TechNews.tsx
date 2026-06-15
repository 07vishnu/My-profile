import React, { useState, useEffect } from 'react';
import { Newspaper, Loader2, ArrowUpRight, RefreshCw, Globe, Calendar, Rss } from 'lucide-react';

interface TechStory {
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
}

export const TechNews: React.FC = () => {
  const [stories, setStories] = useState<TechStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newsSource, setNewsSource] = useState<string>('System Cache');

  const fetchTechNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tech-news');
      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }
      const data = await response.json();
      if (data && Array.isArray(data.news)) {
        setStories(data.news);
        setNewsSource(data.source || 'Grounded Search Engine');
      } else {
        throw new Error('Invalid response payload format');
      }
    } catch (err: any) {
      console.error('Failed to fetch tech news:', err);
      setError('System could not establish a secure connection to live news server. Utilizing local backup context instead.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechNews();
  }, []);

  return (
    <div id="tech-news" className="container mx-auto px-4 md:px-6 py-16 md:py-24 max-w-7xl relative z-10 scroll-mt-20">
      
      {/* Header Segment */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-16">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-google-blue/10 rounded-full text-google-blue text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            <Newspaper size={12} className="text-google-blue" />
            Global Tech Intelligence Stream
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Enterprise Technology Bulletin
          </h2>
          <p className="text-sm md:text-base text-google-gray max-w-2xl font-medium">
            Stay aligned with breaking datacenter updates, storage automation enhancements, and modern virtualization breakthroughs. Analyzed and structured by Gemini real-time grounding.
          </p>
        </div>

        {/* Sync Controls */}
        <div className="flex items-center gap-3 self-start md:self-end">
          <div className="flex flex-col text-left md:text-right">
            <span className="text-[8px] font-extrabold uppercase tracking-widest text-google-gray">DATA STREAM FEED</span>
            <span className="text-[10px] font-bold text-google-blue font-mono">{newsSource}</span>
          </div>
          <button
            onClick={fetchTechNews}
            disabled={loading}
            className="p-3 bg-google-surface border border-google-border hover:border-google-blue/50 text-google-gray hover:text-google-blue disabled:opacity-50 disabled:pointer-events-none rounded-xl transition-all shadow-sm flex items-center justify-center"
            title="Refresh News Feed via Gemini Grounding"
          >
            <RefreshCw size={15} className={`${loading ? 'animate-spin text-google-blue' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        /* Skeletons loader or spinning loader */
        <div className="py-20 flex flex-col items-center justify-center bg-google-surface/20 border border-google-border rounded-[32px]">
          <Loader2 className="w-10 h-10 text-google-blue animate-spin mb-4" />
          <p className="text-xs font-mono font-bold text-google-blue uppercase tracking-widest animate-pulse">Establishing Live News Grounding Feed...</p>
          <p className="text-[10px] text-google-gray mt-1 max-w-xs text-center font-semibold">Running broad live query cluster for breaking tech bulletins.</p>
        </div>
      ) : error ? (
        /* Error state indicator */
        <div className="p-8 border border-google-red/20 bg-google-red/5 rounded-3xl text-center max-w-2xl mx-auto">
          <p className="text-xs text-google-red font-bold font-mono tracking-tight uppercase mb-2">TELEMETRY TRANSFER INTERRUPTION</p>
          <p className="text-sm text-google-gray font-medium mb-4">{error}</p>
          <button 
            onClick={fetchTechNews} 
            className="px-5 py-2 bg-google-surface hover:bg-google-blue hover:text-white border border-google-border hover:border-google-blue rounded-xl text-xs font-bold transition-all"
          >
            Retry Connection Request
          </button>
        </div>
      ) : (
        /* Actual Bulletins Listing */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story, idx) => (
            <div 
              key={idx} 
              className="bg-google-surface/30 border border-google-border hover:border-google-blue/30 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group overflow-hidden relative backdrop-blur-sm"
            >
              {/* Decorative side accent */}
              <div className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-google-blue transition-colors"></div>
              
              <div>
                {/* Meta details */}
                <div className="flex items-center justify-between text-[10px] font-bold text-google-gray mb-4">
                  <span className="flex items-center gap-1 bg-google-surface px-2.5 py-1 rounded-full border border-google-border">
                    <Globe size={11} className="text-google-blue" />
                    {story.source}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[9px] uppercase">
                    <Calendar size={11} className="text-google-gray" />
                    {story.date || 'LATEST'}
                  </span>
                </div>

                {/* Article Header title */}
                <h3 className="text-base md:text-lg font-bold tracking-tight mb-3 text-inherit group-hover:text-google-blue transition-colors line-clamp-2">
                  {story.title}
                </h3>

                {/* Summary description block */}
                <p className="text-xs text-google-gray leading-relaxed mb-6 font-medium line-clamp-4">
                  {story.summary}
                </p>
              </div>

              {/* Action Button trigger */}
              <a 
                href={story.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full flex items-center justify-between py-2.5 px-4 bg-google-surface border border-google-border group-hover:border-google-blue/40 group-hover:bg-google-blue/5 rounded-xl font-bold text-[10px] uppercase tracking-wider text-google-gray group-hover:text-google-blue transition-all"
              >
                <span>Read Official Source</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Decorative summary footer feed */}
      <div className="mt-12 text-center text-[10px] font-mono font-bold text-google-gray uppercase tracking-widest flex items-center justify-center gap-2">
        <Rss size={12} className="text-google-green animate-pulse" />
        SLA SECURED REAL-TIME KNOWLEDGE BASES SYNCHRONIZED
      </div>
    </div>
  );
};

export default TechNews;
