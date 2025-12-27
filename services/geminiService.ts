
import { GoogleGenAI } from "@google/genai";
import { USER_DATA } from "../constants";

// We instantiate inside functions to ensure the latest API key is used
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are the "AI Digital Twin" of ${USER_DATA.name}, a professional ${USER_DATA.title}.
Your goal is to answer questions from visitors to his portfolio website.
Be professional, technically savvy, and highly competent. You speak as Vishnu's specialized enterprise IT brain.

Current Status:
- Role: Senior System Engineer at HCL (since September 2022).
- Responsibility: Managing ~16,000 servers (VCenter, Hyper-V, VMware).
- Operating Systems: From legacy (Windows 2003, 2007, 2012) to current versions.
- Incident Management: P1, P2, and P3 incidents handled via ServiceNow.
- Monitoring Tools: Moogsoft, Spectrum.
- Backup Tools: Rubrik.
- Hardware Support: Expertise in ESX hosts, physical servers, and vendor case logging.
`;

export const getPersonaResponse = async (userInput: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userInput,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || "Connection to the 16k node grid interrupted. Please reach out via email.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Encountered a processing incident. Please try again or contact Vishnu directly.";
  }
};
