
import React, { useEffect, useState, useMemo } from 'react';
import { generateComicAsset } from '../services/geminiService';

const ComicBackground: React.FC = () => {
  const [assets, setAssets] = useState<string[]>([]);

  useEffect(() => {
    const loadAssets = async () => {
      // Safely check session storage
      try {
        const cached = sessionStorage.getItem('TECH_BG_ASSETS') || sessionStorage.getItem('COMIC_BG_ASSETS');
        if (cached) {
          setAssets(JSON.parse(cached));
          return;
        }
      } catch (e) {
        console.warn("Storage access denied or corrupted:", e);
      }

      // Varied technical infrastructure prompts
      const prompts = [
        "Architectural schematic of a global fiber-optic network backbone",
        "Technical blueprint of an enterprise server cluster with cooling systems",
        "Blueprint drawing of a sophisticated network switch with intricate wiring",
        "Conceptual drafting of a cloud infrastructure cluster with data nodes"
      ];

      try {
        const results = await Promise.all(prompts.map(p => generateComicAsset(p)));
        const validAssets = results.filter((r): r is string => !!r);
        
        if (validAssets.length > 0) {
          setAssets(validAssets);
          
          // Safely attempt to cache the assets
          try {
            sessionStorage.setItem('TECH_BG_ASSETS', JSON.stringify(validAssets));
          } catch (storageError) {
            // QuotaExceededError is common when storing multiple large base64 images.
            // We just proceed without caching to keep the app functional.
            console.warn("Could not cache background assets due to storage limits. Assets will be re-generated on next reload.");
            // Optional: try to clear existing keys to free up space
            sessionStorage.removeItem('COMIC_BG_ASSETS');
          }
        }
      } catch (e) {
        console.error("Failed to load creative background assets:", e);
      }
    };

    loadAssets();
  }, []);

  const floatingAnimations = [
    "animate-[float_20s_ease-in-out_infinite]",
    "animate-[float_25s_ease-in-out_infinite_reverse]",
    "animate-[float_30s_ease-in-out_infinite_alternate]",
    "animate-[float_22s_ease-in-out_infinite]"
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Drafting Table Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>

      {/* Halftone Dot Overlay (Subtle) */}
      <div className="absolute inset-0 opacity-[0.05]" style={{
        backgroundImage: 'radial-gradient(#1a73e8 1.5px, transparent 0)',
        backgroundSize: '32px 32px'
      }}></div>

      {/* Floating Technical Concepts (Action Words) */}
      <div className="absolute top-[10%] left-[8%] rotate-[-12deg] font-black text-7xl text-[#1a73e8] opacity-[0.04] blur-[1px]">
        INFRA
      </div>
      <div className="absolute top-[55%] right-[5%] rotate-[15deg] font-black text-7xl text-[#ea4335] opacity-[0.04] blur-[1px]">
        UPTIME
      </div>
      <div className="absolute bottom-[15%] left-[12%] rotate-[-5deg] font-black text-7xl text-[#34a853] opacity-[0.04] blur-[1px]">
        CORE
      </div>

      {/* Floating Schematic Assets */}
      {assets.map((src, i) => {
        const positions = [
          "top-[15%] left-[65%] w-[450px] opacity-[0.08]",
          "top-[60%] left-[15%] w-[400px] opacity-[0.07]",
          "top-[35%] right-[8%] w-[380px] opacity-[0.06]",
          "bottom-[5%] right-[25%] w-[420px] opacity-[0.08]"
        ];
        
        return (
          <div 
            key={i} 
            className={`absolute transition-opacity duration-1000 ${positions[i % positions.length]} ${floatingAnimations[i % floatingAnimations.length]}`}
          >
            <img 
              src={src} 
              alt="Background Schematic" 
              className="w-full h-auto mix-blend-multiply drop-shadow-sm filter grayscale contrast-125"
            />
          </div>
        );
      })}

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

export default ComicBackground;
