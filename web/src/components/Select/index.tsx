import { useCallback, useEffect, useMemo, useRef } from 'react';
import './style.css';

export interface SelectOption<T> {
	label: string;
	value: T;
}

export type SelectOptionBase = string | number;

export interface SelectProps<T> {
	value: T;
	onChange: (v: T) => void;
	options: SelectOption<T>[] | SelectOptionBase[];
	placeholder?: string;
}

export const Select = <T extends string | number>({
	placeholder = '',
	value,
	options,
	onChange,
}: SelectProps<T>) => {
	const selectRef = useRef<HTMLDivElement>(null);
	const optionsRef = useRef<HTMLDivElement>(null);

	const opts: SelectOption<T>[] = useMemo(() => {
		if (options.length < 1) {
			return [];
		}

		if (typeof options[0] === 'object') {
			return options as SelectOption<T>[];
		}

		return options.map(
			(v) =>
				({
					label: String(v),
					value: v,
				}) as SelectOption<T>,
		);
	}, [options]);

	const label = useMemo(() => {
		return opts.filter(({ value: v }) => v === value)?.[0]?.label;
	}, [opts, value]);

	const switchOptionsDisplay = useCallback((display?: 'block' | 'none') => {
		if (!optionsRef.current) {
			return;
		}

		const currentDisplay = optionsRef.current.style.display;
		const nextDisplay =
			display || currentDisplay === 'block' ? 'none' : 'block';
		optionsRef.current.style.display = nextDisplay;
	}, []);

	const handleShowOptions = useCallback(() => {
		switchOptionsDisplay();
	}, [switchOptionsDisplay]);

	const handleOptionClick = useCallback(
		(v: T) => {
			onChange(v);
			switchOptionsDisplay();
		},
		[onChange, switchOptionsDisplay],
	);

	useEffect(() => {
		document.addEventListener(
			'click',
			(e) => {
				if (
					selectRef.current &&
					!selectRef.current.contains(e.target as Element)
				) {
					switchOptionsDisplay('none');
				}
			},
			false,
		);
	}, [switchOptionsDisplay]);

	return (
		<div
			className="omni-select w-full h-[48px] m-h-[48px] cursor-pointer relative select-none"
			ref={selectRef}
		>
			<div
				className="omni-select__container absolute l-0 t-0 w-full h-[48px] rounded-lg flex items-center px-[10px] py-0 border-2"
				onClick={handleShowOptions}
			>
				{label || <span className="text-gray">{placeholder}</span>}
			</div>
			{opts.length > 0 && (
				<div className="omni-select__options" ref={optionsRef}>
					<div className="omni-select__options_content ">
						{opts.map(({ label, value: v }) => (
							<p
								key={v}
								className={`omni-select__options_items ${v === value && 'active'}`}
								onClick={() => handleOptionClick(v)}
							>
								{label}
							</p>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
