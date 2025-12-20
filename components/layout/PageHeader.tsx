'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Calendar, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  showRefresh?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  showDateRange?: boolean;
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
  lastUpdated?: string;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  icon,
  showBack = false,
  onBack,
  showRefresh = false,
  onRefresh,
  isRefreshing = false,
  showDateRange = false,
  dateRange = 'Last 30 Days',
  onDateRangeChange,
  lastUpdated,
  actions,
  badge,
  className = '',
  children,
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`space-y-4 ${className}`}
    >
      {/* Top Row - Back, Date, Refresh */}
      {(showBack || lastUpdated || showRefresh || showDateRange) && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {showBack && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleBack}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </motion.button>
            )}

            {lastUpdated && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Last updated: {lastUpdated}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {showRefresh && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onRefresh}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-sm transition-all"
              >
                <motion.div
                  animate={{ rotate: isRefreshing ? 360 : 0 }}
                  transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: 'linear' }}
                >
                  <RefreshCw className="w-4 h-4 text-gray-500" />
                </motion.div>
                <span className="text-gray-700">Refresh Data</span>
              </motion.button>
            )}

            {showDateRange && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-sm transition-all"
              >
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{dateRange}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </motion.button>
            )}

            {actions}
          </div>
        </div>
      )}

      {/* Title Row */}
      {(title || icon || badge) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-3 rounded-xl bg-primary/10">
                {icon}
              </div>
            )}
            <div>
              {title && <h1 className="text-3xl font-bold text-gray-900">{title}</h1>}
              {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
            </div>
          </div>
          {badge && (
            <div className="flex items-center gap-2">
              {badge}
            </div>
          )}
        </div>
      )}

      {children}
    </motion.div>
  );
}

