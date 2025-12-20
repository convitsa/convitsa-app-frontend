'use client';

import React, { useState } from 'react';
import {
  Clock,
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Zap,
  FileText,
  Database,
  Settings,
  User,
  AlertTriangle,
  Calendar,
  RotateCcw,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/lib/store/hooks/useToast';

interface AuditEntry {
  id: string;
  type: 'optimization' | 'sync' | 'manual' | 'auto';
  action: string;
  description: string;
  user: string;
  timestamp: Date;
  details: {
    filesAffected: string[];
    changes: { before: string; after: string }[];
  };
}

const mockAuditEntries: AuditEntry[] = [
  {
    id: '1',
    type: 'optimization',
    action: 'AI Optimization',
    description: 'Optimized content and fixed 12 issues',
    user: 'John Doe',
    timestamp: new Date(Date.now() - 3600000),
    details: {
      filesAffected: ['llms.txt', 'about.md', 'services.md'],
      changes: [
        { before: 'No llms.txt file', after: 'Created llms.txt with 50 lines' },
        { before: 'Missing meta description', after: 'Added optimized meta description' },
      ],
    },
  },
  {
    id: '2',
    type: 'sync',
    action: 'Changes Synced',
    description: 'Synced all optimizations to production',
    user: 'System',
    timestamp: new Date(Date.now() - 7200000),
    details: {
      filesAffected: ['llms.txt', 'sitemap.xml', 'robots.txt'],
      changes: [
        { before: 'Pending changes', after: 'All changes deployed' },
      ],
    },
  },
  {
    id: '3',
    type: 'manual',
    action: 'Content Updated',
    description: 'Manually edited about.md file',
    user: 'Jane Smith',
    timestamp: new Date(Date.now() - 86400000),
    details: {
      filesAffected: ['about.md'],
      changes: [
        { before: 'Old company description', after: 'Updated company description with new services' },
      ],
    },
  },
  {
    id: '4',
    type: 'auto',
    action: 'Auto-Optimization',
    description: 'Scheduled optimization run completed',
    user: 'System',
    timestamp: new Date(Date.now() - 172800000),
    details: {
      filesAffected: ['schema.json', 'meta-tags.json'],
      changes: [
        { before: 'Outdated schema', after: 'Updated to Schema.org 2024 spec' },
      ],
    },
  },
  {
    id: '5',
    type: 'optimization',
    action: 'Structured Data Added',
    description: 'Implemented JSON-LD markup for products',
    user: 'John Doe',
    timestamp: new Date(Date.now() - 259200000),
    details: {
      filesAffected: ['products.json', 'organization.json'],
      changes: [
        { before: 'No product schema', after: 'Added Product schema for 15 items' },
      ],
    },
  },
];

const actionTypes = [
  { value: 'all', label: 'All Actions' },
  { value: 'optimization', label: 'Optimizations' },
  { value: 'sync', label: 'Syncs' },
  { value: 'manual', label: 'Manual Edits' },
  { value: 'auto', label: 'Auto Updates' },
];

export default function AuditHistoryPage() {
  const { success: showSuccess, info: showInfo } = useToast();
  const [entries] = useState<AuditEntry[]>(mockAuditEntries);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showRollbackModal, setShowRollbackModal] = useState(false);
  const [selectedRollback, setSelectedRollback] = useState<AuditEntry | null>(null);
  const [isRollingBack, setIsRollingBack] = useState(false);

  const getTypeIcon = (type: AuditEntry['type']) => {
    switch (type) {
      case 'optimization':
        return <Zap className="w-5 h-5 text-primary" />;
      case 'sync':
        return <RefreshCw className="w-5 h-5 text-green-500" />;
      case 'manual':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'auto':
        return <Settings className="w-5 h-5 text-amber-500" />;
    }
  };

  const getTypeColor = (type: AuditEntry['type']) => {
    switch (type) {
      case 'optimization':
        return 'bg-primary/10 border-primary/20';
      case 'sync':
        return 'bg-green-50 border-green-200';
      case 'manual':
        return 'bg-blue-50 border-blue-200';
      case 'auto':
        return 'bg-amber-50 border-amber-200';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hours ago`;
    if (days === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || entry.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleRollback = async () => {
    setIsRollingBack(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRollingBack(false);
    setShowRollbackModal(false);
    showSuccess('Changes rolled back successfully!');
  };

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit History</h1>
          <p className="text-gray-500 mt-1">Track all changes and optimizations</p>
        </div>
        <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
          Export Audit Log
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search audit logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Type Filter */}
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {actionTypes.find(t => t.value === selectedType)?.label}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          {showFilterDropdown && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
              {actionTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => {
                    setSelectedType(type.value);
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                    selectedType === type.value ? 'text-primary font-semibold' : 'text-gray-700'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Range */}
        <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Date Range</span>
        </button>
      </div>

      {/* Timeline */}
      <Card padding="none">
        <div className="divide-y divide-gray-100">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`p-3 rounded-xl border ${getTypeColor(entry.type)}`}>
                  {getTypeIcon(entry.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{entry.action}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{entry.description}</p>
                    </div>
                    <button
                      onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                    >
                      {expandedEntry === entry.id ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <User className="w-3 h-3" />
                      {entry.user}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {formatTimestamp(entry.timestamp)}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedEntry === entry.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-4 animate-fade-in">
                      {/* Files Affected */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Files Affected</p>
                        <div className="flex flex-wrap gap-2">
                          {entry.details.filesAffected.map((file) => (
                            <span key={file} className="px-2 py-1 bg-white rounded-lg text-xs text-gray-700 border border-gray-200">
                              {file}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Changes */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Changes</p>
                        <div className="space-y-2">
                          {entry.details.changes.map((change, index) => (
                            <div key={index} className="grid grid-cols-2 gap-4">
                              <div className="p-3 bg-red-50 rounded-lg">
                                <p className="text-xs text-red-600 font-medium mb-1">Before</p>
                                <p className="text-sm text-red-700">{change.before}</p>
                              </div>
                              <div className="p-3 bg-green-50 rounded-lg">
                                <p className="text-xs text-green-600 font-medium mb-1">After</p>
                                <p className="text-sm text-green-700">{change.after}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Rollback Button */}
                      <div className="pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<RotateCcw className="w-4 h-4" />}
                          onClick={() => {
                            setSelectedRollback(entry);
                            setShowRollbackModal(true);
                          }}
                        >
                          Rollback Changes
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No audit entries found</p>
          </div>
        )}
      </Card>

      {/* Rollback Modal */}
      <Modal
        isOpen={showRollbackModal}
        onClose={() => setShowRollbackModal(false)}
        title="Rollback Changes"
      >
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">Warning</span>
            </div>
            <p className="text-sm text-amber-600 mt-2">
              This will revert all changes made in this action. This operation cannot be undone.
            </p>
          </div>

          {selectedRollback && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="font-medium text-gray-900">{selectedRollback.action}</p>
              <p className="text-sm text-gray-500">{selectedRollback.description}</p>
              <p className="text-xs text-gray-400 mt-2">
                {formatTimestamp(selectedRollback.timestamp)} by {selectedRollback.user}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              className="flex-1"
              onClick={() => setShowRollbackModal(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-amber-500 hover:bg-amber-600"
              onClick={handleRollback}
              isLoading={isRollingBack}
            >
              Confirm Rollback
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


