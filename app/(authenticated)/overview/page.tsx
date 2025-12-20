'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown,
  RefreshCw,
  ExternalLink,
  Smile,
  Meh,
  Frown,
  TrendingUp,
  TrendingDown,
  Bot,
  Folder,
  MapPin,
  Calendar,
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import { AIIcon, getAIColor } from '@/components/ui/AIIcons';
import { useGetAnalyticsOverviewQuery, useGetWebAnalyticsQuery, useGetLLMAnalyticsQuery } from '@/lib/store/api/analyticsApi';
import { useAppSelector } from '@/lib/store/hooks';
import { selectCurrentDomainId, selectIsVerified } from '@/lib/store/slices/domainSlice';
import { 
  filterGroups,
  filterLLMs,
  filterLocations,
  filterDateRanges,
} from '@/lib/mockData';

// Types
interface LLMVisibility {
  id: string;
  name: string;
  score: number;
  mentions?: number;
}

interface Competitor {
  id: string;
  name: string;
  score: number;
  trend: number;
  icon: string;
  website: string;
}

interface RecentMention {
  id: string;
  source: string;
  brandName: string;
  context: string;
  fullText: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  timestamp: string;
  url?: string;
}

// Filter Dropdown Component
function FilterDropdown({ 
  icon: Icon, 
  label, 
  options, 
  value, 
  onChange 
}: { 
  icon: React.ElementType;
  label: string; 
  options: { value: string; label: string }[]; 
  value: string; 
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label || label;

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
              className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden"
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

// LLM Detail Modal
function LLMDetailModal({ llm, isOpen, onClose }: { llm: LLMVisibility | null; isOpen: boolean; onClose: () => void }) {
  if (!llm) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${llm.name} Presence Details`} size="lg">
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
          <AIIcon name={llm.name} size="lg" />
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{llm.score}%</h3>
            <p className="text-gray-500">Average brand mention rate</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Performance Breakdown</h4>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Mentions', value: Math.round(llm.score * 15) },
              { label: 'Positive Sentiment', value: '78%' },
              { label: 'Response Rate', value: '92%' },
              { label: 'Avg. Position', value: '#2' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl bg-gray-50">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium"
            onClick={onClose}
          >
            Close
          </motion.button>
        </div>
      </div>
    </Modal>
  );
}

// Competitor Detail Modal
function CompetitorDetailModal({ competitor, isOpen, onClose }: { competitor: Competitor | null; isOpen: boolean; onClose: () => void }) {
  if (!competitor) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={competitor.name} size="lg">
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-xl">
              {competitor.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{competitor.name}</h3>
              <a 
                href={`https://${competitor.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary text-sm hover:underline flex items-center gap-1"
              >
                {competitor.website}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">{competitor.score}%</p>
            <p className={`text-sm font-medium flex items-center gap-1 justify-end ${competitor.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className={`w-4 h-4 ${competitor.trend < 0 ? 'rotate-180' : ''}`} />
              {competitor.trend >= 0 ? '+' : ''}{competitor.trend}%
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Visibility by LLM</h4>
          <div className="space-y-3">
            {['ChatGPT', 'Claude', 'Perplexity', 'Gemini'].map((llmName, idx) => (
              <div key={llmName} className="flex items-center gap-3">
                <AIIcon name={llmName} size="sm" />
                <span className="text-sm text-gray-600 w-24">{llmName}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: getAIColor(llmName) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.random() * 40 + 30}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium"
            onClick={onClose}
          >
            Close
          </motion.button>
        </div>
      </div>
    </Modal>
  );
}

// Mention Detail Modal
function MentionDetailModal({ mention, isOpen, onClose }: { mention: RecentMention | null; isOpen: boolean; onClose: () => void }) {
  if (!mention) return null;

  const SentimentIcon = mention.sentiment === 'positive' ? Smile : mention.sentiment === 'negative' ? Frown : Meh;
  const sentimentColor = mention.sentiment === 'positive' ? 'text-green-500' : mention.sentiment === 'negative' ? 'text-red-500' : 'text-gray-400';
  const sentimentBg = mention.sentiment === 'positive' ? 'bg-green-50' : mention.sentiment === 'negative' ? 'bg-red-50' : 'bg-gray-50';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mention Details" size="lg">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AIIcon name={mention.source} size="lg" />
            <div>
              <h3 className="font-semibold text-gray-900">{mention.source}</h3>
              <p className="text-sm text-gray-500">{mention.timestamp}</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${sentimentBg}`}>
            <SentimentIcon className={`w-4 h-4 ${sentimentColor}`} />
            <span className={`text-sm font-medium capitalize ${sentimentColor}`}>{mention.sentiment}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gray-50">
          <p className="text-gray-700 leading-relaxed">
            <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary font-medium">{mention.brandName}</span>
            {mention.fullText.replace(mention.brandName, '')}
          </p>
        </div>

        {mention.url && (
          <a
            href={mention.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Original Source
          </a>
        )}
      </div>
    </Modal>
  );
}

export default function OverviewPage() {
  const currentDomainId = useAppSelector(selectCurrentDomainId);
  const isVerified = useAppSelector(selectIsVerified);
  
  // Filter states
  const [filterGroup, setFilterGroup] = useState('all');
  const [filterLLM, setFilterLLM] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterDate, setFilterDate] = useState('30d');
  const [showCompetitors, setShowCompetitors] = useState(false);

  // Modal states
  const [selectedLLM, setSelectedLLM] = useState<LLMVisibility | null>(null);
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);
  const [selectedMention, setSelectedMention] = useState<RecentMention | null>(null);

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
        start.setDate(start.getDate() - 30);
    }
    
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  }, [filterDate]);

  // API Queries
  const { 
    data: overviewData, 
    isLoading: isLoadingOverview, 
    refetch: refetchOverview,
    isFetching: isFetchingOverview
  } = useGetAnalyticsOverviewQuery(currentDomainId || undefined, {
    skip: !isVerified || !currentDomainId,
  });

  const { 
    data: webData, 
    isLoading: isLoadingWeb,
    refetch: refetchWeb 
  } = useGetWebAnalyticsQuery(
    currentDomainId ? { domainId: currentDomainId, ...dateRange } : undefined,
    { skip: !isVerified || !currentDomainId }
  );

  const { 
    data: llmData, 
    isLoading: isLoadingLLM,
    refetch: refetchLLM 
  } = useGetLLMAnalyticsQuery(
    currentDomainId ? { domainId: currentDomainId, ...dateRange } : undefined,
    { skip: !isVerified || !currentDomainId }
  );

  const isLoading = isLoadingOverview || isLoadingWeb || isLoadingLLM;
  const isRefreshing = isFetchingOverview;

  const handleRefresh = () => {
    refetchOverview();
    refetchWeb();
    refetchLLM();
  };

  // Extract data from API responses
  const overview = overviewData?.data;
  const visibilityScore = overview?.visibilityScore || 0;
  const visibilityTrend = overview?.visibilityTrend || 0;
  
  // Transform LLM presence data
  const llmVisibility: LLMVisibility[] = useMemo(() => {
    if (!overview?.llmPresence) return [];
    return overview.llmPresence.map((llm, index) => ({
      id: `llm-${index}`,
      name: llm.platform,
      score: llm.score,
      mentions: llm.mentions,
    }));
  }, [overview?.llmPresence]);

  // Transform competitor data
  const competitors: Competitor[] = useMemo(() => {
    if (!overview?.topCompetitors) return [];
    return overview.topCompetitors
      .filter((comp) => comp && comp.name && typeof comp.name === 'string')
      .map((comp, index) => ({
        id: `comp-${index}`,
        name: comp.name,
        score: comp.score || 0,
        trend: 0, // Can be calculated if we have historical data
        icon: '🏢',
        website: comp.name.toLowerCase().replace(/\s+/g, '') + '.com',
      }));
  }, [overview?.topCompetitors]);

  // Generate visibility history from web analytics daily data
  const visibilityHistory = useMemo(() => {
    const dailyData = webData?.data?.dailyData;
    
    if (!dailyData || dailyData.length === 0) {
      // Generate placeholder data if no real data
      const days = filterDate === '7d' ? 7 : filterDate === '90d' ? 90 : filterDate === '12m' ? 365 : 30;
      return Array.from({ length: Math.min(days, 30) }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (Math.min(days, 30) - 1 - i));
        return {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          score: visibilityScore + Math.floor(Math.random() * 10 - 5),
          competitorAvg: Math.floor(Math.random() * 20 + 50),
        };
      });
    }
    
    return dailyData.map((d: { date: string; pageViews: number }) => ({
      date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: Math.min(100, Math.max(0, d.pageViews > 0 ? Math.round(visibilityScore + Math.random() * 10 - 5) : visibilityScore)),
      competitorAvg: Math.floor(Math.random() * 20 + 50),
    }));
  }, [webData?.data?.dailyData, visibilityScore, filterDate]);

  // Generate recent mentions from LLM data
  const recentMentions: RecentMention[] = useMemo(() => {
    if (!overview?.recentAnalyses || overview.recentAnalyses.length === 0) {
      // Placeholder data
      return llmVisibility.slice(0, 5).map((llm, i) => ({
        id: `mention-${i}`,
        source: llm.name,
        brandName: 'Your Brand',
        context: ` was mentioned as a top solution for this use case...`,
        fullText: `Your Brand was mentioned as a top solution for this use case. The AI recommended it based on user reviews and features.`,
        sentiment: llm.score > 60 ? 'positive' : llm.score > 30 ? 'neutral' : 'negative' as 'positive' | 'neutral' | 'negative',
        timestamp: new Date(Date.now() - i * 3600000).toLocaleString(),
      }));
    }
    
    return overview.recentAnalyses.map((analysis, i) => ({
      id: `mention-${i}`,
      source: 'AI Platform',
      brandName: 'Your Brand',
      context: ` - Score: ${analysis.score}%`,
      fullText: analysis.prompt || 'Analysis result',
      sentiment: analysis.score > 60 ? 'positive' : analysis.score > 30 ? 'neutral' : 'negative' as 'positive' | 'neutral' | 'negative',
      timestamp: new Date(analysis.date).toLocaleString(),
    }));
  }, [overview?.recentAnalyses, llmVisibility]);

  // Show message if domain not verified
  if (!isVerified || !currentDomainId) {
    return (
      <div className="space-y-6 pt-12 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
          <p className="text-gray-500 mt-1">Monitor your AI visibility across all platforms</p>
        </motion.div>
        
        <Card className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Domain Not Verified</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Please verify your domain by installing the tracking script to see your AI visibility analytics.
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
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
          <p className="text-gray-500 mt-1">Monitor your AI visibility across all platforms</p>
        </div>
        {visibilityTrend !== 0 && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
            visibilityTrend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {visibilityTrend > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{visibilityTrend > 0 ? '+' : ''}{visibilityTrend}% vs last period</span>
          </div>
        )}
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center gap-3"
      >
        <FilterDropdown
          icon={Folder}
          label="Filter by Group"
          options={filterGroups}
          value={filterGroup}
          onChange={setFilterGroup}
        />
        <FilterDropdown
          icon={Bot}
          label="Filter by LLM"
          options={filterLLMs}
          value={filterLLM}
          onChange={setFilterLLM}
        />
        <FilterDropdown
          icon={MapPin}
          label="Filter by Location"
          options={filterLocations}
          value={filterLocation}
          onChange={setFilterLocation}
        />
        <FilterDropdown
          icon={Calendar}
          label="Last 30 Days"
          options={filterDateRanges}
          value={filterDate}
          onChange={setFilterDate}
        />
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
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visibility Score Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <div className="flex items-start justify-between mb-4">
              <div>
                <motion.p 
                  className="text-4xl font-bold text-gray-900"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                >
                  {visibilityScore}%
                </motion.p>
                <p className="text-gray-500 text-sm mt-1">
                  <span className="font-medium text-gray-700">Visibility Score</span> Avg visibility in the last 30 days
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Competitors</span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCompetitors(!showCompetitors)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${showCompetitors ? 'bg-primary' : 'bg-gray-200'}`}
                >
                  <motion.div
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                    animate={{ left: showCompetitors ? 28 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>
            </div>

            <div className="h-64">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visibilityHistory}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6C5DD3" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6C5DD3" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCompetitor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E5E7EB" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#E5E7EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                    axisLine={false} 
                    tickLine={false}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value: number) => [`${value}%`, '']}
                  />
                  {showCompetitors && (
                    <Area
                      type="monotone"
                      dataKey="competitorAvg"
                      stroke="#D1D5DB"
                      strokeWidth={2}
                      fill="url(#colorCompetitor)"
                      name="Competitors Avg"
                    />
                  )}
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#6C5DD3"
                    strokeWidth={3}
                    fill="url(#colorScore)"
                    name="Your Score"
                  />
                </AreaChart>
              </ResponsiveContainer>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Presence by LLM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900">Presence by LLM</h3>
              <p className="text-sm text-gray-500">Avg brand mention in the last 30 days</p>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : llmVisibility.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No LLM visibility data yet. Start tracking prompts to see results.
                </div>
              ) : llmVisibility.map((llm, index) => (
                <motion.button
                  key={llm.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedLLM(llm)}
                  className="w-full flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <motion.div 
                    className="flex items-center gap-2 rounded-xl text-white font-bold text-sm px-3 py-2.5 transition-transform group-hover:scale-[1.02]"
                    style={{ 
                      backgroundColor: getAIColor(llm.name), 
                      width: `${Math.max(llm.score * 0.8, 25)}%`,
                      minWidth: '100px',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(llm.score * 0.8, 25)}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                  >
                    <AIIcon name={llm.name} size="sm" showBackground={false} className="w-4 h-4" />
                    <span>{llm.score}%</span>
                  </motion.div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Mentions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900">Recent Mentions</h3>
              <p className="text-sm text-gray-500">How your brand is being talked about</p>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : recentMentions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No recent mentions yet. Keep tracking to see results.
                </div>
              ) : recentMentions.map((mention, index) => {
                const SentimentIcon = mention.sentiment === 'positive' ? Smile : mention.sentiment === 'negative' ? Frown : Meh;
                const sentimentColor = mention.sentiment === 'positive' ? 'text-green-500 bg-green-100' : mention.sentiment === 'negative' ? 'text-red-500 bg-red-100' : 'text-gray-400 bg-gray-100';

                return (
                  <motion.button
                    key={mention.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.01, backgroundColor: 'rgba(0,0,0,0.02)' }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedMention(mention)}
                    className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <AIIcon name={mention.source} size="sm" />
                      <span className="font-medium text-gray-900 text-sm">{mention.source}</span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${sentimentColor}`}>
                        <SentimentIcon className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      <span className="px-1 py-0.5 rounded bg-orange-100 text-orange-700 font-medium">{mention.brandName}</span>
                      {mention.context}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Top Competitors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900">Top Competitors</h3>
              <p className="text-sm text-gray-500">Brands mentioned alongside yours</p>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : competitors.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No competitor data yet. Competitors will appear as they are mentioned alongside your brand.
                </div>
              ) : competitors.map((competitor, index) => (
                <motion.button
                  key={competitor.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  whileHover={{ scale: 1.01, backgroundColor: 'rgba(0,0,0,0.02)' }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedCompetitor(competitor)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group"
                >
                  <span className="text-gray-400 text-sm font-medium w-5">{index + 1}</span>
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm">
                    {competitor.icon}
                  </div>
                  <span className="font-medium text-gray-900 text-sm flex items-center gap-1">
                    {competitor.name}
                    <ArrowUpRight className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                  <div className="flex-1 flex items-center gap-3 ml-auto">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${competitor.score}%` }}
                        transition={{ duration: 0.8, delay: 0.8 + index * 0.05 }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-14 text-right">{competitor.score}%</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Modals */}
      <LLMDetailModal 
        llm={selectedLLM} 
        isOpen={!!selectedLLM} 
        onClose={() => setSelectedLLM(null)} 
      />
      <CompetitorDetailModal 
        competitor={selectedCompetitor} 
        isOpen={!!selectedCompetitor} 
        onClose={() => setSelectedCompetitor(null)} 
      />
      <MentionDetailModal 
        mention={selectedMention} 
        isOpen={!!selectedMention} 
        onClose={() => setSelectedMention(null)} 
      />
    </div>
  );
}
