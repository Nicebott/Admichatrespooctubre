import React from 'react';
import { GraduationCap, Menu, X, Moon, Sun, LogIn, CircleUser as UserCircle, HelpCircle, MessageSquare, Shield } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import { User } from 'firebase/auth';

interface NavigationProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  user: User | null;
  showProfileDropdown: boolean;
  setShowProfileDropdown: (show: boolean) => void;
  setIsAuthModalOpen: (isOpen: boolean) => void;
  selectedModality: string;
  handleModalityChange: (modality: string) => void;
  scrollToTop: () => void;
  handleFAQClick: () => void;
  showFAQ: boolean;
  showForum: boolean;
  handleForumClick: () => void;
  showAdmin: boolean;
  handleAdminClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  darkMode,
  toggleDarkMode,
  user,
  showProfileDropdown,
  setShowProfileDropdown,
  setIsAuthModalOpen,
  selectedModality,
  handleModalityChange,
  scrollToTop,
  handleFAQClick,
  showFAQ,
  showForum,
  handleForumClick,
  showAdmin,
  handleAdminClick,
}) => {
  return (
    <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center relative">
        <button
          onClick={scrollToTop}
          className="flex items-center group transition-colors duration-200"
        >
          <GraduationCap 
            size={40} 
            className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-3 group-hover:scale-110 transition-transform duration-200`} 
          />
          <h1 className={`text-lg sm:text-xl md:text-2xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-800'
          } group-hover:text-blue-500 transition-colors duration-200`}>
            UASD 2025-10
          </h1>
        </button>

        <div className="flex items-center gap-2 md:gap-4">
          {!user ? (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
                darkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              } transition-colors duration-200`}
            >
              <LogIn size={18} />
              <span className="hidden sm:inline">Iniciar Sesión</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
                  darkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                } transition-colors duration-200`}
              >
                <UserCircle size={18} />
                <span className="hidden sm:inline">{user.displayName || 'Usuario'}</span>
              </button>
              {showProfileDropdown && (
                <ProfileDropdown 
                  darkMode={darkMode} 
                  onClose={() => setShowProfileDropdown(false)}
                />
              )}
            </div>
          )}

          <button
            onClick={toggleDarkMode}
            className={`p-1.5 rounded-full ${
              darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-600'
            } hover:opacity-80 transition-all duration-200`}
            aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1.5"
          >
            {isMenuOpen ? (
              <X size={20} className={darkMode ? 'text-white' : ''} />
            ) : (
              <Menu size={20} className={darkMode ? 'text-white' : ''} />
            )}
          </button>
        </div>

        <nav className={`${
          isMenuOpen 
            ? 'fixed top-16 left-0 right-0 bottom-0 overflow-y-auto'
            : 'hidden'
        } md:block md:static md:w-auto md:shadow-none md:mt-0 md:overflow-visible ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } md:bg-transparent z-40`}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-2 p-4 md:p-0 min-h-full md:min-h-0">
            <NavButton
              onClick={scrollToTop}
              isActive={!selectedModality && !showFAQ && !showForum && !showAdmin}
              darkMode={darkMode}
            >
              Inicio
            </NavButton>
            <NavButton
              onClick={() => handleModalityChange('virtual')}
              isActive={selectedModality === 'virtual'}
              darkMode={darkMode}
            >
              Virtual
            </NavButton>
            <NavButton
              onClick={() => handleModalityChange('semipresencial')}
              isActive={selectedModality === 'semipresencial'}
              darkMode={darkMode}
            >
              SemiPresencial
            </NavButton>
            <NavButton
              onClick={handleForumClick}
              isActive={showForum}
              darkMode={darkMode}
            >
              <MessageSquare size={16} className="mr-1.5" />
              Foro
            </NavButton>
            <NavButton
              onClick={handleFAQClick}
              isActive={showFAQ}
              darkMode={darkMode}
            >
              <HelpCircle size={16} className="mr-1.5" />
              FAQ
            </NavButton>
            <NavButton
              onClick={handleAdminClick}
              isActive={showAdmin}
              darkMode={darkMode}
            >
              <Shield size={16} className="mr-1.5" />
              Admin
            </NavButton>
          </div>
        </nav>
      </div>
    </header>
  );
};

interface NavButtonProps {
  onClick: () => void;
  isActive: boolean;
  darkMode: boolean;
  children: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({
  onClick,
  isActive,
  darkMode,
  children
}) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-3 md:px-3 md:py-1.5 rounded-md text-sm font-medium transition-colors duration-200 w-full md:w-auto justify-start md:justify-center ${
      isActive
        ? darkMode 
          ? 'bg-gray-700 text-white border-l-4 border-blue-400 md:border-l-0'
          : 'bg-gray-100 text-blue-800 border-l-4 border-blue-500 md:border-l-0'
        : darkMode 
          ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-700 hover:border-l-4 hover:border-blue-400 md:hover:border-l-0' 
          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100 hover:border-l-4 hover:border-blue-500 md:hover:border-l-0'
    }`}
  >
    {children}
  </button>
);

export default Navigation;