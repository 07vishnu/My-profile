import { AIConfig, USER_DATA } from "../constants";

export interface GeminiResult {
  text: string;
  groundingChunks?: any[];
}

/**
 * Proxy call to server-side /api/chat. Completely prevents exposing API keys
 * and executing server-only @google/genai package on the client side.
 */
export const getPersonaResponse = async (prompt: string, dynamicConfig?: AIConfig): Promise<GeminiResult> => {
  try {
    const config = dynamicConfig || USER_DATA.aiConfig;
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: prompt, config })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 429) {
        sessionStorage.setItem('TECH_BG_DISABLED', 'true');
      }
      return { 
        text: errorData.text || "I apologize, but I am unable to process that request at the moment due to server limits." 
      };
    }

    const data = await response.json();
    return {
      text: data.text,
      groundingChunks: data.groundingChunks
    };
  } catch (error) {
    console.error("Client persona response failed:", error);
    return { 
      text: "I'm having a bit of trouble connecting to my systems. Please try again in a moment or reach out to Vishnunath via the contact section." 
    };
  }
};

/**
 * Proxy call to server-side /api/comic-asset to retrieve technical drafting background schematics.
 */
export const generateComicAsset = async (prompt: string): Promise<string | undefined> => {
  // Respect the session-wide disability flag
  if (sessionStorage.getItem('TECH_BG_DISABLED') === 'true') {
    return undefined;
  }

  try {
    const response = await fetch("/api/comic-asset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      if (response.status === 429) {
        sessionStorage.setItem('TECH_BG_DISABLED', 'true');
      }
      return undefined;
    }

    const data = await response.json();
    if (data.data) {
      return `data:image/png;base64,${data.data}`;
    }
    return undefined;
  } catch (error) {
    console.error("Client comic asset generation failed:", error);
    return undefined;
  }
};
