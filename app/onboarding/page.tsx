'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Building2,
  Target,
  Bot,
  Globe,
  CheckCircle2,
  Rocket,
  TrendingUp,
  Users,
  BarChart3,
  Zap,
  Search,
  FileText,
  Link2
} from 'lucide-react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useSaveOnboardingMutation, useCompleteOnboardingMutation } from '@/lib/store/api/onboardingApi';
import { useToast } from '@/lib/store/hooks/useToast';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { selectIsAuthenticated, selectUser } from '@/lib/store/slices/authSlice';
import { setCurrentDomain, addDomain } from '@/lib/store/slices/domainSlice';
import { AIIcon } from '@/components/ui/AIIcons';

// Onboarding steps
const steps = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'business', title: 'Business Info' },
  { id: 'goals', title: 'Your Goals' },
  { id: 'platforms', title: 'AI Platforms' },
  { id: 'domain', title: 'Your Website' },
  { id: 'complete', title: 'All Set!' },
];

// Business types
const businessTypes = [
  { id: 'saas', label: 'SaaS / Software', icon: FileText },
  { id: 'ecommerce', label: 'E-commerce', icon: Building2 },
  { id: 'agency', label: 'Agency / Services', icon: Users },
  { id: 'marketplace', label: 'Marketplace', icon: Link2 },
  { id: 'media', label: 'Media / Content', icon: FileText },
  { id: 'other', label: 'Other', icon: Sparkles },
];

// Goals
const goals = [
  { id: 'visibility', label: 'Increase AI Visibility', description: 'Get mentioned more in AI responses', icon: TrendingUp },
  { id: 'traffic', label: 'Drive More Traffic', description: 'Get clicks from AI recommendations', icon: Zap },
  { id: 'competitors', label: 'Track Competitors', description: 'Monitor competitor AI presence', icon: Users },
  { id: 'optimize', label: 'Optimize Content', description: 'Create AI-friendly content', icon: FileText },
  { id: 'monitor', label: 'Monitor Mentions', description: 'Track brand mentions in AI', icon: Search },
  { id: 'analytics', label: 'AI Analytics', description: 'Understand AI traffic patterns', icon: BarChart3 },
];

// AI Platforms
const aiPlatforms = [
  { id: 'chatgpt', name: 'ChatGPT', description: 'OpenAI\'s conversational AI' },
  { id: 'claude', name: 'Claude', description: 'Anthropic\'s AI assistant' },
  { id: 'perplexity', name: 'Perplexity', description: 'AI-powered search engine' },
  { id: 'gemini', name: 'Gemini', description: 'Google\'s AI model' },
  { id: 'bing', name: 'Bing AI', description: 'Microsoft\'s Copilot' },
];

// Domain validation helper
const validateDomain = (input: string): { isValid: boolean; error?: string; formattedUrl?: string } => {
  if (!input || input.trim().length === 0) {
    return { isValid: false, error: 'Please enter a domain' };
  }

  const trimmed = input.trim().toLowerCase();
  
  // Remove protocol if present for validation
  let domain = trimmed;
  if (domain.startsWith('https://')) {
    domain = domain.slice(8);
  } else if (domain.startsWith('http://')) {
    domain = domain.slice(7);
  }
  
  // Remove trailing slash
  if (domain.endsWith('/')) {
    domain = domain.slice(0, -1);
  }
  
  // Remove www. prefix for cleaner validation
  if (domain.startsWith('www.')) {
    domain = domain.slice(4);
  }
  
  // Domain pattern: must have at least one dot, valid characters, and a valid TLD
  // Examples: example.com, sub.example.co.uk, my-site.org
  const domainPattern = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/;
  
  if (!domainPattern.test(domain)) {
    // Provide specific error messages
    if (!domain.includes('.')) {
      return { isValid: false, error: 'Domain must include a TLD (e.g., .com, .org)' };
    }
    if (/[^a-z0-9.-]/.test(domain)) {
      return { isValid: false, error: 'Domain contains invalid characters' };
    }
    if (domain.includes('..')) {
      return { isValid: false, error: 'Invalid domain format' };
    }
    if (domain.startsWith('-') || domain.endsWith('-')) {
      return { isValid: false, error: 'Domain cannot start or end with a hyphen' };
    }
    return { isValid: false, error: 'Please enter a valid domain (e.g., example.com)' };
  }

  return { 
    isValid: true, 
    formattedUrl: `https://${domain}` 
  };
};

