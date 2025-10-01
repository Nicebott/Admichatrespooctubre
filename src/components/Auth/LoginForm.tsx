import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import toast from 'react-hot-toast';
import AuthInput from './AuthInput';

interface LoginFormProps {
  darkMode: boolean;
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ darkMode, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('¡Inicio de sesión exitoso!');
      onClose();
    } catch (error: any) {
      toast.error('Error al iniciar sesión: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <AuthInput
        icon={Mail}
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={setEmail}
        darkMode={darkMode}
        required
      />

      <AuthInput
        icon={Lock}
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={setPassword}
        darkMode={darkMode}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : darkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        <LogIn size={18} />
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </motion.form>
  );
};

export default LoginForm;