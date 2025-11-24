export enum ModelId {
    GPT_4O = "gpt-4o",
    GPT_4O_MINI = "gpt-4o-mini",
    CLAUDE_3_5_SONNET = "claude-3-5-sonnet",
    GEMINI_1_5_PRO = "gemini-1.5-pro",
    GEMINI_FLASH = "gemini-flash",
    O1_PREVIEW = "o1-preview",
}

export interface ModelCapability {
    id: ModelId;
    name: string;
    strengths: ("coding" | "reasoning" | "speed" | "creative" | "context")[];
    costProfile: "low" | "medium" | "high";
    contextWindow: number;
    latency: "low" | "medium" | "high";
}
