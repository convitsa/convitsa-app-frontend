'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users,
  Eye,
  Clock,
  TrendingDown,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ExternalLink,
  X,
  Filter,
  Check,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import LiveIndicator from '@/components/ui/LiveIndicator';
import { useGetWebAnalyticsQuery, useGetLiveVisitorsQuery, LiveVisitorsData } from '@/lib/store/api/analyticsApi';
import { useAppSelector } from '@/lib/store/hooks';
import { selectCurrentDomainId, selectIsVerified } from '@/lib/store/slices/domainSlice';

// Filter types
interface ActiveFilters {
  page: string | null;
  referrer: string | null;
  country: string | null;
  device: string | null;
}

export default function WebAnalyticsPage() {
  const currentDomainId = useAppSelector(selectCurrentDomainId);
  const isVerified = useAppSelector(selectIsVerified);
  
  const [chartMetric, setChartMetric] = useState<'visitors' | 'pageViews'>('pageViews');
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    page: null,
    referrer: null,
    country: null,
    device: null,
  });
  
  // Pagination state
  const [pagesPage, setPagesPage] = useState(1);
  const [referrersPage, setReferrersPage] = useState(1);
  const [countriesPage, setCountriesPage] = useState(1);
  const [devicesPage, setDevicesPage] = useState(1);
  
  const itemsPerPage = 5;

  // Calculate date range (last 30 days)
  const dateRange = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  }, []);

  // API Query for analytics data
  const { 
    data: analyticsData, 
    isLoading, 
    isFetching,
    refetch 
  } = useGetWebAnalyticsQuery(
    { domainId: currentDomainId || undefined, ...dateRange },
    { skip: !isVerified || !currentDomainId }
  );

  // Live visitors polling (every 2 seconds)
  const {
    data: liveVisitorsData,
    isLoading: isLiveLoading,
    error: liveError,
    refetch: refetchLive,
  } = useGetLiveVisitorsQuery(currentDomainId || '', {
    skip: !isVerified || !currentDomainId,
    pollingInterval: 2000, // Poll every 2 seconds
    refetchOnMountOrArgChange: true,
  });

  // Track if live data is connected
  const isLiveConnected = !!liveVisitorsData && !liveError;

  // Extract data from API
  const webData = analyticsData?.data;
  const summary = webData?.summary || { totalPageViews: 0, uniqueVisitors: 0, pageViewsChange: 0, visitorsChange: 0 };
  const topPages = webData?.topPages || [];
  const topReferrers = webData?.topReferrers || [];
  const topCountries = webData?.topCountries || [];
  const devices = webData?.devices || {};
  const dailyData = webData?.dailyData || [];

  // Transform devices to array
  const devicesList = useMemo(() => {
    return Object.entries(devices).map(([device, count], index) => ({
      id: `device-${index}`,
      device,
      visitors: count as number,
    }));
  }, [devices]);

  // Transform chart data
  const chartData = useMemo(() => {
    return dailyData.map((d) => ({
      date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      pageViews: d.pageViews,
      visitors: Math.round(d.pageViews * 0.7), // Estimate visitors as ~70% of page views
    }));
  }, [dailyData]);
  
  // Paginated data
  const totalPagesPages = Math.ceil(topPages.length / itemsPerPage);
  const paginatedPages = topPages.slice((pagesPage - 1) * itemsPerPage, pagesPage * itemsPerPage);
  
  const totalReferrersPages = Math.ceil(topReferrers.length / itemsPerPage);
  const paginatedReferrers = topReferrers.slice((referrersPage - 1) * itemsPerPage, referrersPage * itemsPerPage);
  
  const totalCountriesPages = Math.ceil(topCountries.length / itemsPerPage);
  const paginatedCountries = topCountries.slice((countriesPage - 1) * itemsPerPage, countriesPage * itemsPerPage);
  
  const totalDevicesPages = Math.ceil(devicesList.length / itemsPerPage);
  const paginatedDevices = devicesList.slice((devicesPage - 1) * itemsPerPage, devicesPage * itemsPerPage);

  const deviceIcons: Record<string, React.ReactNode> = {
    Desktop: <Monitor className="w-4 h-4" />,
    Mobile: <Smartphone className="w-4 h-4" />,
    Tablet: <Tablet className="w-4 h-4" />,
    'Smart TV': <Monitor className="w-4 h-4" />,
    'Gaming Console': <Monitor className="w-4 h-4" />,
    Wearable: <Smartphone className="w-4 h-4" />,
  };

  const countryFlags: Record<string, string> = {
    US: '🇺🇸',
    GB: '🇬🇧',
    DE: '🇩🇪',
    CA: '🇨🇦',
    AU: '🇦🇺',
    FR: '🇫🇷',
    JP: '🇯🇵',
    IN: '🇮🇳',
  };

  // Toggle filter
  const toggleFilter = (type: keyof ActiveFilters, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: prev[type] === value ? null : value
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters({ page: null, referrer: null, country: null, device: null });
  };

  // Check if any filter is active
  const hasActiveFilters = Object.values(activeFilters).some(v => v !== null);

  // Get active filter count
  const activeFilterCount = Object.values(activeFilters).filter(v => v !== null).length;

  // Calculate filtered stats based on active filters
  const filteredStats = useMemo(() => {
    // Simple ratio-based filtering (in real app, this would be server-side)
    let ratio = 1;
    if (hasActiveFilters) {
      // Reduce by ~20% for each active filter
      ratio = Math.pow(0.8, activeFilterCount);
    }
    
    return {
      liveVisitors: liveVisitorsData?.count ?? 0, // Real live visitor count from polling
      totalVisitors: Math.round(summary.uniqueVisitors * ratio),
      pageViews: Math.round(summary.totalPageViews * ratio),
    };
  }, [summary, hasActiveFilters, activeFilterCount, liveVisitorsData]);

  // Show message if domain not verified
  if (!isVerified || !currentDomainId) {
    return (
      <div className="space-y-6 pt-12 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Web Analytics</h1>
          <p className="text-gray-500 mt-1">Monitor your website traffic and visitor behavior</p>
        </motion.div>
        
        <Card className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Domain Not Verified</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Please verify your domain by installing the tracking script to see web analytics.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Web Analytics</h1>
            <p className="text-gray-500 mt-1">Monitor your website traffic and visitor behavior</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => refetch()}
              className="p-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <motion.div animate={{ rotate: isFetching ? 360 : 0 }} transition={{ duration: 1, repeat: isFetching ? Infinity : 0, ease: 'linear' }}>
                <RefreshCw className="w-4 h-4 text-gray-500" />
              </motion.div>
            </motion.button>
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Active Filters Bar */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-center gap-2 text-primary">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">{activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active</span>
              </div>
              <div className="h-4 w-px bg-primary/20" />
              <div className="flex flex-wrap gap-2">
                {activeFilters.page && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-primary/30 rounded-full text-sm"
                  >
                    <Globe className="w-3.5 h-3.5 text-primary" />
                    <span className="text-gray-700">{activeFilters.page}</span>
                    <button
                      onClick={() => toggleFilter('page', activeFilters.page!)}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.span>
                )}
                {activeFilters.referrer && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-primary/30 rounded-full text-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-primary" />
                    <span className="text-gray-700">{activeFilters.referrer}</span>
                    <button
                      onClick={() => toggleFilter('referrer', activeFilters.referrer!)}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.span>
                )}
                {activeFilters.country && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-primary/30 rounded-full text-sm"
                  >
                    <span className="text-base">{countryFlags[activeFilters.country] || '🌍'}</span>
                    <span className="text-gray-700">{activeFilters.country}</span>
                    <button
                      onClick={() => toggleFilter('country', activeFilters.country!)}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.span>
                )}
                {activeFilters.device && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-primary/30 rounded-full text-sm"
                  >
                    <span className="text-primary">{deviceIcons[activeFilters.device]}</span>
                    <span className="text-gray-700">{activeFilters.device}</span>
                    <button
                      onClick={() => toggleFilter('device', activeFilters.device!)}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden">
            {/* Connection Status Indicator */}
            <div className="absolute top-3 right-3">
              {isLiveConnected ? (
                <div className="flex items-center gap-1.5 text-green-600">
                  <Wifi className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Live</span>
                </div>
              ) : liveError ? (
                <button
                  onClick={() => refetchLive()}
                  className="flex items-center gap-1.5 text-red-400 hover:text-red-600 transition-colors"
                  title="Click to retry"
                >
                  <WifiOff className="w-3.5 h-3.5" />
                  <span className="text-xs">Error</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="text-xs">Connecting...</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Live Visitors</span>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {filteredStats.liveVisitors}
              </span>
              {isLiveConnected && (
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-green-500"
                />
              )}
            </div>
            
            {/* Live visitor breakdown by page */}
            {liveVisitorsData && liveVisitorsData.byPage.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500 mb-1.5">Active on</div>
                <div className="space-y-1">
                  {liveVisitorsData.byPage.slice(0, 3).map((item) => (
                    <div key={item.page} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 truncate flex-1">{item.page}</span>
                      <span className="text-gray-900 font-medium ml-2">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Total Visitors"
            value={isLoading ? '...' : filteredStats.totalVisitors.toLocaleString()}
            icon={Users}
            trend={{ value: Math.abs(summary.visitorsChange), isPositive: summary.visitorsChange >= 0 }}
            variant="default"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Page Views"
            value={isLoading ? '...' : filteredStats.pageViews.toLocaleString()}
            icon={Eye}
            trend={{ value: Math.abs(summary.pageViewsChange), isPositive: summary.pageViewsChange >= 0 }}
            variant="default"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="Avg. Views/Visitor"
            value={isLoading ? '...' : (summary.uniqueVisitors > 0 ? (summary.totalPageViews / summary.uniqueVisitors).toFixed(1) : '0')}
            icon={Clock}
            trend={{ value: 0, isPositive: true }}
            variant="default"
          />
        </motion.div>
      </div>

      {/* Live Visitor Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-gray-900">Live Visitor Activity</h3>
            </div>
            <LiveIndicator count={filteredStats.liveVisitors} label="online now" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Live Pages */}
            <div className="p-4 rounded-xl bg-gray-50">
              <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-green-500" />
                Active Pages
                {isLiveConnected && <span className="text-xs text-green-500">(Live)</span>}
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {isLiveLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  </div>
                ) : !liveVisitorsData || liveVisitorsData.byPage.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    {isLiveConnected ? 'No visitors online' : 'Connecting...'}
                  </div>
                ) : (
                  liveVisitorsData.byPage.map((item, index) => (
                    <motion.div
                      key={item.page}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-sm text-gray-700 truncate flex-1">{item.page}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 ml-2">
                        {item.count}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Live Countries */}
            <div className="p-4 rounded-xl bg-gray-50">
              <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                🌍 Countries
                {isLiveConnected && <span className="text-xs text-green-500">(Live)</span>}
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {isLiveLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  </div>
                ) : !liveVisitorsData || liveVisitorsData.byCountry.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    {isLiveConnected ? 'No visitors online' : 'Connecting...'}
                  </div>
                ) : (
                  liveVisitorsData.byCountry.map((item, index) => (
                    <motion.div
                      key={item.country}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-sm text-gray-700">{item.country}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        {item.count}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Live Devices */}
            <div className="p-4 rounded-xl bg-gray-50">
              <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-purple-500" />
                Devices
                {isLiveConnected && <span className="text-xs text-green-500">(Live)</span>}
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {isLiveLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  </div>
                ) : !liveVisitorsData || liveVisitorsData.byDevice.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    {isLiveConnected ? 'No visitors online' : 'Connecting...'}
                  </div>
                ) : (
                  liveVisitorsData.byDevice.map((item, index) => (
                    <motion.div
                      key={item.device}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        {item.device === 'Mobile' ? (
                          <Smartphone className="w-4 h-4 text-gray-400" />
                        ) : item.device === 'Tablet' ? (
                          <Tablet className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Monitor className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-700">{item.device}</span>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                        {item.count}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Individual Visitors */}
            <div className="p-4 rounded-xl bg-gray-50">
              <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-500" />
                Recent Activity
                {isLiveConnected && <span className="text-xs text-green-500">(Live)</span>}
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {isLiveLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  </div>
                ) : !liveVisitorsData || liveVisitorsData.visitors.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    {isLiveConnected ? 'No visitors online' : 'Connecting...'}
                  </div>
                ) : (
                  liveVisitorsData.visitors.slice(0, 5).map((visitor, index) => (
                    <motion.div
                      key={visitor.visitorId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 truncate">{visitor.page}</span>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">{visitor.country || 'Unknown'}</span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Analytics Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Traffic Overview</h3>
            <div className="flex gap-2">
              {(['pageViews', 'visitors'] as const).map((metric) => (
                <button
                  key={metric}
                  onClick={() => setChartMetric(metric)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    chartMetric === metric
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {metric === 'visitors' ? 'Visitors' : 'Page Views'}
                </button>
              ))}
            </div>
          </div>
          <div className="h-80">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                No traffic data available yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={chartMetric}
                    stroke="#6C5DD3"
                    strokeWidth={2}
                    dot={{ fill: '#6C5DD3', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Bottom Stats Grid - 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="h-full"
        >
          <Card className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Top Pages</h4>
              {activeFilters.page && (
                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">Filtered</span>
              )}
            </div>
            <div className="flex-1 space-y-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                </div>
              ) : paginatedPages.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">No page data yet</div>
              ) : (
                paginatedPages.map((page) => {
                  const isActive = activeFilters.page === page.path;
                  return (
                    <motion.button
                      key={page.path}
                      onClick={() => toggleFilter('page', page.path)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-primary/10 border-primary/30 shadow-sm'
                          : 'bg-transparent border-transparent hover:bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {isActive && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                        <Globe className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                        <span className={`text-sm truncate ${isActive ? 'text-primary font-medium' : 'text-gray-700'}`}>{page.path}</span>
                      </div>
                      <span className={`text-sm font-medium ml-4 flex-shrink-0 ${isActive ? 'text-primary' : 'text-gray-900'}`}>
                        {page.views.toLocaleString()}
                      </span>
                    </motion.button>
                  );
                })
              )}
            </div>
            {/* Pagination */}
            {totalPagesPages > 1 && (
              <div className="flex items-center justify-start gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setPagesPage(Math.max(1, pagesPage - 1))}
                  disabled={pagesPage === 1}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPagesPage(Math.min(totalPagesPages, pagesPage + 1))}
                  disabled={pagesPage === totalPagesPages}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-500 ml-2">Page {pagesPage} of {totalPagesPages}+</span>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Referrers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="h-full"
        >
          <Card className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Top Referrers</h4>
              {activeFilters.referrer && (
                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">Filtered</span>
              )}
            </div>
            <div className="flex-1 space-y-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                </div>
              ) : paginatedReferrers.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">No referrer data yet</div>
              ) : (
                paginatedReferrers.map((referrer) => {
                  const isActive = activeFilters.referrer === referrer.domain;
                  return (
                    <motion.button
                      key={referrer.domain}
                      onClick={() => toggleFilter('referrer', referrer.domain)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-primary/10 border-primary/30 shadow-sm'
                          : 'bg-transparent border-transparent hover:bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {isActive && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                        <ExternalLink className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                        <span className={`text-sm truncate ${isActive ? 'text-primary font-medium' : 'text-gray-700'}`}>{referrer.domain}</span>
                      </div>
                      <span className={`text-sm font-medium ml-4 flex-shrink-0 ${isActive ? 'text-primary' : 'text-gray-900'}`}>
                        {referrer.visits.toLocaleString()}
                      </span>
                    </motion.button>
                  );
                })
              )}
            </div>
            {/* Pagination */}
            {totalReferrersPages > 1 && (
              <div className="flex items-center justify-start gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setReferrersPage(Math.max(1, referrersPage - 1))}
                  disabled={referrersPage === 1}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setReferrersPage(Math.min(totalReferrersPages, referrersPage + 1))}
                  disabled={referrersPage === totalReferrersPages}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-500 ml-2">Page {referrersPage} of {totalReferrersPages}+</span>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Countries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="h-full"
        >
          <Card className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Top Countries</h4>
              {activeFilters.country && (
                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">Filtered</span>
              )}
            </div>
            <div className="flex-1 space-y-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                </div>
              ) : paginatedCountries.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">No country data yet</div>
              ) : (
                paginatedCountries.map((country) => {
                  const isActive = activeFilters.country === country.country;
                  // Get flag emoji from country name
                  const flagEmoji = countryFlags[country.country] || '🌍';
                  return (
                    <motion.button
                      key={country.country}
                      onClick={() => toggleFilter('country', country.country)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-primary/10 border-primary/30 shadow-sm'
                          : 'bg-transparent border-transparent hover:bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isActive && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                        <span className="text-lg">{flagEmoji}</span>
                        <span className={`text-sm ${isActive ? 'text-primary font-medium' : 'text-gray-700'}`}>{country.country}</span>
                      </div>
                      <span className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-gray-900'}`}>
                        {country.visits.toLocaleString()}
                      </span>
                    </motion.button>
                  );
                })
              )}
            </div>
            {/* Pagination */}
            {totalCountriesPages > 1 && (
              <div className="flex items-center justify-start gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setCountriesPage(Math.max(1, countriesPage - 1))}
                  disabled={countriesPage === 1}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCountriesPage(Math.min(totalCountriesPages, countriesPage + 1))}
                  disabled={countriesPage === totalCountriesPages}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-500 ml-2">Page {countriesPage} of {totalCountriesPages}+</span>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Devices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="h-full"
        >
          <Card className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Devices</h4>
              {activeFilters.device && (
                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">Filtered</span>
              )}
            </div>
            <div className="flex-1 space-y-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                </div>
              ) : paginatedDevices.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">No device data yet</div>
              ) : (
                paginatedDevices.map((device) => {
                  const isActive = activeFilters.device === device.device;
                  return (
                    <motion.button
                      key={device.id}
                      onClick={() => toggleFilter('device', device.device)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-primary/10 border-primary/30 shadow-sm'
                          : 'bg-transparent border-transparent hover:bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isActive && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                        <span className={isActive ? 'text-primary' : 'text-gray-400'}>{deviceIcons[device.device] || <Monitor className="w-4 h-4" />}</span>
                        <span className={`text-sm ${isActive ? 'text-primary font-medium' : 'text-gray-700'}`}>{device.device}</span>
                      </div>
                      <span className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-gray-900'}`}>
                        {device.visitors.toLocaleString()}
                      </span>
                    </motion.button>
                  );
                })
              )}
            </div>
            {/* Pagination */}
            {totalDevicesPages > 1 && (
              <div className="flex items-center justify-start gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setDevicesPage(Math.max(1, devicesPage - 1))}
                  disabled={devicesPage === 1}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDevicesPage(Math.min(totalDevicesPages, devicesPage + 1))}
                  disabled={devicesPage === totalDevicesPages}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-500 ml-2">Page {devicesPage} of {totalDevicesPages}+</span>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

