
import { AIConfig, USER_DATA } from "../constants";

/**
 * Simulates a backend API call to retrieve the latest infrastructure persona configuration.
 * In a real scenario, this would hit something like https://api.vishnunath.dev/v1/persona/config
 */
export const fetchDynamicAIConfig = async (): Promise<Partial<AIConfig>> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  // Hypothetical API response logic
  // For demonstration, we'll randomize the status or check a mock environment variable
  const possibleStatuses: AIConfig['availabilityStatus'][] = ['online', 'busy', 'away'];
  const currentStatus = possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];

  const dynamicConfigs: Record<AIConfig['availabilityStatus'], Partial<AIConfig>> = {
    online: {
      availabilityStatus: 'online',
      handoffInstruction: USER_DATA.aiConfig.handoffInstruction,
    },
    busy: {
      availabilityStatus: 'busy',
      awayMessage: "Vishnu is currently managing a heavy deployment cycle. Response times may be delayed.",
      handoffInstruction: "My supervisor is currently in a 'Deep Work' phase managing cluster migrations. I will log your query for his next review window.",
    },
    away: {
      availabilityStatus: 'away',
      awayMessage: "Vishnu is currently offline. System nodes are on autopilot.",
      handoffInstruction: "Systems are currently in maintenance mode. Please use the WhatsApp bridge to leave an urgent message.",
    }
  };

  return dynamicConfigs[currentStatus];
};
