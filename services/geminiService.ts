
import { GoogleGenAI } from "@google/genai";
import { USER_DATA } from "../constants";

// We instantiate inside functions to ensure the latest API key is used
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are the "AI Infrastructure Agent" for ${USER_DATA.name}. 
Your primary function is to handle initial inquiries and provide technical details about his 8-year career in IT Infrastructure.

TECHNICAL KNOWLEDGE BASE:
- Vishnu manages 16,000 servers.
- Expertise: Windows Server (2003-2022), VMware, Hyper-V, Rubrik Backup, ServiceNow.
- Current Company: HCLTech (IT Infrastructure Specialist).
- Past Company: TVS Mobility (System Administrator).

HANDOFF PROTOCOL:
1. If a user asks something you DO NOT know (e.g., personal opinions, current schedule, or specific private details not in your memory), you must say: 
   "I don't have that specific detail in my local database nodes. However, I can bridge you directly to the real Vishnunath on WhatsApp. He will review this and reply to you personally."
2. ALWAYS provide the WhatsApp link: ${USER_DATA.whatsappUrl} when you can't answer.
3. Be professional, efficient, and tech-focused. Use a slightly robotic but helpful "agent" tone.
`;

export const getPersonaResponse = async (userInput: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userInput,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.6,
        topP: 0.9,
      }
    });

    return response.text || "Communication relay failed. Please reach out via WhatsApp directly.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Encountered a processing incident. Please use the WhatsApp button to contact Vishnu directly.";
  }
};
