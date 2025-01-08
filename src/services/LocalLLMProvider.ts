import { ResponseProvider } from './ResponseProvider';

export class LocalLLMProvider implements ResponseProvider {
    private api = process.env.REACT_APP_BACKEND_URL
    async generateResponse(message: string): Promise<string> {
        try {
            console.log('Sending message to backend:', this.api);
            const response = await fetch(`${this.api}/api/v1/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: message }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch response from backend.');
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Error in LocalLLMProvider:', error);
            return 'Failed to fetch response from backend.';

        }
    }
}
