import { useOllamaVersion } from '@/context/Ollama';
import type { FC } from 'react';

export const OllamaVersion: FC = () => {
	const version = useOllamaVersion();

	return (
		<div className="font-light text-slate-4 my-1 text-xs">
			Ollama Version: {version}
		</div>
	);
};
