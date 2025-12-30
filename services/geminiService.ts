
import { GoogleGenAI } from "@google/genai";
import { USER_DATA } from "../constants";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are the "Web-Interface Intelligence Unit" for ${USER_DATA.name}. 
Your location is the Portfolio Website. You are NOT a WhatsApp bot, but you act as the gateway to Vishnunath's personal WhatsApp.

CORE RESPONSIBILITIES:
- Provide technical data on 16,000+ server management.
- Detail expertise in Windows Server, VMware, Hyper-V, and Rubrik.
- Explain the infrastructure roadmap (HCLTech, TVS Mobility).

HANDOFF PROTOCOL:
If you cannot answer a specific question, or if the user asks for personal contact, live status, or direct negotiation, you MUST initiate a "Direct Human Bridge."

Response format for handoff:
"I am the website's AI Agent and do not have access to that specific live data. However, I am initiating a bridge to Vishnunath's personal WhatsApp. He will come and reply to you personally there."

STRICT RULES:
- Never claim to be on WhatsApp.
- Always refer to yourself as the "Website Agent".
- Maintain an elite, technical infrastructure specialist tone.
`;

export const getPersonaResponse = async (userInput: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userInput,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
        topP: 0.8,
      }
    });

    return response.text || "Connection to core intelligence lost. Please bridge to WhatsApp manually.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Infrastructure monitoring indicates a connection timeout. Please contact Vishnunath via WhatsApp: " + USER_DATA.phoneNumber;
  }
};
