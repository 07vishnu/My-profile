import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Infrastructure Persona Context (Safe static server-side copy of USER_DATA)
const USER_CONTEXT = {
  name: "M. VISHNUNATH",
  title: "IT Infrastructure Specialist (Windows & VM Support)",
  bio: "I am a seasoned System Administrator with over 8 years of professional experience. My journey began with 6 years at TVS Mobility (2016-2022) and currently continues at HCL (since Sep 2022), where I manage a massive environment of approximately 16,000 servers. I specialize in high-stakes incident management (P1-P3), virtualization at scale, and robust backup solutions.",
  location: "Madurai, Tamil Nadu, India",
  email: "vishnunath.m95@gmail.com",
  skills: [
    "Windows Server (2003-2022)",
    "VMware / vCenter / ESXi",
    "Networking & Connectivity",
    "Hyper-V Administration",
    "ServiceNow / ITSM",
    "AI & AI Agents",
    "Monitoring (Spectrum)",
    "Backup (Rubrik)",
    "Hardware Diagnostics"
  ],
  experience: [
    {
      company: "HCLTech",
      role: "IT Infrastructure Specialist",
      period: "Sep 2022 - Present",
      description: "Managing 16,000+ servers including VCenter, Hyper-V, and VMware. Handling P1/P2/P3 user incidents via ServiceNow. Monitoring via Moogsoft and Spectrum. Vendor management for physical hardware failures and ESX hosts. Managing enterprise backups using Rubrik."
    },
    {
      company: "TVS MOBILITY",
      role: "System Administrator",
      period: "2016 - Aug 2022",
      description: "Managed Active Directory, server infrastructure, and Office 365. Handled hardware/software issues and network configurations for 6 years, ensuring high availability and proactive maintenance. Conducted proactive assessments of infrastructure capacity and performance."
    }
  ]
};

// Helper to initialize correct Google GenAI SDK client on the server
const getAI = () => {
  const key = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!key || key === "undefined") {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

const isQuotaError = (error: any): boolean => {
  const errorMessage = error?.message?.toLowerCase() || "";
  return (
    errorMessage.includes("429") || 
    errorMessage.includes("resource_exhausted") || 
    error?.status === 429
  );
};

// API: Persona responses proxy
app.post("/api/chat", async (req, res) => {
  try {
    const { message, config } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getAI();
    const status = config?.availabilityStatus || 'online';
    const awayMessage = config?.awayMessage || "";
    const handoffInstruction = config?.handoffInstruction || "Flagged for manual review.";

    const systemInstruction = `You are the AI assistant for M. Vishnunath, an IT Infrastructure Specialist with 8+ years of experience.
    
    CONTEXT:
    - Name: ${USER_CONTEXT.name}
    - Current Role: ${USER_CONTEXT.title} at HCLTech
    - Bio: ${USER_CONTEXT.bio}
    - Location: ${USER_CONTEXT.location}
    - Expertise: ${USER_CONTEXT.skills.join(", ")}
    - Experience Summary: ${USER_CONTEXT.experience.map(e => `${e.role} at ${e.company} (${e.period})`).join("; ")}
    - Current Status: ${status.toUpperCase()}
    
    GUIDELINES:
    1. Be professional, technical, and helpful.
    2. Focus on answering queries about Vishnunath's skills in Windows Server, VMware, Hyper-V, and Infrastructure Management.
    3. If the user asks about hiring or direct contact, provide his email (${USER_CONTEXT.email}) or mention the WhatsApp link.
    4. If the query is complex or outside the provided context, or if the current status is not 'online', use this handoff protocol: "${handoffInstruction}"
    5. Always maintain the persona of an expert assistant.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: message,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }]
      },
    });

    const candidate = response.candidates?.[0];
    res.json({
      text: response.text || "I apologize, but I am unable to process that request at the moment.",
      groundingChunks: candidate?.groundingMetadata?.groundingChunks || []
    });

  } catch (error: any) {
    console.error("Server API /api/chat error:", error);
    if (error.message === "API_KEY_MISSING") {
      return res.status(401).json({ 
        error: "API_KEY_MISSING",
        text: "The AI agent is currently offline (API configuration missing). Please contact Vishnunath directly via email or WhatsApp." 
      });
    }
    if (isQuotaError(error)) {
      return res.status(429).json({
        error: "QUOTA_EXHAUSTED",
        text: "The infrastructure AI is currently experiencing high demand (API quota reached). Please contact Vishnunath directly via WhatsApp or Email."
      });
    }
    res.status(500).json({ 
      error: "INTERNAL_ERROR",
      text: "I'm having a bit of trouble connecting to my systems. Please try again in a moment or reach out to Vishnunath via the contact section." 
    });
  }
});

// API: Technical drafting comic background generator proxy
app.post("/api/comic-asset", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

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
        const imgPart = firstCandidate.content.parts.find((p: any) => p.inlineData);
        if (imgPart && imgPart.inlineData) {
          return res.json({ data: imgPart.inlineData.data });
        }
      }
    }
    res.status(404).json({ error: "No image generated" });
  } catch (error: any) {
    if (isQuotaError(error)) {
      return res.status(429).json({ error: "QUOTA_EXHAUSTED" });
    }
    console.error("Server API /api/comic-asset error:", error);
    res.status(500).json({ error: "Video asset generated error" });
  }
});

async function start() {
  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start();
