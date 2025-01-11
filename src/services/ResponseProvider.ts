export enum LLM_Provider {
    local_llm,
    openai,
    gemini
}

export interface ResponseProvider {
    generateResponse(message: string, dataSource: string): Promise<any>;
}