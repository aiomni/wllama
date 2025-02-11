import type { OllamaMessage } from '@/typings';
import clsx from 'clsx';
import type { FC } from 'react';
import { Marked } from '../Marked';

import './ChatBubble.css';

interface ChatBubbleProps {
  isStream?: boolean;
  message: OllamaMessage;
}

export const ChatBubble: FC<ChatBubbleProps> = ({ message, isStream }) => {
  return (
    <div
      className={clsx(
        'chat-bubble',
        'flex w-full px-[20px] py-[10px]',
        message.role === 'user' ? 'sent' : 'received',
      )}
    >
      <img
        className="chat-bubble__avatar"
        alt={message.role}
        width={32}
        height={32}
        src={
          message.role === 'user'
            ? '/web/icons/aiomni.svg'
            : '/web/icons/ollama.png'
        }
      />
      <div className="chat-bubble__message">
        {isStream && !message.content ? (
          'Loading'
        ) : (
          <Marked content={message.content} />
        )}
      </div>
    </div>
  );
};
