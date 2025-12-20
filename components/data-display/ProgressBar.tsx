'use client';

import React from 'react';
import { motion } from 'framer-motion';

type ProgressBarVariant = 'primary' | 'success' | 'warning' | 'error' | 'gradient';
type ProgressBarSize = 'xs' | 'sm' | 'md' | 'lg';

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: ProgressBarVariant;
  size?: ProgressBarSize;
  showLabel?: boolean;
  labelPosition?: 'right' | 'inside' | 'above';
  className?: string;
  animate?: boolean;
  animationDelay?: number;
  customColor?: string;
}

const variantStyles: Record<ProgressBarVariant, string> = {
  primary: 'bg-primary',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  gradient: 'bg-gradient-to-r from-primary to-purple-400',
};

const sizeStyles: Record<ProgressBarSize, { track: string; thumb: string }> = {
  xs: { track: 'h-1', thumb: 'h-1' },
  sm: { track: 'h-2', thumb: 'h-2' },
  md: { track: 'h-3', thumb: 'h-3' },
  lg: { track: 'h-4', thumb: 'h-4' },
};

export default function ProgressBar({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  labelPosition = 'right',
  className = '',
  animate = true,
  animationDelay = 0,
  customColor,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const styles = sizeStyles[size];

  const progressContent = (
    <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${styles.track}`}>
      <motion.div
        initial={animate ? { width: 0 } : { width: `${percentage}%` }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, delay: animationDelay, ease: 'easeOut' }}
        className={`rounded-full ${styles.thumb} ${customColor || variantStyles[variant]}`}
        style={customColor ? { backgroundColor: customColor } : undefined}
      />
    </div>
  );

  if (!showLabel) {
    return <div className={className}>{progressContent}</div>;
  }

  if (labelPosition === 'above') {
    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-medium text-gray-900">{percentage.toFixed(0)}%</span>
        </div>
        {progressContent}
      </div>
    );
  }

  if (labelPosition === 'inside' && size === 'lg') {
    return (
      <div className={`relative ${className}`}>
        <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${styles.track}`}>
          <motion.div
            initial={animate ? { width: 0 } : { width: `${percentage}%` }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, delay: animationDelay, ease: 'easeOut' }}
            className={`rounded-full ${styles.thumb} ${customColor || variantStyles[variant]} flex items-center justify-end pr-2`}
            style={customColor ? { backgroundColor: customColor } : undefined}
          >
            <span className="text-xs font-medium text-white">{percentage.toFixed(0)}%</span>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1">{progressContent}</div>
      <span className="text-sm font-medium text-gray-900 w-12 text-right">
        {percentage === 100 ? '100%' : `${percentage.toFixed(2)}%`}
      </span>
    </div>
  );
}

// Horizontal bar for rankings/comparisons
export function RankingBar({
  rank,
  name,
  value,
  icon,
  href,
  maxValue = 100,
  animate = true,
  animationDelay = 0,
}: {
  rank: number;
  name: string;
  value: number;
  icon?: React.ReactNode;
  href?: string;
  maxValue?: number;
  animate?: boolean;
  animationDelay?: number;
}) {
  const percentage = (value / maxValue) * 100;

  const nameElement = href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm font-medium text-gray-900 hover:text-primary transition-colors flex items-center gap-1"
    >
      {name}
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  ) : (
    <span className="text-sm font-medium text-gray-900">{name}</span>
  );

  return (
    <div className="flex items-center gap-4">
      <span className="w-8 text-sm font-medium text-gray-400">{rank}</span>
      {icon && <span className="text-lg">{icon}</span>}
      {nameElement}
      <div className="flex-1 mx-4">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={animate ? { width: 0 } : { width: `${percentage}%` }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, delay: animationDelay, ease: 'easeOut' }}
            className="h-full rounded-full bg-primary"
          />
        </div>
      </div>
      <span className="text-sm font-medium text-gray-900 w-16 text-right">
        {value === 100 ? '100%' : `${value.toFixed(2)}%`}
      </span>
    </div>
  );
}

