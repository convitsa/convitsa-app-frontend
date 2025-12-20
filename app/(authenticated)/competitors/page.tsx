'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Award, 
  AlertTriangle,
  FileText,
  Code,
  Database,
  Layout,
  FileSearch,
  Zap,
  Search,
  Globe,
  Target,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { RotatingTextLoader } from '@/components/ui/Loader';
import { useAppSelector } from '@/lib/store/hooks';
import { selectCurrentDomain } from '@/lib/store/slices/domainSlice';
import { MotionCard, AnimatedProgressBar } from '@/components/motion';

// Mock competitor data
const competitors = [
  { name: 'TechFlow Inc.', score: 94, usesConvitsa: true },
  { name: 'DataPulse', score: 89, usesConvitsa: true },
  { name: 'CloudMind', score: 85, usesConvitsa: false },
  { name: 'AI Nexus', score: 82, usesConvitsa: true },
  { name: 'SmartSystems', score: 78, usesConvitsa: false },
  { name: 'ByteLogic', score: 73, usesConvitsa: false },
];

// Mock issues data
const issues = [
  { id: 1, icon: FileText, title: 'Missing llms.txt file', description: 'Your website lacks an llms.txt file for AI crawlers' },
  { id: 2, icon: Code, title: 'Non-optimized metadata', description: 'Meta tags are not optimized for AI understanding' },
  { id: 3, icon: Database, title: 'No structured data', description: 'Missing JSON-LD structured data markup' },
  { id: 4, icon: Layout, title: 'Poor content formatting', description: 'Content structure is not AI-friendly' },
  { id: 5, icon: FileSearch, title: 'Missing AI-readable summaries', description: 'No concise summaries for AI parsing' },
  { id: 6, icon: Globe, title: 'Incomplete sitemap', description: 'XML sitemap missing important pages' },
  { id: 7, icon: Target, title: 'Robots.txt issues', description: 'Robots.txt blocking AI crawlers' },
  { id: 8, icon: Zap, title: 'Slow page performance', description: 'Page speed affecting AI crawler access' },
  { id: 9, icon: Search, title: 'Missing semantic markup', description: 'No semantic HTML elements used' },
  { id: 10, icon: Sparkles, title: 'No AI-specific endpoints', description: 'Missing API endpoints for AI services' },
];

const loadingTexts = [
  'Searching Your Competitors...',
  'Analyzing their AI Visibility...',
  'Calculating scores...',
  'Comparing performance...',
  'Gathering insights...',
];

type ViewState = 'loading' | 'results' | 'issues';

