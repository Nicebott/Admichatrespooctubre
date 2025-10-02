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
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className={`p-4 md:p-6 rounded-xl ${
          darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
        }`}>
          <div className="flex flex-col items-center mb-4 md:mb-6">
            <h3 className={`text-base md:text-lg font-semibold mb-3 md:mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Calificación General
            </h3>
            <div className="flex items-center gap-3">
              <span className={`text-3xl md:text-4xl font-bold ${
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

          <div className="space-y-3 md:space-y-4">
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

        <div className={`p-4 md:p-6 rounded-xl ${
          darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
        }`}>
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className={`p-2 rounded-lg ${
              darkMode ? 'bg-gray-600' : 'bg-blue-50'
            }`}>
              <MessageSquare className={darkMode ? 'text-blue-400' : 'text-blue-500'} size={20} />
            </div>
            <h3 className={`text-base md:text-lg font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Tu Opinión
            </h3>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={8}
            className={`w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border ${
              darkMode
                ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base`}
            placeholder="Comparte tu experiencia con este profesor..."
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 md:py-4 px-4 rounded-lg font-medium transition-all duration-200 text-sm md:text-base ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : darkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
              : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
        }`}
      >
        {loading ? 'Enviando...' : 'Enviar Reseña'}
      </button>
    </motion.form>
  );
};

export default ReviewForm;