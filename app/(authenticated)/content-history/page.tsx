'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText,
  Clock,
  BookOpen,
  Layout,
  HelpCircle,
  Package,
  ChevronDown,
  Search,
  Eye,
  Edit,
  Copy,
  Download,
  X,
  CheckCircle2,
  Archive,
  BarChart3,
  ChevronRight,
  Loader2
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { AIIcon } from '@/components/ui/AIIcons';
import { useToast } from '@/lib/store/hooks/useToast';
import { useGetContentHistoryQuery, useLazyGetContentQuery, useUpdateContentMutation, useDeleteContentMutation } from '@/lib/store/api/contentApi';
import { 
  contentTypeLabels,
  type ContentType,
  type ContentStatus
} from '@/lib/mockData';

// Define GeneratedContent interface locally to avoid import issues
interface GeneratedContent {
  id: string;
  keyword: string;
  contentType: ContentType;
  title: string;
  excerpt: string;
  content: string;
  status: ContentStatus;
  seoScore: number;
  readabilityScore: number;
  wordCount: number;
  aiModels: string[];
  createdAt: string;
  updatedAt: string;
}

// Content type icons
const contentTypeIcons: Record<string, React.ElementType> = {
  blog: BookOpen,
  landing: Layout,
  faq: HelpCircle,
  product: Package,
  social: FileText,
};

// Status badge colors
const statusColors: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  generating: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Loader2 },
  draft: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Edit },
  published: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2 },
  archived: { bg: 'bg-gray-100', text: 'text-gray-600', icon: Archive },
};

