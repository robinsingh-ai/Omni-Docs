import { ResponseProvider } from './ResponseProvider';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiProvider implements ResponseProvider {
    private genAI;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async streamResponse(message: string, dataSource: string, onData: (chunk: string) => void): Promise<void> {
        throw new Error('Method not implemented.');
    }
    async generateResponse(message: string): Promise<string> {
        const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(message);
        const response = await result.response;

        return response.text();
    }
}
