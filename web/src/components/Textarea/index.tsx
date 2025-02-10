import type { ChangeEvent, FC, FormEvent, KeyboardEventHandler } from 'react';

import './style.css';

export interface TextareaProps {
	disabled?: boolean;
	className?: string;
	value: string;
	onChange?: (v: string) => void;
	onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>;
}

export const Textarea: FC<TextareaProps> = ({
	disabled,
	className,
	value,
	onChange,
	onKeyDown,
}) => {
	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		onChange?.(e.target.value);
	};

	const autoHeight = (e: FormEvent<HTMLTextAreaElement>) => {
		const el = e.currentTarget;
		el.style.height = 'auto';

		if (el.scrollHeight > el.offsetHeight) {
			el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
		}
	};

	return (
		<textarea
			className={`omni-textarea ${className}`}
			disabled={disabled}
			value={value}
			onChange={handleChange}
			onInput={autoHeight}
			onKeyDown={onKeyDown}
		/>
	);
};
