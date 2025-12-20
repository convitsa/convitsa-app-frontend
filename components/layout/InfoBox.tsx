'use client';

import React from 'react';
import { Info, AlertCircle, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { motion } from 'framer-motion';

type InfoBoxVariant = 'info' | 'success' | 'warning' | 'error';

interface InfoBoxProps {
  children: React.ReactNode;
  variant?: InfoBoxVariant;
  title?: string;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const variantStyles: Record<InfoBoxVariant, {
  bg: string;
  border: string;
  icon: React.ReactNode;
  iconColor: string;
}> = {
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    icon: <Info className="w-4 h-4" />,
    iconColor: 'text-blue-500',
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-100',
    icon: <CheckCircle2 className="w-4 h-4" />,
    iconColor: 'text-green-500',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    icon: <AlertTriangle className="w-4 h-4" />,
    iconColor: 'text-amber-500',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-100',
    icon: <AlertCircle className="w-4 h-4" />,
    iconColor: 'text-red-500',
  },
};

// Also export a simple gray info box variant
export function GrayInfoBox({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-start gap-2 p-4 rounded-xl bg-gray-50 border border-gray-100 ${className}`}>
      <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
      <p className="text-sm text-gray-500">{children}</p>
    </div>
  );
}

export default function InfoBox({
  children,
  variant = 'info',
  title,
  icon,
  dismissible = false,
  onDismiss,
  className = '',
}: InfoBoxProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-start gap-3 p-4 rounded-xl ${styles.bg} border ${styles.border} ${className}`}
    >
      <span className={`flex-shrink-0 mt-0.5 ${styles.iconColor}`}>
        {icon || styles.icon}
      </span>
      <div className="flex-1 min-w-0">
        {title && <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>}
        <div className="text-sm text-gray-600">{children}</div>
      </div>
      {dismissible && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onDismiss}
          className="flex-shrink-0 p-1 rounded hover:bg-white/50 transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </motion.button>
      )}
    </motion.div>
  );
}