export default function OnboardingPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { success: showSuccess, error: showError } = useToast();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  
  const [saveOnboarding, { isLoading: isSaving }] = useSaveOnboardingMutation();
  const [completeOnboarding, { isLoading: isCompleting }] = useCompleteOnboardingMutation();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [domainValidation, setDomainValidation] = useState<{ isValid: boolean; error?: string; formattedUrl?: string }>({ isValid: false });
  
  // Form data
  const [formData, setFormData] = useState({
    companyName: '',
    businessType: '',
    teamSize: '',
    selectedGoals: [] as string[],
    selectedPlatforms: ['chatgpt', 'perplexity', 'claude'] as string[],
    websiteUrl: '',
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Redirect if already completed onboarding
  useEffect(() => {
    if (user?.onboardingCompleted) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const currentStepId = steps[currentStep].id;
  const progress = ((currentStep) / (steps.length - 1)) * 100;

  const handleNext = () => {
    // Just navigate to next step - no API call
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGoalToggle = (goalId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedGoals: prev.selectedGoals.includes(goalId)
        ? prev.selectedGoals.filter(id => id !== goalId)
        : [...prev.selectedGoals, goalId]
    }));
  };

  const handlePlatformToggle = (platformId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedPlatforms: prev.selectedPlatforms.includes(platformId)
        ? prev.selectedPlatforms.filter(id => id !== platformId)
        : [...prev.selectedPlatforms, platformId]
    }));
  };

  const handleDomainChange = (value: string) => {
    setFormData(prev => ({ ...prev, websiteUrl: value }));
    
    // Validate on each change
    if (value.trim().length > 0) {
      const validation = validateDomain(value);
      setDomainValidation(validation);
    } else {
      setDomainValidation({ isValid: false });
    }
  };

  const handleComplete = async () => {
    try {
      // Use the validated and formatted URL
      const websiteUrl = domainValidation.formattedUrl || '';

      // Save all onboarding data first
      await saveOnboarding({
        companyName: formData.companyName,
        businessType: formData.businessType,
        companySize: formData.teamSize,
        goals: formData.selectedGoals,
        aiPlatforms: formData.selectedPlatforms,
        websiteUrl,
      }).unwrap();
      
      // Complete onboarding (creates domain, sends welcome email)
      const result = await completeOnboarding().unwrap();
      
      // If domain was created, add it to state
      if (result.data?.domain) {
        dispatch(addDomain(result.data.domain));
        dispatch(setCurrentDomain(result.data.domain.id));
      }
      
      showSuccess('Welcome to Convitsa! Your workspace is ready.');
      router.push('/dashboard');
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Failed to complete setup. Please try again.');
    }
  };

  const canProceed = () => {
    switch (currentStepId) {
      case 'welcome':
        return true;
      case 'business':
        return formData.companyName && formData.businessType;
      case 'goals':
        return formData.selectedGoals.length > 0;
      case 'platforms':
        return formData.selectedPlatforms.length > 0;
      case 'domain':
        return domainValidation.isValid;
      case 'complete':
        return true;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Convitsa" width={40} height={40} />
            <span className="text-xl font-bold text-gray-900">Convitsa</span>
          </div>
          
          {/* Progress indicator */}
          {currentStep > 0 && currentStep < steps.length - 1 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Step {currentStep} of {steps.length - 2}</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {/* Step 1: Welcome */}
            {currentStepId === 'welcome' && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                  className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-8"
                >
                  <Rocket className="w-12 h-12 text-primary" />
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-bold text-gray-900 mb-4"
                >
                  Welcome to Convitsa! 👋
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-gray-600 mb-8 max-w-lg mx-auto"
                >
                  Let&apos;s set up your AI Engine Optimization in just a few minutes. We&apos;ll help you get discovered in AI responses.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-10"
                >
                  {[
                    { icon: TrendingUp, label: 'Track Visibility' },
                    { icon: Bot, label: 'Monitor AI Mentions' },
                    { icon: Zap, label: 'Optimize Content' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm"
                    >
                      <item.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-xs font-medium text-gray-600">{item.label}</p>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <Button
                    size="lg"
                    onClick={handleNext}
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Get Started
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {/* Step 2: Business Info */}
            {currentStepId === 'business' && (
              <motion.div
                key="business"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Tell us about your business</h2>
                  <p className="text-gray-600">This helps us personalize your experience</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company / Brand Name
                    </label>
                    <Input
                      value={formData.companyName}
                      onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                      placeholder="Enter your company name"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      What type of business are you?
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {businessTypes.map((type) => {
                        const Icon = type.icon;
                        const isSelected = formData.businessType === type.id;
                        return (
                          <motion.button
                            key={type.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setFormData(prev => ({ ...prev, businessType: type.id }))}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-primary' : 'text-gray-500'}`} />
                            <p className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-gray-700'}`}>
                              {type.label}
                            </p>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Team Size (Optional)
                    </label>
                    <div className="flex gap-2">
                      {['1-5', '6-20', '21-50', '50+'].map((size) => (
                        <motion.button
                          key={size}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData(prev => ({ ...prev, teamSize: size }))}
                          className={`flex-1 py-2 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                            formData.teamSize === size
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {size}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Goals */}
            {currentStepId === 'goals' && (
              <motion.div
                key="goals"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">What are your goals?</h2>
                  <p className="text-gray-600">Select all that apply to customize your dashboard</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {goals.map((goal, index) => {
                    const Icon = goal.icon;
                    const isSelected = formData.selectedGoals.includes(goal.id);
                    return (
                      <motion.button
                        key={goal.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleGoalToggle(goal.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-4 ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary/10' : 'bg-gray-100'}`}>
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-gray-500'}`} />
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${isSelected ? 'text-primary' : 'text-gray-900'}`}>
                            {goal.label}
                          </p>
                          <p className="text-sm text-gray-500">{goal.description}</p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 4: AI Platforms */}
            {currentStepId === 'platforms' && (
              <motion.div
                key="platforms"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Which AI platforms matter to you?</h2>
                  <p className="text-gray-600">We&apos;ll track your visibility on these platforms</p>
                </div>

                <div className="space-y-3">
                  {aiPlatforms.map((platform, index) => {
                    const isSelected = formData.selectedPlatforms.includes(platform.id);
                    return (
                      <motion.button
                        key={platform.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handlePlatformToggle(platform.id)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <AIIcon name={platform.name} size="lg" />
                        <div className="flex-1">
                          <p className={`font-medium ${isSelected ? 'text-primary' : 'text-gray-900'}`}>
                            {platform.name}
                          </p>
                          <p className="text-sm text-gray-500">{platform.description}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-primary bg-primary'
                            : 'border-gray-300'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <p className="text-sm text-gray-500 text-center mt-4">
                  You can change these settings later in your dashboard
                </p>
              </motion.div>
            )}

            {/* Step 5: Domain */}
            {currentStepId === 'domain' && (
              <motion.div
                key="domain"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Add your website</h2>
                  <p className="text-gray-600">We&apos;ll analyze your AI visibility for this domain</p>
                </div>

                <div className="max-w-md mx-auto">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Globe className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={formData.websiteUrl}
                      onChange={(e) => handleDomainChange(e.target.value)}
                      placeholder="example.com"
                      className={`w-full pl-12 pr-4 py-4 text-lg rounded-xl border-2 outline-none transition-all ${
                        formData.websiteUrl.length > 0
                          ? domainValidation.isValid
                            ? 'border-green-500 focus:border-green-500 focus:ring-4 focus:ring-green-500/10'
                            : 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                          : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
                      }`}
                    />
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-3 text-center">
                    Enter your website domain (e.g., example.com or mysite.io)
                  </p>

                  {/* Validation Feedback */}
                  <AnimatePresence mode="wait">
                    {formData.websiteUrl.length > 0 && (
                      domainValidation.isValid ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-6 p-4 rounded-xl bg-green-50 border border-green-200"
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-green-800">Valid domain!</p>
                              <p className="text-sm text-green-600">
                                We&apos;ll start tracking: {domainValidation.formattedUrl}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ) : domainValidation.error ? (
                        <motion.div
                          key="error"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-red-600 text-sm font-bold">!</span>
                            </div>
                            <div>
                              <p className="font-medium text-red-800">Invalid domain</p>
                              <p className="text-sm text-red-600">{domainValidation.error}</p>
                            </div>
                          </div>
                        </motion.div>
                      ) : null
                    )}
                  </AnimatePresence>

                  {/* Examples */}
                  <div className="mt-6 text-center">
                    <p className="text-xs text-gray-400 mb-2">Examples of valid domains:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['example.com', 'mysite.io', 'company.co.uk', 'app.example.org'].map((example) => (
                        <button
                          key={example}
                          onClick={() => handleDomainChange(example)}
                          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 6: Complete */}
            {currentStepId === 'complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                  className="w-24 h-24 rounded-3xl bg-green-100 flex items-center justify-center mx-auto mb-8"
                >
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-bold text-gray-900 mb-4"
                >
                  You&apos;re all set! 🎉
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-gray-600 mb-8 max-w-lg mx-auto"
                >
                  Your workspace is ready. Let&apos;s install the tracking script and start monitoring your AI visibility.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gray-50 rounded-2xl p-6 max-w-md mx-auto mb-8 text-left"
                >
                  <h3 className="font-semibold text-gray-900 mb-4">Quick summary:</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-gray-700">{formData.companyName || 'Your company'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-gray-700">{formData.websiteUrl || 'Your website'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-gray-700">{formData.selectedPlatforms.length} AI platforms selected</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Target className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-gray-700">{formData.selectedGoals.length} goals configured</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button
                    size="lg"
                    onClick={handleComplete}
                    isLoading={isSaving || isCompleting}
                    rightIcon={<Sparkles className="w-5 h-5" />}
                  >
                    Go to Dashboard
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Navigation */}
      {currentStep > 0 && currentStep < steps.length - 1 && (
        <footer className="p-6">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
}
