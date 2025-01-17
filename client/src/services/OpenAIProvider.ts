import { ResponseProvider } from './ResponseProvider';

export class OpenAIProvider implements ResponseProvider {
    private openAI: any;

    constructor(apiKey: string) {
        this.openAI = require('openai')(apiKey);
    }
    async streamResponse(message: string, dataSource: string, onData: (chunk: string) => void): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async generateResponse(message: string): Promise<string> {
        const result = await this.openAI.createChatCompletion({
            model: 'gpt-4',
            messages: [{ role: 'user', content: message }],
        });

        return result.data.choices[0]?.message?.content || '';
    }
}