'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  LayoutDashboard,
  Users,
  Sparkles,
  Settings,
  BarChart3,
  FileText,
  Activity,
  Link2,
  MessageSquare,
  Plug,
  Clock,
  Users2,
  CreditCard,
  HelpCircle,
  ArrowRight,
  Command,
} from 'lucide-react';

interface CommandItem {
  id: string;
  name: string;
  href: string;
  icon: React.ElementType;
  category: 'navigation' | 'action' | 'recent';
}

const navigationItems: CommandItem[] = [
  { id: 'dashboard', name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, category: 'navigation' },
  { id: 'competitors', name: 'My Competitors', href: '/competitors', icon: Users, category: 'navigation' },
  { id: 'ai-optimization', name: 'AI Engine Optimization', href: '/ai-optimization', icon: Sparkles, category: 'navigation' },
  { id: 'analytics', name: 'Analytics', href: '/analytics', icon: BarChart3, category: 'navigation' },
  { id: 'content', name: 'Content Management', href: '/content', icon: FileText, category: 'navigation' },
  { id: 'monitoring', name: 'Monitoring', href: '/monitoring', icon: Activity, category: 'navigation' },
  { id: 'backlinks', name: 'Backlink Tracking', href: '/backlinks', icon: Link2, category: 'navigation' },
  { id: 'ai-assistant', name: 'AI Assistant', href: '/ai-assistant', icon: MessageSquare, category: 'navigation' },
  { id: 'integrations', name: 'Integrations', href: '/integrations', icon: Plug, category: 'navigation' },
  { id: 'audit-history', name: 'Audit History', href: '/audit-history', icon: Clock, category: 'navigation' },
  { id: 'team', name: 'Team Management', href: '/team', icon: Users2, category: 'navigation' },
  { id: 'billing', name: 'Billing', href: '/billing', icon: CreditCard, category: 'navigation' },
  { id: 'docs', name: 'Documentation', href: '/docs', icon: HelpCircle, category: 'navigation' },
  { id: 'settings', name: 'Settings', href: '/settings', icon: Settings, category: 'navigation' },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredItems = query
    ? navigationItems.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
    : navigationItems;

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(i => (i + 1) % filteredItems.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(i => (i - 1 + filteredItems.length) % filteredItems.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredItems[selectedIndex]) {
            router.push(filteredItems[selectedIndex].href);
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, router, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  const handleItemClick = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-lg text-gray-900 placeholder-gray-400 outline-none"
          />
          <kbd className="px-2 py-1 rounded bg-gray-100 text-xs text-gray-500 font-mono">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {filteredItems.length > 0 ? (
            <>
              <div className="px-4 py-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Pages
                </p>
              </div>
              <div className="pb-2">
                {filteredItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.href)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                      index === selectedIndex ? 'bg-primary/10' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${index === selectedIndex ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className={`flex-1 text-left font-medium ${index === selectedIndex ? 'text-primary' : 'text-gray-700'}`}>
                      {item.name}
                    </span>
                    {index === selectedIndex && (
                      <ArrowRight className="w-4 h-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="px-4 py-8 text-center">
              <p className="text-gray-500">No results found for &quot;{query}&quot;</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-200 font-mono">↑</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-gray-200 font-mono">↓</kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-200 font-mono">↵</kbd>
            <span>Select</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-200 font-mono">ESC</kbd>
            <span>Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}


