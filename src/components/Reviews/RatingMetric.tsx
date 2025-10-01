import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';

interface RatingMetricProps {
  label: string;
  value: number;
  maxValue?: number;
  darkMode?: boolean;
  onChange?: (value: number) => void;
  interactive?: boolean;
}

const RatingMetric: React.FC<RatingMetricProps> = ({
  label,
  value,
  maxValue = 10,
  darkMode = false,
  onChange,
  interactive = false,
}) => {
  const percentage = (value / maxValue) * 100;

  const handleDecrease = () => {
    if (interactive && onChange && value > 0) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (interactive && onChange && value < maxValue) {
      onChange(value + 1);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className={`text-sm font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {label}
        </span>
        <div className="flex items-center gap-2">
          {interactive && (
            <button
              type="button"
              onClick={handleDecrease}
              className={`p-1 rounded-md ${
                darkMode
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              } transition-colors`}
              disabled={value <= 0}
            >
              <Minus size={14} />
            </button>
          )}
          <span className={`text-sm font-bold min-w-[2rem] text-center ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {value}
          </span>
          {interactive && (
            <button
              type="button"
              onClick={handleIncrease}
              className={`p-1 rounded-md ${
                darkMode
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              } transition-colors`}
              disabled={value >= maxValue}
            >
              <Plus size={14} />
            </button>
          )}
        </div>
      </div>
      <div className={`h-2 rounded-full ${
        darkMode ? 'bg-gray-700' : 'bg-gray-200'
      }`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            percentage >= 80
              ? 'bg-green-500'
              : percentage >= 60
                ? 'bg-yellow-500'
                : 'bg-red-500'
          }`}
        />
      </div>
    </div>
  );
};

export default RatingMetric;