import { GeminiProvider } from './geminiApi';
import { LocalLLMProvider } from './LocalLLMProvider';
import { OpenAIProvider } from './OpenAIProvider';
import { LLM_Provider, ResponseProvider } from './ResponseProvider';

export class ResponseProviderFactory {
    private static providers: Map<LLM_Provider, ResponseProvider> = new Map();

    static getProvider(providerName: LLM_Provider): ResponseProvider {
        if (!this.providers.has(providerName)) {
            const apiKey = process.env[`${providerName.toString().toUpperCase()}_API_KEY`] || '';
            let provider: ResponseProvider;

            switch (providerName) {
                case LLM_Provider.gemini:
                    provider = new GeminiProvider(apiKey);
                    break;
                case LLM_Provider.openai:
                    provider = new OpenAIProvider(apiKey);
                    break;
                case LLM_Provider.local_llm:
                    provider = new LocalLLMProvider();
                    break;
                default:
                    throw new Error(`Unknown provider: ${providerName}`);
            }

            this.providers.set(providerName, provider);
        }

        return this.providers.get(providerName)!;
    }
}

