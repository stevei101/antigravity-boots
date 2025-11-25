import { ModelId, ModelCapability } from "./types";

export const MODEL_REGISTRY: Record<ModelId, ModelCapability> = {
    [ModelId.GEMINI_3_PRO_HIGH]: {
        id: ModelId.GEMINI_3_PRO_HIGH,
        name: "Gemini 3 Pro (High)",
        strengths: ["coding", "reasoning", "context"],
        costProfile: "high",
        contextWindow: 2000000,
        latency: "medium",
    },
    [ModelId.GEMINI_3_PRO_LOW]: {
        id: ModelId.GEMINI_3_PRO_LOW,
        name: "Gemini 3 Pro (Low)",
        strengths: ["speed", "coding"],
        costProfile: "low",
        contextWindow: 1000000,
        latency: "low",
    },
    [ModelId.CLAUDE_SONNET_4_5]: {
        id: ModelId.CLAUDE_SONNET_4_5,
        name: "Claude Sonnet 4.5",
        strengths: ["coding", "reasoning"],
        costProfile: "medium",
        contextWindow: 200000,
        latency: "medium",
    },
    [ModelId.CLAUDE_SONNET_4_5_THINKING]: {
        id: ModelId.CLAUDE_SONNET_4_5_THINKING,
        name: "Claude Sonnet 4.5 (Thinking)",
        strengths: ["reasoning", "coding"],
        costProfile: "high",
        contextWindow: 200000,
        latency: "high",
    },
    [ModelId.GPT_OSS_120B_MEDIUM]: {
        id: ModelId.GPT_OSS_120B_MEDIUM,
        name: "GPT OSS 120B (Medium)",
        strengths: ["creative", "reasoning"],
        costProfile: "medium",
        contextWindow: 128000,
        latency: "medium",
    },
};
