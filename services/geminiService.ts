
import { GoogleGenAI } from "@google/genai";
import { USER_DATA } from "../constants";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are the "Web-Interface Intelligence Unit" for ${USER_DATA.name}. 

PRIMARY OBJECTIVE: 
Answer technical queries regarding Vishnunath's professional background, skills, and infrastructure experience. 

CORE KNOWLEDGE BASE (TECHNICAL STACK):
1. VIRTUALIZATION: Expert in VMware (vCenter, ESXi), Hyper-V, and high-density cluster management for 16,000+ servers.
2. SERVER INFRA: Specialist in Windows Server (2003-2022) lifecycle, Active Directory, and Hardware (Dell/HP/Lenovo).
3. IT OPERATIONS: ServiceNow (P1-P3 incidents), Moogsoft AIOps, Spectrum Monitoring, and Rubrik Cloud Data Management.
4. CAREER PATH: 6 years at TVS Mobility, currently at HCLTech since Sep 2022.

HANDOFF PROTOCOL (WHEN KNOWLEDGE IS EXHAUSTED):
If the user asks a question about private data, non-technical personal opinions, or highly specific architectural advice that requires Vishnunath's personal judgment, you MUST follow these steps:
1. State clearly that you have reached the boundary of your technical context.
2. Output the exact handoff instruction: "${USER_DATA.aiConfig.handoffInstruction}"
3. Append the mandatory trigger code at the very end of your message: ${USER_DATA.aiConfig.handoffTrigger}

TONE: Professional, technical, efficient, and highly polite.
`;

export interface GeminiResult {
  text: string;
  groundingChunks?: any[];
  isThinking?: boolean;
  needsHandoff?: boolean;
}

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
          systemInstruction: SYSTEM_INSTRUCTION + "\nUse search to cross-reference latest tech documentation if needed.",
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
    // Detect handoff by checking for the specific trigger or phrases indicating human handoff
    const needsHandoff = text.includes(USER_DATA.aiConfig.handoffTrigger) || 
                         text.toLowerCase().includes("reply to you personally") ||
                         text.includes(USER_DATA.aiConfig.handoffInstruction.substring(0, 20));

    return {
      text: text.replace(USER_DATA.aiConfig.handoffTrigger, "").trim(),
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks,
      isThinking: !needsSearch,
      needsHandoff: needsHandoff
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { 
      text: `I apologize, my technical processing units are currently experiencing a high load. ${USER_DATA.aiConfig.handoffInstruction}`,
      needsHandoff: true 
    };
  }
};
