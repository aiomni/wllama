import { OllamaProvider } from './context/Ollama';
import { ChannelSnapShotProvider } from './context/channel';
import { RouterApp } from './layout/RouterApp';

import routes from './router';

const App = () => {
	return (
		<OllamaProvider>
			<ChannelSnapShotProvider>
				<RouterApp basename="/web" routes={routes} />
			</ChannelSnapShotProvider>
		</OllamaProvider>
	);
};

export default App;
