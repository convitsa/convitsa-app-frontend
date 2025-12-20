'use client';

import React from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'xs' | 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  className?: string;
  dot?: boolean;
  dotColor?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: 'px-1.5 py-0.5 text-[10px]',
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  icon,
  className = '',
  dot = false,
  dotColor,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-lg ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColor || 'bg-current'}`}
        />
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

// Preset badges for common use cases
export function StatusBadge({ 
  status 
}: { 
  status: 'active' | 'inactive' | 'pending' | 'error' 
}) {
  const statusConfig = {
    active: { variant: 'success' as BadgeVariant, label: 'Active', dot: true },
    inactive: { variant: 'default' as BadgeVariant, label: 'Inactive', dot: true },
    pending: { variant: 'warning' as BadgeVariant, label: 'Pending', dot: true },
    error: { variant: 'error' as BadgeVariant, label: 'Error', dot: true },
  };

  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} dot={config.dot}>
      {config.label}
    </Badge>
  );
}

export function MentionBadge({ mentioned }: { mentioned: boolean }) {
  return mentioned ? (
    <Badge variant="primary">Mentions you</Badge>
  ) : (
    <Badge variant="error">Not mentioned</Badge>
  );
}

