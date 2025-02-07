import type { FC } from 'react';
import { useNavigate } from 'react-router';

import Button from '@/components/Button';

import Brand from './components/Brand';
import { OllamaVersion } from './components/OllamaVersion';

export const Sidebar: FC = () => {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-start px-0 py-[20px] w-[280px] min-w-[280px] z-1">
			<Brand />
			<OllamaVersion />
			<Button
				className="w-[200px] my-4"
				onClick={() => navigate('/channel/new')}
			>
				Add New Chat
			</Button>
		</div>
	);
};
