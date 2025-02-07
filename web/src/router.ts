import type { RouteObject } from 'react-router';

import { Container } from './layout/Container';
import { ChannelRouter } from './pages/channel/router';
import { HomeRouter } from './pages/home/router';

export default [
	{
		path: '/',
		Component: Container,
		children: [HomeRouter, ChannelRouter],
	},
] as RouteObject[];
