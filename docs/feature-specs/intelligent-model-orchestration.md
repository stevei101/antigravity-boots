# Feature Request: Intelligent Model Orchestration (Auto-Select Mode)

## 1. Summary
**Title:** Implement "Silent" Smart Model Routing (No-Prompt Mode)
**Context:** Currently, the system prompts the user to select a specific model (e.g., Gemini, GPT-4, Claude) for complex tasks. This interrupts the flow state.
**Goal:** We want to implement an orchestrator layer that automatically analyzes the prompt complexity and context, then routes it to the "Best Available" model without user intervention.

## 2. User Story
As a Developer using Antigravity Boots, I want the IDE/Agent to automatically decide which underlying LLM is best suited for my current task (e.g., coding vs. creative writing) so that I can focus purely on the problem statement without managing model configurations.

## 3. Technical Objectives
Create a routing layer (middleware) that evaluates the prompt intention and selects the backend model based on performance profiles.
- **Coding/Refactoring Tasks:** Route to Claude 3.5 Sonnet or Gemini 1.5 Pro (High reasoning/context).
- **Simple Chat/Docs:** Route to GPT-4o-mini or Gemini Flash (Low latency).
- **Complex Reasoning:** Route to o1-preview or GPT-4o.

## 4. Acceptance Criteria
- **Configuration:** A global setting `model_mode: "auto"` is available in the config.
- **Heuristic Analysis:** The system detects keywords (e.g., "refactor", "bug", "write function") to trigger coding models.
- **Silent Execution:** The user is not prompted to confirm the model choice.
- **Transparency:** (Optional) The UI shows a small indicator of which model was used after the response starts streaming (e.g., "⚡ Generated via Gemini 1.5").

## 5. Implementation Strategy (Draft)
```python
# Pseudo-code for Router Logic
def route_request(prompt: str, context: list):
    complexity_score = analyze_complexity(prompt)
    is_coding_task = detect_code_intent(prompt)
    
    if is_coding_task and complexity_score > 80:
        return ModelClient.CLAUDE_3_5_SONNET
    elif complexity_score > 50:
        return ModelClient.GPT_4O
    else:
        return ModelClient.GEMINI_FLASH
```

## 6. Implementation Tasks
1. **Define Model Capabilities Map:** Create a JSON/Dict mapping models to their strengths.
2. **Build Router Service:** Implement the logic to classify prompts.
3. **Update UI:** Remove the blocking modal/dropdown when `auto` mode is enabled.
4. **Logging:** Ensure we log which model was selected for debugging purposes.
