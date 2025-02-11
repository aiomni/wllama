import type { FC } from 'react';

interface BrandProps {
	className?: string;
	size?: 'sm' | 'md' | 'lg';
}

const Brand: FC<BrandProps> = ({ className = '' }) => {
	return (
		<div
			className={`cursor-pointer h-[36px] flex justify-start items-center mx-0 my-0 ${className}`}
		>
			<div>
				<img alt="aiomni" width={36} height={36} src="/web/icons/aiomni.svg" />
			</div>
			<p className="ml-[10px]">
				<a href="/" className="text-slate-400">
					<span className="text-3xl text-orange-600 font-bold">x</span>
					<span className="text-3xl text-rose-600 font-bold">llama</span>
				</a>
			</p>
		</div>
	);
};

export default Brand;
