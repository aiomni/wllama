import type { PropsWithChildren, FC } from 'react';

export const Container: FC<PropsWithChildren> = ({ children }) => {
	return <main className="w-full h-full flex justify-center">{children}</main>;
};
