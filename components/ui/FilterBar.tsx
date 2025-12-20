'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Calendar, MapPin, Filter, X } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  locations?: FilterOption[];
  dateRanges?: FilterOption[];
  onLocationChange?: (value: string) => void;
  onDateRangeChange?: (value: string) => void;
  selectedLocation?: string;
  selectedDateRange?: string;
  showClearAll?: boolean;
  onClearAll?: () => void;
  className?: string;
}

export default function FilterBar({
  locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'eu', label: 'Europe' },
    { value: 'asia', label: 'Asia' },
    { value: 'other', label: 'Other' },
  ],
  dateRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: 'all', label: 'All time' },
  ],
  onLocationChange,
  onDateRangeChange,
  selectedLocation = 'all',
  selectedDateRange = '30d',
  showClearAll = true,
  onClearAll,
  className = '',
}: FilterBarProps) {
  const [locationOpen, setLocationOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const selectedLocationLabel = locations.find(l => l.value === selectedLocation)?.label || 'All Locations';
  const selectedDateLabel = dateRanges.find(d => d.value === selectedDateRange)?.label || 'Last 30 days';

  const hasActiveFilters = selectedLocation !== 'all' || selectedDateRange !== '30d';

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Filter className="w-4 h-4" />
        <span className="font-medium">Filters:</span>
      </div>

      {/* Location Dropdown */}
      <div className="relative">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setLocationOpen(!locationOpen);
            setDateOpen(false);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700">{selectedLocationLabel}</span>
          <motion.div animate={{ rotate: locationOpen ? 180 : 0 }}>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {locationOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden"
            >
              {locations.map((location) => (
                <button
                  key={location.value}
                  onClick={() => {
                    onLocationChange?.(location.value);
                    setLocationOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors ${
                    selectedLocation === location.value
                      ? 'bg-primary/5 text-primary font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  {location.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Date Range Dropdown */}
      <div className="relative">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setDateOpen(!dateOpen);
            setLocationOpen(false);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700">{selectedDateLabel}</span>
          <motion.div animate={{ rotate: dateOpen ? 180 : 0 }}>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {dateOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-2 w-40 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden"
            >
              {dateRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => {
                    onDateRangeChange?.(range.value);
                    setDateOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors ${
                    selectedDateRange === range.value
                      ? 'bg-primary/5 text-primary font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Clear All Button */}
      {showClearAll && hasActiveFilters && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClearAll}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Clear all</span>
        </motion.button>
      )}
    </div>
  );
}

