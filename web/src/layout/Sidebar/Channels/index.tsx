import { useChannels } from '@/context/channel';
import clsx from 'clsx';
import { type FC, useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router';

import './style.css';
import type { OllamaMessage } from '@/typings';

export const Channels: FC = () => {
	const channels = useChannels();
	const { channelId } = useParams();
	const location = useLocation();

	const isChannelChatPage = useMemo(
		() => location.pathname.startsWith('/channel/'),
		[location.pathname],
	);

	return (
		<ul className="omni-channels w-full mt-8 flex flex-col gap-4">
			{channels.map((channel$) => {
				const channel = channel$.getValue();

				return (
					<li
						key={channel.id}
						className={clsx(
							'omni-channels_item rounded-lg ml-[20px] overflow-hidden',
							{
								active: isChannelChatPage && channelId === channel.id,
							},
						)}
					>
						<Link
							className="py-2 px-3 cursor-pointer flex flex-1 flex justify-between gap-2"
							to={`/channel/${channel.id}`}
						>
							<span className="flex-1 overflow-hidden whitespace-nowrap">
								{channel.title ||
									(channel.messages[0] as OllamaMessage)?.content ||
									'New Chat'}
							</span>
							{isChannelChatPage && channelId === channel.id && (
								<span
									className="block w-[20px] h-[20px]"
									style={{
										background: 'url("/web/icons/checked.svg") 0 0 / 100% 100%',
									}}
								/>
							)}
						</Link>
					</li>
				);
			})}
		</ul>
	);
};
