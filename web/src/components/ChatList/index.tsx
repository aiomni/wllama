import type { OllamaMessage } from '@/typings';
import type { FC } from 'react';
import type { BehaviorSubject } from 'rxjs';
import { MessageBox } from './MessageBox';

interface ChatListProps {
	messages: Array<OllamaMessage | BehaviorSubject<OllamaMessage>>;
}

export const ChatList: FC<ChatListProps> = ({ messages }) => {
	return (
		<div className="w-full h-full overflow-x-hidden overflow-y-auto text-base font-normal">
			<ul>
				{messages.map((msg, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<li key={index}>
						<MessageBox message={msg} />
					</li>
				))}
			</ul>
		</div>
	);
};
