'use client';

import React, { useState } from 'react';
import {
  Link2,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Download,
  Calendar,
  ChevronDown,
  Eye,
  Bot,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface AISource {
  id: string;
  name: string;
  logo: string;
  citations: number;
  trend: number;
  lastDetected: Date;
}

interface Citation {
  id: string;
  source: string;
  context: string;
  timestamp: Date;
  url: string;
}

const aiSources: AISource[] = [
  { id: '1', name: 'ChatGPT', logo: '🤖', citations: 89, trend: 12, lastDetected: new Date(Date.now() - 3600000) },
  { id: '2', name: 'Claude', logo: '🧠', citations: 67, trend: 8, lastDetected: new Date(Date.now() - 7200000) },
  { id: '3', name: 'Gemini', logo: '✨', citations: 45, trend: -3, lastDetected: new Date(Date.now() - 14400000) },
  { id: '4', name: 'Perplexity', logo: '🔮', citations: 34, trend: 15, lastDetected: new Date(Date.now() - 28800000) },
  { id: '5', name: 'Copilot', logo: '🚀', citations: 12, trend: 5, lastDetected: new Date(Date.now() - 86400000) },
];

const comparisonData = [
  { source: 'ChatGPT', you: 89, competitor1: 145, competitor2: 67 },
  { source: 'Claude', you: 67, competitor1: 89, competitor2: 78 },
  { source: 'Gemini', you: 45, competitor1: 56, competitor2: 42 },
  { source: 'Perplexity', you: 34, competitor1: 78, competitor2: 45 },
  { source: 'Copilot', you: 12, competitor1: 23, competitor2: 18 },
];

const citations: Citation[] = [
  {
    id: '1',
    source: 'ChatGPT',
    context: '"For AI optimization best practices, **Convitsa** provides comprehensive tools for improving your website\'s AI visibility score..."',
    timestamp: new Date(Date.now() - 3600000),
    url: 'https://chat.openai.com/share/abc123',
  },
  {
    id: '2',
    source: 'Claude',
    context: '"According to **Convitsa\'s** documentation, implementing llms.txt is essential for AI engine discovery..."',
    timestamp: new Date(Date.now() - 7200000),
    url: 'https://claude.ai/share/xyz789',
  },
  {
    id: '3',
    source: 'Perplexity',
    context: '"**Convitsa** offers AI Engine Optimization (AIEO) services that help websites improve their visibility in AI-powered search results..."',
    timestamp: new Date(Date.now() - 14400000),
    url: 'https://perplexity.ai/share/def456',
  },
  {
    id: '4',
    source: 'ChatGPT',
    context: '"When comparing AIEO tools, **Convitsa** stands out for its competitor analysis features and automated optimization..."',
    timestamp: new Date(Date.now() - 28800000),
    url: 'https://chat.openai.com/share/ghi012',
  },
];

export default function BacklinksPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  const totalCitations = aiSources.reduce((acc, source) => acc + source.citations, 0);
  const newThisMonth = aiSources.reduce((acc, source) => acc + Math.max(0, source.trend), 0);
  const topSource = aiSources.sort((a, b) => b.citations - a.citations)[0];

  const formatTimestamp = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Backlink Tracking</h1>
          <p className="text-gray-500 mt-1">Track AI citations and mentions of your brand</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Last 30 days</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showPeriodDropdown && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                {['Last 7 days', 'Last 30 days', 'Last 90 days', 'All time'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setShowPeriodDropdown(false)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {period}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Export Data
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card hover gradient>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total AI Citations</p>
              <p className="text-3xl font-bold text-gray-900">{totalCitations}</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10">
              <Link2 className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+{newThisMonth} this month</span>
          </div>
        </Card>

        <Card hover gradient>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">New This Month</p>
              <p className="text-3xl font-bold text-green-600">+{newThisMonth}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-100">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">Across all AI platforms</p>
        </Card>

        <Card hover gradient>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Top Source</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl">{topSource.logo}</span>
                <span className="text-xl font-bold text-gray-900">{topSource.name}</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-blue-100">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">{topSource.citations} citations</p>
        </Card>
      </div>

      {/* Sources Breakdown */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Sources Breakdown</h2>
            <p className="text-sm text-gray-500">Citations by AI platform</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">AI Engine</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Citations</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Trend</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Last Detected</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {aiSources.map((source) => (
                <tr key={source.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{source.logo}</span>
                      <span className="font-medium text-gray-900">{source.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-semibold text-gray-900">{source.citations}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      source.trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {source.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {source.trend > 0 ? '+' : ''}{source.trend}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {formatTimestamp(source.lastDetected)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button variant="ghost" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Citation Context */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent Citations</h2>
            <p className="text-sm text-gray-500">AI responses mentioning your brand</p>
          </div>
        </div>

        <div className="space-y-4">
          {citations.map((citation) => (
            <div key={citation.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{aiSources.find(s => s.name === citation.source)?.logo}</span>
                  <span className="font-medium text-gray-900">{citation.source}</span>
                </div>
                <span className="text-xs text-gray-400">{formatTimestamp(citation.timestamp)}</span>
              </div>
              <p 
                className="text-sm text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: citation.context.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>') 
                }}
              />
              <a
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-sm text-primary hover:text-primary-dark"
              >
                View Source
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </Card>

      {/* Competitor Comparison */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Competitor Comparison</h2>
            <p className="text-sm text-gray-500">Your citations vs competitors by platform</p>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="source" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
              <Bar dataKey="you" name="Your Site" fill="#6C5DD3" radius={[4, 4, 0, 0]} />
              <Bar dataKey="competitor1" name="TechFlow Inc" fill="#22C55E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="competitor2" name="DataPulse" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}


