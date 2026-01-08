
import React, { useEffect, useState, useMemo } from 'react';
import { generateComicAsset } from '../services/geminiService';

const ComicBackground: React.FC = () => {
  const [assets, setAssets] = useState<string[]>([]);
  const [isAiLoaded, setIsAiLoaded] = useState(false);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const cached = sessionStorage.getItem('TECH_BG_ASSETS');
        if (cached) {
          setAssets(JSON.parse(cached));
          setIsAiLoaded(true);
          return;
        }

        // If explicitly disabled due to quota, don't even try
        if (sessionStorage.getItem('TECH_BG_DISABLED') === 'true') return;

        const prompts = [
          "Cross-section of an enterprise data center rack with servers",
          "Top-down blueprint of a complex network topology",
          "Technical drawing of a virtual machine cluster architecture",
          "Industrial drafting of fiber optic cabling paths"
        ];

        const results = await Promise.all(prompts.map(p => generateComicAsset(p)));
        const validAssets = results.filter((r): r is string => !!r);
        
        if (validAssets.length > 0) {
          setAssets(validAssets);
          setIsAiLoaded(true);
          try {
            sessionStorage.setItem('TECH_BG_ASSETS', JSON.stringify(validAssets));
          } catch (storageError) {
            console.warn("Could not cache background assets.");
          }
        }
      } catch (e) {
        console.error("Failed to load creative background assets:", e);
      }
    };

    loadAssets();
  }, []);

  // Static coordinate points for the "Blueprint" look
  const coordinates = useMemo(() => [
    { x: '10%', y: '15%', val: '40.7128° N, 74.0060° W' },
    { x: '85%', y: '10%', val: 'NODE_ALPHA_094' },
    { x: '5%', y: '90%', val: 'SYS_VER: 2.0.4' },
    { x: '80%', y: '95%', val: 'INFRA_PROTOCOL_ACTIVE' },
    { x: '50%', y: '5%', val: 'SECTION_A-A' }
  ], []);

  const floatingAnimations = [
    "animate-[float_20s_ease-in-out_infinite]",
    "animate-[float_25s_ease-in-out_infinite_reverse]",
    "animate-[float_30s_ease-in-out_infinite_alternate]",
    "animate-[float_22s_ease-in-out_infinite]"
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-google-bg transition-colors duration-500">
      {/* Drafting Table Major Grid */}
      <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.04]" style={{
        backgroundImage: 'linear-gradient(#1a73e8 1px, transparent 1px), linear-gradient(90deg, #1a73e8 1px, transparent 1px)',
        backgroundSize: '100px 100px'
      }}></div>

      {/* Drafting Table Minor Grid */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(#1a73e8 0.5px, transparent 0.5px), linear-gradient(90deg, #1a73e8 0.5px, transparent 0.5px)',
        backgroundSize: '20px 20px'
      }}></div>

      {/* Blueprint Coordinate Labels */}
      {coordinates.map((coord, i) => (
        <div 
          key={i} 
          className="absolute font-mono text-[8px] font-bold text-[#1a73e8] opacity-20 dark:opacity-30"
          style={{ top: coord.y, left: coord.x }}
        >
          [{coord.val}]
        </div>
      ))}

      {/* Halftone Dot Overlay */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(#5f6368 1px, transparent 0)',
        backgroundSize: '24px 24px'
      }}></div>

      {/* Large Floating Text - Infrastructure Themed */}
      <div className="absolute top-[15%] left-[10%] rotate-[-15deg] font-black text-8xl text-[#1a73e8] opacity-[0.03] dark:opacity-[0.02] blur-[1px]">
        INFRASTRUCTURE
      </div>
      <div className="absolute bottom-[20%] right-[10%] rotate-[10deg] font-black text-8xl text-[#ea4335] opacity-[0.03] dark:opacity-[0.02] blur-[1px]">
        AVAILABILITY
      </div>

      {/* Floating Blueprint Rulers */}
      <div className="absolute top-0 left-0 w-full h-8 border-b border-google-border opacity-20 flex items-center px-4 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className={`h-full border-l border-google-border ${i % 5 === 0 ? 'w-20' : 'w-4'}`}>
            <span className="text-[6px] ml-1 opacity-40">{i * 10}</span>
          </div>
        ))}
      </div>

      {/* Floating Schematic Assets (AI Generated) */}
      {assets.length > 0 && assets.map((src, i) => {
        const positions = [
          "top-[15%] left-[60%] w-[500px]",
          "top-[55%] left-[10%] w-[450px]",
          "top-[30%] right-[5%] w-[420px]",
          "bottom-[10%] left-[40%] w-[480px]"
        ];
        
        return (
          <div 
            key={i} 
            className={`absolute transition-opacity duration-1000 ${positions[i % positions.length]} ${floatingAnimations[i % floatingAnimations.length]} opacity-[0.07] dark:opacity-[0.04]`}
          >
            <img 
              src={src} 
              alt="Background Schematic" 
              className="w-full h-auto mix-blend-multiply dark:mix-blend-screen drop-shadow-sm filter grayscale contrast-125 invert dark:invert-0"
            />
          </div>
        );
      })}

      {/* Fallback Static Schematics if AI Fails */}
      {!isAiLoaded && (
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
           <div className="absolute top-1/4 left-1/4 w-96 h-96 border-2 border-dashed border-[#1a73e8] rounded-full animate-pulse opacity-20"></div>
           <div className="absolute bottom-1/4 right-1/4 w-80 h-80 border-2 border-dotted border-[#ea4335] opacity-20"></div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-40px) rotate(1.5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

export default ComicBackground;
