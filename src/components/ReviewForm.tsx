import React, { useState } from 'react';
import { motion } from 'framer-motion';
import RatingStars from './RatingStars';
import RatingMetric from './RatingMetric';
import { MessageSquare } from 'lucide-react';

interface ReviewFormProps {
  onSubmit: (review: {
    rating: number;
    clarity: number;
    fairness: number;
    punctuality: number;
    wouldTakeAgain: number;
    comment: string;
  }) => void;
  darkMode: boolean;
  loading?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  onSubmit,
  darkMode,
  loading = false,
}) => {
  const [rating, setRating] = useState(8);
  const [clarity, setClarity] = useState(8);
  const [fairness, setFairness] = useState(8);
  const [punctuality, setPunctuality] = useState(8);
  const [wouldTakeAgain, setWouldTakeAgain] = useState(8);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      rating,
      clarity,
      fairness,
      punctuality,
      wouldTakeAgain,
      comment,
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pb-20 sm:pb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex flex-col items-center mb-6">
            <h3 className={`text-lg font-semibold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Calificación General
            </h3>
            <div className="flex items-center gap-3">
              <span className={`text-4xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {rating / 2}/5
              </span>
              <RatingStars
                rating={rating}
                onChange={setRating}
                interactive
                size="lg"
                darkMode={darkMode}
              />
            </div>
          </div>

          <div className="space-y-4">
            <RatingMetric
              label="Claridad"
              value={clarity}
              maxValue={10}
              darkMode={darkMode}
              onChange={setClarity}
              interactive
            />
            <RatingMetric
              label="Justicia"
              value={fairness}
              maxValue={10}
              darkMode={darkMode}
              onChange={setFairness}
              interactive
            />
            <RatingMetric
              label="Puntualidad"
              value={punctuality}
              maxValue={10}
              darkMode={darkMode}
              onChange={setPunctuality}
              interactive
            />
            <RatingMetric
              label="Lo tomaría de nuevo"
              value={wouldTakeAgain}
              maxValue={10}
              darkMode={darkMode}
              onChange={setWouldTakeAgain}
              interactive
            />
          </div>
        </div>

        <div className={`p-6 rounded-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-blue-50'
            }`}>
              <MessageSquare className={darkMode ? 'text-blue-400' : 'text-blue-500'} />
            </div>
            <h3 className={`text-lg font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Tu Opinión
            </h3>
          </div>

          <div className="space-y-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={8}
              className={`w-full px-4 py-3 rounded-lg shadow-sm ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              placeholder="Comparte tu experiencia con este profesor..."
              required
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 sm:relative p-4 sm:p-0 bg-inherit border-t sm:border-0 border-gray-700 mt-auto">
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : darkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {loading ? 'Enviando...' : 'Enviar Reseña'}
        </button>
      </div>
    </motion.form>
  );
};

export default ReviewForm;