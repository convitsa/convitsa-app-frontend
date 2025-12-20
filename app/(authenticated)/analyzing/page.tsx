'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  Database,
  Brain,
  BarChart3,
  FileText,
  CheckCircle2,
  Loader2,
  Sparkles,
  Globe,
  Zap,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { setAnalysisStage, selectCurrentDomain, selectCurrentDomainId } from '@/lib/store/slices/domainSlice';
import { useToast } from '@/lib/store/hooks/useToast';
import { 
  useGetLatestAnalysisQuery,
  useStartAnalysisMutation,
  useGetAnalysisStatusQuery,
  AnalysisStep as APIAnalysisStep 
} from '@/lib/store/api/analysisApi';
import Button from '@/components/ui/Button';

interface AnalysisStepUI {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const analysisStepsUI: AnalysisStepUI[] = [
  {
    id: 'crawling',
    title: 'Crawling Your Website',
    description: 'Scanning pages and content structure...',
    icon: Globe,
  },
  {
    id: 'indexing',
    title: 'Indexing Content',
    description: 'Building searchable index of your pages...',
    icon: Database,
  },
  {
    id: 'prompts',
    title: 'Creating Prompts',
    description: 'Generating AI prompts relevant to your content...',
    icon: FileText,
  },
  {
    id: 'analyzing',
    title: 'Analyzing AI Visibility',
    description: 'Testing prompts across major AI platforms...',
    icon: Brain,
  },
  {
    id: 'competitors',
    title: 'Finding Competitors',
    description: 'Identifying your AI visibility competitors...',
    icon: Search,
  },
  {
    id: 'insights',
    title: 'Generating Insights',
    description: 'Creating actionable recommendations...',
    icon: BarChart3,
  },
];

export default function AnalyzingPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentDomain = useAppSelector(selectCurrentDomain);
  const currentDomainId = useAppSelector(selectCurrentDomainId);
  const { success: showSuccess, error: showError } = useToast();
  
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const hasCheckedRef = useRef(false);

  const [startAnalysis, { isLoading: isStarting }] = useStartAnalysisMutation();

  // First, fetch the latest analysis to check if one is already running
  const { 
    data: latestAnalysis, 
    isLoading: isLoadingLatest,
    error: latestError,
  } = useGetLatestAnalysisQuery(currentDomainId || '', {
    skip: !currentDomainId,
  });

  // Poll the active analysis status every 2 seconds
  const { 
    data: analysisStatus,
  } = useGetAnalysisStatusQuery(activeAnalysisId || '', {
    skip: !activeAnalysisId,
    pollingInterval: 2000,
  });

  // Safely extract hostname from domain object
  const getDisplayDomain = (): string => {
    if (!currentDomain) return 'yourdomain.com';
    const domainUrl = currentDomain.url || currentDomain.name;
    if (!domainUrl) return 'yourdomain.com';
    try {
      if (domainUrl.startsWith('http://') || domainUrl.startsWith('https://')) {
        return new URL(domainUrl).hostname;
      }
      return domainUrl.replace(/^www\./, '');
    } catch {
      return domainUrl;
    }
  };
  const displayDomain = getDisplayDomain();

  // Check latest analysis and decide whether to use it or start a new one
  useEffect(() => {
    if (!currentDomainId || hasCheckedRef.current || isLoadingLatest) return;

    const handleAnalysisCheck = async () => {
      hasCheckedRef.current = true;

      // If there's a running or pending analysis, use it
      if (latestAnalysis && (latestAnalysis.status === 'running' || latestAnalysis.status === 'pending')) {
        setActiveAnalysisId(latestAnalysis.id);
        return;
      }

      // If no analysis or the latest is completed/failed, start a new one
      // Check if it's a 404 error (no analysis found) or completed/failed
      const shouldStartNew = 
        !latestAnalysis || 
        latestAnalysis.status === 'completed' || 
        latestAnalysis.status === 'failed' ||
        (latestError && 'status' in latestError && latestError.status === 404);

      if (shouldStartNew) {
        try {
          const result = await startAnalysis({ domainId: currentDomainId }).unwrap();
          setActiveAnalysisId(result.id);
        } catch (err: any) {
          console.error('Failed to start analysis:', err);
          showError(err?.data?.error?.message || 'Failed to start analysis');
          setHasFailed(true);
        }
      }
    };

    handleAnalysisCheck();
  }, [currentDomainId, latestAnalysis, latestError, isLoadingLatest, startAnalysis, showError]);

