export enum ModelId {
    GEMINI_3_PRO_HIGH = "gemini-3-pro-high",
    GEMINI_3_PRO_LOW = "gemini-3-pro-low",
    CLAUDE_SONNET_4_5 = "claude-sonnet-4.5",
    CLAUDE_SONNET_4_5_THINKING = "claude-sonnet-4.5-thinking",
    GPT_OSS_120B_MEDIUM = "gpt-oss-120b-medium",
}

export interface ModelCapability {
    id: ModelId;
    name: string;
    strengths: ("coding" | "reasoning" | "speed" | "creative" | "context")[];
    costProfile: "low" | "medium" | "high";
    contextWindow: number;
    latency: "low" | "medium" | "high";
}
