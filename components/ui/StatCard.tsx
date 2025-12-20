'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  size = 'md',
  className = '',
  onClick,
}: StatCardProps) {
  const variantStyles = {
    default: 'bg-white border-gray-100',
    primary: 'bg-primary/5 border-primary/20',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-amber-50 border-amber-200',
    danger: 'bg-red-50 border-red-200',
  };

  const iconStyles = {
    default: 'bg-gray-100 text-gray-600',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-amber-100 text-amber-600',
    danger: 'bg-red-100 text-red-600',
  };

  const sizeStyles = {
    sm: { padding: 'p-4', value: 'text-xl', icon: 'w-8 h-8 p-1.5' },
    md: { padding: 'p-5', value: 'text-2xl', icon: 'w-10 h-10 p-2' },
    lg: { padding: 'p-6', value: 'text-3xl', icon: 'w-12 h-12 p-2.5' },
  };

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.02, y: -2 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`
        ${sizeStyles[size].padding} rounded-2xl border shadow-sm
        ${variantStyles[variant]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <motion.p
            className={`${sizeStyles[size].value} font-bold text-gray-900`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {value}
          </motion.p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <motion.div
              className={`flex items-center gap-1 mt-2 text-sm font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
            </motion.div>
          )}
        </div>
        {Icon && (
          <motion.div
            className={`${sizeStyles[size].icon} rounded-xl ${iconStyles[variant]}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Icon className="w-full h-full" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Circular Progress Stat Card variant
interface CircularStatCardProps {
  title: string;
  value: number;
  maxValue?: number;
  subtitle?: string;
  size?: number;
  className?: string;
}

export function CircularStatCard({
  title,
  value,
  maxValue = 100,
  subtitle,
  size = 120,
  className = '',
}: CircularStatCardProps) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (value / maxValue) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 70) return '#22C55E';
    if (percentage >= 40) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-5 ${className}`}>
      <p className="text-sm font-medium text-gray-500 mb-4">{title}</p>
      <div className="flex items-center gap-4">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#E5E7EB"
              strokeWidth={strokeWidth}
            />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={getColor()}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ strokeDasharray: circumference }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-2xl font-bold text-gray-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {value}
            </motion.span>
            <span className="text-xs text-gray-400">/{maxValue}</span>
          </div>
        </div>
        {subtitle && (
          <p className="text-sm text-gray-600 flex-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

