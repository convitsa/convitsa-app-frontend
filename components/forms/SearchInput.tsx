'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onClear?: () => void;
  autoFocus?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'pl-8 pr-8 py-1.5 text-xs',
  md: 'pl-10 pr-10 py-2.5 text-sm',
  lg: 'pl-12 pr-12 py-3 text-base',
};

const iconSizeStyles = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

const iconPositionStyles = {
  sm: 'left-2.5',
  md: 'left-3',
  lg: 'left-4',
};

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  onClear,
  autoFocus = false,
  size = 'md',
}: SearchInputProps) {
  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div className={`relative ${className}`}>
      <Search className={`absolute ${iconPositionStyles[size]} top-1/2 -translate-y-1/2 text-gray-400 ${iconSizeStyles[size]}`} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`w-full rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all ${sizeStyles[size]}`}
      />
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            type="button"
            onClick={handleClear}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors`}
          >
            <X className={iconSizeStyles[size]} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

