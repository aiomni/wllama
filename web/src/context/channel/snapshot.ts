import type { ChannelState, OllamaMessage } from "@/typings";
import { openDB } from "idb";
import { BehaviorSubject, filter } from "rxjs";

const ChannelStoreName = "channels";
const MessageStoreName = "messages";

export class ChannelSnapShot {
	#dbPromise = openDB("xllama", 1, {
		upgrade(db) {
			if (!db.objectStoreNames.contains(ChannelStoreName)) {
				const channelsModel = db.createObjectStore(ChannelStoreName, {
					keyPath: "id",
					autoIncrement: false,
				});
				channelsModel.createIndex("id", "id", { unique: true });
				channelsModel.createIndex("title", "title", { unique: false });
				channelsModel.createIndex("created_at", "created_at", {
					unique: false,
				});
				channelsModel.createIndex("model", "model", { unique: false });
				channelsModel.createIndex("from", "from", { unique: false });
				channelsModel.createIndex("template", "template", { unique: false });
				channelsModel.createIndex("system", "system", { unique: false });
			}

			if (!db.objectStoreNames.contains(MessageStoreName)) {
				const messageModel = db.createObjectStore(MessageStoreName, {
					keyPath: "id",
					autoIncrement: true,
				});
				messageModel.createIndex("id", "id", { unique: true });
				messageModel.createIndex("channel", "channel", { unique: false });
				messageModel.createIndex("role", "role", { unique: false });
				messageModel.createIndex("content", "content", { unique: false });
				messageModel.createIndex("tool_calls", "tool_calls", { unique: false });
			}
		},
	});

	newChannel = async (channel: ChannelState) => {
		const db = await this.#dbPromise;
		const tx = db.transaction(
			[ChannelStoreName, MessageStoreName],
			"readwrite",
		);
		const { messages, ...rest } = channel;
		try {
			await tx.objectStore(ChannelStoreName).add(rest);

			await Promise.all(
				messages.map((message) => {
					if (message instanceof BehaviorSubject) {
						return;
					}
					tx.objectStore(MessageStoreName).add({
						channel: channel.id,
						...message,
					});
				}),
			);

			// 事务完成，数据提交
			await tx.done;
		} catch (err) {
			console.error("New Chat Snapshot error:", err);
		}
	};

	newStreamMessage = async (
		channelId: string,
		message$: BehaviorSubject<OllamaMessage>,
	) => {
		const db = await this.#dbPromise;
		const id = await db.add(MessageStoreName, {
			...message$.getValue(),
			channelId,
		});

		await new Promise((resolve, reject) => {
			message$.pipe(filter((m) => !!m)).subscribe({
				next: (message) => {
					db.put(MessageStoreName, {
						...message,
						id,
						channel: channelId,
					});
				},
				complete: () => {
					const message = db.get(MessageStoreName, id);
					resolve(message);
				},
				error: reject,
			});
		});
	};

	getChannels = async () => {
		const db = await this.#dbPromise;

		const messages = await db.getAll(MessageStoreName);
		const channels = await db.getAll(ChannelStoreName);

		const messageMap = messages.reduce((acc, cur) => {
			acc[cur.channel] = [...(acc[cur.channel] ?? []), cur];
			return acc;
		}, {});

		return channels.reverse().map((channel) => ({
			...channel,
			messages: messageMap[channel.id],
		}));
	};
}
