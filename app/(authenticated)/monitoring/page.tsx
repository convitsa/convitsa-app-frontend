'use client';

import React, { useState } from 'react';
import {
  Activity,
  Shield,
  Globe,
  FileText,
  Lock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Bell,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/lib/store/hooks/useToast';

interface HealthCheck {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'error';
  details: string;
  lastChecked: Date;
}

interface Incident {
  id: string;
  title: string;
  status: 'resolved' | 'investigating' | 'identified';
  impact: 'minor' | 'major' | 'critical';
  startTime: Date;
  endTime?: Date;
  description: string;
}

const responseTimeData = [
  { time: '00:00', value: 120 },
  { time: '02:00', value: 115 },
  { time: '04:00', value: 118 },
  { time: '06:00', value: 125 },
  { time: '08:00', value: 145 },
  { time: '10:00', value: 160 },
  { time: '12:00', value: 155 },
  { time: '14:00', value: 148 },
  { time: '16:00', value: 142 },
  { time: '18:00', value: 135 },
  { time: '20:00', value: 128 },
  { time: '22:00', value: 122 },
];

const healthChecks: HealthCheck[] = [
  {
    id: '1',
    name: 'DNS Configuration',
    status: 'healthy',
    details: 'All DNS records are configured correctly',
    lastChecked: new Date(Date.now() - 300000),
  },
  {
    id: '2',
    name: 'SSL Certificate',
    status: 'healthy',
    details: 'Valid certificate (expires in 90 days)',
    lastChecked: new Date(Date.now() - 300000),
  },
  {
    id: '3',
    name: 'CNAME Record',
    status: 'healthy',
    details: 'convitsa-verify.domain.com → verify.convitsa.com',
    lastChecked: new Date(Date.now() - 300000),
  },
  {
    id: '4',
    name: 'TXT Record',
    status: 'healthy',
    details: 'Verification record found and valid',
    lastChecked: new Date(Date.now() - 300000),
  },
  {
    id: '5',
    name: 'llms.txt',
    status: 'healthy',
    details: 'File is accessible and properly formatted',
    lastChecked: new Date(Date.now() - 300000),
  },
  {
    id: '6',
    name: 'Robots.txt',
    status: 'warning',
    details: 'Some AI crawlers may be blocked',
    lastChecked: new Date(Date.now() - 300000),
  },
];

const incidents: Incident[] = [
  {
    id: '1',
    title: 'Elevated response times',
    status: 'resolved',
    impact: 'minor',
    startTime: new Date(Date.now() - 172800000),
    endTime: new Date(Date.now() - 169200000),
    description: 'Some users experienced slower response times during peak hours.',
  },
  {
    id: '2',
    title: 'DNS propagation delay',
    status: 'resolved',
    impact: 'minor',
    startTime: new Date(Date.now() - 604800000),
    endTime: new Date(Date.now() - 601200000),
    description: 'DNS changes took longer than expected to propagate globally.',
  },
];

export default function MonitoringPage() {
  const { success: showSuccess, error: showError, info: showInfo } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    slack: false,
    webhook: false,
  });

  const getStatusIcon = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'error':
        return 'bg-red-50 border-red-200';
    }
  };

  const getImpactBadge = (impact: 'minor' | 'major' | 'critical') => {
    switch (impact) {
      case 'minor':
        return 'bg-yellow-100 text-yellow-700';
      case 'major':
        return 'bg-orange-100 text-orange-700';
      case 'critical':
        return 'bg-red-100 text-red-700';
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
    showSuccess('Health checks refreshed!');
  };

  const formatDuration = (start: Date, end?: Date) => {
    const endTime = end || new Date();
    const diff = endTime.getTime() - start.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const healthyCount = healthChecks.filter(h => h.status === 'healthy').length;
  const totalChecks = healthChecks.length;
  const uptimePercentage = 99.9;

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Monitoring</h1>
          <p className="text-gray-500 mt-1">Real-time health and performance monitoring</p>
        </div>
        <Button 
          variant="outline" 
          leftIcon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
          onClick={handleRefresh}
          isLoading={isRefreshing}
        >
          Refresh Status
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card hover gradient className="border-green-200 bg-green-50">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-green-100">
              <Activity className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">System Status</p>
              <p className="text-2xl font-bold text-green-700">All Systems Operational</p>
            </div>
          </div>
        </Card>

        <Card hover gradient>
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-primary/10">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Uptime</p>
              <p className="text-3xl font-bold text-gray-900">{uptimePercentage}%</p>
              <p className="text-xs text-gray-400">Last 30 days</p>
            </div>
          </div>
        </Card>

        <Card hover gradient>
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-blue-100">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Response Time</p>
              <p className="text-3xl font-bold text-gray-900">138ms</p>
              <p className="text-xs text-gray-400">Last 24 hours</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Response Time Chart */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Response Time</h2>
            <p className="text-sm text-gray-500">Last 24 hours</p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} unit="ms" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6C5DD3"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#6C5DD3' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Health Checks */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Health Checks</h2>
              <p className="text-sm text-gray-500">{healthyCount}/{totalChecks} checks passing</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {healthChecks.map((check) => (
            <div
              key={check.id}
              className={`flex items-center justify-between p-4 rounded-xl border ${getStatusColor(check.status)}`}
            >
              <div className="flex items-center gap-4">
                {getStatusIcon(check.status)}
                <div>
                  <p className="font-medium text-gray-900">{check.name}</p>
                  <p className="text-sm text-gray-500">{check.details}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">
                  Last checked {Math.floor((Date.now() - check.lastChecked.getTime()) / 60000)}m ago
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Incident History */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-amber-100">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Incident History</h2>
            <p className="text-sm text-gray-500">Past incidents and resolutions</p>
          </div>
        </div>

        {incidents.length > 0 ? (
          <div className="space-y-4">
            {incidents.map((incident) => (
              <div key={incident.id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{incident.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${getImpactBadge(incident.impact)}`}>
                      {incident.impact}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      {incident.status}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    Duration: {formatDuration(incident.startTime, incident.endTime)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{incident.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {incident.startTime.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
            <p className="text-gray-500">No incidents in the past 90 days</p>
          </div>
        )}
      </Card>

      {/* Alert Settings */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-blue-100">
            <Bell className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Alert Settings</h2>
            <p className="text-sm text-gray-500">Configure how you receive notifications</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { key: 'email', label: 'Email Notifications', description: 'Receive alerts via email' },
            { key: 'slack', label: 'Slack Integration', description: 'Get notified in your Slack channel' },
            { key: 'webhook', label: 'Webhook Alerts', description: 'Send alerts to your webhook endpoint' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                className={`
                  relative w-12 h-7 rounded-full transition-colors
                  ${notifications[item.key as keyof typeof notifications] ? 'bg-primary' : 'bg-gray-200'}
                `}
              >
                <div
                  className={`
                    absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform
                    ${notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}


