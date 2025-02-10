import Brand from '@/components/Brand';
import { getOllamaVersionAPI } from '@/service';
import { useRequest } from '@hooks/useRequest';
import {
	type FC,
	type PropsWithChildren,
	createContext,
	use,
} from 'react';

export * from './models';

const OllamaContext = createContext({
	version: '',
});

export const OllamaProvider: FC<PropsWithChildren> = ({ children }) => {
	const { loading, data, error } = useRequest(() => getOllamaVersionAPI());

	if (loading) {
		return <div className="full-center">loading...</div>;
	}

	if (!data || error) {
		console.error(error);
		return (
			<div className="full-center">
				<div className="flex flex-col items-center gap-2">
					<Brand />
					Check Ollama Error, Please Check Ollama is running...
				</div>
			</div>
		);
	}

	return (
		<OllamaContext.Provider value={{ version: data.version }}>
			{children}
		</OllamaContext.Provider>
	);
};

export const useOllamaVersion = () => {
	return use(OllamaContext).version;
};
