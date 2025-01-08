import { ResponseProvider } from './ResponseProvider';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiProvider implements ResponseProvider {
    private genAI;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async generateResponse(message: string): Promise<string> {
        const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(message);
        const response = await result.response;

        return response.text();
    }
}
