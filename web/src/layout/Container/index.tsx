import type { FC } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from '../Sidebar';

export const Container: FC = () => {
	return (
		<main className="w-full h-full flex justify-center">
			<div className="min-w-[800px] w-full h-full flex">
				<Sidebar />
				<div className='flex-1 overflow-hidden'>
					<Outlet />
				</div>
			</div>
		</main>
	);
};
