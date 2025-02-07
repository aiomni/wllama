import type { RouteObject } from 'react-router';
import { NewChannel } from './New';

export const ChannelRouter: RouteObject = {
	path: '/channel',
	children: [
		{
			path: 'new',
			Component: NewChannel,
		},
	],
};
