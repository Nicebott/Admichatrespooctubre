import React, { useState } from 'react';
import { MessageSquare, User, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  darkMode: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, darkMode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            darkMode ? 'bg-gray-700' : 'bg-blue-50'
          }`}
        >
          <MessageSquare className={`w-8 h-8 ${
            darkMode ? 'text-blue-400' : 'text-blue-500'
          }`} />
        </motion.div>
        <h3 className={`text-xl font-bold mb-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Bienvenido al Chat
        </h3>
        <p className={`text-xs md:text-sm ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Únete a la conversación con otros estudiantes
        </p>
      </div>

      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="space-y-2">
          <label className={`block text-xs md:text-sm font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Nombre de usuario
          </label>
          <div className="relative">
            <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setShowPasswordInput(e.target.value.toLowerCase() === 'admin');
              }}
              className={`w-full pl-10 pr-4 py-2 md:py-2.5 rounded-lg border text-sm ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              placeholder="Ingresa tu nombre..."
              required
            />
          </div>
        </div>

        {showPasswordInput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-2"
          >
            <label className={`block text-xs md:text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Contraseña de administrador
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 md:py-2.5 rounded-lg border text-sm ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                placeholder="••••••••"
              />
            </div>
          </motion.div>
        )}

        <button
          type="submit"
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 md:py-2.5 rounded-lg font-medium transition-colors text-sm ${
            darkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <span>Ingresar al chat</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.form>

      <div className={`text-center text-xs md:text-sm ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        <p>Al unirte, aceptas nuestras normas de comunidad</p>
      </div>
    </div>
  );
};

export default LoginForm;