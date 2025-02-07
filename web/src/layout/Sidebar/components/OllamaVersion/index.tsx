import type { FC } from 'react';
import { useOllamaVersion } from '@/context/Ollama';

export const OllamaVersion: FC = () => {
	const version = useOllamaVersion();

	return (<div className='text-slate-4 my-1'>Ollama Version: {version}</div>);
};
