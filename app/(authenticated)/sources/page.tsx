'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Folder,
  Bot,
  Users,
  ExternalLink,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '@/components/ui/Card';
import { AIIcon, getAIColor } from '@/components/ui/AIIcons';
import { useToast } from '@/lib/store/hooks/useToast';
import { useGetSourcesQuery, useGetTopDomainsQuery, useGetDomainTrendsQuery } from '@/lib/store/api/sourcesApi';
import { useGetPromptGroupsQuery } from '@/lib/store/api/promptsApi';
import { useAppSelector } from '@/lib/store/hooks';
import { selectCurrentDomainId, selectIsVerified } from '@/lib/store/slices/domainSlice';
import { filterLLMs, filterDateRanges, filterGroups } from '@/lib/mockData';

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

// Tag component
function Tag({ label, type }: { label: string; type: 'default' | 'success' | 'warning' | 'danger' }) {
  const styles = {
    default: 'bg-gray-100 text-gray-600',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-600',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[type]}`}>
      {label}
    </span>
  );
}

export default function SourcesPage() {
  const { success: showSuccess, info: showInfo } = useToast();
  const currentDomainId = useAppSelector(selectCurrentDomainId);
  const isVerified = useAppSelector(selectIsVerified);
  
  const [filterGroup, setFilterGroup] = useState('all');
  const [filterLLM, setFilterLLM] = useState('all');
  const [filterDate, setFilterDate] = useState('7d');
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'opportunity' | 'mentions_you' | 'your_website'>('opportunity');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Calculate date range based on filter
  const dateRange = useMemo(() => {
    const end = new Date();
    let start = new Date();
    
    switch (filterDate) {
      case '7d':
        start.setDate(start.getDate() - 7);
        break;
      case '30d':
        start.setDate(start.getDate() - 30);
        break;
      case '90d':
        start.setDate(start.getDate() - 90);
        break;
      case '12m':
        start.setMonth(start.getMonth() - 12);
        break;
      default:
        start.setDate(start.getDate() - 7);
    }
    
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  }, [filterDate]);

  // Get prompt groups for filter
  const { data: groupsData } = useGetPromptGroupsQuery(currentDomainId || undefined, {
    skip: !isVerified || !currentDomainId,
  });
  const promptGroups = useMemo(() => [
    { value: 'all', label: 'All Groups' },
    ...(groupsData?.data?.groups?.map((g) => ({ value: g.id, label: g.name })) || []),
  ], [groupsData]);

  // API Queries
  const { 
    data: sourcesData, 
    isLoading: isLoadingSources,
    isFetching: isFetchingSources,
    refetch: refetchSources
  } = useGetSourcesQuery(
    {
      domainId: currentDomainId || undefined,
      status: activeTab,
      aiPlatform: filterLLM !== 'all' ? filterLLM : undefined,
      sourceDomain: selectedDomain || undefined,
      ...dateRange,
      page: currentPage,
      limit: itemsPerPage,
    },
    { skip: !isVerified || !currentDomainId }
  );

  const { 
    data: topDomainsData, 
    isLoading: isLoadingTopDomains,
    refetch: refetchTopDomains
  } = useGetTopDomainsQuery(
    {
      domainId: currentDomainId || undefined,
      aiPlatform: filterLLM !== 'all' ? filterLLM : undefined,
      ...dateRange,
      limit: 10,
    },
    { skip: !isVerified || !currentDomainId }
  );

  const { 
    data: trendsData, 
    isLoading: isLoadingTrends,
    refetch: refetchTrends
  } = useGetDomainTrendsQuery(
    {
      domainId: currentDomainId || undefined,
      aiPlatform: filterLLM !== 'all' ? filterLLM : undefined,
      ...dateRange,
    },
    { skip: !isVerified || !currentDomainId }
  );

  const isRefreshing = isFetchingSources;

  const handleRefresh = () => {
    refetchSources();
    refetchTopDomains();
    refetchTrends();
    showInfo('Data refreshed!');
  };

  // Extract data from API responses
  const sources = sourcesData?.data?.sources || [];
  const counts = sourcesData?.data?.counts || { opportunity: 0, mentions_you: 0, your_website: 0, total: 0 };
  const pagination = sourcesData?.data?.pagination || { page: 1, limit: 25, total: 0, pages: 0 };
  const topDomains = topDomainsData?.data?.domains || [];
  const trends = trendsData?.data?.trends || [];
  const trendDomains = trendsData?.data?.domains || [];

  const totalSources = counts.total;
  const opportunityCount = counts.opportunity;
  const mentionsYouCount = counts.mentions_you;
  const yourWebsiteCount = counts.your_website;
  const totalPages = pagination.pages;
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Show message if domain not verified
  if (!isVerified || !currentDomainId) {
    return (
      <div className="space-y-6 pt-12 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Sources</h1>
          <p className="text-gray-500 mt-1">Discover sources cited by AI models</p>
        </motion.div>
        
        <Card className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Domain Not Verified</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Please verify your domain by installing the tracking script to see source analytics.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap items-center gap-3"
      >
        <FilterDropdown
          icon={Folder}
          options={filterGroups}
          value={filterGroup}
          onChange={setFilterGroup}
        />
        <FilterDropdown
          icon={Bot}
          options={filterLLMs}
          value={filterLLM}
          onChange={setFilterLLM}
        />
        <FilterDropdown
          icon={Calendar}
          options={filterDateRanges}
          value={filterDate}
          onChange={setFilterDate}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          className="p-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all ml-auto"
        >
          <motion.div animate={{ rotate: isRefreshing ? 360 : 0 }} transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: 'linear' }}>
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Top Section - Two Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Domains */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900">Top Domains</h3>
              <p className="text-sm text-gray-500">Click to filter by domain</p>
            </div>

            <div className="space-y-2">
              {isLoadingTopDomains ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : topDomains.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No source domains found yet. Track prompts to discover sources.
                </div>
              ) : (
                topDomains.map((domain, index) => (
                  <motion.button
                    key={domain.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    whileHover={{ scale: 1.01, x: 4 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedDomain(selectedDomain === domain.domain ? null : domain.domain)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      selectedDomain === domain.domain
                        ? 'bg-primary/10 border-2 border-primary/30'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div 
                      className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: domain.color }}
                    >
                      {domain.domain?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <span className="flex-1 text-left text-gray-700 font-medium text-sm">{domain.domain}</span>
                    <span className="text-gray-500 font-medium">{domain.count}</span>
                  </motion.button>
                ))
              )}
            </div>
          </Card>
        </motion.div>

        {/* Domain Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900">Domain Trends</h3>
              <p className="text-sm text-gray-500">Top domains over time</p>
            </div>

            <div className="h-52">
              {isLoadingTrends ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : trends.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                  No trend data available yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        fontSize: '12px',
                      }}
                    />
                    {trendDomains.map((domain, index) => {
                      const colors = ['#6C5DD3', '#333333', '#10B981', '#F59E0B', '#3B82F6', '#EC4899'];
                      return (
                        <Line
                          key={domain}
                          type="monotone"
                          dataKey={domain}
                          stroke={colors[index % colors.length]}
                          strokeWidth={2}
                          dot={false}
                          name={domain}
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Status Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-2 border-b border-gray-200"
      >
        <button
          onClick={() => { setActiveTab('opportunity'); setCurrentPage(1); }}
          className={`px-4 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'opportunity'
              ? 'text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="text-gray-400 mr-1">{totalSources > 0 ? Math.round((opportunityCount / totalSources) * 100) : 0}%</span>
          <span className="text-gray-500">({opportunityCount})</span>
          <span className="ml-1">Opportunity</span>
          {activeTab === 'opportunity' && (
            <motion.div
              layoutId="activeSourceTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>
        <button
          onClick={() => { setActiveTab('mentions_you'); setCurrentPage(1); }}
          className={`px-4 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'mentions_you'
              ? 'text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="text-gray-400 mr-1">{totalSources > 0 ? Math.round((mentionsYouCount / totalSources) * 100) : 0}%</span>
          <span className="text-gray-500">({mentionsYouCount})</span>
          <span className="ml-1">Mentions You</span>
          {activeTab === 'mentions_you' && (
            <motion.div
              layoutId="activeSourceTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>
        <button
          onClick={() => { setActiveTab('your_website'); setCurrentPage(1); }}
          className={`px-4 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'your_website'
              ? 'text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="text-gray-400 mr-1">{totalSources > 0 ? Math.round((yourWebsiteCount / totalSources) * 100) : 0}%</span>
          <span className="text-gray-500">({yourWebsiteCount})</span>
          <span className="ml-1">Your Website</span>
          {activeTab === 'your_website' && (
            <motion.div
              layoutId="activeSourceTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>
      </motion.div>

      {/* URL Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="overflow-hidden p-0">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
            <div className="col-span-5">URL</div>
            <div className="col-span-2">AI Models</div>
            <div className="col-span-2 text-center">Usage Count</div>
            <div className="col-span-1 text-center">Last Seen</div>
            <div className="col-span-2 text-center">First Identified</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {isLoadingSources ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : sources.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No sources found for this filter. Try changing the filters or track more prompts.
              </div>
            ) : (
              sources.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.02 }}
                  className="grid grid-cols-12 gap-4 px-4 py-3 items-start hover:bg-gray-50 transition-colors group"
                >
                  {/* URL */}
                  <div className="col-span-5 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-gray-500">
                        {item.domain?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <a
                        href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-700 hover:text-primary truncate flex-1 group-hover:text-primary transition-colors"
                      >
                        {item.url}
                      </a>
                    </div>
                    <div className="flex items-center gap-1.5 ml-7">
                      {item.tags.map((tag, tagIndex) => (
                        <Tag key={tagIndex} label={tag.label} type={tag.type} />
                      ))}
                    </div>
                  </div>

                  {/* AI Models */}
                  <div className="col-span-2 flex items-center gap-1 pt-1">
                    {item.aiModels.map((model) => (
                      <AIIcon key={model} name={model} size="sm" />
                    ))}
                  </div>

                  {/* Usage Count */}
                  <div className="col-span-2 text-center pt-1">
                    <span className="text-sm font-medium text-gray-900">{item.usageCount}</span>
                  </div>

                  {/* Last Seen */}
                  <div className="col-span-1 text-center pt-1">
                    <span className="text-sm text-gray-500">
                      {new Date(item.lastSeen).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  {/* First Identified */}
                  <div className="col-span-2 text-center pt-1">
                    <span className="text-sm text-gray-500">
                      {new Date(item.firstIdentified).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {sources.length > 0 ? (
                <>Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, pagination.total)} of {pagination.total} sources</>
              ) : (
                'No sources found'
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="px-2 py-1 rounded-lg border border-gray-200 text-sm bg-white"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-500" />
                </motion.button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                </motion.button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
