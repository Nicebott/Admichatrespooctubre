import React, { useState, useRef, useEffect } from 'react';
import { Topic, Message } from '../../types/forum';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Send, ArrowLeft, User, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../../firebase';
import { deleteTopic, deleteMessage } from '../../services/forumService';
import { getCurrentUserAdminStatus } from '../../services/adminService';
import toast from 'react-hot-toast';

interface TopicViewProps {
  topic: Topic;
  messages: Message[];
  onBack: () => void;
  onSendMessage: (content: string) => void;
  darkMode: boolean;
}

const TopicView: React.FC<TopicViewProps> = ({
  topic,
  messages,
  onBack,
  onSendMessage,
  darkMode
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const adminStatus = await getCurrentUserAdminStatus();
      setIsAdmin(adminStatus);
    };
    
    if (auth.currentUser) {
      checkAdminStatus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este tema? Esta acción no se puede deshacer.')) {
      const result = await deleteTopic(topic.id);
      
      if (result.success) {
        toast.success('Tema eliminado exitosamente');
        onBack();
      } else {
        toast.error(result.error || 'Error al eliminar el tema');
      }
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      const result = await deleteMessage(topic.id, messageId);
      
      if (result.success) {
        toast.success('Mensaje eliminado exitosamente');
        // Refresh messages by calling onBack and then navigating back
        window.location.reload();
      } else {
        toast.error(result.error || 'Error al eliminar el mensaje');
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            darkMode 
              ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          } transition-all duration-200`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver a los temas</span>
        </button>

        {auth.currentUser?.uid === topic.creador && (
          <button
            onClick={handleDelete}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              darkMode
                ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                : 'bg-red-50 text-red-500 hover:bg-red-100'
            } transition-colors duration-200`}
          >
            <Trash2 className="w-5 h-5" />
            <span>Eliminar tema</span>
          </button>
        )}

        {isAdmin && auth.currentUser?.uid !== topic.creador && (
          <button
            onClick={handleDelete}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              darkMode
                ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                : 'bg-red-50 text-red-500 hover:bg-red-100'
            } transition-colors duration-200`}
          >
            <Trash2 className="w-5 h-5" />
            <span>Eliminar tema (Admin)</span>
          </button>
        )}
      </div>

      <div className={`p-6 rounded-xl mb-6 ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      } shadow-lg`}>
        <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {topic.titulo}
        </h2>
        <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {topic.descripcion}
        </p>
        <div className={`flex items-center gap-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <User className="w-4 h-4" />
            <span className="font-medium">{topic.creadorNombre}</span>
          </div>
          <span>·</span>
          <span>
            {formatDistanceToNow(topic.creadoEn.toDate(), { addSuffix: true, locale: es })}
          </span>
        </div>
      </div>

      <div className={`rounded-xl mb-6 ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      } shadow-lg overflow-hidden`}>
        <div className="h-[500px] overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No hay respuestas aún. ¡Sé el primero en responder!
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className={`${
                      darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                    } rounded-lg p-4`}
                  >
                    <div className="flex items-start gap-4 group">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        darkMode ? 'bg-gray-600' : 'bg-gray-200'
                      }`}>
                        <User className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                              {message.autorNombre}
                            </span>
                            {(isAdmin || message.autor === auth.currentUser?.uid) && (
                              <button
                                onClick={() => handleDeleteMessage(message.id)}
                                className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded ${
                                  darkMode 
                                    ? 'text-gray-400 hover:text-red-400 hover:bg-gray-600' 
                                    : 'text-gray-500 hover:text-red-500 hover:bg-gray-200'
                                }`}
                                title={isAdmin && message.autor !== auth.currentUser?.uid ? "Eliminar mensaje (Admin)" : "Eliminar mensaje"}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatDistanceToNow(message.creadoEn.toDate(), { addSuffix: true, locale: es })}
                          </span>
                        </div>
                        <p className={`text-base whitespace-pre-wrap break-words ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {message.contenido}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className={`flex-grow px-4 py-2.5 rounded-lg ${
                darkMode
                  ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                  : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className={`px-6 py-2.5 rounded-lg flex items-center gap-2 ${
                newMessage.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : darkMode
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-100 text-gray-400'
              } transition-all duration-200 disabled:cursor-not-allowed`}
            >
              <Send className="w-5 h-5" />
              <span className="font-medium">Enviar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TopicView;