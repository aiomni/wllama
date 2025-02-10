import type { BehaviorSubject } from 'rxjs';
import type { OllamaChatRequest, OllamaMessage } from './ollama';

export type ChannelState = {
	id: string;
	title?: string;
	created_at: string;
	messages: Array<OllamaMessage | BehaviorSubject<OllamaMessage>>;
} & Omit<OllamaChatRequest, 'stream' | 'messages'>;
