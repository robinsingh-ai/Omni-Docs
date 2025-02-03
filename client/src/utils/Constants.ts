import { DataSource } from "../redux/reducers/dataSlice";

export default class Constants {

    static readonly items: Record<string, DataSource> = {
        'Crust Data': 'crust_data',
        'Next.js': 'nextjs',
        'Flutter': 'flutter',
    };

    static signUpDescription: string = `Sign up and Verify your email to get started with AI Chatbot.`;

    static signUpConsent: string = `I confirm that I have read, consent, and agree to AI Chatbot's`;
}