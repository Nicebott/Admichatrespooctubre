import React, { useState, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import Badge from './ui/Badge';

interface SearchBarProps {
  onSearch: (query: string, campus: string) => void;
  campuses: string[];
  selectedCampus: string;
  darkMode: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, campuses, selectedCampus, darkMode }) => {
  const [query, setQuery] = useState('');
  const [campus, setCampus] = useState(selectedCampus);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    setCampus(selectedCampus);
  }, [selectedCampus]);

  const saveSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSearch(query);
    onSearch(query, campus);
    setShowRecentSearches(false);
  };

  const handleRecentSearchClick = (searchQuery: string) => {
    setQuery(searchQuery);
    onSearch(searchQuery, campus);
    setShowRecentSearches(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4" translate="no">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <input
              type="text"
              placeholder="Buscar por materia, profesor o NRC..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowRecentSearches(true)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                  darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <X size={16} />
              </button>
            )}
            
            <AnimatePresence>
              {showRecentSearches && recentSearches.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute z-10 w-full mt-2 rounded-lg shadow-lg ${
                    darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="p-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Búsquedas recientes
                      </span>
                      <button
                        onClick={clearRecentSearches}
                        className="text-sm text-blue-500 hover:text-blue-600"
                      >
                        Limpiar
                      </button>
                    </div>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentSearchClick(search)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          darkMode
                            ? 'hover:bg-gray-700 text-gray-300'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <MapPin className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <select
              value={campus}
              onChange={(e) => {
                setCampus(e.target.value);
                onSearch(query, e.target.value);
              }}
              className={`w-full md:w-48 pl-10 pr-4 py-3 rounded-lg border appearance-none ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
            >
              <option value="">Todos los campus</option>
              {campuses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          
          <Button type="submit" variant="primary" className="md:w-auto">
            <Search className="h-5 w-5 mr-2" />
            Buscar
          </Button>
        </form>

        {campus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2"
          >
            <Badge variant="info" size="sm" className="mr-2">
              Campus: {campus}
              <button
                onClick={() => {
                  setCampus('');
                  onSearch(query, '');
                }}
                className="ml-2 hover:text-blue-700"
              >
                <X size={14} />
              </button>
            </Badge>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SearchBar;