import { useRequest } from '@/hooks/useRequest';
import type { OllamaMessage } from '@/typings';
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
	return (message: Omit<OllamaMessage, 'role'>) =>
		channelStore.newMessage(channelId, message);
};

export const useChannel = (channelId: string) => {
	const [flag, setFlag] = useState(0);
	const channel$ = useMemo(
		() => channelStore.getChannel(channelId),
		[channelId],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const channel = useMemo(
		() => channel$?.getValue() || null,
		[channelId, flag],
	);

	useEffect(() => {
		if (!channel$) {
			return;
		}
		const sub$$ = channel$.subscribe(() => {
			setFlag(Math.random());
			console.log(111);
		});

		const sub2$$ = channelStore.channelsSubscribe((channels) => {
			if (!channels.some((c) => c.getValue().id === channelId)) {
				setFlag(Math.random());
			}
		});

		return () => {
			sub$$.unsubscribe();
			sub2$$();
		};
	}, [channelId, channel$]);

	return channel;
};
