
import { GoogleGenAI, Type } from "@google/genai";
import { USER_DATA } from "../constants";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const CACHE_KEY = "TECH_NEWS_CACHE";
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
  publishedAt: string;
  sources?: { title: string; uri: string }[];
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
    return { 
      text: `System Alert: Latency detected in neural uplink. ${USER_DATA.aiConfig.handoffInstruction}`,
      needsHandoff: true 
    };
  }
};

/**
 * Sanitizes AI response text to extract clean JSON.
 */
const cleanJSON = (text: string) => {
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  return jsonMatch ? jsonMatch[0] : text;
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
      model: "gemini-3-pro-preview",
      contents: "Search and list exactly 6 major enterprise IT infrastructure or server virtualization news stories from the last 24 hours. Focus on Windows Server, VMware, HCLTech, or Cloud Infrastructure. Return as a clean JSON array of objects.",
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

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sourceLinks = groundingChunks
      .filter((c: any) => c.web)
      .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));

    const rawText = response.text || "[]";
    const cleanedText = cleanJSON(rawText);
    const parsedArticles = JSON.parse(cleanedText);

    const articles: NewsArticle[] = parsedArticles.map((a: any, i: number) => ({
      ...a,
      id: `news-${fetchTimestamp}-${i}`,
      // Attach search grounding sources if available
      sources: sourceLinks.slice(i * 2, (i * 2) + 2) 
    }));

    if (articles.length === 0) throw new Error("Empty news response");

    const cacheData: NewsCache = { articles, timestamp: fetchTimestamp };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    return { articles, lastUpdated: fetchTimestamp };
  } catch (error) {
    console.error("Tech Radar Fetch Failure:", error);
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const cacheData = JSON.parse(cached);
      return { articles: cacheData.articles, lastUpdated: cacheData.timestamp };
    }
    throw error;
  }
};

export const generateComicAsset = async (prompt: string): Promise<string | undefined> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `Minimalist blueprint technical drafting, thin ink lines on white paper, professional engineering schematic: ${prompt}` }]
      },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });

    const imgPart = response.candidates[0].content.parts.find(p => p.inlineData);
    return imgPart ? `data:image/png;base64,${imgPart.inlineData.data}` : undefined;
  } catch (error) {
    console.error("Background generation failed:", error);
    return undefined;
  }
};

export const getLatestTechNews = getLatestNewsText;
