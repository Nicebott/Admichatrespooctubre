import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { User } from 'lucide-react';
import { motion } from 'framer-motion';
import RatingStars from './RatingStars';

interface ReviewCardProps {
  review: {
    rating: number;
    comment: string;
    timestamp: string;
    userName: string;
    clarity: number;
    fairness: number;
    punctuality: number;
    wouldTakeAgain: number;
  };
  darkMode: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, darkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl ${
        darkMode
          ? 'bg-gray-800/50 hover:bg-gray-800/70'
          : 'bg-white hover:bg-gray-50'
      } shadow-lg transition-colors duration-200`}
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
          darkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <User className={`w-6 h-6 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h4 className={`font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {review.userName}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <RatingStars
                  rating={review.rating}
                  size="sm"
                  darkMode={darkMode}
                />
                <span className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {formatDistanceToNow(new Date(review.timestamp), {
                    addSuffix: true,
                    locale: es
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className={`mt-4 text-sm whitespace-pre-wrap ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {review.comment}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <div className="flex flex-col">
              <span className={`text-xs font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Claridad
              </span>
              <span className={`font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {review.clarity}/10
              </span>
            </div>
            <div className="flex flex-col">
              <span className={`text-xs font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Justicia
              </span>
              <span className={`font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {review.fairness}/10
              </span>
            </div>
            <div className="flex flex-col">
              <span className={`text-xs font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Puntualidad
              </span>
              <span className={`font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {review.punctuality}/10
              </span>
            </div>
            <div className="flex flex-col">
              <span className={`text-xs font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Lo tomaría de nuevo
              </span>
              <span className={`font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {review.wouldTakeAgain}/10
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewCard;