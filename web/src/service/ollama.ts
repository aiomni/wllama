export const getOllamaVersionAPI = () => {
	return fetch('/api/version').then((resp) => resp.json());
};
