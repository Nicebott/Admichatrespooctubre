import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Trash2, Shield } from 'lucide-react';

interface ChatMessageProps {
  message: {
    id: string;
    text: string;
    timestamp: number;
    username: string;
    isAdmin: boolean;
  };
  darkMode: boolean;
  isCurrentUser: boolean;
  isAdmin: boolean;
  onDelete: (messageId: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  darkMode, 
  isCurrentUser,
  isAdmin,
  onDelete
}) => {
  const timeAgo = formatDistanceToNow(new Date(message.timestamp), {
    addSuffix: true,
    locale: es
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-3 md:mb-4 ${isCurrentUser ? 'ml-auto' : 'mr-auto'} relative group`}
    >
      <div
        className={`max-w-[85%] md:max-w-[80%] rounded-lg px-3 md:px-4 py-2 ${
          isCurrentUser
            ? darkMode
              ? 'bg-blue-600 ml-auto'
              : 'bg-blue-500'
            : darkMode
              ? 'bg-gray-700'
              : 'bg-gray-100'
        }`}
      >
        <div className="flex items-center gap-1 md:gap-2 mb-1 flex-wrap">
          <div className="flex items-center gap-1">
            {message.isAdmin ? (
              <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] md:text-xs font-bold ${
                darkMode
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/50'
                  : 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md'
              }`}>
                <Shield className="w-2.5 h-2.5 md:w-3 md:h-3" />
                ADMIN
              </span>
            ) : (
              <span className={`font-medium text-xs md:text-sm ${
                isCurrentUser
                  ? 'text-white'
                  : darkMode
                    ? 'text-gray-300'
                    : 'text-gray-700'
              }`}>
                {message.username}
              </span>
            )}
          </div>
          {isAdmin && (
            <button
              onClick={() => onDelete(message.id)}
              className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
              }`}
              title="Eliminar mensaje"
            >
              <Trash2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </button>
          )}
        </div>
        <p className={`text-xs md:text-sm break-words ${
          isCurrentUser ? 'text-white' : darkMode ? 'text-gray-200' : 'text-gray-800'
        }`}>
          {message.text}
        </p>
        <span className={`text-xs md:text-xs ${
          isCurrentUser
            ? 'text-blue-100'
            : darkMode
              ? 'text-gray-400'
              : 'text-gray-500'
        }`}>
          {timeAgo}
        </span>
      </div>
    </motion.div>
  );
};

export default ChatMessage;