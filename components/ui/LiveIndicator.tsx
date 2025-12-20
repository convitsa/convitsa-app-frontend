'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LiveIndicatorProps {
  count?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showPulse?: boolean;
  className?: string;
}

export default function LiveIndicator({
  count,
  label = 'Live',
  size = 'md',
  variant = 'success',
  showPulse = true,
  className = '',
}: LiveIndicatorProps) {
  const sizeStyles = {
    sm: { dot: 'w-2 h-2', text: 'text-xs', padding: 'px-2 py-1' },
    md: { dot: 'w-2.5 h-2.5', text: 'text-sm', padding: 'px-3 py-1.5' },
    lg: { dot: 'w-3 h-3', text: 'text-base', padding: 'px-4 py-2' },
  };

  const variantStyles = {
    default: { bg: 'bg-gray-100', dot: 'bg-gray-500', text: 'text-gray-600' },
    success: { bg: 'bg-green-100', dot: 'bg-green-500', text: 'text-green-700' },
    warning: { bg: 'bg-amber-100', dot: 'bg-amber-500', text: 'text-amber-700' },
    danger: { bg: 'bg-red-100', dot: 'bg-red-500', text: 'text-red-700' },
  };

  return (
    <div
      className={`inline-flex items-center gap-2 ${sizeStyles[size].padding} rounded-full ${variantStyles[variant].bg} ${className}`}
    >
      <div className="relative">
        <motion.div
          className={`${sizeStyles[size].dot} rounded-full ${variantStyles[variant].dot}`}
        />
        {showPulse && (
          <motion.div
            className={`absolute inset-0 ${sizeStyles[size].dot} rounded-full ${variantStyles[variant].dot}`}
            animate={{
              scale: [1, 2, 2],
              opacity: [0.7, 0.3, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}
      </div>
      <span className={`font-medium ${sizeStyles[size].text} ${variantStyles[variant].text}`}>
        {count !== undefined && <span className="mr-1">{count}</span>}
        {label}
      </span>
    </div>
  );
}

// Live Stat Card with indicator
interface LiveStatCardProps {
  title: string;
  value: number;
  previousValue?: number;
  icon?: React.ReactNode;
  className?: string;
}

export function LiveStatCard({
  title,
  value,
  previousValue,
  icon,
  className = '',
}: LiveStatCardProps) {
  const change = previousValue !== undefined
    ? ((value - previousValue) / previousValue) * 100
    : 0;

  return (
    <motion.div
      className={`bg-white rounded-2xl border border-gray-100 p-5 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <LiveIndicator size="sm" />
      </div>
      <div className="flex items-end gap-3">
        {icon && (
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <div>
          <motion.p
            className="text-3xl font-bold text-gray-900"
            key={value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {value.toLocaleString()}
          </motion.p>
          {previousValue !== undefined && (
            <p className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(1)}% from before
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

