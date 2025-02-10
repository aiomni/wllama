import type { RouteObject } from 'react-router';
import { ChannelChat } from './Chat';
import { NewChannel } from './New';

export const ChannelRouter: RouteObject = {
	path: '/channel',
	children: [
		{
			path: 'new',
			Component: NewChannel,
		},
		{
			path: ':channelId',
			Component: ChannelChat,
		},
	],
};
