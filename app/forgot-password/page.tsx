'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, Send } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { useForgotPasswordMutation } from '@/lib/store/api/authApi';
import { useToast } from '@/lib/store/hooks/useToast';

export default function ForgotPasswordPage() {
  const { error: showError } = useToast();
  
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }
    
    setError('');
    
    try {
      await forgotPassword({ email }).unwrap();
      setIsSuccess(true);
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Failed to send reset link.');
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
              key={isSuccess ? 'success' : 'initial'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isSuccess ? 'Check your email' : 'Forgot password?'}
              </h1>
              <p className="text-gray-500">
                {isSuccess 
                  ? 'We sent a password reset link to your email'
                  : 'No worries, we\'ll send you reset instructions'}
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
              {isSuccess ? (
                <motion.div 
                  key="success"
                  className="text-center py-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </motion.div>
                  </motion.div>
                  <motion.h3 
                    className="text-lg font-semibold text-gray-900 mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Check your inbox
                  </motion.h3>
                  <motion.p 
                    className="text-gray-500 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    We&apos;ve sent a password reset link to<br />
                    <span className="font-semibold text-gray-700">{email}</span>
                  </motion.p>
                  <motion.p 
                    className="text-sm text-gray-400 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Didn&apos;t receive the email?{' '}
                    <motion.button 
                      onClick={() => setIsSuccess(false)}
                      className="text-primary font-semibold hover:text-primary-dark"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Click to resend
                    </motion.button>
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href="/login">
                      <Button variant="outline" className="w-full" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                        Back to Login
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  onSubmit={handleSubmit} 
                  className="space-y-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={error}
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      isLoading={isLoading}
                      rightIcon={<Send className="w-5 h-5" />}
                    >
                      Send Reset Link
                    </Button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        <AnimatePresence>
          {!isSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link 
                href="/login"
                className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-500 hover:text-gray-700"
              >
                <motion.span
                  className="flex items-center gap-2"
                  whileHover={{ x: -4 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </motion.span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
