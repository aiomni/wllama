import { XLLAMA_SERVER_HOST } from '@/constants/server';
import type { OllamaVersionResponse } from '@/typings';

export const getOllamaVersionAPI = () => {
	return fetch(`${XLLAMA_SERVER_HOST}/api/version`).then(
		(resp) => resp.json() as Promise<OllamaVersionResponse>,
	);
};
