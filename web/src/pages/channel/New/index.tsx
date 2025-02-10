import { Textarea } from '@/components/Textarea';
import { useNewChat } from '@/context/channel';
import {
	type FC,
	type KeyboardEventHandler,
	type PropsWithChildren,
	useState,
} from 'react';

export const NewChannel: FC<PropsWithChildren> = () => {
	const [inputMessage, setInputMessage] = useState('');
	const newChat = useNewChat();

	const handleKeyPress: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
		if (!e.nativeEvent.isComposing && !e.shiftKey && e.key === 'Enter') {
			e.preventDefault();
			setInputMessage('');
			const c = newChat({
				model: 'deepseek-r1:32b',
				messages: [
					{
						role: 'user',
						content: inputMessage,
					},
				],
			});
			console.log(c.getValue().id);
		}
	};

	return (
		<div className="w-full h-screen p-[20px] flex flex-col gap-4">
			<div className="w-full flex-1 bg-white bordered flex flex-col justify-center items-center text-[26px] font-bold">
				New Chat
			</div>
			<Textarea
				className="w-full h-[200px] min-h-[200px]"
				value={inputMessage}
				onChange={setInputMessage}
				onKeyDown={handleKeyPress}
			/>
		</div>
	);
};
