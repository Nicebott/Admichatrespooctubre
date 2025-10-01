import React from 'react';
import { motion } from 'framer-motion';
import { LogIn, UserPlus } from 'lucide-react';

interface AuthTabsProps {
  activeTab: 'login' | 'register';
  onTabChange: (tab: 'login' | 'register') => void;
  darkMode: boolean;
}

const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab, onTabChange, darkMode }) => {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => onTabChange('login')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
          activeTab === 'login'
            ? darkMode
              ? 'bg-blue-600 text-white'
              : 'bg-blue-500 text-white'
            : darkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <LogIn size={18} />
        <span>Iniciar Sesión</span>
      </button>
      <button
        onClick={() => onTabChange('register')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
          activeTab === 'register'
            ? darkMode
              ? 'bg-blue-600 text-white'
              : 'bg-blue-500 text-white'
            : darkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <UserPlus size={18} />
        <span>Registrarse</span>
      </button>
    </div>
  );
};

export default AuthTabs;