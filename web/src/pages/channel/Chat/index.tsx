import type { FC } from 'react';
import { useParams } from 'react-router';

export const ChannelChat: FC = () => {
	const { channelId } = useParams();

	return <div>{channelId}</div>;
};
