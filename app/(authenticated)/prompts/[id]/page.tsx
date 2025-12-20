'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Calendar,
  RefreshCw,
  ChevronDown,
  Info,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Eye,
  Globe,
  Award,
  Download,
  Filter,
  Users,
  Loader2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { AIIcon, getAIColor } from '@/components/ui/AIIcons';
import { useGetPromptQuery, useAnalyzePromptMutation } from '@/lib/store/api/promptsApi';
import { useToast } from '@/lib/store/hooks/useToast';
import { PromptAnalysis } from '@/lib/store/api/promptsApi';

// Tabs
const tabs = [
  { id: 'overview', label: 'Overview', icon: Eye },
  { id: 'sources', label: 'Sources', icon: Globe },
  { id: 'brand-rankings', label: 'Brand Rankings', icon: Award },
];

// Platform display names
const platformDisplayNames: Record<string, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  perplexity: 'Perplexity',
  gemini: 'Gemini',
  bing: 'Bing',
};

export default function PromptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { success: showSuccess, error: showError } = useToast();
  const promptId = params.id as string;
  
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [showCompetitors, setShowCompetitors] = useState(false);
  const [expandedLLM, setExpandedLLM] = useState<string | null>(null);
  const [sourcesFilter, setSourcesFilter] = useState<'opportunity' | 'mentions'>('opportunity');

  // API Queries
  const { 
    data: promptData, 
    isLoading, 
    isFetching,
    refetch 
  } = useGetPromptQuery({ promptId });
  
  const [analyzePrompt, { isLoading: isAnalyzing }] = useAnalyzePromptMutation();

  const prompt = promptData?.data?.prompt;
  const analyses = promptData?.data?.analyses || {};
  const summary = promptData?.data?.summary;

  // Calculate visibility score from analyses
  const visibilityScore = useMemo(() => {
    if (!summary) return 0;
    return Math.round(summary.mentionRate * 100 * 100) / 100;
  }, [summary]);

  // Calculate presence by LLM
  const presenceByLLM = useMemo(() => {
    if (!analyses || !prompt?.aiPlatforms) return [];
    
    return prompt.aiPlatforms.map((platform) => {
      const platformAnalyses = analyses[platform as keyof typeof analyses] as PromptAnalysis[] | undefined || [];
      const mentioned = platformAnalyses.filter((a: any) => a.mentioned).length;
      const total = platformAnalyses.filter((a: any) => a.mentioned).length;
      const percentage = total > 0 ? (mentioned / total) * 100 : 0;
      
      return {
        llm: platformDisplayNames[platform] || platform,
        platform,
        percentage: Math.round(percentage * 100) / 100,
        mentioned,
        total,
      };
    }).sort((a, b) => b.percentage - a.percentage);
  }, [analyses, prompt?.aiPlatforms]);

  // Get top performing LLM
  const topPerformingLLM = useMemo(() => {
    if (presenceByLLM.length === 0) return null;
    return presenceByLLM[0];
  }, [presenceByLLM]);

  // Generate visibility history from analyses (group by date)
  const visibilityHistory = useMemo(() => {
    if (!analyses) return [];
    
    const allAnalyses: any[] = [];
    Object.values(analyses).forEach((platformAnalyses: any) => {
      allAnalyses.push(...platformAnalyses);
    });
    
    // Group by date
    const byDate: Record<string, { mentioned: number; total: number }> = {};
    allAnalyses.forEach((a) => {
      const date = new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!byDate[date]) {
        byDate[date] = { mentioned: 0, total: 0 };
      }
      byDate[date].total++;
      if (a.mentioned) byDate[date].mentioned++;
    });
    
    return Object.entries(byDate)
      .map(([date, data]) => ({
        date,
        score: data.total > 0 ? Math.round((data.mentioned / data.total) * 100) : 0,
      }))
      .slice(-14); // Last 14 days
  }, [analyses]);

  // Get AI responses for display
  const aiResponses = useMemo(() => {
    if (!analyses) return [];
    
    const responses: { llm: string; platform: string; mentioned: boolean; response: string; date: string }[] = [];
    
    Object.entries(analyses).forEach(([platform, platformAnalyses]: [string, any]) => {
      if (platformAnalyses.length > 0) {
        // Get the latest analysis for each platform
        const latest = platformAnalyses[0];
        responses.push({
          llm: platformDisplayNames[platform] || platform,
          platform,
          mentioned: latest.mentioned,
          response: latest.response || 'No response recorded',
          date: new Date(latest.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        });
      }
    });
    
    return responses;
  }, [analyses]);

  // Get sources from analyses
  const sources = useMemo(() => {
    if (!analyses) return [];
    
    const sourceMap: Record<string, { 
      url: string; 
      domain: string;
      aiModels: string[]; 
      usageCount: number; 
      mentionsYou: boolean;
      lastSeen: string;
      firstIdentified: string;
    }> = {};
    
    Object.entries(analyses).forEach(([platform, platformAnalyses]: [string, any]) => {
      platformAnalyses.forEach((a: any) => {
        (a.sources || []).forEach((source: any) => {
          if (!sourceMap[source.url]) {
            sourceMap[source.url] = {
              url: source.url,
              domain: source.domain,
              aiModels: [],
              usageCount: 0,
              mentionsYou: false,
              lastSeen: new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              firstIdentified: new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            };
          }
          
          const displayName = platformDisplayNames[platform] || platform;
          if (!sourceMap[source.url].aiModels.includes(displayName)) {
            sourceMap[source.url].aiModels.push(displayName);
          }
          sourceMap[source.url].usageCount++;
        });
      });
    });
    
    return Object.values(sourceMap).sort((a, b) => b.usageCount - a.usageCount);
  }, [analyses]);

  // Get brand rankings from competitor data
  const brandRankings = useMemo(() => {
    if (!analyses) return [];
    
    const competitorCounts: Record<string, number> = {};
    let totalMentions = 0;
    
    Object.values(analyses).forEach((platformAnalyses: any) => {
      platformAnalyses.forEach((a: any) => {
        (a.competitors || []).forEach((comp: any) => {
          const name = comp.name || comp;
          if (!competitorCounts[name]) {
            competitorCounts[name] = 0;
          }
          competitorCounts[name]++;
          totalMentions++;
        });
      });
    });
    
    return Object.entries(competitorCounts)
      .map(([name, count], index) => ({
        rank: index + 1,
        name,
        score: totalMentions > 0 ? Math.round((count / totalMentions) * 100) : 0,
        mentions: count,
      }))
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({ ...item, rank: index + 1 }))
      .slice(0, 10);
  }, [analyses]);

  // Timeline dates from analyses
  const timelineDates = useMemo(() => {
    if (!analyses) return [];
    
    const dates = new Set<string>();
    Object.values(analyses).forEach((platformAnalyses: any) => {
      platformAnalyses.forEach((a: any) => {
        dates.add(new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      });
    });
    
    return Array.from(dates).slice(0, 7);
  }, [analyses]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Set initial selected date
  React.useEffect(() => {
    if (timelineDates.length > 0 && !selectedDate) {
      setSelectedDate(timelineDates[0]);
    }
  }, [timelineDates, selectedDate]);

  const handleRefresh = async () => {
    try {
      await analyzePrompt(promptId).unwrap();
      showSuccess('Analysis started! Results will appear shortly.');
      refetch();
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Failed to start analysis');
    }
  };

  // Filter sources based on filter
  const filteredSources = useMemo(() => {
    if (sourcesFilter === 'mentions') {
      return sources.filter(s => s.mentionsYou);
    }
    return sources;
  }, [sources, sourcesFilter]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading prompt details...</p>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Prompt Not Found</h2>
          <p className="text-gray-500 mb-4">The prompt you're looking for doesn't exist or was deleted.</p>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      {/* Header Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </motion.button>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Last analyzed: {prompt.lastAnalyzedAt 
              ? new Date(prompt.lastAnalyzedAt).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })
              : 'Not yet analyzed'
            }</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRefresh}
            disabled={isAnalyzing || isFetching}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-sm transition-all disabled:opacity-50"
          >
            <motion.div
              animate={{ rotate: isAnalyzing || isFetching ? 360 : 0 }}
              transition={{ duration: 1, repeat: isAnalyzing || isFetching ? Infinity : 0, ease: 'linear' }}
            >
              <RefreshCw className="w-4 h-4 text-gray-500" />
            </motion.div>
            <span className="text-gray-700">{isAnalyzing ? 'Analyzing...' : 'Refresh Data'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-sm transition-all"
          >
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{dateRange}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.button>
        </div>
      </motion.div>

      {/* Prompt Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <div className="inline-flex px-6 py-3 rounded-full bg-primary text-white font-medium text-lg">
          {prompt.text}
        </div>
      </motion.div>

      {/* Status and Location */}
      <div className="flex items-center justify-center gap-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          prompt.status === 'completed' ? 'bg-green-100 text-green-700' :
          prompt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {prompt.status}
        </span>
        {prompt.location && (
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Globe className="w-4 h-4" />
            {prompt.location}
          </span>
        )}
        {prompt.group && (
          <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm font-medium">
            {prompt.group}
          </span>
        )}
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-4"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Top Performing LLM */}
            {topPerformingLLM && (
              <div className="flex items-center gap-3">
                <AIIcon name={topPerformingLLM.llm} size="md" />
                <span className="text-sm text-gray-600">Top performing LLM</span>
                <span className="font-semibold text-gray-900">{topPerformingLLM.llm}</span>
                <span className="text-sm text-gray-500">({topPerformingLLM.percentage}% visibility)</span>
              </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Visibility Score Card */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900">{visibilityScore.toFixed(2)}%</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Visibility Score <span className="text-gray-400">Avg visibility in the last 30 days</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Competitors</span>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowCompetitors(!showCompetitors)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        showCompetitors ? 'bg-primary' : 'bg-gray-200'
                      }`}
                    >
                      <motion.div
                        animate={{ x: showCompetitors ? 24 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="w-5 h-5 rounded-full bg-white shadow"
                      />
                    </motion.button>
                  </div>
                </div>

                {/* Area Chart */}
                <div className="h-48">
                  {visibilityHistory.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={visibilityHistory}>
                        <defs>
                          <linearGradient id="visibilityGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6C5DD3" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6C5DD3" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="date" 
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        />
                        <YAxis 
                          domain={[0, 100]}
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fill: '#9CA3AF', fontSize: 12 }}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E5E7EB',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                          formatter={(value: number) => [`${value}%`, 'Score']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#6C5DD3" 
                          strokeWidth={2}
                          fill="url(#visibilityGradient)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No visibility data yet
                    </div>
                  )}
                </div>
              </Card>

              {/* Presence by LLM Card */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Presence by LLM</h3>
                <p className="text-sm text-gray-500 mb-6">Avg brand mention in the last 30 days</p>

                {presenceByLLM.length > 0 ? (
                  <div className="space-y-4">
                    {presenceByLLM.map((item, index) => (
                      <motion.div
                        key={item.platform}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className="flex items-center gap-3"
                      >
                        <AIIcon name={item.llm} size="md" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">{item.percentage.toFixed(2)}%</span>
                            <span className="text-xs text-gray-400">({item.mentioned}/{item.total} analyses)</span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.percentage}%` }}
                              transition={{ duration: 0.8, delay: 0.2 + index * 0.05 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: getAIColor(item.llm) }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    No analysis data yet
                  </div>
                )}
              </Card>
            </div>

            {/* Stats Summary */}
            {summary && (
              <div className="grid grid-cols-3 gap-4">
                <Card className="text-center py-4">
                  <p className="text-2xl font-bold text-gray-900">{summary.totalAnalyses}</p>
                  <p className="text-sm text-gray-500">Total Analyses</p>
                </Card>
                <Card className="text-center py-4">
                  <p className="text-2xl font-bold text-gray-900">{(summary.mentionRate * 100).toFixed(1)}%</p>
                  <p className="text-sm text-gray-500">Mention Rate</p>
                </Card>
                <Card className="text-center py-4">
                  <p className="text-2xl font-bold text-gray-900">{summary.averagePosition.toFixed(1)}</p>
                  <p className="text-sm text-gray-500">Avg Position</p>
                </Card>
              </div>
            )}

            {/* Info Note */}
            <div className="flex items-start gap-2 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-500">
                Visibility Score depends on presence + cross model brand mention consistency. Presence Score is whether your brand is mentioned or not.
              </p>
            </div>

            {/* Timeline Date Selector */}
            {timelineDates.length > 0 && (
              <Card>
                <div className="flex items-center gap-4 overflow-x-auto pb-2">
                  {timelineDates.map((date) => (
                    <motion.button
                      key={date}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDate(date)}
                      className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedDate === date
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {date}
                    </motion.button>
                  ))}
                </div>
              </Card>
            )}

            {/* AI Response Toggles */}
            {aiResponses.length > 0 && (
              <Card>
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  {aiResponses.map((ai) => (
                    <motion.button
                      key={ai.platform}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setExpandedLLM(expandedLLM === ai.platform ? null : ai.platform)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                        expandedLLM === ai.platform
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <AIIcon name={ai.llm} size="sm" />
                      <span className="text-sm font-medium text-gray-700">{ai.llm}</span>
                      {ai.mentioned ? (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                          Mentioned
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <XCircle className="w-3 h-3 text-red-500" />
                          Not mentioned
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Expanded AI Response */}
                <AnimatePresence>
                  {expandedLLM && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      {aiResponses.filter(ai => ai.platform === expandedLLM).map((ai) => (
                        <div key={ai.platform} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <AIIcon name={ai.llm} size="md" />
                              <span className="font-semibold text-gray-900">{ai.llm} Response</span>
                            </div>
                            <span className="text-sm text-gray-500">{ai.date}</span>
                          </div>
                          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                            {ai.response}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            )}
          </motion.div>
        )}

        {activeTab === 'sources' && (
          <motion.div
            key="sources"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Sources Header */}
            <div className="flex items-start gap-2 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-500">
                Websites used by AI to answer the prompt
              </p>
            </div>

            {/* Sources Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Filter Tabs */}
                <div className="flex rounded-xl overflow-hidden border border-gray-200">
                  <button
                    onClick={() => setSourcesFilter('opportunity')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      sourcesFilter === 'opportunity'
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    All Sources ({sources.length})
                  </button>
                  <button
                    onClick={() => setSourcesFilter('mentions')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      sourcesFilter === 'mentions'
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Mentions You ({sources.filter(s => s.mentionsYou).length})
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="secondary" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                  Export to CSV
                </Button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-sm transition-all"
                >
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">All AI Models</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </motion.button>
              </div>
            </div>

            {/* Sources Table */}
            <Card padding="none">
              <div className="overflow-x-auto">
                {filteredSources.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">URL</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">AI Models</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Usage Count</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Last Seen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredSources.map((source, index) => (
                        <motion.tr
                          key={source.url}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="hover:bg-gray-50/50"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-start gap-3">
                              <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                              <div>
                                <a 
                                  href={source.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-gray-900 hover:text-primary transition-colors block max-w-[300px] truncate"
                                >
                                  {source.url}
                                </a>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-600">{source.domain}</span>
                                  {source.mentionsYou ? (
                                    <span className="px-2 py-0.5 text-xs rounded bg-primary/10 text-primary font-medium">Mentions you</span>
                                  ) : (
                                    <span className="px-2 py-0.5 text-xs rounded bg-red-50 text-red-600">Not mentioned</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              {source.aiModels.map((model) => (
                                <AIIcon key={model} name={model} size="sm" />
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{source.usageCount}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{source.lastSeen}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No sources found in analyses yet
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'brand-rankings' && (
          <motion.div
            key="brand-rankings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Brand Rankings Header */}
            <div className="flex items-start gap-2 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-500">
                Brands that show up in AI answers for this prompt ranked by visibility score
              </p>
            </div>

            {/* Brand Rankings List */}
            <Card>
              {brandRankings.length > 0 ? (
                <div className="space-y-4">
                  {brandRankings.map((brand, index) => (
                    <motion.div
                      key={brand.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4"
                    >
                      <span className="w-8 text-sm font-medium text-gray-400">{brand.rank}</span>
                      <span className="text-lg">🏢</span>
                      <span className="text-sm font-medium text-gray-900 min-w-[120px]">
                        {brand.name}
                      </span>
                      <div className="flex-1 mx-4">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${brand.score}%` }}
                            transition={{ duration: 0.8, delay: 0.2 + index * 0.05 }}
                            className="h-full rounded-full bg-primary"
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-16 text-right">
                        {brand.score}%
                      </span>
                      <span className="text-xs text-gray-400 w-20 text-right">
                        {brand.mentions} mentions
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No competitor data found in analyses yet
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
