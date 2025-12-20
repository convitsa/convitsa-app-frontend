'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  Zap,
  Download,
  Calendar,
  ChevronDown,
  FileText,
  Table,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Mock data for charts
const scoreData = [
  { date: 'Jan 1', yourScore: 45, competitor1: 72, competitor2: 68, competitor3: 55 },
  { date: 'Jan 8', yourScore: 48, competitor1: 73, competitor2: 70, competitor3: 56 },
  { date: 'Jan 15', yourScore: 52, competitor1: 74, competitor2: 71, competitor3: 58 },
  { date: 'Jan 22', yourScore: 55, competitor1: 75, competitor2: 72, competitor3: 59 },
  { date: 'Feb 1', yourScore: 58, competitor1: 76, competitor2: 73, competitor3: 60 },
  { date: 'Feb 8', yourScore: 62, competitor1: 77, competitor2: 74, competitor3: 62 },
  { date: 'Feb 15', yourScore: 65, competitor1: 78, competitor2: 74, competitor3: 63 },
  { date: 'Feb 22', yourScore: 67, competitor1: 79, competitor2: 75, competitor3: 64 },
  { date: 'Mar 1', yourScore: 71, competitor1: 80, competitor2: 76, competitor3: 65 },
  { date: 'Mar 8', yourScore: 74, competitor1: 81, competitor2: 76, competitor3: 66 },
  { date: 'Mar 15', yourScore: 78, competitor1: 82, competitor2: 77, competitor3: 67 },
  { date: 'Mar 22', yourScore: 82, competitor1: 83, competitor2: 78, competitor3: 68 },
];

const impactData = [
  { optimization: 'llms.txt Implementation', before: 45, after: 62, impact: '+17' },
  { optimization: 'Structured Data', before: 62, after: 74, impact: '+12' },
  { optimization: 'Content Optimization', before: 74, after: 82, impact: '+8' },
  { optimization: 'Metadata Enhancement', before: 50, after: 55, impact: '+5' },
  { optimization: 'XML Sitemap Update', before: 55, after: 58, impact: '+3' },
];

const timePeriods = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'All time', value: 'all' },
];

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const currentScore = 82;
  const scoreChange = 12;
  const rankingPosition = 23;
  const totalOptimizations = 47;

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Visibility Analytics</h1>
          <p className="text-gray-500 mt-1">Track your performance and compare with competitors</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Period Selector */}
          <div className="relative">
            <button
              onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {timePeriods.find(p => p.value === selectedPeriod)?.label}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showPeriodDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                {timePeriods.map((period) => (
                  <button
                    key={period.value}
                    onClick={() => {
                      setSelectedPeriod(period.value);
                      setShowPeriodDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                      selectedPeriod === period.value ? 'text-primary font-semibold' : 'text-gray-700'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Button */}
          <div className="relative">
            <Button
              variant="outline"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => setShowExportDropdown(!showExportDropdown)}
            >
              Export Report
            </Button>
            {showExportDropdown && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Export as PDF
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Table className="w-4 h-4" />
                  Export as CSV
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover gradient>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Current Score</p>
              <p className="text-3xl font-bold text-gray-900">{currentScore}<span className="text-lg text-gray-400">/100</span></p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10">
              <Target className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+{scoreChange} this month</span>
          </div>
        </Card>

        <Card hover gradient>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Score Change</p>
              <p className="text-3xl font-bold text-green-600">+{scoreChange}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-100">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">Compared to last month</p>
        </Card>

        <Card hover gradient>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Ranking Position</p>
              <p className="text-3xl font-bold text-gray-900">#{rankingPosition}</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-100">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">In your industry</p>
        </Card>

        <Card hover gradient>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Optimizations</p>
              <p className="text-3xl font-bold text-gray-900">{totalOptimizations}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-100">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">Completed to date</p>
        </Card>
      </div>

      {/* Main Score Chart */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI Visibility Score Over Time</h2>
            <p className="text-sm text-gray-500">Compare your progress with competitors</p>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="yourScore"
                name="Your Score"
                stroke="#6C5DD3"
                strokeWidth={3}
                dot={{ fill: '#6C5DD3', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#6C5DD3' }}
              />
              <Line
                type="monotone"
                dataKey="competitor1"
                name="TechFlow Inc"
                stroke="#22C55E"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="competitor2"
                name="DataPulse"
                stroke="#F59E0B"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="competitor3"
                name="CloudMind"
                stroke="#3B82F6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Score Growth Area Chart */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Score Growth</h2>
            <p className="text-sm text-gray-500">Your AI visibility improvement over time</p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={scoreData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C5DD3" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6C5DD3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="yourScore"
                name="Your Score"
                stroke="#6C5DD3"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorScore)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Impact Analysis */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Impact Analysis</h2>
            <p className="text-sm text-gray-500">Which optimizations improved your score the most</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Optimization</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Before</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">After</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Impact</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Progress</th>
              </tr>
            </thead>
            <tbody>
              {impactData.map((item, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{item.optimization}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm text-gray-500">{item.before}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm font-semibold text-gray-900">{item.after}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      {item.impact}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
                          style={{ width: `${item.after}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8">{item.after}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}


