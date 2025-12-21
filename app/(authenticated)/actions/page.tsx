'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw,
  ChevronDown,
  Calendar,
  FileText,
  Link2,
  Users,
  Sparkles,
  BookOpen,
  Layout,
  HelpCircle,
  Package,
  Clock,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { AIIcon } from '@/components/ui/AIIcons';
import { useToast } from '@/lib/store/hooks/useToast';
import { useGenerateContentMutation, useListContentQuery } from '@/lib/store/api/contentApi';
import { 
  useGetPromptGroupsQuery, 
  useGetSuggestedKeywordsQuery, 
  useGetBacklinkOpportunitiesQuery,
  SuggestedKeyword,
} from '@/lib/store/api/promptsApi';
import { useAppSelector } from '@/lib/store/hooks';
import { selectCurrentDomainId, selectIsVerified } from '@/lib/store/slices/domainSlice';
import { filterDateRanges } from '@/lib/mockData';

// Extend ContentKeyword type for compatibility
interface ContentKeyword extends SuggestedKeyword {
  aiModels: string[];
}

// Filter Dropdown Component
function FilterDropdown({ 
  icon: Icon, 
  options, 
  value, 
  onChange 
}: { 
  icon: React.ElementType;
  options: { value: string; label: string }[]; 
  value: string; 
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label || options[0].label;

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-sm"
      >
        <Icon className="w-4 h-4 text-gray-500" />
        <span className="text-gray-700 font-medium">{selectedLabel}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 w-40 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden"
            >
              {options.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ backgroundColor: 'rgba(108, 93, 211, 0.05)' }}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    value === option.value
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {option.label}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Prompt Group Dropdown
function PromptGroupDropdown({ 
  value, 
  onChange,
  groups,
  isLoading
}: { 
  value: string; 
  onChange: (value: string) => void;
  groups: { id: string; name: string; promptCount: number }[];
  isLoading?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="w-full flex items-center justify-between px-5 py-4 rounded-xl bg-primary text-white font-medium text-left disabled:opacity-50"
      >
        <span>{isLoading ? 'Loading groups...' : (value || 'Select a prompt group')}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && !isLoading && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto"
            >
              {groups.length === 0 ? (
                <div className="px-5 py-3 text-sm text-gray-500 text-center">
                  No prompt groups found. Create prompts first.
                </div>
              ) : (
                groups.map((group) => (
                  <motion.button
                    key={group.id}
                    whileHover={{ backgroundColor: 'rgba(108, 93, 211, 0.05)' }}
                    onClick={() => {
                      onChange(group.name);
                      setIsOpen(false);
                    }}
                    className={`w-full px-5 py-3 text-left text-sm transition-colors flex items-center justify-between ${
                      value === group.name
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <span>{group.name}</span>
                    <span className="text-xs text-gray-400">{group.promptCount} prompts</span>
                  </motion.button>
                ))
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Content Type definitions
const contentTypes = [
  { id: 'blog', label: 'Blog Post', icon: BookOpen, description: 'SEO-optimized article' },
  { id: 'landing', label: 'Landing Page', icon: Layout, description: 'Conversion-focused page' },
  { id: 'faq', label: 'FAQ Section', icon: HelpCircle, description: 'Common questions answered' },
  { id: 'product', label: 'Product Page', icon: Package, description: 'Product description' },
];

// Content Generation Modal
function ContentGenerationModal({
  keyword,
  domainId,
  isOpen,
  onClose,
  onGenerated
}: { 
  keyword: ContentKeyword | null; 
  domainId: string | null;
  isOpen: boolean; 
  onClose: () => void;
  onGenerated: (contentId: string) => void;
}) {
  const { success: showSuccess, error: showError } = useToast();
  const [generateContent, { isLoading: isGenerating }] = useGenerateContentMutation();
  const [selectedContentType, setSelectedContentType] = useState<'blog' | 'social' | 'landing' | 'faq'>('blog');
  const [instructions, setInstructions] = useState('');

  const handleGenerate = async () => {
    if (!selectedContentType || !keyword || !domainId) {
      showError('Please select a content type');
      return;
    }
    
    try {
      const result = await generateContent({
        domainId,
        keyword: keyword.keyword,
        type: selectedContentType,
        instructions: instructions || undefined,
      }).unwrap();
      
      onClose();
      
      // Reset state
      setSelectedContentType('blog');
      setInstructions('');
      
      showSuccess('Content generated successfully!');
      
      // Navigate to content history with the new content ID
      if (result.data?.content?.id) {
        onGenerated(result.data.content.id);
      }
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Failed to generate content');
    }
  };

  // Reset state when modal closes
  const handleClose = () => {
    setSelectedContentType('blog' as const);
    setInstructions('');
    onClose();
  };

  if (!keyword) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Generate Content" size="lg">
      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-gray-50">
          <p className="text-sm text-gray-500 mb-1">Selected keyword</p>
          <p className="text-lg font-semibold text-gray-900">{keyword.keyword}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm text-gray-500">Used by:</span>
            <div className="flex items-center gap-1">
              {keyword.aiModels.map((model) => (
                <AIIcon key={model} name={model} size="sm" />
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Content Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {contentTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedContentType === type.id;
              return (
                <motion.button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedContentType(type.id as 'blog' | 'landing' | 'faq' | 'social')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      isSelected ? 'bg-primary/10' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        isSelected ? 'text-primary' : 'text-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        isSelected ? 'text-primary' : 'text-gray-700'
                      }`}>
                        {type.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {type.description}
                      </p>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                      >
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Instructions (optional)
          </label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Add any specific requirements or context..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none h-24 text-sm"
          />
        </div>

        <Button
          onClick={handleGenerate}
          isLoading={isGenerating}
          className="w-full"
          size="lg"
          leftIcon={<Sparkles className="w-5 h-5" />}
        >
          {isGenerating ? 'Generating...' : `Generate ${contentTypes.find(t => t.id === selectedContentType)?.label || 'Content'}`}
        </Button>
      </div>
    </Modal>
  );
}

export default function ActionsPage() {
  const router = useRouter();
  const { success: showSuccess, error: showError, info: showInfo } = useToast();
  
  const currentDomainId = useAppSelector(selectCurrentDomainId);
  const isVerified = useAppSelector(selectIsVerified);
  
  // API queries
  const { data: contentHistoryData, refetch: refetchContent } = useListContentQuery(
    currentDomainId ? { domainId: currentDomainId } : undefined,
    { skip: !currentDomainId }
  );
  const contentHistory = contentHistoryData?.data?.contents || [];
  
  const { 
    data: promptGroupsData, 
    isLoading: isLoadingGroups,
    refetch: refetchGroups
  } = useGetPromptGroupsQuery(currentDomainId || undefined, {
    skip: !isVerified || !currentDomainId,
  });
  const promptGroups = promptGroupsData?.data?.groups || [];

  const [filterDate, setFilterDate] = useState('30d');
  const [selectedPromptGroup, setSelectedPromptGroup] = useState('');
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [selectedKeywordForContent, setSelectedKeywordForContent] = useState<ContentKeyword | null>(null);

  // Get suggested keywords based on selected group
  const { 
    data: keywordsData, 
    isLoading: isLoadingKeywords,
    isFetching: isFetchingKeywords,
    refetch: refetchKeywords
  } = useGetSuggestedKeywordsQuery(
    { 
      domainId: currentDomainId || undefined, 
      group: selectedPromptGroup || undefined,
      limit: 20 
    },
    { skip: !isVerified || !currentDomainId }
  );
  const suggestedKeywords = keywordsData?.data?.keywords || [];

  // Get backlink opportunities
  const { 
    data: backlinksData, 
    isLoading: isLoadingBacklinks,
    isFetching: isFetchingBacklinks,
    refetch: refetchBacklinks
  } = useGetBacklinkOpportunitiesQuery(
    { domainId: currentDomainId || undefined, limit: 20 },
    { skip: !isVerified || !currentDomainId }
  );
  const backlinkOpportunities = backlinksData?.data?.opportunities || [];

  const isRefreshing = isFetchingKeywords || isFetchingBacklinks;

  // Set first group as default when groups load
  React.useEffect(() => {
    if (promptGroups.length > 0 && !selectedPromptGroup) {
      setSelectedPromptGroup(promptGroups[0].name);
    }
  }, [promptGroups, selectedPromptGroup]);

  const handleRefresh = () => {
    refetchGroups();
    refetchKeywords();
    refetchBacklinks();
    refetchContent();
    showInfo('Data refreshed!');
  };

  const selectKeyword = (id: string) => {
    setSelectedKeyword(prev => prev === id ? null : id);
  };

  const handleGenerateContent = () => {
    if (!selectedKeyword) {
      showError('Please select a keyword');
      return;
    }
    const keyword = suggestedKeywords.find(k => k.id === selectedKeyword);
    if (keyword) {
      setSelectedKeywordForContent(keyword as ContentKeyword);
    }
  };

  const handleContentGenerated = (contentId: string) => {
    router.push(`/content-history?open=${contentId}`);
  };

  // Show message if domain not verified
  if (!isVerified || !currentDomainId) {
    return (
      <div className="space-y-6 pt-12 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Actions</h1>
          <p className="text-gray-500 mt-1">Generate content and find backlink opportunities</p>
        </motion.div>
        
        <Card className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Domain Not Verified</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Please verify your domain by installing the tracking script to use AI-powered actions.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      {/* Header with Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap items-center gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          className="p-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
        >
          <motion.div animate={{ rotate: isRefreshing ? 360 : 0 }} transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: 'linear' }}>
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </motion.div>
        </motion.button>

        <FilterDropdown
          icon={Calendar}
          options={filterDateRanges}
          value={filterDate}
          onChange={setFilterDate}
        />

        {/* Content History Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/content-history')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-medium text-sm transition-all"
        >
          <Clock className="w-4 h-4" />
          <span>Content</span>
          {contentHistory.length > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-primary text-white rounded-full">
              {contentHistory.length}
            </span>
          )}
        </motion.button>
      </motion.div>

      {/* Prompt Group Selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <PromptGroupDropdown 
          value={selectedPromptGroup} 
          onChange={setSelectedPromptGroup}
          groups={promptGroups}
          isLoading={isLoadingGroups}
        />
      </motion.div>

      {/* Write Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-700" />
              <div>
                <h3 className="font-semibold text-gray-900">Write Content</h3>
                <p className="text-sm text-gray-500">Select a keyword to generate AI-optimized content</p>
              </div>
            </div>
            {selectedKeyword && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Button
                  onClick={handleGenerateContent}
                  size="sm"
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  Generate Content
                </Button>
              </motion.div>
            )}
          </div>

          <div className="space-y-1">
            {isLoadingKeywords ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : suggestedKeywords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No keywords found. Create prompts first to get keyword suggestions.
              </div>
            ) : (
              suggestedKeywords.map((keyword, index) => {
                const isSelected = selectedKeyword === keyword.id;
                return (
                  <motion.button
                    key={keyword.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.03 }}
                    onClick={() => selectKeyword(keyword.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-primary/5 border-2 border-primary/30'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    {/* Radio Button */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 rounded-full bg-white"
                        />
                      )}
                    </div>

                    {/* Keyword */}
                    <span className={`flex-1 text-left font-medium ${isSelected ? 'text-primary' : 'text-gray-700'}`}>
                      {keyword.keyword}
                    </span>

                    {/* Priority Badge */}
                    {keyword.priority && (
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        keyword.priority === 'high' 
                          ? 'bg-green-100 text-green-700' 
                          : keyword.priority === 'medium' 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-gray-100 text-gray-600'
                      }`}>
                        {keyword.priority}
                      </span>
                    )}

                    {/* AI Models */}
                    <div className="flex items-center gap-1">
                      {keyword.aiModels.map((model) => (
                        <AIIcon key={model} name={model} size="sm" />
                      ))}
                    </div>
                  </motion.button>
                );
              })
            )}
          </div>
        </Card>
      </motion.div>

      {/* Build Backlinks Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="w-5 h-5 text-gray-700" />
            <div>
              <h3 className="font-semibold text-gray-900">Build Backlinks</h3>
              <p className="text-sm text-gray-500">Top sources that don&apos;t mention your brand - perfect outreach opportunities</p>
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 rounded-t-xl text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-5">URL</div>
            <div className="col-span-2">AI Models</div>
            <div className="col-span-2 text-center">Usage Count</div>
            <div className="col-span-1 text-center">Last Seen</div>
            <div className="col-span-2 text-center">First Identified</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {isLoadingBacklinks ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : backlinkOpportunities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No backlink opportunities found yet. Keep tracking prompts to discover sources.
              </div>
            ) : (
              backlinkOpportunities.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.03 }}
                  className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-gray-50 transition-colors group"
                >
                  {/* URL */}
                  <div className="col-span-5 flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center flex-shrink-0 text-xs">
                      {item.domain?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <a
                      href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-700 hover:text-primary truncate flex items-center gap-1 group-hover:text-primary transition-colors"
                    >
                      <span className="truncate">{item.url}</span>
                    </a>
                  </div>

                  {/* AI Models */}
                  <div className="col-span-2 flex items-center gap-1">
                    {item.aiModels.map((model) => (
                      <AIIcon key={model} name={model} size="sm" />
                    ))}
                  </div>

                  {/* Usage Count */}
                  <div className="col-span-2 text-center">
                    <span className="text-sm font-medium text-gray-900">{item.usageCount}</span>
                  </div>

                  {/* Last Seen */}
                  <div className="col-span-1 text-center">
                    <span className="text-sm text-gray-500">
                      {new Date(item.lastSeen).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  {/* First Identified */}
                  <div className="col-span-2 text-center">
                    <span className="text-sm text-gray-500">
                      {new Date(item.firstIdentified).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </Card>
      </motion.div>

      {/* Content Generation Modal */}
      <ContentGenerationModal
        keyword={selectedKeywordForContent}
        domainId={currentDomainId}
        isOpen={!!selectedKeywordForContent}
        onClose={() => setSelectedKeywordForContent(null)}
        onGenerated={handleContentGenerated}
      />
    </div>
  );
}
