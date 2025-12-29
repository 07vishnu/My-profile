
import { GoogleGenAI } from "@google/genai";
import { USER_DATA } from "../constants";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are the "AI Portfolio Agent" for ${USER_DATA.name}. 
Your purpose is to answer technical and professional questions about his 8+ years of IT Infrastructure experience.

YOUR KNOWLEDGE:
- Servers: 16,000+ managed.
- Tech: Windows Server (2003-2022), VMware, Hyper-V, Rubrik, ServiceNow.
- Career: Currently HCLTech, previously TVS Mobility.

STRICT FALLBACK PROTOCOL:
If a user asks for personal details, current availability, or ANY information not provided in the technical summaries above, you MUST respond with this exact sentiment:
"I don't have that specific information in my current data nodes. However, I have notified Vishnunath. He will come and reply to you personally on WhatsApp shortly."

Follow this by providing the WhatsApp contact bridge: ${USER_DATA.whatsappUrl}
Always maintain a professional, high-end infrastructure-expert persona.
`;

export const getPersonaResponse = async (userInput: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userInput,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4,
        topP: 0.9,
      }
    });

    return response.text || "Agent relay offline. Please use the WhatsApp button to contact Vishnu.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Infrastructure monitoring indicates a connection timeout. Please contact Vishnu via WhatsApp: " + USER_DATA.phoneNumber;
  }
};
