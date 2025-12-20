'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Loader2,
  Users,
  Clock,
  Mail,
  ArrowRight,
  AlertTriangle,
  Shield,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import {
  useGetInvitationDetailsQuery,
  useAcceptInvitationMutation,
} from '@/lib/store/api/teamsApi';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { selectIsAuthenticated, selectUser, setCurrentTeam } from '@/lib/store/slices/authSlice';
import { useToast } from '@/lib/store/hooks/useToast';

export default function AcceptInvitationPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { success: showSuccess, error: showError } = useToast();

  const token = params.token as string;
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  const [acceptState, setAcceptState] = useState<'idle' | 'accepting' | 'success' | 'error'>('idle');

  // Get invitation details (public - no auth required)
  const {
    data: invitationData,
    error: invitationError,
    isLoading: isLoadingDetails,
    isError: isDetailsError,
  } = useGetInvitationDetailsQuery(token, {
    skip: !token,
  });

  const [acceptInvitation, { isLoading: isAccepting }] = useAcceptInvitationMutation();

  const invitation = invitationData?.data?.invitation;

  // Check if logged-in user email matches invitation email
  const emailMatches = user?.email?.toLowerCase() === invitation?.email?.toLowerCase();

  // Redirect to team page after successful acceptance
  useEffect(() => {
    if (acceptState === 'success') {
      const timer = setTimeout(() => {
        router.push('/team');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [acceptState, router]);

  const handleAcceptInvitation = async () => {
    if (!isAuthenticated || !emailMatches) return;

    setAcceptState('accepting');
    try {
      const result = await acceptInvitation(token).unwrap();
      if (result.success) {
        setAcceptState('success');
        showSuccess(`Welcome to ${result.data.teamName}!`);
        // Set the new team as current
        dispatch(setCurrentTeam(result.data.teamId));
      }
    } catch (err: any) {
      setAcceptState('error');
      showError(err?.data?.error?.message || 'Failed to accept invitation');
    }
  };

  const handleLoginRedirect = () => {
    // Store token in session storage for after login
    sessionStorage.setItem('pendingInvitation', token);
    router.push(`/login?redirect=/invitations/${token}&email=${encodeURIComponent(invitation?.email || '')}`);
  };

  const handleSignupRedirect = () => {
    // Store token in session storage for after signup
    sessionStorage.setItem('pendingInvitation', token);
    router.push(`/signup?email=${encodeURIComponent(invitation?.email || '')}&redirect=/invitations/${token}`);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-blue-100 text-blue-700';
      case 'member':
        return 'bg-green-100 text-green-700';
      case 'viewer':
        return 'bg-gray-100 text-gray-700';
      case 'custom':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Loading state
  if (isLoadingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading invitation...</p>
        </motion.div>
      </div>
    );
  }

  // Error loading invitation
  if (isDetailsError || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="text-center p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6"
            >
              <XCircle className="w-10 h-10 text-red-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invitation Not Found</h2>
            <p className="text-gray-600 mb-6">
              {(invitationError as any)?.data?.error?.message ||
                'This invitation link is invalid or has been removed.'}
            </p>
            <Button onClick={() => router.push('/')}>Go to Homepage</Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Expired invitation
  if (invitation.isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="text-center p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6"
            >
              <Clock className="w-10 h-10 text-amber-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invitation Expired</h2>
            <p className="text-gray-600 mb-6">
              This invitation to join <strong>{invitation.teamName}</strong> has expired.
              Please contact {invitation.inviterName} to send a new invitation.
            </p>
            <Button onClick={() => router.push('/')}>Go to Homepage</Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Already accepted
  if (invitation.isAlreadyAccepted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="text-center p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Already a Member</h2>
            <p className="text-gray-600 mb-6">
              You're already a member of <strong>{invitation.teamName}</strong>.
            </p>
            <Button onClick={() => router.push('/team')}>Go to Team Dashboard</Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Success state
  if (acceptState === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="text-center p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              Welcome to the Team! 🎉
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 mb-6"
            >
              You've successfully joined <strong>{invitation.teamName}</strong>
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button onClick={() => router.push('/team')} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Go to Team Dashboard
              </Button>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-gray-400 mt-4"
            >
              Redirecting in 3 seconds...
            </motion.p>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Main invitation view
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Convitsa" width={40} height={40} />
            <span className="text-xl font-bold text-gray-900">Convitsa</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <Card className="p-8">
            {/* Team Icon */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold"
              >
                {invitation.teamName.charAt(0).toUpperCase()}
              </motion.div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Join {invitation.teamName}
              </h1>
              <p className="text-gray-600">
                <span className="font-medium">{invitation.inviterName}</span> has invited you to join their team on Convitsa
              </p>
            </div>

            {/* Invitation Details */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Invited as</span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getRoleBadgeColor(invitation.role)}`}>
                  {invitation.role === 'custom' ? 'Custom Role' : invitation.role}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Your email</span>
                <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {invitation.email}
                </span>
              </div>
            </div>

            {/* Action based on auth state */}
            <AnimatePresence mode="wait">
              {isAuthenticated ? (
                emailMatches ? (
                  // Logged in with correct email - show accept button
                  <motion.div
                    key="accept"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleAcceptInvitation}
                      isLoading={isAccepting || acceptState === 'accepting'}
                      rightIcon={<ArrowRight className="w-5 h-5" />}
                    >
                      Accept Invitation
                    </Button>
                    <p className="text-center text-sm text-gray-500 mt-3">
                      Logged in as <span className="font-medium">{user?.email}</span>
                    </p>
                  </motion.div>
                ) : (
                  // Logged in but wrong email
                  <motion.div
                    key="wrong-email"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">Different email address</p>
                        <p className="text-sm text-amber-700">
                          This invitation is for <strong>{invitation.email}</strong>, but you're logged in as <strong>{user?.email}</strong>.
                        </p>
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => {
                        // Logout and redirect to login with the correct email
                        sessionStorage.setItem('pendingInvitation', token);
                        router.push(`/login?email=${encodeURIComponent(invitation.email)}&redirect=/invitations/${token}`);
                      }}
                    >
                      Sign in with {invitation.email}
                    </Button>
                  </motion.div>
                )
              ) : (
                // Not logged in
                <motion.div
                  key="not-logged-in"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {invitation.userHasAccount ? (
                    // User has account - show login
                    <>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handleLoginRedirect}
                        rightIcon={<ArrowRight className="w-5 h-5" />}
                      >
                        Sign in to Accept
                      </Button>
                      <p className="text-center text-sm text-gray-500">
                        Sign in with <span className="font-medium">{invitation.email}</span> to join the team
                      </p>
                    </>
                  ) : (
                    // User doesn't have account - show signup
                    <>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handleSignupRedirect}
                        rightIcon={<ArrowRight className="w-5 h-5" />}
                      >
                        Create Account & Join
                      </Button>
                      <p className="text-center text-sm text-gray-500">
                        Create an account with <span className="font-medium">{invitation.email}</span>
                      </p>
                      <div className="text-center">
                        <button
                          onClick={handleLoginRedirect}
                          className="text-sm text-primary hover:text-primary-dark font-medium"
                        >
                          Already have an account? Sign in
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error state */}
            {acceptState === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-red-700">
                    Failed to accept invitation. Please try again.
                  </p>
                </div>
              </motion.div>
            )}
          </Card>

          {/* Security note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-500"
          >
            <Shield className="w-4 h-4" />
            <span>Secure invitation from Convitsa</span>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
