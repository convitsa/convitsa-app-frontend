'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ExternalLink,
  Star,
  Sparkles,
  TrendingUp,
  CheckCircle,
  Copy,
  Eye,
  Plus,
  BarChart3,
  Code,
  FileText,
  Globe,
  Check,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/lib/store/hooks/useToast';

// Mock competitor data
const competitorData = {
  id: '1',
  name: 'TechFlow Inc.',
  website: 'https://techflow.io',
  score: 94,
  usesConvitsa: true,
  scoreBreakdown: [
    { category: 'Content Quality', score: 92, fullMark: 100 },
    { category: 'Technical SEO', score: 88, fullMark: 100 },
    { category: 'AI Readability', score: 95, fullMark: 100 },
    { category: 'Structured Data', score: 85, fullMark: 100 },
    { category: 'Page Speed', score: 90, fullMark: 100 },
    { category: 'Metadata', score: 97, fullMark: 100 },
  ],
  strengths: [
    {
      title: 'Comprehensive llms.txt',
      description: 'Over 500 lines covering all services, products, and FAQs',
      code: `# TechFlow AI Information

name: TechFlow Inc
description: Enterprise automation platform

## Services
- Workflow Automation
- Data Integration
- AI Analytics

## Contact
support@techflow.io`,
    },
    {
      title: 'Rich Schema.org Markup',
      description: '15+ different schema types implemented',
      code: `{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "TechFlow Platform",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "99.00"
  }
}`,
    },
    {
      title: 'Optimized Meta Tags',
      description: 'Every page has unique, AI-friendly descriptions',
      code: `<meta name="description" content="TechFlow - Enterprise workflow automation...">
<meta name="ai-summary" content="TechFlow provides automated workflows...">
<meta name="robots" content="index, follow, max-snippet:-1">`,
    },
  ],
  llmsPreview: `# TechFlow AI Information

## Company Overview
TechFlow Inc is an enterprise automation platform that helps businesses streamline their operations through intelligent workflow automation.

## Products
- TechFlow Platform: Main automation suite
- TechFlow Analytics: AI-powered insights
- TechFlow Connect: Integration hub

## Key Features
- No-code workflow builder
- AI-powered recommendations
- Real-time analytics
- Enterprise security

## Pricing
Starting at $99/month for small teams
Enterprise pricing available on request

## Support
- Documentation: docs.techflow.io
- Email: support@techflow.io
- Phone: 1-800-TECHFLOW`,
  citationSources: [
    { engine: 'ChatGPT', citations: 145, trend: '+12%' },
    { engine: 'Claude', citations: 89, trend: '+8%' },
    { engine: 'Gemini', citations: 67, trend: '+15%' },
    { engine: 'Perplexity', citations: 56, trend: '+23%' },
  ],
  scoreHistory: [
    { date: 'Jan', score: 78 },
    { date: 'Feb', score: 82 },
    { date: 'Mar', score: 85 },
    { date: 'Apr', score: 88 },
    { date: 'May', score: 91 },
    { date: 'Jun', score: 94 },
  ],
};

export default function CompetitorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { success: showSuccess, info: showInfo } = useToast();
  const [copied, setCopied] = useState<string | null>(null);
  const [inWatchList, setInWatchList] = useState(false);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    showSuccess('Code copied!');
  };

  const handleImplement = (title: string) => {
    showInfo(`Implementing "${title}"...`);
    setTimeout(() => {
      router.push('/ai-optimization');
    }, 1000);
  };

  const toggleWatchList = () => {
    setInWatchList(!inWatchList);
    showSuccess(inWatchList ? 'Removed from watch list' : 'Added to watch list');
  };

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Competitors
      </button>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary/30">
            {competitorData.name?.charAt(0) || '?'}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{competitorData.name}</h1>
              {competitorData.usesConvitsa && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  <Sparkles className="w-4 h-4" />
                  Using Convitsa
                </span>
              )}
            </div>
            <a
              href={competitorData.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary flex items-center gap-1"
            >
              {competitorData.website}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={inWatchList ? 'secondary' : 'outline'}
            leftIcon={inWatchList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            onClick={toggleWatchList}
          >
            {inWatchList ? 'In Watch List' : 'Add to Watch List'}
          </Button>
          <Button leftIcon={<BarChart3 className="w-4 h-4" />}>
            Compare with My Site
          </Button>
        </div>
      </div>

      {/* Score Card */}
      <Card className="gradient-card border-primary/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">
              <svg className="circular-progress w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="circular-progress-bg"
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  strokeWidth="8"
                />
                <circle
                  className="circular-progress-fill"
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  strokeWidth="8"
                  strokeDasharray={`${competitorData.score * 2.83} 283`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-900">{competitorData.score}</span>
                <span className="text-gray-400">/100</span>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Visibility Score</h2>
              <p className="text-gray-500">Top 5% in their industry</p>
              <div className="flex items-center gap-2 mt-2 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+16 points in 6 months</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Your Score</p>
            <p className="text-3xl font-bold text-gray-900">67<span className="text-lg text-gray-400">/100</span></p>
            <p className="text-sm text-red-500 mt-1">27 points behind</p>
          </div>
        </div>
      </Card>

      {/* Score Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Score Breakdown</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={competitorData.scoreBreakdown}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#6C5DD3"
                  fill="#6C5DD3"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Score Categories */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Category Scores</h2>
          <div className="space-y-4">
            {competitorData.scoreBreakdown.map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  <span className="text-sm font-bold text-gray-900">{item.score}/100</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* What They're Doing Right */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Star className="w-6 h-6 text-amber-500" />
          What They&apos;re Doing Right
        </h2>
        
        <div className="space-y-6">
          {competitorData.strengths.map((strength, index) => (
            <div key={index} className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{strength.title}</h3>
                    <p className="text-sm text-gray-500">{strength.description}</p>
                  </div>
                  <Button
                    size="sm"
                    leftIcon={<Sparkles className="w-4 h-4" />}
                    onClick={() => handleImplement(strength.title)}
                  >
                    Implement This
                  </Button>
                </div>
              </div>
              <div className="relative">
                <pre className="p-4 bg-gray-900 text-gray-100 text-sm overflow-x-auto">
                  <code>{strength.code}</code>
                </pre>
                <button
                  onClick={() => copyCode(strength.code, `code-${index}`)}
                  className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {copied === `code-${index}` ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Content Analysis */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Their llms.txt Preview
          </h2>
          <Button variant="outline" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
            View Full File
          </Button>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-4 max-h-80 overflow-y-auto">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
            {competitorData.llmsPreview}
          </pre>
        </div>
      </Card>

      {/* Citation Sources */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Globe className="w-6 h-6 text-blue-500" />
          Where They&apos;re Being Cited
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {competitorData.citationSources.map((source) => (
            <div key={source.engine} className="p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-gray-900">{source.citations}</p>
              <p className="text-sm font-medium text-gray-700">{source.engine}</p>
              <p className="text-xs text-green-600 mt-1">{source.trend}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Score Timeline */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-green-500" />
          Score Timeline
        </h2>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={competitorData.scoreHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#6C5DD3"
                strokeWidth={3}
                dot={{ fill: '#6C5DD3', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <p className="text-sm text-gray-500 mt-4 text-center">
          Major optimizations implemented in March and May
        </p>
      </Card>
    </div>
  );
}


