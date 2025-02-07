import { type FC, useMemo } from 'react';
import {
	createBrowserRouter,
	RouterProvider,
	type RouteObject,
} from 'react-router';

interface RouterAppProps {
	basename?: string;
	routes: RouteObject[];
}

export const RouterApp: FC<RouterAppProps> = ({ routes, basename = '/' }) => {
	const router = useMemo(
		() =>
			createBrowserRouter(routes, {
				basename,
			}),
		[routes, basename],
	);

	return <RouterProvider router={router} />;
};
