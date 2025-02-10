import type { OllamaChatRequest, OllamaChatResponse } from '@/typings';
import { Observable, switchMap } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

export const streamChatService = (data: OllamaChatRequest) => {
	return fromFetch('/api/chat/completions', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ ...data, stream: true }),
	}).pipe(
		switchMap((resp) => {
			if (!resp.ok || !resp.body) {
				throw new Error(`Error fetching stream: ${resp.statusText}`);
			}

			const reader = resp.body.getReader();
			const decoder = new TextDecoder();

			return new Observable<OllamaChatResponse>((subscriber) => {
				const read = async () => {
					const { done, value } = await reader.read();

					if (done) {
						subscriber.complete();
						return;
					}

					const text = decoder.decode(value, { stream: true });
					const lines = text.split('\n').filter(Boolean);

					for (const line of lines) {
						try {
							const message = JSON.parse(line);
							subscriber.next(message);
							read(); // 继续读取
						} catch (error) {
							console.info(lines, line);
							console.error(error);
						}
					}
				};

				read();

				return () => {
					reader.cancel().catch((err) => subscriber.error(err));
				};
			});
		}),
	);
};
