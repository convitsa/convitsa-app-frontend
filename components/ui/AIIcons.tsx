'use client';

import React from 'react';

// ChatGPT/OpenAI Icon
export function ChatGPTIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
    </svg>
  );
}

// Claude/Anthropic Icon
export function ClaudeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.603 15.593c-.281-.47-.436-1.005-.453-1.553-.015-.502.09-.998.31-1.452.265-.554.679-1.023 1.192-1.355.466-.304.993-.508 1.544-.6a4.48 4.48 0 0 1 1.72-.017c.55.09 1.07.29 1.534.59.51.33.926.794 1.197 1.346.224.45.334.944.322 1.443-.014.55-.167 1.088-.448 1.56a3.9 3.9 0 0 1-1.196 1.35 4.012 4.012 0 0 1-1.536.593 4.478 4.478 0 0 1-1.72.013 4.018 4.018 0 0 1-1.543-.597 3.906 3.906 0 0 1-1.193-1.351zm8.186-7.18c-.281-.47-.436-1.006-.453-1.554-.016-.502.089-.998.31-1.452.264-.554.678-1.023 1.191-1.355.466-.304.994-.508 1.545-.6a4.478 4.478 0 0 1 1.72-.016c.55.089 1.07.29 1.533.589.51.33.927.795 1.197 1.347.225.45.335.944.323 1.443-.014.55-.167 1.088-.448 1.56a3.9 3.9 0 0 1-1.197 1.35 4.012 4.012 0 0 1-1.535.593 4.478 4.478 0 0 1-1.72.013 4.019 4.019 0 0 1-1.543-.597 3.906 3.906 0 0 1-1.193-1.35z"/>
      <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm-1.014-6.636a5.353 5.353 0 0 1-2.078-.803 5.254 5.254 0 0 1-1.606-1.818c-.378-.632-.586-1.35-.608-2.085-.02-.673.12-1.34.416-1.95.356-.744.912-1.375 1.602-1.821a5.387 5.387 0 0 1 2.074-.806 6.017 6.017 0 0 1 2.31.022c.74.12 1.44.39 2.064.793a5.253 5.253 0 0 1 1.608 1.812c.3.607.444 1.271.424 1.94-.021.738-.225 1.46-.601 2.096a5.25 5.25 0 0 1-1.607 1.815 5.39 5.39 0 0 1-2.067.8c-.644.09-1.295.09-1.931.005z"/>
    </svg>
  );
}

// Google Gemini Icon
export function GeminiIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3.6c2.236 0 4.28.88 5.8 2.32l-2.12 2.12A5.15 5.15 0 0 0 12 6.52a5.48 5.48 0 0 0-5.48 5.48c0 1.4.52 2.68 1.38 3.66l-2.12 2.12A8.36 8.36 0 0 1 3.6 12 8.4 8.4 0 0 1 12 3.6zm0 16.8a8.36 8.36 0 0 1-5.8-2.32l2.12-2.12a5.15 5.15 0 0 0 3.68 1.52 5.48 5.48 0 0 0 5.48-5.48c0-1.4-.52-2.68-1.38-3.66l2.12-2.12A8.36 8.36 0 0 1 20.4 12a8.4 8.4 0 0 1-8.4 8.4z"/>
    </svg>
  );
}

// Perplexity Icon
export function PerplexityIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L1.5 6v12L12 24l10.5-6V6L12 0zm0 2.31l8.25 4.72v9.43L12 21.19l-8.25-4.73V7.03L12 2.31zm0 3.25L6.75 9.1v5.81L12 18.44l5.25-3.53V9.1L12 5.56zm0 2.31l3.38 2.27v4.56L12 16.12l-3.38-2.42V10.14L12 7.87z"/>
    </svg>
  );
}

// Bing AI / Copilot Icon
export function BingAIIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.857 2.129L9.97 3.867v12.26l5.666-3.282-2.98-1.38-.56-4.682 6.46 2.983v5.318l-8.586 5.046L2 16.13V6.345l3.857-4.216zM7.314 9.17v5.64l3.298 1.938 3.428-2.015-3.428-1.58V9.17h-3.298z"/>
    </svg>
  );
}

