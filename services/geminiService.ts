
import { GoogleGenAI } from "@google/genai";
import { USER_DATA, AIConfig } from "../constants";

declare var process: { env: { [key: string]: string | undefined } };

/**
 * Helper to initialize the Gemini API client.
 * Uses process.env.API_KEY which is managed by the platform.
 */
const getAI = () => {
  const key = process.env.API_KEY;
  if (!key || key === "undefined") {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey: key });
};

/**
 * Detects if an error is related to API quota or rate limiting.
 */
const isQuotaError = (error: any): boolean => {
  const errorMessage = error?.message?.toLowerCase() || "";
  return (
    errorMessage.includes("429") || 
    errorMessage.includes("resource_exhausted") || 
    error?.status === 429
  );
};

export interface GeminiResult {
  text: string;
  groundingChunks?: any[];
}

/**
 * Generates a response from the AI assistant acting as Vishnunath's professional persona.
 * Includes robust handling for quota limits and system instructions.
 */
export const getPersonaResponse = async (prompt: string, dynamicConfig?: AIConfig): Promise<GeminiResult> => {
  try {
    const ai = getAI();
    const config = dynamicConfig || USER_DATA.aiConfig;
    
    const systemInstruction = `You are the AI assistant for M. Vishnunath, an IT Infrastructure Specialist with 8+ years of experience.
    
    CONTEXT:
    - Name: ${USER_DATA.name}
    - Current Role: ${USER_DATA.title} at HCLTech
    - Bio: ${USER_DATA.bio}
    - Location: ${USER_DATA.location}
    - Expertise: ${USER_DATA.skills.map(s => s.name).join(", ")}
    - Experience Summary: ${USER_DATA.experience.map(e => `${e.role} at ${e.company} (${e.period})`).join("; ")}
    - Current Status: ${config.availabilityStatus.toUpperCase()}
    
    GUIDELINES:
    1. Be professional, technical, and helpful.
    2. Focus on answering queries about Vishnunath's skills in Windows Server, VMware, Hyper-V, and Infrastructure Management.
    3. If the user asks about hiring or direct contact, provide his email (${USER_DATA.email}) or mention the WhatsApp link.
    4. If the query is complex or outside the provided context, or if the current status is not 'online', use this handoff protocol: "${config.handoffInstruction}"
    5. Always maintain the persona of an expert assistant.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }]
      },
    });

    const candidate = response.candidates?.[0];
    return {
      text: response.text || "I apologize, but I am unable to process that request at the moment.",
      groundingChunks: candidate?.groundingMetadata?.groundingChunks
    };
  } catch (error: any) {
    console.error("AI Persona Response failed:", error);
    
    if (isQuotaError(error)) {
      // If we hit quota on chat, we stop trying to generate background images for this session to save resources.
      sessionStorage.setItem('TECH_BG_DISABLED', 'true');
      return { 
        text: "The infrastructure AI is currently experiencing high demand (API quota reached). Please contact Vishnunath directly via WhatsApp or Email while our automated systems reset." 
      };
    }
    
    if (error instanceof Error && error.message === "API_KEY_MISSING") {
      return { text: "The AI agent is currently offline (API configuration missing). Please contact Vishnunath directly via email or WhatsApp." };
    }
    
    return { text: "I'm having a bit of trouble connecting to my systems. Please try again in a moment or reach out to Vishnunath via the contact section." };
  }
};

/**
 * Generates technical blueprint assets for the background.
 * Optimized to fail gracefully and disable future calls if quota is hit.
 */
export const generateComicAsset = async (prompt: string): Promise<string | undefined> => {
  // Respect the session-wide disability flag
  if (sessionStorage.getItem('TECH_BG_DISABLED') === 'true') {
    return undefined;
  }

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `Minimalist blueprint technical drafting, thin black ink lines on pure white paper, professional engineering schematic, high resolution, industrial style: ${prompt}` }]
      },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });

    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const firstCandidate = candidates[0];
      if (firstCandidate.content && firstCandidate.content.parts) {
        const imgPart = firstCandidate.content.parts.find(p => p.inlineData);
        if (imgPart && imgPart.inlineData) {
          return `data:image/png;base64,${imgPart.inlineData.data}`;
        }
      }
    }
    return undefined;
  } catch (error: any) {
    console.error("Technical asset generation failed:", error);
    
    if (isQuotaError(error)) {
      // Set the session flag to prevent further unnecessary API calls.
      sessionStorage.setItem('TECH_BG_DISABLED', 'true');
      // Returning undefined ensures the UI gracefully falls back to CSS-only backgrounds.
      return undefined;
    }
    
    return undefined;
  }
};
