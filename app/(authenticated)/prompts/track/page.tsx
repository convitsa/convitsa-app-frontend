'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus,
  Search,
  Sparkles,
  Globe,
  MapPin,
  Tag,
  Bot,
  ArrowRight,
  X,
  CheckCircle2,
  Loader2,
  Lightbulb,
  Target
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useCreatePromptMutation } from '@/lib/store/api/promptsApi';
import { useAppSelector } from '@/lib/store/hooks';
import { selectCurrentDomainId } from '@/lib/store/slices/domainSlice';
import { useToast } from '@/lib/store/hooks/useToast';

interface PromptSuggestion {
  id: string;
  prompt: string;
  category: string;
}

const promptSuggestions: PromptSuggestion[] = [
  { id: '1', prompt: 'Best tools for [your industry]', category: 'Discovery' },
  { id: '2', prompt: 'How to choose a [your product type]', category: 'Comparison' },
  { id: '3', prompt: 'What is [your brand name]', category: 'Brand' },
  { id: '4', prompt: '[Your product] vs competitors', category: 'Comparison' },
  { id: '5', prompt: 'Reviews of [your product]', category: 'Reviews' },
  { id: '6', prompt: 'Alternative to [competitor name]', category: 'Discovery' },
];

const locations = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'GLOBAL', name: 'Global', flag: '🌍' },
];

const groups = [
  'General',
  'Product',
  'Comparison',
  'Brand',
  'Reviews',
  'Support',
];

export default function TrackPromptPage() {
  const router = useRouter();
  const { success: showSuccess, error: showError } = useToast();
  const currentDomainId = useAppSelector(selectCurrentDomainId);
  
  const [createPrompt, { isLoading: isCreating }] = useCreatePromptMutation();
  
  const [prompt, setPrompt] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('US');
  const [selectedGroup, setSelectedGroup] = useState('General');
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [addedPrompts, setAddedPrompts] = useState<string[]>([]);

  const handleAddPrompt = async () => {
    if (!prompt.trim()) {
      showError('Please enter a prompt');
      return;
    }

    if (!currentDomainId) {
      showError('Please select a domain first');
      return;
    }

    try {
      await createPrompt({
        domainId: currentDomainId,
        text: prompt,
        group: selectedGroup,
        location: selectedLocation,
        aiPlatforms: ['chatgpt', 'claude', 'gemini', 'perplexity', 'bing'],
      }).unwrap();
      
      setAnalysisComplete(true);
      setAddedPrompts(prev => [...prev, prompt]);
      showSuccess('Prompt added and analysis started!');
      
      // Reset form after short delay
      setTimeout(() => {
        setPrompt('');
        setAnalysisComplete(false);
      }, 2000);
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Failed to add prompt');
    }
  };

  const handleUseSuggestion = (suggestion: PromptSuggestion) => {
    setPrompt(suggestion.prompt);
    setSelectedGroup(suggestion.category);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-6 pt-12 lg:pt-0 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Track New Prompt</h1>
            <p className="text-gray-500 mt-1">Add prompts to monitor your AI visibility</p>
          </div>
        </div>
      </motion.div>

      {/* Main Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <div className="space-y-6">
            {/* Prompt Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Prompt
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Best AI tools for marketing"
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                {prompt && (
                  <button
                    onClick={() => setPrompt('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Location & Group Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Target Location
                  </div>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {locations.slice(0, 4).map((location) => (
                    <motion.button
                      key={location.code}
                      onClick={() => setSelectedLocation(location.code)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        p-3 rounded-xl border-2 transition-all text-center
                        ${selectedLocation === location.code
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <span className="text-2xl">{location.flag}</span>
                      <p className={`text-xs mt-1 ${selectedLocation === location.code ? 'text-primary font-medium' : 'text-gray-500'}`}>
                        {location.code}
                      </p>
                    </motion.button>
                  ))}
                </div>
                <button
                  onClick={() => {}}
                  className="mt-2 text-sm text-primary hover:underline"
                >
                  + More locations
                </button>
              </div>

              {/* Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Prompt Group
                  </div>
                </label>
                <div className="flex flex-wrap gap-2">
                  {groups.map((group) => (
                    <motion.button
                      key={group}
                      onClick={() => setSelectedGroup(group)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium
                        ${selectedGroup === group
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }
                      `}
                    >
                      {group}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Platforms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  AI Platforms to Track
                </div>
              </label>
              <div className="flex flex-wrap gap-2">
                {['ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'Bing'].map((platform) => (
                  <div
                    key={platform}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    {platform}
                  </div>
                ))}
                <span className="px-3 py-2 text-sm text-gray-400">All platforms selected</span>
              </div>
            </div>

            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                onClick={handleAddPrompt}
                size="lg"
                className="w-full"
                isLoading={isCreating}
                leftIcon={
                  analysisComplete ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : isCreating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )
                }
              >
                {analysisComplete 
                  ? 'Prompt Added Successfully!' 
                  : isCreating 
                    ? 'Analyzing Prompt...' 
                    : 'Add & Start Tracking'
                }
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Prompt Suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <h3 className="font-semibold text-gray-900">Suggested Prompts</h3>
                </div>
                <button
                  onClick={() => setShowSuggestions(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {promptSuggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    onClick={() => handleUseSuggestion(suggestion)}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all text-left group"
                  >
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                        {suggestion.prompt}
                      </p>
                      <span className="text-xs text-gray-400">{suggestion.category}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recently Added Prompts */}
      {addedPrompts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-gray-900">Recently Added</h3>
            </div>
            <div className="space-y-2">
              {addedPrompts.map((addedPrompt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-gray-900">{addedPrompt}</span>
                  </div>
                  <span className="text-xs text-green-600 font-medium">Tracking</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Button
                variant="secondary"
                onClick={() => router.push('/dashboard')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                View All Prompts in Dashboard
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
