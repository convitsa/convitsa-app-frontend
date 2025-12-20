'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot,
  Eye,
  Globe,
  Info,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Filter,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import LiveIndicator, { LiveStatCard } from '@/components/ui/LiveIndicator';
import { useGetLLMAnalyticsQuery } from '@/lib/store/api/analyticsApi';
import { useAppSelector } from '@/lib/store/hooks';
import { selectCurrentDomainId, selectIsVerified } from '@/lib/store/slices/domainSlice';

type BotFilter = 'all' | 'main';

// Bot type badge configuration
const botTypeConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  user_action: { label: 'User Action', color: 'text-green-700', bgColor: 'bg-green-100' },
  training: { label: 'Training', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  search_indexing: { label: 'Search Indexing', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  other: { label: 'Other', color: 'text-gray-700', bgColor: 'bg-gray-100' },
};

// Static list of known AI bots for the explanation section
const knownBots = [
  { id: 1, name: 'ChatGPT', icon: 'chatgpt', type: 'user_action' },
  { id: 2, name: 'Claude', icon: 'claude', type: 'user_action' },
  { id: 3, name: 'Perplexity', icon: 'perplexity', type: 'user_action' },
  { id: 4, name: 'Gemini', icon: 'gemini', type: 'user_action' },
  { id: 5, name: 'Google', icon: 'google', type: 'search_indexing' },
  { id: 6, name: 'Bing', icon: 'bing', type: 'search_indexing' },
  { id: 7, name: 'GPTBot', icon: 'chatgpt', type: 'training' },
  { id: 8, name: 'CCBot', icon: 'other', type: 'training' },
  { id: 9, name: 'Anthropic', icon: 'claude', type: 'training' },
  { id: 10, name: 'Bytespider', icon: 'other', type: 'training' },
];

// Bot icon component based on icon type
function BotIcon({ icon, className = "w-5 h-5" }: { icon?: string; className?: string }) {
  switch (icon) {
    case 'google':
      return (
        <svg className={className} viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      );
    case 'bing':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#00809D">
          <path d="M5 3v16.5l4.75 2.5V9l5.5 2v5.5l-5.5 3.25L5 17.5V21l9.25-5.5V9L10 7V3z"/>
        </svg>
      );
    case 'chatgpt':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#10A37F">
          <path d="M22.28 9.82a5.98 5.98 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9A6.07 6.07 0 0 0 4.98 4.18a5.98 5.98 0 0 0-4 2.9 6.05 6.05 0 0 0 .74 7.1 5.98 5.98 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.51 2.9A5.98 5.98 0 0 0 13.26 24a6.06 6.06 0 0 0 5.77-4.21 5.99 5.99 0 0 0 4-2.9 6.06 6.06 0 0 0-.75-7.07z"/>
        </svg>
      );
    case 'claude':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#D4A27F">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="8" cy="10" r="2" fill="white"/>
          <circle cx="16" cy="10" r="2" fill="white"/>
        </svg>
      );
    case 'perplexity':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#20808D">
          <path d="M12 0L1.5 6v12L12 24l10.5-6V6L12 0zm0 2.31l8.25 4.72v9.43L12 21.19l-8.25-4.73V7.03L12 2.31z"/>
        </svg>
      );
    case 'gemini':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#4285F4">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3.6c4.638 0 8.4 3.762 8.4 8.4s-3.762 8.4-8.4 8.4-8.4-3.762-8.4-8.4 3.762-8.4 8.4-8.4z"/>
        </svg>
      );
    default:
      return <Bot className={className} />;
  }
}

