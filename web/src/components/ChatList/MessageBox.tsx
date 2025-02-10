import type { OllamaMessage } from '@/typings';
import { type FC, useEffect, useMemo, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { ChatBubble } from './ChatBubble';

interface MessageBoxProps {
	message: OllamaMessage | BehaviorSubject<OllamaMessage>;
}

const StreamMessageBox: FC<{ message$: BehaviorSubject<OllamaMessage> }> = ({
	message$,
}) => {
	const [message, setMessage] = useState(message$.getValue());

	const sub$ = useMemo(() => {
		message$.subscribe((msg) => {
			setMessage(msg);
		});
	}, [message$]);

	useEffect(() => sub$, [sub$]);

	return <ChatBubble isStream message={message} />;
};

export const MessageBox: FC<MessageBoxProps> = ({ message }) => {
	if (message instanceof BehaviorSubject) {
		return <StreamMessageBox message$={message} />;
	}

	return <ChatBubble message={message} />;
};
