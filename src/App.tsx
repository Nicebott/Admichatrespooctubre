import React, { useState, useEffect, useCallback, useMemo } from 'react';
import SearchBar from './components/SearchBar';
import CourseTable from './components/CourseTable';
import Pagination from './components/Pagination';
import Chat from './components/Chat';
import LoadingSpinner from './components/LoadingSpinner';
import AuthModal from './components/AuthModal';
import Navigation from './components/Navigation';
import FAQ from './components/FAQ';
import Forum from './components/Forum/Forum';
import AdminPanel from './components/AdminPanel';
import { Course, Section } from './types';
import { fetchCourseData } from './api/courseData';
import { normalizeText } from './utils/stringUtils';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Toaster } from 'react-hot-toast';
import { GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ALL_CAMPUSES = [
  'Santo Domingo',
  'Santiago',
  'San Fco de Macorís',
  'Puerto Plata',
  'San Juan',
  'Barahona',
  'Mao',
  'Hato Mayor',
  'Higüey',
  'Bonao',
  'La Vega',
  'Baní',
  'Azua de Compostela',
  'Neyba',
  'Cotuí',
  'Nagua',
  'Dajabón'
];

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [allSections, setAllSections] = useState<Section[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [selectedCampus, setSelectedCampus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModality, setSelectedModality] = useState<string>('');
  const [showFAQ, setShowFAQ] = useState(false);
  const [showForum, setShowForum] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const { courses, sections } = await fetchCourseData();
        setAllCourses(courses);
        setAllSections(sections);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSearch = useCallback((query: string, campus: string) => {
    setSearchQuery(query);
    setSelectedCampus(campus);
    setCurrentPage(1);
    setShowFAQ(false);
    setShowForum(false);
  }, []);

  const filteredSections = useMemo(() => {
    const normalizedQuery = normalizeText(searchQuery);
    
    return allSections.filter(section => {
      const course = allCourses.find(c => c.id === section.courseId);
      
      const matchesSearch = !normalizedQuery || [
        normalizeText(section.professor),
        normalizeText(section.nrc),
        course && normalizeText(course.name),
        course && normalizeText(course.code)
      ].some(text => text && text.includes(normalizedQuery));

      const matchesCampus = !selectedCampus || section.campus === selectedCampus;
      
      const modalidad = section.modalidad.toLowerCase();
      const matchesModality = !selectedModality || 
        (selectedModality === 'virtual' && modalidad.includes('online')) ||
        (selectedModality === 'semipresencial' && (
          modalidad.includes('semi') || 
          modalidad.includes('semipresencial') || 
          modalidad.includes('semi presencial')
        ));

      return matchesSearch && matchesCampus && matchesModality;
    });
  }, [allSections, allCourses, searchQuery, selectedCampus, selectedModality]);

  const totalPages = Math.max(1, Math.ceil(filteredSections.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [totalPages, currentPage]);

  const currentSections = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSections.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSections, currentPage, itemsPerPage]);

  const currentCourses = useMemo(() => {
    const uniqueCourseIds = new Set(currentSections.map(section => section.courseId));
    return allCourses.filter(course => uniqueCourseIds.has(course.id));
  }, [currentSections, allCourses]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleModalityChange = (modality: string) => {
    setSelectedModality(modality === selectedModality ? '' : modality);
    setCurrentPage(1);
    setIsMenuOpen(false);
    setShowFAQ(false);
    setShowForum(false);
    setShowAdmin(false);
  };

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
    setSearchQuery('');
    setSelectedCampus('');
    setSelectedModality('');
    setCurrentPage(1);
    setShowFAQ(false);
    setShowForum(false);
    setShowAdmin(false);
  }, []);

  const handleFAQClick = () => {
    setShowFAQ(true);
    setShowForum(false);
    setShowAdmin(false);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleForumClick = () => {
    setShowForum(true);
    setShowFAQ(false);
    setShowAdmin(false);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminClick = () => {
    setShowAdmin(true);
    setShowFAQ(false);
    setShowForum(false);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Toaster position="top-center" />
      
      <Navigation
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        user={user}
        showProfileDropdown={showProfileDropdown}
        setShowProfileDropdown={setShowProfileDropdown}
        setIsAuthModalOpen={setIsAuthModalOpen}
        selectedModality={selectedModality}
        handleModalityChange={handleModalityChange}
        scrollToTop={scrollToTop}
        handleFAQClick={handleFAQClick}
        showFAQ={showFAQ}
        showForum={showForum}
        handleForumClick={handleForumClick}
        showAdmin={showAdmin}
        handleAdminClick={handleAdminClick}
      />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow">
        <AnimatePresence mode="wait">
          {!showFAQ && !showForum && !showAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              <div className="w-full max-w-4xl text-center mb-8">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="inline-block"
                >
                  <GraduationCap 
                    size={64} 
                    className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} mx-auto mb-4`}
                  />
                </motion.div>
                <h1 className={`text-3xl sm:text-4xl font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Programación Docente UASD
                </h1>
                <p className={`text-lg ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Encuentra y explora las asignaturas disponibles para el semestre 2025-10
                </p>
              </div>

              <SearchBar 
                onSearch={handleSearch} 
                campuses={ALL_CAMPUSES} 
                selectedCampus={selectedCampus}
                darkMode={darkMode}
              />
              
              {isLoading ? (
                <LoadingSpinner darkMode={darkMode} />
              ) : currentSections.length > 0 ? (
                <>
                  <CourseTable
                    courses={currentCourses}
                    sections={currentSections}
                    onRateSection={() => {
                      if (!user) {
                        setIsAuthModalOpen(true);
                      }
                    }}
                    darkMode={darkMode}
                  />
                  <Pagination
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredSections.length}
                    paginate={handlePageChange}
                    currentPage={currentPage}
                    darkMode={darkMode}
                  />
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-4`}>
                    Mostrando {currentSections.length} de {filteredSections.length} resultados
                    {selectedCampus && ` en ${selectedCampus}`}
                    {selectedModality && ` (${selectedModality})`}
                  </p>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`mt-12 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-xl font-medium mb-2">
                    {selectedCampus
                      ? `No se encontraron asignaturas para el campus de ${selectedCampus}.`
                      : "No se encontraron asignaturas que coincidan con la búsqueda."}
                  </p>
                  <p className="text-sm">
                    Intenta ajustar los filtros o realizar una nueva búsqueda
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {showFAQ && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <FAQ darkMode={darkMode} />
            </motion.div>
          )}

          {showForum && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Forum darkMode={darkMode} setIsAuthModalOpen={setIsAuthModalOpen} />
            </motion.div>
          )}

          {showAdmin && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AdminPanel darkMode={darkMode} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <footer className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md mt-auto`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                © 2024 Nicebott. Todos los derechos reservados.
              </p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Desarrollado con ❤️ para la comunidad estudiantil
              </p>
            </div>
            <div className="flex gap-4">
              <a
                href="#"
                className={`text-sm ${
                  darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                } transition-colors`}
              >
                Términos y Condiciones
              </a>
              <a
                href="#"
                className={`text-sm ${
                  darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                } transition-colors`}
              >
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </footer>

      <Chat darkMode={darkMode} />
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        darkMode={darkMode}
      />
    </div>
  );
}

export default App;