  // Handle analysis completion
  useEffect(() => {
    if (!analysisStatus) return;

    if (analysisStatus.status === 'completed' && !isComplete) {
      setIsComplete(true);
      dispatch(setAnalysisStage('completed'));
      showSuccess('Analysis complete! Your dashboard is ready.');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/overview');
      }, 2000);
    }

    if (analysisStatus.status === 'failed' && !hasFailed) {
      setHasFailed(true);
      showError(analysisStatus.error || 'Analysis failed');
    }
  }, [analysisStatus, isComplete, hasFailed, dispatch, showSuccess, showError, router]);

  // Get step status from API data
  const getStepStatus = (stepId: string): 'pending' | 'running' | 'completed' | 'failed' => {
    if (!analysisStatus?.steps) return 'pending';
    const step = analysisStatus.steps.find((s: APIAnalysisStep) => s.id === stepId);
    return step?.status || 'pending';
  };

  // Get step description (completed steps show result info)
  const getStepDescription = (stepId: string, defaultDescription: string): string => {
    if (!analysisStatus?.steps) return defaultDescription;
    const step = analysisStatus.steps.find((s: APIAnalysisStep) => s.id === stepId);
    
    if (step?.status === 'completed' && step.result) {
      switch (stepId) {
        case 'crawling':
          return `Found ${step.result.pagesCount || 0} pages`;
        case 'indexing':
          return `Indexed ${step.result.keywordsCount || 0} keywords`;
        case 'prompts':
          return `Generated ${step.result.promptsGenerated || 0} prompts`;
        case 'analyzing':
          return `Queried ${step.result.platformsQueried || 0} AI platforms`;
        case 'competitors':
          return `Found ${step.result.competitorsFound || 0} competitors`;
        case 'insights':
          return 'Insights generated';
        default:
          return 'Completed';
      }
    }
    
    return defaultDescription;
  };

  // Calculate progress
  const completedSteps = analysisStatus?.steps?.filter((s: APIAnalysisStep) => s.status === 'completed').length || 0;
  const progress = (completedSteps / analysisStepsUI.length) * 100;

  // Retry analysis
  const handleRetry = async () => {
    if (!currentDomainId) return;
    
    setHasFailed(false);
    setIsComplete(false);
    hasCheckedRef.current = false;
    setActiveAnalysisId(null);
    
    try {
      const result = await startAnalysis({ domainId: currentDomainId }).unwrap();
      setActiveAnalysisId(result.id);
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Failed to start analysis');
      setHasFailed(true);
    }
  };

  // Show loading while checking for existing analysis
  const isInitializing = isLoadingLatest || (!activeAnalysisId && !hasFailed && !isComplete);

  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-12 lg:pt-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Analyzing {displayDomain}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Setting Up Your AI Visibility
          </h1>
          <p className="text-gray-500">
            {hasFailed 
              ? 'Analysis encountered an error. You can retry or continue to dashboard.'
              : 'Please wait while we analyze your website and gather insights'
            }
          </p>
        </motion.div>

        {/* Error State */}
        {hasFailed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="font-medium text-red-800">Analysis Failed</p>
                <p className="text-sm text-red-600">{analysisStatus?.error || 'An unexpected error occurred'}</p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRetry}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Retry
            </Button>
          </motion.div>
        )}

        {/* Initializing State */}
        {isInitializing && !hasFailed && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-gray-500">
              {isStarting ? 'Starting analysis...' : 'Checking for existing analysis...'}
            </p>
          </div>
        )}

        {/* Progress Bar */}
        {activeAnalysisId && analysisStatus && (
          <>
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Progress</span>
                <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${hasFailed ? 'bg-red-400' : 'bg-gradient-to-r from-primary to-primary/80'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </motion.div>

            {/* Steps List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
              <div className="p-6 space-y-4">
                {analysisStepsUI.map((step, index) => {
                  const status = getStepStatus(step.id);
                  const isCompleted = status === 'completed';
                  const isCurrent = status === 'running';
                  const isPending = status === 'pending';
                  const isFailed = status === 'failed';
                  const Icon = step.icon;

                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`
                        flex items-center gap-4 p-4 rounded-xl transition-all duration-300
                        ${isCompleted ? 'bg-green-50 border border-green-200' : ''}
                        ${isCurrent ? 'bg-primary/5 border border-primary/20' : ''}
                        ${isPending ? 'bg-gray-50 border border-gray-100' : ''}
                        ${isFailed ? 'bg-red-50 border border-red-200' : ''}
                      `}
                    >
                      {/* Icon */}
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                        ${isCompleted ? 'bg-green-100' : ''}
                        ${isCurrent ? 'bg-primary/10' : ''}
                        ${isPending ? 'bg-gray-100' : ''}
                        ${isFailed ? 'bg-red-100' : ''}
                      `}>
                        {isCompleted ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                          >
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          </motion.div>
                        ) : isCurrent ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                          >
                            <Loader2 className="w-6 h-6 text-primary" />
                          </motion.div>
                        ) : isFailed ? (
                          <AlertCircle className="w-6 h-6 text-red-500" />
                        ) : (
                          <Icon className="w-6 h-6 text-gray-400" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className={`
                          font-semibold transition-colors duration-300
                          ${isCompleted ? 'text-green-800' : ''}
                          ${isCurrent ? 'text-primary' : ''}
                          ${isPending ? 'text-gray-400' : ''}
                          ${isFailed ? 'text-red-800' : ''}
                        `}>
                          {step.title}
                        </h3>
                        <p className={`
                          text-sm transition-colors duration-300
                          ${isCompleted ? 'text-green-600' : ''}
                          ${isCurrent ? 'text-primary/70' : ''}
                          ${isPending ? 'text-gray-400' : ''}
                          ${isFailed ? 'text-red-600' : ''}
                        `}>
                          {isCompleted 
                            ? getStepDescription(step.id, 'Completed')
                            : isFailed 
                              ? 'Failed'
                              : step.description
                          }
                        </p>
                      </div>

                      {/* Status Badge */}
                      {isCurrent && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="px-3 py-1 bg-primary/10 rounded-full"
                        >
                          <span className="text-xs font-medium text-primary">In Progress</span>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Completion Message */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
              >
                <Zap className="w-8 h-8 text-green-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Complete!</h2>
              {analysisStatus?.summary && (
                <div className="mb-4 text-sm text-gray-600">
                  <p>
                    Analyzed {analysisStatus.summary.totalPages} pages • 
                    Generated {analysisStatus.summary.totalPrompts} prompts • 
                    Found {analysisStatus.summary.competitorsIdentified} competitors
                  </p>
                  <p className="mt-1">
                    Overall visibility score: <span className="font-semibold text-primary">{analysisStatus.summary.overallVisibilityScore}%</span>
                  </p>
                </div>
              )}
              <p className="text-gray-500">Redirecting you to your dashboard...</p>
              <motion.div
                className="mt-4 flex justify-center"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-primary rounded-full"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip to Dashboard (for failed state) */}
        {hasFailed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center"
          >
            <Button
              variant="secondary"
              onClick={() => router.push('/overview')}
            >
              Skip to Dashboard
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
