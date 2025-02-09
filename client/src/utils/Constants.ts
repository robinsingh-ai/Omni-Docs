
export default class Constants {

    static readonly items: Record<string, Agent> = {
        'Crust Data': 'crust_data',
        'Next.js': 'nextjs',
        'Flutter': 'flutter',
    };

    static signUpDescription: string = `Sign up and Verify your email to get started with AI Chatbot.`;

    static signUpConsent: string = `I confirm that I have read, consent, and agree to AI Chatbot's`;

    static emailSentDescription: string = `An email has been sent to your email address. Please verify your email to get started with AI Chatbot.`;
}

export type Agent = 'crust_data' | 'nextjs' | 'flutter';
export type LLM_Model = 'llama2' | 'llama3' | 'llama3.1';
export type UserType = 'user' | 'bot'; 