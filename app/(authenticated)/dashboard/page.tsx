'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Copy, 
  Code,
  RefreshCw,
  Trash2,
  Rss,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  FolderOpen,
  Plus,
  BarChart3,
  Bot,
  Eye,
  Activity
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useListPromptsQuery, useDeletePromptMutation, Prompt } from '@/lib/store/api/promptsApi';
import { useVerifyDomainMutation, useLazyGetTrackingScriptQuery } from '@/lib/store/api/domainsApi';
import { useGetAnalyticsOverviewQuery } from '@/lib/store/api/analyticsApi';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { selectCurrentDomain, selectIsVerified, selectCurrentDomainId, setVerified } from '@/lib/store/slices/domainSlice';
import { useToast } from '@/lib/store/hooks/useToast';
import { AIIcon } from '@/components/ui/AIIcons';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { success: showSuccess, error: showError } = useToast();
  
  const currentDomain = useAppSelector(selectCurrentDomain);
  const currentDomainId = useAppSelector(selectCurrentDomainId);
  const isDomainVerified = useAppSelector(selectIsVerified);
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  
  // RTK Query hooks
  const { data: promptsData, isLoading: isLoadingPrompts, refetch: refetchPrompts } = useListPromptsQuery(
    currentDomainId ? { domainId: currentDomainId } : undefined,
    { skip: !isDomainVerified }
  );
  const [deletePrompt] = useDeletePromptMutation();
  const [verifyDomain] = useVerifyDomainMutation();
  const [getTrackingScript, { data: scriptData }] = useLazyGetTrackingScriptQuery();
  
  // Analytics overview query
  const { 
    data: overviewData, 
    isLoading: isLoadingOverview,
    refetch: refetchOverview 
  } = useGetAnalyticsOverviewQuery(currentDomainId || undefined, {
    skip: !isDomainVerified || !currentDomainId,
    pollingInterval: 60000, // Refresh every minute
  });
  
  const prompts = promptsData?.data?.prompts || [];
  const overview = overviewData?.data;

  const displayDomain = currentDomain?.url ? new URL(currentDomain.url).hostname : 'yourdomain.com';
  const siteId = scriptData?.data?.siteId || 'cvts_' + Math.random().toString(36).substring(2, 10);
  const scriptCode = scriptData?.data?.script || `<script src="https://app.convitsa.com/track.js" data-site="${siteId}"></script>`;
  
  // Determine the top performing LLM
  const topLLM = overview?.llmPresence?.length 
    ? overview.llmPresence.reduce((a, b) => a.score > b.score ? a : b) 
    : null;

  // Fetch tracking script when domain changes
  useEffect(() => {
    if (currentDomainId && !isDomainVerified) {
      getTrackingScript(currentDomainId);
    }
  }, [currentDomainId, isDomainVerified, getTrackingScript]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccess('Copied to clipboard!');
  };

  const handleCheckInstallation = async () => {
    if (!currentDomainId) return;
    
    setIsVerifying(true);
    
    try {
      const result = await verifyDomain({ domainId: currentDomainId }).unwrap();
      
      if (result.success && result.data?.domain.verified) {
        dispatch(setVerified(true));
        setVerificationSuccess(true);
        showSuccess('Script installed successfully! Starting analysis...');
        
        // Redirect to analyzing page
        router.push('/analyzing');
      } else {
        showError('Script not detected. Please check that you\'ve installed it correctly.');
      }
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDeletePrompt = async (promptId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await deletePrompt(promptId).unwrap();
      showSuccess('Prompt deleted');
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Failed to delete prompt');
    }
  };

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to your Convitsa dashboard</p>
      </motion.div>

      {/* Success State - After Verification */}
      <AnimatePresence>
        {(isDomainVerified || verificationSuccess) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Main Stats Card */}
            <Card className="overflow-hidden">
              <div className="space-y-4">
                {/* Greeting */}
                <div className="flex items-center justify-between">
                  <motion.p 
                    className="text-lg text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Hey there 👋
                  </motion.p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => refetchOverview()}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 text-gray-500 ${isLoadingOverview ? 'animate-spin' : ''}`} />
                  </motion.button>
                </div>

                {/* Main Stats Message */}
                {isLoadingOverview ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 text-primary animate-spin" />
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                  >
                    {/* Visibility Score Line */}
                    <div className="flex flex-wrap items-center gap-2 text-xl md:text-2xl">
                      <span className="flex items-center gap-2">
                        <Rss className="w-6 h-6 text-green-500" />
                        <span className="font-medium text-gray-800">{displayDomain}</span>
                      </span>
                      <span className="text-gray-600">shows up</span>
                      <span className={`font-bold ${(overview?.visibilityScore || 0) >= 50 ? 'text-green-500' : 'text-amber-500'}`}>
                        {overview?.visibilityScore || 0}%
                      </span>
                      {(overview?.visibilityTrend || 0) >= 0 ? (
                        <TrendingUp className="w-6 h-6 text-green-500" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-red-500" />
                      )}
                      <span className="text-gray-600">of the time in AI answers.</span>
                    </div>

                    {/* Best Performing LLM Line */}
                    {topLLM && (
                      <div className="flex flex-wrap items-center gap-2 text-lg md:text-xl text-gray-700">
                        <span>It&apos;s performing best in</span>
                        <span className="flex items-center gap-2 font-semibold">
                          <AIIcon name={topLLM.platform} size="sm" />
                          <span className="text-gray-800">{topLLM.platform}</span>
                        </span>
                        <span>with {topLLM.mentions} mentions in the Last 30 Days</span>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Next Refresh */}
                <motion.p 
                  className="text-sm text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Auto-refreshing every minute • Last updated: {new Date().toLocaleTimeString()}
                </motion.p>
              </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="text-center py-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Eye className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{overview?.visibilityScore || 0}%</p>
                  <p className="text-sm text-gray-500">Visibility Score</p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="text-center py-4">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-2">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{overview?.brandMentions || 0}</p>
                  <p className="text-sm text-gray-500">Brand Mentions</p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="text-center py-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{overview?.totalPrompts || 0}</p>
                  <p className="text-sm text-gray-500">Tracked Prompts</p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="text-center py-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-2">
                    <Bot className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{overview?.analyzedPrompts || 0}</p>
                  <p className="text-sm text-gray-500">Analyzed</p>
                </Card>
              </motion.div>
            </div>

            {/* LLM Presence */}
            {overview?.llmPresence && overview.llmPresence.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Platform Presence</h3>
                  <div className="space-y-3">
                    {overview.llmPresence.map((llm, index) => (
                      <div key={llm.platform} className="flex items-center gap-4">
                        <AIIcon name={llm.platform} size="md" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-800">{llm.platform}</span>
                            <span className="text-sm text-gray-500">{llm.score}% visibility</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${llm.score}%` }}
                              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                              className={`h-full rounded-full ${
                                llm.score >= 70 ? 'bg-green-500' :
                                llm.score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-600">{llm.mentions} mentions</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Top Competitors */}
            {overview?.topCompetitors && overview.topCompetitors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Competitors in AI Results</h3>
                  <div className="space-y-2">
                    {overview.topCompetitors.map((competitor, index) => (
                      <div key={competitor.name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                            {index + 1}
                          </span>
                          <span className="font-medium text-gray-800">{competitor.name}</span>
                        </div>
                        <span className={`text-sm font-semibold ${
                          competitor.score > (overview?.visibilityScore || 0) ? 'text-red-500' : 'text-green-500'
                        }`}>
                          {competitor.score}%
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Script Installation Card - Before Verification */}
      <AnimatePresence>
        {!isDomainVerified && !verificationSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card>
              <motion.div 
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Code className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">Install Tracking Script</h2>
              </motion.div>

              <motion.p 
                className="text-gray-600 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Add the following script to your website&apos;s <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono">&lt;head&gt;</code> tag to start tracking your AI visibility for <span className="font-semibold text-primary">{displayDomain}</span>
              </motion.p>

              {/* Script Code Block */}
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="relative bg-gray-900 rounded-xl p-4 overflow-x-auto">
                  <pre className="text-sm text-green-400 font-mono">
                    <code>{scriptCode}</code>
                  </pre>
                  <motion.button
                    onClick={() => copyToClipboard(scriptCode)}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Copy className="w-4 h-4" />
                  </motion.button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Your unique site ID: <code className="px-1.5 py-0.5 bg-gray-100 rounded font-mono">{siteId}</code>
                </p>
              </motion.div>

              {/* Installation Steps */}
              <motion.div 
                className="mb-8 space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="font-semibold text-gray-800">Installation Steps:</h3>
                {[
                  'Copy the script code above',
                  'Open your website\'s HTML file or CMS',
                  'Paste the script inside the <head> tag',
                  'Save and publish your changes',
                  'Click "Check Installation" below to verify'
                ].map((step, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-600 text-sm">{step}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Verify Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  onClick={handleCheckInstallation}
                  isLoading={isVerifying}
                  size="lg"
                  className="w-full"
                  leftIcon={
                    <motion.div
                      animate={isVerifying ? { rotate: 360 } : {}}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <RefreshCw className="w-5 h-5" />
                    </motion.div>
                  }
                >
                  {isVerifying ? 'Checking Installation...' : 'Check Installation'}
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prompts Table */}
      {(isDomainVerified || verificationSuccess) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            {/* Filter Bar */}
            <div className="flex items-center justify-between mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-sm transition-all"
              >
                <FolderOpen className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 font-medium">Filter by Group</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => refetchPrompts()}
                className="p-2.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                <RefreshCw className={`w-4 h-4 text-gray-500 ${isLoadingPrompts ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {isLoadingPrompts ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : prompts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No prompts found. Start by tracking a new prompt.</p>
                  <Button
                    onClick={() => router.push('/prompts/track')}
                    className="mt-4"
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Track New Prompt
                  </Button>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-3 text-left text-sm font-medium text-gray-500">Prompt</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-500">Top LLM</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-500">Visibility Score</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-500">Top Competitor</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-500">Location</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-500">Group</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {prompts.map((prompt: Prompt, index: number) => (
                      <motion.tr
                        key={prompt.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        onClick={() => router.push(`/prompts/${prompt.id}`)}
                        className="group hover:bg-gray-50/50 cursor-pointer"
                      >
                        <td className="py-4">
                          <span className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">{prompt.text}</span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <AIIcon name={prompt.topLLM || 'ChatGPT'} size="sm" />
                            <span className="text-sm text-gray-700">{prompt.topLLM || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              (prompt.visibilityScore || 0) === 100 ? 'bg-green-500' :
                              (prompt.visibilityScore || 0) >= 70 ? 'bg-green-400' :
                              (prompt.visibilityScore || 0) >= 40 ? 'bg-amber-400' : 'bg-red-400'
                            }`} />
                            <span className="text-sm font-medium text-gray-900">{prompt.visibilityScore || 0}%</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center">
                              <span className="text-xs">🏢</span>
                            </div>
                            <span className="text-sm text-gray-700">
                              {typeof prompt.topCompetitors?.[0] === 'object' 
                                ? (prompt.topCompetitors[0] as any)?.name 
                                : prompt.topCompetitors?.[0] || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {prompt.location === 'US' ? '🇺🇸' : 
                               prompt.location === 'UK' ? '🇬🇧' : 
                               prompt.location === 'EU' ? '🇪🇺' : 
                               prompt.location === 'IN' ? '🇮🇳' : '🌍'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          {prompt.group ? (
                            <span className="px-3 py-1 text-xs font-medium rounded-lg bg-green-100 text-green-700">
                              {prompt.group}
                            </span>
                          ) : (
                            <button 
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add to group</span>
                            </button>
                          )}
                        </td>
                        <td className="py-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => handleDeletePrompt(prompt.id, e)}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
