import React, { useState, useEffect } from 'react';
import { Course, Section } from '../types';
import { Search, Star, BookOpen, MapPin, Clock, Users, Globe } from 'lucide-react';
import ProfessorDetailsModal from './ProfessorDetailsModal';
import ReviewModal from './ReviewModal';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore, auth } from '../firebase';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import Tooltip from './ui/Tooltip';

interface ProfessorRating {
  rating: number;
  clarity: number;
  fairness: number;
  punctuality: number;
  wouldTakeAgain: number;
}

interface CourseTableProps {
  courses: Course[];
  sections: Section[];
  onRateSection: (sectionId: string) => void;
  darkMode: boolean;
}

const CourseTable: React.FC<CourseTableProps> = ({ courses, sections, onRateSection, darkMode }) => {
  const [selectedProfessor, setSelectedProfessor] = useState<{ id: string; name: string } | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [professorRatings, setProfessorRatings] = useState<Record<string, ProfessorRating>>({});

  useEffect(() => {
    const fetchProfessorRatings = async () => {
      const uniqueProfessors = [...new Set(sections.map(section => section.professor))];
      const ratings: Record<string, ProfessorRating> = {};

      for (const professor of uniqueProfessors) {
        try {
          const reviewsQuery = query(
            collection(firestore, 'reviews'),
            where('professorId', '==', professor)
          );
          
          const querySnapshot = await getDocs(reviewsQuery);
          const reviews = querySnapshot.docs.map(doc => doc.data());
          
          if (reviews.length > 0) {
            const totals = reviews.reduce((acc, review: any) => ({
              rating: acc.rating + review.rating,
              clarity: acc.clarity + (review.clarity || 0),
              fairness: acc.fairness + (review.fairness || 0),
              punctuality: acc.punctuality + (review.punctuality || 0),
              wouldTakeAgain: acc.wouldTakeAgain + (review.wouldTakeAgain || 0)
            }), {
              rating: 0,
              clarity: 0,
              fairness: 0,
              punctuality: 0,
              wouldTakeAgain: 0
            });

            const count = reviews.length;
            ratings[professor] = {
              rating: Number((totals.rating / count).toFixed(1)),
              clarity: Number((totals.clarity / count).toFixed(1)),
              fairness: Number((totals.fairness / count).toFixed(1)),
              punctuality: Number((totals.punctuality / count).toFixed(1)),
              wouldTakeAgain: Number((totals.wouldTakeAgain / count).toFixed(1))
            };
          }
        } catch (error) {
          console.error('Error fetching ratings for professor:', professor, error);
        }
      }

      setProfessorRatings(ratings);
    };

    fetchProfessorRatings();
  }, [sections]);

  const handleRateClick = (sectionId: string, professorId: string) => {
    if (!auth.currentUser) {
      onRateSection(sectionId);
      return;
    }
    setSelectedProfessor({ id: professorId, name: professorId });
    setShowReviewModal(true);
  };

  const getModalityBadge = (modalidad: string) => {
    const modalidadLower = modalidad.toLowerCase();
    if (modalidadLower.includes('online') || modalidadLower.includes('virtual')) {
      return (
        <Badge variant="info" size="sm">
          <Globe className="w-3 h-3 mr-1" />
          Virtual
        </Badge>
      );
    }
    if (modalidadLower.includes('semi')) {
      return (
        <Badge variant="warning" size="sm">
          <Users className="w-3 h-3 mr-1" />
          Semipresencial
        </Badge>
      );
    }
    return (
      <Badge variant="success" size="sm">
        <Users className="w-3 h-3 mr-1" />
        Presencial
      </Badge>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8">
      <AnimatePresence mode="popLayout">
        {sections.map((section, index) => {
          const course = courses.find(c => c.id === section.courseId);
          if (!course) return null;

          const rating = professorRatings[section.professor];

          return (
            <motion.div
              key={`${section.id}-${section.nrc}-${section.professor}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-shadow duration-200`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {course.name}
                        </h3>
                        {getModalityBadge(section.modalidad)}
                      </div>
                      <div className="space-y-2">
                        <Tooltip content="Código y NRC del curso">
                          <div className="flex items-center text-sm">
                            <BookOpen size={16} className="mr-2 text-blue-500" />
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                              {course.code} - NRC: {section.nrc}
                            </span>
                          </div>
                        </Tooltip>
                        <Tooltip content="Campus y Horario">
                          <div className="flex items-center text-sm">
                            <MapPin size={16} className="mr-2 text-green-500" />
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                              {section.campus}
                            </span>
                            <Clock size={16} className="ml-4 mr-2 text-purple-500" />
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                              {section.schedule}
                            </span>
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star size={16} className="mr-2 text-yellow-500" />
                          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {section.professor}
                          </span>
                        </div>
                        {rating && (
                          <Badge
                            variant={rating.rating >= 8 ? 'success' : rating.rating >= 6 ? 'warning' : 'error'}
                            size="sm"
                          >
                            {rating.rating.toFixed(1)}
                          </Badge>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedProfessor({
                            id: section.professor,
                            name: section.professor
                          })}
                          className="flex-1"
                        >
                          <Search size={14} className="mr-1" />
                          Detalles
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleRateClick(section.id, section.professor)}
                          className="flex-1"
                        >
                          <Star size={14} className="mr-1" />
                          Calificar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {selectedProfessor && !showReviewModal && (
        <ProfessorDetailsModal
          key={`details-${selectedProfessor.id}`}
          isOpen={!!selectedProfessor}
          onClose={() => setSelectedProfessor(null)}
          darkMode={darkMode}
          professorId={selectedProfessor.id}
          professorName={selectedProfessor.name}
        />
      )}

      {showReviewModal && selectedProfessor && auth.currentUser && (
        <ReviewModal
          key={`review-${selectedProfessor.id}`}
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedProfessor(null);
          }}
          darkMode={darkMode}
          professorId={selectedProfessor.id}
          professorName={selectedProfessor.name}
          userId={auth.currentUser.uid}
        />
      )}
    </div>
  );
};

export default CourseTable;