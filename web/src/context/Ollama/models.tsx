import Brand from '@/components/Brand';
import { useRequest } from '@/hooks/useRequest';
import { getOllamaModels } from '@/service';
import type { OllamaModel } from '@/typings';
import {
	type FC,
	type PropsWithChildren,
	use,
	createContext,
} from 'react';

const OllamaModelsContext = createContext({
	models: [] as OllamaModel[],
	refresh: () => {},
});


export const OllamaModelsProvider: FC<PropsWithChildren> = ({ children }) => {
	const { loading, data, error, refresh } = useRequest(() => getOllamaModels());

	if (loading) {
		return <div className="full-center">Init Ollama Models...</div>;
	}

	if (!data || error) {
		console.error(error);
		return (
			<div className="full-center">
				<div className="flex flex-col items-center gap-2">
					<Brand />
					Get Ollama Models Error, Please Check Ollama is running...
				</div>
			</div>
		);
	}

  return (
    <OllamaModelsContext.Provider value={{ models: data.models, refresh }}>
			{children}
		</OllamaModelsContext.Provider>
  )
};

export const useOllamaModels = () => {
	return use(OllamaModelsContext).models;
}

export const useOllamaModelsRefresh = () => {
	return use(OllamaModelsContext).refresh;
}

export const useOllamaModelsContent = () => {
	return use(OllamaModelsContext);
}
