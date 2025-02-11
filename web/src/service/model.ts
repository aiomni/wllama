import { XLLAMA_SERVER_HOST } from '@/constants/server';
import type { OllamaModel } from '@/typings';

export const getOllamaModels = () => {
	return fetch(`${XLLAMA_SERVER_HOST}/api/models`).then(
		(resp) => resp.json() as Promise<{models:OllamaModel[]}>,
	);
};
