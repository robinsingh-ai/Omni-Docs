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

    async streamResponse(message: string, dataSource: string, onData: (chunk: any) => void): Promise<void> {
        try {
            const url = `${this.api}/api/v1/query/stream`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: message, index_name: dataSource }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch streaming response from backend.');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            while (reader) {
                const { done, value } = await reader.read();
                if (done) break;
                const decodedChunk = decoder.decode(value, { stream: true })
                try {
                    const parsedChunk = JSON.parse(decodedChunk); // Parse the JSON
                    onData(parsedChunk); // Pass the parsed JSON
                } catch (error) {
                    console.error('Failed to parse chunk:', decodedChunk, error);
                }
            }
        } catch (error) {
            console.error('Error in streamResponse:', error);
            onData('Error occurred while streaming response.');
        }
    }
}
