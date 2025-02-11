import type { FC } from 'react';
import { useNavigate } from 'react-router';

import Brand from '@/components/Brand';
import Button from '@/components/Button';

import { Channels } from './Channels';
import { OllamaVersion } from './OllamaVersion';

export const Sidebar: FC = () => {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-start px-0 py-[20px] w-[280px] min-w-[280px] z-1">
			<Brand />
			<OllamaVersion />
			<div className="w-full pl-[20px] my-4">
				<Button className="w-full" onClick={() => navigate('/channel/new')}>
					New Chat
				</Button>
			</div>

			<Channels />
		</div>
	);
};
