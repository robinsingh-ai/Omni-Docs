
export default class Constants {

    static readonly items: Record<string, Agent> = {
        'Crust Data': 'crust_data',
        'Next.js': 'nextjs',
        'Flutter': 'flutter',
    };

    static signUpDescription: string = `Sign up and Verify your email to get started with AI Chatbot.`;

    static signUpConsent: string = `I confirm that I have read, consent, and agree to AI Chatbot's`;

    static emailSentDescription: string = `An email has been sent to your email address. Please verify your email to get started with AI Chatbot.`;

    static styles = {
        inputClassName: 'w-full p-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out',
        cardBackground: "w-full max-w-md p-8 bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl space-y-6 transition-all duration-300 ease-in-out hover:shadow-blue-500/10",
        primaryButtonClassName: 'w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3 rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg hover:shadow-blue-500/25',
    }
}

export type Agent = 'crust_data' | 'nextjs' | 'flutter';
export type LLM_Model = 'llama2' | 'llama3' | 'llama3.1';
export type UserType = 'user' | 'bot'; 