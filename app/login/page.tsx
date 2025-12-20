'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { useLoginMutation, useVerifyEmailMutation, useResendCodeMutation } from '@/lib/store/api/authApi';
import { useToast } from '@/lib/store/hooks/useToast';
import { useAppSelector } from '@/lib/store/hooks';
import { selectIsAuthenticated, selectUser } from '@/lib/store/slices/authSlice';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success: showSuccess, error: showError, info: showInfo } = useToast();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  const emailParam = searchParams.get('email') || '';
  const redirectParam = searchParams.get('redirect') || '';
  
  const [login, { isLoading }] = useLoginMutation();
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendCode, { isLoading: isResending }] = useResendCodeMutation();
  
  const [step, setStep] = useState<'login' | 'verify'>('login');
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: emailParam,
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);

  // Pre-fill email from URL param
  useEffect(() => {
    if (emailParam && !formData.email) {
      setFormData((prev) => ({ ...prev, email: emailParam }));
    }
  }, [emailParam]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Check for pending invitation redirect
      const pendingInvitation = sessionStorage.getItem('pendingInvitation');
      if (pendingInvitation || redirectParam) {
        const redirectTo = redirectParam || `/invitations/${pendingInvitation}`;
        sessionStorage.removeItem('pendingInvitation');
        router.push(redirectTo);
      } else if (user.onboardingCompleted) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
    }
  }, [isAuthenticated, user, router, redirectParam]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();
      
      if (result.success) {
        // Check if email verification is required
        if (result.requiresVerification) {
          showInfo('Please verify your email to continue.');
          setStep('verify');
        } else {
          showSuccess('Welcome back!');
          // Redirection handled by useEffect
        }
      }
    } catch (err: any) {
      // Check if error is about email verification
      if (err?.data?.error?.code === 'EMAIL_NOT_VERIFIED') {
        showInfo('Please verify your email to continue.');
        setStep('verify');
        // Send a new verification code
        try {
          await resendCode({ email: formData.email }).unwrap();
        } catch {
          // Ignore resend error
        }
      } else {
        showError(err?.data?.error?.message || 'Login failed. Please check your credentials.');
      }
    }
  };

  const handleVerificationInput = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`login-code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) return;
    
    try {
      const result = await verifyEmail({
        email: formData.email,
        code,
      }).unwrap();
      
      if (result.success) {
        showSuccess('Email verified! Welcome back!');
        // Redirection handled by useEffect since credentials are now set
      }
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Verification failed. Please check the code.');
    }
  };

  const handleResend = async () => {
    try {
      await resendCode({ email: formData.email }).unwrap();
      showSuccess('Verification code resent!');
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Failed to resend code.');
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`login-code-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-primary/10" />
      
      <motion.div 
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl"
        animate={{ 
          x: [0, 20, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ translateY: '-50%', translateX: '50%' }}
      />
      
      <motion.div 
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl"
        animate={{ 
          x: [0, -20, 0],
          y: [0, 20, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{ translateY: '50%', translateX: '-50%' }}
      />
      
      <motion.div 
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Logo */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link href="/" className="inline-block mb-4">
            <motion.img 
              src="/logo.svg" 
              alt="Convitsa" 
              className="h-10 w-auto mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
          </Link>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {step === 'login' ? 'Welcome back' : 'Verify your email'}
              </h1>
              <p className="text-gray-500">
                {step === 'login' 
                  ? 'Sign in to your account to continue' 
                  : 'Enter the code we sent to your email'}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-xl border-0">
            <AnimatePresence mode="wait">
              {step === 'login' ? (
                <motion.form 
                  key="login-form"
                  onSubmit={handleLogin} 
                  className="space-y-5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Input
                      label="Email"
                      type="email"
                      placeholder="you@example.com"
                      leftIcon={<Mail className="w-5 h-5" />}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      error={errors.email}
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Input
                      label="Password"
                      type="password"
                      placeholder="••••••••"
                      leftIcon={<Lock className="w-5 h-5" />}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      error={errors.password}
                    />
                  </motion.div>

                  <motion.div 
                    className="flex items-center justify-between"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="flex items-center gap-2 cursor-pointer">
                      <motion.input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        whileTap={{ scale: 0.9 }}
                      />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <Link 
                      href="/forgot-password" 
                      className="text-sm text-primary font-semibold hover:text-primary-dark"
                    >
                      Forgot Password?
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      isLoading={isLoading}
                      rightIcon={<ArrowRight className="w-5 h-5" />}
                    >
                      Sign In
                    </Button>
                  </motion.div>
                </motion.form>
              ) : (
                <motion.div 
                  key="verify-form"
                  className="space-y-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-4">
                    <p className="text-gray-600">
                      We sent a verification code to <span className="font-semibold">{formData.email}</span>
                    </p>
                  </div>
                  
                  <div className="flex justify-center gap-3">
                    {verificationCode.map((digit, index) => (
                      <motion.input
                        key={index}
                        id={`login-code-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleVerificationInput(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileFocus={{ scale: 1.05, borderColor: '#6C5DD3' }}
                        className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    ))}
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      onClick={handleVerify}
                      className="w-full"
                      size="lg"
                      isLoading={isVerifying}
                      disabled={verificationCode.join('').length !== 6}
                      rightIcon={<CheckCircle className="w-5 h-5" />}
                    >
                      Verify Email
                    </Button>
                  </motion.div>
                  
                  <motion.div 
                    className="text-center space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <p className="text-sm text-gray-500">
                      Didn&apos;t receive the code?{' '}
                      <motion.button 
                        onClick={handleResend}
                        disabled={isResending}
                        className="text-primary font-semibold hover:text-primary-dark disabled:opacity-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isResending ? 'Sending...' : 'Resend'}
                      </motion.button>
                    </p>
                    <button 
                      onClick={() => setStep('login')}
                      className="text-sm text-gray-400 hover:text-gray-600"
                    >
                      ← Back to login
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        <motion.p 
          className="text-center text-sm text-gray-500 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary font-semibold hover:text-primary-dark">
            Sign up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
          <div className="animate-pulse text-primary">Loading...</div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
