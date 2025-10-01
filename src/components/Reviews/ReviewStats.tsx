import React from 'react';
import { motion } from 'framer-motion';
import RatingStars from './RatingStars';
import RatingMetric from './RatingMetric';

interface ReviewStatsProps {
  stats: {
    rating: number;
    clarity: number;
    fairness: number;
    punctuality: number;
    wouldTakeAgain: number;
  };
  totalReviews: number;
  darkMode: boolean;
}

const ReviewStats: React.FC<ReviewStatsProps> = ({
  stats,
  totalReviews,
  darkMode,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}
    >
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center gap-3">
          <span className={`text-4xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {stats.rating.toFixed(1)}
          </span>
          <RatingStars
            rating={stats.rating}
            size="lg"
            darkMode={darkMode}
          />
        </div>
        <p className={`mt-2 text-sm ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Basado en {totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'}
        </p>
      </div>

      <div className="space-y-4">
        <RatingMetric
          label="Claridad"
          value={stats.clarity}
          darkMode={darkMode}
        />
        <RatingMetric
          label="Justicia"
          value={stats.fairness}
          darkMode={darkMode}
        />
        <RatingMetric
          label="Puntualidad"
          value={stats.punctuality}
          darkMode={darkMode}
        />
        <RatingMetric
          label="Lo tomaría de nuevo"
          value={stats.wouldTakeAgain}
          darkMode={darkMode}
        />
      </div>
    </motion.div>
  );
};

export default ReviewStats;