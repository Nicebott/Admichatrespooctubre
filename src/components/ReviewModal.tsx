import React, { useState } from 'react';
import { X } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import toast from 'react-hot-toast';
import { auth } from '../firebase';
import ReviewForm from './Reviews/ReviewForm';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  professorId: string;
  professorName: string;
  userId: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  darkMode,
  professorId,
  professorName,
  userId
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (review: {
    rating: number;
    clarity: number;
    fairness: number;
    punctuality: number;
    wouldTakeAgain: number;
    comment: string;
  }) => {
    setLoading(true);

    try {
      const reviewsCollection = collection(firestore, 'reviews');
      await addDoc(reviewsCollection, {
        professorId,
        userId,
        userName: auth.currentUser?.displayName || 'Usuario Anónimo',
        ...review,
        timestamp: new Date().toISOString()
      });
      toast.success('¡Reseña enviada exitosamente!');
      onClose();
    } catch (error) {
      console.error('Error al enviar la reseña:', error);
      toast.error('Error al enviar la reseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className={`relative w-full max-w-2xl max-h-[90vh] rounded-xl shadow-xl flex flex-col ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}>
        <div className={`flex items-center justify-between p-4 md:p-6 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div>
            <h2 className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Calificar a {professorName}
            </h2>
            <p className={`mt-1 md:mt-2 text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Tu opinión ayuda a otros estudiantes a tomar mejores decisiones
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${
              darkMode
                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            } transition-colors`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <ReviewForm
            onSubmit={handleSubmit}
            darkMode={darkMode}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;