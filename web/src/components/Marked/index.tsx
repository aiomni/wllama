import { type FC, useLayoutEffect, useRef } from 'react';
import { marked } from './marked';
import './style.css';

interface MarkedProps {
	content: string;
}

export const Marked: FC<MarkedProps> = ({ content }) => {
	const markedRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		const result = marked.parse(content, { async: false });
		markedRef.current!.innerHTML = result;
	}, [content]);

	return <div className="omni-makred" ref={markedRef} />;
};
