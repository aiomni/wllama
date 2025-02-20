import { streamChatService } from '@/service/channel';
import type { ChannelState, OllamaChatRequest, OllamaMessage } from '@/typings';
import { generateUniqueId } from '@/utils';
import { BehaviorSubject, map } from 'rxjs';
import { ChannelSnapShot } from './snapshot';

class ChannelStore {
	#channels$ = new BehaviorSubject<string[]>([]);
	#channel$Map = new Map<string, BehaviorSubject<ChannelState>>();
	#snapshot = new ChannelSnapShot();

	initPromise = this.#snapshot.getChannels().then((snapshotChannels) => {
		for (const channel of snapshotChannels) {
			this.#channel$Map.set(channel.id, new BehaviorSubject(channel));
		}
		return this.#channels$.next(snapshotChannels.map((c) => c.id));
	});

	#addChannel = (id: string, channel: Omit<ChannelState, 'id'>) => {
		const channel$ = new BehaviorSubject<ChannelState>({ id, ...channel });
		this.#channel$Map.set(id, channel$);
		this.#channels$.next([id, ...this.#channels$.getValue()]);

		return channel$;
	};

	newChat = (data: OllamaChatRequest) => {
		const channelId = generateUniqueId();
		const channel = { ...data, created_at: new Date().toLocaleString() };
		const channel$ = this.#addChannel(channelId, channel);

		const message$ = new BehaviorSubject<OllamaMessage>({
			role: 'assistant',
			content: '',
		});

		channel$.next({
			...channel$.value,
			messages: [...channel$.getValue().messages, message$],
		});

		this.#snapshot.newChannel(channel$.getValue());
		this.#snapshot.newStreamMessage(channelId, message$);

		streamChatService(data).subscribe({
			next: (resp) => {
				message$.next({
					...resp.message,
					content: (message$.getValue()?.content ?? '') + resp.message.content,
				});
			},
			complete: () => {
				const messages = [...channel$.value.messages];
				if (message$.value) {
					messages[messages.length - 1] = message$.value;
				}

				channel$.next({
					...channel$.value,
					messages,
				});
			},
		});

		return channel$;
	};

	newMessage = (channelId: string, message: Omit<OllamaMessage, 'role'>) => {
		const channel$ = this.getChannel(channelId);
		if (!channel$) {
			return;
		}

		const message$ = new BehaviorSubject<OllamaMessage>({
			role: 'assistant',
			content: ''
		});

		channel$.next({
			...channel$.value,
			messages: [...channel$.getValue().messages, { ...message, role: 'user' }],
		});

		this.#snapshot.newStreamMessage(channelId, message$);

		streamChatService({
			...channel$.value,
			stream: true,
			messages: channel$.getValue().messages.filter(msg => !(msg instanceof BehaviorSubject)) as OllamaMessage[]
		}).subscribe({
			next: (resp) => {
				message$.next({
					...resp.message,
					content: (message$.getValue()?.content ?? '') + resp.message.content,
				});
			},
			complete: () => {
				const messages = [...channel$.value.messages];
				if (message$.value) {
					messages[messages.length - 1] = message$.value;
				}

				channel$.next({
					...channel$.value,
					messages,
				});
			},
		});

		return channel$;
	}

	getChannels = () => {
		return this.#channels$.getValue().map((id) => this.#channel$Map.get(id)!);
	};

	channelsSubscribe = (
		onStoreChange: (channels: BehaviorSubject<ChannelState>[]) => void,
	) => {
		const sub$$ = this.#channels$
			.pipe(
				map((channels) => {
					return channels.map((id) => this.#channel$Map.get(id)!);
				}),
			)
			.subscribe((value) => {
				onStoreChange(value);
			});

		return () => sub$$.unsubscribe();
	};

	getChannel = (channelId: string) => this.#channel$Map.get(channelId) || null;
}

export const channelStore = new ChannelStore();
