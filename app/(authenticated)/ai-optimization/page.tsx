'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Lock,
  Sparkles,
  FileText,
  Code,
  Globe,
  Database,
  Layout,
  Settings,
  RefreshCw,
  Zap,
  Crown,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { RotatingTextLoader } from '@/components/ui/Loader';
import { useToast } from '@/lib/store/hooks/useToast';
import { MotionCard } from '@/components/motion';

const analyzingTexts = [
  'Analyzing your website...',
  'Checking metadata...',
  'Scanning content structure...',
  'Identifying opportunities...',
];

const fixingTexts = [
  'Started fixing your issues...',
  'Generating llms.txt...',
  'Creating markdown files...',
  'Optimizing content...',
  'Adding structured data...',
  'Enhancing metadata...',
];

const completedFixes = [
  { icon: FileText, text: 'llms.txt file created' },
  { icon: Code, text: 'AI-optimized markdown files added' },
  { icon: Layout, text: 'Content structure improved' },
  { icon: Database, text: 'Metadata enhanced' },
  { icon: Globe, text: 'Structured data implemented' },
  { icon: Settings, text: 'XML sitemap updated' },
  { icon: FileText, text: 'Robots.txt optimized' },
  { icon: Zap, text: 'Page performance improved' },
  { icon: Code, text: 'Semantic HTML added' },
  { icon: Globe, text: 'AI endpoints configured' },
  { icon: Database, text: 'Schema.org markup added' },
  { icon: Layout, text: 'Content summaries generated' },
];

type ViewState = 'analyzing' | 'fixing' | 'success' | 'results';

