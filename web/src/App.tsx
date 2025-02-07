import { OllamaProvider } from './context/Ollama';
import { RouterApp } from './layout/RouterApp';

import routes from './router';

const App = () => {
	return (
		<OllamaProvider>
			<RouterApp basename="/web" routes={routes} />
		</OllamaProvider>
	);
};

export default App;
