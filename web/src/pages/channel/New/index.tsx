import type { FC, PropsWithChildren } from 'react';

export const NewChannel: FC<PropsWithChildren> = () => {
	return (
		<div className="w-full h-screen p-[20px] flex flex-col gap-4">
			<div className="w-full flex-1 bg-white bordered flex flex-col justify-center items-center text-[26px] font-bold">
				new channel
			</div>
			<div className="w-full h-[200px] bg-white bordered">Input</div>
		</div>
	);
};
