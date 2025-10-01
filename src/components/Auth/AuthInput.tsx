import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AuthInputProps {
  icon: LucideIcon;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  darkMode: boolean;
  required?: boolean;
}

const AuthInput: React.FC<AuthInputProps> = ({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  darkMode,
  required
}) => {
  return (
    <div className="relative">
      <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
        darkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <Icon size={18} />
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full pl-10 pr-4 py-3 rounded-lg ${
          darkMode
            ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400'
            : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400'
        } border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default AuthInput;