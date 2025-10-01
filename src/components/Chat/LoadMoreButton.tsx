import React from 'react';
import { ChevronUp } from 'lucide-react';

interface LoadMoreButtonProps {
  onClick: () => void;
  loading: boolean;
  darkMode: boolean;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ onClick, loading, darkMode }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`w-full py-2 mb-4 flex items-center justify-center gap-2 rounded-md transition-colors ${
        darkMode
          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <ChevronUp size={16} />
      {loading ? 'Cargando...' : 'Cargar mensajes anteriores'}
    </button>
  );
};

export default LoadMoreButton;