export default function LLMAnalyticsPage() {
  const currentDomainId = useAppSelector(selectCurrentDomainId);
  const isVerified = useAppSelector(selectIsVerified);
  
  const [botFilter, setBotFilter] = useState<BotFilter>('all');
  const [pagesPage, setPagesPage] = useState(1);
  const [botsPage, setBotsPage] = useState(1);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [selectedBot, setSelectedBot] = useState<string | null>(null);
  
  const itemsPerPage = 7;

  // Calculate date range (last 30 days)
  const dateRange = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  }, []);

  // API Query
  const { 
    data: analyticsData, 
    isLoading, 
    isFetching,
    refetch 
  } = useGetLLMAnalyticsQuery(
    { domainId: currentDomainId || undefined, ...dateRange },
    { skip: !isVerified || !currentDomainId }
  );

  // Extract data from API
  const llmData = analyticsData?.data;
  const totalCrawls = llmData?.totalCrawls || 0;
  const uniqueBots = llmData?.uniqueBots || 0;
  const avgCrawlsPerDay = llmData?.avgCrawlsPerDay || 0;
  const topBots = llmData?.topBots || [];
  const crawlsByPath = llmData?.crawlsByPath || [];
  const chartData = llmData?.chartData || [];

  // Paginated data
  const totalPagesPages = Math.ceil(crawlsByPath.length / itemsPerPage);
  const paginatedPages = crawlsByPath.slice((pagesPage - 1) * itemsPerPage, pagesPage * itemsPerPage);
  
  const totalBotsPages = Math.ceil(topBots.length / itemsPerPage);
  const paginatedBots = topBots.slice((botsPage - 1) * itemsPerPage, botsPage * itemsPerPage);

  // Has active filters
  const hasActiveFilters = selectedPage !== null || selectedBot !== null;

  const clearAllFilters = () => {
    setSelectedPage(null);
    setSelectedBot(null);
  };

  // Filter chart data based on bot filter
  const filteredChartData = useMemo(() => {
    if (botFilter === 'main') {
      return chartData.map(item => ({
        date: item.date,
        chatgpt: item.chatgpt,
        claude: item.claude,
        perplexity: item.perplexity,
      }));
    }
    return chartData;
  }, [chartData, botFilter]);

  const barColors = {
    chatgpt: '#10B981',
    claude: '#8B5CF6',
    perplexity: '#3B82F6',
    gemini: '#F59E0B',
    others: '#6B7280',
  };

  // Filter stats based on selections
  const filteredStats = useMemo(() => {
    let ratio = 1;
    if (selectedPage) {
      const page = crawlsByPath.find(p => p.path === selectedPage);
      if (page && crawlsByPath.length > 0) {
        ratio = page.crawls / (crawlsByPath[0]?.crawls || 1);
      }
    }
    if (selectedBot) {
      const bot = topBots.find(b => b.name === selectedBot);
      if (bot && topBots.length > 0) {
        ratio *= bot.crawls / (topBots[0]?.crawls || 1);
      }
    }
    return {
      liveBots: Math.max(1, Math.round(uniqueBots * ratio)),
      botPageviews: Math.round(totalCrawls * ratio),
    };
  }, [selectedPage, selectedBot, crawlsByPath, topBots, uniqueBots, totalCrawls]);

  // Show message if domain not verified
  if (!isVerified || !currentDomainId) {
    return (
      <div className="space-y-6 pt-12 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">LLM Analytics</h1>
          <p className="text-gray-500 mt-1">Monitor AI bot activity and crawling patterns on your website</p>
        </motion.div>
        
        <Card className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Domain Not Verified</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Please verify your domain by installing the tracking script to see LLM analytics.
          </p>
        </Card>
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
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">LLM Analytics</h1>
            <p className="text-gray-500 mt-1">Monitor AI bot activity and crawling patterns on your website</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => refetch()}
              className="p-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <motion.div animate={{ rotate: isFetching ? 360 : 0 }} transition={{ duration: 1, repeat: isFetching ? Infinity : 0, ease: 'linear' }}>
                <RefreshCw className="w-4 h-4 text-gray-500" />
              </motion.div>
            </motion.button>
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Active Filters Bar */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-center gap-2 text-primary">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filters active</span>
              </div>
              <div className="h-4 w-px bg-primary/20" />
              <div className="flex flex-wrap gap-2">
                {selectedPage && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-primary/30 rounded-full text-sm"
                  >
                    <Globe className="w-3.5 h-3.5 text-primary" />
                    <span className="text-gray-700">{selectedPage}</span>
                    <button
                      onClick={() => setSelectedPage(null)}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.span>
                )}
                {selectedBot && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-primary/30 rounded-full text-sm"
                  >
                    <Bot className="w-3.5 h-3.5 text-primary" />
                    <span className="text-gray-700">{selectedBot}</span>
                    <button
                      onClick={() => setSelectedBot(null)}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {isLoading ? (
            <Card className="h-full flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </Card>
          ) : (
            <LiveStatCard
              title="Active Bot Types"
              value={hasActiveFilters ? filteredStats.liveBots : uniqueBots}
              icon={<Bot className="w-5 h-5" />}
            />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Bot Page Views"
            value={isLoading ? '...' : (hasActiveFilters ? filteredStats.botPageviews : totalCrawls).toLocaleString()}
            icon={Eye}
            trend={{ value: 0, isPositive: true }}
            variant="default"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Avg. Crawls/Day"
            value={isLoading ? '...' : avgCrawlsPerDay.toLocaleString()}
            icon={Bot}
            trend={{ value: 0, isPositive: true }}
            variant="default"
          />
        </motion.div>
      </div>

      {/* Live Bot Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-gray-900">Live Bot Activity</h3>
            </div>
            <LiveIndicator count={uniqueBots} label="bot types active" variant="success" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pages Being Crawled */}
            <div className="p-4 rounded-xl bg-gray-50">
              <h4 className="font-medium text-gray-700 mb-3">Pages Being Crawled</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  </div>
                ) : crawlsByPath.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">No crawl data yet</div>
                ) : (
                  crawlsByPath.slice(0, 5).map((page, index) => (
                    <motion.div
                      key={page.path}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-700 truncate">{page.path}</span>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium ml-2">
                        {page.bots.length} bots
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Active Bots */}
            <div className="p-4 rounded-xl bg-gray-50">
              <h4 className="font-medium text-gray-700 mb-3">Active Bots</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  </div>
                ) : topBots.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">No bot data yet</div>
                ) : (
                  topBots.slice(0, 5).map((bot, index) => (
                    <motion.div
                      key={bot.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <BotIcon icon={bot.icon} className="w-4 h-4" />
                        <span className="text-sm text-gray-700">{bot.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {bot.crawls.toLocaleString()}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Bot Requests Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">AI Platform Requests (Daily)</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setBotFilter('main')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  botFilter === 'main'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Main AI Only
              </button>
              <button
                onClick={() => setBotFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  botFilter === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Platforms
              </button>
            </div>
          </div>
          <div className="h-80">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                No bot activity data available yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="chatgpt" name="ChatGPT" fill={barColors.chatgpt} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="claude" name="Claude" fill={barColors.claude} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="perplexity" name="Perplexity" fill={barColors.perplexity} radius={[4, 4, 0, 0]} />
                  {botFilter === 'all' && (
                    <>
                      <Bar dataKey="gemini" name="Gemini" fill={barColors.gemini} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="others" name="Others" fill={barColors.others} radius={[4, 4, 0, 0]} />
                    </>
                  )}
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Bottom Stats Grid - 2 Column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="h-full"
        >
          <Card className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Pages</h4>
              {selectedPage && (
                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">Filtered</span>
              )}
            </div>
            
            {/* Table Header */}
            <div className="flex items-center justify-between px-3 py-2 text-xs text-gray-500 font-medium border-b border-gray-100">
              <span className="flex-1">URL</span>
              <div className="flex items-center gap-8">
                <span className="w-16 text-right">Visitors</span>
                <span className="w-16 text-right">Views</span>
              </div>
            </div>
            
            {/* Table Body */}
            <div className="flex-1 space-y-1 mt-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                </div>
              ) : paginatedPages.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">No page data yet</div>
              ) : (
                paginatedPages.map((page) => {
                  const isActive = selectedPage === page.path;
                  return (
                    <motion.button
                      key={page.path}
                      onClick={() => setSelectedPage(selectedPage === page.path ? null : page.path)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-primary/10 border-primary/30 shadow-sm'
                          : 'bg-transparent border-transparent hover:bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {isActive && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                        <span className={`text-sm truncate ${isActive ? 'text-primary font-medium' : 'text-gray-700'}`}>{page.path}</span>
                      </div>
                      <div className="flex items-center gap-8 flex-shrink-0">
                        <span className={`text-sm w-16 text-right ${isActive ? 'text-primary font-medium' : 'text-gray-900'}`}>
                          {page.visitors.toLocaleString()}
                        </span>
                        <span className={`text-sm w-16 text-right ${isActive ? 'text-primary font-medium' : 'text-gray-600'}`}>
                          {page.crawls.toLocaleString()}
                        </span>
                      </div>
                    </motion.button>
                  );
                })
              )}
            </div>
            
            {/* Pagination */}
            {totalPagesPages > 1 && (
              <div className="flex items-center justify-start gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setPagesPage(Math.max(1, pagesPage - 1))}
                  disabled={pagesPage === 1}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPagesPage(Math.min(totalPagesPages, pagesPage + 1))}
                  disabled={pagesPage === totalPagesPages}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-500 ml-2">Page {pagesPage} of {totalPagesPages}</span>
              </div>
            )}
          </Card>
        </motion.div>

        {/* AI/Bots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="h-full"
        >
          <Card className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">AI/Bots</h4>
              {selectedBot && (
                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">Filtered</span>
              )}
            </div>
            
            {/* Table Body */}
            <div className="flex-1 space-y-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                </div>
              ) : paginatedBots.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">No bot data yet</div>
              ) : (
                paginatedBots.map((bot) => {
                  const isActive = selectedBot === bot.name;
                  return (
                    <motion.button
                      key={bot.name}
                      onClick={() => setSelectedBot(selectedBot === bot.name ? null : bot.name)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-primary/10 border-primary/30 shadow-sm'
                          : 'bg-transparent border-transparent hover:bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {isActive && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                        <BotIcon icon={bot.icon} className="w-5 h-5 flex-shrink-0" />
                        <span className={`text-sm ${isActive ? 'text-primary font-medium' : 'text-gray-700'}`}>{bot.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${botTypeConfig[bot.type]?.bgColor || 'bg-gray-100'} ${botTypeConfig[bot.type]?.color || 'text-gray-700'}`}>
                          {botTypeConfig[bot.type]?.label || 'Other'}
                        </span>
                      </div>
                      <span className={`text-sm font-medium flex-shrink-0 ${isActive ? 'text-primary' : 'text-gray-900'}`}>
                        {bot.crawls.toLocaleString()}
                      </span>
                    </motion.button>
                  );
                })
              )}
            </div>
            
            {/* Pagination */}
            {totalBotsPages > 1 && (
              <div className="flex items-center justify-start gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setBotsPage(Math.max(1, botsPage - 1))}
                  disabled={botsPage === 1}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setBotsPage(Math.min(totalBotsPages, botsPage + 1))}
                  disabled={botsPage === totalBotsPages}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-500 ml-2">Page {botsPage} of {totalBotsPages}</span>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* AI Bots Explained Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Info className="w-5 h-5 text-gray-400" />
            <h4 className="font-semibold text-gray-900">AI Bots Explained</h4>
          </div>
          
          {/* Bot Type Explanations */}
          <div className="space-y-4 mb-8">
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
              <h5 className="font-medium text-gray-900 mb-1">1. User Action bots:</h5>
              <p className="text-sm text-gray-600">
                Visits pages only when users ask a question that requires visiting that specific page. It means your website is being visited based on user query/prompt and could be shown in answers.
              </p>
            </div>
            
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
              <h5 className="font-medium text-gray-900 mb-1">2. Training bots:</h5>
              <p className="text-sm text-gray-600">
                Crawls content for potential use in training AI models.
              </p>
            </div>
            
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
              <h5 className="font-medium text-gray-900 mb-1">3. Search Indexing bots:</h5>
              <p className="text-sm text-gray-600">
                It's like Google indexing your website in their search results.
              </p>
            </div>
          </div>
          
          {/* Bot List with Type Badges */}
          <div className="flex flex-wrap gap-3">
            {knownBots.map((bot) => {
              const typeConfig = botTypeConfig[bot.type];
              return (
                <motion.div
                  key={bot.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-shadow"
                >
                  <BotIcon icon={bot.icon} className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-700">{bot.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${typeConfig.bgColor} ${typeConfig.color}`}>
                    {typeConfig.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
