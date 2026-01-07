
import { GoogleGenAI } from "@google/genai";
// Added import for USER_DATA to provide context to the AI agent
import { USER_DATA } from "../constants";

const getAI = () => {
  const key = process.env.API_KEY;
  if (!key || key === "undefined") {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey: key });
};

// Defined GeminiResult interface for consistent response handling
export interface GeminiResult {
  text: string;
  groundingChunks?: any[];
}

/**
 * Generates a response from the AI assistant acting as Vishnunath's professional persona.
 * Uses gemini-3-flash-preview for efficiency and cost-effectiveness.
 */
export const getPersonaResponse = async (prompt: string): Promise<GeminiResult> => {
  try {
    const ai = getAI();
    
    // System instruction defining the agent's identity and boundaries
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
        // Using Google Search grounding for up-to-date technical troubleshooting queries
        tools: [{ googleSearch: {} }]
      },
    });

    return {
      text: response.text || "I apologize, but I am unable to process that request at the moment.",
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (error) {
    console.error("AI Persona Response failed:", error);
    if (error instanceof Error && error.message === "API_KEY_MISSING") {
      return { text: "The AI agent is currently offline (API key not configured). Please contact Vishnunath directly via email or WhatsApp." };
    }
    return { text: "I'm having a bit of trouble connecting to my systems. Please try again in a moment or reach out to Vishnunath." };
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

    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const imgPart = candidates[0].content.parts.find(p => p.inlineData);
      return imgPart ? `data:image/png;base64,${imgPart.inlineData.data}` : undefined;
    }
    return undefined;
  } catch (error) {
    console.error("Background generation failed:", error);
    return undefined;
  }
};
