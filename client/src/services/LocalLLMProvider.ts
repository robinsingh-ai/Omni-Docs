import { ResponseProvider } from './ResponseProvider';

export class LocalLLMProvider implements ResponseProvider {
    private api = process.env.REACT_APP_BACKEND_URL
    private abortController: AbortController | null = null;

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
            return 'Failed to fetch response from backend.';

        }
    }

    async streamResponse(message: string, agent: string, onData: (chunk: any) => void): Promise<void> {
        const model_name = process.env.REACT_APP_MODEL_NAME || 'llama3.1';
        this.abortController = new AbortController();
        try {
            const url = `${this.api}/api/v1/query/stream`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model_name: model_name,
                    query: message, index_name: agent
                }),
                signal: this.abortController.signal,
            });

            if (!response.ok || response.status !== 200) {
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
            if ((error as Error).name === 'AbortError') {
                console.log('Streaming aborted.');
            } else {
                throw new Error('Failed to fetch streaming response from backend.');
            }
        } finally {
            this.abortController = null; // Reset controller after completion or cancellation
        }
    }

    stopStreaming() {
        if (this.abortController) {
            console.log('Aborted...');
            this.abortController.abort();
            this.abortController = null;
        }
    }
}
