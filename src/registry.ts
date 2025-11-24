import { ModelId, ModelCapability } from "./types";

export const MODEL_REGISTRY: Record<ModelId, ModelCapability> = {
    [ModelId.CLAUDE_3_5_SONNET]: {
        id: ModelId.CLAUDE_3_5_SONNET,
        name: "Claude 3.5 Sonnet",
        strengths: ["coding", "reasoning"],
        costProfile: "medium",
        contextWindow: 200000,
        latency: "medium",
    },
    [ModelId.GEMINI_1_5_PRO]: {
        id: ModelId.GEMINI_1_5_PRO,
        name: "Gemini 1.5 Pro",
        strengths: ["coding", "reasoning", "context"],
        costProfile: "medium",
        contextWindow: 2000000,
        latency: "medium",
    },
    [ModelId.GPT_4O]: {
        id: ModelId.GPT_4O,
        name: "GPT-4o",
        strengths: ["reasoning", "creative"],
        costProfile: "high",
        contextWindow: 128000,
        latency: "medium",
    },
    [ModelId.GPT_4O_MINI]: {
        id: ModelId.GPT_4O_MINI,
        name: "GPT-4o Mini",
        strengths: ["speed"],
        costProfile: "low",
        contextWindow: 128000,
        latency: "low",
    },
    [ModelId.GEMINI_FLASH]: {
        id: ModelId.GEMINI_FLASH,
        name: "Gemini Flash",
        strengths: ["speed"],
        costProfile: "low",
        contextWindow: 1000000,
        latency: "low",
    },
    [ModelId.O1_PREVIEW]: {
        id: ModelId.O1_PREVIEW,
        name: "o1 Preview",
        strengths: ["reasoning", "coding"],
        costProfile: "high",
        contextWindow: 128000,
        latency: "high",
    },
};
