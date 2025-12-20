'use client';

import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'spinner' | 'dots' | 'pulse';
}

export default function Loader({ size = 'md', text, variant = 'spinner' }: LoaderProps) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  };

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} bg-primary rounded-full animate-bounce`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );
      case 'pulse':
        return (
          <div className="relative">
            <div className={`${sizes[size]} bg-primary rounded-full opacity-75 animate-ping absolute`} />
            <div className={`${sizes[size]} bg-primary rounded-full relative`} />
          </div>
        );
      case 'spinner':
      default:
        return (
          <div className={`${sizes[size]} relative`}>
            <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {renderLoader()}
      {text && (
        <p className="text-gray-600 font-medium animate-pulse">{text}</p>
      )}
    </div>
  );
}

interface RotatingTextLoaderProps {
  texts: string[];
  interval?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function RotatingTextLoader({ texts, interval = 1500, size = 'md' }: RotatingTextLoaderProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, interval);
    return () => clearInterval(timer);
  }, [texts.length, interval]);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <Loader size={size} />
      <p className="text-gray-700 font-medium text-lg animate-pulse min-h-[28px] text-center">
        {texts[currentIndex]}
      </p>
    </div>
  );
}


