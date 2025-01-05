export type SenderType = 'user' | 'bot';

export default class Message {
    sender: SenderType;
    text: string;
    timestamp: Date;

    constructor(sender: SenderType, text: string, timestamp: Date = new Date()) {
        this.sender = sender;
        this.text = text;
        this.timestamp = timestamp;
    }

    // Optional: Helper to format the timestamp
    getFormattedTimestamp(): string {
        return this.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}
