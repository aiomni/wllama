
import { OllamaProvider } from "./context/Ollama";
import { Container } from "./layout/Container";
import { RouterApp } from "./layout/RouterApp";

import HomeRouter from './pages/home/router';

const App = () => {
	return (
		<OllamaProvider>
			<Container>
				<RouterApp routes={[HomeRouter]} />
			</Container>
		</OllamaProvider>
	);
};

export default App;
