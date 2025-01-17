export enum LLM_Provider {
    local_llm,
    openai,
    gemini
}

export interface ResponseProvider {
    generateResponse(message: string, dataSource: string): Promise<any>;
    streamResponse(message: string, dataSource: string, onData: (chunk: any) => void): Promise<void>;
}