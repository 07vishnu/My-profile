
import { GoogleGenAI, Type } from "@google/genai";
import { USER_DATA } from "../constants";

const getAI = () => {
  const key = process.env.API_KEY;
  if (!key || key === "undefined") {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey: key });
};

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
  try {
    const ai = getAI();
    const needsSearch = /latest|current|news|today|recent|documentation|vs|compare/i.test(userInput);

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
    if (error.message === "API_KEY_MISSING") {
      return { text: "Error: API Key not found in environment. Please configure Vercel settings.", needsHandoff: true };
    }
    return { 
      text: `System Alert: Latency detected in neural uplink. ${USER_DATA.aiConfig.handoffInstruction}`,
      needsHandoff: true 
    };
  }
};

/**
 * Robust JSON extraction that works even if the model appends citations/grounding markers.
 */
const extractJSON = (text: string) => {
  try {
    // Look for the first '[' and last ']' to isolate the array
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start !== -1 && end !== -1) {
      const jsonStr = text.substring(start, end + 1);
      return JSON.parse(jsonStr);
    }
    return JSON.parse(text);
  } catch (e) {
    console.error("JSON Extraction failed for text:", text);
    throw new Error("Invalid JSON structure in AI response.");
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

  const fetchTimestamp = Date.now();
  try {
    const ai = getAI();
    // Use Flash for News Radar - it's faster and more available for search tasks
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Search for and list 6 major IT infrastructure stories from the last 24 hours (Windows Server, VMware, HCLTech, or Enterprise IT). Format your entire response as a single valid JSON array of objects with keys: title, summary, url, publishedAt. Do not include markdown code blocks, just the raw JSON array.",
      config: {
        tools: [{ googleSearch: {} }],
        // We DO NOT set responseMimeType here because search grounding often adds 
        // non-JSON citations to the text which breaks strict JSON parsing.
      }
    });

    const rawText = response.text || "[]";
    const articlesData = extractJSON(rawText);

    // Extract grounding URLs to display as sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sourceLinks = groundingChunks
      .filter((c: any) => c.web)
      .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));

    const articles: NewsArticle[] = articlesData.map((a: any, i: number) => ({
      ...a,
      id: `news-${fetchTimestamp}-${i}`,
      sources: sourceLinks.slice(i, i + 2) // Associate a few sources with each card
    }));

    if (articles.length === 0) throw new Error("No articles generated.");

    const cacheData: NewsCache = { articles, timestamp: fetchTimestamp };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    return { articles, lastUpdated: fetchTimestamp };
  } catch (error: any) {
    console.error("Tech Radar Service Failure:", error);
    
    // Try to fall back to stale cache if API fails
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return { ...JSON.parse(cached), articles: JSON.parse(cached).articles };
    }
    
    throw error;
  }
};

export const generateComicAsset = async (prompt: string): Promise<string | undefined> => {
  try {
    const ai = getAI();
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
