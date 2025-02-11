import { OllamaModelsProvider, OllamaProvider } from './context/ollama';
import { ChannelSnapShotProvider } from './context/channel';
import { RouterApp } from './layout/RouterApp';

import routes from './router';

const App = () => {
	return (
		<OllamaProvider>
				<OllamaModelsProvider>
					<ChannelSnapShotProvider>
						<RouterApp basename="/web" routes={routes} />
					</ChannelSnapShotProvider>
				</OllamaModelsProvider>
		</OllamaProvider>
	);
};

export default App;