// Content Detail Slider Panel
function ContentSliderPanel({ 
  content, 
  isOpen, 
  onClose 
}: { 
  content: GeneratedContent | null; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const { success: showSuccess, error: showError } = useToast();
  const [updateContent] = useUpdateContentMutation();
  const [activeTab, setActiveTab] = useState<'preview' | 'raw'>('preview');

  // Reset tab when content changes
  useEffect(() => {
    if (content) {
      setActiveTab('preview');
    }
  }, [content?.id]);

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content.content);
      showSuccess('Content copied to clipboard!');
    }
  };

  const handleDownload = () => {
    if (content) {
      const blob = new Blob([content.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${content.title.toLowerCase().replace(/\s+/g, '-')}.md`;
      a.click();
      URL.revokeObjectURL(url);
      showSuccess('Content downloaded!');
    }
  };

  const handlePublish = async () => {
    if (!content) return;
    
    try {
      await updateContent({
        contentId: content.id,
        status: 'published',
      }).unwrap();
      showSuccess('Content published!');
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Failed to publish content');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && content && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          
          {/* Slider Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                </motion.button>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      {(() => {
                        const Icon = contentTypeIcons[content.contentType];
                        return <Icon className="w-4 h-4 text-primary" />;
                      })()}
                    </div>
                    <span className="text-sm font-medium text-primary">{contentTypeLabels[content.contentType]}</span>
                    {(() => {
                      const status = statusColors[content.status];
                      const StatusIcon = status.icon;
                      return (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${status.bg} ${status.text}`}>
                          <StatusIcon className="w-3 h-3" />
                          {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Title & Excerpt */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{content.title}</h2>
                <p className="text-gray-500">{content.excerpt}</p>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-gray-50">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Keyword</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{content.keyword}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">AI Models</p>
                  <div className="flex items-center gap-1">
                    {content.aiModels.map((model) => (
                      <AIIcon key={model} name={model} size="sm" />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Word Count</p>
                  <p className="text-sm font-medium text-gray-900">{content.wordCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Created</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(content.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-gray-200 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">SEO Score</span>
                    <span className={`text-xl font-bold ${
                      content.seoScore >= 80 ? 'text-green-600' : content.seoScore >= 60 ? 'text-amber-600' : 'text-red-600'
                    }`}>{content.seoScore}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${content.seoScore}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-full rounded-full ${
                        content.seoScore >= 80 ? 'bg-green-500' : content.seoScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-gray-200 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Readability</span>
                    <span className={`text-xl font-bold ${
                      content.readabilityScore >= 80 ? 'text-green-600' : content.readabilityScore >= 60 ? 'text-amber-600' : 'text-red-600'
                    }`}>{content.readabilityScore}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${content.readabilityScore}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className={`h-full rounded-full ${
                        content.readabilityScore >= 80 ? 'bg-green-500' : content.readabilityScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Content Tabs */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'preview'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => setActiveTab('raw')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'raw'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Raw Markdown
                  </button>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
                  <div className="max-h-[400px] overflow-y-auto p-4">
                    {activeTab === 'preview' ? (
                      <div className="prose prose-sm max-w-none">
                        {content.content.split('\n').map((line, i) => {
                          if (line.startsWith('# ')) {
                            return <h1 key={i} className="text-2xl font-bold text-gray-900 mt-4 mb-2 first:mt-0">{line.replace('# ', '')}</h1>;
                          }
                          if (line.startsWith('## ')) {
                            return <h2 key={i} className="text-xl font-bold text-gray-900 mt-4 mb-2">{line.replace('## ', '')}</h2>;
                          }
                          if (line.startsWith('### ')) {
                            return <h3 key={i} className="text-lg font-bold text-gray-900 mt-3 mb-2">{line.replace('### ', '')}</h3>;
                          }
                          if (line.startsWith('- ')) {
                            return <li key={i} className="text-gray-700 ml-4">{line.replace('- ', '')}</li>;
                          }
                          if (line.startsWith('✅ ') || line.startsWith('**')) {
                            return <p key={i} className="text-gray-700 font-medium my-1">{line}</p>;
                          }
                          if (line.trim() === '') {
                            return <br key={i} />;
                          }
                          return <p key={i} className="text-gray-700 my-1">{line}</p>;
                        })}
                      </div>
                    ) : (
                      <pre className="text-sm text-gray-700 font-mono whitespace-pre-wrap">{content.content}</pre>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-3">
                <Button onClick={handleCopy} variant="secondary" leftIcon={<Copy className="w-4 h-4" />}>
                  Copy
                </Button>
                <Button onClick={handleDownload} variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
                  Download
                </Button>
                <div className="flex-1" />
                <Button variant="secondary" leftIcon={<Edit className="w-4 h-4" />}>
                  Edit
                </Button>
                {content.status === 'draft' && (
                  <Button leftIcon={<CheckCircle2 className="w-4 h-4" />} onClick={handlePublish}>
                    Publish
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function ContentHistoryPage() {
  const searchParams = useSearchParams();
  const { success: showSuccess, error: showError } = useToast();
  const { data: contentHistoryData, isLoading, isError } = useGetContentHistoryQuery();
  const [getContent, { isLoading: isLoadingContent }] = useLazyGetContentQuery();
  
  const contents = useMemo(() => {
    const rawContents = contentHistoryData?.data?.contents || [];
    // Transform API data to match expected format
    return rawContents.map((c: any) => ({
      id: c.id,
      keyword: c.keyword || '',
      contentType: c.type || c.contentType || 'blog', // API returns 'type', we need 'contentType'
      title: c.title || '',
      excerpt: c.title || '', // Use title as excerpt if not provided
      content: c.content || c.body || '',
      status: c.status || 'draft',
      seoScore: c.metadata?.seoScore || 0,
      readabilityScore: c.metadata?.readabilityScore || 0,
      wordCount: c.wordCount || 0,
      aiModels: c.aiModels || [], // Default to empty array if not provided
      createdAt: c.createdAt,
      updatedAt: c.updatedAt || c.createdAt,
    }));
  }, [contentHistoryData]);
  
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);

  // Fetch full content details when a content is selected
  const handleSelectContent = async (contentId: string) => {
    setSelectedContentId(contentId);
    try {
      const result = await getContent(contentId).unwrap();
      if (result?.data?.content) {
        const c = result.data.content;
        // Transform the full content data
        setSelectedContent({
          id: c.id || c._id,
          keyword: c.keyword || '',
          contentType: c.type || c.contentType || 'blog',
          title: c.generatedContent?.title || c.title || '',
          excerpt: c.generatedContent?.meta?.description || c.generatedContent?.title || '',
          content: c.generatedContent?.body || c.content || '',
          status: c.status || 'draft',
          seoScore: c.metadata?.seoScore || 0,
          readabilityScore: c.metadata?.readabilityScore || 0,
          wordCount: c.wordCount || 0,
          aiModels: c.aiModels || [],
          createdAt: c.createdAt,
          updatedAt: c.updatedAt || c.createdAt,
        });
      }
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Failed to load content details');
      setSelectedContentId(null);
    }
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<ContentType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<ContentStatus | 'all'>('all');
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  // Check for openId in URL params to auto-open a content item
  useEffect(() => {
    const openId = searchParams.get('open');
    if (openId && contents.length > 0) {
      const content = contents.find((c: GeneratedContent) => c.id === openId);
      if (content) {
        setTimeout(() => {
          handleSelectContent(content.id);
        }, 300);
      }
    }
  }, [searchParams, contents]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter content
  const filteredContent = useMemo(() => {
    return contents.filter((content: GeneratedContent) => {
      const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           content.keyword.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || content.contentType === filterType;
      const matchesStatus = filterStatus === 'all' || content.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [contents, searchQuery, filterType, filterStatus]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content History</h1>
            <p className="text-gray-500 mt-1">View and manage your generated content</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {contents.length} items
          </span>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center gap-3"
      >
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search content..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
          />
        </div>

        {/* Type Filter */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-sm"
          >
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 font-medium">
              {filterType === 'all' ? 'All Types' : contentTypeLabels[filterType]}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.button>

          <AnimatePresence>
            {typeDropdownOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setTypeDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-xl z-40 overflow-hidden"
                >
                  <button
                    onClick={() => { setFilterType('all'); setTypeDropdownOpen(false); }}
                    className={`w-full px-4 py-2.5 text-left text-sm ${filterType === 'all' ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    All Types
                  </button>
                  {(Object.keys(contentTypeLabels) as ContentType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => { setFilterType(type); setTypeDropdownOpen(false); }}
                      className={`w-full px-4 py-2.5 text-left text-sm ${filterType === type ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {contentTypeLabels[type]}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-sm"
          >
            <BarChart3 className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 font-medium">
              {filterStatus === 'all' ? 'All Status' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.button>

          <AnimatePresence>
            {statusDropdownOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setStatusDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 w-40 bg-white rounded-xl border border-gray-200 shadow-xl z-40 overflow-hidden"
                >
                  <button
                    onClick={() => { setFilterStatus('all'); setStatusDropdownOpen(false); }}
                    className={`w-full px-4 py-2.5 text-left text-sm ${filterStatus === 'all' ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    All Status
                  </button>
                  {(['draft', 'published', 'archived'] as ContentStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => { setFilterStatus(status); setStatusDropdownOpen(false); }}
                      className={`w-full px-4 py-2.5 text-left text-sm ${filterStatus === status ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Content Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {filteredContent.map((content: GeneratedContent, index: number) => {
          const Icon = contentTypeIcons[content.contentType] || FileText;
          const status = statusColors[content.status] || statusColors.draft;
          const StatusIcon = status.icon;
          const isSelected = selectedContentId === content.id;
          const isContentLoading = isLoadingContent && selectedContentId === content.id;

          return (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card 
                className={`cursor-pointer transition-all group ${
                  isSelected 
                    ? 'shadow-lg border-primary ring-2 ring-primary/20' 
                    : 'hover:shadow-lg hover:border-primary/30'
                }`}
                onClick={() => handleSelectContent(content.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-xl transition-colors ${
                    isSelected ? 'bg-primary/10' : 'bg-gray-100 group-hover:bg-primary/10'
                  }`}>
                    <Icon className={`w-6 h-6 transition-colors ${
                      isSelected ? 'text-primary' : 'text-gray-600 group-hover:text-primary'
                    }`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-primary">{contentTypeLabels[content.contentType]}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${status.bg} ${status.text}`}>
                        <StatusIcon className="w-3 h-3" />
                        {content.status}
                      </span>
                    </div>
                    <h3 className={`font-semibold truncate transition-colors ${
                      isSelected ? 'text-primary' : 'text-gray-900 group-hover:text-primary'
                    }`}>
                      {content.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{content.excerpt}</p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 mt-3">
                      {content.aiModels && content.aiModels.length > 0 && (
                        <div className="flex items-center gap-1">
                          {content.aiModels.slice(0, 2).map((model) => (
                            <AIIcon key={model} name={model} size="sm" />
                          ))}
                        </div>
                      )}
                      <span className="text-xs text-gray-400">{content.wordCount || 0} words</span>
                      <span className="text-xs text-gray-400">
                        {new Date(content.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* View Button / Loading */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    className={`p-2 rounded-lg transition-all ${
                      isSelected 
                        ? 'bg-primary text-white opacity-100' 
                        : 'bg-gray-100 group-hover:bg-primary group-hover:text-white text-gray-500 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {isContentLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Empty State */}
      {filteredContent.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No content found</h3>
          <p className="text-gray-500">Try adjusting your filters or generate new content</p>
        </motion.div>
      )}

      {/* Content Slider Panel */}
      <ContentSliderPanel
        content={selectedContent}
        isOpen={!!selectedContent}
        onClose={() => {
          setSelectedContent(null);
          setSelectedContentId(null);
        }}
      />
    </div>
  );
}