// Meta AI Icon
export function MetaAIIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.8 14.4c-1.2 1.2-2.8 1.8-4.4 1.8-1.6 0-3.2-.6-4.4-1.8-1.2-1.2-1.8-2.8-1.8-4.4 0-1.6.6-3.2 1.8-4.4 1.2-1.2 2.8-1.8 4.4-1.8s3.2.6 4.4 1.8c1.2 1.2 1.8 2.8 1.8 4.4 0 1.6-.6 3.2-1.8 4.4z"/>
    </svg>
  );
}

// You.com AI Icon  
export function YouIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  );
}

// AI Icon wrapper component that selects the right icon based on name
interface AIIconProps {
  name: string;
  className?: string;
  showBackground?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const aiConfig: Record<string, { icon: React.ComponentType<{ className?: string }>, bgColor: string, textColor: string }> = {
  'ChatGPT': { icon: ChatGPTIcon, bgColor: 'bg-[#10A37F]', textColor: 'text-white' },
  'chatgpt': { icon: ChatGPTIcon, bgColor: 'bg-[#10A37F]', textColor: 'text-white' },
  'Claude': { icon: ClaudeIcon, bgColor: 'bg-[#D4A27F]', textColor: 'text-white' },
  'claude': { icon: ClaudeIcon, bgColor: 'bg-[#D4A27F]', textColor: 'text-white' },
  'Gemini': { icon: GeminiIcon, bgColor: 'bg-[#4285F4]', textColor: 'text-white' },
  'gemini': { icon: GeminiIcon, bgColor: 'bg-[#4285F4]', textColor: 'text-white' },
  'Gemini 2.5 Flash': { icon: GeminiIcon, bgColor: 'bg-[#4285F4]', textColor: 'text-white' },
  'Perplexity': { icon: PerplexityIcon, bgColor: 'bg-[#20808D]', textColor: 'text-white' },
  'perplexity': { icon: PerplexityIcon, bgColor: 'bg-[#20808D]', textColor: 'text-white' },
  'Bing AI': { icon: BingAIIcon, bgColor: 'bg-[#00809D]', textColor: 'text-white' },
  'Copilot': { icon: BingAIIcon, bgColor: 'bg-[#00809D]', textColor: 'text-white' },
  'Meta AI': { icon: MetaAIIcon, bgColor: 'bg-[#0668E1]', textColor: 'text-white' },
  'You.com': { icon: YouIcon, bgColor: 'bg-[#6366F1]', textColor: 'text-white' },
};

const sizeConfig = {
  sm: { wrapper: 'w-6 h-6', icon: 'w-3.5 h-3.5' },
  md: { wrapper: 'w-8 h-8', icon: 'w-4.5 h-4.5' },
  lg: { wrapper: 'w-10 h-10', icon: 'w-5 h-5' },
};

export function AIIcon({ name, className, showBackground = true, size = 'md' }: AIIconProps) {
  const config = aiConfig[name] || aiConfig['ChatGPT'];
  const IconComponent = config.icon;
  const sizes = sizeConfig[size];

  if (!showBackground) {
    return <IconComponent className={className || sizes.icon} />;
  }

  return (
    <div className={`${sizes.wrapper} rounded-lg ${config.bgColor} flex items-center justify-center`}>
      <IconComponent className={`${sizes.icon} ${config.textColor}`} />
    </div>
  );
}

// Export a function to get the background color for an AI
export function getAIColor(name: string): string {
  const colors: Record<string, string> = {
    'ChatGPT': '#10A37F',
    'chatgpt': '#10A37F',
    'Claude': '#D4A27F', 
    'claude': '#D4A27F',
    'Gemini': '#4285F4',
    'gemini': '#4285F4',
    'Gemini 2.5 Flash': '#4285F4',
    'Perplexity': '#20808D',
    'perplexity': '#20808D',
    'Bing AI': '#00809D',
    'Copilot': '#00809D',
    'Meta AI': '#0668E1',
    'You.com': '#6366F1',
  };
  return colors[name] || '#6C5DD3';
}

export default AIIcon;

