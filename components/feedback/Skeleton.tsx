'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animate?: boolean;
}

export default function Skeleton({
  className = '',
  width,
  height,
  variant = 'text',
  animate = true,
}: SkeletonProps) {
  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
  };

  const style: React.CSSProperties = {
    width: width,
    height: height || (variant === 'text' ? '1em' : undefined),
  };

  return (
    <div
      className={`bg-gray-200 ${variantStyles[variant]} ${animate ? 'animate-pulse' : ''} ${className}`}
      style={style}
    />
  );
}

// Preset skeleton layouts
export function SkeletonCard() {
  return (
    <div className="p-6 rounded-2xl border border-gray-100 bg-white space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={12} />
        </div>
      </div>
      <Skeleton variant="rounded" height={100} />
      <div className="space-y-2">
        <Skeleton width="100%" height={14} />
        <Skeleton width="80%" height={14} />
        <Skeleton width="60%" height={14} />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-4 pb-3 border-b border-gray-100">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} width={100} height={16} className="flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3">
          {[1, 2, 3, 4].map((j) => (
            <Skeleton key={j} width="100%" height={14} className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-6 rounded-2xl border border-gray-100 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton width={80} height={14} />
            <Skeleton variant="circular" width={32} height={32} />
          </div>
          <Skeleton width={120} height={32} />
          <Skeleton width="100%" height={8} variant="rounded" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="p-6 rounded-2xl border border-gray-100 bg-white">
      <div className="flex items-center justify-between mb-6">
        <Skeleton width={150} height={20} />
        <Skeleton width={100} height={32} variant="rounded" />
      </div>
      <Skeleton variant="rounded" height={200} />
    </div>
  );
}

