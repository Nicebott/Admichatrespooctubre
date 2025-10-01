import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: '-translate-y-full -translate-x-1/2 -mt-2 left-1/2',
    bottom: 'translate-y-full -translate-x-1/2 mt-2 left-1/2',
    left: '-translate-x-full -translate-y-1/2 -ml-2 top-1/2',
    right: 'translate-x-full -translate-y-1/2 ml-2 top-1/2',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={cn(
              'absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg dark:bg-gray-800',
              positions[position],
              className
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;