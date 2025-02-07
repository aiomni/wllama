import type {
	CSSProperties,
	MouseEventHandler,
	PropsWithChildren,
} from 'react';

import './style.css';

interface ButtonProps {
	style?: CSSProperties;
	className?: string;
	onClick?: MouseEventHandler<HTMLDivElement>;
}

export default function Button({
	children,
	style,
	className = '',
	onClick,
}: PropsWithChildren<ButtonProps>) {
	return (
		<div className={`omni-button ${className}`} style={style} onClick={onClick}>
			{children}
		</div>
	);
}
