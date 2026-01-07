
import { GoogleGenAI, Type } from "@google/genai";
import { USER_DATA } from "../constants";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const CACHE_KEY = "TECH_NEWS_CACHE";
const COMIC_CACHE_KEY = "COMIC_ASSETS_CACHE";
const CACHE_TTL = 3600000; // 1 hour

export interface GeminiResult {
  text: string;
  groundingChunks?: any[];
  isThinking?: boolean;
  needsHandoff?: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
}

export interface NewsResponse {
  articles: NewsArticle[];
  lastUpdated: number;
}

interface NewsCache {
  articles: NewsArticle[];
  timestamp: number;
}

const SYSTEM_INSTRUCTION = `
You are the "Web-Interface Intelligence Unit" for ${USER_DATA.name}. 
Answer technical queries regarding Vishnunath's professional background and infrastructure experience.
`;

export const getPersonaResponse = async (userInput: string): Promise<GeminiResult> => {
  const ai = getAI();
  const needsSearch = /latest|current|news|today|recent|documentation|vs|compare/i.test(userInput);

  try {
    let response;
    if (needsSearch) {
      response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userInput,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }],
          temperature: 0.2,
        }
      });
    } else {
      response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: userInput,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingBudget: 32768 },
          temperature: 0.6,
        }
      });
    }

    const text = response.text || "";
    const needsHandoff = text.includes(USER_DATA.aiConfig.handoffTrigger) || 
                         text.toLowerCase().includes("reply to you personally");

    return {
      text: text.replace(USER_DATA.aiConfig.handoffTrigger, "").trim(),
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks,
      isThinking: !needsSearch,
      needsHandoff: needsHandoff
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    let userFeedback = "My neural pathways are experiencing a temporary disruption.";
    
    if (!navigator.onLine) {
      userFeedback = "System Offline: Please check your network connectivity to resume this technical briefing.";
    } else if (error?.message?.includes("429") || error?.message?.toLowerCase().includes("quota")) {
      userFeedback = "Infrastructure High Load: I'm processing too many concurrent requests. Please wait a moment while I scale my resources.";
    } else if (error?.message?.includes("401") || error?.message?.includes("403")) {
      userFeedback = "Access Denied: There is an authentication failure with my core logic. This has been logged for maintenance.";
    } else if (error?.message?.includes("500") || error?.message?.includes("503")) {
      userFeedback = "Upstream Failure: The primary Gemini intelligence cluster is currently undergoing maintenance.";
    }

    return { 
      text: `${userFeedback} ${USER_DATA.aiConfig.handoffInstruction}`,
      needsHandoff: true 
    };
  }
};

export const getLatestNewsText = async (forceRefresh = false): Promise<NewsResponse> => {
  if (!forceRefresh) {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const cacheData: NewsCache = JSON.parse(cached);
      if (Date.now() - cacheData.timestamp < CACHE_TTL) {
        return { articles: cacheData.articles, lastUpdated: cacheData.timestamp };
      }
    }
  }

  const ai = getAI();
  const fetchTimestamp = Date.now();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "List 6 critical global tech infrastructure stories from the last 24h. Output JSON.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              url: { type: Type.STRING },
              publishedAt: { type: Type.STRING }
            },
            required: ["title", "summary", "url", "publishedAt"]
          }
        }
      }
    });

    const articles: NewsArticle[] = JSON.parse(response.text || "[]").map((a: any, i: number) => ({
      ...a,
      id: `news-${fetchTimestamp}-${i}`
    }));

    const cacheData: NewsCache = { articles, timestamp: fetchTimestamp };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    return { articles, lastUpdated: fetchTimestamp };
  } catch (error) {
    console.error("News text fetch failed:", error);
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? { articles: JSON.parse(cached).articles, lastUpdated: JSON.parse(cached).timestamp } : { articles: [], lastUpdated: 0 };
  }
};

/**
 * Generates technical background images.
 * Now supports mixed styles: Blueprints, Comic Art, and Architectural Schematics.
 */
export const generateComicAsset = async (prompt: string): Promise<string | undefined> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High-quality professional technical illustration, hand-drawn drafting style, thin black ink lines, slight retro print texture, architectural blueprint aesthetic: ${prompt}. Minimalist, elegant, isolated on solid white background.` }]
      },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });

    const imgPart = response.candidates[0].content.parts.find(p => p.inlineData);
    return imgPart ? `data:image/png;base64,${imgPart.inlineData.data}` : undefined;
  } catch (error) {
    console.error("Background asset generation failed:", error);
    return undefined;
  }
};

// Legacy support for App.tsx if needed
export const getLatestTechNews = async (forceRefresh = false): Promise<NewsResponse> => {
  return await getLatestNewsText(forceRefresh);
};
