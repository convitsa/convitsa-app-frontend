'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  CreditCard,
  Download,
  Crown,
  Zap,
  Building2,
  Star,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useGetPlansQuery, useGetSubscriptionQuery, useGetInvoicesQuery, useCreateCheckoutMutation } from '@/lib/store/api/billingApi';
import { useToast } from '@/lib/store/hooks/useToast';

const planIcons: Record<string, React.ElementType> = {
  free: Zap,
  pro: Crown,
  enterprise: Building2,
};

const planColors: Record<string, string> = {
  free: 'gray',
  pro: 'primary',
  enterprise: 'blue',
};

export default function BillingPage() {
  const { success: showSuccess, error: showError } = useToast();
  
  const { data: plansData, isLoading: isLoadingPlans } = useGetPlansQuery();
  const { data: subscriptionData, isLoading: isLoadingSubscription } = useGetSubscriptionQuery();
  const { data: invoicesData, isLoading: isLoadingInvoices } = useGetInvoicesQuery();
  const [createCheckout, { isLoading: isCreatingCheckout }] = useCreateCheckoutMutation();
  
  const plans = plansData?.data?.plans || [];
  const subscription = subscriptionData?.data?.subscription;
  const invoices = invoicesData?.data?.invoices || [];
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  
  // Default values if no subscription
  const currentPlan = plans.find(p => p.id === subscription?.planId) || plans[0];
  const currentUsage = 3;
  const maxUsage = currentPlan?.limits?.prompts || 10;
  const usagePercentage = (currentUsage / maxUsage) * 100;

  const handleUpgrade = (plan: any) => {
    setSelectedPlan(plan);
    setShowUpgradeModal(true);
  };

  const confirmUpgrade = async () => {
    if (!selectedPlan) return;
    
    try {
      const result = await createCheckout({
        planId: selectedPlan.id,
      }).unwrap();
      
      if (result.success && result.data?.checkoutUrl) {
        window.location.href = result.data.checkoutUrl;
      }
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Failed to initiate checkout');
    }
  };

  const isLoading = isLoadingPlans || isLoadingSubscription;

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-500 mt-1">Manage your plan and billing information</p>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <>
          {/* Current Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="gradient-card border-primary/20">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-gray-100">
                    <Zap className="w-8 h-8 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold text-gray-900">{currentPlan?.name || 'Free'} Plan</h3>
                      <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold">
                        Current Plan
                      </span>
                    </div>
                    <p className="text-gray-500">{subscription?.status === 'active' ? 'Active subscription' : 'Free tier'}</p>
                  </div>
                </div>
                {plans.length > 1 && (
                  <Button 
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    onClick={() => handleUpgrade(plans.find(p => p.popular) || plans[1])}
                  >
                    Upgrade to Pro
                  </Button>
                )}
              </div>

              {/* Usage Bar */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Monthly Prompts</span>
                  <span className="text-sm text-gray-500">{currentUsage}/{maxUsage} used</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
                    style={{ width: `${usagePercentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Resets on {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Pricing Plans */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Available Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.length > 0 ? plans.map((plan) => {
                const PlanIcon = planIcons[plan.id] || Zap;
                const planColor = planColors[plan.id] || 'gray';
                const isCurrent = subscription?.planId === plan.id || (!subscription && plan.id === 'free');
                
                return (
                  <Card 
                    key={plan.id}
                    className={`relative ${plan.popular ? 'border-2 border-primary shadow-lg shadow-primary/10' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                        planColor === 'primary' ? 'bg-primary/10' : 
                        planColor === 'blue' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <PlanIcon className={`w-7 h-7 ${
                          planColor === 'primary' ? 'text-primary' : 
                          planColor === 'blue' ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-gray-900">
                          {plan.price === 0 ? 'Free' : `$${plan.price}`}
                        </span>
                        {plan.interval && <span className="text-gray-500">/{plan.interval}</span>}
                      </div>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Check className={`w-5 h-5 ${
                            planColor === 'primary' ? 'text-primary' : 
                            planColor === 'blue' ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {isCurrent ? (
                      <Button variant="secondary" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : plan.id === 'enterprise' ? (
                      <Button variant="outline" className="w-full">
                        Contact Sales
                      </Button>
                    ) : (
                      <Button 
                        className="w-full"
                        onClick={() => handleUpgrade(plan)}
                      >
                        Upgrade Now
                      </Button>
                    )}
                  </Card>
                );
              }) : (
                // Fallback static plans
                <>
                  <Card>
                    <div className="text-center mb-6">
                      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <Zap className="w-7 h-7 text-gray-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Free</h3>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-gray-900">$0</span>
                        <span className="text-gray-500">/month</span>
                      </div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {['1 domain', '10 prompts/month', 'Basic analytics'].map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="secondary" className="w-full" disabled>Current Plan</Button>
                  </Card>
                  <Card className="relative border-2 border-primary shadow-lg shadow-primary/10">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Most Popular
                      </span>
                    </div>
                    <div className="text-center mb-6">
                      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Crown className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Pro</h3>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-gray-900">$49</span>
                        <span className="text-gray-500">/month</span>
                      </div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {['5 domains', 'Unlimited prompts', 'Advanced analytics', 'Priority support'].map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-primary" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full">Upgrade Now</Button>
                  </Card>
                  <Card>
                    <div className="text-center mb-6">
                      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-100 flex items-center justify-center">
                        <Building2 className="w-7 h-7 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Enterprise</h3>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-gray-900">Custom</span>
                      </div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {['Unlimited domains', 'White-label', 'Dedicated support', 'SLA guarantee'].map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-blue-600" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full">Contact Sales</Button>
                  </Card>
                </>
              )}
            </div>
          </motion.div>

          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gray-100">
                    <CreditCard className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                    <p className="text-sm text-gray-500">Manage your payment information</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setShowPaymentModal(true)}>
                  Update Payment Method
                </Button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-14 h-10 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">VISA</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                  <p className="text-sm text-gray-500">Expires 12/2025</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Billing History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Billing History</h2>
              </div>
              
              {isLoadingInvoices ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : invoices.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No invoices yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Invoice</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4 text-sm font-medium text-gray-900">{invoice.id}</td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {new Date(invoice.date).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-900 text-right font-medium">${invoice.amount}</td>
                          <td className="py-4 px-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                              invoice.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {invoice.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            {invoice.pdfUrl && (
                              <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                  <Download className="w-4 h-4 text-gray-500" />
                                </button>
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </motion.div>
        </>
      )}

      {/* Upgrade Modal */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Upgrade Your Plan"
        size="md"
      >
        {selectedPlan && (
          <div className="space-y-6">
            <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Crown className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{selectedPlan.name} Plan</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-gray-900">${selectedPlan.price}</span>
                {selectedPlan.interval && <span className="text-gray-500">/{selectedPlan.interval}</span>}
              </div>
            </div>

            <div className="space-y-2">
              {(selectedPlan.features || []).slice(0, 5).map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                className="flex-1"
                onClick={() => setShowUpgradeModal(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={confirmUpgrade}
                isLoading={isCreatingCheckout}
              >
                Confirm Upgrade
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Payment Method Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Update Payment Method"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
              <input
                type="text"
                placeholder="123"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="ghost" className="flex-1" onClick={() => setShowPaymentModal(false)}>
              Cancel
            </Button>
            <Button className="flex-1">
              Save Card
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
