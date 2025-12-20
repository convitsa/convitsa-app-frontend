'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';

interface SliderPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  position?: 'left' | 'right';
  showBackdrop?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const widthStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'max-w-full',
};

export default function SliderPanel({
  isOpen,
  onClose,
  children,
  title,
  subtitle,
  width = 'xl',
  position = 'right',
  showBackdrop = true,
  header,
  footer,
  className = '',
}: SliderPanelProps) {
  const slideDirection = position === 'right' ? '100%' : '-100%';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          {showBackdrop && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
          )}

          {/* Panel */}
          <motion.div
            initial={{ x: slideDirection }}
            animate={{ x: 0 }}
            exit={{ x: slideDirection }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed ${position === 'right' ? 'right-0' : 'left-0'} top-0 h-full w-full ${widthStyles[width]} bg-white shadow-2xl z-50 flex flex-col ${className}`}
          >
            {/* Header */}
            {(title || header) && (
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                {header || (
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <ChevronRight className={`w-5 h-5 text-gray-500 ${position === 'left' ? 'rotate-180' : ''}`} />
                    </motion.button>
                    <div>
                      {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
                      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                    </div>
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </motion.button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="p-6 border-t border-gray-100 bg-white">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

