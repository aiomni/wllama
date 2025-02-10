import type { OllamaVersionResponse } from '@/typings';

export const getOllamaVersionAPI = () => {
	return fetch('/api/version').then(
		(resp) => resp.json() as Promise<OllamaVersionResponse>,
	);
};
