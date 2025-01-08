import { GeminiProvider } from './geminiApi';
import { LocalLLMProvider } from './LocalLLMProvider';
import { OpenAIProvider } from './OpenAIProvider';
import { LLM_Provider, ResponseProvider } from './ResponseProvider';

export class ResponseProviderFactory {
    static getProvider(providerName: LLM_Provider): ResponseProvider {
        const apiKey = process.env[`${providerName.toString().toUpperCase()}_API_KEY`] || '';
        switch (providerName) {
            case LLM_Provider.gemini:
                return new GeminiProvider(apiKey);
            case LLM_Provider.openai:
                return new OpenAIProvider(apiKey);
            case LLM_Provider.local_llm:
                return new LocalLLMProvider();
            default:
                throw new Error(`Unknown provider: ${providerName}`);
        }
    }
}
