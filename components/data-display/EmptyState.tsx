'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Database, Inbox, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';

type EmptyStateVariant = 'default' | 'search' | 'data' | 'error' | 'inbox';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const variantConfig: Record<EmptyStateVariant, { icon: React.ReactNode; title: string; description: string }> = {
  default: {
    icon: <FileText className="w-8 h-8 text-gray-400" />,
    title: 'No data found',
    description: 'There is no data to display at the moment.',
  },
  search: {
    icon: <Search className="w-8 h-8 text-gray-400" />,
    title: 'No results found',
    description: 'Try adjusting your search or filters to find what you\'re looking for.',
  },
  data: {
    icon: <Database className="w-8 h-8 text-gray-400" />,
    title: 'No data available',
    description: 'Data will appear here once it becomes available.',
  },
  error: {
    icon: <AlertCircle className="w-8 h-8 text-red-400" />,
    title: 'Something went wrong',
    description: 'We couldn\'t load the data. Please try again.',
  },
  inbox: {
    icon: <Inbox className="w-8 h-8 text-gray-400" />,
    title: 'Your inbox is empty',
    description: 'New items will appear here.',
  },
};

export default function EmptyState({
  variant = 'default',
  title,
  description,
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  const config = variantConfig[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-12 ${className}`}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4"
      >
        {icon || config.icon}
      </motion.div>
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg font-semibold text-gray-900 mb-2"
      >
        {title || config.title}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-500 max-w-sm mx-auto"
      >
        {description || config.description}
      </motion.p>
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Button onClick={action.onClick}>{action.label}</Button>
        </motion.div>
      )}
    </motion.div>
  );
}

