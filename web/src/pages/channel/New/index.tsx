import { Marked } from '@/components/Marked';
import { Select } from '@/components/Select';
import { Textarea } from '@/components/Textarea';
import { NO_MODEL_TEXT } from '@/constants/markdown';
import { useNewChat } from '@/context/channel';
import { useOllamaModels } from '@/context/ollama';
import {
	type FC,
	type KeyboardEventHandler,
	type PropsWithChildren,
	useMemo,
	useState,
} from 'react';
import { useNavigate } from 'react-router';

export const NewChannel: FC<PropsWithChildren> = () => {
	const [inputMessage, setInputMessage] = useState('');
	const [model, setModel] = useState('deepseek-r1:32b');
	const navigate = useNavigate();
	const newChat = useNewChat();
	const models = useOllamaModels();

	const modelOptions = useMemo(
		() => models.map((m) => ({ label: m.name, value: m.model })),
		[models],
	);

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
			navigate(`/channel/${c.getValue().id}`);
		}
	};

	if (models.length < 1) {
		return (
			<div className="w-full h-screen p-[20px] flex flex-col gap-4">
				<div className="w-full flex-1 bg-white bordered flex flex-col justify-center items-center p-10">
					<div className="w-full max-w-[850px]">
						<Marked content={NO_MODEL_TEXT} />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full h-screen p-[20px] flex flex-col gap-4">
			<div className="w-full flex-1 bg-white bordered flex flex-col justify-center items-center text-[26px] font-bold">
				<div className="w-3xl flex flex-col justify-center items-center ">
					<h3 className="text-5xl mb-10">New Chat</h3>
					<Select
						placeholder="Select Model to Chat"
						options={modelOptions}
						value={model}
						onChange={setModel}
					/>
				</div>
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
