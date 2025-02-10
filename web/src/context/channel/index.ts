import { useEffect, useRef, useSyncExternalStore } from 'react';
import { channelStore } from './store';

export const useChannels = () => {
	const channelsRef = useRef(channelStore.getChannels());

	useEffect(() => {
		return channelStore.channelsSubscribe((channels) => {
			channelsRef.current = channels;
		});
	}, []);

	return useSyncExternalStore(
		channelStore.channelsSubscribe,
		() => channelsRef.current,
	);
};

export const useNewChat = () => {
	return channelStore.newChat;
};
