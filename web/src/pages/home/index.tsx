import './style.css';

export default function Home() {
	return (
		<div className="w-full h-screen p-[20px]">
			<div className="h-full bg-white bordered flex flex-col justify-center items-center text-[26px] font-bold">
				<h1>Welcome to Wllama.</h1>
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
