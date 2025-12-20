'use client';

import React, { useState } from 'react';
import {
  Check,
  Settings,
  Copy,
  RefreshCw,
  ExternalLink,
  Plus,
  Trash2,
  Play,
  Key,
  Webhook,
  ChevronDown,
  Globe,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useToast } from '@/lib/store/hooks/useToast';

interface Integration {
  id: string;
  name: string;
  description: string;
  logo: string;
  connected: boolean;
  color: string;
}

interface WebhookItem {
  id: string;
  url: string;
  events: string[];
  active: boolean;
}

const integrations: Integration[] = [
  {
    id: 'gsc',
    name: 'Google Search Console',
    description: 'Monitor your website\'s presence in Google Search results',
    logo: '🔍',
    connected: true,
    color: '#4285F4',
  },
  {
    id: 'ga',
    name: 'Google Analytics',
    description: 'Track website traffic and user behavior',
    logo: '📊',
    connected: true,
    color: '#F9AB00',
  },
  {
    id: 'wordpress',
    name: 'WordPress',
    description: 'Auto-sync optimizations to your WordPress site',
    logo: '🔷',
    connected: false,
    color: '#21759B',
  },
  {
    id: 'webflow',
    name: 'Webflow',
    description: 'Connect and optimize your Webflow projects',
    logo: '🌊',
    connected: false,
    color: '#4353FF',
  },
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Optimize your Shopify store for AI engines',
    logo: '🛍️',
    connected: false,
    color: '#96BF48',
  },
  {
    id: 'squarespace',
    name: 'Squarespace',
    description: 'Integrate with your Squarespace website',
    logo: '⬛',
    connected: false,
    color: '#000000',
  },
];

const webhookEvents = [
  { value: 'sync.completed', label: 'Sync Completed' },
  { value: 'issues.found', label: 'Issues Found' },
  { value: 'optimization.completed', label: 'Optimization Completed' },
  { value: 'score.changed', label: 'Score Changed' },
];

export default function IntegrationsPage() {
  const { success: showSuccess, error: showError, info: showInfo } = useToast();
  const [integrationList, setIntegrationList] = useState(integrations);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [apiKey] = useState('cvtsa_live_sk_a1b2c3d4e5f6g7h8i9j0klmnop');
  const [copied, setCopied] = useState(false);
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([
    {
      id: '1',
      url: 'https://api.example.com/webhook',
      events: ['sync.completed', 'issues.found'],
      active: true,
    },
  ]);
  const [newWebhook, setNewWebhook] = useState({
    url: '',
    events: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null);

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showSuccess('API key copied!');
  };

  const handleConnect = async (integration: Integration) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIntegrationList(integrationList.map(i => 
      i.id === integration.id ? { ...i, connected: true } : i
    ));
    setIsLoading(false);
    showSuccess(`Connected to ${integration.name}!`);
  };

  const handleDisconnect = async (integration: Integration) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIntegrationList(integrationList.map(i => 
      i.id === integration.id ? { ...i, connected: false } : i
    ));
    setIsLoading(false);
    setShowConfigModal(false);
    showInfo(`Disconnected from ${integration.name}`);
  };

  const handleAddWebhook = () => {
    if (!newWebhook.url || newWebhook.events.length === 0) return;
    
    setWebhooks([...webhooks, {
      id: Date.now().toString(),
      url: newWebhook.url,
      events: newWebhook.events,
      active: true,
    }]);
    setNewWebhook({ url: '', events: [] });
    setShowWebhookModal(false);
    showSuccess('Webhook added!');
  };

  const handleTestWebhook = async (webhookId: string) => {
    setTestingWebhook(webhookId);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setTestingWebhook(null);
    showSuccess('Test webhook sent successfully!');
  };

  const handleDeleteWebhook = (webhookId: string) => {
    setWebhooks(webhooks.filter(w => w.id !== webhookId));
    showInfo('Webhook deleted');
  };

  const toggleWebhookEvent = (event: string) => {
    setNewWebhook(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event],
    }));
  };

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
        <p className="text-gray-500 mt-1">Connect your tools and automate workflows</p>
      </div>

      {/* Integrations Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Connected Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrationList.map((integration) => (
            <Card key={integration.id} hover className="relative overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${integration.color}15` }}
                  >
                    {integration.logo}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                    {integration.connected && (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                        <Check className="w-3 h-3" />
                        Connected
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4">{integration.description}</p>
              <div className="flex gap-2">
                {integration.connected ? (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      leftIcon={<Settings className="w-4 h-4" />}
                      onClick={() => {
                        setSelectedIntegration(integration);
                        setShowConfigModal(true);
                      }}
                    >
                      Configure
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="sm"
                    onClick={() => handleConnect(integration)}
                    isLoading={isLoading}
                  >
                    Connect
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* API Keys Section */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-primary/10">
            <Key className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">API Keys</h2>
            <p className="text-sm text-gray-500">Use these keys to access the Convitsa API</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your API Key</label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200">
                <code className="text-sm text-gray-600 flex-1 truncate">{apiKey}</code>
                <button 
                  onClick={copyApiKey}
                  className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                </button>
              </div>
              <Button variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />}>
                Regenerate
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Keep your API key secret. Do not share it or expose it in client-side code.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <a href="#" className="text-sm text-primary font-semibold hover:text-primary-dark flex items-center gap-1">
              <ExternalLink className="w-4 h-4" />
              View API Documentation
            </a>
          </div>
        </div>
      </Card>

      {/* Webhooks Section */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-100">
              <Webhook className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Webhooks</h2>
              <p className="text-sm text-gray-500">Receive real-time notifications</p>
            </div>
          </div>
          <Button 
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowWebhookModal(true)}
          >
            Add Webhook
          </Button>
        </div>

        {webhooks.length > 0 ? (
          <div className="space-y-3">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{webhook.url}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${webhook.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {webhook.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {webhook.events.map((event) => (
                      <span key={event} className="px-2 py-0.5 rounded bg-gray-200 text-xs text-gray-600">
                        {webhookEvents.find(e => e.value === event)?.label || event}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    leftIcon={<Play className="w-4 h-4" />}
                    isLoading={testingWebhook === webhook.id}
                    onClick={() => handleTestWebhook(webhook.id)}
                  >
                    Test
                  </Button>
                  <button
                    onClick={() => handleDeleteWebhook(webhook.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Webhook className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No webhooks configured yet</p>
          </div>
        )}
      </Card>

      {/* Configure Integration Modal */}
      <Modal 
        isOpen={showConfigModal} 
        onClose={() => setShowConfigModal(false)}
        title={`Configure ${selectedIntegration?.name}`}
      >
        {selectedIntegration && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">Connected and syncing</span>
            </div>
            
            <div className="pt-4 space-y-3">
              <p className="text-sm text-gray-600">
                Your {selectedIntegration.name} account is connected and data is being synced automatically.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  View Settings
                </Button>
                <Button 
                  variant="outline" 
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => handleDisconnect(selectedIntegration)}
                  isLoading={isLoading}
                >
                  Disconnect
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Webhook Modal */}
      <Modal 
        isOpen={showWebhookModal} 
        onClose={() => setShowWebhookModal(false)}
        title="Add Webhook"
      >
        <div className="space-y-4">
          <Input
            label="Webhook URL"
            placeholder="https://your-server.com/webhook"
            value={newWebhook.url}
            onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Events</label>
            <div className="space-y-2">
              {webhookEvents.map((event) => (
                <label key={event.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newWebhook.events.includes(event.value)}
                    onChange={() => toggleWebhookEvent(event.value)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{event.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowWebhookModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddWebhook}>
              Add Webhook
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


