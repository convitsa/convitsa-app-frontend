'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, Lock, Globe, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { useSignupMutation, useVerifyEmailMutation, useResendCodeMutation } from '@/lib/store/api/authApi';
import { useToast } from '@/lib/store/hooks/useToast';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { selectIsAuthenticated } from '@/lib/store/slices/authSlice';
import { setCurrentDomain } from '@/lib/store/slices/domainSlice';

function SignupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { success: showSuccess, error: showError } = useToast();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  const [signup, { isLoading: isSigningUp }] = useSignupMutation();
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendCode, { isLoading: isResending }] = useResendCodeMutation();
  
  const domainParam = searchParams.get('domain') || '';
  const emailParam = searchParams.get('email') || '';
  const redirectParam = searchParams.get('redirect') || '';
  
  const [step, setStep] = useState<'signup' | 'verify'>('signup');
  const [formData, setFormData] = useState({
    email: emailParam,
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);

  useEffect(() => {
    if (domainParam) {
      // Store domain for later use
      dispatch(setCurrentDomain(domainParam));
    }
  }, [domainParam, dispatch]);

  // Pre-fill email from URL param
  useEffect(() => {
    if (emailParam && !formData.email) {
      setFormData((prev) => ({ ...prev, email: emailParam }));
    }
  }, [emailParam]);

  // Redirect if already authenticated (after verification)
  useEffect(() => {
    if (isAuthenticated) {
      // Check for pending invitation redirect
      const pendingInvitation = sessionStorage.getItem('pendingInvitation');
      if (pendingInvitation || redirectParam) {
        const redirectTo = redirectParam || `/invitations/${pendingInvitation}`;
        sessionStorage.removeItem('pendingInvitation');
        router.push(redirectTo);
      } else {
        router.push('/onboarding');
      }
    }
  }, [isAuthenticated, router, redirectParam]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const result = await signup({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      }).unwrap();
      
      if (result.success) {
        showSuccess('Account created! Please verify your email.');
        setStep('verify');
      }
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Signup failed. Please try again.');
    }
  };

  const handleVerificationInput = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
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
        showSuccess('Email verified successfully!');
        router.push('/onboarding');
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
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const isLoading = isSigningUp || isVerifying;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-primary/10" />
      
      <motion.div 
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl"
        animate={{ 
          x: [0, 30, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{ translateY: '-50%', translateX: '50%' }}
      />
      
      <motion.div 
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl"
        animate={{ 
          x: [0, -30, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
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
                {step === 'signup' ? 'Create your account' : 'Verify your email'}
              </h1>
              <p className="text-gray-500">
                {step === 'signup' 
                  ? 'Start optimizing your website for AI engines' 
                  : `We sent a code to ${formData.email}`}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Domain Badge */}
        <AnimatePresence>
          {domainParam && (
            <motion.div 
              className="flex justify-center mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                >
                  <Globe className="w-4 h-4 text-primary" />
                </motion.div>
                <span className="text-sm font-medium text-primary">
                  Setting up for: {new URL(domainParam).hostname}
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-xl border-0">
            <AnimatePresence mode="wait">
              {step === 'signup' ? (
                <motion.form 
                  key="signup-form"
                  onSubmit={handleSignup} 
                  className="space-y-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
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
                    className="grid grid-cols-2 gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Input
                      label="First Name"
                      placeholder="John"
                      leftIcon={<User className="w-5 h-5" />}
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      error={errors.firstName}
                    />
                    <Input
                      label="Last Name"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      error={errors.lastName}
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Input
                      label="Confirm Password"
                      type="password"
                      placeholder="••••••••"
                      leftIcon={<Lock className="w-5 h-5" />}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      error={errors.confirmPassword}
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
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
                      Create Account
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
                  <div className="flex justify-center gap-3">
                    {verificationCode.map((digit, index) => (
                      <motion.input
                        key={index}
                        id={`code-${index}`}
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
                      isLoading={isLoading}
                      disabled={verificationCode.join('').length !== 6}
                      rightIcon={<CheckCircle className="w-5 h-5" />}
                    >
                      Verify Email
                    </Button>
                  </motion.div>
                  
                  <motion.p 
                    className="text-center text-sm text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
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
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        <motion.p 
          className="text-center text-sm text-gray-500 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-semibold hover:text-primary-dark">
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
