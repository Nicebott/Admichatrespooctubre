import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import LoadMoreButton from './LoadMoreButton';
import { Message } from '../../types';

interface ChatMessagesProps {
  messages: Message[];
  darkMode: boolean;
  currentUsername: string;
  onLoadMore: () => void;
  loading: boolean;
  isAdmin: boolean;
  onDeleteMessage: (messageId: string) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  darkMode,
  currentUsername,
  onLoadMore,
  loading,
  isAdmin,
  onDeleteMessage
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const scrollToBottom = () => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, autoScroll]);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setAutoScroll(isNearBottom);
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`h-[300px] md:h-[400px] overflow-y-auto mb-3 md:mb-4 p-2 md:p-4 ${darkMode ? 'text-white' : ''}`}
    >
      <LoadMoreButton
        onClick={onLoadMore}
        loading={loading}
        darkMode={darkMode}
      />
      
      <AnimatePresence>
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            darkMode={darkMode}
            isCurrentUser={message.username === currentUsername}
            isAdmin={isAdmin}
            onDelete={onDeleteMessage}
          />
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;