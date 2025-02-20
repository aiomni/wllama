import { useRequest } from '@/hooks/useRequest';
import {
	type FC,
	type PropsWithChildren,
	useEffect,
	useMemo,
	useRef,
	useState,
	useSyncExternalStore,
} from 'react';
import { channelStore } from './store';
import { OllamaMessage } from '@/typings';

export const ChannelSnapShotProvider: FC<PropsWithChildren> = ({
	children,
}) => {
	const { loading } = useRequest(() => channelStore.initPromise);

	if (loading) {
		return <div className="full-center">loading...</div>;
	}

	return children;
};

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

export const useNewMessage = (channelId: string) => {
	return (message: Omit<OllamaMessage, "role">) => channelStore.newMessage(channelId, message);
};

export const useChannel = (channelId: string) => {
	const [flag, setFlag] = useState(0);
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const channel = useMemo(
		() => channelStore.getChannel(channelId)?.getValue() || null,
		[channelId, flag],
	);

	useEffect(() => {
		return channelStore.channelsSubscribe((channels) => {
			if (!channels.some((c) => c.getValue().id === channelId)) {
				setFlag(Math.random());
			}
		});
	}, [channelId]);

	return channel;
};
