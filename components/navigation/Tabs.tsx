'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline' | 'segment';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

export default function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  size = 'md',
  className = '',
}: TabsProps) {
  if (variant === 'pills') {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              disabled={tab.disabled}
              whileHover={{ scale: tab.disabled ? 1 : 1.02 }}
              whileTap={{ scale: tab.disabled ? 1 : 0.98 }}
              onClick={() => !tab.disabled && onChange(tab.id)}
              className={`flex items-center gap-2 rounded-lg font-medium transition-all ${sizeStyles[size]} ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-500 hover:bg-gray-100'
              } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                  isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    );
  }

  if (variant === 'segment') {
    return (
      <div className={`inline-flex rounded-xl overflow-hidden border border-gray-200 ${className}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && onChange(tab.id)}
              className={`flex items-center gap-2 font-medium transition-colors ${sizeStyles[size]} ${
                isActive
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'underline') {
    return (
      <div className={`flex items-center gap-6 border-b border-gray-200 ${className}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && onChange(tab.id)}
              className={`relative flex items-center gap-2 pb-3 font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
              } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                  isActive ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.badge}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`flex flex-wrap items-center gap-2 border-b border-gray-100 pb-4 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <motion.button
            key={tab.id}
            disabled={tab.disabled}
            whileHover={{ scale: tab.disabled ? 1 : 1.02 }}
            whileTap={{ scale: tab.disabled ? 1 : 0.98 }}
            onClick={() => !tab.disabled && onChange(tab.id)}
            className={`flex items-center gap-2 rounded-lg font-medium transition-all ${sizeStyles[size]} ${
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-gray-500 hover:bg-gray-100'
            } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.badge}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

