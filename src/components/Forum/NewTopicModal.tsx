import React, { useState } from 'react';
import { X, MessageSquare, Type, AlignLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NewTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string) => void;
  darkMode: boolean;
}

const NewTopicModal: React.FC<NewTopicModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  darkMode
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onSubmit(title, description);
      setTitle('');
      setDescription('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full max-w-lg p-6 rounded-xl shadow-xl ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
            }`}
          >
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 p-2 rounded-lg ${
                darkMode 
                  ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              } transition-colors`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-blue-50'
              }`}>
                <MessageSquare className={`w-6 h-6 ${
                  darkMode ? 'text-blue-400' : 'text-blue-500'
                }`} />
              </div>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Nuevo Tema
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <Type className="w-4 h-4" />
                  Título
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-white text-gray-900 border-gray-300'
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  placeholder="Escribe un título descriptivo"
                  required
                />
              </div>

              <div>
                <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <AlignLeft className="w-4 h-4" />
                  Descripción
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className={`w-full px-4 py-2.5 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-white text-gray-900 border-gray-300'
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  placeholder="Describe tu tema en detalle"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium ${
                    darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Crear Tema
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NewTopicModal;