import { ModelId } from "./types";
import { MODEL_REGISTRY } from "./registry";

export interface Env {
    GEMINI_API_KEY: string;
    CLAUDE_API_KEY: string;
    OPENAI_API_KEY: string;
}

interface RoutingDecision {
    modelId: ModelId;
    reason: string;
}

// Mock client calls for now
async function callModel(modelId: ModelId, prompt: string, env: Env) {
    console.log(`[Router] Dispatching to ${MODEL_REGISTRY[modelId].name}...`);
    return `Response from ${MODEL_REGISTRY[modelId].name}`;
}

function analyzeComplexity(prompt: string): number {
    let score = 0;

    // Length heuristic
    if (prompt.length > 500) score += 20;
    if (prompt.length > 2000) score += 30;

    // Keyword heuristics
    const complexKeywords = ["architecture", "refactor", "debug", "optimize", "security", "race condition"];
    const simpleKeywords = ["typo", "rename", "comment", "docs"];

    if (complexKeywords.some(k => prompt.toLowerCase().includes(k))) score += 40;
    if (simpleKeywords.some(k => prompt.toLowerCase().includes(k))) score -= 10;

    // Code detection (naive)
    if (prompt.includes("```") || prompt.includes("function") || prompt.includes("class")) score += 10;

    return Math.max(0, Math.min(100, score));
}

function detectCodeIntent(prompt: string): boolean {
    const keywords = ["function", "class", "code", "script", "implement", "fix", "bug", "error", "exception"];
    return keywords.some(k => prompt.toLowerCase().includes(k)) || prompt.includes("```");
}

export function decideModel(prompt: string): RoutingDecision {
    const complexity = analyzeComplexity(prompt);
    const isCoding = detectCodeIntent(prompt);

    if (isCoding) {
        if (complexity > 70) {
            return { modelId: ModelId.CLAUDE_3_5_SONNET, reason: "High complexity coding task" };
        } else if (complexity > 40) {
            return { modelId: ModelId.GPT_4O, reason: "Medium complexity coding task" };
        } else {
            return { modelId: ModelId.GEMINI_FLASH, reason: "Simple coding task" };
        }
    } else {
        // General reasoning / chat
        if (complexity > 80) {
            return { modelId: ModelId.O1_PREVIEW, reason: "Complex reasoning required" };
        } else if (complexity > 50) {
            return { modelId: ModelId.GPT_4O, reason: "General complex query" };
        } else {
            return { modelId: ModelId.GPT_4O_MINI, reason: "Simple query" };
        }
    }
}

export async function routeRequest(prompt: string, env: Env) {
    const decision = decideModel(prompt);
    console.log(`[Router] Selected ${decision.modelId} because: ${decision.reason}`);

    return callModel(decision.modelId, prompt, env);
}
