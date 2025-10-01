import React from 'react';
import { Topic } from '../../types/forum';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { MessageSquare, Plus, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCurrentUserAdminStatus } from '../../services/adminService';
import { auth } from '../../firebase';
import { useState, useEffect } from 'react';

interface ForumListProps {
  topics: Topic[];
  onTopicClick: (topicId: string) => void;
  onNewTopic: () => void;
  darkMode: boolean;
}

const ForumList: React.FC<ForumListProps> = ({ topics, onTopicClick, onNewTopic, darkMode }) => {
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Foros de Discusión
          </h2>
          <p className={`mt-2 flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Participa en las conversaciones y comparte tus experiencias
            {isAdmin && (
              <span className="px-2 py-1 text-xs bg-yellow-500 text-black rounded-full font-medium">
                ADMIN
              </span>
            )}
          </p>
        </div>
        <button
          onClick={onNewTopic}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Nuevo Tema</span>
        </button>
      </div>

      <div className="grid gap-4">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => onTopicClick(topic.id)}
            className={`group p-6 rounded-xl cursor-pointer transform hover:scale-[1.02] transition-all duration-200 ${
              darkMode
                ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700'
                : 'bg-white hover:bg-gray-50 border border-gray-200'
            } shadow-sm hover:shadow-md relative`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <h3 className={`text-xl font-semibold mb-2 group-hover:text-blue-500 transition-colors ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {topic.titulo}
                </h3>
                <p className={`mb-4 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {topic.descripcion}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className={`flex items-center gap-2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <Users className="w-4 h-4" />
                    <span className="font-medium">{topic.creadorNombre}</span>
                  </div>
                  <div className={`flex items-center gap-2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <Clock className="w-4 h-4" />
                    <span>
                      {formatDistanceToNow(topic.creadoEn.toDate(), { addSuffix: true, locale: es })}
                    </span>
                  </div>
                  <div className={`flex items-center gap-2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <MessageSquare className="w-4 h-4" />
                    <span>{topic.mensajesCount || 0} respuestas</span>
                  </div>
                </div>
              </div>
              <div className={`hidden md:flex items-center justify-center w-16 h-16 rounded-full ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              } group-hover:bg-blue-500 transition-colors`}>
                <MessageSquare className={`w-8 h-8 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                } group-hover:text-white transition-colors`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {topics.length === 0 && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">No hay temas de discusión</h3>
          <p>¡Sé el primero en crear un tema!</p>
        </div>
      )}
    </div>
  );
};

export default ForumList;