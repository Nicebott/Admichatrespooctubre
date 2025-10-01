import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthTabs from './Auth/AuthTabs';
import LoginForm from './Auth/LoginForm';
import RegisterForm from './Auth/RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, darkMode }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={`relative w-full max-w-md p-6 rounded-xl shadow-xl ${
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
          <X size={20} />
        </button>

        <AuthTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          darkMode={darkMode}
        />

        <AnimatePresence mode="wait">
          {activeTab === 'login' ? (
            <LoginForm key="login" darkMode={darkMode} onClose={onClose} />
          ) : (
            <RegisterForm key="register" darkMode={darkMode} onClose={onClose} />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthModal;