import { ResponseProvider } from './ResponseProvider';

export class OpenAIProvider implements ResponseProvider {
    private openAI: any;

    constructor(apiKey: string) {
        // const configuration = new Configuration({ apiKey });
        // this.openAI = new OpenAIApi(configuration);
    }

    async generateResponse(message: string): Promise<string> {
        const result = await this.openAI.createChatCompletion({
            model: 'gpt-4',
            messages: [{ role: 'user', content: message }],
        });

        return result.data.choices[0]?.message?.content || '';
    }
}