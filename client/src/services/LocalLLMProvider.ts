import { ResponseProvider } from './ResponseProvider';

export class LocalLLMProvider implements ResponseProvider {
    private api = process.env.REACT_APP_BACKEND_URL
    async generateResponse(message: string, dataSource: string): Promise<string> {
        try {
            const url = `${this.api}/api/v1/query`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: message, index_name: dataSource }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch response from backend.');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error in LocalLLMProvider:', error);
            return 'Failed to fetch response from backend.';

        }
    }
}
