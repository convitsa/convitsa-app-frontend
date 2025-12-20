'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Globe, 
  Bell, 
  Shield, 
  CreditCard, 
  LogOut,
  Mail,
  Save,
  Trash2,
  ExternalLink,
  Loader2,
  Check,
  X,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { logout, setUser } from '@/lib/store/slices/authSlice';
import { resetDomainState } from '@/lib/store/slices/domainSlice';
import { useToast } from '@/lib/store/hooks/useToast';
import { 
  useUpdateProfileMutation, 
  useLogoutMutation,
  useChangePasswordMutation,
  useUpdateNotificationPreferencesMutation,
  useDeleteAccountMutation,
  NotificationPreferences
} from '@/lib/store/api/authApi';
import { useGetSubscriptionQuery, useGetPlansQuery } from '@/lib/store/api/billingApi';
import { baseApi } from '@/lib/store/api/baseApi';

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const currentDomain = useAppSelector((state) => {
    const domainId = state.domain.currentDomainId;
    return state.domain.domains.find(d => d.id === domainId) || null;
  });
  const { success: showSuccess, error: showError } = useToast();
  
  // API Hooks
  const [updateProfile, { isLoading: isSavingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [updateNotifications, { isLoading: isSavingNotifications }] = useUpdateNotificationPreferencesMutation();
  const [deleteAccount, { isLoading: isDeletingAccount }] = useDeleteAccountMutation();
  const [logoutMutation] = useLogoutMutation();
  
  // Billing data
  const { data: subscriptionData, isLoading: isLoadingSubscription } = useGetSubscriptionQuery();
  const { data: plansData } = useGetPlansQuery();
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Notification preferences state
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    emailNotifications: true,
    weeklyReports: true,
    competitorAlerts: false,
    productUpdates: true,
  });

  // Delete account modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  // Initialize notifications from user data
  useEffect(() => {
    if (user?.notificationPreferences) {
      setNotifications(user.notificationPreferences as NotificationPreferences);
    }
  }, [user?.notificationPreferences]);

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      const result = await updateProfile(profileData).unwrap();
      if (result.success && result.data?.user) {
        dispatch(setUser(result.data.user));
      }
      showSuccess('Profile updated successfully!');
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      showError('Password must be at least 8 characters');
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();
      showSuccess('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Failed to change password');
    }
  };

  const handleToggleNotification = async (key: keyof NotificationPreferences) => {
    const newValue = !notifications[key];
    const updatedNotifications = { ...notifications, [key]: newValue };
    setNotifications(updatedNotifications);

    try {
      await updateNotifications({ [key]: newValue }).unwrap();
    } catch (err: any) {
      // Revert on error
      setNotifications(notifications);
      showError(err?.data?.error?.message || 'Failed to update notification preferences');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount({ password: deletePassword || undefined }).unwrap();
      showSuccess('Account deleted successfully');
      
      // Clear all state and redirect
      dispatch(logout());
      dispatch(resetDomainState());
      dispatch(baseApi.util.resetApiState());
      window.location.href = '/login';
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Failed to delete account');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetDomainState());
    dispatch(baseApi.util.resetApiState());
    logoutMutation();
    window.location.href = '/login';
  };

  const displayDomain = currentDomain?.url 
    ? (() => {
        try {
          return new URL(currentDomain.url.startsWith('http') ? currentDomain.url : `https://${currentDomain.url}`).hostname;
        } catch {
          return currentDomain.url;
        }
      })()
    : 'No domain';

  const subscription = subscriptionData?.data?.subscription;
  const plans = plansData?.data?.plans || [];

  const getPlanDisplayName = (plan: string) => {
    const planInfo = plans.find(p => p.id === plan);
    return planInfo?.name || plan.charAt(0).toUpperCase() + plan.slice(1);
  };

  const getPlanPrice = (plan: string) => {
    const planInfo = plans.find(p => p.id === plan);
    return planInfo?.price || 0;
  };

  return (
    <div className="space-y-8 pt-12 lg:pt-0 max-w-3xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and preferences</p>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                value={profileData.firstName}
                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                value={profileData.lastName}
                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
              />
            </div>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="w-5 h-5" />}
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            />
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSaveProfile} 
              isLoading={isSavingProfile}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Domain Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Domain Management
            </CardTitle>
            <CardDescription>Manage your connected domain</CardDescription>
          </CardHeader>
          <CardContent>
            {currentDomain ? (
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{displayDomain}</p>
                    <p className={`text-sm flex items-center gap-1 ${currentDomain.verified ? 'text-green-600' : 'text-amber-600'}`}>
                      <span className={`w-2 h-2 rounded-full ${currentDomain.verified ? 'bg-green-500' : 'bg-amber-500'}`} />
                      {currentDomain.verified ? 'Verified' : 'Pending Verification'}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  leftIcon={<ExternalLink className="w-4 h-4" />}
                  onClick={() => window.open(currentDomain.url.startsWith('http') ? currentDomain.url : `https://${currentDomain.url}`, '_blank')}
                >
                  View Site
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No domain configured. Add a domain from the dashboard.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
              {isSavingNotifications && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
            </CardTitle>
            <CardDescription>Configure how you receive updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: 'emailNotifications' as const, label: 'Email notifications', description: 'Receive updates via email' },
              { key: 'weeklyReports' as const, label: 'Weekly reports', description: 'Get weekly AI visibility reports' },
              { key: 'competitorAlerts' as const, label: 'Competitor alerts', description: 'Get notified when competitors change' },
              { key: 'productUpdates' as const, label: 'Product updates', description: 'Learn about new features' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleToggleNotification(item.key)}
                  className={`
                    relative w-12 h-7 rounded-full transition-colors
                    ${notifications[item.key] ? 'bg-primary' : 'bg-gray-200'}
                  `}
                >
                  <motion.div
                    animate={{ x: notifications[item.key] ? 22 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-5 h-5 rounded-full bg-white shadow"
                  />
                </motion.button>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Security
            </CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Password</p>
                <p className="text-sm text-gray-500">Update your password regularly for security</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                leftIcon={<Lock className="w-4 h-4" />}
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </Button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Billing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Billing
            </CardTitle>
            <CardDescription>Manage your subscription and billing</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingSubscription ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                <div>
                  <p className="text-sm text-gray-600">Current Plan</p>
                  <p className="text-xl font-bold text-gray-900">
                    {subscription ? getPlanDisplayName(subscription.plan) : 'Free'} Plan
                  </p>
                  <p className="text-sm text-gray-500">
                    {subscription?.plan === 'free' ? 'Limited features' : 
                     subscription ? `$${getPlanPrice(subscription.plan)}/month` : 'Limited features'}
                  </p>
                  {subscription && subscription.plan !== 'free' && (
                    <p className="text-xs text-gray-400 mt-1">
                      {subscription.usedSeats}/{subscription.totalSeats} seats used
                    </p>
                  )}
                </div>
                {(!subscription || subscription.plan === 'free') ? (
                  <Button>
                    Upgrade to Pro
                  </Button>
                ) : (
                  <Button variant="outline">
                    Manage Subscription
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Log out</p>
                <p className="text-sm text-gray-500">Sign out of your account</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                leftIcon={<LogOut className="w-4 h-4" />}
              >
                Log Out
              </Button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Delete Account</p>
                <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }}
        title="Change Password"
      >
        <div className="space-y-4">
          <div className="relative">
            <Input
              label="Current Password"
              type={showCurrentPassword ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              leftIcon={<Lock className="w-5 h-5" />}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div className="relative">
            <Input
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              leftIcon={<Lock className="w-5 h-5" />}
              helperText="Must be at least 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            leftIcon={<Lock className="w-5 h-5" />}
            error={passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword ? 'Passwords do not match' : undefined}
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleChangePassword}
              isLoading={isChangingPassword}
              disabled={!passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
            >
              Change Password
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletePassword('');
        }}
        title="Delete Account"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-red-50 border border-red-200">
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> This action cannot be undone. All your data, including domains, prompts, and analytics will be permanently deleted.
            </p>
          </div>
          <Input
            label="Enter your password to confirm"
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            leftIcon={<Lock className="w-5 h-5" />}
            placeholder="Your password"
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowDeleteModal(false);
                setDeletePassword('');
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteAccount}
              isLoading={isDeletingAccount}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={!deletePassword}
            >
              Delete My Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