export default function AIOptimizationPage() {
  const { success: showSuccess, info: showInfo } = useToast();
  const [aiOptimizationComplete, setAiOptimizationComplete] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('aiOptimizationComplete') === 'true';
    }
    return false;
  });
  const [view, setView] = useState<ViewState>(aiOptimizationComplete ? 'results' : 'analyzing');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasSynced, setHasSynced] = useState(aiOptimizationComplete);
  const [autoSync, setAutoSync] = useState(false);

  useEffect(() => {
    if (!aiOptimizationComplete) {
      // Phase 1: Analyzing (3 seconds)
      const analyzeTimer = setTimeout(() => {
        setView('fixing');
      }, 3000);

      // Phase 2: Fixing (4 seconds after analyzing)
      const fixTimer = setTimeout(() => {
        setView('success');
        setShowSuccessModal(true);
        setAiOptimizationComplete(true);
        localStorage.setItem('aiOptimizationComplete', 'true');
      }, 7000);

      return () => {
        clearTimeout(analyzeTimer);
        clearTimeout(fixTimer);
      };
    }
  }, [aiOptimizationComplete, setAiOptimizationComplete]);

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setView('results');
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSyncing(false);
    setHasSynced(true);
    showSuccess('Synced successfully!');
  };

  const handleAutoSyncToggle = () => {
    if (!autoSync) {
      setShowUpgradeModal(true);
    } else {
      setAutoSync(false);
    }
  };

  // Animated Confetti Component
  const Confetti = () => {
    const colors = ['#6C5DD3', '#22C55E', '#F59E0B', '#3B82F6', '#EC4899'];
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      isCircle: Math.random() > 0.5,
    }));

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confettiPieces.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute w-3 h-3"
            style={{
              backgroundColor: piece.color,
              left: piece.left,
              top: -20,
              borderRadius: piece.isCircle ? '50%' : '0',
            }}
            animate={{
              y: [0, 400],
              x: [0, Math.random() * 100 - 50],
              rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
              opacity: [1, 0],
            }}
            transition={{
              duration: piece.duration,
              delay: piece.delay,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>
    );
  };

  // Analyzing View
  if (view === 'analyzing') {
    return (
      <motion.div 
        className="min-h-[80vh] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <motion.div 
              className="absolute inset-0 rounded-full border-4 border-primary/20"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div 
              className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div 
              className="absolute inset-2 rounded-full bg-primary/10 flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Sparkles className="w-8 h-8 text-primary" />
              </motion.div>
            </motion.div>
          </div>
          <RotatingTextLoader texts={analyzingTexts} interval={1000} />
        </div>
      </motion.div>
    );
  }

  // Fixing View
  if (view === 'fixing') {
    return (
      <motion.div 
        className="min-h-[80vh] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            {/* Outer ring */}
            <motion.div 
              className="absolute inset-0 rounded-full border-4 border-green-200"
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {/* Middle ring */}
            <motion.div 
              className="absolute inset-3 rounded-full border-4 border-primary border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
            {/* Inner ring */}
            <motion.div 
              className="absolute inset-6 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg shadow-primary/30"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <motion.div
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <Zap className="w-10 h-10 text-white" />
              </motion.div>
            </motion.div>
          </div>
          <RotatingTextLoader texts={fixingTexts} interval={1200} />
          <motion.p 
            className="text-sm text-gray-400 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Please don&apos;t close this page
          </motion.p>
        </div>
      </motion.div>
    );
  }

  // Success Modal
  const SuccessModal = () => (
    <Modal isOpen={showSuccessModal} onClose={handleCloseSuccessModal} size="lg">
      <div className="relative text-center py-8">
        <Confetti />
        
        {/* Success Icon */}
        <motion.div 
          className="relative w-24 h-24 mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
        >
          <motion.div 
            className="absolute inset-0 rounded-full bg-green-100"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="relative w-full h-full rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.4 }}
            >
              <CheckCircle2 className="w-12 h-12 text-white" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h2 
          className="text-3xl font-bold text-gray-900 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          12 Issues Fixed Successfully! ✓
        </motion.h2>
        <motion.p 
          className="text-gray-500 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Your website is now optimized for AI engines
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            size="lg"
            onClick={handleCloseSuccessModal}
            rightIcon={<Sparkles className="w-5 h-5" />}
            className="px-12"
          >
            See the Results Now
          </Button>
        </motion.div>
      </div>
    </Modal>
  );

  // Upgrade Modal
  const UpgradeModal = () => (
    <Modal 
      isOpen={showUpgradeModal} 
      onClose={() => setShowUpgradeModal(false)} 
      title="Upgrade to Pro"
      size="md"
    >
      <div className="text-center">
        <motion.div 
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <Crown className="w-8 h-8 text-white" />
        </motion.div>
        
        <motion.h3 
          className="text-xl font-bold text-gray-900 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Unlock Auto Sync with Pro
        </motion.h3>
        <motion.p 
          className="text-gray-500 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Automatically sync changes and keep your AI optimization up to date
        </motion.p>

        <motion.div 
          className="text-left space-y-3 mb-6 bg-gray-50 rounded-xl p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {[
            'Automatic daily sync',
            'Real-time optimization updates',
            'Priority AI crawler access',
            'Advanced analytics dashboard',
            'Email notifications',
            '24/7 priority support',
          ].map((feature, index) => (
            <motion.div 
              key={index} 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">{feature}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-3xl font-bold text-gray-900">
            $49<span className="text-lg text-gray-400 font-normal">/month</span>
          </div>
          <p className="text-sm text-gray-500">Billed monthly, cancel anytime</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button size="lg" className="w-full" onClick={() => setShowUpgradeModal(false)}>
            Upgrade Now
          </Button>
        </motion.div>
        
        <motion.button 
          onClick={() => setShowUpgradeModal(false)}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
        >
          Maybe later
        </motion.button>
      </div>
    </Modal>
  );

  // Results View
  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      <SuccessModal />
      <UpgradeModal />

      {/* Header */}
      <motion.div 
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Engine Optimization</h1>
          <p className="text-gray-500 mt-1">Your website has been optimized for AI engines</p>
        </div>

        {/* Auto Sync Toggle */}
        <AnimatePresence>
          {hasSynced && (
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <span className="text-sm font-medium text-gray-600">Auto Sync</span>
              <motion.button
                onClick={handleAutoSyncToggle}
                className={`
                  relative w-14 h-8 rounded-full transition-colors
                  ${autoSync ? 'bg-primary' : 'bg-gray-200'}
                `}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
                  animate={{ x: autoSync ? 28 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  {!autoSync && <Lock className="w-3 h-3 text-gray-400" />}
                </motion.div>
              </motion.button>
              <motion.span 
                className="px-2 py-1 rounded-lg bg-amber-100 text-amber-700 text-xs font-semibold flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
              >
                <Crown className="w-3 h-3" />
                PRO
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Success Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-green-200 bg-green-50">
          <div className="flex items-center gap-4">
            <motion.div 
              className="p-3 rounded-full bg-green-100"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.4 }}
            >
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xl font-bold text-green-800">Optimization Complete</h3>
              <p className="text-green-600">All issues have been resolved successfully</p>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Completed Fixes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.h2 
          className="text-xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          Completed Fixes
        </motion.h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.05, delayChildren: 0.6 }
            }
          }}
        >
          {completedFixes.map((fix, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 }
              }}
            >
              <MotionCard className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-all">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.7 + index * 0.02 }}
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                </motion.div>
                <fix.icon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{fix.text}</span>
              </MotionCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Sync Button */}
      <motion.div 
        className="flex justify-center pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <AnimatePresence mode="wait">
          {!hasSynced ? (
            <motion.div
              key="sync-button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={handleSync}
                isLoading={isSyncing}
                leftIcon={
                  <motion.div
                    animate={isSyncing ? { rotate: 360 } : {}}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <RefreshCw className="w-5 h-5" />
                  </motion.div>
                }
                className="px-12 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all"
              >
                {isSyncing ? 'Syncing Changes...' : 'Sync Changes'}
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              key="synced-message"
              className="flex items-center gap-2 text-green-600 font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <CheckCircle2 className="w-5 h-5" />
              </motion.div>
              <span>Changes synced successfully</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
