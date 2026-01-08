
import { GoogleGenAI } from "@google/genai";
import { USER_DATA } from "../constants";

const getAI = () => {
  const key = process.env.API_KEY;
  if (!key || key === "undefined") {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey: key });
};

export interface GeminiResult {
  text: string;
  groundingChunks?: any[];
}

/**
 * Generates a response from the AI assistant acting as Vishnunath's professional persona.
 */
export const getPersonaResponse = async (prompt: string): Promise<GeminiResult> => {
  try {
    const ai = getAI();
    
    const systemInstruction = `You are the AI assistant for M. Vishnunath, an IT Infrastructure Specialist with 8+ years of experience.
    
    CONTEXT:
    - Name: ${USER_DATA.name}
    - Current Role: ${USER_DATA.title} at HCLTech
    - Bio: ${USER_DATA.bio}
    - Location: ${USER_DATA.location}
    - Expertise: ${USER_DATA.skills.map(s => s.name).join(", ")}
    - Experience Summary: ${USER_DATA.experience.map(e => `${e.role} at ${e.company} (${e.period})`).join("; ")}
    
    GUIDELINES:
    1. Be professional, technical, and helpful.
    2. Focus on answering queries about Vishnunath's skills in Windows Server, VMware, Hyper-V, and Infrastructure Management.
    3. If the user asks about hiring or direct contact, provide his email (${USER_DATA.email}) or mention the WhatsApp link.
    4. If the query is complex or outside the provided context, gracefully transition using this message: "${USER_DATA.aiConfig.handoffInstruction}"
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

    return {
      text: response.text || "I apologize, but I am unable to process that request at the moment.",
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (error: any) {
    console.error("AI Persona Response failed:", error);
    if (error?.message?.includes("429") || error?.message?.includes("RESOURCE_EXHAUSTED")) {
      return { text: "The AI system is experiencing high traffic (quota limit reached). Please contact Vishnunath directly via email while our automated systems recover." };
    }
    if (error instanceof Error && error.message === "API_KEY_MISSING") {
      return { text: "The AI agent is currently offline (API key not configured). Please contact Vishnunath directly via email or WhatsApp." };
    }
    return { text: "I'm having a bit of trouble connecting to my systems. Please try again in a moment or reach out to Vishnunath." };
  }
};

/**
 * Generates technical blueprint assets for the background.
 * Implements a check to avoid repeated calls if quota is exhausted.
 */
export const generateComicAsset = async (prompt: string): Promise<string | undefined> => {
  // Check if we already hit a quota limit in this session to prevent repeated errors
  if (sessionStorage.getItem('TECH_BG_DISABLED') === 'true') return undefined;

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
      const imgPart = candidates[0].content.parts.find(p => p.inlineData);
      return imgPart ? `data:image/png;base64,${imgPart.inlineData.data}` : undefined;
    }
    return undefined;
  } catch (error: any) {
    console.error("Background generation failed:", error);
    // If we hit a quota limit, disable AI background generation for the rest of the session
    if (error?.message?.includes("429") || error?.message?.includes("RESOURCE_EXHAUSTED")) {
      sessionStorage.setItem('TECH_BG_DISABLED', 'true');
    }
    return undefined;
  }
};