export default function CompetitorsPage() {
  const router = useRouter();
  const currentDomain = useAppSelector(selectCurrentDomain);
  const [competitorAnalysisComplete, setCompetitorAnalysisComplete] = useState(false);
  const [view, setView] = useState<ViewState>('loading');
  const userScore = 67;

  useEffect(() => {
    // Check localStorage for previous analysis
    const analysisComplete = localStorage.getItem('competitorAnalysisComplete');
    if (analysisComplete === 'true') {
      setCompetitorAnalysisComplete(true);
      setView('results');
    }
  }, []);

  useEffect(() => {
    if (!competitorAnalysisComplete) {
      const timer = setTimeout(() => {
        setView('results');
        setCompetitorAnalysisComplete(true);
        localStorage.setItem('competitorAnalysisComplete', 'true');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [competitorAnalysisComplete]);

  const handleSeeWhyBehind = () => {
    setView('issues');
  };

  const handleSolveIssues = () => {
    router.push('/ai-optimization');
  };

  // Animated Circular Progress Component
  const CircularProgress = ({ score, size = 160 }: { score: number; size?: number }) => {
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="circular-progress" width={size} height={size}>
          <circle
            className="circular-progress-bg"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <motion.circle
            className="circular-progress-fill"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <span className="text-4xl font-bold text-gray-900">{score}</span>
          <span className="text-gray-400">/100</span>
        </motion.div>
      </div>
    );
  };

  // Loading View
  if (view === 'loading') {
    return (
      <motion.div 
        className="min-h-[80vh] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <RotatingTextLoader texts={loadingTexts} interval={1500} size="lg" />
      </motion.div>
    );
  }

  // Issues View
  if (view === 'issues') {
    return (
      <div className="space-y-8 pt-12 lg:pt-0">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-600 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <AlertTriangle className="w-5 h-5" />
            </motion.div>
            <span className="font-semibold">Issues Detected</span>
          </motion.div>
          <motion.h1 
            className="text-3xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Here&apos;s Why You&apos;re Behind
          </motion.h1>
          <motion.p 
            className="text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            We found {issues.length} issues affecting your AI visibility
          </motion.p>
        </motion.div>

        {/* Issues Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08 }
            }
          }}
        >
          {issues.map((issue, index) => (
            <motion.div
              key={issue.id}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.95 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: { duration: 0.4 }
                }
              }}
            >
              <MotionCard 
                className="p-4 bg-white rounded-2xl border border-red-100 hover:border-red-200 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <motion.div 
                    className="p-3 rounded-xl bg-red-50"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <issue.icon className="w-6 h-6 text-red-500" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{issue.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{issue.description}</p>
                  </div>
                </div>
              </MotionCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Solve Issues Button */}
        <motion.div 
          className="flex justify-center pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              onClick={handleSolveIssues}
              rightIcon={<Sparkles className="w-5 h-5" />}
              className="px-12 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all"
            >
              Solve Issues
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Results View
  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your AI Visibility Score</h1>
        <p className="text-gray-500">
          See how {currentDomain ? new URL(currentDomain.url).hostname : 'your website'} compares to competitors
        </p>
      </motion.div>

      {/* User Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="gradient-card border-primary/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <CircularProgress score={userScore} />
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-gray-900">Your Score</h2>
                <p className="text-gray-500">{currentDomain ? new URL(currentDomain.url).hostname : 'Your Website'}</p>
                <div className="flex items-center gap-2 mt-2 text-amber-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Needs improvement to compete</span>
                </div>
              </motion.div>
            </div>
            <motion.div 
              className="text-center md:text-right"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-sm text-gray-500 mb-1">Competitors ranking higher</p>
              <motion.p 
                className="text-4xl font-bold text-red-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 1 }}
              >
                {competitors.filter(c => c.score > userScore).length}
              </motion.p>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Competitors Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.h2 
          className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Award className="w-6 h-6 text-primary" />
          Competitors Ranking Higher
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.7 }
            }
          }}
        >
          {competitors
            .filter(c => c.score > userScore)
            .sort((a, b) => b.score - a.score)
            .map((competitor, index) => (
              <motion.div
                key={competitor.name}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <MotionCard className="p-4 bg-white rounded-2xl border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <span className="text-lg font-bold text-gray-600">
                          {competitor.name?.charAt(0) || '?'}
                        </span>
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{competitor.name}</h3>
                        {competitor.usesConvitsa && (
                          <motion.span 
                            className="text-xs text-primary font-medium flex items-center gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                          >
                            <Sparkles className="w-3 h-3" />
                            Using Convitsa
                          </motion.span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-900">{competitor.score}</span>
                      <span className="text-gray-400">/100</span>
                    </div>
                  </div>
                  
                  {/* Animated Progress Bar */}
                  <AnimatedProgressBar 
                    value={competitor.score}
                    className="h-2 bg-gray-100 rounded-full overflow-hidden"
                    barClassName="h-full gradient-primary rounded-full"
                  />
                  
                  <p className="text-xs text-gray-500 mt-2">
                    {competitor.score - userScore} points ahead of you
                  </p>
                </MotionCard>
              </motion.div>
            ))}
        </motion.div>
      </motion.div>

      {/* Competitors Behind */}
      {competitors.filter(c => c.score <= userScore).length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.h2 
            className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3 }}
          >
            <TrendingUp className="w-6 h-6 text-green-500" />
            You&apos;re Ahead Of
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 1.4 }
              }
            }}
          >
            {competitors
              .filter(c => c.score <= userScore)
              .sort((a, b) => b.score - a.score)
              .map((competitor) => (
                <motion.div
                  key={competitor.name}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <Card hover className="opacity-60">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                          <span className="text-lg font-bold text-gray-600">
                            {competitor.name?.charAt(0) || '?'}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900">{competitor.name}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-gray-900">{competitor.score}</span>
                        <span className="text-gray-400">/100</span>
                      </div>
                    </div>
                    
                    <AnimatedProgressBar 
                      value={competitor.score}
                      className="h-2 bg-gray-100 rounded-full overflow-hidden"
                      barClassName="h-full bg-gray-400 rounded-full"
                    />
                  </Card>
                </motion.div>
              ))}
          </motion.div>
        </motion.div>
      )}

      {/* See Why You're Behind CTA */}
      <motion.div 
        className="flex justify-center pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            onClick={handleSeeWhyBehind}
            rightIcon={<ArrowRight className="w-5 h-5" />}
            className="px-12 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all"
          >
            See Why You&apos;re Behind
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
