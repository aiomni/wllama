import './style.css';

export default function Home() {
	return (
		<div className="w-full h-screen p-[20px]">
			<div className="h-full bg-white bordered flex flex-col justify-center items-center text-[26px] font-bold">
				<h1 className="flex flex-row items-center">
					Welcome to
					<span className="inline-block ml-2">
						<span className="text-orange-600 font-bold">W</span>
						<span className="text-xs font-light -ml-[3px]">ebO</span>
						<span className="text-rose-600 font-bold">llama</span>
					</span>
					.
				</h1>
				<div className="home-update mt-[50px] w-4/5 text-base font-normal">
					<h2>Update</h2>
					<h3>Feb 7, 2025</h3>
					<h4>Feature</h4>
					<ol>
						<li>Nothing yet.</li>
					</ol>
				</div>
			</div>
		</div>
	);
}
