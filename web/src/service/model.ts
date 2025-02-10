import type { OllamaModel } from '@/typings';

export const getOllamaModels = () => {
	return fetch('/api/models').then(
		(resp) => resp.json() as Promise<{models:OllamaModel[]}>,
	);
};
