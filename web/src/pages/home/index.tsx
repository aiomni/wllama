import Button from '@/components/Button';
import { Marked } from '@/components/Marked';
import { WELCOME_NO_MODELS, WELCOME_TEXT } from '@/constants/markdown';
import { useOllamaModels } from '@/context/ollama';
import { useNavigate } from 'react-router';
import './style.css';

export default function Home() {
	const navigate = useNavigate();
	const models = useOllamaModels();

	return (
		<div className="w-full h-screen p-[10px]">
			<div className="h-full bg-white bordered flex flex-col justify-center items-center">
				<h1 className="flex flex-row items-center text-[36px] font-bold">
					Welcome to
					<span className="inline-block ml-2">
						<span className="text-orange-600 font-bold">x</span>
						<span className="text-rose-600 font-bold">llama</span>
					</span>
					.
				</h1>
				<div className="home-update mt-[20px] w-4/5 text-base font-normal max-w-[850px]">
					<Marked content={WELCOME_TEXT} />
					{models.length > 0 ? (
						<div className="w-[300px] m-x-auto mt-10">
							<Button
								className="w-full"
								onClick={() => navigate('/channel/new')}
							>
								Start A New Chat
							</Button>
						</div>
					) : (
						<Marked content={WELCOME_NO_MODELS} />
					)}
				</div>
			</div>
		</div>
	);
}
