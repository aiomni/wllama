import { useRequest } from '@hooks/useRequest';
import { type FC, type PropsWithChildren, createContext, useContext } from 'react';

const OllamaContext = createContext({
	version: '',
});

export const OllamaProvider: FC<PropsWithChildren> = ({ children }) => {
	const { loading, data, error } = useRequest(() => fetch('/api/version').then(resp=>resp.json()));

  if (loading) {
    return <div className="full-center">loading...</div>;
  }

  if (error) {
    console.error(error);
    return <div className="full-center">Something went wrong...</div>;
  }

	return <OllamaContext.Provider value={{ version: data.version }}>{children}</OllamaContext.Provider>;
};

export const useOllamaVersion = () => {
  return useContext(OllamaContext).version;
}
