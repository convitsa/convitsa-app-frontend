'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  label?: string;
  labelPosition?: 'left' | 'right';
  className?: string;
}

const sizeStyles = {
  sm: {
    track: 'w-8 h-4',
    thumb: 'w-3 h-3',
    translate: 16,
  },
  md: {
    track: 'w-12 h-6',
    thumb: 'w-5 h-5',
    translate: 24,
  },
  lg: {
    track: 'w-14 h-7',
    thumb: 'w-6 h-6',
    translate: 28,
  },
};

export default function Toggle({
  checked,
  onChange,
  size = 'md',
  disabled = false,
  label,
  labelPosition = 'left',
  className = '',
}: ToggleProps) {
  const styles = sizeStyles[size];

  const toggle = (
    <motion.button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative rounded-full transition-colors ${styles.track} ${
        checked ? 'bg-primary' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <motion.div
        animate={{ x: checked ? styles.translate : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow ${styles.thumb}`}
      />
    </motion.button>
  );

  if (!label) {
    return <div className={className}>{toggle}</div>;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {labelPosition === 'left' && (
        <span className={`text-sm text-gray-600 ${disabled ? 'opacity-50' : ''}`}>
          {label}
        </span>
      )}
      {toggle}
      {labelPosition === 'right' && (
        <span className={`text-sm text-gray-600 ${disabled ? 'opacity-50' : ''}`}>
          {label}
        </span>
      )}
    </div>
  );
}

