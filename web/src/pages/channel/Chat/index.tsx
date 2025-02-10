import { ChatList } from '@/components/ChatList';
import { Textarea } from '@/components/Textarea';
import { useChannel } from '@/context/channel';
import { type FC, useState } from 'react';
import { useParams } from 'react-router';

export const ChannelChat: FC = () => {
	const { channelId } = useParams() as { channelId: string };
	const channel = useChannel(channelId);

	const [inputMessage, setInputMessage] = useState('');

	if (!channel) {
		return (
			<div className="w-full h-screen p-[20px]">
				<div className="h-full bg-white bordered flex flex-col justify-center items-center text-[26px] font-bold">
					Unknown Channel.
				</div>
			</div>
		);
	}

	return (
		<div className="w-full h-screen p-[20px] flex flex-col gap-4 overflow-hidden">
			<div className="w-full flex-1 overflow-hidden bg-white bordered flex flex-col justify-center items-center text-[26px] font-bold">
				<ChatList key={`chat_list_${channelId}`} messages={channel.messages} />
			</div>
			<Textarea
				className="w-full h-[200px] min-h-[200px]"
				value={inputMessage}
				onChange={setInputMessage}
				// onKeyDown={handleKeyPress}
			/>
		</div>
	);
};
