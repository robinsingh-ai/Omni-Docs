import axios from 'axios';

const geminiApi = {
    async getResponse(message: string): Promise<string> {
        try {
            const { data } = await axios.post('/api/gemini', { prompt: message });
            return data.response;
        } catch (error) {
            return 'Something went wrong. Please try again later.';
        }
    },
};

export default geminiApi;
